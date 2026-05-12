import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "@/components/coming-soon-placeholder";

export const metadata: Metadata = {
  title: "Packages | Wholara",
  description: "Wholara consulting and coaching packages — coming soon.",
};

export default function PackagesPage() {
  return <ComingSoonPlaceholder eyebrow="Packages" />;
}
