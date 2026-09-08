import Link from "next/link";

import { TestimonialsTable } from "@/components/admin/TestimonialsTable";
import { Button } from "@/components/ui/button";
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
        <Button asChild variant="outline" className="rounded-none">
          <Link href="/admin/testimonials/new">Add testimonial</Link>
        </Button>
      </div>
      <TestimonialsTable items={items} />
    </div>
  );
}
