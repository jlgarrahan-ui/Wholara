import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing-shell";

export const metadata: Metadata = {
  title: "About | Wholara",
  description: "Learn about Wholara and the team behind it.",
};

export default function AboutPage() {
  return (
    <MarketingShell title="About">
      <p>
        Tell your story here—mission, credentials, and how you help clients.
        This placeholder keeps the About tab working until you publish full
        content.
      </p>
    </MarketingShell>
  );
}
