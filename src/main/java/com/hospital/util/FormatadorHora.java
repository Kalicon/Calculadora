package com.hospital.util;

/**
 * Utilitário para formatação de valores de tempo decimais para o formato HH:mm.
 */
public class FormatadorHora {

    /**
     * Formata um valor de horas decimais (ex: 9.6) para o formato HH:mm (ex: 09:36).
     * Trata corretamente saldos de horas negativos (ex: -4.8 vira -04:48).
     *
     * @param horasDecimais O tempo em horas decimais.
     * @return String formatada no padrão HH:mm.
     */
    public static String formatar(double horasDecimais) {
        long totalMinutos = Math.round(horasDecimais * 60.0);
        long absMinutos = Math.abs(totalMinutos);
        long horas = absMinutos / 60;
        long minutos = absMinutos % 60;
        String sinal = totalMinutos < 0 ? "-" : "";
        return String.format("%s%02d:%02d", sinal, horas, minutes);
    }
}
