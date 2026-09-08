import fs from "node:fs";
import path from "node:path";

const dir = "tmp/old-site";
const files = [
  "diagnostics",
  "iv-therapy",
  "hormone-balancing",
  "weight-management",
  "nutritional-analysis",
  "pelvic-floor",
  "listing",
];

function stripTags(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/\s+/g, " ")
    .trim();
}

for (const f of files) {
  const html = fs.readFileSync(path.join(dir, `${f}.html`), "utf8");
  const title = stripTags((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || "");
  const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)]
    .map((m) => m[1])
    .filter(
      (u) =>
        !u.includes("data:") &&
        !/logo|sprite|icon|avatar|gravatar|emoji|wp-includes/i.test(u),
    );
  const unique = [...new Set(imgs)].slice(0, 10);
  console.log(`\n=== ${f} ===`);
  console.log("title:", title);
  console.log("imgs:", unique);

  // try fusion builder / entry content paragraphs
  const contentMatch =
    html.match(
      /<div[^>]+class="[^"]*(?:post-content|entry-content|fusion-text)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    ) || [];
  const paras = [
    ...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi),
  ]
    .map((m) => stripTags(m[1]))
    .filter((t) => t.length > 60 && !/cookie|subscribe|newsletter|copyright/i.test(t))
    .slice(0, 8);
  console.log("paras:", paras.length);
  paras.forEach((p, i) => console.log(`  [${i}] ${p.slice(0, 140)}...`));
}
