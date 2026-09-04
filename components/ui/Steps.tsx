type Step = { step: string; title: string; body: string };
type Tone = "dark" | "water";

const accents: Record<Tone, string> = {
  dark: "text-botanical/45",
  water: "text-aqua-deep/45",
};

/**
 * Numbered process/how-it-works list. Reused for hair-oil use steps, the
 * water treatment process, subscription how-it-works and delivery steps.
 */
const lgColsClass: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

export function Steps({
  items,
  tone = "dark",
  lgCols = 4,
  className = "",
}: {
  items: readonly Step[];
  tone?: Tone;
  lgCols?: 3 | 4 | 5;
  className?: string;
}) {
  return (
    <ol className={`grid gap-x-8 gap-y-10 sm:grid-cols-2 ${lgColsClass[lgCols]} ${className}`}>
      {items.map((item) => (
        <li key={item.step} className="border-t border-line pt-5">
          <span className={`font-display text-sm tabular-nums ${accents[tone]}`}>
            {item.step}
          </span>
          <h3 className="mt-2 font-display text-lg text-forest">{item.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.body}</p>
        </li>
      ))}
    </ol>
  );
}
