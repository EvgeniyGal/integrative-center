import { config } from "dotenv";
import { put } from "@vercel/blob";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { eq } from "drizzle-orm";
import fs from "node:fs/promises";
import path from "node:path";

config({ path: ".env.local" });
config({ path: ".env" });

type ScrapedService = {
  slug: string;
  title: string;
  sourceUrl: string;
  listingImageUrl: string;
  body: string[];
  eyebrow: string;
};

const SERVICES: Array<{
  slug: string;
  titleHint: string;
  eyebrow: string;
  urls: string[];
  listingImage: string;
}> = [
  {
    slug: "diagnostics",
    titleHint: "Tests and Diagnostics",
    eyebrow: "Clarity first",
    urls: ["https://hbintegrative.com/diagnostics/"],
    listingImage:
      "https://hbintegrative.com/wp-content/uploads/2023/04/Tests-and-Diagnostics-1.png",
  },
  {
    slug: "iv-therapy",
    titleHint: "IV Therapy",
    eyebrow: "Direct restoration",
    urls: ["https://hbintegrative.com/iv-therapy/"],
    listingImage:
      "https://hbintegrative.com/wp-content/uploads/2023/04/Iv-Therapy-3.png",
  },
  {
    slug: "hormone-balancing",
    titleHint: "Hormone Balancing",
    eyebrow: "A precise equilibrium",
    urls: ["https://hbintegrative.com/hormone-balancing/"],
    listingImage:
      "https://hbintegrative.com/wp-content/uploads/2023/04/Hormone-Balancing-2.png",
  },
  {
    slug: "weight-management",
    titleHint: "Weight Management",
    eyebrow: "Physiology, not fashion",
    urls: ["https://hbintegrative.com/weight-management/"],
    listingImage:
      "https://hbintegrative.com/wp-content/uploads/2023/04/Weight-Management-2.png",
  },
  {
    slug: "nutritional-analysis",
    titleHint: "Nutrition Analysis and Detox",
    eyebrow: "The metabolic foundation",
    urls: ["https://hbintegrative.com/nutrition-analysis-and-detox/"],
    listingImage:
      "https://hbintegrative.com/wp-content/uploads/2023/04/Nutritional-Analysis-1.png",
  },
  {
    slug: "pelvic-floor",
    titleHint: "Pelvic Floor Therapies",
    eyebrow: "Quiet strength",
    urls: ["https://hbintegrative.com/pelvic-floor/"],
    listingImage:
      "https://hbintegrative.com/wp-content/uploads/2023/04/Pelvic-Floor-Therapy-1.png",
  },
];

function decodeEntities(text: string) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(html: string) {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+\n/g, "\n")
      .replace(/\n\s+/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim(),
  );
}

function extractParagraphs(html: string) {
  const skip =
    /cookie|subscribe|newsletter|copyright|patient portal|instagram|validation purposes|first last|email\(required\)|google review|ask a question|privacy policy|hipaa|all rights reserved|©\s*\d{4}|tamiami trail|suite \d+|sarasota,\s*fl|directions\s*>/i;

  const paras = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => stripTags(m[1]))
    .map((t) => t.replace(/\s+/g, " ").trim())
    .filter((t) => t.length >= 40 && !skip.test(t))
    // drop review quotes
    .filter((t) => !/^[\"“]/.test(t))
    // drop incomplete list intros without following content in the same paragraph
    .filter((t) => !/:\s*$/.test(t));

  // de-dupe while preserving order
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const p of paras) {
    const key = p.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(p);
  }
  return unique.slice(0, 12);
}

function extractTitle(html: string, fallback: string) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  if (h1) {
    const t = stripTags(h1).replace(/\s+/g, " ").trim();
    if (t) return t;
  }
  const og = html.match(
    /property=["']og:title["']\s+content=["']([^"']+)["']/i,
  )?.[1];
  if (og) {
    return decodeEntities(og.replace(/\s*[|\-–].*$/, "").trim()).replace(
      /\s+/g,
      " ",
    );
  }
  return fallback;
}

async function fetchHtml(url: string) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; HBIContentSync/1.0; +https://hbintegrative.com)",
      accept: "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const type = res.headers.get("content-type") || "";
  if (!type.includes("text/html") && !type.includes("application/xhtml")) {
    throw new Error(`Not HTML for ${url}: ${type}`);
  }
  return { url: res.url, html: await res.text() };
}

async function fetchFirstHtml(urls: string[]) {
  let lastError: unknown;
  for (const url of urls) {
    try {
      return await fetchHtml(url);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function uploadImage(sourceUrl: string, slug: string) {
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`Image fetch failed ${sourceUrl}: ${res.status}`);
  const contentType = res.headers.get("content-type") || "image/png";
  const ext = contentType.includes("jpeg")
    ? "jpg"
    : contentType.includes("webp")
      ? "webp"
      : "png";
  const bytes = Buffer.from(await res.arrayBuffer());
  const blob = await put(`services/${slug}.${ext}`, bytes, {
    access: "public",
    contentType,
    addRandomSuffix: true,
  });
  return blob.url;
}

async function loadAdminOpenAiKey() {
  const { db } = await import("../lib/db");
  const { SITE_SETTINGS_ID, siteSettings } = await import("../lib/db/schema");
  const { decryptSecret } = await import("../lib/ai/encrypt");
  const rows = await db
    .select({ openaiApiKeyEncrypted: siteSettings.openaiApiKeyEncrypted })
    .from(siteSettings)
    .where(eq(siteSettings.id, SITE_SETTINGS_ID))
    .limit(1);
  const encrypted = rows[0]?.openaiApiKeyEncrypted;
  if (!encrypted) {
    throw new Error("OpenAI API key is not set in Admin → Settings.");
  }
  const key = decryptSecret(encrypted).trim();
  if (!key) {
    throw new Error("OpenAI API key is not set in Admin → Settings.");
  }
  return key;
}

async function generateSummary(
  title: string,
  body: string[],
  client: ReturnType<typeof createOpenAI>,
) {
  const { text } = await generateText({
    model: client("gpt-4.1-mini"),
    prompt: `Write one concise summary sentence (max 28 words) for a clinic service page.
Tone: calm, clinical, welcoming. No marketing hype, no emojis.
Do not invent treatments not present in the source.
Title: ${title}
Source paragraphs:
${body.join("\n\n")}`,
  });
  return text.replace(/^["']|["']$/g, "").trim();
}

async function scrapeAll(): Promise<ScrapedService[]> {
  const out: ScrapedService[] = [];
  for (const service of SERVICES) {
    const { url, html } = await fetchFirstHtml(service.urls);
    const title = extractTitle(html, service.titleHint);
    const body = extractParagraphs(html);
    if (body.length === 0) {
      throw new Error(`No body paragraphs found for ${service.slug} (${url})`);
    }
    out.push({
      slug: service.slug,
      title,
      sourceUrl: url,
      listingImageUrl: service.listingImage,
      body,
      eyebrow: service.eyebrow,
    });
    console.log(`Scraped ${service.slug}: ${body.length} paragraphs from ${url}`);
  }
  return out;
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL missing");
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN missing");
  }

  const openai = createOpenAI({ apiKey: await loadAdminOpenAiKey() });

  const scraped = await scrapeAll();
  await fs.mkdir("tmp/old-site", { recursive: true });
  await fs.writeFile(
    path.join("tmp/old-site", "scraped.json"),
    JSON.stringify(scraped, null, 2),
  );

  const { db } = await import("../lib/db");
  const { services } = await import("../lib/db/schema");

  let sortOrder = 0;
  for (const item of scraped) {
    console.log(`Uploading image for ${item.slug}...`);
    const imageUrl = await uploadImage(item.listingImageUrl, item.slug);
    console.log(`Generating summary for ${item.slug}...`);
    const summary = await generateSummary(item.title, item.body, openai);

    const existing = await db.query.services.findFirst({
      where: eq(services.slug, item.slug),
    });

    const payload = {
      title: item.title,
      eyebrow: item.eyebrow,
      summary,
      body: item.body,
      imageUrl,
      visible: true,
      showOnHome: item.slug !== "diagnostics",
      sortOrder,
      updatedAt: new Date(),
    };

    if (existing) {
      await db.update(services).set(payload).where(eq(services.id, existing.id));
      console.log(`Updated service ${item.slug}`);
    } else {
      await db.insert(services).values({
        slug: item.slug,
        ...payload,
      });
      console.log(`Inserted service ${item.slug}`);
    }
    sortOrder += 1;
  }

  // Hide non-wellness extras like skin-care if present (not on old wellness page)
  const wellnessSlugs = SERVICES.map((s) => s.slug);
  const all = await db.select().from(services);
  for (const row of all) {
    if (!wellnessSlugs.includes(row.slug) && row.visible) {
      await db
        .update(services)
        .set({ visible: false, showOnHome: false, updatedAt: new Date() })
        .where(eq(services.id, row.id));
      console.log(`Hid non-wellness service: ${row.slug}`);
    }
  }

  console.log("Done syncing services from old site.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
