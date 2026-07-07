package com.hospital.main;

import com.hospital.generator.GeradorEscala;
import com.hospital.model.EscalaMensal;
import com.hospital.service.CalculadoraJornadaService;

import java.util.List;

/**
 * Classe principal para execução e teste do módulo de escala de plantão da
 * Maternidade Leonor Mendes de Barros (UGA IV) - Desenvolvido por Kalicon Amorim.
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("=========================================================================================");
        System.out.println("            HOSPITAL MATERNIDADE LEONOR MENDES DE BARROS - UGA IV - SES-SP");
        System.out.println("                SISTEMA DE GESTÃO DE ESCALAS (DESENVOLVIDO POR KALICON AMORIM)");
        System.out.println("=========================================================================================");

        CalculadoraJornadaService service = new CalculadoraJornadaService();
        int mesInicio = 7; // Julho
        int anoInicio = 2026;

        // ----------------------------------------------------
        // CENÁRIO A: Colaborador com Jornada Reduzida (ex: TEA)
        // ----------------------------------------------------
        double cargaSemanalOriginalA = 30.0;
        double duracaoPlantaoBaseA = 12.0;
        double percentualReducaoA = 20.0;

        System.out.println("\n>>> SIMULAÇÃO 1: COLABORADOR COM JORNADA REDUZIDA (20% - ex: TEA) <<<");
        double jornadaMensalAlvoA = service.calcularJornadaMensal(cargaSemanalOriginalA, percentualReducaoA);
        double duracaoPlantaoReduzidaA = service.calcularDuracaoPlantao(duracaoPlantaoBaseA, percentualReducaoA);

        System.out.println("--- Parâmetros do Colaborador ---");
        System.out.printf("Carga Semanal Original: %.1fh | Redução: %.1f%%\n", cargaSemanalOriginalA, percentualReducaoA);
        System.out.printf("Jornada Mensal Alvo: %.2fh | Duração Efetiva do Plantão: %.2fh\n", jornadaMensalAlvoA, duracaoPlantaoReduzidaA);
        System.out.println("---------------------------------");

        GeradorEscala geradorA = new GeradorEscala(service, cargaSemanalOriginalA, percentualReducaoA, duracaoPlantaoBaseA);
        List<EscalaMensal> escalaA = geradorA.gerarEscalaSemestral(mesInicio, anoInicio);
        geradorA.exibirCronogramaConsole(escalaA);

        // ----------------------------------------------------
        // CENÁRIO B: Colaborador com Jornada Padrão (Sem Redução)
        // ----------------------------------------------------
        double cargaSemanalOriginalB = 30.0;
        double duracaoPlantaoBaseB = 12.0;
        double percentualReducaoB = 0.0; // Sem redução

        System.out.println("\n>>> SIMULAÇÃO 2: COLABORADOR COM JORNADA PADRÃO (SEM REDUÇÃO) <<<");
        double jornadaMensalAlvoB = service.calcularJornadaMensal(cargaSemanalOriginalB, percentualReducaoB);
        double duracaoPlantaoReduzidaB = service.calcularDuracaoPlantao(duracaoPlantaoBaseB, percentualReducaoB);

        System.out.println("--- Parâmetros do Colaborador ---");
        System.out.printf("Carga Semanal Original: %.1fh | Redução: %.1f%%\n", cargaSemanalOriginalB, percentualReducaoB);
        System.out.printf("Jornada Mensal Alvo: %.2fh | Duração Efetiva do Plantão: %.2fh\n", jornadaMensalAlvoB, duracaoPlantaoReduzidaB);
        System.out.println("---------------------------------");

        GeradorEscala geradorB = new GeradorEscala(service, cargaSemanalOriginalB, percentualReducaoB, duracaoPlantaoBaseB);
        List<EscalaMensal> escalaB = geradorB.gerarEscalaSemestral(mesInicio, anoInicio);
        geradorB.exibirCronogramaConsole(escalaB);
    }
}
