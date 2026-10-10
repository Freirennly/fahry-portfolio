import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  id?: string;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "default" | "blue-deep" | "off-white";
}

const paddingClasses = {
  none: "",
  sm: "py-12 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-20 md:py-32",
  xl: "py-24 md:py-40",
};

const backgroundClasses = {
  default: "bg-background",
  "blue-deep": "bg-blue-deep text-white",
  "off-white": "bg-off-white",
};

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ id, className = "", padding = "lg", background = "default", children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          "relative w-full",
          paddingClasses[padding],
          backgroundClasses[background],
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";