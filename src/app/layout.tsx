import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KÆRNE — Din digitale kollega for kommunal omsorg",
  description: "KÆRNE matcher selvstændige familieterapeuter, socialrådgivere og pædagoger med kommunale familiesager efter Barnets Lov. Mød Karla — din varme, intelligente kollega.",
  openGraph: {
    title: "KÆRNE — Hej kollega, godt at se dig",
    description: "AI-platform der forstår dansk fagsprog og holder dig i hånden gennem hver sag.",
    type: "website",
    locale: "da_DK",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="da" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
