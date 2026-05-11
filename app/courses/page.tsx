import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing-shell";

export const metadata: Metadata = {
  title: "Courses | Wholara",
  description: "Wholara courses in nutrition and wellness.",
};

export default function CoursesPage() {
  return (
    <MarketingShell title="Courses">
      <p>
        Showcase your courses here—curriculum, enrollment, and FAQs. This is
        placeholder copy until you add the full experience.
      </p>
    </MarketingShell>
  );
}
