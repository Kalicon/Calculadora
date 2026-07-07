# Hospital Maternidade Leonor Mendes de Barros - UGA IV
## Painel de Apoio a Escalas e Dimensionamento Hospitalar
### Desenvolvido por Kalicon Amorim

Este repositório contém uma ferramenta prática de **apoio e auxílio para as equipes** do **Hospital Maternidade Leonor Mendes de Barros (UGA IV)**. O objetivo principal é facilitar o planejamento de escalas e oferecer estimativas rápidas para o dia a dia, servindo como guia informativo de apoio às chefias e colaboradores.

A solução é composta por duas partes:
1. **Módulo Java**: Protótipo de backend para simulação de escalas com jornada reduzida e normal, demonstrando o funcionamento de compensação de banco de horas entre meses.
2. **Painel Web Interativo (GitHub Pages)**: Uma interface simples e amigável (HTML/CSS/JS) com simuladores de escalas, estimativa de dimensionamento de pessoal e guia de orientação sobre limites de plantões adicionais.

---

## 📅 Simulação de Compensação de Horas (Auxílio para Planejamento)

### O Desafio dos Plantões Fracionados
Para auxiliar as equipes a programar escalas onde a jornada mensal de horas e a duração dos plantões resultam em números fracionados (devido à média de 4.3 semanas/mês), a ferramenta demonstra como alternar os plantões entre meses evita o acúmulo desproporcional de banco de horas.

**Exemplo de auxílio para escala com redução de jornada (ex: 20%):**
*   **Carga Semanal Original**: 30 horas.
*   **Redução**: 20% (Carga Semanal Alvo: 24 horas).
*   **Plantão Base**: 12 horas.
*   **Jornada Mensal Alvo**: 24h × 4.3 semanas = **103h12min**.
*   **Duração Efetiva do Plantão**: 12h × 0.8 = **9h36min**.
*   **Plantões Ideais/Mês**: **10,75 plantões**.

**Exemplo de auxílio para escala padrão (Sem Redução):**
*   **Carga Semanal Original**: 30 horas.
*   **Redução**: 0% (Carga Semanal Alvo: 30 horas).
*   **Plantão Base**: 12 horas.
*   **Jornada Mensal Alvo**: 30h × 4.3 semanas = **129h00min**.
*   **Duração Efetiva do Plantão**: **12h00min**.
*   **Plantões Ideais/Mês**: **10,75 plantões**.

Como não é possível realizar 10,75 plantões reais em um único mês, o algoritmo de auxílio sugere uma alternância simples (ex: 11 plantões em alguns meses e 10 em outros) para que ao final do semestre a diferença de horas acumulada seja mínima.

#### Proposta de Cronograma Semestral Sugerido (Julho a Dezembro de 2026):
*   **Cenário Reduzido (20%):**
    *   Julho: 11 plantões (Saldo: `+02:24`)
    *   Agosto: 10 plantões (Saldo: `-04:48`)
    *   Setembro: 11 plantões (Saldo: `-02:24`)
    *   Outubro: 11 plantões (Saldo: `00:00` - Compensado)
    *   Novembro: 11 plantões (Saldo: `+02:24`)
    *   Dezembro: 10 plantões (Saldo: `-04:48`)
*   **Cenário Padrão (Sem Redução):**
    *   Julho: 11 plantões (Saldo: `+03:00`)
    *   Agosto: 11 plantões (Saldo: `+06:00`)
    *   Setembro: 10 plantões (Saldo: `-03:00`)
    *   Outubro: 11 plantões (Saldo: `00:00` - Compensado)
    *   Novembro: 11 plantões (Saldo: `+03:00`)
    *   Dezembro: 11 plantões (Saldo: `+06:00`)

---

## 🏥 Simuladores de Apoio Integrados (Web)

O painel web foi estruturado como uma central de facilidades para consulta rápida:
1.  **Apoio na Elaboração de Escalas**: Ajuda o setor a simular escalas de colaboradores com ou sem jornada reduzida, sugerindo a alternância mensal recomendada para o banco de horas.
2.  **Referência de Dimensionamento (Enfermagem)**: Utiliza como base os parâmetros gerais das resoluções do COFEN para oferecer uma estimativa indicativa do quadro de pessoal por tipo de cuidado.
3.  **Orientador de Limites de Plantão (SES-SP)**: Guia informativo de apoio para auxiliar o servidor no acompanhamento e autogestão de seus plantões de forma a manter uma rotina saudável e em linha com as diretrizes da saúde estadual.

---

## 🛠️ Como Executar o Módulo Java (Simulador local)

Caso possua o **Maven** instalado, execute na raiz do projeto:
```bash
mvn clean compile exec:java
```

Ou execute manualmente compilando pelo próprio Java do sistema:
```bash
# Compilar
mkdir -p target/classes
find src -name "*.java" | xargs javac -d target/classes

# Executar
java -cp target/classes com.hospital.main.Main
```

---

## 🌐 Como Disponibilizar o Painel Web no GitHub
1.  Habilite o **GitHub Pages** nas configurações do repositório (`Settings` > `Pages`).
2.  Aponte a origem para a branch `main` e diretório raiz `/`.
3.  Utilize o link gerado para que a equipe possa realizar simulações e consultas diretamente do celular ou computador.
