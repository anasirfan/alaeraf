type FaqItem = { q: string; a: string };

/**
 * Native <details>/<summary> accordion — accessible and interactive with
 * zero client JS. Reused across every page that carries a FAQ block.
 */
export function Faq({ items, className = "" }: { items: readonly FaqItem[]; className?: string }) {
  return (
    <div className={`divide-y divide-line ${className}`}>
      {items.map((item) => (
        <details key={item.q} className="group py-5 first:pt-0">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-base text-forest sm:text-lg">
            {item.q}
            <span
              className="mt-0.5 shrink-0 text-xl leading-none text-muted transition-transform duration-300 group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-2xl pretty text-sm leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
