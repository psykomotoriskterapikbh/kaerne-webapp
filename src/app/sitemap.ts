import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.astridai.dk";
  const nu = new Date();
  return [
    { url: base, lastModified: nu, changeFrequency: "weekly", priority: 1 },
    { url: base + "/notat-hjaelp", lastModified: nu, changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/frist-beregner", lastModified: nu, changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/paragraf-oversaetter", lastModified: nu, changeFrequency: "monthly", priority: 0.8 },
    { url: base + "/om-os", lastModified: nu, changeFrequency: "monthly", priority: 0.5 },
    { url: base + "/privatliv", lastModified: nu, changeFrequency: "yearly", priority: 0.3 },
  ];
}
