/**
 * Reglas de contraseña para administradores. Deben coincidir con
 * Dtos.REGEX_CONTRASENA en el backend (que es quien las hace cumplir).
 */
export const CLAVE_MIN = 8;
export const CLAVE_MAX = 72;

const REGLAS = [
  { id: 'largo', es: `Entre ${CLAVE_MIN} y ${CLAVE_MAX} caracteres`, en: `${CLAVE_MIN} to ${CLAVE_MAX} characters`,
    ok: (c) => c.length >= CLAVE_MIN && c.length <= CLAVE_MAX },
  { id: 'minuscula', es: 'Una letra minúscula', en: 'A lowercase letter', ok: (c) => /\p{Ll}/u.test(c) },
  { id: 'mayuscula', es: 'Una letra mayúscula', en: 'An uppercase letter', ok: (c) => /\p{Lu}/u.test(c) },
  { id: 'numero', es: 'Un número', en: 'A number', ok: (c) => /\d/.test(c) },
  { id: 'simbolo', es: 'Un símbolo (! ? # $ %)', en: 'A symbol (! ? # $ %)',
    ok: (c) => /[^\p{L}\d\s]/u.test(c) },
  { id: 'espacios', es: 'Sin espacios', en: 'No spaces', ok: (c) => c.length > 0 && !/\s/.test(c) },
];

/** Devuelve cada regla con su estado actual para esa contraseña. */
export function evaluarClave(clave = '') {
  return REGLAS.map(({ id, es, en, ok }) => ({ id, es, en, cumple: ok(clave) }));
}

export function claveValida(clave = '') {
  return evaluarClave(clave).every((r) => r.cumple);
}
