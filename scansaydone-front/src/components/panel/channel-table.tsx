/**
 * B5 — "De dónde llegan las reseñas": table with channels.
 * 5 rows, sum 486. Bar adornment is aria-hidden (value always in text).
 * §13 row 8: th tinted bg, versalitas, zebra, proportion bar, Total elevated.
 */
import { channels, totalReviews } from "@/components/panel/panel-data";

export function ChannelTable() {
  return (
    <section aria-labelledby="b5-title" className="mt-6 lg:mt-8">
      {/* §13 row 5: section title with filete */}
      <h2
        id="b5-title"
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
        De dónde llegan las reseñas
      </h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse font-ui text-[14px]">
          <caption className="sr-only">
            Reseñas por canal, panel de ejemplo
          </caption>
          <thead>
            <tr
              style={{
                background: "color-mix(in srgb, #F0D8BD 40%, #FFFFFF)",
              }}
            >
              {/* §13 row 8: versalitas, ls .06em, 13 700 */}
              <th
                scope="col"
                className="px-3 py-2 text-left font-ui text-[13px] font-bold uppercase text-text-primary"
                style={{ letterSpacing: "0.06em" }}
              >
                Canal
              </th>
              <th
                scope="col"
                className="px-3 py-2 text-right font-ui text-[13px] font-bold uppercase text-text-primary"
                style={{ letterSpacing: "0.06em", minWidth: 72 }}
              >
                Reseñas
              </th>
              <th
                scope="col"
                className="px-3 py-2 text-right font-ui text-[13px] font-bold uppercase text-text-primary"
                style={{ letterSpacing: "0.06em", minWidth: 72 }}
              >
                % del total
              </th>
            </tr>
          </thead>
          <tbody>
            {channels.map((ch, idx) => {
              const pct = (ch.count / totalReviews) * 100;
              const barWidth = (ch.count / totalReviews) * 100;
              const isEven = idx % 2 === 1;

              return (
                <tr
                  key={ch.name}
                  style={{
                    height: 44,
                    background: isEven
                      ? "color-mix(in srgb, #F7E5C8 35%, #FFFFFF)"
                      : undefined,
                    borderBottom: "1px solid #D9C0A0",
                  }}
                >
                  <th
                    scope="row"
                    className="px-3 text-left font-ui text-[14px] font-medium text-text-primary"
                  >
                    <div className="flex items-center gap-3">
                      <span>{ch.name}</span>
                      {/* Bar adornment — §13 row 8: track + fill #8A6F55 h 8 */}
                      <div
                        className="hidden h-[8px] flex-1 rounded-[2px] lg:block"
                        style={{
                          background: "color-mix(in srgb, #D9C0A0 30%, #FFFFFF)",
                        }}
                        aria-hidden="true"
                      >
                        <div
                          className="h-full rounded-[2px]"
                          style={{
                            width: `${barWidth}%`,
                            background: "#8A6F55",
                          }}
                        />
                      </div>
                    </div>
                  </th>
                  <td
                    className="px-3 text-right font-ui text-[14px] text-text-primary"
                    style={{
                      minWidth: 72,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {ch.count}
                  </td>
                  <td
                    className="px-3 text-right font-ui text-[14px] text-text-secondary"
                    style={{
                      minWidth: 72,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {pct.toFixed(1).replace(".", ",")} %
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            {/* §13 row 8: Total — receta D1 vigente (elevada, borde sup. mid) */}
            <tr
              className="bg-surface-elevated"
              style={{ borderTop: "1px solid #D9C0A0" }}
            >
              <th
                scope="row"
                className="px-3 pt-3 font-ui text-[14px] font-semibold tabular-nums text-text-primary"
              >
                Total
              </th>
              <td
                className="px-3 pt-3 text-right font-ui text-[14px] font-semibold tabular-nums text-text-primary"
                style={{ minWidth: 72 }}
              >
                {totalReviews}
              </td>
              <td
                className="px-3 pt-3 text-right font-ui text-[14px] font-semibold tabular-nums text-text-primary"
                style={{ minWidth: 72 }}
              >
                100 %
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* D1: rounding note */}
      <p className="mt-2 font-ui text-[13px] text-text-secondary">
        Las partes suman 99,9 % por redondeo.
      </p>
    </section>
  );
}
