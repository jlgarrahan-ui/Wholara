import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type MarketingShellProps = {
  title: string;
  children?: ReactNode;
};

export function MarketingShell({ title, children }: MarketingShellProps) {
  return (
    <div className="flex min-h-full flex-col bg-wholara-cream text-wholara-green">
      <SiteHeader />
      <main className="flex-1 px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-light text-wholara-green sm:text-4xl">
            {title}
          </h1>
          {children ? (
            <div className="mt-6 text-base leading-relaxed text-wholara-green/80">
              {children}
            </div>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
