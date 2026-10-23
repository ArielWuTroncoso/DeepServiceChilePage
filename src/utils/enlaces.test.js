import { describe, expect, it } from 'vitest';
import { enlaceCorreo, enlaceTelefono } from './enlaces';

describe('enlaceCorreo', () => {
  it('arma el enlace de un correo normal, con asunto codificado', () => {
    expect(enlaceCorreo('cliente@mail.cl')).toBe('mailto:cliente@mail.cl');
    expect(enlaceCorreo('cliente@mail.cl', 'Respuesta a tu consulta')).toBe('mailto:cliente@mail.cl?subject=Respuesta%20a%20tu%20consulta');
  });
  it('rechaza correos que alterarían el borrador (?, &, =, espacios)', () => {
    expect(enlaceCorreo('x?cc=otro@evil.com')).toBeNull();
    expect(enlaceCorreo('x&bcc=a@b.cl')).toBeNull();
    expect(enlaceCorreo('a b@mail.cl')).toBeNull();
    expect(enlaceCorreo('')).toBeNull();
    expect(enlaceCorreo(null)).toBeNull();
  });
});

describe('enlaceTelefono', () => {
  it('deja solo dígitos y +', () => {
    expect(enlaceTelefono('+56 9 8765 4321')).toBe('tel:+56987654321');
    expect(enlaceTelefono('(41) 245-1234')).toBe('tel:412451234');
  });
  it('rechaza texto que no es un teléfono', () => {
    expect(enlaceTelefono('llámame')).toBeNull();
    expect(enlaceTelefono('123')).toBeNull();
    expect(enlaceTelefono(undefined)).toBeNull();
  });
});
