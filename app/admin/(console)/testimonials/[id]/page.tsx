import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { TestimonialEditor } from "@/components/admin/TestimonialEditor";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";

export const instant = false;

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await db.query.testimonials.findFirst({
    where: eq(testimonials.id, id),
  });
  if (!testimonial) notFound();

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <Link href="/admin/testimonials">← Back to testimonials</Link>
      </Button>
      <TestimonialEditor testimonial={testimonial} />
    </div>
  );
}
