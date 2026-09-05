import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
  hint?: string;
};

/**
 * Shared text-input field for auth/account forms — label, hairline border,
 * sage focus ring, inline error text. Matches the editorial tone of the
 * rest of the site (Manrope, warm-neutral palette) rather than a generic
 * form-library look.
 */
export function Input({ label, name, error, hint, className = "", ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[0.7rem] font-semibold tracking-[0.08em] text-muted uppercase">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={`rounded-sm border bg-ivory px-4 py-3 text-sm text-ink-text placeholder:text-muted/45 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage/35 ${
          error ? "border-red-300 focus:border-red-400" : "border-line focus:border-forest"
        } ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
        {...rest}
      />
      {error ? (
        <p id={`${name}-error`} className="text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
  error?: string;
  hint?: string;
};

export function Textarea({ label, name, error, hint, className = "", ...rest }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[0.7rem] font-semibold tracking-[0.08em] text-muted uppercase">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        className={`rounded-sm border bg-ivory px-4 py-3 text-sm text-ink-text placeholder:text-muted/45 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage/35 ${
          error ? "border-red-300 focus:border-red-400" : "border-line focus:border-forest"
        } ${className}`}
        aria-invalid={!!error}
        {...rest}
      />
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
