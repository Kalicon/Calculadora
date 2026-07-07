document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // CONSTANTES E DICIONÁRIOS
    // ----------------------------------------------------
    const MESES = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // ----------------------------------------------------
    // INICIALIZAÇÃO E NAVEGAÇÃO DE ABAS
    // ----------------------------------------------------
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Alternar estado ativo nos botões
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Alternar visibilidade do conteúdo
            tabContents.forEach(content => {
                if (content.id === targetTab) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

    // ----------------------------------------------------
    // UTILITÁRIOS DE FORMATAÇÃO
    // ----------------------------------------------------
    function formatToHHMM(hoursDecimal) {
        const totalMinutes = Math.round(hoursDecimal * 60.0);
        const absMinutes = Math.abs(totalMinutes);
        const hours = Math.floor(absMinutes / 60);
        const minutes = absMinutes % 60;
        const sign = totalMinutes < 0 ? "-" : "";
        return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    // ----------------------------------------------------
    // PERSISTÊNCIA DOS CAMPOS (LOCALSTORAGE)
    // ----------------------------------------------------
    const fieldsToPersist = [
        'semanal-original', 'plantao-base', 'percentual-reducao', 
        'mes-inicio', 'ano-inicio',
        'cuidado-minimo', 'cuidado-intermediario', 'cuidado-alta-dep', 
        'cuidado-semi-intensivo', 'cuidado-intensivo', 'cofen-jornada', 'cofen-ist',
        'jornada-vinculo-1', 'jornada-vinculo-2', 'plantoes-desejados'
    ];

    function saveInputsToLocalStorage() {
        fieldsToPersist.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (el.type === 'checkbox') {
                    localStorage.setItem(`calc_${id}`, el.checked ? 'true' : 'false');
                } else {
                    localStorage.setItem(`calc_${id}`, el.value);
                }
            }
        });
        
        // Salvar os rádios de vínculos SES-SP
        const activeRadio = document.querySelector('input[name="quant-vinculos"]:checked');
        if (activeRadio) {
            localStorage.setItem('calc_quant-vinculos', activeRadio.value);
        }
        
        // Salvar jornada padrão checkbox separado
        const padraoCheck = document.getElementById('jornada-padrao-check');
        if (padraoCheck) {
            localStorage.setItem('calc_jornada-padrao-check', padraoCheck.checked ? 'true' : 'false');
        }
    }

    function loadInputsFromLocalStorage() {
        fieldsToPersist.forEach(id => {
            const val = localStorage.getItem(`calc_${id}`);
            const el = document.getElementById(id);
            if (el && val !== null) {
                if (el.type === 'checkbox') {
                    el.checked = (val === 'true');
                } else {
                    el.value = val;
                }
            }
        });

        // Restaurar jornada padrão checkbox separado
        const padraoCheckVal = localStorage.getItem('calc_jornada-padrao-check');
        const padraoCheck = document.getElementById('jornada-padrao-check');
        if (padraoCheck && padraoCheckVal !== null) {
            padraoCheck.checked = (padraoCheckVal === 'true');
        }

        // Restaurar rádio de vínculos SES-SP
        const radioVal = localStorage.getItem('calc_quant-vinculos');
        if (radioVal !== null) {
            const radio = document.querySelector(`input[name="quant-vinculos"][value="${radioVal}"]`);
            if (radio) radio.checked = true;
        }
    }

    // ----------------------------------------------------
    // TAB 1: JORNADA REDUZIDA (LÓGICA JAVA PORTADA)
    // ----------------------------------------------------
    const inputSemanalOriginal = document.getElementById('semanal-original');
    const inputPlantaoBase = document.getElementById('plantao-base');
    const inputPercentualReducao = document.getElementById('percentual-reducao');
    const checkJornadaPadrao = document.getElementById('jornada-padrao-check');
    const inputMesInicio = document.getElementById('mes-inicio');
    const inputAnoInicio = document.getElementById('ano-inicio');
    const tabelaEscala = document.getElementById('tabela-escala').querySelector('tbody');

    function calcularEAtualizarJornadaReduzida() {
        const cargaOriginal = parseFloat(inputSemanalOriginal.value) || 0;
        const duracaoBase = parseFloat(inputPlantaoBase.value) || 0;
        
        let reducao = parseFloat(inputPercentualReducao.value) || 0;
        if (checkJornadaPadrao.checked) {
            inputPercentualReducao.disabled = true;
            reducao = 0;
        } else {
            inputPercentualReducao.disabled = false;
        }
        
        const mesInicio = parseInt(inputMesInicio.value);
        const anoInicio = parseInt(inputAnoInicio.value) || 2026;

        // Cálculos base do serviço
        const fatorReducao = 1.0 - (reducao / 100.0);
        const cargaSemanalReduzida = cargaOriginal * fatorReducao;
        const jornadaMensalAlvo = cargaSemanalReduzida * 4.3;
        const duracaoPlantaoReduzida = duracaoBase * fatorReducao;
        const idealShifts = duracaoPlantaoReduzida > 0 ? (jornadaMensalAlvo / duracaoPlantaoReduzida) : 0;

        // Exibir métricas nos cards
        document.getElementById('res-semanal-reduzida').textContent = `${formatToHHMM(cargaSemanalReduzida)}h`;
        document.getElementById('res-mensal-alvo').textContent = `${formatToHHMM(jornadaMensalAlvo)}`;
        document.getElementById('res-plantao-reduzido').textContent = `${formatToHHMM(duracaoPlantaoReduzida)}`;

        // Limpar tabela
        tabelaEscala.innerHTML = '';

        if (duracaoPlantaoReduzida <= 0) return;

        // Lógica de alternância / compensação automática (Sigma-Delta)
        const floorShifts = Math.floor(idealShifts);
        const ceilShifts = Math.ceil(idealShifts);
        
        let saldoAcumulado = 0.0;
        let mesAtual = mesInicio;
        let anoAtual = anoInicio;

        for (let i = 0; i < 6; i++) {
            const saldoSeFloor = saldoAcumulado + ((floorShifts * duracaoPlantaoReduzida) - jornadaMensalAlvo);
            const saldoSeCeil = saldoAcumulado + ((ceilShifts * duracaoPlantaoReduzida) - jornadaMensalAlvo);

            let plantoesEscolhidos;
            let novoSaldoAcumulado;

            if (Math.abs(saldoSeFloor) < Math.abs(saldoSeCeil)) {
                plantoesEscolhidos = floorShifts;
                novoSaldoAcumulado = saldoSeFloor;
            } else if (Math.abs(saldoSeCeil) < Math.abs(saldoSeFloor)) {
                plantoesEscolhidos = ceilShifts;
                novoSaldoAcumulado = saldoSeCeil;
            } else {
                plantoesEscolhidos = ceilShifts;
                novoSaldoAcumulado = saldoSeCeil;
            }

            const workedHours = plantoesEscolhidos * duracaoPlantaoReduzida;
            const saldoMes = workedHours - jornadaMensalAlvo;
            const mesNome = MESES[mesAtual - 1];

            // Formatação para inserção na tabela
            const saldoMesStr = formatToHHMM(saldoMes);
            const saldoAcumuladoStr = formatToHHMM(novoSaldoAcumulado);

            const row = document.createElement('tr');
            
            // Classes CSS para os saldos
            const saldoMesClass = saldoMes > 0 ? 'badge-positive' : (saldoMes < 0 ? 'badge-negative' : 'badge-neutral');
            const saldoAcumuladoClass = novoSaldoAcumulado > 0 ? 'badge-positive' : (novoSaldoAcumulado < 0 ? 'badge-negative' : 'badge-neutral');

            row.innerHTML = `
                <td><strong>${mesNome}/${anoAtual}</strong></td>
                <td><span class="shift-pill">${plantoesEscolhidos} plantões</span></td>
                <td>${formatToHHMM(jornadaMensalAlvo)}</td>
                <td>${formatToHHMM(workedHours)}</td>
                <td><span class="badge-table ${saldoMesClass}">${saldoMes > 0 ? '+' : ''}${saldoMesStr}</span></td>
                <td><span class="badge-table ${saldoAcumuladoClass}">${novoSaldoAcumulado > 0 ? '+' : ''}${saldoAcumuladoStr}</span></td>
            `;

            tabelaEscala.appendChild(row);

            saldoAcumulado = novoSaldoAcumulado;

            // Avançar data
            mesAtual++;
            if (mesAtual > 12) {
                mesAtual = 1;
                anoAtual++;
            }
        }
        saveInputsToLocalStorage();
    }

    // Eventos da Tab 1
    [inputSemanalOriginal, inputPlantaoBase, inputPercentualReducao, inputMesInicio, inputAnoInicio].forEach(input => {
        input.addEventListener('input', calcularEAtualizarJornadaReduzida);
    });
    checkJornadaPadrao.addEventListener('change', calcularEAtualizarJornadaReduzida);

    // ----------------------------------------------------
    // TAB 2: DIMENSIONAMENTO COFEN (RESOLUÇÃO 743/2024)
    // ----------------------------------------------------
    const inputsCofenPacientes = [
        document.getElementById('cuidado-minimo'),
        document.getElementById('cuidado-intermediario'),
        document.getElementById('cuidado-alta-dep'),
        document.getElementById('cuidado-semi-intensivo'),
        document.getElementById('cuidado-intensivo')
    ];
    const selectCofenJornada = document.getElementById('cofen-jornada');
    const inputCofenIst = document.getElementById('cofen-ist');

    function calcularEAtualizarCofen() {
        const minP = parseInt(document.getElementById('cuidado-minimo').value) || 0;
        const intP = parseInt(document.getElementById('cuidado-intermediario').value) || 0;
        const altaP = parseInt(document.getElementById('cuidado-alta-dep').value) || 0;
        const semiP = parseInt(document.getElementById('cuidado-semi-intensivo').value) || 0;
        const intesP = parseInt(document.getElementById('cuidado-intensivo').value) || 0;

        const jornadaSemanal = parseFloat(selectCofenJornada.value);
        const ist = parseFloat(inputCofenIst.value) || 15;

        // Horas diárias requeridas por paciente (Resolução COFEN 743/2024 / Parecer Normativo 1/2024)
        const horasMin = 4;
        const horasInt = 6;
        const horasAlta = 10;
        const horasSemi = 10;
        const horasIntensivo = 18;

        // Total de Horas de Enfermagem (THE)
        const the = (minP * horasMin) + (intP * horasInt) + (altaP * horasAlta) + (semiP * horasSemi) + (intesP * horasIntensivo);

        // Constante de Marinho (KM) = (7 dias * (1 + IST)) / Jornada Semanal
        const km = (7 * (1 + (ist / 100))) / jornadaSemanal;

        // Quantitativo de Pessoal (QP)
        const qpExato = the * km;
        const qpArredondado = Math.ceil(qpExato);

        // Atualizar resultados na tela
        document.getElementById('res-the').textContent = `${the.toFixed(1)} h/dia`;
        document.getElementById('res-km').textContent = km.toFixed(4);
        document.getElementById('res-qp').textContent = `${qpArredondado} Profissionais`;
        document.getElementById('res-qp-detalhado').textContent = `Exato: ${qpExato.toFixed(2)} (já incluso IST de ${ist}%)`;

        // Distribuição percentual sugerida de acordo com perfil de cuidados
        // Mínimo: 33% Enf, 67% Tec
        // Intermediário: 33% Enf, 67% Tec
        // Alta Dependência: 36% Enf, 64% Tec
        // Semi-intensivo: 42% Enf, 58% Tec
        // Intensivo: 52% Enf, 48% Tec
        
        let nurseHoursNeeded = 0;
        let techHoursNeeded = 0;

        nurseHoursNeeded += (minP * horasMin) * 0.33;
        techHoursNeeded += (minP * horasMin) * 0.67;

        nurseHoursNeeded += (intP * horasInt) * 0.33;
        techHoursNeeded += (intP * horasInt) * 0.67;

        nurseHoursNeeded += (altaP * horasAlta) * 0.36;
        techHoursNeeded += (altaP * horasAlta) * 0.64;

        nurseHoursNeeded += (semiP * horasSemi) * 0.42;
        techHoursNeeded += (semiP * horasSemi) * 0.58;

        nurseHoursNeeded += (intesP * horasIntensivo) * 0.52;
        techHoursNeeded += (intesP * horasIntensivo) * 0.48;

        let nursePercent = 33;
        let techPercent = 67;

        if (the > 0) {
            nursePercent = (nurseHoursNeeded / the) * 100;
            techPercent = (techHoursNeeded / the) * 100;
        }

        const numNurses = Math.round(qpArredondado * (nursePercent / 100));
        const numTechs = Math.max(0, qpArredondado - numNurses);

        // Atualizar barra gráfica e labels
        document.getElementById('label-enfermeiros').textContent = `Enfermeiros (${nursePercent.toFixed(0)}%): ${numNurses}`;
        document.getElementById('label-tecnicos').textContent = `Técnicos/Auxiliares (${techPercent.toFixed(0)}%): ${numTechs}`;
        
        document.getElementById('bar-nurse').style.width = `${nursePercent}%`;
        document.getElementById('bar-tech').style.width = `${techPercent}%`;
        saveInputsToLocalStorage();
    }

    // Eventos da Tab 2
    inputsCofenPacientes.forEach(input => input.addEventListener('input', calcularEAtualizarCofen));
    selectCofenJornada.addEventListener('change', calcularEAtualizarCofen);
    inputCofenIst.addEventListener('input', calcularEAtualizarCofen);

    // ----------------------------------------------------
    // TAB 3: LIMITES DE PLANTÃO SES-SP (LC 1176/2012)
    // ----------------------------------------------------
    const radiosVinculos = document.getElementsByName('quant-vinculos');
    const selectJornadaVinculo1 = document.getElementById('jornada-vinculo-1');
    const selectJornadaVinculo2 = document.getElementById('jornada-vinculo-2');
    const groupVinculo2 = document.getElementById('group-vinculo-2');
    const inputPlantoesDesejados = document.getElementById('plantoes-desejados');

    function toggleVinculosDisplay() {
        let selectedVinculos = "1";
        radiosVinculos.forEach(radio => {
            if (radio.checked) selectedVinculos = radio.value;
        });

        if (selectedVinculos === "2") {
            groupVinculo2.style.display = "flex";
        } else {
            groupVinculo2.style.display = "none";
        }
        calcularEAtualizarLimitesSes();
    }

    function calcularEAtualizarLimitesSes() {
        let quantVinculos = "1";
        radiosVinculos.forEach(radio => {
            if (radio.checked) quantVinculos = radio.value;
        });

        const j1 = parseInt(selectJornadaVinculo1.value);
        const j2 = parseInt(selectJornadaVinculo2.value);
        const desejados = parseInt(inputPlantoesDesejados.value) || 0;

        let limite = 12; // Limite padrão de plantões
        let explicacaoCitação = "";

        if (quantVinculos === "1") {
            limite = 12;
            explicacaoCitação = `
                <p><strong>Configuração:</strong> Vínculo único de ${j1}h semanais.</p>
                <p><strong>Normativa:</strong> De acordo com a <strong>Lei Complementar Estadual nº 1.176/2012</strong>, servidores com um único vínculo (independentemente da jornada semanal de 12h, 20h, 24h, 30h ou 40h) possuem o limite máximo autorizado de <strong>12 plantões extras de 12 horas por mês</strong>.</p>
            `;
        } else {
            // Dois Vínculos
            // Combinações da lei:
            if (j1 === 12 && j2 === 12) {
                limite = 12;
                explicacaoCitação = `
                    <p><strong>Configuração:</strong> Dois vínculos, ambos em jornada de 12h semanais.</p>
                    <p><strong>Normativa:</strong> De acordo com o Art. 1º da <strong>LC 1176/2012</strong>, servidores com dois vínculos de 12h semanais possuem limite de até <strong>12 plantões de 12 horas extras mensais</strong>.</p>
                `;
            } else if ((j1 === 20 && j2 === 12) || (j1 === 12 && j2 === 20)) {
                limite = 9;
                explicacaoCitação = `
                    <p><strong>Configuração:</strong> Um vínculo de 20h e outro de 12h semanais.</p>
                    <p><strong>Normativa:</strong> O limite de plantões extras autorizado por lei é reduzido para <strong>9 plantões extras de 12 horas por mês</strong> para evitar sobrecarga de trabalho.</p>
                `;
            } else if ((j1 === 24 && j2 === 12) || (j1 === 12 && j2 === 24)) {
                limite = 7;
                explicacaoCitação = `
                    <p><strong>Configuração:</strong> Um vínculo de 24h e outro de 12h semanais.</p>
                    <p><strong>Normativa:</strong> O limite autorizado por lei é de <strong>7 plantões extras de 12 horas por mês</strong>.</p>
                `;
            } else if (j1 === 20 && j2 === 20) {
                limite = 6;
                explicacaoCitação = `
                    <p><strong>Configuração:</strong> Dois vínculos, ambos em jornada de 20h semanais.</p>
                    <p><strong>Normativa:</strong> Conforme regramento de acúmulo de cargos da SES-SP, o limite legal é restrito a <strong>6 plantões extras de 12 horas por mês</strong>.</p>
                `;
            } else if ((j1 === 24 && j2 === 20) || (j1 === 20 && j2 === 24)) {
                limite = 4;
                explicacaoCitação = `
                    <p><strong>Configuração:</strong> Um vínculo de 24h e outro de 20h semanais.</p>
                    <p><strong>Normativa:</strong> Devido à elevada carga horária semanal acumulada (44h), o limite legal para plantões extras é de <strong>4 plantões de 12 horas por mês</strong>.</p>
                `;
            } else if (j1 === 24 && j2 === 24) {
                limite = 3;
                explicacaoCitação = `
                    <p><strong>Configuração:</strong> Dois vínculos, ambos em jornada de 24h semanais.</p>
                    <p><strong>Normativa:</strong> Para o acúmulo máximo permitido na saúde estadual (48h semanais), o limite legal de plantões adicionais de 12h é de no máximo <strong>3 plantões extras por mês</strong>.</p>
                `;
            } else {
                // Outras combinações
                limite = 3;
                explicacaoCitação = `
                    <p><strong>Configuração personalizada ou acúmulo especial.</strong></p>
                    <p><strong>Alerta:</strong> Carga horária semanal acumulada excede parâmetros recomendados. O limite padrão de segurança adotado pelo validador é de no máximo <strong>3 plantões por mês</strong>. Consulte a Coordenadoria de Recursos Humanos (CRH) da unidade.</p>
                `;
            }
        }

        // Atualizar campos de resultados
        document.getElementById('res-limite-mensal').textContent = `${limite} Plantões`;
        document.getElementById('res-plantoes-planejados').textContent = `${desejados} Plantões`;
        document.getElementById('res-plantoes-horas').textContent = `(${desejados * 12} horas planejadas no mês)`;
        document.getElementById('legal-citation-text').innerHTML = explicacaoCitação;

        // Validar conformidade
        const statusBadge = document.getElementById('status-badge');
        const statusTexto = document.getElementById('status-texto');

        if (desejados <= limite) {
            statusBadge.className = "compliance-badge badge-ok";
            statusTexto.innerHTML = `Escala em Conformidade Legal`;
            statusBadge.querySelector('svg').innerHTML = `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`;
        } else {
            statusBadge.className = "compliance-badge badge-fail";
            statusTexto.innerHTML = `Limite Excedido! Risco de Glosa`;
            statusBadge.querySelector('svg').innerHTML = `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`;
        }
        saveInputsToLocalStorage();
    }

    // Eventos da Tab 3
    radiosVinculos.forEach(radio => radio.addEventListener('change', toggleVinculosDisplay));
    selectJornadaVinculo1.addEventListener('change', calcularEAtualizarLimitesSes);
    selectJornadaVinculo2.addEventListener('change', calcularEAtualizarLimitesSes);
    inputPlantoesDesejados.addEventListener('input', calcularEAtualizarLimitesSes);

    // ----------------------------------------------------
    // INICIALIZAÇÃO GERAL
    // ----------------------------------------------------
    loadInputsFromLocalStorage();
    calcularEAtualizarJornadaReduzida();
    calcularEAtualizarCofen();
    toggleVinculosDisplay();
});
