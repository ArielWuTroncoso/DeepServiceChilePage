/**
 * Company data — ENGLISH version.
 * Same structure and keys as `empresa.js`; contact details are shared.
 * Chilean terms used in the Spanish version: RLS = EPIRB, "carpeta GMDSS" =
 * GMDSS documentation file, "entidad técnica aprobada" = approved technical entity.
 */
import { CONTACTO as CONTACTO_ES } from './empresa.js';

export const CONTACTO = {
  ...CONTACTO_ES,
  ciudad: 'Talcahuano, Biobío Region',
  horario: 'Monday to Friday, 9:00 am to 6:00 pm',
};

export const LEMA =
  'Solutions and technical support for marine electronic equipment used in navigation and fishing.';

export const INTRO_SERVICIOS =
  'Our technical service team is qualified to carry out all types of electronic service, ' +
  'providing fast and efficient solutions to our customers’ needs.';

export const SERVICIOS = [
  {
    slug: 'mantenimiento-sonares',
    icono: 'Radar',
    titulo: 'Furuno sonar maintenance',
    resumen:
      'Maintenance, calibration and tuning of the Furuno sonar range, both in our workshop and on board the vessel.',
    puntos: [
      'CSH-5L MKII, CSH-8L and FSV-30',
      'CH-250, CH-270, CH-300 and CH-28',
      'Dome, transducer and cabling inspection',
      'Periodic maintenance contracts',
    ],
  },
  {
    slug: 'instalacion',
    icono: 'Wrench',
    titulo: 'Installation and commissioning',
    resumen:
      'Installation and commissioning of new equipment on small craft, fishing vessels and tugboats.',
    puntos: [
      'Small craft and fishing boats',
      'Fishing vessels and tugboats',
      'Commissioning of navigation, fishing and safety equipment',
      'Operator training for the crew',
    ],
  },
  {
    slug: 'mantenimiento-radares',
    icono: 'Antenna',
    titulo: 'Furuno radar antenna maintenance',
    resumen:
      'Maintenance of Furuno radar antennas and units, including adjustment of the rotation mechanism and waveguide inspection.',
    puntos: [
      'FAR-2127 and FAR-2137S',
      'Model 1835 and equivalent units',
      'Drive motor and bearing inspection',
      'Adjustment and performance check',
    ],
  },
  {
    slug: 'inspecciones-gmdss',
    icono: 'ClipboardCheck',
    titulo: 'Inspections and certification',
    resumen:
      'GMDSS, AIS, SART and EPIRB inspections, preparation of the GMDSS documentation file and maintenance contracts for regulatory compliance.',
    puntos: [
      'GMDSS, AIS, SART and EPIRB inspections',
      'GMDSS documentation file',
      'Maintenance contracts',
      'Backed by our approved technical entity status',
    ],
  },
  {
    slug: 'software-navegacion',
    icono: 'Map',
    titulo: 'Navigation software and fishing charts',
    resumen:
      'Installation, setup, commissioning and training for navigation software with electronic fishing charts.',
    puntos: [
      'Software installation and setup',
      'Loading of electronic fishing charts',
      'Commissioning with the on-board equipment',
      'Training for the skipper and crew',
    ],
  },
  {
    slug: 'zona-de-pesca',
    icono: 'Ship',
    titulo: 'Commissioning on the fishing grounds',
    resumen:
      'Commissioning of the Furuno sonar range directly on the fishing grounds, with the equipment working under real fishing conditions.',
    puntos: [
      'Sonar tuning on real fish schools',
      'Fine-tuning of gain, range and scan',
      'On-board support for the skipper during fishing',
      'Report of the final operating configuration',
    ],
  },
  {
    slug: 'deteccion-de-fallas',
    icono: 'ShieldCheck',
    titulo: 'Fault finding and repairs',
    resumen:
      'Diagnosis and repair of marine equipment, from locating the fault to putting the equipment back into service.',
    puntos: [
      'Sonars, radars and video echo sounders',
      'Satellite compasses and anemometers',
      'VHF and HF radios, BNWAS and AIS',
      'Navigation software',
    ],
  },
];

export const ENTIDAD_TECNICA = {
  titulo: 'Approved technical entity',
  intro:
    'We are a technical entity approved by the Chilean maritime administration, and we provide the following services:',
  puntos: [
    {
      titulo: 'Inspection and certification',
      desc: 'Navigation and safety equipment: radars, video echo sounders, AIS, EPIRB, SART and DSC radios, among others.',
    },
    {
      titulo: 'Installation and commissioning',
      desc: 'Navigation, fishing and safety equipment, installed and left fully operational on board.',
    },
    {
      titulo: 'Preventive maintenance',
      desc: 'Maintenance programs for navigation, fishing and safety equipment.',
    },
    {
      titulo: 'Repair',
      desc: 'Repair of navigation, fishing and safety equipment, in our workshop or on board.',
    },
  ],
};

export const CLIENTES = [
  { icono: 'Anchor', titulo: 'Artisanal fishing boats' },
  { icono: 'Ship', titulo: 'Industrial fishing vessels' },
  { icono: 'Container', titulo: 'Shipping agencies, cargo boats and tugboats' },
  { icono: 'Sailboat', titulo: 'Merchant ships' },
];

export const MERCADOS = [
  { slug: 'pesca-industrial', icono: 'Ship', titulo: 'Industrial fishing', desc: 'Sonars, echo sounders and detection systems for industrial fishing vessels.' },
  { slug: 'pesca-artesanal', icono: 'Anchor', titulo: 'Artisanal fishing', desc: 'Detection and navigation equipment sized for artisanal fishing boats.' },
  { slug: 'navieras', icono: 'Container', titulo: 'Shipping agencies', desc: 'Navigation, communications and regulatory compliance for managed fleets.' },
  { slug: 'remolcadores', icono: 'HardHat', titulo: 'Tugboats and cargo boats', desc: 'Service and harbor support vessels that cannot afford downtime.' },
  { slug: 'mercantes', icono: 'Sailboat', titulo: 'Merchant ships', desc: 'Inspection and certification of on-board navigation and safety equipment.' },
  { slug: 'acuicultura', icono: 'Waves', titulo: 'Aquaculture', desc: 'Monitoring of fish farms and support for their service vessels.' },
];

export const HITOS = [
  { valor: '2021', label: 'Deep Service Chile in operation' },
  { valor: 'Approved', label: 'Technical entity' },
  { valor: '7', label: 'Technical services' },
  { valor: '100%', label: 'In-house technical service' },
];

export const FAQ = [
  {
    p: 'What does it mean that you are an approved technical entity?',
    r: 'It means we are approved by the Chilean maritime administration to inspect and certify navigation and safety equipment —radars, video echo sounders, AIS, EPIRB, SART and DSC radios— as well as to install, commission, maintain and repair it. We issue the certification ourselves, with no intermediaries.',
  },
  {
    p: 'Do you carry out GMDSS inspections and prepare the documentation file?',
    r: 'Yes. We carry out GMDSS, AIS, SART and EPIRB inspections, prepare the vessel’s GMDSS documentation file and offer maintenance contracts to keep it up to date.',
  },
  {
    p: 'Can you commission the sonar on the fishing grounds?',
    r: 'Yes. It is one of our services: we go on board to tune the Furuno sonar range on real fish schools, fine-tuning gain, range and scan under fishing conditions, and we support the skipper throughout the process.',
  },
  {
    p: 'Do you install the equipment you sell?',
    r: 'Yes. Installation and commissioning of new equipment on small craft, fishing vessels and tugboats is part of the service, including operator training for the crew. We also work on equipment purchased elsewhere, subject to prior assessment.',
  },
  {
    p: 'What equipment do you repair?',
    r: 'Sonars, radars, video echo sounders, satellite compasses, anemometers, VHF and HF radios, BNWAS, AIS and navigation software. We start by locating the fault and finish by putting the equipment back into service.',
  },
  {
    p: 'How do I request a visit or a quote?',
    r: 'Through the contact form or by calling our sales representatives directly. The more details you give us about the vessel, the equipment and the port, the more accurate the proposal will be.',
  },
];
