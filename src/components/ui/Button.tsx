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
    "bg-black text-white hover:bg-neutral-800 active:bg-neutral-900 shadow-sm active:scale-[0.98]",
  secondary:
    "bg-neutral-100 text-[#212121] hover:bg-neutral-200 active:bg-neutral-300 active:scale-[0.98]",
  outline:
    "border border-neutral-300 text-[#212121] hover:bg-neutral-50 active:bg-neutral-100 active:scale-[0.98]",
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
      "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-500",
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
