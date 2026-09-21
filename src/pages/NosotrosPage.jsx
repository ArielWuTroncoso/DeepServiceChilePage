import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import SectionHead from '../components/common/SectionHead';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useIdioma } from '../i18n/IdiomaContext';
import { useEmpresa } from '../i18n/datos';

const TEXTO = {
  es: {
    empresaTitulo: 'La empresa',
    empresa: [
      'Deep Service Chile entrega soluciones y respaldo técnico en equipos electrónicos marinos asociados a la navegación y la pesca. Nuestro servicio técnico está capacitado para realizar todo tipo de servicio electrónico, dando soluciones rápidas y eficientes a las necesidades de nuestros clientes.',
      'Atendemos lanchas pesqueras artesanales, barcos de pesca industrial, agencias navieras, embarcaciones fleteras, remolcadores y barcos mercantes, tanto en taller como a bordo y en zona de pesca.',
    ],
    etaTitulo: 'Entidad técnica aprobada',
    eta: 'Somos entidad técnica aprobada por la administración chilena, lo que nos habilita para inspeccionar y certificar equipos de navegación y de seguridad —radares, videosonda, AIS, RLS, SART y radios DSC, entre otros—, además de instalarlos, comisionarlos, mantenerlos y repararlos.',
    comoTitulo: 'Cómo trabajamos',
    como: [
      'Diagnosticamos antes de cotizar: la falla primero, el presupuesto después.',
      'Instalamos, comisionamos y calibramos a bordo, con la tripulación presente.',
      'Embarcamos a zona de pesca para dejar el sonar ajustado sobre cardumen real.',
      'Instruimos en el uso real del equipo antes de entregarlo.',
      'Mantenemos la carpeta GMDSS al día con contratos de mantenimiento.',
    ],
    compromisoTitulo: 'Compromiso',
    compromiso: 'Un sistema de detección o de navegación mal configurado no se nota el primer día: se nota cuando la faena depende de él. Por eso el servicio técnico no es un anexo del negocio, es el negocio.',
  },
  en: {
    empresaTitulo: 'The company',
    empresa: [
      'Deep Service Chile provides solutions and technical support for marine electronic equipment used in navigation and fishing. Our technical service team is qualified to carry out all types of electronic service, providing fast and efficient solutions to our customers’ needs.',
      'We serve artisanal fishing boats, industrial fishing vessels, shipping agencies, cargo boats, tugboats and merchant ships, in our workshop, on board and on the fishing grounds.',
    ],
    etaTitulo: 'Approved technical entity',
    eta: 'We are a technical entity approved by the Chilean maritime administration, which authorizes us to inspect and certify navigation and safety equipment —radars, video echo sounders, AIS, EPIRB, SART and DSC radios, among others— as well as to install, commission, maintain and repair it.',
    comoTitulo: 'How we work',
    como: [
      'We diagnose before we quote: the fault first, the budget second.',
      'We install, commission and calibrate on board, with the crew present.',
      'We go out to the fishing grounds to tune the sonar on real fish schools.',
      'We train the crew in real-world use of the equipment before handover.',
      'We keep the GMDSS documentation file up to date with maintenance contracts.',
    ],
    compromisoTitulo: 'Our commitment',
    compromiso: 'A poorly configured detection or navigation system does not show on day one: it shows when the fishing trip depends on it. That is why technical service is not an add-on to our business — it is our business.',
  },
};

export default function NosotrosPage() {
  const { t, idioma } = useIdioma();
  const { HITOS } = useEmpresa();
  const x = TEXTO[idioma];
  useDocumentTitle(
    t('Quiénes somos', 'About us'),
    t('Deep Service Chile: soluciones y respaldo técnico en equipos electrónicos marinos.',
      'Deep Service Chile: solutions and technical support for marine electronic equipment.'),
  );

  return (
    <>
      <PageHeader
        eyebrow={t('Quiénes somos', 'About us')}
        titulo={t('Respaldo técnico, no sólo venta', 'Technical support, not just sales')}
        descripcion={t(
          'Deep Service Chile entrega soluciones y respaldo técnico en equipos electrónicos marinos asociados a la navegación y la pesca.',
          'Deep Service Chile provides solutions and technical support for marine electronic equipment used in navigation and fishing.',
        )}
        migas={[{ label: t('Nosotros', 'About us') }]}
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
            <h2>{x.empresaTitulo}</h2>
            {x.empresa.map((p) => <p key={p}>{p}</p>)}

            <h2>{x.etaTitulo}</h2>
            <p>{x.eta}</p>

            <h2>{x.comoTitulo}</h2>
            <ul>
              {x.como.map((c) => (
                <li key={c}><Check size={17} strokeWidth={3} aria-hidden="true" />{c}</li>
              ))}
            </ul>

            <h2>{x.compromisoTitulo}</h2>
            <p>{x.compromiso}</p>
          </div>
        </div>
      </section>

      <section className="ds-section ds-dark">
        <span className="ds-grid-tex" aria-hidden="true" />
        <div className="ds-container" style={{ position: 'relative', zIndex: 2 }}>
          <SectionHead barra={t('Conversemos', 'Let’s talk')} titulo={t('¿Necesitas asesoría técnica?', 'Need technical advice?')} />
          <p style={{ color: 'var(--on-dark-soft)', maxWidth: '60ch', lineHeight: 1.6, marginBottom: 28 }}>
            {t(
              'Cuéntanos qué embarcación tienes y qué necesitas resolver. Evaluamos el caso y te proponemos la configuración que corresponde.',
              'Tell us about your vessel and what you need to solve. We will assess the case and propose the right configuration.',
            )}
          </p>
          <Link to="/contacto" className="ds-btn ds-btn--light">{t('Contactar al equipo', 'Contact our team')}</Link>
        </div>
      </section>
    </>
  );
}
