package com.hospital.generator;

import com.hospital.model.EscalaMensal;
import com.hospital.service.CalculadoraJornadaService;
import com.hospital.util.FormatadorHora;

import java.util.ArrayList;
import java.util.List;

/**
 * Classe responsável por gerar a escala semestral e compensar os saldos de horas acumulados
 * ao longo dos meses por meio da alternância entre piso e teto da quantidade de plantões.
 */
public class GeradorEscala {
    private final CalculadoraJornadaService service;
    private final double cargaSemanalOriginal;
    private final double percentualReducao;
    private final double duracaoBase;

    private static final String[] MESES = {
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    };

    /**
     * Construtor da escala.
     *
     * @param service Serviço de cálculo de jornada.
     * @param cargaSemanalOriginal Carga semanal antes da redução (ex: 30.0).
     * @param percentualReducao Percentual de redução (ex: 20.0).
     * @param duracaoBase Duração padrão do plantão (ex: 12.0).
     */
    public GeradorEscala(CalculadoraJornadaService service, double cargaSemanalOriginal, 
                         double percentualReducao, double duracaoBase) {
        this.service = service;
        this.cargaSemanalOriginal = cargaSemanalOriginal;
        this.percentualReducao = percentualReducao;
        this.duracaoBase = duracaoBase;
    }

    /**
     * Gera a escala semestral alternando a quantidade de plantões para equilibrar o banco de horas.
     *
     * @param mesInicio Mês de início da escala (1 a 12).
     * @param anoInicio Ano de início da escala.
     * @return Lista com os detalhes da escala para cada um dos 6 meses.
     */
    public List<EscalaMensal> gerarEscalaSemestral(int mesInicio, int anoInicio) {
        double targetMonthlyHours = service.calcularJornadaMensal(cargaSemanalOriginal, percentualReducao);
        double duracaoReduzida = service.calcularDuracaoPlantao(duracaoBase, percentualReducao);

        double idealShifts = targetMonthlyHours / duracaoReduzida;
        int floorShifts = (int) Math.floor(idealShifts);
        int ceilShifts = (int) Math.ceil(idealShifts);

        List<EscalaMensal> escala = new ArrayList<>();
        double saldoAcumulado = 0.0;

        int mesAtual = mesInicio;
        int anoAtual = anoInicio;

        for (int i = 0; i < 6; i++) {
            // Simula o saldo acumulado caso se opte pelo piso (floorShifts) ou pelo teto (ceilShifts)
            double saldoSeFloor = saldoAcumulado + ((floorShifts * duracaoReduzida) - targetMonthlyHours);
            double saldoSeCeil = saldoAcumulado + ((ceilShifts * duracaoReduzida) - targetMonthlyHours);

            int plantoesEscolhidos;
            double novoSaldoAcumulado;

            // Escolhe a opção que mantém o saldo acumulado mais próximo de zero
            if (Math.abs(saldoSeFloor) < Math.abs(saldoSeCeil)) {
                plantoesEscolhidos = floorShifts;
                novoSaldoAcumulado = saldoSeFloor;
            } else if (Math.abs(saldoSeCeil) < Math.abs(saldoSeFloor)) {
                plantoesEscolhidos = ceilShifts;
                novoSaldoAcumulado = saldoSeCeil;
            } else {
                // Se as distâncias forem idênticas, escolhe o teto (ceilShifts) para evitar déficit de horas trabalhado
                plantoesEscolhidos = ceilShifts;
                novoSaldoAcumulado = saldoSeCeil;
            }

            double workedHours = plantoesEscolhidos * duracaoReduzida;
            double saldoMes = workedHours - targetMonthlyHours;
            String mesNome = MESES[mesAtual - 1];

            escala.add(new EscalaMensal(
                mesNome, mesAtual, anoAtual, plantoesEscolhidos, 
                targetMonthlyHours, workedHours, saldoMes, novoSaldoAcumulado
            ));

            saldoAcumulado = novoSaldoAcumulado;

            // Incrementa o mês rotacionando o ano se necessário
            mesAtual++;
            if (mesAtual > 12) {
                mesAtual = 1;
                anoAtual++;
            }
        }

        return escala;
    }

    /**
     * Imprime no console o cronograma gerado de forma estruturada.
     *
     * @param escala Lista de escalas mensais a exibir.
     */
    public void exibirCronogramaConsole(List<EscalaMensal> escala) {
        System.out.println("\n=========================================================================================");
        System.out.println("                      CRONOGRAMA DE ESCALA SEMESTRAL DE PLANTÃO");
        System.out.println("=========================================================================================");
        System.out.printf("%-15s | %-12s | %-14s | %-14s | %-10s | %-15s\n", 
            "Mês/Ano", "Nº Plantões", "Jornada Alvo", "Horas Trab.", "Saldo Mês", "Saldo Acumulado");
        System.out.println("-----------------------------------------------------------------------------------------");

        for (EscalaMensal em : escala) {
            String mesAno = String.format("%s/%d", em.getMesNome(), em.getAno());
            System.out.printf("%-15s | %-12d | %-14s | %-14s | %-10s | %-15s\n",
                mesAno,
                em.getQuantPlantoes(),
                FormatadorHora.formatar(em.getCargaHorariaAlvo()),
                FormatadorHora.formatar(em.getCargaHorariaTrabalhada()),
                FormatadorHora.formatar(em.getSaldoMes()),
                FormatadorHora.formatar(em.getSaldoAcumulado())
            );
        }
        System.out.println("=========================================================================================");
        System.out.println("Observação: Os saldos são compensados automaticamente entre os meses do semestre.");
        System.out.println("=========================================================================================\n");
    }
}
