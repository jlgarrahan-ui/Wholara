import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in to Wholara",
  description: "Log in to Ask Wholara with a magic link — no password needed.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-full flex-col bg-wholara-cream text-wholara-green">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md rounded-3xl border border-wholara-green/10 bg-wholara-cream-deep/30 p-8 sm:p-10">
          <h1 className="font-display text-3xl font-light text-wholara-green sm:text-4xl">
            Log in to Wholara
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-wholara-green/75 sm:text-[0.9375rem]">
            Pop in your email and we&rsquo;ll send you a link to log in. No
            password to remember.
          </p>
          <div className="mt-6">
            <LoginForm next={next ?? null} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
