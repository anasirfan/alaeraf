import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
  error?: string;
  hint?: string;
};

/**
 * Shared select field, styled to match Input/Textarea exactly (same
 * border/focus treatment) so admin forms don't read as a different
 * component library from the auth/account forms.
 */
export function Select({ label, name, error, hint, className = "", children, ...rest }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[0.7rem] font-semibold tracking-[0.08em] text-muted uppercase">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className={`rounded-sm border bg-ivory px-4 py-3 text-sm text-ink-text transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage/35 ${
          error ? "border-red-300 focus:border-red-400" : "border-line focus:border-forest"
        } ${className}`}
        aria-invalid={!!error}
        {...rest}
      >
        {children}
      </select>
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
