import { readFile } from "fs/promises";
import path from "path";
import { cacheLife, cacheTag } from "next/cache";

const TERMAGEDDON_CSS: Record<string, string> = {
  "privacy-policy":
    "https://policies.termageddon.com/api/embed_css/UTFGdVIxTXJhazVHYVZKNFVtYzlQUT09.css",
  "cookie-policy":
    "https://policies.termageddon.com/api/embed_css/YVhaSVdYUlVNWFprYzBsd1VtYzlQUT09.css",
};

export async function getLegalHtml(slug: string) {
  "use cache";
  cacheTag(`legal-${slug}-v2`);
  cacheLife("max");

  const filePath = path.join(process.cwd(), "content/legal", `${slug}.html`);
  const html = await readFile(filePath, "utf8");

  // Drop Termageddon title — page shell already shows the document title.
  const withoutTitle =
    slug === "privacy-policy"
      ? html.replace(/<h2\b[^>]*>\s*Privacy Policy\s*<\/h2>/i, "")
      : slug === "cookie-policy"
        ? html.replace(
            /<h2\b[^>]*>\s*Cookie Policy(?: and Consent Tool)?\s*<\/h2>/i,
            "",
          )
        : html;

  return withoutTitle.replace(/<link\b[^>]*>/gi, "");
}

export function getTermageddonCss(slug: string) {
  return TERMAGEDDON_CSS[slug] ?? null;
}
