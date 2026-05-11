import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing-shell";

export const metadata: Metadata = {
  title: "Meal Plans | Wholara",
  description: "Science-informed meal planning with Wholara.",
};

export default function MealPlansPage() {
  return (
    <MarketingShell title="Meal Plans">
      <p>
        Use this page for meal plan products, samples, and how to get started.
        Placeholder text for now—swap in your real offer when you are ready.
      </p>
    </MarketingShell>
  );
}
