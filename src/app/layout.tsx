import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karla — Din digitale kollega i socialforvaltningen",
  description: "Karla hjælper socialrådgivere, sagsbehandlere og indkøbere med sagssparring, Barnets Lov og Serviceloven, notater, frister og valg af den rette indsats og aktør. Gratis at prøve. Støtte — ikke skøn.",
  openGraph: {
    title: "Karla — Hej kollega, godt at se dig",
    description: "Den varme AI-kollega der kender Barnets Lov og Serviceloven, letter dokumentationen og tænker med i dine sager.",
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
