"use client";

import { useState, type FormEvent } from "react";

type Match = {
  id?: number;
  filename?: string;
  chunk_index?: number;
  content: string;
  similarity?: number;
};

type ApiResponse =
  | { answer: string; matches: Match[] }
  | { error: string };

export function TestChatForm() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!question.trim() || loading) return;
    setLoading(true);
    setAnswer(null);
    setMatches([]);
    setError(null);

    try {
      const res = await fetch("/api/test-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const json = (await res.json()) as ApiResponse;
      if (!res.ok || "error" in json) {
        const msg =
          "error" in json ? json.error : `Request failed (${res.status})`;
        setError(msg);
      } else {
        setAnswer(json.answer);
        setMatches(json.matches);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label
          htmlFor="question"
          className="text-xs font-medium uppercase tracking-[0.16em] text-wholara-sage"
        >
          Your question
        </label>
        <textarea
          id="question"
          name="question"
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What are the signs of adrenal stress?"
          className="block w-full rounded-xl border border-wholara-green/15 bg-white px-4 py-3 text-base text-wholara-green placeholder:text-wholara-green/40 focus:border-wholara-terracotta focus:outline-none focus:ring-2 focus:ring-wholara-terracotta/30"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-wholara-terracotta px-6 py-3 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-terracotta-deep disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:self-start sm:px-7"
        >
          {loading ? "Asking..." : "Submit"}
        </button>
      </form>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700"
        >
          <strong className="font-semibold">Error:</strong> {error}
        </div>
      )}

      {answer && (
        <section className="rounded-2xl border border-wholara-green/10 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-wholara-terracotta">
            Claude&rsquo;s answer
          </h2>
          <div className="mt-3 whitespace-pre-wrap text-[0.95rem] leading-relaxed text-wholara-green">
            {answer}
          </div>
        </section>
      )}

      {matches.length > 0 && (
        <details className="rounded-2xl border border-wholara-green/10 bg-wholara-cream-deep/30 p-5 sm:p-6">
          <summary className="cursor-pointer text-xs font-medium uppercase tracking-[0.16em] text-wholara-sage">
            Retrieved context · top {matches.length}
          </summary>
          <ol className="mt-4 space-y-4">
            {matches.map((m, i) => (
              <li
                key={i}
                className="rounded-xl border border-wholara-green/10 bg-white p-4 text-sm"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] uppercase tracking-[0.14em] text-wholara-green/60">
                  <span>#{i + 1}</span>
                  {m.filename && <span>{m.filename}</span>}
                  {m.chunk_index != null && <span>chunk {m.chunk_index}</span>}
                  {typeof m.similarity === "number" && (
                    <span className="text-wholara-terracotta">
                      sim {m.similarity.toFixed(3)}
                    </span>
                  )}
                </div>
                <p className="mt-2 whitespace-pre-wrap leading-relaxed text-wholara-green/80">
                  {m.content}
                </p>
              </li>
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}
