import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getServiceSupabase } from "@/lib/supabase/service";
import { WHOLARA_SYSTEM_PROMPT } from "@/lib/chat/wholara-system-prompt";

export const runtime = "nodejs";

const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-6";

const SIMPLE_MODE_INSTRUCTIONS =
  "Response style — SIMPLE MODE: Give practical, warm, easy-to-understand answers. Use plain language, avoid technical jargon, and focus on actionable steps the user can take today. Keep responses concise — 3-5 sentences or a short bullet list. Lead with what to do, not why.";

const DEEP_MODE_INSTRUCTIONS =
  "Response style — DEEP DIVE MODE: Give thorough, scientifically detailed answers. Explain the mechanisms, the root causes, and the science behind your recommendations. Include specific nutrients, neurotransmitters, pathways, or hormones involved. Users in this mode want to understand their body deeply.";

const FOLLOWUPS_DIRECTIVE = `After your response, end with a block of 2-3 suggested follow-up questions in this exact format:

<followups>
["First follow-up question?", "Second follow-up question?", "Third follow-up question?"]
</followups>

The follow-ups must be a valid JSON array of 2-3 strings, specific to the user's situation. Never reference the tags or JSON in your prose.`;

type ResponseMode = "simple" | "deep";

type ChatMessageRow = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

function extractText(message: Anthropic.Messages.Message): string {
  return message.content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

export async function POST(req: Request) {
  let body: { conversationId?: unknown; mode?: unknown };
  try {
    body = (await req.json()) as { conversationId?: unknown; mode?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // wholara_conversations.id is int4 in this Supabase schema, so the
  // client may send conversationId as a JS number after the first response.
  const rawConvId = body.conversationId;
  const conversationId =
    typeof rawConvId === "string"
      ? rawConvId
      : typeof rawConvId === "number" && Number.isFinite(rawConvId)
        ? String(rawConvId)
        : "";
  const mode: ResponseMode = body.mode === "deep" ? "deep" : "simple";

  if (!conversationId) {
    return NextResponse.json(
      { error: "conversationId is required" },
      { status: 400 },
    );
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!anthropicKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not set in .env.local" },
      { status: 503 },
    );
  }

  let supabase: ReturnType<typeof getServiceSupabase>;
  try {
    supabase = getServiceSupabase();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Supabase misconfigured";
    return NextResponse.json({ error: msg }, { status: 503 });
  }

  const { data: existing } = await supabase
    .from("wholara_conversations")
    .select("id")
    .eq("id", conversationId)
    .maybeSingle();
  if (!existing) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 },
    );
  }

  const { data: historyRows, error: histErr } = await supabase
    .from("wholara_messages")
    .select("id, conversation_id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (histErr || !historyRows) {
    return NextResponse.json(
      { error: histErr?.message ?? "Could not load history" },
      { status: 500 },
    );
  }

  const history = historyRows as ChatMessageRow[];
  if (history.length === 0) {
    return NextResponse.json(
      { error: "No messages to regenerate" },
      { status: 400 },
    );
  }
  const last = history[history.length - 1];
  if (last.role !== "assistant") {
    return NextResponse.json(
      { error: "Last message must be an assistant message" },
      { status: 400 },
    );
  }

  const priorHistory = history.slice(0, -1);
  if (
    priorHistory.length === 0 ||
    priorHistory[priorHistory.length - 1].role !== "user"
  ) {
    return NextResponse.json(
      { error: "Cannot regenerate without a preceding user message" },
      { status: 400 },
    );
  }

  const anthropicMessages: Anthropic.Messages.MessageParam[] = priorHistory.map(
    (m) => ({ role: m.role, content: m.content }),
  );

  const modeLabel = mode === "deep" ? "Deep Dive" : "Simple";
  const modeInstructions =
    mode === "deep" ? DEEP_MODE_INSTRUCTIONS : SIMPLE_MODE_INSTRUCTIONS;
  const regenerateDirective = `The user wants this same answer but in ${modeLabel} mode. Regenerate your last response in that style using the context already provided. Do not ask any follow up questions.`;

  const systemPrompt = `${WHOLARA_SYSTEM_PROMPT}\n\n${modeInstructions}\n\n${regenerateDirective}\n\n${FOLLOWUPS_DIRECTIVE}`;

  const client = new Anthropic({ apiKey: anthropicKey });
  const model = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_ANTHROPIC_MODEL;

  let assistantText = "";
  try {
    const claudeRes = await client.messages.create({
      model,
      max_tokens: 8192,
      system: systemPrompt,
      messages: anthropicMessages,
    });
    assistantText = extractText(claudeRes);
  } catch (e) {
    console.error("[api/ask/regenerate] Anthropic error", e);
    let detail = e instanceof Error ? e.message : "Claude request failed";
    if (typeof e === "object" && e !== null && "error" in e) {
      const inner = (e as { error?: { message?: string } }).error;
      if (inner?.message) detail = inner.message;
    }
    return NextResponse.json(
      { error: `Claude API: ${detail}` },
      { status: 502 },
    );
  }

  if (!assistantText) {
    return NextResponse.json(
      { error: "Empty response from model" },
      { status: 502 },
    );
  }

  const { error: delErr } = await supabase
    .from("wholara_messages")
    .delete()
    .eq("id", last.id);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }

  const { error: insErr } = await supabase.from("wholara_messages").insert({
    conversation_id: conversationId,
    role: "assistant",
    content: assistantText,
  });
  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  const { data: finalRows, error: finErr } = await supabase
    .from("wholara_messages")
    .select("id, conversation_id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (finErr || !finalRows) {
    return NextResponse.json(
      { error: finErr?.message ?? "Could not reload messages" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    conversationId,
    messages: finalRows as ChatMessageRow[],
  });
}
