import { describe, expect, it } from 'vitest';
import { claveValida, evaluarClave } from './clave';

describe('reglas de contraseña', () => {
  it('acepta una contraseña que cumple todo', () => {
    expect(claveValida('Marea#2026')).toBe(true);
    expect(claveValida('Ñandú.Sur9')).toBe(true);
  });

  it.each([
    ['muy corta', 'Ab1!xyz'],
    ['sin mayúscula', 'marea#2026'],
    ['sin minúscula', 'MAREA#2026'],
    ['sin número', 'Marea#Sonar'],
    ['sin símbolo', 'Marea2026x'],
    ['con espacios', 'Marea #2026'],
    ['demasiado larga', `Aa1!${'x'.repeat(70)}`],
    ['vacía', ''],
  ])('rechaza una contraseña %s', (_, clave) => {
    expect(claveValida(clave)).toBe(false);
  });

  it('informa qué regla falta', () => {
    const faltan = evaluarClave('marea2026').filter((r) => !r.cumple).map((r) => r.id);
    expect(faltan).toEqual(['mayuscula', 'simbolo']);
  });
});
