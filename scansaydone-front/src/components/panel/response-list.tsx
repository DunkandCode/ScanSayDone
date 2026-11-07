/**
 * B6 — "Últimas respuestas": list of 5 sample responses.
 * Star SVG + rating, quote (truncated), channel + days ago footer.
 * Separator between items.
 */
import { lastResponses } from "@/components/panel/panel-data";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={filled ? "fill-text-primary" : "fill-border-subtle"}
    >
      <path d="M8 0l2.47 5.01L16 5.81l-4 3.9.94 5.49L8 12.49 3.06 15.2 4 9.71 0 5.81l5.53-.8L8 0z" />
    </svg>
  );
}

function RatingStars({ rating }: { rating: number }) {
  // Show filled stars up to rating, but limit to 5 for display
  // For ratings > 5, show 5 filled stars
  const displayStars = Math.min(rating, 5);
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 10`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} filled={i < displayStars} />
      ))}
      <span className="ml-1 font-ui text-[13px] tabular-nums text-text-primary">
        {rating}
      </span>
    </div>
  );
}

export function ResponseList() {
  return (
    <section aria-labelledby="b6-title" className="mt-6 lg:mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="b6-title"
          className="font-ui text-[16px] font-semibold text-text-primary lg:text-[18px]"
        >
          Últimas respuestas
        </h2>

        {/* Settings button (disabled) */}
        <button
          type="button"
          aria-disabled="true"
          title="Ajustes no están disponibles en el panel de ejemplo."
          className="cursor-not-allowed rounded-[4px] border border-border-subtle px-3 py-1 font-ui text-[13px] font-medium text-text-secondary focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
        >
          Ajustes del panel
        </button>
      </div>

      <ul className="mt-4 space-y-0" role="list">
        {lastResponses.map((resp, idx) => (
          <li
            key={idx}
            className="border-b border-border-subtle py-4 first:pt-0 last:border-b-0"
          >
            {/* Header: rating */}
            <RatingStars rating={resp.rating} />

            {/* Quote */}
            <p className="mt-2 font-ui text-[14px] leading-[1.5] text-text-primary line-clamp-2 xs:line-clamp-1">
              «{resp.quote}»
            </p>

            {/* Footer: channel + days ago */}
            <p className="mt-2 font-ui text-[13px] text-text-secondary">
              {resp.channel} · respondida hace {resp.daysAgo} días
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
