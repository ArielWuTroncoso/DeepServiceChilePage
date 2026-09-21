/**
 * Casilla de marca con su logotipo original.
 *
 * Tamaño óptico: a igual alto, un logotipo cuadrado (ACR) se ve mucho más
 * pesado que uno apaisado (GARMIN). Por eso el alto se calcula para que todos
 * ocupen una SUPERFICIE parecida: alto = √(área / proporción), con topes para
 * que ninguno toque los bordes de la casilla.
 *
 * La casilla es siempre blanca (también en modo oscuro), como una placa de
 * logotipos, para respetar los colores originales de cada marca.
 */
import { useIdioma } from '../../i18n/IdiomaContext';

export default function MarcaSlot({ marca, alto = 108 }) {
  const { t } = useIdioma();
  const conTag = Boolean(marca.destacada);
  const area = 0.42 * alto * alto;
  const topeAlto = alto * (conTag ? 0.46 : 0.52);
  const ratio = marca.logoRatio || 2;
  const h = Math.round(Math.min(topeAlto, Math.sqrt(area / ratio)));

  return (
    <div className="brand-slot" style={{ height: alto }}>
      {marca.logo ? (
        <img
          className="brand-slot__logo"
          src={marca.logo}
          alt={marca.nombre}
          loading="lazy"
          width={Math.round(h * ratio)}
          height={h}
          style={{ height: h }}
        />
      ) : (
        <span className="brand-slot__word">{marca.nombre}</span>
      )}
      {conTag && <span className="brand-slot__tag">{t('Servicio técnico oficial', 'Official technical service')}</span>}
    </div>
  );
}
