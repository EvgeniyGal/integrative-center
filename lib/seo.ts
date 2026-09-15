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
      "Meet founder Elina Belilovskiy, ARNP, MSN, and licensed aesthetician Yelena Spivak. Root-cause diagnostics, personalized plans, and integrative care in Sarasota, FL.",
    keywords: [
      "Elina Belilovskiy ARNP",
      "Yelena Spivak aesthetician",
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
    title: "Contact Health & Beauty Integrative Center | Sarasota, FL",
    description:
      "Request a consult at 4370 S Tamiami Trail, Suite 151, Sarasota, FL 34231. Call (941) 933-9474. Monday–Friday, 9 AM–5 PM. Appointments recommended.",
    keywords: [
      "HBI Sarasota contact",
      "4370 S Tamiami Trail Suite 151",
      "(941) 933-9474",
      "integrative clinic Sarasota hours",
      "book consult Sarasota",
      "Health and Beauty Integrative Center address",
    ],
    path: "/contact",
    image: "/images/generated/exterior.jpg",
    imageAlt:
      "Professional medical building serving Health & Beauty Integrative Center in Sarasota",
  },
} satisfies Record<string, PageSeo>;
