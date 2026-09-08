async function check(url: string) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
      accept: "text/html,application/xhtml+xml",
    },
  });
  const type = res.headers.get("content-type");
  const text = await res.text();
  console.log({
    url,
    final: res.url,
    status: res.status,
    type,
    start: text.slice(0, 80).replace(/\n/g, " "),
    hasH1: /<h1/i.test(text),
    hasP: /<p/i.test(text),
  });
}

await check("https://hbintegrative.com/health-and-wellness/tests-and-diagnostics/");
await check("https://hbintegrative.com/iv-therapy/");
await check("https://hbintegrative.com/health-and-wellness/iv-therapy/");
