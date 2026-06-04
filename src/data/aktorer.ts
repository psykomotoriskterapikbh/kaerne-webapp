// Vejledende aktør-oversigt — baseret på offentligt tilgængelige oplysninger
// (virksomhedernes egne sider, CVR/proff.dk). Ikke en anbefaling eller rangering.

export type Aktor = {
  navn: string;
  kategori: "Matrikelløs indsats" | "Botilbud" | "Vikarbureau";
  omraade: "boern" | "voksne" | "begge";
  maalgruppe: string;
  paragraffer: string[];
  geografi: string;
  web: string;
};

export const AKTORER: Aktor[] = [
  {
    navn: "Leute",
    kategori: "Matrikelløs indsats",
    omraade: "boern",
    maalgruppe: "Børn, unge og familier med særlige behov",
    paragraffer: ["BL §30", "BL §32", "SEL §85", "Aflastning", "Efterværn"],
    geografi: "Landsdækkende",
    web: "https://www.leute.dk",
  },
  {
    navn: "Autenta",
    kategori: "Matrikelløs indsats",
    omraade: "boern",
    maalgruppe: "Børn, unge og familier — mentaliseringsbaseret tilgang",
    paragraffer: ["BL §32 familiebehandling", "Kontaktperson", "Spædbarnsindsats", "Skolevægring"],
    geografi: "Hovedstadsområdet",
    web: "https://autenta.dk",
  },
  {
    navn: "Auta",
    kategori: "Matrikelløs indsats",
    omraade: "begge",
    maalgruppe: "Børn, unge og voksne — specialiseret i autisme og ADHD",
    paragraffer: ["BL §30", "BL §32", "BL §75", "BL §105", "BL §§114-116", "SEL §85", "LAB §31b mentor"],
    geografi: "Hovedstaden og Sjælland",
    web: "https://auta.dk",
  },
  {
    navn: "Altid Vikar",
    kategori: "Vikarbureau",
    omraade: "begge",
    maalgruppe: "Botilbud, plejecentre, hjemmepleje og daginstitutioner",
    paragraffer: ["Pædagogiske vikarer", "SOSU-vikarer"],
    geografi: "Landsdækkende",
    web: "https://altidvikar.dk",
  },
  {
    navn: "Habitus",
    kategori: "Botilbud",
    omraade: "voksne",
    maalgruppe: "Voksne med autisme og komplekse behov",
    paragraffer: ["SEL §104", "SEL §107", "SEL §108", "SEL §85"],
    geografi: "Landsdækkende",
    web: "https://habitus.dk",
  },
  {
    navn: "Granhøjen / Gran Recovery & Health",
    kategori: "Botilbud",
    omraade: "voksne",
    maalgruppe: "Voksne med psykiatriske udfordringer",
    paragraffer: ["SEL §107", "SEL §108", "Beskæftigelsestilbud"],
    geografi: "Nordvestsjælland",
    web: "https://www.granhojen.dk",
  },
  {
    navn: "SUF — Den Sociale Udviklingsfond",
    kategori: "Matrikelløs indsats",
    omraade: "begge",
    maalgruppe: "Unge og voksne i udsatte positioner (nonprofit)",
    paragraffer: ["SEL §85", "Efterværn", "BOAS-mentor (autisme/ADHD)", "Botilbud"],
    geografi: "Landsdækkende (30+ afdelinger)",
    web: "https://suf.dk",
  },
  {
    navn: "Fonden Mariehjemmene",
    kategori: "Botilbud",
    omraade: "voksne",
    maalgruppe: "Voksne og ældre (selvejende nonprofit, ~20 hjem)",
    paragraffer: ["SEL §107", "SEL §108", "Plejehjem"],
    geografi: "Landsdækkende",
    web: "https://fonden.mariehjem.dk",
  },
  {
    navn: "Carelink Gruppen",
    kategori: "Vikarbureau",
    omraade: "begge",
    maalgruppe: "Bred velfærdskoncern — vikarer og sociale indsatser",
    paragraffer: ["Vikarer (alle faggrupper)", "Familiebehandling", "SEL §85"],
    geografi: "Landsdækkende",
    web: "https://carelink.dk",
  },
  {
    navn: "Powercare",
    kategori: "Vikarbureau",
    omraade: "begge",
    maalgruppe: "Bosteder og socialpsykiatri — SKI-rammeaftale",
    paragraffer: ["SOSU-vikarer", "Socialpædagogiske vikarer"],
    geografi: "Midtjylland, Hovedstaden, Sjælland",
    web: "https://www.powercare.dk",
  },
  {
    navn: "Comeback",
    kategori: "Matrikelløs indsats",
    omraade: "boern",
    maalgruppe: "Børn og unge",
    paragraffer: ["BL §32 kontaktperson", "Ungestøtte"],
    geografi: "København og Aarhus",
    web: "https://www.comeback.nu",
  },
  {
    navn: "Gravitas",
    kategori: "Matrikelløs indsats",
    omraade: "boern",
    maalgruppe: "Børn, unge og familier",
    paragraffer: ["Støttekontaktperson", "Familiebehandling"],
    geografi: "Sjælland",
    web: "https://gravitas.dk",
  },
  {
    navn: "Vejledernet",
    kategori: "Matrikelløs indsats",
    omraade: "boern",
    maalgruppe: "Familier — akut og anbringelsesforebyggende",
    paragraffer: ["Familiebehandling", "Stabiliserende indsats"],
    geografi: "Jylland og Sjælland",
    web: "https://vejledernet.dk",
  },
  {
    navn: "PVI — Pædagogisk Vikarindsats",
    kategori: "Vikarbureau",
    omraade: "voksne",
    maalgruppe: "Botilbud og døgninstitutioner",
    paragraffer: ["Vikarer", "SEL §85 bostøtte"],
    geografi: "Landsdækkende",
    web: "https://pvi.dk",
  },
  {
    navn: "FamiliePulsen",
    kategori: "Matrikelløs indsats",
    omraade: "boern",
    maalgruppe: "Familier",
    paragraffer: ["Støttekontaktperson", "Familiebehandling"],
    geografi: "Sjælland",
    web: "https://familiepulsen.dk",
  },
  {
    navn: "SOS Vikar",
    kategori: "Vikarbureau",
    omraade: "begge",
    maalgruppe: "Pleje- og socialområdet",
    paragraffer: ["SOSU-vikarer", "Pædagogiske vikarer"],
    geografi: "Landsdækkende",
    web: "https://www.sosvikar.dk",
  },
];
