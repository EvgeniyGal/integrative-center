import { TestimonialEditor } from "@/components/admin/TestimonialEditor";
import { BackToTestimonialsLink } from "@/components/admin/TestimonialNav";
import { Button } from "@/components/ui/button";

export const instant = false;

export default async function NewTestimonialPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <BackToTestimonialsLink>← Back to testimonials</BackToTestimonialsLink>
      </Button>
      <TestimonialEditor key={t ?? "new"} />
    </div>
  );
}
