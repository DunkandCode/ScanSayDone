/**
 * L4 — Landing band 4: "Canales".
 * Plan: L4-CANALES-2026-11-06.md (PROPOSED).
 * No network, no hex, no shadows, no gradients, no CTA.
 * All colors resolve to @theme tokens defined in globals.css.
 */

type ChannelKind = "mesa" | "mostrador" | "cartel" | "tablet";

/* QR grid cells [col, row] — 6×5 matrix, step 8, module 7. §4.3. */
const QR: Record<"mesa" | "mostrador" | "cartel", [number, number][]> = {
  mesa:      [[0,0],[2,0],[4,0],[5,0],[1,1],[2,1],[0,2],[3,2],[4,2],[1,3],[5,3],[0,4],[3,4],[5,4]],
  mostrador: [[1,0],[2,0],[4,0],[0,1],[3,1],[5,1],[0,2],[2,2],[3,2],[4,3],[5,3],[0,4],[1,4],[3,4],[5,4]],
  cartel:    [[0,0],[1,0],[3,0],[5,0],[2,1],[4,1],[0,2],[3,2],[4,2],[1,3],[2,3],[5,3],[0,4],[4,4],[5,4]],
};
const QR_O: Record<"mesa" | "mostrador" | "cartel", [number, number]> = {
  mesa: [94, 22], mostrador: [71, 14], cartel: [94, 16],
};

function QrMatrix({ kind }: { kind: "mesa" | "mostrador" | "cartel" }) {
  const [ox, oy] = QR_O[kind];
  return (
    <g fill="var(--color-text-primary)">
      {QR[kind].map(([c, r], i) => (
        <rect key={i} x={ox + c * 8} y={oy + r * 8} width={7} height={7} />
      ))}
    </g>
  );
}

function ChannelIllustration({ kind }: { kind: ChannelKind }) {
  const p = "var(--color-text-primary)";
  const s = "var(--color-border-subtle)";
  const m = "var(--color-border-mid)";
  const a = "var(--color-interactive-primary)";

  return (
    <svg
      viewBox="0 0 235 96"
      className="block h-24 w-full"
      aria-hidden="true"
      focusable="false"
      data-decorativo="ilustracion"
      preserveAspectRatio="xMidYMid meet"
    >
      {kind === "mesa" && (
        <>
          <g fill="none" stroke={p} strokeWidth="1.5">
            <path d="M20 70H215" /><path d="M44 70V90" /><path d="M191 70V90" />
            <rect x="86" y="16" width="64" height="54" rx="3" />
          </g>
          <QrMatrix kind="mesa" />
          <rect x="94" y="63" width="46" height="4" rx="2" fill={s} />
        </>
      )}
      {kind === "mostrador" && (
        <>
          <g fill="none" stroke={p} strokeWidth="1.5">
            <path d="M14 56H202" /><path d="M14 56V90" /><path d="M202 56V90" />
            <rect x="150" y="30" width="44" height="26" rx="3" />
            <rect x="64" y="10" width="60" height="46" rx="3" />
          </g>
          <rect x="158" y="36" width="28" height="3" rx="1.5" fill={s} />
          <QrMatrix kind="mostrador" />
        </>
      )}
      {kind === "cartel" && (
        <>
          <rect x="81" y="6" width="8" height="8" rx="1" fill={p} />
          <rect x="148" y="6" width="8" height="8" rx="1" fill={p} />
          <rect x="78" y="6" width="79" height="84" rx="2" fill="none" stroke={p} strokeWidth="1.5" />
          <QrMatrix kind="cartel" />
          <rect x="94" y="68" width="47" height="4" rx="2" fill={s} />
          <rect x="94" y="78" width="33" height="4" rx="2" fill={s} />
        </>
      )}
      {kind === "tablet" && (
        <>
          <g fill="none" stroke={p} strokeWidth="1.5">
            <rect x="68" y="8" width="99" height="80" rx="10" />
            <rect x="74" y="14" width="87" height="64" rx="2" />
            <circle cx="117" cy="82" r="2.5" />
          </g>
          <rect x="80" y="20" width="74" height="6" rx="3" fill={s} />
          <g fill="none" stroke={m} strokeWidth="1.5">
            <rect x="80" y="36" width="12" height="12" rx="2" />
            <rect x="96" y="36" width="12" height="12" rx="2" />
            <rect x="128" y="36" width="12" height="12" rx="2" />
            <rect x="144" y="36" width="12" height="12" rx="2" />
          </g>
          <rect x="112" y="36" width="12" height="12" rx="2" fill={a} />
          <rect x="100" y="60" width="36" height="8" rx="4" fill="none" stroke={p} strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}

const CHANNELS: { kind: ChannelKind; title: string; body: string }[] = [
  { kind: "mesa", title: "En la mesa", body: "Un QR sobre la mesa. El cliente lo enfoca desde su asiento y responde." },
  { kind: "mostrador", title: "En el mostrador", body: "El QR junto a la caja: se escanea al pagar, antes de irte." },
  { kind: "cartel", title: "En el cartel", body: "Un cartel en la pared o junto a la fila. Quien espera contesta desde ahí." },
  { kind: "tablet", title: "En la tablet", body: "Si atiendes con tablet, la encuesta se abre ahí, sin instalar nada." },
];

export function Channels() {
  return (
    <section
      id="canales"
      tabIndex={-1}
      aria-labelledby="l4-title"
      className="w-full bg-background-page px-4 py-15 md:py-25 scroll-mt-[92px] focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
    >
      <div className="mx-auto w-full max-w-mkt-sm md:max-w-mkt-md lg:max-w-mkt-lg xl:max-w-mkt-xl">
        <p className="font-ui text-[12px] font-semibold uppercase tracking-[0.14em] text-text-secondary lg:text-[13px]">
          SIEMPRE CERCA DE TUS CLIENTES
        </p>

        <h2
          id="l4-title"
          className="mt-3 font-display uppercase text-[44px] leading-[0.95] tracking-[0.01em] text-text-primary md:text-[64px]"
        >
          DONDE ESTÁ TU CLIENTE
        </h2>

        <p className="mt-4 max-w-[70ch] font-ui text-[17px] leading-[1.55] text-text-secondary md:text-[18px]">
          Tus clientes ya están en la mesa o en la caja. Ahí empieza todo.
        </p>

        <ul role="list" className="mt-12 grid grid-cols-12 gap-6 list-none">
          {CHANNELS.map((ch, index) => (
            <li
              key={ch.kind}
              className={`reveal${index > 0 ? ` reveal-${index + 1}` : ""} col-span-12 lg:col-span-6 xl:col-span-3 rounded-[8px] border border-border-mid bg-surface-default p-4`}
            >
              <ChannelIllustration kind={ch.kind} />
              <h3 className="mt-2 font-ui text-[18px] font-semibold leading-[1.3] text-text-primary md:text-[20px]">
                {ch.title}
              </h3>
              <p className="mt-2 font-ui text-[16px] leading-[1.6] text-text-primary">
                {ch.body}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-[58ch] font-ui text-[12px] leading-[1.5] text-text-secondary">
          Estas figuras son ilustraciones propias. Los códigos dibujados no son códigos QR y no se pueden escanear.
        </p>
      </div>
    </section>
  );
}
