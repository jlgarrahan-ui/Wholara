import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "@/components/coming-soon-placeholder";

export const metadata: Metadata = {
  title: "Work With Me | Wholara",
  description: "Work one-on-one with Wholara — coming soon.",
};

export default function WorkWithMePage() {
  return <ComingSoonPlaceholder eyebrow="Work With Me" />;
}
