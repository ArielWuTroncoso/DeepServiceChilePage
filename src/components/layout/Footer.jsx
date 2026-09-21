import { Link } from 'react-router-dom';
import { ClipboardCheck, Instagram, Mail, MapPin, Phone, Radar, Wrench } from 'lucide-react';
import Logo from './Logo';
import { CONTACTO } from '../../data/empresa';

const FRANJA = [
  { icono: Radar, label: 'Mantención' },
  { icono: Wrench, label: 'Instalación' },
  { icono: ClipboardCheck, label: 'Inspecciones GMDSS' },
];

export default function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="ftr">
      <div className="ds-container">
        <div className="ftr__services">
          {FRANJA.map(({ icono: Icono, label }, i) => (
            <div key={label} style={{ display: 'contents' }}>
              <span className="ftr__service"><Icono size={24} strokeWidth={2} />{label}</span>
              {i < FRANJA.length - 1 && <span className="ftr__sep" aria-hidden="true" />}
            </div>
          ))}
        </div>

        <div className="ftr__main">
          <div>
            <div className="ftr__brand">
              <Logo size={56} decorativo />
              <span className="hdr__words">
                <span className="hdr__name">Deep Service <b>Chile</b></span>
                <span className="hdr__tagline">Electrónica marina</span>
              </span>
            </div>
            <p className="ftr__about">
              Soluciones y respaldo técnico en equipos electrónicos marinos asociados
              a la navegación y la pesca. Entidad técnica aprobada por la administración
              chilena para inspeccionar, certificar, instalar y reparar equipos de
              navegación y seguridad.
            </p>
          </div>

          <div>
            <h4>Catálogo</h4>
            <ul>
              <li><Link to="/productos?categoria=pesca">Equipos de pesca</Link></li>
              <li><Link to="/productos?categoria=navegacion">Navegación</Link></li>
              <li><Link to="/productos?categoria=comunicaciones">Comunicaciones</Link></li>
              <li><Link to="/productos?categoria=seguridad">Seguridad</Link></li>
              <li><Link to="/productos?categoria=accesorios">Accesorios</Link></li>
            </ul>
          </div>

          <div>
            <h4>Empresa</h4>
            <ul>
              <li><Link to="/servicios">Servicio técnico</Link></li>
              <li><Link to="/marcas">Marcas</Link></li>
              <li><Link to="/nosotros">Quiénes somos</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4>Contacto</h4>
            <ul className="ftr__contact">
              <li>
                <Phone size={18} />
                <span>
                  <strong>Oficina</strong>
                  <a href={`tel:${CONTACTO.fijo.tel}`}>{CONTACTO.fijo.label}</a>
                </span>
              </li>
              {CONTACTO.ejecutivos.map((e) => (
                <li key={e.tel}>
                  <Phone size={18} />
                  <span>
                    <strong>{e.nombre}</strong>
                    <a href={`tel:${e.tel}`}>{e.label}</a>
                  </span>
                </li>
              ))}
              <li>
                <Mail size={18} />
                <span>
                  <strong>Correo</strong>
                  <a href={`mailto:${CONTACTO.correo}`}>{CONTACTO.correo}</a>
                </span>
              </li>
              <li>
                <MapPin size={18} />
                <span>
                  <strong>Ubicación</strong>
                  {CONTACTO.ciudad}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="ftr__bottom">
          <span>© {anio} Deep Service Chile. Todos los derechos reservados.</span>
          <div className="ftr__social">
            <a href={CONTACTO.instagram.url} target="_blank" rel="noreferrer noopener" aria-label="Instagram de Deep Service Chile">
              <Instagram size={19} />
            </a>
            <a href={`mailto:${CONTACTO.correo}`} aria-label="Enviar correo"><Mail size={19} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
