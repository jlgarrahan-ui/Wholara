"use client";

import { useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { AskAiDisclaimer } from "@/components/ask-ai-disclaimer";
import { AskChat } from "./ask-chat";

const STORAGE_KEY = "wholara_ask_disclaimer_choice";

type Choice = "accepted" | "declined";

type AskConsentGateProps = {
  setupMessage: string | null;
  /** Server-verified: does this user have an active paid subscription? */
  isSubscribed: boolean;
  /** Whether a Supabase session exists (drives the upgrade CTA's destination). */
  isLoggedIn: boolean;
};

export function AskConsentGate({
  setupMessage,
  isSubscribed,
  isLoggedIn,
}: AskConsentGateProps) {
  const [phase, setPhase] = useState<"hydrating" | "pending" | Choice>("hydrating");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    startTransition(() => {
      if (stored === "accepted" || stored === "declined") {
        setPhase(stored);
      } else {
        setPhase("pending");
      }
    });
  }, []);

  function accept() {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    setPhase("accepted");
  }

  function decline() {
    window.localStorage.setItem(STORAGE_KEY, "declined");
    setPhase("declined");
  }

  function reconsider() {
    window.localStorage.removeItem(STORAGE_KEY);
    setPhase("pending");
  }

  if (phase === "hydrating") {
    return (
      <div
        className="min-h-[12rem] rounded-2xl bg-wholara-green/[0.06]"
        aria-busy="true"
        aria-label="Loading"
      />
    );
  }

  if (phase === "declined") {
    return (
      <div className="rounded-2xl border border-wholara-green/15 bg-wholara-cream px-5 py-8 text-center sm:px-8">
        <p className="font-display text-lg text-wholara-green">
          Ask Wholara is not available
        </p>
        <p className="mt-3 text-sm leading-relaxed text-wholara-green/80">
          You chose not to accept the notice above. This AI chat stays turned off
          on this browser until you change your choice.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reconsider}
            className="rounded-full border border-wholara-green/30 px-5 py-2.5 text-sm font-medium text-wholara-green transition-colors hover:border-wholara-green hover:bg-wholara-green/5"
          >
            Back to notice
          </button>
          <Link
            href="/"
            className="rounded-full bg-wholara-terracotta px-5 py-2.5 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-terracotta-deep"
          >
            Return home
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "pending") {
    return (
      <AskAiDisclaimer
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={decline}
              className="rounded-full border border-wholara-green/35 px-5 py-2.5 text-sm font-medium text-wholara-green transition-colors hover:border-wholara-terracotta hover:bg-wholara-cream"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={accept}
              className="rounded-full bg-wholara-green px-5 py-2.5 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-green-deep"
            >
              I have read this and accept
            </button>
          </div>
        }
      />
    );
  }

  return (
    <AskChat
      disabledReason={setupMessage}
      isSubscribed={isSubscribed}
      isLoggedIn={isLoggedIn}
    />
  );
}
