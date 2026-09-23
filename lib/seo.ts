import type { Metadata } from "next";

import { site } from "@/lib/site";

export type PageSeo = {
  title: string;
  description: string;
  keywords: string[];
  path: string;
  image: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
};

export function pageMetadata({
  title,
  description,
  keywords,
  path,
  image,
  imageAlt,
  imageWidth = 1920,
  imageHeight = 1080,
}: PageSeo): Metadata {
  const url = path === "/" ? site.url : `${site.url}${path}`;

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: image,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: image,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt,
        },
      ],
    },
  };
}

export const pages = {
  home: {
    title: "Health & Beauty Integrative Center | Sarasota, Florida",
    description:
      "Private integrative medicine in the heart of Sarasota. Diagnostics, IV therapy, hormone balancing, nutrition, and aesthetic care that treat root causes—not only symptoms.",
    keywords: [
      "integrative medicine Sarasota",
      "Health and Beauty Integrative Center",
      "IV therapy Sarasota",
      "hormone balancing Florida",
      "functional medicine Sarasota",
      "Elina Belilovskiy ARNP",
      "holistic health Sarasota",
    ],
    path: "/",
    image: "/images/generated/hero.jpg",
    imageAlt:
      "Reception lounge at Health & Beauty Integrative Center in Sarasota",
  },
  about: {
    title: "About Our Practice | Elina Belilovskiy, ARNP | HBI Sarasota",
    description:
      "Meet founder Elina Belilovskiy, ARNP, MSN. Root-cause diagnostics, personalized plans, and integrative care in Sarasota, FL.",
    keywords: [
      "Elina Belilovskiy ARNP",
      "about Health and Beauty Integrative Center",
      "family nurse practitioner Sarasota",
      "integrative clinic team",
      "Regis College nurse practitioner",
    ],
    path: "/about",
    image: "/images/generated/about.jpg",
    imageAlt:
      "Interior of the Health & Beauty Integrative Center practice in Sarasota",
  },
  services: {
    title: "Services | IV, Hormones & Diagnostics | Sarasota",
    description:
      "Personalized integrative services in Sarasota: tests and diagnostics, IV therapy, hormone balancing, weight management, nutritional analysis, and pelvic floor therapies.",
    keywords: [
      "IV therapy Sarasota",
      "hormone balancing Sarasota",
      "weight management integrative",
      "nutritional analysis Florida",
      "pelvic floor therapy Sarasota",
      "diagnostic testing integrative medicine",
      "wellness clinic Sarasota",
    ],
    path: "/services",
    image: "/images/generated/reception.jpg",
    imageAlt:
      "Private consult setting for integrative services at HBI Sarasota",
  },
  patientResources: {
    title: "Patient Resources | Forms & Portal | HBI Sarasota",
    description:
      "Patient resources for Health & Beauty Integrative Center: office policies, patient forms, supplement recommendations, and secure portal access.",
    keywords: [
      "patient portal HBI Sarasota",
      "patient resources integrative medicine",
      "prepare for consult Sarasota",
      "Health and Beauty Integrative Center forms",
      "HBIC office policies",
    ],
    path: "/patient-resources",
    image: "/images/generated/reception.jpg",
    imageAlt: "Patient resources at Health & Beauty Integrative Center",
  },
  officePolicies: {
    title: "Office Policies & Patient Guidelines | HBI Sarasota",
    description:
      "Review Health & Beauty Integrative Center office policies: appointments, cancellations, patient portal etiquette, and guidelines before your visit.",
    keywords: [
      "HBIC office policies",
      "patient guidelines Sarasota",
      "appointment cancellation policy",
      "patient portal messaging",
    ],
    path: "/patient-resources/office-policies",
    image: "/images/generated/care.jpg",
    imageAlt: "Office policies at Health & Beauty Integrative Center",
  },
  supplements: {
    title: "Supplements & Recommended Products | HBI Sarasota",
    description:
      "Explore HBIC-recommended supplements, trusted wellness brands, and curated Amazon products selected to support your personalized care plan.",
    keywords: [
      "HBIC recommended supplements",
      "integrative medicine supplements Sarasota",
      "practitioner recommended brands",
      "wellness products Amazon",
    ],
    path: "/patient-resources/supplements",
    image: "/images/generated/supplements-hero.jpg",
    imageAlt: "Supplement recommendations at Health & Beauty Integrative Center",
  },
  news: {
    title: "News & Updates | Health & Beauty Integrative Center",
    description:
      "Clinic news, wellness updates, and announcements from Health & Beauty Integrative Center in Sarasota, Florida.",
    keywords: [
      "HBI Sarasota news",
      "integrative medicine updates",
      "Health and Beauty Integrative Center blog",
      "wellness news Sarasota",
    ],
    path: "/news",
    image: "/images/generated/exterior.jpg",
    imageAlt: "Exterior of Health & Beauty Integrative Center in Sarasota",
  },
  contact: {
    title: "Request a Consult | Health & Beauty Integrative Center",
    description:
      "Send a short note to request a consult with Health & Beauty Integrative Center in Sarasota. Call (941) 933-9474. Monday–Friday, 9 AM–5 PM.",
    keywords: [
      "HBI Sarasota contact",
      "request a consult Sarasota",
      "(941) 933-9474",
      "book consult Sarasota",
      "Health and Beauty Integrative Center contact form",
    ],
    path: "/contact",
    image: "/images/generated/exterior.jpg",
    imageAlt:
      "Professional medical building serving Health & Beauty Integrative Center in Sarasota",
  },
  location: {
    title: "Location & Hours | Health & Beauty Integrative Center",
    description:
      "Visit our Sarasota office at 4370 S Tamiami Trail, Suite 151, or request a secure telehealth consult in eligible states. Call (941) 933-9474.",
    keywords: [
      "HBI Sarasota location",
      "4370 S Tamiami Trail Suite 151",
      "integrative clinic Sarasota hours",
      "Health and Beauty Integrative Center address",
      "directions to HBI Sarasota",
      "telehealth Sarasota",
    ],
    path: "/location",
    image: "/images/generated/exterior.jpg",
    imageAlt:
      "Professional medical building serving Health & Beauty Integrative Center in Sarasota",
  },
  privacyPolicy: {
    title: "Privacy Policy | Health & Beauty Integrative Center",
    description:
      "Privacy Policy for Health and Beauty Integrative Center LLC — how we collect, use, and protect personal information on hbintegrative.com.",
    keywords: [
      "HBI privacy policy",
      "Health and Beauty Integrative Center privacy",
      "website privacy Sarasota",
    ],
    path: "/privacy-policy",
    image: "/images/generated/reception.jpg",
    imageAlt: "Health & Beauty Integrative Center privacy information",
  },
  cookiePolicy: {
    title: "Cookie Policy | Health & Beauty Integrative Center",
    description:
      "Cookie Policy for Health and Beauty Integrative Center — cookies and similar technologies used on hbintegrative.com.",
    keywords: [
      "HBI cookie policy",
      "Health and Beauty Integrative Center cookies",
      "website cookies Sarasota",
    ],
    path: "/cookie-policy",
    image: "/images/generated/reception.jpg",
    imageAlt: "Health & Beauty Integrative Center cookie information",
  },
  hipaaNotice: {
    title: "HIPAA Notice | Health & Beauty Integrative Center",
    description:
      "Notice of Privacy Practices for Health and Beauty Integrative Center — how protected health information may be used and disclosed.",
    keywords: [
      "HBI HIPAA notice",
      "Notice of Privacy Practices",
      "PHI Health and Beauty Integrative Center",
    ],
    path: "/hipaa-notice",
    image: "/images/generated/reception.jpg",
    imageAlt: "Health & Beauty Integrative Center HIPAA notice",
  },
} satisfies Record<string, PageSeo>;
