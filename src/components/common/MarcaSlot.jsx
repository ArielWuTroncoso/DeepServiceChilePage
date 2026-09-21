/**
 * Casilla de marca. Si la marca tiene `logo`, lo muestra; si no, compone el
 * nombre tipográficamente, que es una solución válida por sí misma y evita el
 * aspecto de "hueco pendiente".
 */
export default function MarcaSlot({ marca, alto = 108, variante = 'claro' }) {
  return (
    <div className={`brand-slot brand-slot--${variante}`} style={{ height: alto }}>
      {marca.logo
        ? <img className="brand-slot__logo" src={marca.logo} alt={marca.nombre} loading="lazy" />
        : <span className="brand-slot__word">{marca.nombre}</span>}
      {marca.destacada && <span className="brand-slot__tag">Servicio técnico oficial</span>}
    </div>
  );
}
