import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Moon, Sun, User, X } from 'lucide-react';
import Logo from './Logo';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/useAuth';
import { useIdioma } from '../../i18n/IdiomaContext';

export const NAV = [
  { to: '/', es: 'Inicio', en: 'Home', exact: true },
  { to: '/productos', es: 'Productos', en: 'Products' },
  { to: '/servicios', es: 'Servicio técnico', en: 'Technical service' },
  { to: '/marcas', es: 'Marcas', en: 'Brands' },
  { to: '/nosotros', es: 'Nosotros', en: 'About us' },
  { to: '/contacto', es: 'Contacto', en: 'Contact' },
];

/** Selector ES | EN: muestra ambos idiomas y resalta el activo. */
function SelectorIdioma({ className = '' }) {
  const { idioma, setIdioma, t } = useIdioma();
  return (
    <div className={`hdr__lang ${className}`.trim()} role="group" aria-label={t('Idioma del sitio', 'Site language')}>
      {[['es', 'ES', 'Español'], ['en', 'EN', 'English']].map(([code, corto, largo]) => (
        <button
          key={code}
          type="button"
          lang={code}
          className={idioma === code ? 'is-on' : ''}
          aria-pressed={idioma === code}
          aria-label={largo}
          title={largo}
          onClick={() => setIdioma(code)}
        >
          {corto}
        </button>
      ))}
    </div>
  );
}

export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { autenticado, esAdmin, cerrarSesion } = useAuth();
  const { t } = useIdioma();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setAbierto(false); }, [pathname]);

  useEffect(() => {
    const alScroll = () => setScrolled(window.scrollY > 12);
    alScroll();
    window.addEventListener('scroll', alScroll, { passive: true });
    return () => window.removeEventListener('scroll', alScroll);
  }, []);

  const salir = () => { cerrarSesion(); navigate('/'); };

  return (
    <header className={`hdr${scrolled ? ' is-scrolled' : ''}`}>
      <div className="ds-container">
        <div className="hdr__bar">
          <Link to="/" className="hdr__brand" aria-label={t('Deep Service Chile, ir al inicio', 'Deep Service Chile, go to home page')}>
            <Logo className="hdr__mark" size={80} decorativo />
            <span className="hdr__words">
              <span className="hdr__name">Deep Service <b>Chile</b></span>
              <span className="hdr__tagline">{t('Electrónica marina', 'Marine electronics')}</span>
            </span>
          </Link>

          <nav className="hdr__nav" aria-label={t('Navegación principal', 'Main navigation')}>
            {NAV.map(({ to, es, en, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) => `hdr__link${isActive ? ' is-active' : ''}`}
              >
                {t(es, en)}
              </NavLink>
            ))}
          </nav>

          <div className="hdr__actions">
            <SelectorIdioma className="hdr__lang--bar" />
            <button
              type="button"
              className="hdr__icon-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t('Cambiar a modo claro', 'Switch to light mode') : t('Cambiar a modo oscuro', 'Switch to dark mode')}
            >
              {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {autenticado ? (
              <>
                {esAdmin && <Link to="/admin" className="ds-btn ds-btn--onDark ds-btn--sm">{t('Panel', 'Admin')}</Link>}
                <button type="button" className="hdr__icon-btn" onClick={salir} aria-label={t('Cerrar sesión', 'Sign out')}>
                  <LogOut size={19} />
                </button>
              </>
            ) : (
              <Link to="/login" className="hdr__icon-btn" aria-label={t('Iniciar sesión', 'Sign in')}><User size={19} /></Link>
            )}

            <Link to="/contacto" className="ds-btn ds-btn--primary ds-btn--sm">{t('Cotizar', 'Get a quote')}</Link>

            <button
              type="button"
              className="hdr__icon-btn hdr__burger"
              onClick={() => setAbierto((v) => !v)}
              aria-expanded={abierto}
              aria-controls="menu-movil"
              aria-label={abierto ? t('Cerrar menú', 'Close menu') : t('Abrir menú', 'Open menu')}
            >
              {abierto ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav id="menu-movil" className={`hdr__mobile${abierto ? ' is-open' : ''}`} aria-label={t('Navegación móvil', 'Mobile navigation')}>
          <SelectorIdioma className="hdr__lang--menu" />
          {NAV.map(({ to, es, en, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) => `hdr__link${isActive ? ' is-active' : ''}`}
            >
              {t(es, en)}
            </NavLink>
          ))}
          <div className="hdr__mobile-cta">
            <Link to="/contacto" className="ds-btn ds-btn--primary ds-btn--sm">{t('Cotizar', 'Get a quote')}</Link>
            {autenticado
              ? <button type="button" className="ds-btn ds-btn--onDark ds-btn--sm" onClick={salir}>{t('Cerrar sesión', 'Sign out')}</button>
              : <Link to="/login" className="ds-btn ds-btn--onDark ds-btn--sm">{t('Iniciar sesión', 'Sign in')}</Link>}
          </div>
        </nav>
      </div>
    </header>
  );
}
