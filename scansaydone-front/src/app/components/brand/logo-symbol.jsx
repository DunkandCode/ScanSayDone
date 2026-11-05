// Isotipo Scan-Say-Done como SVG inline para heredar currentColor.
// Reemplaza al <img>/next/image que perdia stroke="currentColor" (negro del browser).
// Geometria: marco de escaneo (4 escuadras L) + bocadillo rotado -8deg + 3 puntos.

export default function LogoSymbol({ size = 28, className = '', ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d="M30.5 8H16A8 8 0 0 0 8 16V30.5" />
      <path d="M87.5 8H102A8 8 0 0 1 110 16V30.5" />
      <path d="M8 78V92.5A8 8 0 0 0 16 100.5H30.5" />
      <path d="M110 78V92.5A8 8 0 0 1 102 100.5H87.5" />
      <g transform="translate(58.5 53.5)rotate(-8)">
        <rect x="-29.5" y="-20.5" width="59" height="41" rx="9.5" strokeWidth="13" />
        <path d="M-24.5 21L-18 39.5L-6 21" strokeWidth="13" />
        <g stroke="none" fill="currentColor">
          <circle cx="-15.2" r="5.6" />
          <circle r="5.6" />
          <circle cx="15.2" r="5.6" />
        </g>
      </g>
    </svg>
  );
}
