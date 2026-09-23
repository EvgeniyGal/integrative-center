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
  portalUrl: "https://phr.charmtracker.com/login.sas?serviceurl=%2Fmain.do",
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
  { href: "/location", label: "Location" },
] as const;

export const footerNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/patient-resources", label: "Patient Resources" },
  { href: "/location", label: "Location" },
  { href: "/contact", label: "Contact" },
] as const;

export const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/hipaa-notice", label: "HIPAA Notice" },
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
    "Maintaining our health means providing our body with the care it needs, so we can feel and look our best at any age. Since each person is unique, at Health & Beauty Integrative Center, we provide personalized health and wellness care tailored to your specific needs. Our services include hormone replacement therapy for women and men, diagnostics, IV therapy, weight management, nutritional support, and other individualized treatments designed to support your physical, mental, and emotional well-being.",
    "Improving your health begins with you. Taking the next step begins with us. Our experienced team uses advanced technology and individualized therapies to address your specific concerns and help you work toward your health goals.",
  ],
} as const;

export const homeQuestions = {
  eyebrow: "Questions",
  title: "Questions we help you explore",
  body: ["You know something feels off.", "The question is why."],
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
  readMoreHref: "/patient-resources/office-policies",
  items: [
    {
      title: "Appointments & cancellations",
      body: "Please provide at least 24 hours’ notice if you need to cancel or reschedule your appointment. Late cancellations and missed appointments may be subject to a $50 fee.",
    },
    {
      title: "Late arrivals",
      body: "We allow a 15-minute grace period. Arrivals more than approximately 20 minutes late will generally need to be rescheduled to avoid delaying other patients.",
    },
    {
      title: "Patient portal",
      body: "The patient portal is intended for brief questions, refill requests, scheduling, and clarification of an existing treatment plan. More complex medical concerns may require an appointment.",
    },
    {
      title: "Prescription refills",
      body: "Please allow 24–48 business hours for routine prescription refill requests. Whenever possible, requests should be submitted through the patient portal or your pharmacy.",
    },
  ],
} as const;

export const patientResources = {
  hero: {
    eyebrow: "Patient resources",
    title: "Guidance for every step of your care.",
    image: "/images/generated/reception.jpg",
    imageAlt: "Reception area at Health & Beauty Integrative Center",
  },
  intro: {
    title: "Forms, portal access, and visit prep.",
    body: "Your experience with Health & Beauty Integrative Center should be as pleasant and productive as possible, and oftentimes that starts even before you arrive. The information below will help familiarize you with what to expect during your visit as well as your rights and responsibilities as a patient. If you have any questions or concerns not addressed here, please don't hesitate to contact our office during regular business hours so we can help you as quickly as possible.",
  },
  beforeVisit: {
    eyebrow: "Before your visit",
    title: "Office Policies & Patient Guidelines",
    body: "Please review our office policies before your visit. These guidelines explain important information about appointments, cancellations, communication, prescription refills, laboratory results, payments, urgent concerns, and your responsibilities as an HBIC patient.",
    ctaLabel: "View office policies",
    ctaHref: "/patient-resources/office-policies",
    image: "/images/generated/care.jpg",
    imageAlt: "Visit preparation materials at the practice",
  },
  forms: {
    eyebrow: "Patient forms",
    title: "Everything you need before your appointment.",
    body: "Complete the required patient forms in advance to help make your visit as smooth and efficient as possible. Having your information ready allows our team to better prepare for your appointment.",
    ctaLabel: "View patient forms",
    ctaHref: "/contact",
    note: "Patient forms are coming soon. Contact our office if you need paperwork before your visit.",
  },
  supplements: {
    eyebrow: "Supplements & recommended products",
    title: "Carefully selected for your wellness routine.",
    body: "Browse HBIC-recommended supplements, practitioner-preferred brands, and selected wellness products available through trusted partners and Amazon.",
    ctaLabel: "Explore recommendations",
    ctaHref: "/patient-resources/supplements",
  },
  portal: {
    eyebrow: "Online access",
    title: "Patient portal",
    body: "View records, messages, and appointment details through our secure patient portal.",
    ctaLabel: "Open patient portal",
  },
} as const;

export const supplementsPage = {
  hero: {
    eyebrow: "Supplements & Recommended Products",
    title: "Carefully selected to support your wellness routine.",
    body: "Explore practitioner-recommended supplements, trusted wellness brands, and selected products curated by the HBIC team. This page is designed to help you easily access products and resources that may support your health goals as part of a personalized care plan.",
    image: "/images/generated/supplements-hero.jpg",
    imageAlt:
      "Curated supplement bottles, fresh citrus, and hydration on a marble surface",
  },
  brands: {
    eyebrow: "Supplements & Recommended Products",
    title: "HBIC Recommended Supplements",
    body: "These supplement resources include brands and platforms recommended by the HBIC team. Patients may be directed to these options as part of their individualized wellness plan.",
  },
  products: {
    eyebrow: "Recommended on Amazon",
    title: "Convenient products for everyday wellness support.",
    body: "These are curated Amazon recommendations for commonly used wellness products. Availability, pricing, and product details are managed by Amazon and may change. Click to view product details on Amazon.",
    script: "Wellness Within Reach",
  },
  info: {
    eyebrow: "Info About Supplements",
    title: "Helpful guidance before you begin.",
    body: "Supplements can support your wellness, but they are not one-size-fits-all. What is appropriate for one patient may not be right for another. Please speak with your HBIC provider before starting any new supplement to ensure it is safe and appropriate for you.",
  },
} as const;

export const officePoliciesPage = {
  eyebrow: "Before your visit",
  title: "Office Policies & Patient Guidelines",
  intro:
    "Please review our office policies before your visit. These guidelines outline important information about appointments, communication, prescription refills, laboratory results, payments, follow-up care, and your responsibilities as an HBIC patient.",
  toc: [
    { id: "philosophy-of-care", label: "Philosophy of Care" },
    { id: "is-hbic-right-for-you", label: "Is HBIC Right for You?" },
    {
      id: "appointments-cancellations",
      label: "Appointments & Cancellations",
    },
    { id: "patient-portal", label: "Patient Portal" },
    { id: "urgent-concerns", label: "Urgent Concerns" },
    { id: "labs-results", label: "Labs & Results" },
    { id: "prescription-refills", label: "Prescription Refills" },
    {
      id: "communication-boundaries",
      label: "Communication & Boundaries",
    },
    { id: "payments-refunds", label: "Payments & Refunds" },
    { id: "preparing-for-your-visit", label: "Preparing for Your Visit" },
    { id: "treatment-follow-ups", label: "Treatment & Follow-Ups" },
    { id: "forms-requests", label: "Forms & Requests" },
    { id: "family-support", label: "Family & Support" },
    { id: "recording-appointments", label: "Recording Appointments" },
  ],
  sections: [
    {
      id: "philosophy-of-care",
      title: "Our Philosophy of Care",
      blocks: [
        {
          type: "paragraph",
          text: "At Health & Beauty Integrative Center, we believe the best outcomes happen when patients and providers work together as partners.",
        },
        {
          type: "paragraph",
          text: "Our goal is to provide thoughtful, individualized, preventive, and integrative care in an environment that is respectful, efficient, and supportive.",
        },
        {
          type: "paragraph",
          text: "These policies are designed to protect the time of both patients and providers, maintain clear communication, establish appropriate expectations, and create a consistent experience for everyone.",
        },
        {
          type: "paragraph",
          text: "We encourage every patient to review these guidelines carefully and become familiar with our office policies before beginning or continuing care with HBIC.",
        },
        {
          type: "paragraph",
          text: "Health & Beauty Integrative Center is a preventive, integrative, and functional medicine practice.",
        },
        {
          type: "paragraph",
          text: "Many of the patients who come to us have already undergone conventional evaluations and have been told that their laboratory results are “normal,” yet they still do not feel well.",
        },
        {
          type: "paragraph",
          text: "They may continue to experience concerns such as fatigue, hormonal symptoms, digestive issues, metabolic concerns, difficulty losing weight, mood changes, sleep disturbances, inflammation, or other symptoms that have not been fully addressed.",
        },
        {
          type: "paragraph",
          text: "Our approach is to look more deeply at the whole person and identify factors that may be contributing to poor health or reduced quality of life.",
        },
        {
          type: "paragraph",
          text: "Depending on an individual patient’s needs, treatment may include nutritional changes, exercise, sleep optimization, stress management, supplementation, medications, hormone therapy, metabolic interventions, additional testing, or other individualized recommendations.",
        },
        {
          type: "paragraph",
          text: "Our goal is not simply to suppress symptoms, but whenever possible, to understand and address the factors that may be contributing to them.",
        },
      ],
    },
    {
      id: "is-hbic-right-for-you",
      title: "Is HBIC Right for You?",
      blocks: [
        {
          type: "paragraph",
          text: "HBIC is best suited for patients who want to take an active role in improving their health.",
        },
        {
          type: "paragraph",
          text: "Our ideal patient is someone who:",
        },
        {
          type: "bullets",
          items: [
            "Is motivated to understand the underlying causes of their symptoms.",
            "Is willing to participate actively in the treatment process.",
            "Is open to making meaningful lifestyle, nutritional, behavioral, or other changes when appropriate.",
            "Understands that improvement often requires consistency, effort, and time.",
            "Is willing to discuss recommendations openly and collaboratively.",
            "Understands that medications and supplements can be valuable tools, but are not always the entire solution.",
            "Is willing to follow through with recommended testing, follow-up visits, and monitoring.",
            "Communicates honestly when a recommendation has not been implemented or has been difficult to follow.",
          ],
        },
        {
          type: "paragraph",
          text: "Patients are always encouraged to ask questions, express concerns, and participate in decisions about their care.",
        },
        {
          type: "paragraph",
          text: "However, HBIC may not be the best fit for patients who are seeking only a prescription or a “quick fix” while being unwilling to consider changes in lifestyle, habits, nutrition, follow-up care, or other factors that may be important to their health.",
        },
        {
          type: "paragraph",
          text: "We view health care as a partnership.",
        },
        {
          type: "paragraph",
          text: "We are committed to doing our part, and we ask our patients to be committed to doing theirs.",
        },
      ],
    },
    {
      id: "appointments-cancellations",
      title: "Appointments, Cancellations & No-Shows",
      blocks: [
        {
          type: "paragraph",
          text: "Your appointment time is reserved specifically for you.",
        },
        {
          type: "paragraph",
          text: "We ask that patients provide at least 24 hours’ notice when canceling or rescheduling an appointment.",
        },
        {
          type: "paragraph",
          text: "Appointments canceled with less than 24 hours’ notice and appointments that are missed without notice may be subject to a $50 no-show fee.",
        },
        {
          type: "paragraph",
          text: "We understand that true emergencies and unexpected circumstances occur, and these situations will be handled with reasonable discretion.",
        },
        {
          type: "paragraph",
          text: "Patients with three no-shows may be discharged from the practice.",
        },
        {
          type: "paragraph",
          text: "Repeated missed appointments make it difficult for us to provide continuity of care and also prevent other patients from using appointment times that may be needed.",
        },
      ],
    },
    {
      id: "late-arrivals",
      title: "Late Arrivals",
      blocks: [
        {
          type: "paragraph",
          text: "We allow a 15-minute grace period for late arrivals.",
        },
        {
          type: "paragraph",
          text: "Depending on the provider’s schedule, we may be able to accommodate a late patient with a shortened appointment.",
        },
        {
          type: "paragraph",
          text: "If a patient arrives more than approximately 20 minutes late, the appointment will generally need to be rescheduled so that other patients are not delayed and appropriate time can be devoted to the visit.",
        },
        {
          type: "paragraph",
          text: "If lateness is caused by an unavoidable circumstance, such as unexpected traffic or another legitimate situation, we will make every reasonable effort to accommodate or reschedule the patient without applying a no-show fee.",
        },
        {
          type: "paragraph",
          text: "Please understand that arriving late does not extend the scheduled appointment time.",
        },
      ],
    },
    {
      id: "patient-portal",
      title: "Patient Portal & Messaging Etiquette",
      blocks: [
        {
          type: "paragraph",
          text: "The patient portal is an important communication tool and is appropriate for:",
        },
        {
          type: "bullets",
          items: [
            "Brief clarification regarding an existing treatment plan.",
            "Routine prescription refill requests.",
            "Scheduling questions.",
            "Administrative or clerical questions.",
            "Sending photographs when clinically appropriate.",
            "Brief questions regarding medications, supplements, or treatment recommendations.",
            "Reporting new symptoms that may have developed after starting a treatment.",
          ],
        },
        {
          type: "paragraph",
          text: "If new symptoms are reported, the provider will determine whether the issue can reasonably be addressed through portal communication or whether an appointment is necessary.",
        },
        {
          type: "paragraph",
          text: "If more than approximately two rounds of clarification are required to adequately understand or address a clinical issue, the provider may request that the patient schedule an appointment.",
        },
        {
          type: "paragraph",
          text: "Questions involving new medications, hormone changes, treatment adjustments, or new symptoms may also require an appointment depending on their complexity.",
        },
        {
          type: "paragraph",
          text: "If the provider needs to extensively review previous notes, laboratory results, medications, or the overall medical record in order to make a medical decision, the issue may be more appropriately handled through a short telephone visit or telehealth appointment.",
        },
      ],
    },
    {
      id: "portal-response-times",
      title: "Expected Portal Response Times",
      blocks: [
        {
          type: "bullets",
          items: [
            "Routine administrative questions and medication refill requests are generally answered within one business day.",
            "Straightforward clinical questions are generally answered within one to two business days.",
            "More complex clinical questions that require significant chart review, prior laboratory review, or medical decision-making may require three to four business days, unless the patient is notified that an appointment is necessary.",
          ],
        },
        {
          type: "paragraph",
          text: "Response times may vary depending on provider availability, holidays, weekends, and clinical workload.",
        },
      ],
    },
    {
      id: "portal-not-for-emergencies",
      title: "The Portal Is Not for Emergencies",
      blocks: [
        {
          type: "paragraph",
          text: "The patient portal is not continuously monitored and should never be used for emergencies or urgent medical situations.",
        },
        {
          type: "paragraph",
          text: "For urgent but non-emergency concerns during office hours, please call the office directly rather than sending a portal message.",
        },
        {
          type: "paragraph",
          text: "For a medical emergency, including symptoms such as severe chest pain, significant difficulty breathing, stroke-like symptoms, severe allergic reactions, or other potentially life-threatening conditions, call 911 or go directly to the nearest emergency department.",
        },
        {
          type: "paragraph",
          text: "Do not send a portal message and wait for a response in an emergency.",
        },
      ],
    },
    {
      id: "urgent-concerns",
      title: "Urgent Concerns & Same-Day Requests",
      blocks: [
        {
          type: "paragraph",
          text: "HBIC is primarily a preventive and integrative medicine practice and is not an urgent care or emergency care facility.",
        },
        {
          type: "paragraph",
          text: "However, when an established patient develops an unexpected medical concern during office hours, we will make every reasonable effort to help.",
        },
        {
          type: "paragraph",
          text: "Depending on the situation and provider availability, we may:",
        },
        {
          type: "bullets",
          items: [
            "Offer a same-day appointment.",
            "Arrange a brief provider telephone call.",
            "Recommend an appropriate walk-in clinic or urgent-care center.",
            "Recommend emergency evaluation when necessary.",
          ],
        },
        {
          type: "paragraph",
          text: "After office hours, on weekends, and on holidays, patients should use an appropriate walk-in clinic, urgent-care center, or emergency department depending on the severity of the problem.",
        },
      ],
    },
    {
      id: "portal-becomes-appointment",
      title: "When a Portal Question Becomes an Appointment",
      blocks: [
        {
          type: "paragraph",
          text: "Portal messages are intended for brief communication and clarification.",
        },
        {
          type: "paragraph",
          text: "A medical issue may require a short telephone visit, telehealth visit, or office appointment when it involves:",
        },
        {
          type: "bullets",
          items: [
            "New or worsening symptoms.",
            "Complex medical decision-making.",
            "Significant review of the medical record.",
            "Review of multiple laboratory studies.",
            "Starting a new treatment or medication.",
            "Significant medication or hormone changes.",
            "New diagnostic testing.",
            "Multiple follow-up questions.",
            "A problem that cannot reasonably be addressed within a brief portal exchange.",
          ],
        },
        {
          type: "paragraph",
          text: "This allows your provider to give the issue the time, attention, and clinical consideration it deserves.",
        },
      ],
    },
    {
      id: "labs-results",
      title: "Laboratory Orders & Laboratory Results",
      blocks: [
        {
          type: "paragraph",
          text: "Comprehensive laboratory ordering requires an appointment.",
        },
        {
          type: "paragraph",
          text: "If a patient needs extensive laboratory testing, a brief 15- to 20-minute telehealth appointment or another appropriate clinical visit may be required so that the provider can properly assess the patient and determine which tests are medically appropriate.",
        },
        {
          type: "paragraph",
          text: "Patients should not expect extensive laboratory orders to be generated solely through portal messaging, particularly when they have not been evaluated recently.",
        },
        { type: "heading", text: "Reviewing Laboratory Results" },
        {
          type: "paragraph",
          text: "Laboratory interpretation generally requires an appointment.",
        },
        {
          type: "paragraph",
          text: "When laboratory testing is performed through our office, we make every effort to schedule the follow-up visit at the time of the blood draw.",
        },
        {
          type: "paragraph",
          text: "If blood is drawn at an outside laboratory, patients may be asked to notify our office once testing has been completed so that the appropriate follow-up appointment can be scheduled.",
        },
        {
          type: "paragraph",
          text: "Outside laboratory results uploaded to the patient portal should generally be associated with a scheduled appointment if the patient would like the provider to interpret them or make treatment recommendations.",
        },
        {
          type: "paragraph",
          text: "Limited laboratory rechecks, such as a single value or small panel, may sometimes be communicated through the portal when that plan was specifically discussed with the patient in advance.",
        },
      ],
    },
    {
      id: "prescription-refills",
      title: "Prescription Refills",
      blocks: [
        {
          type: "paragraph",
          text: "Please allow 24 to 48 business hours for routine prescription refill requests.",
        },
        {
          type: "paragraph",
          text: "Whenever possible, refill requests should be submitted through:",
        },
        {
          type: "bullets",
          items: ["The patient portal, or", "Your pharmacy."],
        },
        {
          type: "paragraph",
          text: "Patients are responsible for monitoring their medication supply and requesting refills before they run out.",
        },
        {
          type: "paragraph",
          text: "Last-minute refill requests may not always be able to be completed immediately.",
        },
        {
          type: "paragraph",
          text: "Some medications require ongoing clinical follow-up and laboratory monitoring before refills can be authorized.",
        },
        {
          type: "paragraph",
          text: "As a general guideline:",
        },
        {
          type: "bullets",
          items: [
            "Patients receiving hormone therapy are typically evaluated approximately every 6 months.",
            "Patients receiving GLP-1 therapy are generally followed approximately every 3 months.",
            "Stable preventive-care patients are generally expected to have at least annual follow-up.",
            "Current laboratory testing is generally required for hormone management.",
            "Patients who are stable on an unchanged hormone regimen and have no new symptoms may sometimes be monitored annually at the provider’s discretion.",
            "Controlled-substance prescribing, including testosterone, requires appropriate follow-up and laboratory monitoring, generally at least every 6 months.",
          ],
        },
        {
          type: "paragraph",
          text: "Supplement-related questions may usually be addressed through the patient portal unless the issue becomes clinically complex.",
        },
      ],
    },
    {
      id: "communication-boundaries",
      title: "Respectful Communication & Professional Boundaries",
      blocks: [
        {
          type: "paragraph",
          text: "We are committed to treating every patient with courtesy, dignity, and respect, and we expect the same in return.",
        },
        {
          type: "paragraph",
          text: "Rude, abusive, belligerent, threatening, intimidating, or verbally aggressive behavior toward any member of the HBIC team will not be tolerated.",
        },
        {
          type: "paragraph",
          text: "This applies to communication:",
        },
        {
          type: "bullets",
          items: [
            "In person.",
            "By telephone.",
            "Through the patient portal.",
            "By email.",
            "Through social media.",
            "Through any other method of communication.",
          ],
        },
        {
          type: "paragraph",
          text: "Repeated disregard of office policies, inappropriate treatment of staff, threatening behavior, or refusal to meet agreed-upon financial obligations may result in termination of the patient-provider relationship.",
        },
        {
          type: "paragraph",
          text: "Our policies apply equally to everyone.",
        },
        {
          type: "paragraph",
          text: "Consistent policies allow our staff to work efficiently and help ensure that all patients receive fair and appropriate care.",
        },
      ],
    },
    {
      id: "communication-with-providers",
      title: "Communication With Providers",
      blocks: [
        {
          type: "paragraph",
          text: "All medical communication should occur through established HBIC communication channels.",
        },
        {
          type: "paragraph",
          text: "Patients should not attempt to bypass office staff in order to communicate directly with a provider through:",
        },
        {
          type: "bullets",
          items: [
            "A provider’s personal cell phone.",
            "Personal text messaging.",
            "Personal email.",
            "Social media.",
            "A provider’s family members.",
            "Other private or unofficial communication channels.",
          ],
        },
        {
          type: "paragraph",
          text: "There should be no attempt to obtain direct medical access to a provider by circumventing office staff.",
        },
        {
          type: "paragraph",
          text: "Our team is here to help route concerns appropriately and make sure that clinical information is properly documented in the medical record.",
        },
      ],
    },
    {
      id: "payments-refunds",
      title: "Payment Policy",
      blocks: [
        {
          type: "paragraph",
          text: "Payment is expected at the time of service unless other arrangements have been made.",
        },
        {
          type: "paragraph",
          text: "We understand that financial circumstances can change.",
        },
        {
          type: "paragraph",
          text: "If a patient needs additional flexibility, we encourage them to speak with our office.",
        },
        {
          type: "paragraph",
          text: "When appropriate, we may be able to arrange monthly payments or another reasonable payment plan.",
        },
        {
          type: "paragraph",
          text: "Please communicate with us.",
        },
        {
          type: "paragraph",
          text: "We would much rather work with you than have financial concerns interfere with your care.",
        },
        { type: "heading", text: "Telehealth Visits" },
        {
          type: "paragraph",
          text: "Telehealth visits require prepayment.",
        },
        {
          type: "paragraph",
          text: "A payment request is generally sent approximately 24 hours before the scheduled appointment.",
        },
        {
          type: "paragraph",
          text: "Payment should be completed before the visit begins unless prior arrangements have been made.",
        },
        { type: "heading", text: "Packages & Refunds" },
        {
          type: "paragraph",
          text: "Package refunds are evaluated individually.",
        },
        {
          type: "paragraph",
          text: "Refunds may be considered when:",
        },
        {
          type: "bullets",
          items: [
            "HBIC is unable to provide services included in the purchased package.",
            "A medical condition prevents the patient from safely receiving services.",
            "Another legitimate circumstance makes completion of the package impractical or inappropriate.",
          ],
        },
        {
          type: "paragraph",
          text: "Refund decisions will depend on the services already received, products already dispensed, and the individual circumstances involved.",
        },
      ],
    },
    {
      id: "preparing-for-your-visit",
      title: "Preparing for Your Appointment",
      blocks: [
        {
          type: "paragraph",
          text: "Patients share responsibility for helping appointments run efficiently and productively.",
        },
        {
          type: "paragraph",
          text: "Please complete requested laboratory testing, paperwork, questionnaires, and outside-record submissions in advance whenever possible.",
        },
        {
          type: "paragraph",
          text: "If you would like your provider to review outside laboratory tests, imaging, hospital records, or specialist reports, please provide them before the appointment so there is adequate time for review.",
        },
        {
          type: "paragraph",
          text: "Patients should maintain an accurate list of medications and supplements and inform their HBIC provider about medications prescribed by other clinicians.",
        },
        {
          type: "paragraph",
          text: "If required information or testing is not available, the provider may need to modify or reschedule the appointment.",
        },
      ],
    },
    {
      id: "treatment-follow-ups",
      title: "Following Your Treatment Plan",
      blocks: [
        {
          type: "paragraph",
          text: "Treatment recommendations are developed collaboratively.",
        },
        {
          type: "paragraph",
          text: "If you are unable or unwilling to follow a recommendation, please tell us.",
        },
        {
          type: "paragraph",
          text: "There is no judgment in saying:",
        },
        {
          type: "bullets",
          items: [
            "“I was not able to do this.”",
            "“This recommendation does not work for me.”",
          ],
        },
        {
          type: "paragraph",
          text: "That information is important.",
        },
        {
          type: "paragraph",
          text: "It allows us to modify the treatment plan appropriately rather than assuming that a treatment failed when it was not actually implemented.",
        },
        {
          type: "paragraph",
          text: "Honest communication helps us make better clinical decisions.",
        },
        { type: "heading", text: "Follow-Up Appointments" },
        {
          type: "paragraph",
          text: "When your provider recommends a follow-up interval, such as three months, six months, or one year, it is the patient’s responsibility to schedule and maintain that follow-up.",
        },
        {
          type: "paragraph",
          text: "Our office will make reasonable efforts to help with scheduling, but patients should not rely solely on reminders from the practice to maintain appropriate follow-up care.",
        },
      ],
    },
    {
      id: "forms-requests",
      title: "Forms, Letters & Administrative Requests",
      blocks: [
        {
          type: "paragraph",
          text: "Please allow up to one week for completion of forms, medical letters, employment or school paperwork, disability-related paperwork, or other administrative requests.",
        },
        {
          type: "paragraph",
          text: "Some forms may require a new clinical assessment or an appointment before they can be completed appropriately.",
        },
        {
          type: "paragraph",
          text: "We appreciate your patience and ask that time-sensitive requests be submitted as early as possible.",
        },
      ],
    },
    {
      id: "family-support",
      title: "Family Members & Support Persons",
      blocks: [
        {
          type: "paragraph",
          text: "Family members and support persons are welcome and are often encouraged to participate in appointments when the patient is comfortable with their involvement.",
        },
        {
          type: "paragraph",
          text: "Having a trusted family member present can sometimes improve communication and help patients remember important recommendations.",
        },
        {
          type: "paragraph",
          text: "However, an appointment is reserved for the scheduled patient only.",
        },
        {
          type: "paragraph",
          text: "If a spouse, family member, or support person would like their own symptoms, laboratory results, medications, or health concerns evaluated, they must schedule a separate appointment.",
        },
        {
          type: "paragraph",
          text: "Two people attending one appointment does not make it two medical appointments.",
        },
      ],
    },
    {
      id: "recording-appointments",
      title: "Recording Appointments",
      blocks: [
        {
          type: "paragraph",
          text: "Patients may record their appointment for personal reference as long as the recording concerns the scheduled patient’s medical care and does not compromise the privacy of staff, other patients, or other individuals.",
        },
        {
          type: "paragraph",
          text: "Recordings should be used for the patient’s personal reference and should not interfere with the clinical visit.",
        },
      ],
    },
    {
      id: "shared-commitment",
      title: "A Shared Commitment",
      blocks: [
        {
          type: "paragraph",
          text: "HBIC is committed to providing thoughtful, individualized care and helping our patients achieve meaningful improvements in their health and quality of life.",
        },
        {
          type: "paragraph",
          text: "In return, we ask our patients to:",
        },
        {
          type: "bullets",
          items: [
            "Participate actively in their care.",
            "Communicate respectfully.",
            "Follow agreed-upon office procedures.",
            "Attend scheduled appointments.",
            "Complete recommended testing and follow-up.",
            "Ask questions when something is unclear.",
            "Be honest about what they are and are not able to implement.",
            "Respect the time and boundaries of providers, staff, and other patients.",
          ],
        },
        {
          type: "paragraph",
          text: "When everyone follows the same expectations, the process becomes simpler, more respectful, and more effective for everyone.",
        },
        {
          type: "paragraph",
          text: "We look forward to partnering with patients who are ready to take an active role in their health.",
        },
      ],
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
