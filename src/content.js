// Todo el texto editable de la web vive aquí. Los [corchetes] son datos pendientes.

// TODO: poner el número real de WhatsApp (formato internacional, sin + ni espacios).
export const WHATSAPP_NUMBER = '34000000000'
export const WHATSAPP_MESSAGE =
  'Hola, quiero mi demo gratuita. Mi centro se llama: … y mi web o Instagram es: …'
export const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

export const NAV = [
  { href: '#como', label: 'Cómo trabajamos' },
  { href: '#ayuda', label: 'Cómo te ayudamos' },
  { href: '#casos', label: 'Casos' },
  { href: '#faq', label: 'FAQ' },
]

export const HERO = {
  pill: 'Soluciones para centros',
  title: ['Que tu centro no pierda clientes por ', 'no llegar a todo.'],
  sub: ['Libérate de la carga manual repetitiva.', 'Diseño y tecnología enfocada a tus necesidades.'],
  cta: 'Pide tu demo gratuita',
  checks: ['Sin compromiso', 'Sin formularios', 'Respuesta por WhatsApp'],
}

// La parte que rota en el titular "Nadie …"
export const DOLOR_PHRASES = ['te encuentra.', 'contesta a tiempo.', 'quiere hacerlo.']

export const DOLORES = [
  {
    n: '01',
    tint: 'peach',
    icon: 'search',
    title: 'Nadie te encuentra.',
    text: 'Sin una web profesional, tu centro no existe para quien busca en Google.',
    vignette: 'search',
  },
  {
    n: '02',
    tint: 'rose',
    icon: 'clock',
    title: 'Nadie contesta a tiempo.',
    text: 'Un mensaje sin respuesta en minutos es un cliente que ya está en otro sitio.',
    vignette: 'chat',
  },
  {
    n: '03',
    tint: 'lavender',
    icon: 'repeat',
    title: 'Nadie quiere hacerlo.',
    text: 'Confirmar, recordar y hacer seguimiento son tareas repetitivas que nadie quiere hacer, y por eso no se hacen.',
    vignette: 'tasks',
  },
]

export const PASOS = [
  { n: '01', title: 'Conexión y análisis', text: 'Conocemos tu centro y analizamos cómo te llegan y cómo se te pierden los clientes.' },
  { n: '02', title: 'Identificación y diseño', text: 'Identificamos tu mayor pérdida y diseñamos la solución.' },
  { n: '03', title: 'Implementación', text: 'Montamos la pieza y la conectamos a lo que ya usas.' },
  { n: '04', title: 'Medición', text: 'Medimos resultados y ajustamos.' },
]

export const MONTAMOS = [
  {
    tint: 'peach',
    resuelve: 'Resuelve: nadie te encuentra',
    title: 'Para que te encuentren',
    items: [
      { icon: 'browser', name: 'Landing o web', text: 'Tu centro, presentado con profesionalidad.' },
      { icon: 'pin', name: 'Mejora de presencia digital', text: 'Google Maps, revisión SEO y otros.' },
    ],
  },
  {
    tint: 'rose',
    resuelve: 'Resuelve: nadie contesta a tiempo',
    title: 'Para que te contesten',
    items: [
      { icon: 'chat', name: 'Agente de texto', text: 'Responde a tus clientes por WhatsApp y web.' },
      { icon: 'phone', name: 'Agente de voz', text: 'Atiende las llamadas cuando tú no puedes.' },
    ],
  },
  {
    tint: 'lavender',
    resuelve: 'Resuelve: nadie quiere hacerlo',
    title: 'Para que no se escape nada',
    items: [
      { icon: 'users', name: 'CRM y gestión de usuarios', text: 'Todos tus clientes y su historial en un solo sitio.' },
      { icon: 'trend', name: 'Agente de ventas', text: 'Califica a los interesados y los lleva hasta la reserva.' },
      { icon: 'repeat', name: 'Seguimiento automático', text: 'Recuerda y reactiva a cada cliente por ti.' },
    ],
  },
]

// Casos: 5 huecos con datos pendientes (logo, nombre y frase).
export const CASOS = [
  { sector: '[Sector]', nombre: '[Nombre del centro 1]', frase: '[Qué hicimos por ellos, en una frase]', servicios: ['[Servicio]', '[Servicio]'], bg: 'linear-gradient(135deg, #ffd9c4 0%, #ff9a6b 45%, #e84393 100%)' },
  { sector: '[Sector]', nombre: '[Nombre del centro 2]', frase: '[Qué hicimos por ellos, en una frase]', servicios: ['[Servicio]', '[Servicio]'], bg: 'linear-gradient(135deg, #e4ddfb 0%, #a79bf0 50%, #6c5ce7 100%)' },
  { sector: '[Sector]', nombre: '[Nombre del centro 3]', frase: '[Qué hicimos por ellos, en una frase]', servicios: ['[Servicio]', '[Servicio]'], bg: 'linear-gradient(135deg, #ffe2d3 0%, #f6a8c9 55%, #b9a7f5 100%)' },
  { sector: '[Sector]', nombre: '[Nombre del centro 4]', frase: '[Qué hicimos por ellos, en una frase]', servicios: ['[Servicio]', '[Servicio]'], bg: 'linear-gradient(135deg, #ffd6e8 0%, #e84393 55%, #6c5ce7 100%)' },
  { sector: '[Sector]', nombre: '[Nombre del centro 5]', frase: '[Qué hicimos por ellos, en una frase]', servicios: ['[Servicio]', '[Servicio]'], bg: 'linear-gradient(135deg, #fff0e6 0%, #ffb18a 50%, #ff6b35 100%)' },
]

export const DEMO = {
  title: ['Te enseñamos tu problema ', 'resuelto', ' antes de que decidas nada.'],
  text: 'Identificamos tu mayor pérdida y te mostramos cómo quedaría: tu nueva web o un agente respondiendo con la información de tu centro. Sin compromiso.',
  cta: 'Pedir mi demo por WhatsApp',
  steps: ['Nos escribes por WhatsApp', 'Preparamos tu demo en menos de 24h*', 'Te la enseñamos'],
}

// Respuestas copiadas del prompt de Indalo: revisar antes de publicar (plazos y promesas).
export const FAQS = [
  { q: '¿Cuánto tarda en estar listo?', a: '7 días máximo. No es complicado. Nuestro equipo lo configura contigo.' },
  { q: '¿Funciona con lo que ya uso?', a: 'Sí. Integramos con la mayoría. Si no es compatible, te ayudamos a migrar sin perder datos.' },
  { q: '¿Sonará a robot?', a: 'No. Usamos IA conversacional que suena 100% natural. La gente no nota la diferencia.' },
  { q: '¿Qué pasa con los datos de mis clientes? (RGPD)', a: '[Respuesta pendiente]' },
  { q: '¿Necesito conocimientos técnicos?', a: 'No. Es plug and play. Nosotros mantenemos todo. Tú solo disfruta los resultados.' },
  { q: '¿Cuánto cuesta?', a: 'Depende de tu escala. Desde [XXX] €/mes para centros pequeños hasta soluciones enterprise. Hablamos sin compromiso.' },
]

export const CTA = {
  title: ['Cuéntanos qué te quita tiempo. ', 'Te enseñamos cómo se resuelve.'],
  button: 'Pedir demo gratuita',
  note: 'Te respondemos por WhatsApp.',
}

export const FOOTER = {
  contact: '[Teléfono] · [Email]',
  legal: ['Aviso legal', 'Privacidad', 'Cookies'],
}
