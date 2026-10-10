import { cn } from "@/lib/utils";

interface TextProps {
  as?: "p" | "span" | "div" | "blockquote";
  variant?: "lead" | "body" | "small" | "caption" | "meta" | "number";
  className?: string;
  children?: React.ReactNode;
}

const variantClasses = {
  lead: "text-lg md:text-xl text-muted leading-relaxed",
  body: "text-base md:text-lg text-foreground leading-relaxed",
  small: "text-sm md:text-base text-muted leading-normal",
  caption: "text-xs text-muted uppercase tracking-wider",
  meta: "text-sm text-muted font-medium",
  number: "font-heading text-4xl md:text-6xl font-bold tracking-tight text-blue-primary",
};

export function Text({
  as: Component = "p",
  variant = "body",
  className = "",
  children,
}: TextProps) {
  return (
    <Component className={cn(variantClasses[variant], className)}>
      {children}
    </Component>
  );
}