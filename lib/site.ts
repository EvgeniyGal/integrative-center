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

export const servicesIntro = {
  title: "Feel and look your best at any age.",
  paragraphs: [
    "Maintaining our health means providing our body with the care it needs, so we can feel and look our best at any age. Since each person is unique, at Health & Beauty Integrative Center, we provide personalized health and wellness care tailored to your specific needs, offering a wide range of health and wellness services to improve your physical, mental, and emotional well-being.",
    "Improving your health begins with you. Taking the next step begins with us. Access our experienced team of health and wellness experts—using the latest technology and innovative therapies, we offer patients a customized care experience, addressing your individual concerns to help you achieve your health goals.",
  ],
} as const;

export const homeQuestions = {
  eyebrow: "Questions",
  title: "Functional and traditional medicine, held to a clinical standard.",
  items: [
    {
      number: "1",
      question: "What makes your approach integrative?",
      answer:
        "We combine modern functional and traditional therapies with science-backed care. Diagnostic testing helps us identify root causes, then we build a personalized plan that addresses your symptoms and the systems behind them.",
    },
    {
      number: "2",
      question: "What should I expect at my first visit?",
      answer:
        "Your visit begins with listening carefully to your concerns, followed by a clinical evaluation. When needed, we order targeted labs—blood, urine, or saliva, fasting and after a meal—so your treatment plan reflects how your body actually works.",
    },
    {
      number: "3",
      question: "Which services do you offer in Sarasota?",
      answer:
        "Care includes tests and diagnostics, IV therapy, hormone balancing, weight management, nutritional analysis and detox, pelvic floor therapies, and aesthetic treatments such as facials, microneedling, and intense pulsed light.",
    },
    {
      number: "4",
      question: "Who will I see for care?",
      answer:
        "Health & Beauty Integrative Center is led by Elina Belilovskiy, ARNP. Our team cares for patients across a wide range of health and wellness concerns, using the latest diagnostic tools and individualized treatment plans.",
    },
    {
      number: "5",
      question: "How does hormone balancing work here?",
      answer:
        "We start with accurate assessment—often blood, urine, or saliva testing timed to your cycle when needed. Bioidentical hormone therapy is then tailored to your levels, lifestyle, and goals, with ongoing monitoring as your body responds.",
    },
    {
      number: "6",
      question: "Is IV therapy customized for each patient?",
      answer:
        "Yes. After evaluating your needs, we recommend a formula that may include vitamins, minerals, amino acids, and antioxidants delivered directly into the bloodstream. Infusions typically take thirty minutes to an hour and a half in the clinic.",
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
  {
    title: "Finally felt heard",
    quote:
      "I spent years being told my labs were “normal” while I still felt exhausted. Here they took time to listen, ordered the right tests, and built a plan that actually fits my life. I feel like myself again.",
    name: "Maria K.",
    source: "Google Review",
  },
  {
    title: "Clear hormone plan",
    quote:
      "Hormone balancing was explained in plain language, not rushed. They monitored my progress and adjusted carefully. Sleep, mood, and energy have all improved more than I expected.",
    name: "David R.",
    source: "Google Review",
  },
  {
    title: "Weight care that stuck",
    quote:
      "This was not another fad diet. They looked at hormones and nutrition together and gave me a routine I could keep. The weight came off steadily, and more importantly it has stayed off.",
    name: "Elena M.",
    source: "Google Review",
  },
  {
    title: "Thorough and kind",
    quote:
      "From the front desk to the provider visit, everyone was professional and kind. Diagnostics were thorough, and I left with a clear next step instead of another shrug. Grateful we found this clinic in Sarasota.",
    name: "James P.",
    source: "Google Review",
  },
  {
    title: "IV therapy that helped",
    quote:
      "I came in wiped out after travel and left with real energy again. The IV was customized, the room was calm, and the staff checked on me throughout. I will be back when I need a reset.",
    name: "Nina S.",
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

export const aboutPolicies = {
  eyebrow: "Policies",
  title: "Clear policies for respectful, efficient care.",
  body: "To help us stay on schedule and provide appropriate care to every patient, please review these key practice policies.",
  readMoreHref: "/patient-resources",
  items: [
    {
      title: "Late arrivals",
      body: "Patients arriving more than 15 minutes late may have their appointment canceled and may need to reschedule.",
    },
    {
      title: "No-shows",
      body: "Missed appointments without prior notice may result in a charge according to the practice’s cancellation and no-show policy.",
    },
    {
      title: "Portal messages",
      body: "Patient portal messages are intended for brief, limited questions. Questions requiring medical assessment, detailed advice, or treatment recommendations may be considered a consultation and billed accordingly.",
    },
    {
      title: "Appointments & cancellations",
      body: "Please notify the office as early as possible if you need to cancel or reschedule your appointment.",
    },
  ],
} as const;

export const modalities = [
  "Hormone balancing for men and women",
  "Weight management",
  "Nutritional analysis & detox",
  "IV therapy",
  "PRP / PRF",
  "Microneedling",
  "Facials with RF & IPL",
] as const;
