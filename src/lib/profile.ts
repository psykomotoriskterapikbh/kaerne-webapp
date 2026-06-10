// Astrid brugerprofil — gemmes KUN lokalt i browseren (localStorage).
// Ingen persondata forlader enheden permanent; profilen sendes blot med i den
// enkelte samtale, så Astrid kan tilpasse sig brugeren. Dette holder GDPR-byrden lav.

export type AstridProfile = {
  navn: string;
  rolle: string;
  omraade: string;
  region: string;
  stil: string; // "kort" | "uddybende"
};

const KEY = "astrid_profile_v1";

export const TOM_PROFIL: AstridProfile = {
  navn: "",
  rolle: "",
  omraade: "",
  region: "",
  stil: "",
};

export function loadProfile(): AstridProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<AstridProfile>;
    return { ...TOM_PROFIL, ...p };
  } catch {
    return null;
  }
}

export function saveProfile(p: AstridProfile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
    window.dispatchEvent(new Event("astrid-profile-changed"));
  } catch {
    // ignorér hvis localStorage er utilgængelig
  }
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("astrid-profile-changed"));
  } catch {
    // ignorér
  }
}

export function hasProfile(p: AstridProfile | null): boolean {
  if (!p) return false;
  return Boolean(p.navn || p.rolle || p.omraade || p.region || p.stil);
}
