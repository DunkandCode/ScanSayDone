/**
 * B6 — "Últimas respuestas": list of 5 sample responses.
 * D2: numeric chip (no stars), D4: handle null quotes.
 * §13 row 9: card background, row 44, separator 1px, chip D2, quote 14/500, meta 12 support.
 */
import { lastResponses } from "@/components/panel/panel-data";

function RatingChip({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="sr-only">Nota {rating} sobre 10</span>
      {/* §13 row 9: chip D2 vigente (elevated, border mid, ink 700 13 tabular) */}
      <span
        className="inline-flex w-[34px] items-center justify-center rounded-[4px] bg-surface-elevated px-2 py-1 font-ui text-[13px] font-bold tabular-nums text-text-primary"
        style={{ border: "1px solid #D9C0A0" }}
      >
        {rating}
      </span>
    </div>
  );
}

export function ResponseList({ empty = false }: { empty?: boolean }) {
  return (
    <section aria-labelledby="b6-title" className="mt-6 lg:mt-8">
      {/* §13 row 5: section title with filete */}
      <h2
        id="b6-title"
        className="flex items-center gap-[10px] font-ui text-[16px] font-bold text-text-primary xs:text-[16px] lg:text-[18px]"
      >
        <span
          aria-hidden="true"
          className="inline-block shrink-0 rounded-[1px]"
          style={{
            width: 3,
            height: 16,
            background: "#8A6F55",
          }}
        />
        Últimas respuestas
      </h2>

      {/* §13 row 9: card background */}
      <div
        className="mt-4 overflow-hidden rounded-[8px] border"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 0%, color-mix(in srgb, #F0D8BD 24%, #FFFFFF) 100%)",
          borderColor: "#D9C0A0",
        }}
      >
        {empty ? (
          <div className="p-4">
            <p className="font-ui text-[14px] text-text-secondary">
              Todavía no hay respuestas que mostrar. Cada reseña nueva ocupa una fila como esta.
            </p>
          </div>
        ) : (
          <ul className="m-0 list-none p-0" role="list">
            {lastResponses.map((resp, idx) => (
              <li
                key={idx}
                className="p-4"
                style={{
                  minHeight: 44,
                  borderBottom:
                    idx < lastResponses.length - 1 ? "1px solid #D9C0A0" : undefined,
                }}
              >
                {/* D2: numeric chip instead of stars */}
                <RatingChip rating={resp.rating} />

                {/* D4: quote or null — §13 row 9: cita ink 14 500 */}
                {resp.quote ? (
                  <p className="mt-2 font-ui text-[14px] font-medium leading-[1.5] text-text-primary line-clamp-2 md:line-clamp-1">
                    &laquo;{resp.quote}&raquo;
                  </p>
                ) : (
                  <p className="mt-2 font-ui text-[14px] font-medium leading-[1.5] text-text-secondary">
                    Reseña sin texto del comensal.
                  </p>
                )}

                {/* Footer: channel + days ago — §13 row 9: meta 12 support 500 */}
                <p className="mt-2 font-ui text-[12px] font-medium text-text-secondary">
                  {resp.channel} · respondida hace {resp.daysAgo} días
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
