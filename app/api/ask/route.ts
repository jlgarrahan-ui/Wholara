import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getServiceSupabase } from "@/lib/supabase/service";
import {
  WHOLARA_SYSTEM_PROMPT,
  WHOLARA_INTAKE_INSTRUCTIONS,
} from "@/lib/chat/wholara-system-prompt";

export const runtime = "nodejs";

const DEFAULT_ANTHROPIC_MODEL = "claude-opus-4-5";
const MATCH_COUNT = 20;
const MATCH_THRESHOLD = 0.45;
const MAX_TOOL_TURNS = 4;
const MAX_OUTPUT_TOKENS = 8192;

const SIMPLE_MODE_INSTRUCTIONS =
  "Response style — SIMPLE MODE: Give practical, warm, easy-to-understand answers. Use plain language, avoid technical jargon, and focus on actionable steps the user can take today. Keep responses concise — 3-5 sentences or a short bullet list. Lead with what to do, not why.";

const DEEP_MODE_INSTRUCTIONS =
  "Response style — DEEP DIVE MODE: Give thorough, scientifically detailed answers. Explain the mechanisms, the root causes, and the science behind your recommendations. Include specific nutrients, neurotransmitters, pathways, or hormones involved. Users in this mode want to understand their body deeply.";

type ResponseMode = "simple" | "deep";

type ChatMessageRow = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

type DocumentMatch = {
  id?: number;
  filename?: string;
  chunk_index?: number;
  content: string;
  similarity?: number;
};

const SEARCH_TOOL: Anthropic.Messages.Tool = {
  name: "search_knowledge_base",
  description:
    "Search Wholara's nutrition knowledge base for evidence-based content relevant to the user's situation. Only call this AFTER you have gathered enough intake context (typically 2-3 user exchanges covering medications, stress, sleep, digestion, energy, diet, and other relevant factors). Build the query from everything the user has shared so far — symptoms, context, suspected root causes, and relevant body systems. The richer and more specific the query, the better the retrieved content.",
  input_schema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description:
          "A detailed, specific search query built from the user's full description. Include symptoms, context, and suspected root causes.",
      },
    },
    required: ["query"],
  },
};

function extractText(message: Anthropic.Messages.Message): string {
  return message.content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

function findToolUse(
  message: Anthropic.Messages.Message,
): Anthropic.Messages.ToolUseBlock | null {
  for (const block of message.content) {
    if (block.type === "tool_use") return block;
  }
  return null;
}

async function embedQuery(text: string, apiKey: string): Promise<number[]> {
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: [text],
      model: "voyage-3",
      input_type: "query",
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Voyage embeddings failed (${res.status}): ${detail.slice(0, 300)}`,
    );
  }
  const json = (await res.json()) as {
    data?: Array<{ embedding?: number[] }>;
  };
  const vec = json.data?.[0]?.embedding;
  if (!Array.isArray(vec) || vec.length !== 1024) {
    throw new Error(
      `Voyage returned an embedding of length ${vec?.length ?? "n/a"} (expected 1024).`,
    );
  }
  return vec;
}

async function searchKnowledgeBase(
  query: string,
  supabase: ReturnType<typeof getServiceSupabase>,
  voyageKey: string,
): Promise<{ matches: DocumentMatch[]; contextBlock: string }> {
  const embedding = await embedQuery(query, voyageKey);
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: MATCH_THRESHOLD,
    match_count: MATCH_COUNT,
  });
  if (error) {
    throw new Error(`match_documents: ${error.message}`);
  }
  const matches: DocumentMatch[] = Array.isArray(data)
    ? (data as DocumentMatch[])
    : [];

  if (matches.length === 0) {
    return {
      matches,
      contextBlock:
        "No matching content was retrieved from the knowledge base. Do NOT answer from general training knowledge. Tell the user: I don't have enough information in my knowledge base to answer that specifically — I'd recommend speaking with a qualified nutrition therapist. Do not fabricate or supplement an answer.",
    };
  }

  const contextBlock = matches
    .map((m, i) => {
      const head =
        m.filename != null
          ? `Source ${i + 1} — ${m.filename}${m.chunk_index != null ? ` (chunk ${m.chunk_index})` : ""}`
          : `Source ${i + 1}`;
      const sim =
        typeof m.similarity === "number"
          ? ` · similarity ${m.similarity.toFixed(3)}`
          : "";
      return `[${head}${sim}]\n${m.content}`;
    })
    .join("\n\n---\n\n");

  return { matches, contextBlock };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");
  if (!conversationId) {
    return NextResponse.json(
      { error: "conversationId is required" },
      { status: 400 },
    );
  }
  // Guard the bigint column from invalid client input (e.g. stale UUIDs).
  if (!/^\d+$/.test(conversationId)) {
    return NextResponse.json({ conversationId: null, messages: [] });
  }

  let supabase: ReturnType<typeof getServiceSupabase>;
  try {
    supabase = getServiceSupabase();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Supabase misconfigured";
    return NextResponse.json({ error: msg }, { status: 503 });
  }

  console.log("[api/ask GET] hydration requested for", conversationId);

  const { data, error } = await supabase
    .from("wholara_messages")
    .select("id, conversation_id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[api/ask GET] messages load error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const messages = (data ?? []) as ChatMessageRow[];
  console.log("[api/ask GET] returning", {
    conversationId,
    messageCount: messages.length,
  });

  return NextResponse.json({ conversationId, messages });
}

export async function POST(req: Request) {
  let body: {
    message?: unknown;
    conversationId?: unknown;
    mode?: unknown;
  };
  try {
    body = (await req.json()) as {
      message?: unknown;
      conversationId?: unknown;
      mode?: unknown;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  // wholara_conversations.id is bigint. Only accept a positive-integer string
  // (or finite integer number) from the client; anything else — most often a
  // UUID left in localStorage from an older schema — is discarded so we fall
  // through to creating a fresh conversation rather than crashing on
  // bigint parsing in the lookup below.
  const rawConvId = body.conversationId;
  const conversationId =
    typeof rawConvId === "string" && /^\d+$/.test(rawConvId)
      ? rawConvId
      : typeof rawConvId === "number" && Number.isInteger(rawConvId) && rawConvId > 0
        ? String(rawConvId)
        : null;
  if (rawConvId != null && conversationId == null) {
    console.warn(
      "[api/ask POST] ignoring non-integer conversationId from client",
      rawConvId,
    );
  }
  const mode: ResponseMode = body.mode === "deep" ? "deep" : "simple";

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();
  const voyageKey = process.env.VOYAGE_API_KEY?.trim();
  if (!anthropicKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not set in .env.local" },
      { status: 503 },
    );
  }
  if (!voyageKey) {
    return NextResponse.json(
      { error: "VOYAGE_API_KEY is not set in .env.local" },
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

  const incomingConvId = conversationId;
  console.log("[api/ask POST] incoming conversationId:", incomingConvId);
  let convId: string | null = incomingConvId;
  if (convId) {
    const { data: existing, error: lookupErr } = await supabase
      .from("wholara_conversations")
      .select("id")
      .eq("id", convId)
      .maybeSingle();
    if (lookupErr) {
      console.error("[api/ask POST] conversation lookup error", lookupErr);
      return NextResponse.json({ error: lookupErr.message }, { status: 500 });
    }
    if (!existing) {
      // Unknown id (likely from a different environment or a wiped table).
      // Fall through to create a fresh conversation — the server is the only
      // source of truth for conversation_id, never the client.
      console.warn(
        "[api/ask POST] no conversations row for client id, creating a new one",
        convId,
      );
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
      console.error("[api/ask POST] could not create new conversation", cErr);
      return NextResponse.json(
        { error: cErr?.message ?? "Could not create conversation" },
        { status: 500 },
      );
    }
    convId = String(created.id);
    console.log("[api/ask POST] created new conversation", convId);
  }

  if (incomingConvId && convId !== incomingConvId) {
    console.warn(
      "[api/ask POST] conversationId CHANGED — client will overwrite local id",
      { incoming: incomingConvId, outgoing: convId },
    );
  }

  const { error: insUserErr } = await supabase.from("wholara_messages").insert({
    conversation_id: convId,
    role: "user",
    content: message,
  });
  if (insUserErr) {
    return NextResponse.json({ error: insUserErr.message }, { status: 500 });
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

  const anthropicMessages: Anthropic.Messages.MessageParam[] = history.map(
    (m) => ({
      role: m.role,
      content: m.content,
    }),
  );

  const client = new Anthropic({ apiKey: anthropicKey });
  const model = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_ANTHROPIC_MODEL;
  const modeInstructions =
    mode === "deep" ? DEEP_MODE_INSTRUCTIONS : SIMPLE_MODE_INSTRUCTIONS;
  const systemPrompt = `${WHOLARA_SYSTEM_PROMPT}\n\n${WHOLARA_INTAKE_INSTRUCTIONS}\n\n${modeInstructions}`;

  let assistantText = "";
  let toolTurns = 0;

  try {
    while (true) {
      const atToolCap = toolTurns >= MAX_TOOL_TURNS;
      const claudeRes = await client.messages.create({
        model,
        max_tokens: MAX_OUTPUT_TOKENS,
        system: systemPrompt,
        tools: atToolCap ? undefined : [SEARCH_TOOL],
        messages: anthropicMessages,
      });

      const toolUse = findToolUse(claudeRes);

      if (claudeRes.stop_reason === "tool_use" && toolUse && !atToolCap) {
        toolTurns += 1;
        const input = toolUse.input as { query?: unknown };
        const query =
          typeof input.query === "string" ? input.query.trim() : "";

        let toolResultText: string;
        let isError = false;
        if (!query) {
          toolResultText =
            "Tool error: the `query` field was missing or empty. Please call the tool again with a detailed query.";
          isError = true;
        } else {
          try {
            const { contextBlock } = await searchKnowledgeBase(
              query,
              supabase,
              voyageKey,
            );
            toolResultText = `RELEVANT KNOWLEDGE retrieved for query: "${query}"\n\n${contextBlock}\n\nWrite your synthesis using ONLY the information in the RELEVANT KNOWLEDGE above. Do not supplement with general training knowledge. If this material does not contain enough information to fully answer the user's question, tell them you don't have enough information in your knowledge base to answer that specifically and recommend speaking with a qualified nutrition therapist. End with the <followups>[...]</followups> JSON block as instructed.`;
          } catch (e) {
            toolResultText = `Tool error: ${e instanceof Error ? e.message : "search failed"}`;
            isError = true;
          }
        }

        anthropicMessages.push({
          role: "assistant",
          content: claudeRes.content,
        });
        anthropicMessages.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: toolUse.id,
              content: toolResultText,
              is_error: isError,
            },
          ],
        });
        continue;
      }

      assistantText = extractText(claudeRes);
      break;
    }
  } catch (e) {
    console.error("[api/ask] Anthropic error", e);
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
    assistantText =
      "I could not generate a reply just now. Please try again in a moment.";
  }

  const { error: insAsstErr } = await supabase.from("wholara_messages").insert({
    conversation_id: convId,
    role: "assistant",
    content: assistantText,
  });
  if (insAsstErr) {
    return NextResponse.json({ error: insAsstErr.message }, { status: 500 });
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

  console.log("[api/ask POST] responding", {
    conversationId: convId,
    messageCount: finalRows.length,
  });
  return NextResponse.json({
    conversationId: convId,
    messages: finalRows as ChatMessageRow[],
  });
}
