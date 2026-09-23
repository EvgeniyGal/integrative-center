import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-brand text-white shadow-[0_10px_30px_-12px_rgba(7,156,162,0.55)] hover:bg-brand-dark hover:shadow-[0_14px_36px_-12px_rgba(7,156,162,0.7)]",
        inverted:
          "bg-ivory text-ink hover:bg-white",
        outline:
          "border border-brand/30 bg-white text-ink shadow-[0_1px_2px_rgba(28,27,25,0.04)] hover:border-brand hover:bg-brand-light/50 hover:text-brand",
        ghost:
          "text-ivory/90 hover:bg-white/10 hover:text-white",
        dark: "bg-ink text-ivory hover:bg-ink/90",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs uppercase tracking-[0.18em]",
        lg: "h-12 px-8 text-base",
        icon: "size-11",
        "icon-sm": "size-9 shrink-0 rounded-none px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
