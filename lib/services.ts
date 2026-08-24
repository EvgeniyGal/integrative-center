export type Service = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  body: string[];
  image: string;
  homeImage?: string;
};

export const homeServices: Service[] = [
  {
    slug: "iv-therapy",
    title: "IV Therapy",
    eyebrow: "Restoration",
    summary:
      "Patient-specific formulas of hydration, vitamins, minerals, amino acids, and antioxidants — delivered directly into the bloodstream.",
    body: [],
    image: "/images/generated/iv.jpg",
  },
  {
    slug: "hormone-balancing",
    title: "Hormonal Health",
    eyebrow: "Balance",
    summary:
      "Specialized therapies that restore the hormones governing sleep, mood, energy, libido, stress, weight, and immunity.",
    body: [],
    image: "/images/generated/hormone.jpg",
  },
  {
    slug: "weight-management",
    title: "Weight Management",
    eyebrow: "Metabolism",
    summary:
      "Not a fad diet. Comprehensive testing, hormone optimization, and nutrition — a routine you can keep.",
    body: [],
    image: "/images/generated/weight.jpg",
  },
  {
    slug: "skin-care",
    title: "Skin Care",
    eyebrow: "Radiance",
    summary:
      "Anti-aging and regenerative therapies that treat skin as a reflection of internal health — not a surface to cover.",
    body: [],
    image: "/images/generated/skin.jpg",
  },
  {
    slug: "nutritional-analysis",
    title: "Nutritional Analysis",
    eyebrow: "Foundation",
    summary:
      "Customized nutritional therapies that correct deficiencies, lower inflammation, and support energy, mood, and chronic conditions.",
    body: [],
    image: "/images/generated/nutrition.jpg",
  },
  {
    slug: "pelvic-floor",
    title: "Pelvic Health",
    eyebrow: "Strength",
    summary:
      "Targeted pelvic floor therapies for incontinence and sexual function — an area too often overlooked.",
    body: [],
    image: "/images/generated/pelvic.jpg",
  },
];

export const wellnessServices: Service[] = [
  {
    slug: "diagnostics",
    title: "Tests & Diagnostics",
    eyebrow: "Clarity first",
    summary:
      "An imbalance in the body’s interconnected systems can be misdiagnosed or overlooked. We begin by finding the source.",
    body: [
      "Our bodies are a network of delicate, interconnected systems. An imbalance can result in serious health concerns, causing physical and mental stress and illness. Identifying the source of your issues is the first step to improving your symptoms and accessing the treatments you need to feel your best.",
      "Using state-of-the-art diagnostic technology, our providers trace the causes of common health concerns, helping patients find answers to conditions that may have been missed in the past. With a comprehensive evaluation, we recommend therapy that matches your individual profile — addressing issues at the source.",
    ],
    image: "/images/generated/diagnostics.jpg",
  },
  {
    slug: "iv-therapy",
    title: "IV Therapy",
    eyebrow: "Direct restoration",
    summary:
      "Vitamins and minerals delivered into the bloodstream, where they can be absorbed and used immediately.",
    body: [
      "Almost everyone is familiar with the vitamins and minerals we get from food. These essential elements keep biological systems in optimal health. We often do not absorb enough from diet alone, and deficiencies can appear as fatigue, brain fog, insomnia, low mood, and chronic illness.",
      "IV therapy delivers beneficial nutrients directly into the bloodstream. From strengthening immunity to improving mood and energy, intravenous supplementation can be customized to each patient’s biological profile, lifestyle, and deficiencies.",
      "Formulas may include vitamin C, folate, and B12; minerals such as magnesium, zinc, and selenium; and amino acids such as glycine, taurine, lysine, and arginine. Infusions take thirty minutes to an hour and a half in the clinic. Some patients feel an immediate lift; others notice a quieter improvement over time.",
    ],
    image: "/images/generated/iv.jpg",
  },
  {
    slug: "hormone-balancing",
    title: "Hormone Balancing",
    eyebrow: "A precise equilibrium",
    summary:
      "Hormones govern sleep, mood, cravings, energy, libido, stress, weight, appearance, and immunity.",
    body: [
      "When hormones fall out of balance, the effects can be wide: sleep disturbance, weight change, headaches, joint swelling, dizziness, fatigue, moodiness, sexual dysfunction, memory issues, bloating, dry skin, thinning hair, depression, anxiety, and more.",
      "Accurate assessment comes first. Blood, urine, and saliva testing — fasting and, when needed, postprandial — plus imaging as appropriate. For women, we carefully select the day of the cycle so hormone levels are meaningful. After a thorough examination, we create a plan that considers lifestyle, diet, exercise, and daily routine.",
      "We then recommend a formula and dosage matched to your concerns, monitor progress, and refine as your levels stabilize.",
    ],
    image: "/images/generated/hormone.jpg",
  },
  {
    slug: "weight-management",
    title: "Weight Management",
    eyebrow: "Physiology, not fashion",
    summary:
      "A simple routine designed around your hormones and nutrition — so weight that leaves can stay gone.",
    body: [
      "Our approach is not a diet or a fast fad, which typically results in frustration and inconsistent results. Through comprehensive testing, we develop a simple, livable routine designed to optimize hormones and enhance nutrition.",
      "Each plan addresses the individual’s health challenges, allowing patients to shed weight and keep it off. Discover physiologically rooted integrative therapies that help you achieve a healthier you.",
    ],
    image: "/images/generated/weight.jpg",
  },
  {
    slug: "nutritional-analysis",
    title: "Nutritional Analysis",
    eyebrow: "The metabolic foundation",
    summary:
      "Essential amino acids, fatty acids, carbohydrates, vitamins, and minerals — measured, then restored.",
    body: [
      "Proper nutrition is the foundation for optimizing metabolic function. The body is an extensive collection of systems that require catalysts, enzymes, hormones, signaling cells, and transport molecules to work together.",
      "Customized nutritional therapies correct deficiencies and support those systems — lowering inflammation, improving mood and energy, and helping control a wide range of chronic conditions.",
    ],
    image: "/images/generated/nutrition.jpg",
  },
  {
    slug: "pelvic-floor",
    title: "Pelvic Floor Therapies",
    eyebrow: "Quiet strength",
    summary:
      "The pelvic floor supports reproductive organs and controls bladder and bowel. Weakness is common — and treatable.",
    body: [
      "Commonly overlooked and undertreated, a weak pelvic floor can produce organ prolapse and incontinence. We offer targeted therapies to strengthen the muscles in this critical area.",
      "Treatment can help incontinence in men and women and may increase sexual function in women. Care is private, precise, and paced to your comfort.",
    ],
    image: "/images/generated/pelvic.jpg",
  },
];
