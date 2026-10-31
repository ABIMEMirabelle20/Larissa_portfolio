// Le nom comme une signature : prénom en serif, nom en capitales sans-serif,
// et un point citron.
export default function Signature({ className = '' }) {
  return (
    <span className={`sig ${className}`}>
      <span className="sig__first">Mirabelle</span>
      <span className="sig__last">ABIME</span>
      <span className="sig__dot" aria-hidden="true" />
    </span>
  );
}
