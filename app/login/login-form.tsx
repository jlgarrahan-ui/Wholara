"use client";

import { useCallback, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";

type Status = "idle" | "sending" | "sent" | "error";

export function LoginForm({ next }: { next: string | null }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = email.trim();
      if (!trimmed || status === "sending") return;

      setStatus("sending");
      setError(null);
      try {
        const supabase = createBrowserSupabase();
        // Only allow same-origin internal redirect targets, then hand off to
        // the callback route which exchanges the link for a session.
        const safeNext =
          next && next.startsWith("/") && !next.startsWith("//") ? next : "/ask";
        const callback = new URL("/auth/callback", window.location.origin);
        callback.searchParams.set("next", safeNext);

        const { error: signInError } = await supabase.auth.signInWithOtp({
          email: trimmed,
          options: { emailRedirectTo: callback.toString() },
        });
        if (signInError) throw signInError;
        setStatus("sent");
      } catch (err) {
        setStatus("error");
        setError(
          err instanceof Error
            ? err.message
            : "Could not send the link. Please try again.",
        );
      }
    },
    [email, next, status],
  );

  if (status === "sent") {
    return (
      <div
        className="rounded-2xl border border-wholara-sage/40 bg-wholara-cream px-5 py-6 text-center"
        role="status"
      >
        <p className="font-display text-lg text-wholara-green">Check your inbox</p>
        <p className="mt-2 text-sm leading-relaxed text-wholara-green/75">
          We sent a login link to{" "}
          <span className="font-medium text-wholara-green">{email.trim()}</span>.
          Click it on this device and you&rsquo;ll be logged in.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setError(null);
          }}
          className="mt-4 text-sm text-wholara-terracotta underline underline-offset-2 transition-colors hover:text-wholara-terracotta-deep"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label htmlFor="login-email" className="sr-only">
        Email address
      </label>
      <input
        id="login-email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-2xl border border-wholara-green/20 bg-wholara-cream px-4 py-3 text-sm text-wholara-green placeholder:text-wholara-green/40 focus:border-wholara-terracotta focus:outline-none focus:ring-1 focus:ring-wholara-terracotta/30 sm:text-[0.9375rem]"
      />
      <button
        type="submit"
        disabled={status === "sending" || !email.trim()}
        className="inline-flex w-full items-center justify-center rounded-full bg-wholara-green px-6 py-3 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-green-deep disabled:pointer-events-none disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send me a link"}
      </button>
      {error && (
        <p className="text-sm text-wholara-terracotta-deep" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
