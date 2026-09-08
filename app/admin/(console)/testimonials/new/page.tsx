import Link from "next/link";

import { TestimonialEditor } from "@/components/admin/TestimonialEditor";
import { Button } from "@/components/ui/button";

export const instant = false;

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <Link href="/admin/testimonials">← Back to testimonials</Link>
      </Button>
      <TestimonialEditor />
    </div>
  );
}
