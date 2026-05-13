"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { ArrowIcon, RefreshIcon, WildflowerIcon } from "@/components/icons";

const markdownComponents: Components = {
  p({ children }) {
    return (
      <p className="text-sm leading-relaxed text-wholara-green sm:text-[0.9375rem]">
        {children}
      </p>
    );
  },
  strong({ children }) {
    return (
      <strong className="font-semibold text-wholara-green-deep">
        {children}
      </strong>
    );
  },
  em({ children }) {
    return <em className="italic">{children}</em>;
  },
  ul({ children }) {
    return (
      <ul className="my-1 list-disc space-y-1 pl-5 marker:text-wholara-terracotta">
        {children}
      </ul>
    );
  },
  ol({ children }) {
    return (
      <ol className="my-1 list-decimal space-y-1 pl-5 marker:text-wholara-terracotta">
        {children}
      </ol>
    );
  },
  li({ children }) {
    return (
      <li className="text-sm leading-relaxed text-wholara-green sm:text-[0.9375rem]">
        {children}
      </li>
    );
  },
  h1({ children }) {
    return (
      <p className="text-sm font-semibold text-wholara-green-deep sm:text-[0.9375rem]">
        {children}
      </p>
    );
  },
  h2({ children }) {
    return (
      <p className="text-sm font-semibold text-wholara-green-deep sm:text-[0.9375rem]">
        {children}
      </p>
    );
  },
  h3({ children }) {
    return (
      <p className="text-sm font-semibold text-wholara-green-deep sm:text-[0.9375rem]">
        {children}
      </p>
    );
  },
  h4({ children }) {
    return (
      <p className="text-sm font-semibold text-wholara-green-deep sm:text-[0.9375rem]">
        {children}
      </p>
    );
  },
  a({ children, href }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-wholara-terracotta underline underline-offset-2 hover:text-wholara-terracotta-deep"
      >
        {children}
      </a>
    );
  },
  code({ children }) {
    return (
      <code className="rounded bg-wholara-cream-deep px-1 py-0.5 text-[0.85em] text-wholara-green-deep">
        {children}
      </code>
    );
  },
  blockquote({ children }) {
    return (
      <blockquote className="border-l-2 border-wholara-sage/50 pl-3 text-wholara-green/85 italic">
        {children}
      </blockquote>
    );
  },
};

const STORAGE_KEY = "wholara_conversation_id";
const MODE_STORAGE_KEY = "wholara_response_mode";

const WELCOME_MESSAGE =
  "Hi! I'm Wholara. Tell me what's been going on — I'm here to help you figure out what your body needs.";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type ResponseMode = "simple" | "deep";

type AskChatProps = {
  /** When set, chat is disabled and this explains how to fix configuration. */
  disabledReason?: string | null;
};

type ParsedAssistant = {
  body: string;
  followups: string[];
};

function parseAssistantContent(raw: string): ParsedAssistant {
  const match = raw.match(/<followups>([\s\S]*?)<\/followups>/i);
  if (!match) return { body: raw.trim(), followups: [] };

  const body = raw.replace(match[0], "").trim();
  let followups: string[] = [];
  try {
    const parsed = JSON.parse(match[1].trim());
    if (Array.isArray(parsed)) {
      followups = parsed
        .filter((v): v is string => typeof v === "string")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);
    }
  } catch {
    followups = [];
  }
  return { body, followups };
}

export function AskChat({ disabledReason = null }: AskChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [responseMode, setResponseMode] = useState<ResponseMode>("simple");
  const [regenerating, setRegenerating] = useState<ResponseMode | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    startTransition(() => {
      setConversationId(saved);
    });
  }, []);

  useEffect(() => {
    const savedMode = window.localStorage.getItem(MODE_STORAGE_KEY);
    if (savedMode !== "deep" && savedMode !== "simple") return;
    startTransition(() => {
      setResponseMode(savedMode);
    });
  }, []);

  const updateResponseMode = useCallback((next: ResponseMode) => {
    setResponseMode(next);
    window.localStorage.setItem(MODE_STORAGE_KEY, next);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending]);

  const send = useCallback(
    async (overrideText?: string, overrideMode?: ResponseMode) => {
      if (disabledReason) return;
      const text = (overrideText ?? input).trim();
      if (!text || pending) return;
      if (!overrideText) setInput("");
      setError(null);
      setPending(true);
      const modeToSend = overrideMode ?? responseMode;

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
            mode: modeToSend,
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
        textareaRef.current?.focus();
      }
    },
    [conversationId, disabledReason, input, pending, responseMode],
  );

  const handleFollowup = useCallback(
    (question: string) => {
      void send(question);
    },
    [send],
  );

  const regenerateInMode = useCallback(
    async (mode: ResponseMode) => {
      if (disabledReason) return;
      if (!conversationId) return;
      if (pending) return;
      updateResponseMode(mode);
      setError(null);
      setPending(true);
      setRegenerating(mode);
      try {
        const res = await fetch("/api/ask/regenerate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId, mode }),
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
        const next = data as { messages: ChatMessage[] };
        setMessages(next.messages);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not regenerate");
      } finally {
        setPending(false);
        setRegenerating(null);
      }
    },
    [conversationId, disabledReason, pending, updateResponseMode],
  );

  const resetConversation = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setError(null);
    setInput("");
    window.localStorage.removeItem(STORAGE_KEY);
    setShowResetConfirm(false);
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!showResetConfirm) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowResetConfirm(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showResetConfirm]);

  const showWelcome = messages.length === 0 && !disabledReason;
  const showNewConversation = messages.length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {disabledReason && (
        <div
          className="mb-4 rounded-2xl border border-wholara-terracotta/35 bg-wholara-terracotta/10 px-4 py-3 text-sm leading-relaxed text-wholara-green"
          role="status"
        >
          <p className="font-medium text-wholara-terracotta-deep">
            Setup needed
          </p>
          <p className="mt-2 whitespace-pre-line text-wholara-green/90">
            {disabledReason}
          </p>
        </div>
      )}

      {!disabledReason && (
        <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
          <ResponseModeToggle
            mode={responseMode}
            onChange={updateResponseMode}
            disabled={pending}
          />
          {showNewConversation && (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-wholara-green/20 bg-wholara-cream px-3 py-1.5 text-xs font-medium text-wholara-green transition-colors hover:border-wholara-terracotta hover:text-wholara-terracotta-deep sm:text-[0.8125rem]"
              aria-label="Start a new conversation"
            >
              <RefreshIcon className="h-3.5 w-3.5" />
              New Conversation
            </button>
          )}
        </div>
      )}

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-1 py-2 sm:space-y-5 sm:px-2">
        {showWelcome && <AssistantBubble body={WELCOME_MESSAGE} />}

        {messages.map((m, idx) => {
          if (m.role !== "assistant") {
            return <UserBubble key={m.id} content={m.content} />;
          }
          const isLastAssistant = idx === messages.length - 1;
          return (
            <AssistantTurn
              key={m.id}
              content={m.content}
              onFollowup={handleFollowup}
              disabled={pending || Boolean(disabledReason)}
              onRegenerate={regenerateInMode}
              isLastAssistant={isLastAssistant}
              regeneratingMode={
                isLastAssistant && regenerating ? regenerating : null
              }
              canRegenerate={!pending && !disabledReason}
            />
          );
        })}

        {pending && !regenerating && <TypingIndicator />}
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

      <div className="mt-4 shrink-0 border-t border-wholara-green/10 pt-4">
        <div className="flex items-end gap-2 rounded-2xl border border-wholara-green/20 bg-wholara-cream px-3 py-2 shadow-sm focus-within:border-wholara-terracotta focus-within:ring-1 focus-within:ring-wholara-terracotta/30">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            rows={1}
            placeholder="Share what you're noticing…"
            className="min-h-[2.5rem] max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-wholara-green placeholder:text-wholara-green/40 focus:outline-none sm:text-[0.9375rem]"
            disabled={pending || Boolean(disabledReason)}
            aria-label="Message Wholara"
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={pending || !input.trim() || Boolean(disabledReason)}
            aria-label="Send message"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-wholara-terracotta text-wholara-cream transition-colors hover:bg-wholara-terracotta-deep disabled:pointer-events-none disabled:opacity-40 sm:h-11 sm:w-11"
          >
            <ArrowIcon className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-center text-[0.65rem] leading-snug text-wholara-green/55 sm:text-xs">
          AI only — not medical advice, diagnosis, or treatment. Always confirm
          with a licensed healthcare professional before acting on anything
          here.
        </p>
      </div>

      {showResetConfirm && (
        <ResetConfirmDialog
          onConfirm={resetConversation}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  );
}

function ResetConfirmDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-wholara-green-deep/55 px-4 backdrop-blur-sm"
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-confirm-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-wholara-cream/10 bg-wholara-green p-6 text-wholara-cream shadow-2xl sm:p-7"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wholara-cream/10 text-wholara-cream">
            <RefreshIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="reset-confirm-title"
              className="font-display text-xl font-light leading-snug text-wholara-cream sm:text-[1.375rem]"
            >
              Start a new conversation?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-wholara-cream/75">
              This will clear your current chat and bring you back to a fresh
              start.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-full border border-wholara-terracotta/70 px-4 py-2 text-sm font-medium text-wholara-cream transition-colors hover:border-wholara-terracotta hover:bg-wholara-terracotta/10"
          >
            Keep This Chat
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center rounded-full bg-wholara-terracotta px-4 py-2 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-terracotta-deep"
          >
            Clear & Start Fresh
          </button>
        </div>
      </div>
    </div>
  );
}

function AssistantTurn({
  content,
  onFollowup,
  disabled,
  onRegenerate,
  isLastAssistant,
  regeneratingMode,
  canRegenerate,
}: {
  content: string;
  onFollowup: (question: string) => void;
  disabled: boolean;
  onRegenerate: (mode: ResponseMode) => void;
  isLastAssistant: boolean;
  regeneratingMode: ResponseMode | null;
  canRegenerate: boolean;
}) {
  const parsed = useMemo(() => parseAssistantContent(content), [content]);
  const isSynthesis = parsed.followups.length > 0;
  const showRegenerateRow =
    isLastAssistant && isSynthesis && (canRegenerate || regeneratingMode);

  return (
    <div className="space-y-2">
      <AssistantBubble body={parsed.body} />
      {parsed.followups.length > 0 && !regeneratingMode && (
        <div className="ml-11 flex flex-wrap gap-2 pr-2 sm:ml-12">
          {parsed.followups.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onFollowup(q)}
              disabled={disabled}
              className="rounded-full border border-wholara-terracotta/40 bg-wholara-cream px-3.5 py-1.5 text-left text-xs text-wholara-terracotta-deep transition-colors hover:border-wholara-terracotta hover:bg-wholara-terracotta hover:text-wholara-cream disabled:opacity-50 sm:text-[0.8125rem]"
            >
              {q}
            </button>
          ))}
        </div>
      )}
      {showRegenerateRow && (
        <div className="ml-11 pr-2 text-xs sm:ml-12">
          {regeneratingMode ? (
            <div
              role="status"
              aria-live="polite"
              className="inline-flex items-center gap-2 text-wholara-sage"
            >
              <span className="wholara-typing-dot" />
              <span className="wholara-typing-dot" />
              <span className="wholara-typing-dot" />
              <span className="ml-1">
                Regenerating in{" "}
                {regeneratingMode === "deep" ? "Deep Dive" : "Simple"} mode…
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <button
                type="button"
                onClick={() => onRegenerate("simple")}
                className="text-wholara-sage underline underline-offset-2 transition-colors hover:text-wholara-green"
              >
                Simplify this
              </button>
              <button
                type="button"
                onClick={() => onRegenerate("deep")}
                className="text-wholara-sage underline underline-offset-2 transition-colors hover:text-wholara-green"
              >
                Go deeper
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResponseModeToggle({
  mode,
  onChange,
  disabled,
}: {
  mode: ResponseMode;
  onChange: (next: ResponseMode) => void;
  disabled: boolean;
}) {
  const baseSegment =
    "rounded-full px-3.5 py-1 text-xs font-medium transition-colors sm:text-[0.8125rem]";
  const selected = "bg-wholara-terracotta text-wholara-cream shadow-sm";
  const unselected =
    "text-wholara-sage hover:text-wholara-green disabled:opacity-50";

  return (
    <div
      role="radiogroup"
      aria-label="Response style"
      className="inline-flex items-center rounded-full border border-wholara-sage/60 bg-wholara-cream p-0.5"
    >
      <button
        type="button"
        role="radio"
        aria-checked={mode === "simple"}
        disabled={disabled}
        onClick={() => onChange("simple")}
        className={`${baseSegment} ${mode === "simple" ? selected : unselected}`}
      >
        Simple
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={mode === "deep"}
        disabled={disabled}
        onClick={() => onChange("deep")}
        className={`${baseSegment} ${mode === "deep" ? selected : unselected}`}
      >
        Deep Dive
      </button>
    </div>
  );
}

function AssistantBubble({ body }: { body: string }) {
  return (
    <div className="flex max-w-[min(100%,36rem)] gap-2.5 sm:gap-3">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-wholara-cream-deep/70 text-wholara-terracotta sm:h-9 sm:w-9">
        <WildflowerIcon className="h-5 w-5" />
      </div>
      <div className="rounded-2xl rounded-tl-md border border-wholara-green/10 bg-wholara-cream px-4 py-3 text-wholara-green shadow-sm">
        <div className="space-y-2.5">
          <ReactMarkdown components={markdownComponents}>{body}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="ml-auto max-w-[min(100%,28rem)] rounded-2xl rounded-tr-md bg-wholara-sage px-4 py-3 text-wholara-cream shadow-sm">
      <p className="whitespace-pre-wrap text-sm leading-relaxed sm:text-[0.9375rem]">
        {content}
      </p>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex max-w-[min(100%,36rem)] gap-2.5 sm:gap-3">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-wholara-cream-deep/70 text-wholara-terracotta sm:h-9 sm:w-9">
        <WildflowerIcon className="h-5 w-5" />
      </div>
      <div
        role="status"
        aria-label="Wholara is thinking"
        className="inline-flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-wholara-green/10 bg-wholara-cream px-4 py-3.5 shadow-sm"
      >
        <span className="wholara-typing-dot" />
        <span className="wholara-typing-dot" />
        <span className="wholara-typing-dot" />
      </div>
    </div>
  );
}
