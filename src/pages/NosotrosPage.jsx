import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import SectionHead from '../components/common/SectionHead';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { HITOS } from '../data/empresa';

export default function NosotrosPage() {
  useDocumentTitle('Quiénes somos', 'Deep Service Chile: soluciones y respaldo técnico en equipos electrónicos marinos.');

  return (
    <>
      <PageHeader
        eyebrow="Quiénes somos"
        titulo="Respaldo técnico, no sólo venta"
        descripcion="Deep Service Chile entrega soluciones y respaldo técnico en equipos electrónicos marinos asociados a la navegación y la pesca."
        migas={[{ label: 'Nosotros' }]}
      />

      <section className="ds-section">
        <div className="ds-container">
          <div className="stat-band" style={{ marginBottom: 'clamp(40px, 6vw, 72px)' }}>
            {HITOS.map((h) => (
              <div className="stat" key={h.label}>
                <b>{h.valor}</b>
                <span>{h.label}</span>
              </div>
            ))}
          </div>

          <div className="prose">
            <h2>La empresa</h2>
            <p>
              Deep Service Chile entrega soluciones y respaldo técnico en equipos
              electrónicos marinos asociados a la navegación y la pesca. Nuestro servicio
              técnico está capacitado para realizar todo tipo de servicio electrónico,
              dando soluciones rápidas y eficientes a las necesidades de nuestros clientes.
            </p>
            <p>
              Atendemos lanchas pesqueras artesanales, barcos de pesca industrial, agencias
              navieras, embarcaciones fleteras, remolcadores y barcos mercantes, tanto en
              taller como a bordo y en zona de pesca.
            </p>

            <h2>Entidad técnica aprobada</h2>
            <p>
              Somos entidad técnica aprobada por la administración chilena, lo que nos
              habilita para inspeccionar y certificar equipos de navegación y de seguridad
              —radares, videosonda, AIS, RLS, SART y radios DSC, entre otros—, además de
              instalarlos, comisionarlos, mantenerlos y repararlos.
            </p>

            <h2>Cómo trabajamos</h2>
            <ul>
              <li><Check size={17} strokeWidth={3} aria-hidden="true" />Diagnosticamos antes de cotizar: la falla primero, el presupuesto después.</li>
              <li><Check size={17} strokeWidth={3} aria-hidden="true" />Instalamos, comisionamos y calibramos a bordo, con la tripulación presente.</li>
              <li><Check size={17} strokeWidth={3} aria-hidden="true" />Embarcamos a zona de pesca para dejar el sonar ajustado sobre cardumen real.</li>
              <li><Check size={17} strokeWidth={3} aria-hidden="true" />Instruimos en el uso real del equipo antes de entregarlo.</li>
              <li><Check size={17} strokeWidth={3} aria-hidden="true" />Mantenemos la carpeta GMDSS al día con contratos de mantenimiento.</li>
            </ul>

            <h2>Compromiso</h2>
            <p>
              Un sistema de detección o de navegación mal configurado no se nota el primer
              día: se nota cuando la faena depende de él. Por eso el servicio técnico no es
              un anexo del negocio, es el negocio.
            </p>
          </div>
        </div>
      </section>

      <section className="ds-section ds-dark">
        <span className="ds-grid-tex" aria-hidden="true" />
        <div className="ds-container" style={{ position: 'relative', zIndex: 2 }}>
          <SectionHead barra="Conversemos" titulo="¿Necesitas asesoría técnica?" />
          <p style={{ color: 'var(--on-dark-soft)', maxWidth: '60ch', lineHeight: 1.6, marginBottom: 28 }}>
            Cuéntanos qué embarcación tienes y qué necesitas resolver. Evaluamos el caso y
            te proponemos la configuración que corresponde.
          </p>
          <Link to="/contacto" className="ds-btn ds-btn--light">Contactar al equipo</Link>
        </div>
      </section>
    </>
  );
}
