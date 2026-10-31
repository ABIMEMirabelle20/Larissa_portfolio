// Nœud papillon en SVG : version de l'introduction pour mobile, sans WebGL,
// ou quand la 3D n'est pas disponible. Il se défait grâce aux classes CSS de
// Intro.css (is-untying).
export default function BowTieSvg() {
  return (
    <svg className="bow" viewBox="0 0 320 210" aria-hidden="true" focusable="false">
      <path className="bow__tail bow__tail--l" d="M150 112L112 196l24-8 18 12 16-82Z" />
      <path className="bow__tail bow__tail--r" d="M170 112l38 84-24-8-18 12-16-82Z" />
      <g className="bow__wing bow__wing--l">
        <path d="M144 100C105 50 58 38 22 58v84c36 20 83 8 122-42Z" />
        <path className="bow__fold" d="M144 100C100 96 62 98 22 100" />
      </g>
      <g className="bow__wing bow__wing--r">
        <path d="M176 100C215 50 262 38 298 58v84c-36 20-83 8-122-42Z" />
        <path className="bow__fold" d="M176 100C220 96 258 98 298 100" />
      </g>
      <rect className="bow__knot" x="141" y="76" width="38" height="48" rx="15" />
    </svg>
  );
}
