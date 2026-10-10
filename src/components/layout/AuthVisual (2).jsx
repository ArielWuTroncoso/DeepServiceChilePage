import { Check } from 'lucide-react';
import Logo from './Logo';

export default function AuthVisual({ titulo, texto, puntos = [] }) {
  return (
    <div className="auth__visual ds-dark">
      <span className="ds-arcs" aria-hidden="true" />
      <span className="ds-grid-tex" aria-hidden="true" />
      <div className="auth__visual-inner">
        <Logo size={64} />
        <h2 className="ds-display ds-h2">{titulo}</h2>
        <p>{texto}</p>
        <ul className="auth__points">
          {puntos.map((p) => (
            <li key={p}><Check size={18} strokeWidth={3} aria-hidden="true" />{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
