import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import LoadingScreen from './common/LoadingScreen';

export default function ProtectedRoute({ children, soloAdmin = false }) {
  const { autenticado, esAdmin, cargando } = useAuth();
  const location = useLocation();

  if (cargando) return <LoadingScreen mensaje="Verificando tu sesión" />;
  if (!autenticado) return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  if (soloAdmin && !esAdmin) return <Navigate to="/" replace />;

  return children;
}
