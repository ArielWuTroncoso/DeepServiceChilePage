import { Link } from 'react-router-dom';
import { ClipboardCheck, Instagram, Mail, MapPin, Phone, Radar, Wrench } from 'lucide-react';
import Logo from './Logo';
import { useIdioma } from '../../i18n/IdiomaContext';
import { useCatalogo, useEmpresa } from '../../i18n/datos';

export default function Footer() {
  const anio = new Date().getFullYear();
  const { t } = useIdioma();
  const { CONTACTO } = useEmpresa();
  const { CATEGORIAS } = useCatalogo();

  const franja = [
    { icono: Radar, label: t('Mantención', 'Maintenance') },
    { icono: Wrench, label: t('Instalación', 'Installation') },
    { icono: ClipboardCheck, label: t('Inspecciones GMDSS', 'GMDSS inspections') },
  ];

  return (
    <footer className="ftr">
      <div className="ds-container">
        <div className="ftr__services">
          {franja.map(({ icono: Icono, label }, i) => (
            <div key={label} style={{ display: 'contents' }}>
              <span className="ftr__service"><Icono size={24} strokeWidth={2} />{label}</span>
              {i < franja.length - 1 && <span className="ftr__sep" aria-hidden="true" />}
            </div>
          ))}
        </div>

        <div className="ftr__main">
          <div>
            <div className="ftr__brand">
              <Logo size={56} decorativo />
              <span className="hdr__words">
                <span className="hdr__name">Deep Service <b>Chile</b></span>
                <span className="hdr__tagline">{t('Electrónica marina', 'Marine electronics')}</span>
              </span>
            </div>
            <p className="ftr__about">
              {t(
                'Soluciones y respaldo técnico en equipos electrónicos marinos asociados a la navegación y la pesca. Entidad técnica aprobada por la administración chilena para inspeccionar, certificar, instalar y reparar equipos de navegación y seguridad.',
                'Solutions and technical support for marine electronic equipment used in navigation and fishing. Approved technical entity of the Chilean maritime administration for the inspection, certification, installation and repair of navigation and safety equipment.',
              )}
            </p>
          </div>

          <div>
            <h4>{t('Catálogo', 'Catalog')}</h4>
            <ul>
              {CATEGORIAS.map((c) => (
                <li key={c.slug}><Link to={`/productos?categoria=${c.slug}`}>{c.nombre}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{t('Empresa', 'Company')}</h4>
            <ul>
              <li><Link to="/servicios">{t('Servicio técnico', 'Technical service')}</Link></li>
              <li><Link to="/marcas">{t('Marcas', 'Brands')}</Link></li>
              <li><Link to="/nosotros">{t('Quiénes somos', 'About us')}</Link></li>
              <li><Link to="/contacto">{t('Contacto', 'Contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4>{t('Contacto', 'Contact')}</h4>
            <ul className="ftr__contact">
              <li>
                <Phone size={18} />
                <span>
                  <strong>{t('Oficina', 'Office')}</strong>
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
                  <strong>{t('Correo', 'Email')}</strong>
                  <a href={`mailto:${CONTACTO.correo}`}>{CONTACTO.correo}</a>
                </span>
              </li>
              <li>
                <MapPin size={18} />
                <span>
                  <strong>{t('Dirección', 'Address')}</strong>
                  <a href={CONTACTO.mapa.ficha} target="_blank" rel="noreferrer noopener">
                    {CONTACTO.direccion}, {CONTACTO.ciudad}
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="ftr__bottom">
          <span>© {anio} Deep Service Chile. {t('Todos los derechos reservados.', 'All rights reserved.')}</span>
          <div className="ftr__social">
            <a href={CONTACTO.instagram.url} target="_blank" rel="noreferrer noopener" aria-label={t('Instagram de Deep Service Chile', 'Deep Service Chile on Instagram')}>
              <Instagram size={19} />
            </a>
            <a href={`mailto:${CONTACTO.correo}`} aria-label={t('Enviar correo', 'Send an email')}><Mail size={19} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
