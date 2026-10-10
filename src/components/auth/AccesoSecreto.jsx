import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { crearDetectorAcceso } from '../../utils/accesoSecreto';

/** Escucha la secuencia ↑ ↓ en todo el sitio y lleva al área de administradores. */
export default function AccesoSecreto() {
  const navigate = useNavigate();
  const { esAdmin } = useAuth();

  useEffect(() => {
    const detector = crearDetectorAcceso(() => navigate(esAdmin ? '/admin' : '/acceso'));
    window.addEventListener('keydown', detector);
    return () => window.removeEventListener('keydown', detector);
  }, [navigate, esAdmin]);

  return null;
}
