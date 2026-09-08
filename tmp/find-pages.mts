const candidates = [
  "https://hbintegrative.com/tests-and-diagnostics/",
  "https://hbintegrative.com/diagnostics/",
  "https://hbintegrative.com/iv-therapy/",
  "https://hbintegrative.com/hormone-balancing/",
  "https://hbintegrative.com/weight-management/",
  "https://hbintegrative.com/nutrition-analysis-and-detox/",
  "https://hbintegrative.com/nutritional-analysis/",
  "https://hbintegrative.com/pelvic-floor-therapies/",
  "https://hbintegrative.com/pelvic-floor/",
];

for (const url of candidates) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
      accept: "text/html",
    },
  });
  const type = res.headers.get("content-type") || "";
  console.log(
    res.status,
    type.startsWith("text/html") ? "HTML" : type,
    "->",
    res.url,
    "| from",
    url,
  );
}
