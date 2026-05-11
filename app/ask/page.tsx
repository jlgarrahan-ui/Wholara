import { AskConsentGate } from "./ask-consent-gate";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAskSetupMessage } from "@/lib/supabase/ask-config";

export const dynamic = "force-dynamic";

export default function AskPage() {
  const setupMessage = getAskSetupMessage();

  return (
    <div className="flex min-h-full flex-col bg-wholara-cream text-wholara-green">
      <SiteHeader />
      <main className="flex flex-1 flex-col px-5 py-8 sm:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-light text-wholara-green sm:text-4xl">
              Ask Wholara
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-wholara-green/70 sm:text-[0.9375rem]">
              We use AI to go through our unique science-backed database to find
              what&rsquo;s relevant for your concerns.
            </p>
          </div>
          <div className="flex min-h-[420px] flex-1 flex-col rounded-3xl border border-wholara-green/10 bg-wholara-cream-deep/30 p-4 sm:min-h-[min(70vh,560px)] sm:p-6">
            <AskConsentGate setupMessage={setupMessage} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
