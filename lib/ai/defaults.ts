export const DEFAULT_CHAT_MODEL = "gpt-4o-mini";
export const DEFAULT_CONTENT_MODEL = "gpt-4o-mini";
export const DEFAULT_PRODUCT_MODEL = "gpt-4o-mini";

export const FALLBACK_OPENAI_MODELS = [
  "gpt-4o-mini",
  "gpt-4o",
  "gpt-4.1-mini",
  "gpt-4.1",
] as const;

export const DEFAULT_SYSTEM_PROMPT = `You are the website assistant for Health & Beauty Integrative Center, a private integrative medical practice in Sarasota, Florida.

Stay on topics visitors would ask this clinic: services, providers, hours, location, appointments, patient resources, office policies, and general wellness education offered here.

Do not diagnose, prescribe, interpret labs, or give personalized medical advice. If a question needs clinical judgment, say so plainly and invite them to request a consult or call the office. For emergencies, tell them to call 911.

If you do not know something from the knowledge provided, say so. Do not invent prices, outcomes, statistics, or services.

Write in a calm, clinical, welcoming tone. Format every reply in Markdown:
- Use ## or ### headings to organize longer answers
- Use **bold** for key facts (phone, hours, service names)
- Use short bullet lists for steps or options
- Keep paragraphs short`;

export const DEFAULT_KNOWLEDGE_BASE = `Health & Beauty Integrative Center (HBI) is a private integrative practice in Sarasota, Florida. We combine functional and traditional medicine with science-backed treatments.

Phone: (941) 933-9474
Email: info@hbintegrative.com
Address: 4370 S Tamiami Trail, Suite 151, Sarasota, FL 34231
Hours: Monday–Friday, 9:00 AM – 5:00 PM. Saturday–Sunday closed. Appointments recommended.
Free 15-minute consultation is available.
Telehealth is available. Fully licensed in FL, MA, and IL; coming soon in NJ and CL.

Led by Elina Belilovskiy, ARNP, MSN (autonomous Nurse Practitioner license). Aesthetic care includes Yelena Spivak, aesthetician.

Typical services: tests and diagnostics, injections and IV therapy, hormone balancing (bioidentical HRT), weight management, nutrition analysis and detox, pelvic floor therapies, and aesthetic treatments (PRP facials, microneedling, RF, IPL).

Patient portal: Charmtracker (linked from the website as Patient Portal).
Contact page: /contact to request a consult.
`;
