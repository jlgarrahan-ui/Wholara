import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getServiceSupabase } from "@/lib/supabase/service";
import { WHOLARA_SYSTEM_PROMPT } from "@/lib/chat/wholara-system-prompt";

export const runtime = "nodejs";

/** Default when ANTHROPIC_MODEL is unset (3.5 Sonnet snapshots are retired). */
const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-6";

function formatUnknownError(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "object" && e !== null && "message" in e) {
    const m = (e as { message: unknown }).message;
    if (typeof m === "string") return m;
  }
  return "Unexpected server error";
}

type ChatMessageRow = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

function extractAnthropicText(
  message: Anthropic.Messages.Message,
): string {
  return message.content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

export async function POST(req: Request) {
  const raw = await req.text();
  const proxyUrl = process.env.SUPABASE_CHAT_FUNCTION_URL?.trim();
  if (proxyUrl) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const bearer =
      process.env.SUPABASE_CHAT_FUNCTION_BEARER?.trim() ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    if (bearer) {
      headers.Authorization = `Bearer ${bearer}`;
      headers.apikey = bearer;
    }
    const proxied = await fetch(proxyUrl, { method: "POST", headers, body: raw });
    const out = await proxied.text();
    return new NextResponse(out, {
      status: proxied.status,
      headers: {
        "Content-Type":
          proxied.headers.get("content-type") ?? "application/json",
      },
    });
  }

  let body: { message?: unknown; conversationId?: unknown };
  try {
    body = JSON.parse(raw) as { message?: unknown; conversationId?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message =
    typeof body.message === "string" ? body.message.trim() : "";
  const conversationId =
    typeof body.conversationId === "string" ? body.conversationId : null;

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  let supabase: ReturnType<typeof getServiceSupabase>;
  try {
    supabase = getServiceSupabase();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Supabase misconfigured";
    return NextResponse.json({ error: msg }, { status: 503 });
  }

  const edgeName = process.env.SUPABASE_CLAUDE_FUNCTION?.trim();
  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!edgeName && !anthropicKey) {
    return NextResponse.json(
      {
        error:
          "Set ANTHROPIC_API_KEY for Claude in Next.js, or SUPABASE_CLAUDE_FUNCTION to call your Edge Function, or SUPABASE_CHAT_FUNCTION_URL to proxy the whole request.",
      },
      { status: 503 },
    );
  }

  let convId = conversationId;
  if (convId) {
    const { data: existing, error: checkErr } = await supabase
      .from("wholara_conversations")
      .select("id")
      .eq("id", convId)
      .maybeSingle();
    if (checkErr || !existing) {
      convId = null;
    }
  }

  if (!convId) {
    const { data: created, error: cErr } = await supabase
      .from("wholara_conversations")
      .insert({})
      .select("id")
      .single();
    if (cErr || !created) {
      return NextResponse.json(
        { error: cErr?.message ?? "Could not create conversation" },
        { status: 500 },
      );
    }
    convId = created.id as string;
  }

  const { error: insUserErr } = await supabase.from("wholara_messages").insert({
    conversation_id: convId,
    role: "user",
    content: message,
  });
  if (insUserErr) {
    return NextResponse.json(
      { error: insUserErr.message },
      { status: 500 },
    );
  }

  const { data: historyRows, error: histErr } = await supabase
    .from("wholara_messages")
    .select("id, conversation_id, role, content, created_at")
    .eq("conversation_id", convId)
    .order("created_at", { ascending: true });
  if (histErr || !historyRows) {
    return NextResponse.json(
      { error: histErr?.message ?? "Could not load history" },
      { status: 500 },
    );
  }

  const history = historyRows as ChatMessageRow[];
  const anthropicMessages = history.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  let assistantText: string;

  if (edgeName) {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    if (!base || !anon) {
      return NextResponse.json(
        {
          error:
            "SUPABASE_CLAUDE_FUNCTION requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
        },
        { status: 503 },
      );
    }
    const fnUrl = `${base}/functions/v1/${edgeName}`;
    const edgeRes = await fetch(fnUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anon}`,
        apikey: anon,
      },
      body: JSON.stringify({
        conversationId: convId,
        message,
        messages: anthropicMessages,
      }),
    });
    const edgeJson: unknown = await edgeRes.json().catch(() => null);
    if (!edgeRes.ok) {
      const errMsg =
        edgeJson &&
        typeof edgeJson === "object" &&
        "error" in edgeJson &&
        typeof (edgeJson as { error: unknown }).error === "string"
          ? (edgeJson as { error: string }).error
          : `Edge function error (${edgeRes.status})`;
      return NextResponse.json({ error: errMsg }, { status: 502 });
    }
    if (
      edgeJson &&
      typeof edgeJson === "object" &&
      "reply" in edgeJson &&
      typeof (edgeJson as { reply: unknown }).reply === "string"
    ) {
      assistantText = (edgeJson as { reply: string }).reply.trim();
    } else {
      return NextResponse.json(
        {
          error:
            "Edge function JSON must include a string `reply` field (or use ANTHROPIC_API_KEY instead).",
        },
        { status: 502 },
      );
    }
  } else {
    const model =
      process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_ANTHROPIC_MODEL;
    try {
      const client = new Anthropic({ apiKey: anthropicKey });
      const claudeRes = await client.messages.create({
        model,
        max_tokens: 2048,
        system: WHOLARA_SYSTEM_PROMPT,
        messages: anthropicMessages,
      });
      assistantText = extractAnthropicText(claudeRes);
      if (!assistantText) {
        assistantText =
          "I could not generate a reply just now. Please try again in a moment.";
      }
    } catch (e) {
      console.error("[api/ask] Anthropic error", e);
      let detail = formatUnknownError(e);
      if (typeof e === "object" && e !== null && "error" in e) {
        const inner = (e as { error?: { message?: string } }).error;
        if (inner?.message) detail = inner.message;
      }
      return NextResponse.json(
        {
          error: `Claude API: ${detail}. Check ANTHROPIC_API_KEY and ANTHROPIC_MODEL in .env.local.`,
        },
        { status: 502 },
      );
    }
  }

  const { error: insAsstErr } = await supabase.from("wholara_messages").insert({
    conversation_id: convId,
    role: "assistant",
    content: assistantText,
  });
  if (insAsstErr) {
    return NextResponse.json(
      { error: insAsstErr.message },
      { status: 500 },
    );
  }

  const { data: finalRows, error: finErr } = await supabase
    .from("wholara_messages")
    .select("id, conversation_id, role, content, created_at")
    .eq("conversation_id", convId)
    .order("created_at", { ascending: true });
  if (finErr || !finalRows) {
    return NextResponse.json(
      { error: finErr?.message ?? "Could not reload messages" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    conversationId: convId,
    messages: finalRows as ChatMessageRow[],
  });
}
