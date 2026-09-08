import fs from "node:fs";

for (const f of [
  "diagnostics",
  "iv-therapy",
  "weight-management",
  "pelvic-floor",
]) {
  const html = fs.readFileSync(`tmp/old-site/${f}.html`, "utf8");
  console.log(f, "len", html.length);
  console.log("  start", JSON.stringify(html.slice(0, 200)));
  console.log(
    "  h1/img/p",
    /<h1/i.test(html),
    /<img/i.test(html),
    /<p/i.test(html),
  );
  const ogTitle = html.match(/property="og:title" content="([^"]+)"/);
  const ogDesc = html.match(/property="og:description" content="([^"]+)"/);
  const ogImg = html.match(/property="og:image" content="([^"]+)"/);
  console.log("  ogTitle", ogTitle?.[1]);
  console.log("  ogDesc", ogDesc?.[1]?.slice(0, 120));
  console.log("  ogImg", ogImg?.[1]);
  // Look for base64 or compressed content
  console.log("  looksBinary", html.includes("\u0000"));
  console.log("  contentType hints", html.includes("gzip"), html.includes("<!DOCTYPE"));
}
