import mascot from '../data/mascot';
import './Mascot.css';

// Une illustration déposée dans src/assets/ sous le nom "mascot" (png, webp,
// svg ou jpg) remplace le dessin ci-dessous.
const customFiles = import.meta.glob('../assets/mascot.{png,webp,svg,jpg}', {
  eager: true,
  import: 'default',
});
const customImage = Object.values(customFiles)[0];

function HairBack({ style, color }) {
  if (style === 'long') {
    return <path d="M52 124C40 62 90 22 130 22s90 40 78 102l8 130H44Z" fill={color} />;
  }
  if (style === 'bun') {
    return (
      <>
        <circle cx="130" cy="30" r="30" fill={color} />
        <ellipse cx="130" cy="112" rx="74" ry="80" fill={color} />
      </>
    );
  }
  return (
    <>
      <circle cx="62" cy="62" r="40" fill={color} />
      <circle cx="198" cy="62" r="40" fill={color} />
      <circle cx="130" cy="30" r="32" fill={color} />
      <ellipse cx="130" cy="112" rx="74" ry="80" fill={color} />
    </>
  );
}

// Illustration 2D de la mascotte. Props :
//   talking : la bouche s'anime (pendant que la mascotte parle)
//   waving  : le bras droit salue
export default function Mascot({ talking = false, waving = false, className = '', alt = '' }) {
  if (customImage) {
    return <img className={`mascot mascot--image ${className}`} src={customImage} alt={alt} decoding="async" />;
  }

  const { skin, hair, hairStyle, outfit, collar, bow, glasses } = mascot;

  return (
    <svg
      className={`mascot ${talking ? 'is-talking' : ''} ${waving ? 'is-waving' : ''} ${className}`}
      viewBox="0 0 260 330"
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : 'true'}
      focusable="false"
    >
      <HairBack style={hairStyle} color={hair} />

      {/* Bras qui salue, derrière le buste */}
      <g className="mascot__arm">
        <path d="M196 262C222 244 232 214 234 184" fill="none" stroke={outfit} strokeWidth="28" strokeLinecap="round" />
        <path d="M184 270C214 250 226 222 229 194" fill="none" stroke={collar} strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
        <circle cx="234" cy="170" r="17" fill={skin} />
      </g>

      {/* Buste, cou et col */}
      <path d="M44 330c0-62 36-98 86-98s86 36 86 98Z" fill={outfit} />
      <rect x="110" y="186" width="40" height="56" rx="14" fill={skin} />
      <path d="M96 236l34 34 34-34-10-8-24 22-24-22Z" fill={collar} />

      {/* Nœud papillon */}
      <g transform="translate(130 258)">
        <path d="M0 0L-30-16v32Z" fill={bow} stroke="#24131F" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M0 0L30-16v32Z" fill={bow} stroke="#24131F" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="-7" y="-9" width="14" height="18" rx="5" fill={bow} stroke="#24131F" strokeWidth="2.5" />
      </g>

      {/* Tête */}
      <circle cx="66" cy="128" r="11" fill={skin} />
      <circle cx="194" cy="128" r="11" fill={skin} />
      <ellipse cx="130" cy="122" rx="64" ry="70" fill={skin} />

      {/* Cheveux de devant (frange) */}
      <path d="M66 112C62 62 100 40 130 40s68 22 64 72c-18-28-44-38-64-38s-46 10-64 38Z" fill={hair} />

      {/* Visage */}
      <g className="mascot__eyes">
        <ellipse cx="106" cy="128" rx="7" ry="9" fill="#24131F" />
        <ellipse cx="154" cy="128" rx="7" ry="9" fill="#24131F" />
        <circle cx="108.5" cy="124.5" r="2.4" fill="#FFF9F0" />
        <circle cx="156.5" cy="124.5" r="2.4" fill="#FFF9F0" />
      </g>
      <path d="M92 108q14-9 28-1M140 107q14-8 28 1" fill="none" stroke="#24131F" strokeWidth="4" strokeLinecap="round" />
      <path d="M130 136q-4 10 3 12" fill="none" stroke="#24131F" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
      <circle cx="90" cy="148" r="9" fill="#581C35" opacity="0.18" />
      <circle cx="170" cy="148" r="9" fill="#581C35" opacity="0.18" />
      <path className="mascot__smile" d="M110 154q20 20 40 0" fill="none" stroke="#24131F" strokeWidth="4.5" strokeLinecap="round" />
      <g className="mascot__mouth">
        <ellipse cx="130" cy="162" rx="14" ry="10" fill="#24131F" />
        <ellipse cx="130" cy="167" rx="8" ry="4.5" fill="#F4C2D7" />
      </g>

      {glasses && (
        <g fill="none" stroke="#24131F" strokeWidth="3.5">
          <circle cx="106" cy="128" r="19" />
          <circle cx="154" cy="128" r="19" />
          <path d="M125 128h10" />
        </g>
      )}
    </svg>
  );
}
