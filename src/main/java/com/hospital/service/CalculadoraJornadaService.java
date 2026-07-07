package com.hospital.service;

/**
 * Serviço responsável pelos cálculos de carga horária mensal e duração efetiva de plantões
 * com base na redução de jornada de trabalho concedida.
 */
public class CalculadoraJornadaService {

    /**
     * Calcula a carga horária mensal alvo com base na carga semanal e na redução.
     * Considera a média legal de 4.3 semanas por mês.
     *
     * @param cargaSemanalOriginal Carga horária semanal sem a redução (ex: 30.0h).
     * @param percentualReducao Percentual de redução concedido (ex: 20.0 para 20%).
     * @return A carga mensal reduzida em horas decimais.
     */
    public double calcularJornadaMensal(double cargaSemanalOriginal, double percentualReducao) {
        double fatorReducao = 1.0 - (percentualReducao / 100.0);
        double cargaSemanalReduzida = cargaSemanalOriginal * fatorReducao;
        return cargaSemanalReduzida * 4.3;
    }

    /**
     * Calcula a duração efetiva do plantão considerando a redução.
     * Exemplo: Plantão base de 12h com 20% de redução passa a durar 9h e 36min (9.6h).
     *
     * @param duracaoBase Duração do plantão padrão em horas (ex: 12.0h).
     * @param percentualReducao Percentual de redução concedido (ex: 20.0 para 20%).
     * @return A duração efetiva do plantão reduzido em horas decimais.
     */
    public double calcularDuracaoPlantao(double duracaoBase, double percentualReducao) {
        double fatorReducao = 1.0 - (percentualReducao / 100.0);
        return duracaoBase * fatorReducao;
    }
}
