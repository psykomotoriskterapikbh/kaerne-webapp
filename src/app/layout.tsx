import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.astridai.dk"),
  title: {
    default: "Astrid — Din digitale kollega i socialforvaltningen",
    template: "%s · Astrid",
  },
  description:
    "Astrid hjælper socialrådgivere, sagsbehandlere og indkøbere med sagssparring, Barnets Lov og Serviceloven, notater, frister og valg af den rette indsats og leverandør. Gratis at prøve. Støtte — ikke skøn.",
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
    "leverandørvalg",
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
    images: [
      {
        url: "https://media.glif.app/i:r/c_fill,w_1200,h_630/f_auto/q_auto/fucn4fhdx5txpp7ddqre",
        width: 1200,
        height: 630,
        alt: "Astrid — din digitale kollega i socialforvaltningen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Astrid — Din digitale kollega i socialforvaltningen",
    description:
      "Sagssparring, jura og notathjælp — den varme AI-kollega for kommunalt socialarbejde.",
    images: ["https://media.glif.app/i:r/c_fill,w_1200,h_630/f_auto/q_auto/fucn4fhdx5txpp7ddqre"],
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
