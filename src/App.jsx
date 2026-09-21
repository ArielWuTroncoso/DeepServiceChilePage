import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import CardSkeleton from './components/skeletons/CardSkeleton';
import { AuthProvider } from './context/AuthContext';
import { useIdioma } from './i18n/IdiomaContext';

const HomePage      = lazy(() => import('./pages/HomePage'));
const ProductosPage = lazy(() => import('./pages/ProductosPage'));
const ProductoPage  = lazy(() => import('./pages/ProductoPage'));
const ServiciosPage = lazy(() => import('./pages/ServiciosPage'));
const MarcasPage    = lazy(() => import('./pages/MarcasPage'));
const NosotrosPage  = lazy(() => import('./pages/NosotrosPage'));
const ContactoPage  = lazy(() => import('./pages/ContactoPage'));
const LoginPage     = lazy(() => import('./pages/LoginPage'));
const RegistroPage  = lazy(() => import('./pages/RegistroPage'));
const AdminPage     = lazy(() => import('./pages/AdminPage'));
const NotFoundPage  = lazy(() => import('./pages/NotFoundPage'));

/** Cada cambio de ruta vuelve al inicio de la página. */
function ScrollAlTope() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

export default function App() {
  const { t } = useIdioma();
  return (
    <AuthProvider>
      <a className="ds-skip" href="#contenido">{t('Saltar al contenido', 'Skip to content')}</a>
      <ScrollAlTope />
      <Header />

      <main className="main-content" id="contenido">
        <Suspense fallback={<CardSkeleton count={3} label={t('Cargando contenido', 'Loading content')} />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/productos/:slug" element={<ProductoPage />} />
            <Route path="/servicios" element={<ServiciosPage />} />
            <Route path="/marcas" element={<MarcasPage />} />
            <Route path="/nosotros" element={<NosotrosPage />} />
            <Route path="/contacto" element={<ContactoPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegistroPage />} />
            <Route
              path="/admin"
              element={<ProtectedRoute soloAdmin><AdminPage /></ProtectedRoute>}
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </AuthProvider>
  );
}
