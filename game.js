// --- VARIÁVEIS GLOBAIS ---
let heroi = {
    nome: "Herói",
    vida: 100,
    vidaMaxima: 100,
    dinheiro: 0,
    ataque: 10,
    defesa: 0,
    nivel: 1,
    exp: 0,
    expProximo: 10,
    espadaBlack: false,
    escudoBlack: false,
    codigosResgatados: {}
};
heroi.equipamento = {
    espada: false,
    escudo: false
};
let vila = { nivel: 1, madeira: 0, pedra: 0, ferro: 0 };
let dia = 1;
const DIA_FINAL = 10;
let slotAtual = 1;
let cenarioAtual = 'vila';
let energiaMaxima = 10;
let energiaAtual = energiaMaxima;
const ui = document.getElementById('ui');
let morreuParaBossFinal = false;

let estadoJogo = {
    jogoEncerrado: false,
    final: null,
    finais: { bom: false, ruim: false },
    jornaisLidos: []
};

if (estadoJogo.jogoEncerrado) {
    mostrarFinalSalvo();
}

const trilha = document.getElementById('trilha');
let audioCaverna = new Audio('audio/caverna_ambiente.mp3'); // ➡️ Novo elemento de áudio
audioCaverna.loop = true; // ➡️ Toca em loop
audioCaverna.volume = 0.5;
let somHabilitado = true;
let volumeAtual = 0.5;

const jornaisPorDia = {

    1: {
        titulo: "Dia Tranquilo na Vila",
        texto: [
            "A vila acordou em paz.",
            "Moradores seguem suas rotinas normalmente.",
            "Nada de estranho foi relatado.",
            "Volte amanhã para mais notícias."
        ]
    },

    2: {
        titulo: "Sons Estranhos na Floresta",
        texto: [
            "Alguns moradores relataram ruídos durante a noite.",
            "A floresta parece mais silenciosa que o normal.",
            "Autoridades dizem que não há motivo para pânico.",
            "Volte amanhã para mais notícias."
        ]
    },

    3: {
        titulo: "Primeiros Sinais de Perigo",
        texto: [
            "Animais foram encontrados feridos próximos à vila.",
            "Moradores evitam sair após o anoitecer.",
            "O medo começa a se espalhar.",
            "Volte amanhã para mais notícias."
        ]
    },

    4: {
        titulo: "Moradores se Protegem",
        texto: [
            "Casas permanecem fechadas durante a noite.",
            "O comércio fecha mais cedo.",
            "A vila já não é mais a mesma.",
            "Volte amanhã para mais notícias."
        ]
    },

    5: {
        titulo: "Criaturas à Espreita",
        texto: [
            "Relatos confirmam a presença de monstros.",
            "Alguns moradores desapareceram.",
            "A esperança começa a diminuir.",
            "Volte amanhã para mais notícias."
        ]
    },

    6: {
        titulo: "Medo Toma Conta da Vila",
        texto: [
            "Moradores evitam sair de casa após o pôr do sol.",
            "Gritos foram ouvidos vindos da floresta durante a madrugada.",
            "Algumas famílias já pensam em abandonar a vila.",
            "Volte amanhã para mais notícias."
        ]
    },

    7: {
        titulo: "Desaparecimentos Confirmados",
        texto: [
            "Três caçadores não retornaram de uma expedição.",
            "Pegadas monstruosas foram vistas perto das casas.",
            "A tensão cresce entre os moradores.",
            "Volte amanhã para mais notícias."
        ]
    },

    8: {
        titulo: "A Escuridão se Aproxima",
        texto: [
            "Relatos indicam criaturas rondando a vila à noite.",
            "As portas agora ficam trancadas o tempo todo.",
            "Ninguém se sente seguro nem dentro de casa.",
            "Volte amanhã para mais notícias."
        ]
    },

    9: {
        titulo: "Último Aviso",
        texto: [
            "Os sinos da vila tocaram durante a madrugada.",
            "Algo enorme foi visto nas colinas próximas.",
            "Os moradores rezam por um milagre.",
            "Volte amanhã para mais notícias."
        ]
    }
};

const itensMercadoNegro = [
    {
        id: 'espada_amaldicoada',
        nome: '🗡️ Espada Amaldiçoada',
        descricao: '+5 ATQ',
        preco: 50,
        comprar() {

            if (heroi.espadaBlack) {
                log("⚠️ Você já possui a Espada Amaldiçoada.");
                return false; // COMPRA CANCELADA
            }

            heroi.ataque += 5;
            heroi.espadaBlack = true;
            return true; // COMPRA OK
        }
    },
    {
        id: 'escudo_rachado',
        nome: '🛡️ Escudo Rachado',
        descricao: '+5 DEF',
        preco: 50,
        comprar() {

            if (heroi.escudoBlack) {
                log("⚠️ Você já possui o Escudo Rachado.");
                return false; // COMPRA CANCELADA
            }

            heroi.defesa += 5;
            heroi.escudoBlack = true;
            return true; // COMPRA OK
        }
    },
    {
        id: 'elixir_proibido',
        nome: '🧪 Elixir Proibido',
        descricao: '+10 VIDA MÁX',
        preco: 40,
        comprar() {
            heroi.vidaMaxima += 10;
            heroi.vida += 10;
            return true;
        }
    }
];

// --- MENUS ---
function abrirTelaSlots() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('tela-slots').style.display = 'flex';
    atualizarInfosSlots();
}

function fecharTelaSlots() {
    document.getElementById('tela-slots').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
    document.getElementById('tela-inicial').style.display = '';
}

function mostrarCreditos() {
    alert("O Último Herói\nUm RPG de sobrevivência e reconstrução\nFeito por Marcos.");
}

// --- SISTEMA DE SLOTS ---
function carregarJogo(slot) {
    // 1. Guardamos o que foi resgatado no menu antes de a variável 'heroi' ser reiniciada
    const codigosDoMenu = { ...heroi.codigosResgatados };

    slotAtual = slot;
    let salvo = localStorage.getItem(`slot_${slot}`);

    if (salvo) {
        let dados = JSON.parse(salvo);
        heroi = dados.heroi || heroi;
        vila = dados.vila || vila;
        dia = dados.dia || 1;
        estadoJogo = dados.estadoJogo || estadoJogo;
        energiaAtual = dados.energiaAtual;
    } else {
        // NOVO JOGO: Mantive exatamente o seu objeto original
        heroi = {
            nome: "Herói", vida: 100, vidaMaxima: 100, dinheiro: 0,
            ataque: 10, defesa: 0, nivel: 1, exp: 0, expProximo: 10,
            equipamento: { espada: false, escudo: false },
            codigosResgatados: {} // Adicionamos isso para garantir que o objeto exista
        };
        vila = { nivel: 1, madeira: 0, pedra: 0, ferro: 0 };
        dia = 1;
        energiaAtual = 10;
        estadoJogo = { jogoEncerrado: false, final: null, finais: { bom: false, ruim: false } };
    }

    // 2. REAPLICAR CÓDIGOS: Se o jogador usou códigos no menu, aplicamos no novo slot agora
    if (!heroi.codigosResgatados) heroi.codigosResgatados = {};

    // Bônus: heroi
    if (codigosDoMenu.heroi && !heroi.codigosResgatados.heroi) {
        heroi.ataque += 10;
        heroi.defesa += 10;
        heroi.codigosResgatados.heroi = true;
    }
    // Bônus: elonmusk
    if (codigosDoMenu.elonmusk && !heroi.codigosResgatados.elonmusk) {
        heroi.dinheiro += 10000;
        heroi.codigosResgatados.elonmusk = true;
    }
    // Bônus: recordistas
    if (codigosDoMenu.recordistas && !heroi.codigosResgatados.recordistas) {
        heroi.vidaMaxima += 1000;
        heroi.vida = heroi.vidaMaxima;
        heroi.codigosResgatados.recordistas = true;
    }

    iniciarJogo();
    atualizarFinaisUI();

    // Salva imediatamente para que o bônus seja gravado no arquivo deste slot
    salvarProgresso();
}

function apagarSlot(slot) {
    if (confirm(`Apagar progresso do Slot ${slot}?`)) {
        localStorage.removeItem(`slot_${slot}`);
        atualizarInfosSlots();
    }
}

function salvarProgresso() {
    let dados = { heroi, vila, dia, estadoJogo, energiaAtual };
    localStorage.setItem(`slot_${slotAtual}`, JSON.stringify(dados));
}

function salvarESair() {
    salvarProgresso();
    location.reload();
}

function atualizarInfosSlots() {
    for (let i = 1; i <= 3; i++) {
        let salvo = localStorage.getItem(`slot_${i}`);
        let infoP = document.getElementById(`info-slot-${i}`);
        if (infoP) {
            if (salvo) {
                let d = JSON.parse(salvo);
                infoP.innerHTML = `Vila Nvl: ${d.vila.nivel} | Dia: ${d.dia}`;
            } else { infoP.innerHTML = "Vazio"; }
        }
    }
}

function atualizarUI() {
    ui.innerHTML = '';

    document.getElementById('vida').textContent = heroi.vida;
    document.getElementById('vida-maxima').textContent = heroi.vidaMaxima;
    document.getElementById('dinheiro').textContent = heroi.dinheiro;
    document.getElementById('atk').textContent = heroi.ataque;
    document.getElementById('def').textContent = heroi.defesa;

    document.getElementById('nivel-vila').textContent = vila.nivel;
    document.getElementById('madeira').textContent = vila.madeira;
    document.getElementById('pedra').textContent = vila.pedra;
    document.getElementById('ferro').textContent = vila.ferro;

    if (estadoJogo.menuAberto === 'mercadoNegro') {
        ui.innerHTML = `
        <div class="menu mercado-negro">
            <h3>🕶️ Mercado Negro</h3>

            ${itensMercadoNegro.map(item => `
                <button class="btn-item" onclick="comprarItemMercadoNegro('${item.id}')">
                    <strong>${item.nome}</strong><br>
                    <small>${item.descricao}</small><br>
                    💰 ${item.preco} ouro
                </button>
            `).join('')}

            <button class="btn-fechar" onclick="fecharMenu()">❌ Fechar</button>
        </div>
    `;
    }

    if (estadoJogo.menuAberto === 'templo') {
        ui.innerHTML = `
        <div class="menu templo">
            <h3>⛩️ Templo Antigo</h3>
            <p>
                Uma voz ecoa:<br>
                <em>"Vida é poder. Poder é sacrifício."</em>
            </p>

            <button onclick="sacrificarVida('ataque')">
                🗡️ Sacrificar 5 VIDA → +2 ATQ
            </button>

            <button onclick="sacrificarVida('defesa')">
                🛡️ Sacrificar 5 VIDA → +2 DEF
            </button>

            <button class="btn-fechar" onclick="fecharMenu()">❌ Sair</button>
        </div>
    `;
    }
}

// --- SISTEMA GLOBAL DE FINAIS ---

// 1. Função para ler os dados globais (independente do Slot)
function getFinaisGlobais() {
    let globalData = localStorage.getItem('heroi_finais_globais');
    if (globalData) {
        return JSON.parse(globalData);
    } else {
        return { bom: false, ruim: false };
    }
}

// 2. Função chamada ao vencer/perder para salvar o final
function registrarFinalGlobal(tipo) {
    let finais = getFinaisGlobais();

    if (tipo === 'bom') finais.bom = true;
    if (tipo === 'ruim') finais.ruim = true;

    // Salva permanentemente no navegador
    localStorage.setItem('heroi_finais_globais', JSON.stringify(finais));

    // Atualiza a tela se ela estiver aberta (opcional, mas evita erros)
    atualizarFinaisUI();
}

// 3. Função que atualiza o TEXTO e a COR dos finais no HTML
function atualizarFinaisUI() {
    const finais = getFinaisGlobais();

    // Pegamos os elementos criados no HTML
    const elBom = document.getElementById('final-bom');
    const elRuim = document.getElementById('final-ruim');

    // Verificação de segurança (evita o erro "properties of null")
    if (elBom) {
        if (finais.bom) {
            elBom.textContent = "🌟 Final Bom: Desbloqueado!";
            elBom.style.color = "#4c4"; // Verde
        } else {
            elBom.textContent = "🔒 Final Bom: Bloqueado";
            elBom.style.color = "#ccc"; // Cinza
        }
    }

    if (elRuim) {
        if (finais.ruim) {
            elRuim.textContent = "💀 Final Ruim: Desbloqueado!";
            elRuim.style.color = "#d44"; // Vermelho
        } else {
            elRuim.textContent = "🔒 Final Ruim: Bloqueado";
            elRuim.style.color = "#ccc"; // Cinza
        }
    }
}

// 4. Função do Botão no Menu Principal
function abrirPainelFinais() {
    atualizarFinaisUI(); // Puxa do armazenamento global
    document.getElementById("painel-finais").style.display = "flex";
}

function fecharPainelFinais() {
    document.getElementById("painel-finais").style.display = "none";
}

function abrirPainelFinais() {
    atualizarFinaisUI(); // Atualiza os textos antes de abrir
    document.getElementById("painel-finais").style.display = "block";
}

// ------------------------- sistema de codigos ---------------------------

function resgatarCodigo() {
    const inputElement = document.getElementById('input-codigo');
    // Transformamos tudo para minúsculo para evitar erros de digitação
    const codigo = inputElement.value.toLowerCase().trim();

    if (!heroi.codigosResgatados) {
        heroi.codigosResgatados = {};
    }

    // --- CÓDIGO: HEROI ---
    if (codigo === 'heroi') {
        if (heroi.codigosResgatados.heroi) {
            alert('Este código já foi usado.');
            return;
        }
        heroi.ataque += 10;
        heroi.defesa += 10;
        heroi.codigosResgatados.heroi = true;
        alert('⚔️ Bônus de Herói aplicado! +10 Ataque e Defesa.');
    }

    // --- CÓDIGO: ELON MUSK (Corrigido para 'elonmusk' em minúsculo) ---
    else if (codigo === 'elonmusk' || codigo === 'elon musk') {
        if (heroi.codigosResgatados.elonmusk) {
            alert('Este código já foi usado.');
            return;
        }
        heroi.dinheiro += 10000;
        heroi.codigosResgatados.elonmusk = true;
        alert('💰 Fortuna de Elon Musk recebida! +10.000 Dinheiro.');
    }

    // --- CÓDIGO: RECORDISTAS ---
    else if (codigo === 'recordistas') {
        if (heroi.codigosResgatados.recordistas) {
            alert('O recorde de Luiz Davi já está com você.');
            return;
        }
        heroi.vidaMaxima += 1000;
        heroi.vida = heroi.vidaMaxima;
        heroi.codigosResgatados.recordistas = true;
        alert('🏆 RECORDISTA: Luiz Davi!\nSua Vida Máxima aumentou em +1000!');
    }

    else if (codigo === '') {
        alert('Digite um código!');
        return;
    } else {
        alert('Código inválido!');
        return;
    }

    // Usando suas funções existentes para garantir a persistência
    salvarProgresso();
    atualizarTela();

    inputElement.value = '';
}

//-------- tutorial --------------

function abrirTutorial() {
    document.getElementById("menuTutorial").style.display = "block";

    const botao = document.getElementById("botaoTutorial");
    if (botao) botao.classList.remove("botao-piscando");
}

function fecharTutorial() {
    document.getElementById("menuTutorial").style.display = "none";
}

//------ sistema de jornal ---------------

function obterJornalDoDia() {

    if (dia === 10) {
        return {
            titulo: "Sem Jornal Hoje",
            texto: [
                "O entregador de jornais não apareceu.",
                "Dizem que ele se recusou a voltar à vila.",
                "O medo agora é absoluto."
            ]
        };
    }
    // Usa a variável global 'dia' diretamente
    if (jornaisPorDia[dia]) {
        return jornaisPorDia[dia];
    }
}

function lerJornal() {
    const painel = document.getElementById("painel-jornal");
    const tituloEl = document.getElementById("titulo-jornal");
    const textoEl = document.getElementById("texto-jornal");

    const jornal = obterJornalDoDia();

    if (!jornal) {
        tituloEl.textContent = "Nenhum Jornal Entregue";
        textoEl.innerHTML = "<p>O entregador não voltou hoje...</p>";
        painel.classList.remove("oculto");
        return;
    }

    tituloEl.textContent = jornal.titulo;

    textoEl.innerHTML = jornal.texto
        .map(linha => `<p>${linha}</p>`)
        .join("");

    painel.classList.remove("oculto");
}

function fecharJornal() {
    const painel = document.getElementById("painel-jornal");
    painel.classList.add("oculto");
}

// -------------------------- som -----------------------


function alterarVolume(valor) {
    game.scene.scenes[0].sound.volume = valor; // valor entre 0 e 1
}

// --- CORE DO JOGO ---
function iniciarJogo() {
    document.getElementById('tela-slots').style.display = 'none';
    document.getElementById('jogo-interface').style.display = 'block';
    mudarCenario('vila');
    atualizarTela();
    log("<b>Bem-vindo de volta!</b> Use as setas para andar e Espaço para interagir.");
}

function mudarCenario(cenario) {
    cenarioAtual = cenario;
    // Paineis HTML
    document.getElementById('melhorar-vila').style.display = (cenario === 'vila') ? 'block' : 'none';
    document.getElementById('explorar-floresta').style.display = (cenario === 'floresta') ? 'block' : 'none';
    document.getElementById('caverna-acoes').style.display = (cenario === 'caverna') ? 'block' : 'none';

    log(`🌍 Você viajou para: <b>${cenario.toUpperCase()}</b>`);
    atualizarTela();
}

//------------- sistema da bruxa --------------------

function fecharHistoriaBruxa() {
    estadoJogo.menuAberto = null;
    morreuParaBossFinal = false;

    heroi.vida = Math.floor(heroi.vidaMaxima * 0.5);

    log("🖤 Uma energia estranha pulsa dentro de você...");
    log("🧙‍♀️ A bruxa desaparece, como se já soubesse o desfecho.");
    log("⚠️ Algo dentro de você mudou.");

    atualizarUI();
}

function mostrarBruxaHistoria() {
    estadoJogo.menuAberto = 'bruxa';

    const ui = document.getElementById("ui");

    ui.innerHTML = `
        <div class="menu-bruxa">
            <h2>🧙‍♀️ A Bruxa observa em silêncio...</h2>

            <p>"Então... chegou a este ponto também."</p>

            <p>"Eu já vi esse olhar antes... o desespero de não ser forte o bastante."</p>

            <p>"Você queria salvar todos... mas o medo de falhar é o que abre espaço para o verdadeiro mal."</p>

            <p>"O poder que você buscou... não vem sem um preço."</p>

            <p>"Seu corpo ainda resiste... mas sua alma já começou a mudar."</p>

            <p>"O Monstro Original... não nasceu monstro."</p>

            <p>"A lenda descreve alguém… exatamente como você."</p>

            <button onclick="fecharHistoriaBruxa()">…O que está acontecendo comigo?</button>
        </div>
    `;
}

//-------------- mecanicas diversas --------

function gastarEnergia(qtd = 1) {
    if (energiaAtual < qtd) {
        log("😴 Você está sem energia. Precisa dormir.");
        return false;
    }

    energiaAtual -= qtd;
    atualizarTela();
    return true;
}

function ganharExp(qtd) {
    heroi.exp += qtd;
    log(`⭐ +${qtd} EXP`);

    if (heroi.exp >= heroi.expProximo) {
        heroi.exp -= heroi.expProximo;
        heroi.nivel++;
        heroi.expProximo = Math.floor(heroi.expProximo * 1.4);

        heroi.vidaMaxima += 10;
        heroi.ataque += 2;
        heroi.defesa += 2;

        log(`🔥 Você subiu para o nível ${heroi.nivel}!`);
    }

    atualizarTela();
}

//------------- lojas ----------

function abrirMercadoNegro() {
    if (!gastarEnergia(1)) return;

    estadoJogo.menuAberto = 'mercadoNegro';
    atualizarUI();
}

function comprarItemMercadoNegro(id) {
    const item = itensMercadoNegro.find(i => i.id === id);
    if (!item) return;

    if (heroi.dinheiro < item.preco) {
        log('❌ Dinheiro insuficiente.');
        return;
    }

    // Tenta comprar
    const comprou = item.comprar();

    // Se a função comprar() retornou false, não cobra dinheiro
    if (!comprou) return;

    heroi.dinheiro -= item.preco;

    log(`🕶️ Compra realizada no mercado negro...`);
    atualizarUI();
}

function fecharMenu() {
    estadoJogo.menuAberto = null;
    atualizarUI();
}

function abrirLoja() {
    document.getElementById('loja-menu').style.display = 'block';
    log("🛒 Você entrou na loja.");
}

function fecharLoja() {
    document.getElementById('loja-menu').style.display = 'none';
    log("🚪 Você saiu da loja.");
}

function comprarEspada() {
    if (heroi.equipamento.espada) {
        log("⚔️ Você já possui uma espada.");
        return;
    }

    if (heroi.dinheiro < 50) {
        log("❌ Ouro insuficiente para comprar a espada.");
        return;
    }

    if (!gastarEnergia(1)) return;

    heroi.dinheiro -= 50;
    heroi.ataque += 5;
    heroi.equipamento.espada = true;

    log("⚔️ Espada comprada! Ataque aumentado.");
    atualizarTela();
}

function comprarEscudo() {
    if (heroi.equipamento.escudo) {
        log("🛡️ Você já possui um escudo.");
        return;
    }

    if (heroi.dinheiro < 40) {
        log("❌ Ouro insuficiente para comprar o escudo.");
        return;
    }

    if (!gastarEnergia(1)) return;

    heroi.dinheiro -= 40;
    heroi.defesa += 4;
    heroi.equipamento.escudo = true;

    log("🛡️ Escudo comprado! Defesa aumentada.");
    atualizarTela();
}

//--------- inventario -----------

function abrirInventario() {
    const painel = document.getElementById("painel-inventario");
    const conteudo = document.getElementById("conteudo-inventario");

    let html = "";

    html += `<p><b>Armas:</b><br>`;
    html += heroi.espada ? "🗡️ Espada Comum<br>" : "";
    html += heroi.espadaBlack ? "🗡️ Espada Amaldiçoada<br>" : "";
    html += "</p>";

    html += `<p><b>Escudos:</b><br>`;
    html += heroi.escudo ? "🛡️ Escudo Comum<br>" : "";
    html += heroi.escudoBlack ? "🛡️ Escudo Rachado<br>" : "";
    html += "</p>";

    if (html.trim() === "") {
        html = "<p>Inventário vazio.</p>";
    }

    conteudo.innerHTML = html;
    painel.classList.remove("oculto");
}

function fecharInventario() {
    document.getElementById("painel-inventario").classList.add("oculto");
}

//------------ templo ---------------

function abrirTemplo() {

    estadoJogo.menuAberto = 'templo';
    atualizarUI();
}

function sacrificarVida(tipo) {
    if (!gastarEnergia(1)) return;

    if (heroi.vidaMaxima <= 5) {
        log('❌ Sua vida é baixa demais para este sacrifício.');
        return;
    }

    heroi.vidaMaxima -= 5;

    if (heroi.vida > heroi.vidaMaxima) {
        heroi.vida = heroi.vidaMaxima;
    }

    if (tipo === 'ataque') {
        heroi.ataque += 2;
        log('🗡️ Você sente sua força crescer...');
    }

    if (tipo === 'defesa') {
        heroi.defesa += 2;
        log('🛡️ Sua pele se torna mais resistente...');
    }

    atualizarUI();
}

//--------------- lutar -------------

function iniciarLuta() {
    if (!gastarEnergia(1)) return;

    // 🔒 Garantias
    heroi.vida = Math.max(heroi.vida, 1);
    heroi.defesa = heroi.defesa || 0;

    const monstro = gerarMonstro();

    log(`🐲 Um ${monstro.nome} apareceu!`);

    while (heroi.vida > 0 && monstro.vida > 0) {

        // HERÓI ATACA
        const danoHeroi = Math.max(heroi.ataque - (monstro.defesa || 0), 1);
        monstro.vida -= danoHeroi;

        if (monstro.vida <= 0) break;

        // MONSTRO ATACA
        const danoMonstro = Math.max(monstro.ataque - heroi.defesa, 1);
        heroi.vida -= danoMonstro;
    }

    if (heroi.vida <= 0) {
        log("☠️ Você foi derrotado...");
        heroi.vida = Math.floor(heroi.vidaMaxima / 2);
        log("🩸 Você escapou com vida...");
    } else {
        ganharExp(10);
        heroi.dinheiro += monstro.ouro;
        log(`🏆 Você derrotou o ${monstro.nome}!`);
    }

    atualizarUI();
}

function gerarMonstro() {
    return {
        nome: "Criatura da Caverna",
        vida: 1 + vila.nivel * 10,
        ataque: 1 + vila.nivel * 10,
        ouro: 1 + vila.nivel * 10
    };
}

function iniciarLutaFinal() {
    const monstro = gerarMonstroFinal();
    log("🔥 A Criatura Original desperta...");

    while (heroi.vida > 0 && monstro.vida > 0) {
        monstro.vida -= heroi.ataque;
        if (monstro.vida <= 0) break;

        heroi.vida -= monstro.ataque;
    }

    if (heroi.vida > 0) {
        finalBom();
    } else {
        finalRuim();
        morreuParaBossFinal = true;
        mostrarBruxaHistoria();
        return;

    }

    atualizarUI();
}

function gerarMonstroFinal() {
    return {
        nome: "Criatura Original",
        vida: 130,
        ataque: 13
    };
}

function decidirLuta() {
    if (estadoJogo.jogoEncerrado) {
        log("⛔ Seu destino já foi selado.");
        return;
    }

    if (dia === DIA_FINAL) {
        iniciarLutaFinal();
    } else if (dia < DIA_FINAL) {
        iniciarLuta();
    } else {
        log("🌑 Não há mais batalhas.");
    }
}

function finalBom() {
    estadoJogo.final = "bom";
    estadoJogo.jogoEncerrado = true;

    // Registra na memória global
    registrarFinalGlobal('bom');

    log("🌟 A Criatura Original foi derrotada.");
    log("👑 Você quebrou o ciclo.");
    log("✨ FINAL BOM REGISTRADO!");
    log("⛔ O jogo acabou. Inicie um novo Slot para buscar o outro caminho.");

    salvarProgresso(); // Salva o estado travado deste slot
}

function finalRuim() {
    estadoJogo.final = "ruim";
    estadoJogo.jogoEncerrado = true;

    // Registra na memória global
    registrarFinalGlobal('ruim');

    log("☠️ Você caiu diante da Criatura Original...");
    log("♾️ Você se torna o novo Criador.");
    log("🌑 FINAL RUIM REGISTRADO!");
    log("⛔ O jogo acabou. Inicie um novo Slot para buscar o outro caminho.");

    salvarProgresso(); // Salva o estado travado deste slot
}

function verificarFimDeJogo() {
    if (estadoJogo.jogoEncerrado) {
        log("⛔ O destino já foi selado.");
        return true;
    }
    return false;
}

// --- LOJA ---
function comprarPocao() {
    if (!gastarEnergia(1)) return;
    const precoBase = 20;
    const desconto = vila.descontoLoja || 0;
    const precoFinal = Math.max(precoBase - desconto, 5);

    if (heroi.dinheiro < precoFinal) {
        log("❌ Ouro insuficiente.");
        return;
    }

    heroi.dinheiro -= precoFinal;
    heroi.vida = Math.min(heroi.vida + 30, heroi.vidaMaxima);

    log(`🧪 Poção comprada por ${precoFinal} ouro.`);
    atualizarUI();
}

// --- MECÂNICA DE EVOLUÇÃO E COLETA ---
function executarMelhoriaVila() {
    let custoBase = vila.nivel * 10;
    let custoFerro = vila.nivel * 5;

    if (vila.madeira >= custoBase && vila.pedra >= custoBase && vila.ferro >= custoFerro) {
        if (!gastarEnergia(1)) return;
        vila.madeira -= custoBase;
        vila.pedra -= custoBase;
        vila.ferro -= custoFerro;
        vila.nivel++;
        log(`🎉 <b>Vila evoluída para o Nível ${vila.nivel}!</b>`);
        aplicarBonusVila()
        atualizarTela();
        salvarProgresso();
    } else {
        log(`❌ Recursos insuficientes! Precisa de ${custoBase} Mad/Ped e ${custoFerro} Ferro.`);
    }
}

function aplicarBonusVila() {
    switch (vila.nivel) {
        case 2:
            heroi.vidaMaxima += 10;
            heroi.vida = heroi.vidaMaxima;
            log("🏠 A vila evoluiu! Vida máxima aumentou.");
            break;

        case 3:
            heroi.ataque += 2;
            log("⚔️ A vila evoluiu! Ataque aumentado.");
            break;

        case 4:
            vila.descontoLoja = 5;
            log("🛒 A loja agora oferece descontos.");
            break;

    }

    atualizarUI();
}

function coletar(recurso) {
    if (!gastarEnergia(1)) return;
    let qtd = 1 + Math.floor(vila.nivel / 2);
    if (recurso === 'madeira') vila.madeira += qtd;
    else if (recurso === 'pedra') vila.pedra += qtd;
    else if (recurso === 'ferro') vila.ferro += qtd;

    log(`+${qtd} ${recurso.charAt(0).toUpperCase() + recurso.slice(1)}`);
    atualizarTela();
}

function dormir() {
    if (dia >= 10) {
        log("<b style='color:red'>⚠️ O CHEFE FINAL CHEGOU! NÃO HÁ TEMPO PARA DORMIR!</b>");
        return;
    }
    dia++;
    energiaAtual = energiaMaxima;
    heroi.vida = heroi.vidaMaxima;
    log(`💤 <b>Dia ${dia}</b> começou. Vida e energia restaurado.`);
    if (dia === 10) log("<b style='color:red'>👹 O CHEFE FINAL ESTÁ ATACANDO A VILA!</b>");

    atualizarTela();
    salvarProgresso();
}

// --- UI E LOG ---
function atualizarTela() {
    const elementos = {
        'vida': heroi.vida,
        'vida-maxima': heroi.vidaMaxima,
        'energia-atual': energiaAtual,
        'energia-maxima': energiaMaxima,
        'madeira': vila.madeira,
        'pedra': vila.pedra,
        'ferro': vila.ferro,
        'nivel-vila': vila.nivel,
        'dia-atual': dia,
        'dinheiro': heroi.dinheiro,
        'atk': heroi.ataque,
        'def': heroi.defesa,
        'prox-nivel': vila.nivel + 1,
        'custo-madeira': vila.nivel * 10,
        'custo-pedra': vila.nivel * 10,
        'custo-ferro': vila.nivel * 5
    };

    for (let id in elementos) {
        let el = document.getElementById(id);
        if (el) el.textContent = elementos[id];
    }
}

function log(msg) {
    const logDiv = document.getElementById('log');
    if (!logDiv) return;
    logDiv.innerHTML += `<p>${msg}</p>`;
    // Mantém o scroll no final para ver as mensagens novas
    logDiv.scrollTop = logDiv.scrollHeight;
}