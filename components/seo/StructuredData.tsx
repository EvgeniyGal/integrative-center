import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  absoluteUrl,
  articleAuthorJsonLd,
  breadcrumbJsonLd,
  clinicPublisherJsonLd,
} from "@/lib/seo";
import { site } from "@/lib/site";

export function ServiceJsonLd({
  name,
  description,
  path,
  image,
}: {
  name: string;
  description: string;
  path: string;
  image?: string | null;
}) {
  const url = absoluteUrl(path);
  return (
    <>
      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name,
          description,
          url,
          image: image ? absoluteUrl(image) : undefined,
          provider: clinicPublisherJsonLd(),
          areaServed: {
            "@type": "City",
            name: site.address.city,
          },
        }}
      />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: name, path },
        ])}
      />
    </>
  );
}

export function ArticleJsonLd({
  title,
  description,
  path,
  image,
  publishedAt,
  modifiedAt,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  publishedAt?: Date | string | null;
  modifiedAt?: Date | string | null;
}) {
  const url = absoluteUrl(path);
  const published =
    publishedAt instanceof Date
      ? publishedAt.toISOString()
      : publishedAt ?? undefined;
  const modified =
    modifiedAt instanceof Date
      ? modifiedAt.toISOString()
      : modifiedAt ?? published;

  return (
    <>
      <JsonLdScript
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: title,
          description,
          image: image ? absoluteUrl(image) : undefined,
          datePublished: published,
          dateModified: modified,
          author: articleAuthorJsonLd(),
          publisher: clinicPublisherJsonLd(),
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
          },
          url,
        }}
      />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "News", path: "/news" },
          { name: title, path },
        ])}
      />
    </>
  );
}

export function FaqJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  if (items.length === 0) return null;

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}

export function ListingBreadcrumbJsonLd({
  name,
  path,
}: {
  name: string;
  path: string;
}) {
  return (
    <JsonLdScript
      data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name, path },
      ])}
    />
  );
}
