import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "prose" | "content" | "full" | "narrow";
}

const sizeClasses = {
  prose: "max-w-[65ch]",
  content: "max-w-[1200px]",
  narrow: "max-w-[900px]",
  full: "max-w-full",
};

export function Container({
  size = "content",
  className = "",
  children,
  ...props
}: ContainerProps) {
  return (
    <div className={cn("mx-auto px-6 md:px-12", sizeClasses[size], className)} {...props}>
      {children}
    </div>
  );
}