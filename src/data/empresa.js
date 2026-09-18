/** Datos de la empresa. Punto único de edición para contacto y textos fijos. */

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

export const SERVICIOS = [
  {
    slug: 'venta',
    icono: 'PackageCheck',
    titulo: 'Venta de equipos',
    resumen: 'Equipamiento electrónico marino de marcas representadas, con asesoría previa para elegir la configuración correcta según la embarcación y la operación.',
    puntos: [
      'Asesoría técnica antes de la compra',
      'Configuración según eslora, faena y presupuesto',
      'Equipos con garantía de fábrica',
      'Cotización formal en 24 a 48 horas hábiles',
    ],
  },
  {
    slug: 'instalacion',
    icono: 'Wrench',
    titulo: 'Instalación a bordo',
    resumen: 'Montaje, cableado, puesta en marcha y calibración del equipo en la embarcación, dejando el sistema operativo y con la tripulación capacitada.',
    puntos: [
      'Montaje de displays, transductores y antenas',
      'Integración con los sistemas existentes a bordo',
      'Puesta en marcha y calibración',
      'Capacitación básica de uso a la tripulación',
    ],
  },
  {
    slug: 'soporte',
    icono: 'ShieldCheck',
    titulo: 'Soporte técnico',
    resumen: 'Diagnóstico, reparación y mantención preventiva de equipos instalados, con repuestos y acompañamiento posventa.',
    puntos: [
      'Diagnóstico en taller y a bordo',
      'Reparación y cambio de componentes',
      'Mantención preventiva programada',
      'Actualización de software y firmware',
    ],
  },
];

export const MERCADOS = [
  { slug: 'pesca-industrial', icono: 'Ship', titulo: 'Pesca industrial', desc: 'Sonares, sondas y sistemas de detección para flotas de cerco y arrastre.' },
  { slug: 'pesca-artesanal', icono: 'Anchor', titulo: 'Pesca artesanal', desc: 'Equipos de detección y navegación dimensionados para embarcaciones menores.' },
  { slug: 'acuicultura', icono: 'Waves', titulo: 'Acuicultura', desc: 'Monitoreo de centros de cultivo y apoyo a las embarcaciones de servicio.' },
  { slug: 'transporte', icono: 'Container', titulo: 'Transporte marítimo', desc: 'Navegación, comunicaciones y cumplimiento normativo para naves mayores.' },
  { slug: 'nautica', icono: 'Sailboat', titulo: 'Náutica recreativa', desc: 'Electrónica para embarcaciones de recreo, pesca deportiva y yates.' },
  { slug: 'trabajo', icono: 'HardHat', titulo: 'Embarcaciones de trabajo', desc: 'Remolcadores, lanchas de servicio y naves de apoyo portuario.' },
];

export const HITOS = [
  { valor: '2021', label: 'Inicio de operaciones' },
  { valor: '4', label: 'Líneas de producto' },
  { valor: '3', label: 'Servicios integrales' },
  { valor: '100%', label: 'Soporte posventa propio' },
];

export const FAQ = [
  {
    p: '¿Instalan los equipos que venden?',
    r: 'Sí. La instalación a bordo es parte del servicio: montaje, cableado, puesta en marcha, calibración y capacitación básica a la tripulación. También instalamos equipos adquiridos por otra vía, previa evaluación.',
  },
  {
    p: '¿Atienden embarcaciones fuera de la región?',
    r: 'Coordinamos visitas a otras regiones según la magnitud del trabajo. Escríbenos indicando puerto y tipo de faena para evaluar la programación y los costos asociados.',
  },
  {
    p: '¿Cómo solicito una cotización?',
    r: 'Desde el formulario de contacto o llamando directamente a nuestros ejecutivos. Mientras más datos entregues sobre la embarcación y el uso previsto, más precisa será la propuesta.',
  },
  {
    p: '¿Los equipos tienen garantía?',
    r: 'Todos los equipos nuevos cuentan con la garantía del fabricante. Deep Service actúa como contraparte técnica local durante todo el período de garantía.',
  },
  {
    p: '¿Hacen mantención preventiva?',
    r: 'Sí, con programas periódicos que incluyen revisión de transductores, antenas, cableado y actualización de software, para anticipar fallas antes de que detengan la faena.',
  },
];
