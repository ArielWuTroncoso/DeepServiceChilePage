/**
 * Logotipo oficial de Deep Service Chile.
 *
 * Archivos en `public/marca/`:
 *   · deep-service-blanco.png  → versión calada en blanco, para fondos oscuros.
 *   · deep-service-azul.png    → versión azul marino, para fondos claros.
 *
 * El emblema es ovalado (proporción 560 × 475 ≈ 1,179:1). El componente recibe
 * la ALTURA en píxeles y calcula el ancho, para que nunca se deforme.
 */

const RATIO = 560 / 475;

const FUENTES = {
  blanco: '/marca/deep-service-blanco.png',
  azul: '/marca/deep-service-azul.png',
};

export default function Logo({ size = 46, variante = 'blanco', className = '', decorativo = false }) {
  const alto = size;
  const ancho = Math.round(size * RATIO);

  return (
    <img
      className={`ds-logo ${className}`.trim()}
      src={FUENTES[variante] ?? FUENTES.blanco}
      width={ancho}
      height={alto}
      /* Alto fijo y ancho derivado: así una media query puede cambiar sólo
         el alto y el óvalo nunca se deforma. */
      style={{ height: alto, width: 'auto', aspectRatio: `${ancho} / ${alto}` }}
      alt={decorativo ? '' : 'Deep Service Chile'}
      aria-hidden={decorativo || undefined}
      draggable="false"
    />
  );
}
