"use client";

import { useRef } from "react";
import useScrollVisible from "@/hooks/useScrollVisible";

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AnimatedSection({ children, className = "" }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isVisible, hasBeenVisible } = useScrollVisible(ref);

  return (
    <section
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${isVisible || hasBeenVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
        ${className}
      `}
    >
      {children}
    </section>
  );
}
