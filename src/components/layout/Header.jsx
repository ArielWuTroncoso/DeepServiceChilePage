import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Moon, Sun, User, X } from 'lucide-react';
import Logo from './Logo';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/useAuth';

export const NAV = [
  { to: '/', label: 'Inicio', exact: true },
  { to: '/productos', label: 'Productos' },
  { to: '/servicios', label: 'Servicio técnico' },
  { to: '/marcas', label: 'Marcas' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { autenticado, esAdmin, cerrarSesion } = useAuth();
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
          <Link to="/" className="hdr__brand" aria-label="Deep Service Chile, ir al inicio">
            <Logo className="hdr__mark" size={80} decorativo />
            <span className="hdr__words">
              <span className="hdr__name">Deep Service <b>Chile</b></span>
              <span className="hdr__tagline">Electrónica marina</span>
            </span>
          </Link>

          <nav className="hdr__nav" aria-label="Navegación principal">
            {NAV.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) => `hdr__link${isActive ? ' is-active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hdr__actions">
            <button
              type="button"
              className="hdr__icon-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {autenticado ? (
              <>
                {esAdmin && <Link to="/admin" className="ds-btn ds-btn--onDark ds-btn--sm">Panel</Link>}
                <button type="button" className="hdr__icon-btn" onClick={salir} aria-label="Cerrar sesión">
                  <LogOut size={19} />
                </button>
              </>
            ) : (
              <Link to="/login" className="hdr__icon-btn" aria-label="Iniciar sesión"><User size={19} /></Link>
            )}

            <Link to="/contacto" className="ds-btn ds-btn--primary ds-btn--sm">Cotizar</Link>

            <button
              type="button"
              className="hdr__icon-btn hdr__burger"
              onClick={() => setAbierto((v) => !v)}
              aria-expanded={abierto}
              aria-controls="menu-movil"
              aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            >
              {abierto ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav id="menu-movil" className={`hdr__mobile${abierto ? ' is-open' : ''}`} aria-label="Navegación móvil">
          {NAV.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) => `hdr__link${isActive ? ' is-active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
          <div className="hdr__mobile-cta">
            <Link to="/contacto" className="ds-btn ds-btn--primary ds-btn--sm">Cotizar</Link>
            {autenticado
              ? <button type="button" className="ds-btn ds-btn--onDark ds-btn--sm" onClick={salir}>Cerrar sesión</button>
              : <Link to="/login" className="ds-btn ds-btn--onDark ds-btn--sm">Iniciar sesión</Link>}
          </div>
        </nav>
      </div>
    </header>
  );
}
