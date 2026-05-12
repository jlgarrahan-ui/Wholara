import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "@/components/coming-soon-placeholder";

export const metadata: Metadata = {
  title: "Get Started | Wholara",
  description: "The Wholara app is on its way — coming soon.",
};

export default function AppPage() {
  return <ComingSoonPlaceholder eyebrow="Get Started" />;
}
