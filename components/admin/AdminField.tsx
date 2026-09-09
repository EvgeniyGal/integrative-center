import { cn } from "@/lib/utils";

export function AdminField({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/70"
        >
          {label}
        </label>
        {hint ? <p className="text-xs text-muted">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function AdminSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "space-y-4 border border-ink/10 bg-stone/15 p-4 sm:p-5",
        className,
      )}
    >
      <div className="space-y-1 border-b border-ink/10 pb-3">
        <h3 className="font-display text-lg text-ink">{title}</h3>
        {description ? (
          <p className="text-sm text-muted">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function AdminToggle({
  name,
  label,
  defaultChecked,
  description,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 border border-ink/15 bg-white px-3 py-3 transition hover:border-brand/40">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 accent-brand"
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs text-muted">{description}</span>
        ) : null}
      </span>
    </label>
  );
}
