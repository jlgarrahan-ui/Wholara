import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing-shell";

export const metadata: Metadata = {
  title: "1:1 Coaching | Wholara",
  description: "Private nutrition and wellness coaching with Wholara.",
};

export default function CoachingPage() {
  return (
    <MarketingShell title="1:1 Coaching">
      <p>
        Describe your coaching packages, process, and how to book. This is
        placeholder copy; link out to your scheduler or contact form when you
        wire it up.
      </p>
    </MarketingShell>
  );
}
