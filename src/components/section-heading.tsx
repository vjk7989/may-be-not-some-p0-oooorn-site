import { cn } from "@/lib/utils";

export function SectionHeading({
  label,
  title,
  description,
  className,
  id,
}: {
  label?: string;
  title: string;
  description?: string;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("section-heading", className)}>
      {label ? <p className="section-label">{label}</p> : null}
      <h2 id={id}>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
