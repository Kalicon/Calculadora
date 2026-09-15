# Painel de Apoio a Escalas e Dimensionamento Hospitalar

Sistema desenvolvido para apoio operacional e planejamento de escalas e dimensionamento de equipes no Hospital Maternidade Leonor Mendes de Barros (UGA IV), unidade vinculada à Secretaria de Estado da Saúde de São Paulo (SES-SP). A aplicação resolve o problema de escalas com plantões fracionados decorrentes de médias de semanas no mês, automatiza o dimensionamento de enfermagem e orienta a conformidade de plantões extras na administração pública.

---

## Demonstração

- **Aplicação Online:** [kalicon.github.io/Calculadora](https://kalicon.github.io/Calculadora/)
- **Visualização da Interface:**

```text
[Demonstração da interface de simulação de escalas hospitalares e dimensionamento COFEN]
```

---

## O Problema Operacional e o Algoritmo de Compensação

### O Desafio dos Plantões Fracionados
Na gestão de escalas hospitalares de 30 horas semanais ou em regimes de jornada reduzida (como a redução legal de 20% para servidores responsáveis por pessoas com Transtorno do Espectro Autista - TEA), a divisão da carga horária mensal pela duração de cada plantão resulta em números não inteiros:

- **Jornada com Redução de 20%:** Meta mensal de 103h12min com plantões de 09h36min resulta na necessidade teórica de **10,75 plantões/mês**.
- **Jornada Padrão de 30h:** Meta mensal de 129h00min com plantões de 12h00min resulta na necessidade teórica de **10,75 plantões/mês**.

Como não é viável escalar frações de plantões no ambiente assistencial, a distribuição manual frequentemente gerava saldo residual excessivo de horas positivas ou negativas ao final de cada mês.

### A Solução Algorítmica
Foi implementado um algoritmo de alternância cíclica de plantões que equilibra meses de 11 plantões e meses de 10 plantões, compensando mês a mês o banco de horas acumulado até zerar a diferença no decorrer do ciclo semestral:

| Mês | Plantões Sugeridos (Redução 20%) | Saldo Mensal Acumulado | Plantões Sugeridos (Padrão 30h) | Saldo Mensal Acumulado |
| :--- | :---: | :---: | :---: | :---: |
| Mês 1 | 11 plantões | +02:24 | 11 plantões | +03:00 |
| Mês 2 | 10 plantões | -04:48 | 11 plantões | +06:00 |
| Mês 3 | 11 plantões | -02:24 | 10 plantões | -03:00 |
| Mês 4 | 11 plantões | **00:00 (Zerado)** | 11 plantões | **00:00 (Zerado)** |
| Mês 5 | 11 plantões | +02:24 | 11 plantões | +03:00 |
| Mês 6 | 10 plantões | -04:48 | 11 plantões | +06:00 |

---

## Módulos do Sistema

1. **Simulador de Alternância de Escalas:** Interface paramétrica que permite configurar carga horária semanal, duração do plantão e aplicação de jornadas especiais, gerando a projeção mensal de plantões e saldo acumulado de horas.
2. **Dimensionamento de Enfermagem (Resolução COFEN 743/2024):** Motor de cálculo que estima o quantitativo necessário de profissionais assistenciais com base no perfil de complexidade assistencial dos pacientes (cuidados mínimos, intermediários, alta dependência e intensivos).
3. **Orientador de Limites de Plantão (LC 1176/2012 - SES-SP):** Módulo informativo que guia médicos e cirurgiões-dentistas da rede estadual sobre os limites legais de plantões extras mensais conforme seus vínculos funcionais com o Estado.

---

## Tecnologias Utilizadas

- **Interface Web:** HTML5 Semântico, CSS3 Moderno e JavaScript Vanilla
- **Motor Lógico Auxiliar:** Java (execução em console e simulações analíticas)
- **Hospedagem e Deploy:** GitHub Pages

---

## Decisões de Arquitetura

### 1. Separação entre Interface Leve e Motor Algorítmico
A solução foi arquitetada em duas frentes complementares:
- Uma interface web estática e responsiva, que roda diretamente no navegador de celulares e computadores do corpo hospitalar sem necessidade de autenticação ou instalação de aplicativos.
- Um protótipo e motor lógico em Java, permitindo validação matemática isolada e execução de testes em lote via linha de comando.

### 2. Aderência Estrita a Parâmetros Regulatórios
Todos os coeficientes de dimensionamento assistencial e regras de limites de carga horária foram codificados em conformidade direta com atos normativos vigentes (Resolução COFEN 743/2024 e Lei Complementar Estadual 1176/2012).

---

## Como Executar o Protótipo Java Localmente

### Pré-requisitos
- Java Development Kit (JDK 17 ou superior).
- Apache Maven (opcional, para execução via wrapper).

### Execução via Maven

```bash
mvn clean compile exec:java
```

### Compilação e Execução Manual

```bash
mkdir -p target/classes
find src -name "*.java" | xargs javac -d target/classes
java -cp target/classes com.hospital.main.Main
```

---

## Licença

Desenvolvido para fins de apoio operacional e transparência de escalas no Hospital Maternidade Leonor Mendes de Barros (SES-SP).
