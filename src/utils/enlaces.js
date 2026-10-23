/**
 * Enlaces seguros para datos que escribe un visitante. Un correo puede traer "?" o "&" y
 * alterar el borrador de correo del administrador (por ejemplo agregar copias), y un teléfono
 * puede traer cualquier texto: solo se arma el enlace si el dato tiene la forma esperada.
 */

const CORREO_SIMPLE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/** mailto: solo para correos de forma común; si no, null (se muestra como texto). */
export function enlaceCorreo(correo, asunto = '') {
  if (typeof correo !== 'string' || correo.length > 180 || !CORREO_SIMPLE.test(correo)) return null;
  return `mailto:${correo}${asunto ? `?subject=${encodeURIComponent(asunto)}` : ''}`;
}

/** tel: con solo dígitos y "+"; si no hay al menos 7 dígitos, null. */
export function enlaceTelefono(telefono) {
  if (typeof telefono !== 'string') return null;
  const limpio = telefono.replace(/[^\d+]/g, '');
  return /^\+?\d{7,15}$/.test(limpio) ? `tel:${limpio}` : null;
}
