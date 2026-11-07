/**
 * B5 — "De dónde llegan las reseñas": table with channels.
 * 5 rows, sum 486. Bar adornment is aria-hidden (value always in text).
 */
import { channels, totalReviews } from "@/components/panel/panel-data";

export function ChannelTable() {
  return (
    <section aria-labelledby="b5-title" className="mt-6 lg:mt-8">
      <h2
        id="b5-title"
        className="font-ui text-[16px] font-semibold text-text-primary lg:text-[18px]"
      >
        De dónde llegan las reseñas
      </h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse font-ui text-[14px]">
          <caption className="sr-only">
            Reseñas por canal, panel de ejemplo
          </caption>
          <thead>
            <tr className="border-b border-border-subtle">
              <th
                scope="col"
                className="pb-2 text-left font-medium text-text-secondary"
              >
                Canal
              </th>
              <th
                scope="col"
                className="pb-2 text-right font-medium text-text-secondary"
              >
                Reseñas
              </th>
              <th
                scope="col"
                className="pb-2 text-right font-medium text-text-secondary"
              >
                % del total
              </th>
            </tr>
          </thead>
          <tbody>
            {channels.map((ch) => {
              const pct = (ch.count / totalReviews) * 100;
              const barWidth = (ch.count / totalReviews) * 100;

              return (
                <tr key={ch.name} className="border-b border-border-subtle">
                  <th
                    scope="row"
                    className="py-3 text-left font-medium text-text-primary"
                  >
                    <div className="flex items-center gap-3">
                      <span>{ch.name}</span>
                      {/* Bar adornment (aria-hidden) */}
                      <div
                        className="hidden h-[8px] flex-1 rounded-[2px] bg-border-subtle lg:block"
                        aria-hidden="true"
                      >
                        <div
                          className="h-full rounded-[2px] bg-text-secondary"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  </th>
                  <td className="py-3 text-right tabular-nums text-text-primary">
                    {ch.count}
                  </td>
                  <td className="py-3 text-right tabular-nums text-text-secondary">
                    {pct.toFixed(1).replace(".", ",")} %
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-border-mid bg-surface-elevated">
              <th
                scope="row"
                className="pt-3 font-ui text-[14px] font-semibold tabular-nums text-text-primary"
              >
                Total
              </th>
              <td className="pt-3 text-right font-ui text-[14px] font-semibold tabular-nums text-text-primary">
                {totalReviews}
              </td>
              <td className="pt-3 text-right font-ui text-[14px] font-semibold tabular-nums text-text-primary">
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
