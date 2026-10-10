import { cn } from "@/lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "display" | "xl" | "lg" | "md" | "sm" | "xs";
}

const sizeClasses = {
  display: "text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight",
  xl: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
  lg: "text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight",
  md: "text-2xl md:text-3xl font-semibold tracking-tight",
  sm: "text-xl md:text-2xl font-medium",
  xs: "text-lg md:text-xl font-medium",
};

export function Heading({
  as: Component = "h2",
  size = "lg",
  className = "",
  children,
  ...props
}: HeadingProps) {
  return (
    <Component className={cn(sizeClasses[size], className)} {...props}>
      {children}
    </Component>
  );
}