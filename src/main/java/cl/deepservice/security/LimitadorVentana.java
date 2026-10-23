package cl.deepservice.security;

import java.util.ArrayDeque;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.LongSupplier;

/**
 * Contador de eventos por clave dentro de una ventana de tiempo deslizante, en memoria.
 *
 * Sirve para frenar la fuerza bruta (intentos de contraseña) y el spam del formulario.
 * Está acotado: guarda como máximo {@code maxClaves} claves y descarta las menos usadas,
 * de modo que un atacante no puede agotar la memoria inventando claves.
 *
 * No depende de Spring, así que se prueba por separado.
 */
public class LimitadorVentana {

    private final long ventanaMs;
    private final int maxClaves;
    private final LongSupplier reloj;
    /** Orden de acceso: lo último en usarse queda al final y lo más antiguo se descarta primero. */
    private final LinkedHashMap<String, ArrayDeque<Long>> eventos = new LinkedHashMap<>(64, 0.75f, true);

    public LimitadorVentana(long ventanaMs, int maxClaves) {
        this(ventanaMs, maxClaves, System::currentTimeMillis);
    }

    public LimitadorVentana(long ventanaMs, int maxClaves, LongSupplier reloj) {
        if (ventanaMs <= 0 || maxClaves <= 0) throw new IllegalArgumentException("Parámetros inválidos");
        this.ventanaMs = ventanaMs;
        this.maxClaves = maxClaves;
        this.reloj = reloj;
    }

    /** Cantidad de eventos de la clave dentro de la ventana. */
    public synchronized int contar(String clave) {
        ArrayDeque<Long> cola = eventos.get(clave);
        if (cola == null) return 0;
        purgar(cola);
        if (cola.isEmpty()) {
            eventos.remove(clave);
            return 0;
        }
        return cola.size();
    }

    /** Anota un evento ahora. */
    public synchronized void registrar(String clave) {
        ArrayDeque<Long> cola = eventos.get(clave);
        if (cola == null) {
            if (eventos.size() >= maxClaves) hacerEspacio();
            cola = new ArrayDeque<>();
            eventos.put(clave, cola);
        }
        purgar(cola);
        cola.addLast(reloj.getAsLong());
    }

    /** Segundos que faltan para que el evento más antiguo salga de la ventana (mínimo 1). */
    public synchronized long segundosParaLiberar(String clave) {
        ArrayDeque<Long> cola = eventos.get(clave);
        if (cola == null) return 1;
        purgar(cola);
        if (cola.isEmpty()) return 1;
        long faltan = cola.peekFirst() + ventanaMs - reloj.getAsLong();
        return Math.max(1, (faltan + 999) / 1000);
    }

    /** Borra el historial de una clave (por ejemplo, tras un ingreso correcto). */
    public synchronized void olvidar(String clave) {
        eventos.remove(clave);
    }

    public synchronized int claves() {
        return eventos.size();
    }

    private void purgar(ArrayDeque<Long> cola) {
        long limite = reloj.getAsLong() - ventanaMs;
        while (!cola.isEmpty() && cola.peekFirst() <= limite) cola.pollFirst();
    }

    /** Libera lugar: primero lo vencido y, si no alcanza, lo menos usado. */
    private void hacerEspacio() {
        Iterator<Map.Entry<String, ArrayDeque<Long>>> it = eventos.entrySet().iterator();
        while (it.hasNext()) {
            ArrayDeque<Long> cola = it.next().getValue();
            purgar(cola);
            if (cola.isEmpty()) it.remove();
        }
        if (eventos.size() >= maxClaves) {
            Iterator<String> masAntiguas = eventos.keySet().iterator();
            if (masAntiguas.hasNext()) {
                masAntiguas.next();
                masAntiguas.remove();
            }
        }
    }
}
