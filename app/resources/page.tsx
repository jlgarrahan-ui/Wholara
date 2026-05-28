import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "@/components/coming-soon-placeholder";

export const metadata: Metadata = {
  title: "Resources | Wholara",
  description: "Wholara resources — coming soon.",
};

export default function ResourcesPage() {
  return <ComingSoonPlaceholder eyebrow="Resources" />;
}
