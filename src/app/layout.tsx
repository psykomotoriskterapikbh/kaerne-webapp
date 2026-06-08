import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kaerne-webapp.vercel.app"),
  title: {
    default: "Astrid — Din digitale kollega i socialforvaltningen",
    template: "%s · Astrid",
  },
  description:
    "Astrid hjælper socialrådgivere, sagsbehandlere og indkøbere med sagssparring, Barnets Lov og Serviceloven, notater, frister og valg af den rette indsats og aktør. Gratis at prøve. Støtte — ikke skøn.",
  applicationName: "Astrid",
  keywords: [
    "socialrådgiver",
    "sagsbehandler",
    "Barnets Lov",
    "Serviceloven",
    "kommune",
    "socialforvaltning",
    "AI-kollega",
    "journalnotat",
    "frister",
    "aktørvalg",
  ],
  authors: [{ name: "Astrid" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Astrid — Hej kollega, godt at se dig",
    description:
      "Den varme AI-kollega der kender Barnets Lov og Serviceloven, letter dokumentationen og tænker med i dine sager.",
    type: "website",
    locale: "da_DK",
    siteName: "Astrid",
  },
  twitter: {
    card: "summary_large_image",
    title: "Astrid — Din digitale kollega i socialforvaltningen",
    description:
      "Sagssparring, jura og notathjælp — den varme AI-kollega for kommunalt socialarbejde.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3e7d4",
  colorScheme: "light",
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
