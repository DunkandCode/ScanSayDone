/**
 * B6 — "Últimas respuestas": list of 5 sample responses.
 * D2: numeric chip (no stars), D4: handle null quotes.
 */
import { lastResponses } from "@/components/panel/panel-data";

function RatingChip({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="sr-only">Nota {rating} sobre 10</span>
      <span className="inline-flex w-[34px] items-center justify-center rounded-[4px] border border-border-mid bg-surface-elevated px-2 py-1 font-ui text-[13px] font-bold tabular-nums text-text-primary">
        {rating}
      </span>
    </div>
  );
}

export function ResponseList({ empty = false }: { empty?: boolean }) {
  return (
    <section aria-labelledby="b6-title" className="mt-6 lg:mt-8">
      <h2
        id="b6-title"
        className="font-ui text-[16px] font-semibold text-text-primary lg:text-[18px]"
      >
        Últimas respuestas
      </h2>

      {empty ? (
        <div className="mt-4 border-t border-border-subtle py-4">
          <p className="font-ui text-[14px] text-text-secondary">
            Todavía no hay respuestas que mostrar. Cada reseña nueva ocupa una fila como esta.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-0" role="list">
          {lastResponses.map((resp, idx) => (
            <li
              key={idx}
              className="border-b border-border-subtle py-4 first:pt-0 last:border-b-0"
            >
              {/* D2: numeric chip instead of stars */}
              <RatingChip rating={resp.rating} />

              {/* D4: quote or null */}
              {resp.quote ? (
                <p className="mt-2 font-ui text-[14px] leading-[1.5] text-text-primary line-clamp-2 md:line-clamp-1">
                  &laquo;{resp.quote}&raquo;
                </p>
              ) : (
                <p className="mt-2 font-ui text-[14px] leading-[1.5] text-text-secondary">
                  Reseña sin texto del comensal.
                </p>
              )}

              {/* Footer: channel + days ago */}
              <p className="mt-2 font-ui text-[13px] text-text-secondary">
                {resp.channel} · respondida hace {resp.daysAgo} días
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
