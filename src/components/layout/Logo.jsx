/**
 * Marca de Deep Service.
 * Reemplazar `/logo.svg` en la carpeta public por el logotipo oficial
 * (versión calada en blanco para fondos oscuros). Mientras no exista,
 * se dibuja este emblema de respaldo para no romper el maquetado.
 */
export default function Logo({ size = 46, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Deep Service"
    >
      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="2" opacity=".55" />
      <circle cx="32" cy="2.5" r="2.5" fill="currentColor" />
      <circle cx="32" cy="61.5" r="2.5" fill="currentColor" />
      <circle cx="2.5" cy="32" r="2.5" fill="currentColor" />
      <circle cx="61.5" cy="32" r="2.5" fill="currentColor" />
      <path d="M13 38c5.5-3.6 10-3.6 15.5 0s10 3.6 15.5 0 5.5-2.7 7-1.8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M13 46c5.5-3.6 10-3.6 15.5 0s10 3.6 15.5 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".6" />
      <path d="M32 14c4 4 6 8 6 12M32 14c-4 4-6 8-6 12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="32" cy="27" r="2.6" fill="currentColor" />
    </svg>
  );
}
