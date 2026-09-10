import { TestimonialsTable } from "@/components/admin/TestimonialsTable";
import { AddTestimonialButton } from "@/components/admin/TestimonialNav";
import { getAllTestimonials } from "@/lib/content/queries";

export const instant = false;

export default async function AdminTestimonialsPage() {
  const items = await getAllTestimonials();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-muted">
          Quotes for “What people are saying”. Do not generate these with AI.
        </p>
        <AddTestimonialButton className="rounded-none" />
      </div>
      <TestimonialsTable items={items} />
    </div>
  );
}
