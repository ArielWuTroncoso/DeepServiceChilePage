/**
 * Datos de la empresa. Punto único de edición para contacto y textos fijos.
 *
 * Los servicios, la condición de Entidad Técnica y el perfil de clientes están
 * tomados del sitio vigente de Deep Service Chile (deepservicechile.cl/servicio.php)
 * y reescritos para el nuevo maquetado, sin añadir prestaciones que la empresa
 * no declare allí.
 */

export const CONTACTO = {
  fijo: { tel: '+56412995468', label: '+56 41 299 5468' },
  ejecutivos: [
    { nombre: 'Mario Martínez', tel: '+56998475020', label: '+56 9 9847 5020' },
    { nombre: 'Cristian Villanueva', tel: '+56998443485', label: '+56 9 9844 3485' },
  ],
  // TODO: confirmar el correo corporativo definitivo.
  correo: 'contacto@deepservicechile.cl',
  ciudad: 'Región del Biobío, Chile',
  direccion: 'Por confirmar',
  horario: 'Lunes a viernes, 9:00 a 18:00 h',
  instagram: { usuario: '@deep_service_chile', url: 'https://www.instagram.com/deep_service_chile/' },
};

/** Frase institucional del sitio vigente. */
export const LEMA =
  'Soluciones y respaldo técnico en equipos electrónicos marinos asociados a la navegación y la pesca.';

export const INTRO_SERVICIOS =
  'Nuestro servicio técnico está capacitado para realizar todo tipo de servicio electrónico, ' +
  'dando soluciones rápidas y eficientes a las necesidades de nuestros clientes.';

/**
 * Los siete servicios declarados en el sitio vigente.
 * `icono` referencia un nombre de lucide-react resuelto en cada página.
 */
export const SERVICIOS = [
  {
    slug: 'mantenimiento-sonares',
    icono: 'Radar',
    titulo: 'Mantenimiento de sonares Furuno',
    resumen:
      'Mantención, calibración y puesta a punto de la gama de sonares Furuno, tanto en taller como a bordo de la embarcación.',
    puntos: [
      'CSH-5L MKII, CSH-8L y FSV-30',
      'CH-250, CH-270, CH-300 y CH-28',
      'Revisión de domo, transductor y cableado',
      'Contratos de mantención periódica',
    ],
  },
  {
    slug: 'instalacion',
    icono: 'Wrench',
    titulo: 'Instalación y puesta en marcha',
    resumen:
      'Instalación y puesta en marcha de equipamiento nuevo en embarcaciones menores, barcos pesqueros y remolcadores.',
    puntos: [
      'Embarcaciones menores y lanchas pesqueras',
      'Barcos pesqueros y remolcadores',
      'Comisionamiento de equipos de navegación, pesca y seguridad',
      'Instrucción de uso a la tripulación',
    ],
  },
  {
    slug: 'mantenimiento-radares',
    icono: 'Antenna',
    titulo: 'Mantenimiento de antenas de radar Furuno',
    resumen:
      'Mantención de antenas y unidades de radar Furuno, incluido el ajuste de los mecanismos de giro y la revisión de la guía de onda.',
    puntos: [
      'FAR-2127 y FAR-2137S',
      'Model 1835 y equipos de gama equivalente',
      'Revisión de motor de giro y rodamientos',
      'Ajuste y verificación de funcionamiento',
    ],
  },
  {
    slug: 'inspecciones-gmdss',
    icono: 'ClipboardCheck',
    titulo: 'Inspecciones y certificaciones',
    resumen:
      'Inspecciones GMDSS, AIS, SART y RLS, creación de la carpeta GMDSS y contratos de mantenimiento para el cumplimiento normativo de la nave.',
    puntos: [
      'Inspecciones GMDSS, AIS, SART y RLS',
      'Creación de carpeta GMDSS',
      'Contratos de mantenimiento',
      'Respaldo como entidad técnica aprobada',
    ],
  },
  {
    slug: 'software-navegacion',
    icono: 'Map',
    titulo: 'Software de navegación y cartas de pesca',
    resumen:
      'Instalación, configuración, puesta en marcha e instrucción de software de navegación con cartas electrónicas de pesca.',
    puntos: [
      'Instalación y configuración del software',
      'Carga de cartas electrónicas de pesca',
      'Puesta en marcha con el equipamiento a bordo',
      'Instrucción de uso al patrón y la tripulación',
    ],
  },
  {
    slug: 'zona-de-pesca',
    icono: 'Ship',
    titulo: 'Puesta en marcha en zona de pesca',
    resumen:
      'Puesta en marcha de la gama de sonares Furuno directamente en zona de pesca, con el equipo trabajando en condiciones reales de faena.',
    puntos: [
      'Ajuste del sonar sobre cardumen real',
      'Afinamiento de ganancia, alcance y barrido',
      'Acompañamiento al patrón durante la faena',
      'Informe de la configuración dejada operativa',
    ],
  },
  {
    slug: 'deteccion-de-fallas',
    icono: 'ShieldCheck',
    titulo: 'Detección de fallas y reparaciones',
    resumen:
      'Diagnóstico y reparación de equipos marinos, desde la detección de la falla hasta la reposición del equipo en servicio.',
    puntos: [
      'Sonares, radares y videosondas',
      'Compás satelital y anemómetros',
      'Radios VHF, radio HF, BNWAS y AIS',
      'Software de navegación',
    ],
  },
];

/**
 * Condición de Entidad Técnica aprobada por la administración chilena
 * y los cuatro servicios que habilita.
 */
export const ENTIDAD_TECNICA = {
  titulo: 'Entidad técnica aprobada',
  intro:
    'Somos entidad técnica aprobada por la administración chilena y realizamos los siguientes servicios:',
  puntos: [
    {
      titulo: 'Inspección y certificación',
      desc: 'Equipos de navegación y de seguridad: radares, videosonda, AIS, RLS, SART y radios DSC, entre otros.',
    },
    {
      titulo: 'Instalación y comisionamiento',
      desc: 'Equipos de navegación, pesca y seguridad, instalados y dejados operativos a bordo.',
    },
    {
      titulo: 'Mantenciones preventivas',
      desc: 'Programas de mantención sobre equipos de navegación, pesca y seguridad.',
    },
    {
      titulo: 'Reparación',
      desc: 'Reparación de equipos de navegación, pesca y seguridad, en taller o en la propia nave.',
    },
  ],
};

/** Perfil de clientes declarado en el sitio vigente. */
export const CLIENTES = [
  { icono: 'Anchor', titulo: 'Lanchas pesqueras artesanales' },
  { icono: 'Ship', titulo: 'Barcos de pesca industrial' },
  { icono: 'Container', titulo: 'Agencias navieras, embarcaciones fleteras y remolcadores' },
  { icono: 'Sailboat', titulo: 'Barcos mercantes' },
];

export const MERCADOS = [
  { slug: 'pesca-industrial', icono: 'Ship', titulo: 'Pesca industrial', desc: 'Sonares, sondas y sistemas de detección para barcos de pesca industrial.' },
  { slug: 'pesca-artesanal', icono: 'Anchor', titulo: 'Pesca artesanal', desc: 'Equipos de detección y navegación dimensionados para lanchas pesqueras artesanales.' },
  { slug: 'navieras', icono: 'Container', titulo: 'Agencias navieras', desc: 'Navegación, comunicaciones y cumplimiento normativo para la flota administrada.' },
  { slug: 'remolcadores', icono: 'HardHat', titulo: 'Remolcadores y fleteras', desc: 'Embarcaciones de servicio y apoyo portuario que no pueden detener su operación.' },
  { slug: 'mercantes', icono: 'Sailboat', titulo: 'Barcos mercantes', desc: 'Inspección y certificación de equipos de navegación y seguridad a bordo.' },
  { slug: 'acuicultura', icono: 'Waves', titulo: 'Acuicultura', desc: 'Monitoreo de centros de cultivo y apoyo a las embarcaciones de servicio.' },
];

export const HITOS = [
  { valor: '2021', label: 'Deep Service Chile en operaciones' },
  { valor: 'ETA', label: 'Entidad técnica aprobada' },
  { valor: '7', label: 'Servicios técnicos' },
  { valor: '100%', label: 'Servicio técnico propio' },
];

export const FAQ = [
  {
    p: '¿Qué significa que sean entidad técnica aprobada?',
    r: 'Que estamos aprobados por la administración chilena para inspeccionar y certificar equipos de navegación y de seguridad —radares, videosonda, AIS, RLS, SART, radios DSC—, además de instalarlos, comisionarlos, mantenerlos y repararlos. La certificación la emitimos nosotros mismos, sin intermediarios.',
  },
  {
    p: '¿Hacen inspecciones GMDSS y la carpeta correspondiente?',
    r: 'Sí. Realizamos inspecciones GMDSS, AIS, SART y RLS, creamos la carpeta GMDSS de la nave y ofrecemos contratos de mantenimiento para mantenerla al día.',
  },
  {
    p: '¿Pueden poner en marcha el sonar en zona de pesca?',
    r: 'Sí. Es uno de nuestros servicios: embarcamos para dejar la gama de sonares Furuno ajustada sobre cardumen real, afinando ganancia, alcance y barrido en condiciones de faena, y acompañamos al patrón durante el proceso.',
  },
  {
    p: '¿Instalan los equipos que venden?',
    r: 'Sí. La instalación y puesta en marcha de equipamiento nuevo en embarcaciones menores, barcos pesqueros y remolcadores es parte del servicio, con instrucción de uso a la tripulación. También intervenimos equipos adquiridos por otra vía, previa evaluación.',
  },
  {
    p: '¿Qué equipos reparan?',
    r: 'Sonares, radares, videosondas, compás satelital, anemómetros, radios VHF y HF, BNWAS, AIS y software de navegación. Partimos por la detección de la falla y llegamos hasta dejar el equipo nuevamente en servicio.',
  },
  {
    p: '¿Cómo solicito una visita o una cotización?',
    r: 'Desde el formulario de contacto o llamando directamente a nuestros ejecutivos. Mientras más datos entregues sobre la embarcación, el equipo y el puerto, más precisa será la propuesta.',
  },
];
