import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "@id": `${site.url}/#business`,
        name: site.name,
        description: site.description,
        telephone: site.phone,
        url: site.url,
        image: absoluteUrl("/images/logo-transparent.png"),
        address: {
          "@type": "PostalAddress",
          streetAddress: `${site.address.line1}, ${site.address.line2}`,
          addressLocality: site.address.city,
          addressRegion: site.address.state,
          postalCode: site.address.zip,
          addressCountry: "US",
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "17:00",
        },
        sameAs: [site.social.instagram, site.social.facebook],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description: site.description,
        publisher: { "@id": `${site.url}/#business` },
        inLanguage: "en-US",
      },
    ],
  };

  return <JsonLdScript data={data} />;
}
