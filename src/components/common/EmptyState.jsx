import { SearchX } from 'lucide-react';

export default function EmptyState({ titulo, mensaje, icono: Icono = SearchX, children }) {
  return (
    <div className="ds-empty">
      <span className="ds-empty__icon" aria-hidden="true"><Icono size={30} /></span>
      <h3>{titulo}</h3>
      {mensaje && <p>{mensaje}</p>}
      {children}
    </div>
  );
}
