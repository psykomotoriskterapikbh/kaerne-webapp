import type { Metadata } from "next";
import KarlaLanding from "@/components/KarlaLanding";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return <KarlaLanding />;
}
