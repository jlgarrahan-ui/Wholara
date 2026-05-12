import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "@/components/coming-soon-placeholder";

export const metadata: Metadata = {
  title: "Individual Consulting | Wholara",
  description:
    "One-on-one nutrition and wellness consulting with Wholara — coming soon.",
};

export default function IndividualConsultingPage() {
  return <ComingSoonPlaceholder eyebrow="Individual Consulting" />;
}
