import Link from "next/link";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm active:scale-[0.98]",
  secondary:
    "bg-brand-50 text-brand-800 hover:bg-brand-100 active:bg-brand-200 active:scale-[0.98]",
  outline:
    "border-2 border-brand-600 text-brand-700 hover:bg-brand-50 active:bg-brand-100 active:scale-[0.98]",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-[52px] px-6 text-lg",
  lg: "min-h-[60px] px-8 text-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "lg", href, className = "", children, ...props }, ref) => {
    const classes = [
      "inline-flex items-center justify-center rounded-2xl font-semibold",
      "transition-all duration-200 cursor-pointer",
      "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      variantClasses[variant],
      sizeClasses[size],
      className,
    ].join(" ");

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
