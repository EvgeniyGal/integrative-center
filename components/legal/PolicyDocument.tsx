import {
  getLegalHtml,
  getTermageddonCss,
} from "@/lib/legal/policy-html";

export async function PolicyDocument({ slug }: { slug: string }) {
  const html = await getLegalHtml(slug);
  const cssHref = getTermageddonCss(slug);

  return (
    <>
      {cssHref ? (
        // Termageddon embed stylesheet — required for accordion/table layout
        // eslint-disable-next-line @next/next/no-css-tags
        <link rel="stylesheet" href={cssHref} />
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
