import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-brand-100 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
