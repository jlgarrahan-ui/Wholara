import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask Wholara",
  description:
    "AI-guided answers from Wholara’s science-backed knowledge for your nutrition and wellness questions.",
};

export default function AskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
