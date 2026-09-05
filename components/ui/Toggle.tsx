"use client";

/**
 * A checkbox styled as a switch, for boolean admin fields (Active,
 * Featured). Still a real <input type="checkbox"> under the hood so it
 * works inside a plain <form action={...}> Server Action without any JS —
 * only the visual is custom.
 */
export function Toggle({
  name,
  label,
  defaultChecked,
  checked,
  onChange,
  hint,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <span className="relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          checked={checked}
          onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-line transition-colors duration-200 peer-checked:bg-forest" />
        <span className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-4" />
      </span>
      <span>
        <span className="block text-sm font-medium text-ink-text">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}
