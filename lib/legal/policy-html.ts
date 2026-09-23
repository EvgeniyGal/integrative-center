import { readFile } from "fs/promises";
import path from "path";
import { cacheLife, cacheTag } from "next/cache";

const TERMAGEDDON_CSS: Record<string, string> = {
  "privacy-policy":
    "https://policies.termageddon.com/api/embed_css/UTFGdVIxTXJhazVHYVZKNFVtYzlQUT09.css",
  "cookie-policy":
    "https://policies.termageddon.com/api/embed_css/YVhaSVdYUlVNWFprYzBsd1VtYzlQUT09.css",
};

function stripEmptyParagraphs(html: string) {
  return html
    // <p></p>, <p>&nbsp;</p>, whitespace-only
    .replace(/<p(\s[^>]*)?>\s*(?:&nbsp;|&#160;|\u00a0|\s)*<\/p>/gi, "")
    // <p><span…>&nbsp;</span></p> (Word/HIPAA export spacers)
    .replace(
      /<p(\s[^>]*)?>(?:\s*<span\b[^>]*>\s*(?:&nbsp;|&#160;|\u00a0|\s)*<\/span>\s*)+<\/p>/gi,
      "",
    );
}

export async function getLegalHtml(slug: string) {
  "use cache";
  cacheTag(`legal-${slug}-v6`);
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

  return linkifyPhoneNumbers(
    stripEmptyParagraphs(withoutTitle.replace(/<link\b[^>]*>/gi, "")),
  );
}

function linkifyPhoneNumbers(html: string) {
  return html.replace(
    /(?<!["\w])\((\d{3})\)\s*(\d{3})-(\d{4})(?![^<]*>|[^<]*<\/a>)/g,
    '<a href="tel:+1$1$2$3">($1) $2-$3</a>',
  );
}

export function getTermageddonCss(slug: string) {
  return TERMAGEDDON_CSS[slug] ?? null;
}
