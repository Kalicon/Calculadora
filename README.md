# Hospital Maternidade Leonor Mendes de Barros - UGA IV
## Sistema de Gestão de Escalas e Dimensionamento (SES-SP)
### Desenvolvido por Kalicon Amorim

Este repositório contém uma solução completa voltada para a gestão de escalas hospitalares e o dimensionamento de pessoal sob as normativas da Secretaria da Saúde do Estado de São Paulo (SES-SP) e Conselho Federal de Enfermagem (COFEN), personalizada para o **Hospital Maternidade Leonor Mendes de Barros (UGA IV)**.

A solução é composta por duas partes:
1. **Módulo Java**: Um serviço de backend estruturado para o cálculo de escalas com jornada reduzida e normal, com compensação de banco de horas entre meses.
2. **Painel Web Interativo (GitHub Pages)**: Uma interface frontend rica e moderna (HTML/CSS/JS) contendo calculadoras para escalas de jornada reduzida/padrão, dimensionamento de equipes de enfermagem (Resolução COFEN 743/2024) e validação de conformidade de plantões (LC 1176/2012).

---

## 📅 Lógica de Compensação de Horas (Escala Padrão e Reduzida)

### O Desafio dos Plantões Fracionados
Seja para colaboradores em jornada padrão ou com redução de jornada (ex: 20% de redução para responsáveis por pessoas com TEA), a duração do plantão e a meta mensal de horas resultam em frações de plantões devido à média mensal de 4.3 semanas.

**Exemplo 1: Colaborador com Jornada Reduzida (20%):**
*   **Carga Semanal Original**: 30 horas.
*   **Redução**: 20% (Carga Semanal Alvo: 24 horas).
*   **Plantão Base**: 12 horas.
*   **Jornada Mensal Alvo**: 24h × 4.3 semanas = **103,20 horas** (`103:12`).
*   **Duração Efetiva do Plantão**: 12h × 0.8 = **9,60 horas** (`09:36`).
*   **Plantões Ideais/Mês**: $103.2 / 9.6 =$ **10,75 plantões**.

**Exemplo 2: Colaborador com Jornada Padrão (Sem Redução):**
*   **Carga Semanal Original**: 30 horas.
*   **Redução**: 0% (Carga Semanal Alvo: 30 horas).
*   **Plantão Base**: 12 horas.
*   **Jornada Mensal Alvo**: 30h × 4.3 semanas = **129,00 horas** (`129:00`).
*   **Duração Efetiva do Plantão**: **12,00 horas** (`12:00`).
*   **Plantões Ideais/Mês**: $129 / 12 =$ **10,75 plantões**.

Como o resultado não é inteiro (10,75 plantões), escalar fixamente 10 ou 11 plantões acumularia um desvio no banco de horas.

### O Algoritmo de Compensação (Malha Fechada / Realimentação)
Para resolver esse problema de forma dinâmica e automatizada, o sistema implementa um algoritmo de controle em **malha fechada** (similar a um modulador Sigma-Delta). A cada mês, o sistema avalia o saldo acumulado ($Saldo_{acumulado}$) e simula as duas opções (piso de plantões ou teto) escolhendo a que deixa o banco de horas acumulado o mais próximo possível de zero.

#### Cronograma Semestral Simulado (Julho a Dezembro de 2026):
*   **Simulação 1 (Reduzida - 20%):**
    *   Julho: 11 plantões (Saldo Acumulado: `+02:24`)
    *   Agosto: 10 plantões (Saldo Acumulado: `-04:48`)
    *   Setembro: 11 plantões (Saldo Acumulado: `-02:24`)
    *   Outubro: 11 plantões (Saldo Acumulado: `00:00` - Banco Zerado)
    *   Novembro: 11 plantões (Saldo Acumulado: `+02:24`)
    *   Dezembro: 10 plantões (Saldo Acumulado: `-04:48` - Fim do semestre)
*   **Simulação 2 (Padrão - Sem Redução):**
    *   Julho: 11 plantões (Saldo Acumulado: `+03:00`)
    *   Agosto: 11 plantões (Saldo Acumulado: `+06:00`)
    *   Setembro: 10 plantões (Saldo Acumulado: `-03:00`)
    *   Outubro: 11 plantões (Saldo Acumulado: `00:00` - Banco Zerado)
    *   Novembro: 11 plantões (Saldo Acumulado: `+03:00`)
    *   Dezembro: 11 plantões (Saldo Acumulado: `+06:00` - Fim do semestre)

---

## 🏥 Calculadoras de Saúde Pública Integradas (Web)

O painel web fornece three calculadoras interativas específicas:
1.  **Cálculo de Escalas (Padrão e Reduzida)**: Permite ao setor escolher a carga semanal do funcionário, o plantão base e se ele possui redução de jornada (ex: 20% TEA), gerando o cronograma mensal alternado com autocompensação.
2.  **Dimensionamento de Enfermagem (COFEN 743/2024)**: Aplica o Parecer Normativo nº 1/2024/COFEN para calcular o total de profissionais mínimos necessários no leito, dividindo proporcionalmente entre enfermeiros e técnicos de acordo com as complexidades (Mínimo, Intermediário, Alta Dependência, Semi-intensivo, Intensivo).
3.  **Validador de Limites de Plantão SES-SP (LC 1176/2012)**: Verifica se o servidor de saúde (médicos e dentistas) está ultrapassando o limite legal de plantões extras mensais com base no seu número de vínculos e respectivas cargas horárias no Estado.

---

## 🛠️ Como Executar o Módulo Java

Caso possua o **Maven** instalado, basta executar a partir da raiz do projeto:
```bash
mvn clean compile exec:java
```

Caso não possua o Maven, compile e execute manualmente usando o próprio Java do sistema:
```bash
# Compilar
mkdir -p target/classes
find src -name "*.java" | xargs javac -d target/classes

# Executar
java -cp target/classes com.hospital.main.Main
```

---

## 🌐 Como Usar o Painel Web Diretamente no GitHub
1.  Habilite o **GitHub Pages** nas configurações do seu repositório apontando para a branch `main` e diretório raiz `/`.
2.  Acesse `https://<seu-usuario>.github.io/Calculadora/` para utilizar as calculadoras dinamicamente do seu navegador ou celular.
