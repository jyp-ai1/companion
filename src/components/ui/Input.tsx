import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id ?? label.replace(/\s/g, "-");
    return (
      <div className="w-full">
        <label htmlFor={inputId} className="mb-2 block text-lg font-medium">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-2xl border-2 border-brand-100 bg-white px-4 py-4 text-lg outline-none focus:border-brand-500 ${error ? "border-red-400" : ""} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
