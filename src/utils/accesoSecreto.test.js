import { beforeEach, describe, expect, it, vi } from 'vitest';
import { crearDetectorAcceso } from './accesoSecreto';

const tecla = (key, extra = {}) => ({ key, target: document.body, ...extra });

describe('entrada secreta ↑ ↓', () => {
  let alAcceder;
  let reloj;
  let detector;

  beforeEach(() => {
    alAcceder = vi.fn();
    reloj = 0;
    detector = crearDetectorAcceso(alAcceder, { ahora: () => reloj });
  });

  it('se activa con ↑ y luego ↓', () => {
    detector(tecla('ArrowUp'));
    detector(tecla('ArrowDown'));
    expect(alAcceder).toHaveBeenCalledTimes(1);
  });

  it('no se activa con ↓ y luego ↑, ni con una sola tecla', () => {
    detector(tecla('ArrowDown'));
    detector(tecla('ArrowUp'));
    expect(alAcceder).not.toHaveBeenCalled();
  });

  it('no se activa si se interpone otra tecla', () => {
    detector(tecla('ArrowUp'));
    detector(tecla('a'));
    detector(tecla('ArrowDown'));
    expect(alAcceder).not.toHaveBeenCalled();
  });

  it('no se activa si pasa demasiado tiempo entre las teclas', () => {
    detector(tecla('ArrowUp'));
    reloj = 5000;
    detector(tecla('ArrowDown'));
    expect(alAcceder).not.toHaveBeenCalled();
  });

  it('ignora la tecla mantenida y las combinaciones con modificadores', () => {
    detector(tecla('ArrowUp', { repeat: true }));
    detector(tecla('ArrowDown'));
    detector(tecla('ArrowUp', { shiftKey: true }));
    detector(tecla('ArrowDown'));
    expect(alAcceder).not.toHaveBeenCalled();
  });

  it('no se activa mientras se escribe en un campo', () => {
    const input = document.createElement('input');
    detector(tecla('ArrowUp', { target: input }));
    detector(tecla('ArrowDown', { target: input }));
    expect(alAcceder).not.toHaveBeenCalled();
  });

  it('puede activarse de nuevo después de usarse', () => {
    for (let i = 0; i < 2; i += 1) {
      detector(tecla('ArrowUp'));
      detector(tecla('ArrowDown'));
    }
    expect(alAcceder).toHaveBeenCalledTimes(2);
  });
});
