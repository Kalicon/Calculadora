# 🏥 Painel de Apoio a Escalas e Dimensionamento Hospitalar
### Hospital Maternidade Leonor Mendes de Barros - UGA IV
**Desenvolvido por Kalicon Amorim**

---

### 🌐 Acesse a Calculadora Online:
👉 **[https://kalicon.github.io/Calculadora/](https://kalicon.github.io/Calculadora/)**  
*(Qualquer pessoa pode acessar e usar este link diretamente no celular ou computador, sem necessidade de conta ou login!)*

---

## 👋 Sobre o Projeto

Olá! Criei este projeto com o objetivo de oferecer uma **ferramenta prática de apoio e auxílio para as equipes** do **Hospital Maternidade Leonor Mendes de Barros (UGA IV)**. 

No dia a dia do nosso hospital, sei o quanto o gerenciamento de escalas e a conferência de regras de pessoal podem ser trabalhosos. Por isso, desenvolvi esta central de simulação simples e interativa para servir de suporte rápido para chefias, escalas e colaboradores.

Esta solução está dividida em duas frentes:
1.  **Painel Web Interativo (GitHub Pages)**: Uma página rápida, com design moderno e responsivo, ideal para simulações rápidas direto do celular ou computador.
2.  **Módulo Auxiliar em Java**: Um motor lógico completo para simulação local via console, demonstrando o algoritmo de compensação de jornada reduzida e padrão ao longo do semestre.

---

## 📅 Como Funciona a Sugestão de Escala (Compensação de Horas)

### O Desafio dos Plantões Fracionados
Quando tentamos distribuir a carga horária de colaboradores que possuem jornada reduzida (como a redução de 20% para responsáveis por pessoas com TEA) ou mesmo em jornadas padrão de 30h semanais, nos deparamos com frações de plantões devido à média mensal de 4.3 semanas.

*   **Exemplo com Redução (20%):** A jornada mensal alvo é **103h12min** e cada plantão dura **09h36min**. Dividindo um pelo outro, o ideal seria fazer **10,75 plantões** por mês.
*   **Exemplo Sem Redução (Padrão):** A jornada mensal alvo é **129h00min** e o plantão dura **12h00min**. O ideal também seria **10,75 plantões** por mês.

Como não é possível realizar 10,75 plantões reais em um mês, o algoritmo que implementei ajuda a alternar de forma automática a quantidade de plantões (ex: 11 plantões em alguns meses e 10 em outros), compensando o banco de horas acumulado mês a mês para que a escala feche o semestre quase zerada.

#### Exemplo do Cronograma de Alternância Sugerido (Julho a Dezembro de 2026):
*   **Cenário com Redução (20%):**
    *   Julho: 11 plantões (Saldo: `+02:24`)
    *   Agosto: 10 plantões (Saldo: `-04:48`)
    *   Setembro: 11 plantões (Saldo: `-02:24`)
    *   Outubro: 11 plantões (Saldo: `00:00` - **Banco Zerado!**)
    *   Novembro: 11 plantões (Saldo: `+02:24`)
    *   Dezembro: 10 plantões (Saldo: `-04:48` - Fim do ciclo)
*   **Cenário Padrão (Sem Redução):**
    *   Julho: 11 plantões (Saldo: `+03:00`)
    *   Agosto: 11 plantões (Saldo: `+06:00`)
    *   Setembro: 10 plantões (Saldo: `-03:00`)
    *   Outubro: 11 plantões (Saldo: `00:00` - **Banco Zerado!**)
    *   Novembro: 11 plantões (Saldo: `+03:00`)
    *   Dezembro: 11 plantões (Saldo: `+06:00` - Fim do ciclo)

---

## 🏥 As 3 Calculadoras do Painel Web

Estruturei o painel em três abas simples de usar:
1.  **Simulador de Escalas (Padrão e Reduzida)**: Permite escolher a carga semanal do funcionário, a duração base do plantão e se há redução aplicada, gerando na hora a sugestão de plantões para os próximos 6 meses.
2.  **Estimativa de Dimensionamento (Enfermagem)**: Baseado nos parâmetros gerais recomendados pelo COFEN (Resolução 743/2024), calcula a quantidade estimada de profissionais necessários para a assistência no leito com base no perfil de complexidade dos pacientes.
3.  **Orientador de Limites de Plantão (LC 1176/2012 - SES-SP)**: Um guia informativo para ajudar médicos e cirurgiões-dentistas da rede estadual a planejarem seus plantões extras mensais de acordo com seus vínculos vigentes no Estado, facilitando a autogestão.

---

## 🛠️ Como Compilar e Executar o Protótipo Java localmente

Se você deseja rodar a simulação via terminal, o projeto possui suporte ao Maven.

### Pelo Maven:
```bash
mvn clean compile exec:java
```

### Manualmente pelo Java do Sistema:
```bash
# Compilar os fontes
mkdir -p target/classes
find src -name "*.java" | xargs javac -d target/classes

# Executar a simulação
java -cp target/classes com.hospital.main.Main
```

Espero que esta ferramenta seja um excelente auxílio para organizar e planejar as escalas de forma justa e transparente para todos no Hospital Leonor Mendes de Barros! Qualquer dúvida ou sugestão de melhoria, sinta-se à vontade para entrar em contato.
