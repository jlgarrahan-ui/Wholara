"use client";

import { useCallback, useEffect, useRef, useState, startTransition } from "react";
import { ArrowIcon } from "@/components/icons";

const STORAGE_KEY = "wholara_conversation_id";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

type AskChatProps = {
  /** When set, chat is disabled and this explains how to fix configuration. */
  disabledReason?: string | null;
};

export function AskChat({ disabledReason = null }: AskChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    startTransition(() => {
      setConversationId(saved);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  const send = useCallback(async () => {
    if (disabledReason) return;
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    setError(null);
    setPending(true);

    let rollback: ChatMessage[] | null = null;
    setMessages((prev) => {
      rollback = prev;
      return [
        ...prev,
        {
          id: `local-${Date.now()}`,
          role: "user",
          content: text,
          created_at: new Date().toISOString(),
        },
      ];
    });

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationId: conversationId ?? undefined,
        }),
      });
      const rawText = await res.text();
      let data: unknown = null;
      try {
        data = rawText ? (JSON.parse(rawText) as unknown) : null;
      } catch {
        data = null;
      }
      if (!res.ok) {
        const fromJson =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : null;
        const fallback =
          rawText && rawText.length < 400 && !rawText.trim().startsWith("<")
            ? rawText.trim()
            : `Request failed (${res.status})`;
        throw new Error(fromJson ?? fallback);
      }
      if (
        !data ||
        typeof data !== "object" ||
        !("messages" in data) ||
        !Array.isArray((data as { messages: unknown }).messages)
      ) {
        throw new Error("Unexpected response from server");
      }
      const next = data as {
        conversationId: string;
        messages: ChatMessage[];
      };
      setConversationId(next.conversationId);
      window.localStorage.setItem(STORAGE_KEY, next.conversationId);
      setMessages(next.messages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      if (rollback) setMessages(rollback);
    } finally {
      setPending(false);
    }
  }, [conversationId, disabledReason, input, pending]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {disabledReason && (
        <div
          className="mb-4 rounded-2xl border border-wholara-terracotta/35 bg-wholara-terracotta/10 px-4 py-3 text-sm leading-relaxed text-wholara-green"
          role="status"
        >
          <p className="font-medium text-wholara-terracotta-deep">Setup needed</p>
          <p className="mt-2 text-wholara-green/90">{disabledReason}</p>
        </div>
      )}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-1 py-2 sm:px-2">
        {messages.length === 0 && !pending && !disabledReason && (
          <p className="rounded-2xl border border-wholara-green/10 bg-wholara-cream-deep/40 px-4 py-3 text-sm text-wholara-green/80">
            Ask a nutrition or wellness question. Your thread is saved so you
            can pick up where you left off on this device. Replies are{" "}
            <strong>AI-generated</strong>, are <strong>not medical advice</strong>
            , and should be confirmed with your doctor before you change your care.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user"
                ? "ml-auto max-w-[min(100%,28rem)] rounded-2xl bg-wholara-green px-4 py-3 text-wholara-cream"
                : "mr-auto max-w-[min(100%,32rem)] rounded-2xl border border-wholara-green/15 bg-wholara-cream px-4 py-3 text-wholara-green shadow-sm"
            }
          >
            <div>
              {m.role === "assistant" && (
                <p className="mb-2 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-wholara-green/50 sm:text-[0.7rem]">
                  AI response — not medical advice; check with your clinician
                </p>
              )}
              <p className="whitespace-pre-wrap text-sm leading-relaxed sm:text-[0.9375rem]">
                {m.content}
              </p>
            </div>
          </div>
        ))}
        {pending && (
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-wholara-green/50">
            Wholara is thinking…
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p
          className="mt-2 rounded-xl border border-wholara-terracotta/40 bg-wholara-terracotta/10 px-3 py-2 text-sm text-wholara-terracotta-deep"
          role="alert"
        >
          {error}
        </p>
      )}

      {!disabledReason && (
        <p className="mt-3 shrink-0 text-center text-[0.65rem] leading-snug text-wholara-green/55 sm:text-xs">
          AI only — not medical advice, diagnosis, or treatment. Always confirm
          with a licensed healthcare professional before acting on anything here.
        </p>
      )}

      <div className="mt-3 flex shrink-0 gap-2 border-t border-wholara-green/10 pt-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          rows={2}
          placeholder="Type your question…"
          className="min-h-[3rem] flex-1 resize-y rounded-2xl border border-wholara-green/20 bg-wholara-cream px-4 py-3 text-sm text-wholara-green placeholder:text-wholara-green/40 focus:border-wholara-terracotta focus:outline-none focus:ring-1 focus:ring-wholara-terracotta/30"
          disabled={pending || Boolean(disabledReason)}
          aria-label="Message"
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={pending || !input.trim() || Boolean(disabledReason)}
          className="inline-flex shrink-0 items-center justify-center gap-2 self-end rounded-2xl bg-wholara-terracotta px-4 py-3 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-terracotta-deep disabled:pointer-events-none disabled:opacity-50"
        >
          Send
          <ArrowIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
