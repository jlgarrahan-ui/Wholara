import type { Metadata } from "next";
import { TestChatForm } from "./test-chat-form";

export const metadata: Metadata = {
  title: "Test Chat | Wholara",
  description: "Internal RAG test page: embeds a query, retrieves the top 5 document chunks, and asks Claude to answer.",
  robots: { index: false, follow: false },
};

export default function TestChatPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-5 py-12 sm:px-8 sm:py-16">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-wholara-terracotta">
          Internal test
        </p>
        <h1 className="font-display mt-2 text-3xl text-wholara-green sm:text-4xl">
          Documents RAG smoke test
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-wholara-green/70">
          Embeds your question with Voyage AI (<code>voyage-3</code>),
          retrieves the top {5} chunks from the <code>documents</code> table
          via <code>match_documents</code>, and asks Claude to answer using
          the Wholara system prompt.
        </p>
      </header>

      <TestChatForm />
    </main>
  );
}
