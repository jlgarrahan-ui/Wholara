import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getServiceSupabase } from "@/lib/supabase/service";
import { WHOLARA_SYSTEM_PROMPT } from "@/lib/chat/wholara-system-prompt";

export const runtime = "nodejs";

const DEFAULT_MODEL = "claude-sonnet-4-6";
const MATCH_COUNT = 5;
const MATCH_THRESHOLD = 0.0; // permissive — surface anything semantically near the query

type DocumentMatch = {
  id?: number;
  filename?: string;
  chunk_index?: number;
  content: string;
  metadata?: Record<string, unknown> | null;
  similarity?: number;
};

type SuccessResponse = {
  answer: string;
  matches: DocumentMatch[];
};

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
    throw new Error(`Voyage embeddings failed (${res.status}): ${detail.slice(0, 300)}`);
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

function extractAnthropicText(message: Anthropic.Messages.Message): string {
  return message.content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

export async function POST(req: Request) {
  let body: { question?: unknown };
  try {
    body = (await req.json()) as { question?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const question =
    typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    return NextResponse.json(
      { error: "`question` is required" },
      { status: 400 },
    );
  }

  const voyageKey = process.env.VOYAGE_API_KEY?.trim();
  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!voyageKey) {
    return NextResponse.json(
      { error: "VOYAGE_API_KEY is not set in .env.local" },
      { status: 503 },
    );
  }
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

  // 1) Embed the user's query (voyage-3, 1024d, input_type=query)
  let queryEmbedding: number[];
  try {
    queryEmbedding = await embedQuery(question, voyageKey);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Embedding failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  // 2) Retrieve top-5 chunks via match_documents
  const { data: matchRows, error: matchErr } = await supabase.rpc(
    "match_documents",
    {
      query_embedding: queryEmbedding,
      match_threshold: MATCH_THRESHOLD,
      match_count: MATCH_COUNT,
    },
  );
  if (matchErr) {
    return NextResponse.json(
      { error: `match_documents: ${matchErr.message}` },
      { status: 502 },
    );
  }

  const matches: DocumentMatch[] = Array.isArray(matchRows)
    ? (matchRows as DocumentMatch[])
    : [];

  // 3) Build the context block and call Claude
  const contextBlock = matches
    .map((m, i) => {
      const label =
        m.filename != null
          ? `Source ${i + 1} (${m.filename}${m.chunk_index != null ? `#${m.chunk_index}` : ""})`
          : `Source ${i + 1}`;
      return `[${label}]\n${m.content}`;
    })
    .join("\n\n---\n\n");

  const userMessage = matches.length
    ? `Use the context below to answer the question. If the context doesn't contain the answer, say so.\n\n<context>\n${contextBlock}\n</context>\n\nQuestion: ${question}`
    : `(No retrieved context was available for this question.)\n\nQuestion: ${question}`;

  let answer: string;
  try {
    const client = new Anthropic({ apiKey: anthropicKey });
    const model = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;
    const claudeRes = await client.messages.create({
      model,
      max_tokens: 1024,
      system: WHOLARA_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });
    answer = extractAnthropicText(claudeRes);
    if (!answer) answer = "I could not generate a reply just now.";
  } catch (e) {
    const detail = e instanceof Error ? e.message : "Claude request failed";
    return NextResponse.json(
      { error: `Claude API: ${detail}` },
      { status: 502 },
    );
  }

  const payload: SuccessResponse = { answer, matches };
  return NextResponse.json(payload);
}
