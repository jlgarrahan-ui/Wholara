import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "@/components/coming-soon-placeholder";

export const metadata: Metadata = {
  title: "About | Wholara",
  description: "Learn about Wholara and the team behind it — coming soon.",
};

export default function AboutPage() {
  return <ComingSoonPlaceholder eyebrow="About" />;
}
