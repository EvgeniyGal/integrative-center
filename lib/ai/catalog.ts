import { getPublishedQuestions, getVisibleServices } from "@/lib/content/queries";
import { site } from "@/lib/site";

export async function getLiveClinicCatalog() {
  const [services, questions] = await Promise.all([
    getVisibleServices(),
    getPublishedQuestions(),
  ]);

  const serviceLines = services.map(
    (service) =>
      `- ${service.title}: ${service.summary} (/services/${service.slug})`,
  );

  const faqLines = questions.map(
    (item) => `Q: ${item.question}\nA: ${item.answer}`,
  );

  return `Live clinic snapshot:
Name: ${site.name}
Phone: ${site.phone}
Email: ${site.email}
Address: ${site.address.full}
Hours: ${site.hours.summary}. ${site.hours.note}.
${site.hours.days.map((day) => `${day.day}: ${day.time}`).join("\n")}
Website: ${site.url}
Patient portal: ${site.portalUrl}

Published services:
${serviceLines.join("\n") || "(none listed)"}

Frequently asked questions:
${faqLines.join("\n\n") || "(none listed)"}
`;
}
