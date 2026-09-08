export const site = {
  name: "Health & Beauty Integrative Center",
  shortName: "HBI",
  tagline: "Greater Sarasota’s private integrative practice",
  description:
    "Located in the heart of Sarasota, Florida, Health and Beauty Integrative Center combines holistic health therapies with science-backed treatments to support the physical and mental health of patients of all ages.",
  url: "https://hbintegrative.com",
  phone: "(941) 933-9474",
  phoneHref: "tel:+19419339474",
  email: "info@hbintegrative.com",
  address: {
    line1: "4370 S Tamiami Trail",
    line2: "Suite 151",
    city: "Sarasota",
    state: "FL",
    zip: "34231",
    full: "4370 S Tamiami Trail, Suite 151, Sarasota, FL 34231",
  },
  hours: {
    summary: "Monday–Friday, 9 AM–5 PM",
    note: "Appointments recommended",
    days: [
      { day: "Monday – Friday", time: "9:00 AM – 5:00 PM" },
      { day: "Saturday – Sunday", time: "Closed" },
    ],
  },
  portalUrl: "https://phr.charmtracker.com/",
  mapsEmbed:
    "https://www.google.com/maps?q=4370+S+Tamiami+Trail+Suite+151+Sarasota+FL+34231&output=embed",
  mapsLink:
    "https://www.google.com/maps/search/?api=1&query=4370+S+Tamiami+Trail+Suite+151+Sarasota+FL+34231",
  social: {
    instagram: "https://www.instagram.com/health.beauty.center.sarasota/",
    facebook: "https://www.facebook.com/hbicsarasota",
  },
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/patient-resources", label: "Patient Resources" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/patient-resources", label: "Patient Resources" },
  { href: "/contact", label: "Contact" },
] as const;

export const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/hipaa-notice", label: "HIPAA Notice" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/accessibility", label: "Accessibility Statement" },
] as const;

export const tickerItems = [
  "Fully licensed in FL",
  "MA",
  "IL",
  "Coming soon in NJ",
  "CL",
  "Telehealth Available",
  "Free 15-Minute Consultation",
] as const;

export const practiceIntro = {
  eyebrow: "Our Practice",
  title: "Functional and traditional medicine, held to a clinical standard.",
  paragraphs: [
    "Located in the heart of Sarasota, Florida, Health and Beauty Integrative Center combines modern functional and traditional health therapies with science-backed treatments to support the physical, emotional, and aesthetic needs of our clients. Using a variety of modalities, we address the root causes of our patients’ issues while helping to reduce their symptoms.",
    "Every patient is unique. No matter your concern, our dedicated providers listen to your needs, and use the latest diagnostic testing to identify the source of your issues. Once we assess your health factors, we develop comprehensive treatment plans personalized to your needs. During your treatments, we monitor your progress and adjust the process based on your body’s response.",
    "Backed by years of experience, we provide a wide range of health therapies, including Hormone Balancing for Men and Women, Weight Management, Nutritional Analysis, Detox, and more...",
    "At Health and Beauty Integrative Center, we offer Skin Care and Cosmetic Services, including PRP Facials, Micro-Needling, and Facials with RF and Intense Pulsed Light (IPL) treatment. From our extensive experience in medicine and cosmetology, we know that underlying health conditions cause most skin issues. That’s why we offer personalized skincare solutions - combining aesthetic and health therapies to help you feel and look your best, inside and out.",
  ],
} as const;

export const homeQuestions = {
  eyebrow: "Questions",
  title: "Functional and traditional medicine, held to a clinical standard.",
  items: [
    {
      number: "1",
      question: "1 question",
      answer:
        "1 queation queation queation queation queation queationqueation",
    },
    {
      number: "2",
      question: "2 question",
      answer:
        "2 queation queation queation queation queation queationqueation",
    },
    {
      number: "3",
      question: "3 question",
      answer:
        "3 queation queation queation queation queation queationqueation",
    },
    {
      number: "4",
      question: "4 question",
      answer:
        "4 queation queation queation queation queation queationqueation",
    },
  ],
} as const;

export const homeNews = {
  eyebrow: "Questions",
  title: "News and Articles",
  body: "Stay informed with expert insights on wellness, prevention, and integrative care.",
  items: [
    {
      slug: "testosterone-replacement-therapy",
      label: "Hormones",
      title:
        "The Power of Testosterone: A Comprehensive Guide to Testosterone Replacement Therapy (TRT)",
      excerpt:
        "Patient-specific formulas of hydration, vitamins, minerals, amino acids, and antioxidants — delivered directly into the bloodstream.",
      image: "/images/generated/hormone.jpg",
    },
    {
      slug: "iv-therapy-insights",
      label: "Wellness",
      title:
        "The Power of Testosterone: A Comprehensive Guide to Testosterone Replacement Therapy (TRT)",
      excerpt:
        "Patient-specific formulas of hydration, vitamins, minerals, amino acids, and antioxidants — delivered directly into the bloodstream.",
      image: "/images/generated/iv.jpg",
    },
    {
      slug: "integrative-care-guide",
      label: "Prevention",
      title:
        "The Power of Testosterone: A Comprehensive Guide to Testosterone Replacement Therapy (TRT)",
      excerpt:
        "Patient-specific formulas of hydration, vitamins, minerals, amino acids, and antioxidants — delivered directly into the bloodstream.",
      image: "/images/generated/care.jpg",
    },
  ],
} as const;

export const reviews = [
  {
    title: "Incredibly skilled",
    quote:
      "They are incredibly skilled, very knowledgeable, and you can tell they care about her patients. At their office everyone is very courteous and efficient. I have recommended them to my family and hope you will reach out to see how they can help you improve your health.",
    name: "Irena",
    source: "Google Review",
  },
  {
    title: "Highly recommend",
    quote:
      "I had a bit of a cold and went to this place last night to get an IV fluids and vitamins! Almost instant energy boost and much faster recovery. Going on a bike ride this morning! Highly recommend!",
    name: "Slava B.",
    source: "Google Review",
  },
  {
    title: "Warm and welcoming",
    quote:
      "The office is warm and welcoming, the front desk receptionists are helpful and knowledgeable and always happy to give you a cup of coffee, a smile and a next appointment.",
    name: "Tamara F.",
    source: "Google Review",
  },
] as const;

export const carePath = [
  {
    step: "01",
    title: "Listen",
    body: "Every patient is unique. We begin by hearing your story in full — no complaint goes unnoticed.",
  },
  {
    step: "02",
    title: "Diagnose",
    body: "Using advanced diagnostic testing, we identify the source of your symptoms rather than treating the surface.",
  },
  {
    step: "03",
    title: "Personalize",
    body: "We design a comprehensive plan around your biology, lifestyle, and goals — not a protocol off the shelf.",
  },
  {
    step: "04",
    title: "Monitor",
    body: "During treatment we track your body’s response and refine the plan so progress stays steady and durable.",
  },
] as const;

export const team = [
  {
    name: "Elina Belilovskiy, ARNP, MSN",
    role: "Founder & Family Medicine Nurse Practitioner",
    image: "/images/staff/elina.jpg",
    bio: "Elina holds an autonomous Nurse Practitioner license and leads Health & Beauty Integrative Center. She received medical training in Russia and the United States, graduating from Regis College in Weston, MA, in 2001. Her private practice spans Integrative Medicine, Women’s Health, and Urology, with a focus on diagnosing root causes and applying physiological, natural, and anti-aging approaches.",
  },
  {
    name: "Yelena Spivak",
    role: "Licensed Aesthetician",
    image: "/images/staff/yelena.jpg",
    bio: "Yelena brings more than three decades of skincare expertise to the practice. She has trained other professionals on IPL, RF, and related treatments, and works with an individual approach to restore skin health with precision and care.",
  },
] as const;

export const modalities = [
  "Hormone balancing for men and women",
  "Weight management",
  "Nutritional analysis & detox",
  "IV therapy",
  "PRP / PRF",
  "Microneedling",
  "Facials with RF & IPL",
] as const;
