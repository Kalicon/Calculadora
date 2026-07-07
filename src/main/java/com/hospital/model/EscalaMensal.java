package com.hospital.model;

/**
 * Modelo que representa a escala calculada para um mês específico.
 */
public class EscalaMensal {
    private final String mesNome;
    private final int mesNumero;
    private final int ano;
    private final int quantPlantoes;
    private final double cargaHorariaAlvo;
    private final double cargaHorariaTrabalhada;
    private final double saldoMes;
    private final double saldoAcumulado;

    public EscalaMensal(String mesNome, int mesNumero, int ano, int quantPlantoes, 
                        double cargaHorariaAlvo, double cargaHorariaTrabalhada, 
                        double saldoMes, double saldoAcumulado) {
        this.mesNome = mesNome;
        this.mesNumero = mesNumero;
        this.ano = ano;
        this.quantPlantoes = quantPlantoes;
        this.cargaHorariaAlvo = cargaHorariaAlvo;
        this.cargaHorariaTrabalhada = cargaHorariaTrabalhada;
        this.saldoMes = saldoMes;
        this.saldoAcumulado = saldoAcumulado;
    }

    public String getMesNome() {
        return mesNome;
    }

    public int getMesNumero() {
        return mesNumero;
    }

    public int getAno() {
        return ano;
    }

    public int getQuantPlantoes() {
        return quantPlantoes;
    }

    public double getCargaHorariaAlvo() {
        return cargaHorariaAlvo;
    }

    public double getCargaHorariaTrabalhada() {
        return cargaHorariaTrabalhada;
    }

    public double getSaldoMes() {
        return saldoMes;
    }

    public double getSaldoAcumulado() {
        return saldoAcumulado;
    }
}
