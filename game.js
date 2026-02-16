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
    codigosResgatados: {},
    armadura: {
        boots: false,
        legs: false,
        chest: false,
        helmet: false
    },
    comprouHoje: false,
};
heroi.equipamento = {
    espada: false,
    escudo: false
};

const precosArmadura = {
    boots: 10,   // Preço das Botas
    legs: 25,   // Preço das Calças
    chest: 50,  // Preço do Peitoral
    helmet: 75  // Preço do Capacete
};

heroi.pedras = 0;
heroi.galhos = 0;

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

let idiomaAtual = 'pt'; // 'pt' ou 'en'
const idiomaSalvo = localStorage.getItem('idioma_preferido');
if (idiomaSalvo) {
    idiomaAtual = idiomaSalvo;
    // Aguarda o DOM carregar para traduzir o menu
    window.addEventListener('DOMContentLoaded', atualizarTextosHTML);
}

const TEXTOS = {
    pt: {
        // ENERGIA
        energiaBaixa: "😴 Você está sem energia, precisa dormir.",
        semEnergiaAcao: "⚠️ Energia insuficiente.",

        // COLETA
        coletouPedra: "🪨 Pedra coletada.",
        coletouGalho: "🌿 Galho coletado.",

        // COMBATE
        semArma: "⚠️ Você precisa de uma arma para lutar!",
        venceuMonstro: "🏆 Você venceu o monstro!",
        foiDerrotado: "☠️ Você foi derrotado...",
        escapouFerido: "🩸 Você escapou com vida...",

        // INTERAÇÕES (Phaser texto de ação)
        falarFerreiro: "🔨 Falar com o Ferreiro",
        abrirJornal: "📰 Ler Jornal",
        dormir: "💤 Dormir",
        loja: "🛒 Loja",
        lutar: "⚔️ Lutar",
        templo: "⛩️ Rezar no Templo",
        mercadoNegro: "🕶️ Mercado Negro",
        coletar: "Coletar recurso",

        // FERREIRO
        ferreiroTitulo: "🔨 Ferreiro da Vila",
        ferreiroSemMaterial: "❌ Materiais insuficientes.",
        ferreiroEspadaPronta: "⚔️ Espada criada!",
        ferreiroEscudoPronto: "🛡️ Escudo criado!",
        ferreiroJaTemEspada: "Você já possui uma espada.",
        ferreiroJaTemEscudo: "Você já possui um escudo.",

        // LOJA
        lojaTitulo: "🛒 Loja da Vila",
        dinheiroInsuficiente: "💰 Dinheiro insuficiente.",
        comprouItem: "✅ Item comprado!",

        // MERCADO NEGRO
        mercadoNegroTitulo: "🕶️ Mercado Negro",
        itemJaPossui: "Você já possui este item.",

        // TEMPLO
        temploTitulo: "⛩️ Templo Antigo",
        temploVidaTroca: "Você sente sua vida enfraquecer em troca de poder...",
        temploSemVida: "Vida insuficiente para o ritual.",

        //bruxa
        bruxa_titulo: "🧙‍♀️ Uma Presença Misteriosa...",
        bruxa_linha1: "Você não deveria estar aqui...",
        bruxa_linha2: "O poder tem um preço... e você ainda vai descobrir qual é.",
        bruxa_linha3: "Ele também queria ser um herói...",
        bruxa_linha4: "Cuidado com os caminhos que escolhe trilhar.",
        bruxa_sumiu: "A bruxa desaparece na névoa...",

        // JORNAL
        jornalTitulo: "📰 Jornal da Vila",
        jornalSemEdicao: "Nenhum jornal foi entregue hoje...",
        jornalFechar: "Fechar Jornal",

        jornais: {
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
            },
            10: { // Dia do Boss ou Fim
                titulo: "O Entregador Sumiu",
                texto: [
                    "O entregador de jornais não apareceu hoje.",
                    "Dizem que ele fugiu ou foi pego.",
                    "O silêncio na vila é ensurdecedor.",
                    "Prepare-se."
                ]
            }
        },

        // TUTORIAL
        tutorialTitulo: "📖 Tutorial",
        tutorialFechar: "Fechar",

        // MENU
        novoJogo: "Novo Jogo",
        continuar: "Continuar",
        idiomaAlteradoPT: "Idioma alterado para Português",
        idiomaAlteradoEN: "Language changed to English",
        titulo_jogo: "O Último Herói Origens",
        btn_jogar: "Jogar / Carregar Jogo",
        btn_finais: "🏆 Galeria de Finais",
        btn_creditos: "Créditos",
        btn_idioma: "🌍 Language",
        placeholder_codigo: "Inserir código...",
        btn_resgatar: "Resgatar",
        label_volume: "🔊 Volume",
        titulo_status: "📊 Status",
        label_dia: "📅 Dia:",
        label_nome: "Nome:",
        label_vida: "Vida:",
        label_ouro: "Ouro:",
        btn_tutorial: "📖 Tutorial",
        titulo_vila: "🏠 Vila",
        label_nivel: "Nível:",
        btn_salvar: "💾 Salvar e Sair",
        btn_inventario: "Inventário",
        label_madeira: "Madeira:",
        label_pedra: "Pedra:",
        label_ferro: "Ferro:",

        // --- ADICIONE ISTO: AÇÕES DO PHASER (CenaVila) ---
        acao_madeira: "🌲 Pegar MADEIRA",
        acao_minerar: "⛏️ Minerar PEDRA e FERRO",
        acao_mercado: "🕶️ Mercado Negro",
        acao_caverna: "⚔️ Explorar Caverna",
        acao_melhorar: "🏠 Melhorar VILA",
        acao_dormir: "💤 Dormir",
        acao_loja: "🛒 Entrar na loja",
        acao_jornal: "📰 Ler Jornal",
        acao_templo: "⛩️ Entrar no Templo",
        acao_ferreiro: "🔨 Falar com o Ferreiro",
        pressione_espaco: "Pressione ESPAÇO para {acao}", // Importante!

        // --- ADICIONE ISTO: TEXTOS DE LOG FALTANTES ---
        viagem_vila: "🌍 Você viajou para: VILA",
        viagem_floresta: "🌍 Você viajou para: FLORESTA",
        viagem_caverna: "🌍 Você viajou para: CAVERNA",
        recursos_insuficientes: "❌ Recursos insuficientes!",
        btn_fechar: "❌ Fechar",
        ouro_insuficiente: "❌ Ouro insuficiente.",
        pocao_comprada: "🧪 Poção comprada.",
        dia_iniciado: "💤 Dia {dia} começou. Vida e energia restauradas.",
        chefe_final_aviso: "👹 O CHEFE FINAL ESTÁ ATACANDO A VILA!",
        melhoria_sem_recursos: "❌ Recursos insuficientes! Precisa de {madeira} Madeira/Pedra e {ferro} Ferro.",
        subiuNivel: "🎉 Você subiu para o Nível {nivel}!",
        pecaI: "peça",

        label_energia: "⚡ Energia:",
        titulo_slots: "Escolha um Slot",
        vazio: "Vazio",
        btn_voltar: "Voltar",
        diario: "📜 Diário",
        bem_vindo: "Bem-vindo de volta! Use as setas para andar e Espaço para interagir.",
        viajouPara: "🌍 Você viajou para: {lugar}",
        dicaMovimento: "Bem-vindo de volta! Use as setas para andar e Espaço para interagir.",

        // Itens
        item_pedra: "Pedra",
        item_galho: "Graveto",
        coletouItem: "Você coletou {item}.",
        item_madeira: "Madeira",
        item_pedra: "Pedra",
        item_ferro: "Ferro",

        // Finais e Avisos
        boss_desperta: "🔥 A Criatura Original desperta...",
        boss_derrota: "☠️ Você caiu diante da Criatura Original...",
        boss_criador: "♾️ Você se torna o novo Criador.",
        final_ruim: "🌑 FINAL RUIM REGISTRADO!",
        jogo_acabou: "⛔ O jogo acabou. Inicie um novo Slot.",
        energia_estranha: "🖤 Uma energia estranha pulsa dentro de você...",
        bruxa_some: "🧙‍♀️ A bruxa desaparece, como se já soubesse o desfecho.",
        mudanca_interna: "⚠️ Algo dentro de você mudou.",

        slot_titulo: "💾 Selecione um Slot",
        slot_vazio: "Vazio",
        slot_dia: "Dia {dia}",
        slot_ouro: "Ouro: {ouro}",
        slot_nivel: "Nível da Vila {nivel}",
        btn_apagar: "Apagar",

        //---- finais
        final_bom_on: "🌟 Final Bom: Desbloqueado!",
        final_bom_off: "🔒 Final Bom: Bloqueado",
        final_ruim_on: "💀 Final Ruim: Desbloqueado!",
        final_ruim_off: "🔒 Final Ruim: Bloqueado",

        /* INVENTÁRIO NOVO */
        inventarioTitulo: "🎒 Inventário",
        inventarioVazio: "Inventário vazio.",
        armasTitulo: "⚔️ Armas:",
        escudosTitulo: "🛡️ Escudos:",
        espadaComum: "Espada Comum",
        escudoComum: "Escudo Comum",
        jaTemEspada: "⚔️ Você já possui uma espada equipada.",
        espadaComprada: "⚔️ Espada de Aço comprada! (+5 Ataque)",

        //vendedor

        vendedorArmadura: "Ferreiro da Caverna",
        comprarArmadura: "Comprar Peça de Armadura",
        jaComprouHoje: "O ferreiro está minerando... Volte amanhã para novas peças.",
        armaduraAdquirida: "Você adquiriu: ",
        inventarioTitulo: "--- INVENTÁRIO (TAB) ---",
        statsAtaque: "Ataque",
        statsDefesa: "Defesa",
        statsVida: "Vida",
        pecasNome: {
            boots: "Botas (+Velocidade)",
            legs: "Calças (+5 Defesa)",
            chest: "Peitoral (+20 Vida)",
            helmet: "Capacete (+5 Ataque)"
        },

        /* TEMPLO EXPANDIDO */
        temploFrase: "Vida é poder. Poder é sacrifício.",
        temploAtk: "Sacrificar 5 VIDA → +2 ATQ",
        temploDef: "Sacrificar 5 VIDA → +2 DEF",
        temploAtkOk: "🔥 Seu ataque aumentou!",
        temploDefOk: "🛡️ Sua defesa aumentou!",
        temploVidaInsuficiente: "❌ Vida insuficiente para o ritual.",

        /* MERCADO NEGRO EXPANDIDO */
        mercadoItemComprado: "🕶️ Item do mercado negro comprado!",
        mercadoSemOuro: "❌ Ouro insuficiente no mercado negro.",
        mercadoJaPossui: "⚠️ Você já possui esse item do mercado negro.",

        /* FINAIS DETALHADOS */
        finalBom1: "🌟 A Criatura Original foi derrotada.",
        finalBom2: "👑 Você quebrou o ciclo.",
        finalBom3: "✨ FINAL BOM REGISTRADO!",
        finalRuim1: "☠️ Você caiu diante do poder proibido...",
        finalRuim2: "🧪 A bruxa observa enquanto você perde sua humanidade.",
        finalRuim3: "💀 FINAL RUIM REGISTRADO!",

        /* SONO AVISOS NOVOS */
        chefeChegouDormir: "⚠️ O CHEFE FINAL CHEGOU! NÃO HÁ TEMPO PARA DORMIR!",
        chefeAtacando: "👹 O CHEFE FINAL ESTÁ ATACANDO A VILA!",

        // Mensagens adicionais
        espadaAmaldicoada_possui: "⚠️ Você já possui a Espada Amaldiçoada.",
        escudoRachado_possui: "⚠️ Você já possui o Escudo Rachado.",
        bem_vindo: "Bem-vindo de volta! Use as setas para andar e Espaço para interagir.",
        energia_estranha_msg: "🖤 Uma energia estranha pulsa dentro de você...",
        bruxa_desaparece_msg: "🧙‍♀️ A bruxa desaparece, como se já soubesse o desfecho.",
        mudanca_interna_msg: "⚠️ Algo dentro de você mudou.",
        energia_dormir: "😴 Você está sem energia. Precisa dormir.",
        ouro_insuf_espada: "❌ Ouro insuficiente para comprar a espada.",
        ja_tem_escudo: "🛡️ Você já possui um escudo.",
        ouro_insuf_escudo: "❌ Ouro insuficiente para comprar o escudo.",
        escudo_comprado: "🛡️ Escudo comprado! Defesa aumentada.",
        criatura_desperta: "🔥 A Criatura Original desperta...",
        destino_selado: "⛔ Seu destino já foi selado.",
        sem_batalhas: "🌑 Não há mais batalhas.",
        jogo_acabou_slot: "⛔ O jogo acabou. Inicie um novo Slot para buscar o outro caminho.",
        destino_ja_selado: "⛔ O destino já foi selado.",
        ouro_insuficiente_geral: "❌ Ouro insuficiente.",

        // Mais traduções
        ganhou_exp: "⭐ +{qtd} EXP",
        dinheiro_insuficiente_mercado: "❌ Dinheiro insuficiente.",
        compra_mercado_negro: "🕶️ Compra realizada no mercado negro...",
        templo_forca: "🗡️ Você sente sua força crescer...",
        templo_resistencia: "🛡️ Sua pele se torna mais resistente...",
        pocao_comprada_preco: "🧪 Poção comprada por {preco} ouro.",
        vila_evoluida_nivel: "🎉 Vila evoluída para o Nível {nivel}!",
        vilaVidaUp: "🏠 Alojamentos melhorados: +10 Vida Máxima!",
        vilaAtaqueUp: "⚔️ Campo de Treino construído: +2 Ataque!",
        vilaDesconto: "💰 Rotas comerciais abertas: Desconto de 5 ouro na Loja!",
        ferreiro_custo: "💰 Custo: {valor} ouro",
        dia_comecou: "💤 Dia {dia} começou. Vida e energia restaurado.",
        lojaEntrou: "🛒 Você entrou na loja.",
        lojaSaiu: "👋 Você saiu da loja.",

        //----- monstros

        inimigo_slime: "Slime Corrompido",
        inimigo_lobo: "Lobo Sombrio",
        inimigo_espirito: "Espírito Perdido",
        inimigo_guerreiro: "Guerreiro Amaldiçoado",
        inimigo_aranha: "Aranha Gigante",
        monstroApareceu: "⚔️ Um {nome} apareceu!",

        // Itens do Mercado Negro
        mercado_espada_nome: "🗡️ Espada Amaldiçoada",
        mercado_espada_desc: "+5 ATQ",
        mercado_escudo_nome: "🛡️ Escudo Rachado",
        mercado_escudo_desc: "+5 DEF",
        mercado_elixir_nome: "🧪 Elixir Proibido",
        mercado_elixir_desc: "+10 VIDA MÁX",

        // cenarios

        local_vila: "Vila",
        local_floresta: "Floresta",
        local_caverna: "Caverna",

        //---tutorial

        tutorialTitulo: "📖 Tutorial",
        tutorialFechar: "Fechar",
        tut_sobre_titulo: "📖 Sobre o Mundo",
        tut_sobre_texto1: "Sua vila era um lugar pacífico… até monstros começarem a surgir das florestas e cavernas.",
        tut_sobre_texto2: "Os moradores vivem com medo. Você é um dos poucos que ainda tem coragem de sair e enfrentar o desconhecido.",
        tut_energia_titulo: "⚡ Energia",
        tut_energia_texto1: "Você tem 10 de energia por dia.",
        tut_energia_texto2: "Cada ação consome energia (lutar, coletar, explorar).",
        tut_energia_texto3: "Quando acaba, você precisa dormir na vila.",
        tut_energia_texto4: "Escolha bem suas ações.",
        tut_recursos_titulo: "🪨 Recursos",
        tut_recursos_texto1: "Pedras e galhos podem ser coletados pelo mapa.",
        tut_recursos_texto2: "Leve-os ao ferreiro para criar seus primeiros equipamentos.",
        tut_combate_titulo: "⚔️ Combate",
        tut_combate_texto1: "Sem arma você não consegue lutar.",
        tut_combate_texto2: "Fique mais forte para enfrentar criaturas cada vez mais perigosas.",
        tut_jornal_titulo: "📰 Jornal",
        tut_jornal_texto1: "Todo dia o jornal traz notícias sobre o avanço dos monstros.",
        tut_jornal_texto2: "O mundo está mudando… e suas escolhas podem definir o destino de todos.",

        // --- FERREIRO (Adicione isto) ---
        ferreiroTitulo: "⚒️ Ferreiro",
        ferreiroCriarEspadaBase: "Criar Espada de Madeira (2 Galhos + 1 Pedra)",
        ferreiroCriarEscudoBase: "Criar Escudo de Madeira (2 Galhos + 1 Pedra)",
        item_pedra: "Pedra",
        item_galho: "Galho",

        // --- LOJA (Adicione isto) ---
        loja_titulo: "🛒 Loja",
        loja_item_pocao: "🧪 Poção (cura 30) – 20 ouro",
        loja_item_espada: "⚔️ Espada (+5 ATQ) – 50 ouro",
        loja_item_escudo: "🛡️ Escudo (+3 DEF) – 40 ouro",
        btn_sair_loja: "❌ Sair da loja",

        // Garantir que botões comuns existam
        btn_fechar: "Fechar",
    },

    en: {
        // ENERGY
        energiaBaixa: "😴 You are out of energy, you need to sleep.",
        semEnergiaAcao: "⚠️ Not enough energy.",

        // GATHERING
        coletouPedra: "🪨 Stone collected.",
        coletouGalho: "🌿 Stick collected.",

        // COMBAT
        semArma: "⚠️ You need a weapon to fight!",
        venceuMonstro: "🏆 You defeated the monster!",
        foiDerrotado: "☠️ You were defeated...",
        escapouFerido: "🩸 You barely escaped with your life...",

        // INTERACTIONS
        falarFerreiro: "🔨 Talk to the Blacksmith",
        abrirJornal: "📰 Read Newspaper",
        dormir: "💤 Sleep",
        loja: "🛒 Shop",
        lutar: "⚔️ Fight",
        templo: "⛩️ Pray at the Temple",
        mercadoNegro: "🕶️ Black Market",
        coletar: "Gather resource",

        // BLACKSMITH
        ferreiroTitulo: "🔨 Village Blacksmith",
        ferreiroSemMaterial: "❌ Not enough materials.",
        ferreiroEspadaPronta: "⚔️ Sword crafted!",
        ferreiroEscudoPronto: "🛡️ Shield crafted!",
        ferreiroJaTemEspada: "You already have a sword.",
        ferreiroJaTemEscudo: "You already have a shield.",
        jaTemEspada: "⚔️ You already have a sword equipped.",
        espadaComprada: "⚔️ Steel Sword purchased! (+5 Attack)",

        // SHOP
        lojaTitulo: "🛒 Village Shop",
        dinheiroInsuficiente: "💰 Not enough money.",
        comprouItem: "✅ Item purchased!",

        // BLACK MARKET
        mercadoNegroTitulo: "🕶️ Black Market",
        itemJaPossui: "You already own this item.",

        // TEMPLE
        temploTitulo: "⛩️ Ancient Temple",
        temploVidaTroca: "You feel your life fading in exchange for power...",
        temploSemVida: "Not enough life for the ritual.",

        coletouItem: "You collected {item}.",
        item_pedra: "Stone",
        item_galho: "Stick",

        //WITCH
        bruxa_titulo: "🧙‍♀️ A Mysterious Presence...",
        bruxa_linha1: "You shouldn't be here...",
        bruxa_linha2: "Power has a price... and you will learn it soon.",
        bruxa_linha3: "He also wanted to be a hero...",
        bruxa_linha4: "Be careful with the paths you choose to walk.",
        bruxa_sumiu: "The witch vanishes into the mist...",

        // NEWSPAPER
        jornalTitulo: "📰 Village Newspaper",
        jornalSemEdicao: "No newspaper was delivered today...",
        jornalFechar: "Close Newspaper",

        jornais: {
            1: {
                titulo: "Quiet Day in the Village",
                texto: [
                    "The village woke up in peace.",
                    "Villagers follow their routines normally.",
                    "Nothing strange was reported.",
                    "Come back tomorrow for more news."
                ]
            },
            2: {
                titulo: "Strange Sounds in the Forest",
                texto: [
                    "Some villagers reported noises during the night.",
                    "The forest seems quieter than usual.",
                    "Authorities say there is no cause for panic.",
                    "Come back tomorrow for more news."
                ]
            },
            3: {
                titulo: "First Signs of Danger",
                texto: [
                    "Animals were found wounded near the village.",
                    "Villagers avoid going out after dark.",
                    "Fear begins to spread.",
                    "Come back tomorrow for more news."
                ]
            },
            4: {
                titulo: "Villagers Take Cover",
                texto: [
                    "Houses remain closed during the night.",
                    "Shops are closing earlier.",
                    "The village is no longer the same.",
                    "Come back tomorrow for more news."
                ]
            },
            5: {
                titulo: "Creatures Lurking",
                texto: [
                    "Reports confirm the presence of monsters.",
                    "Some villagers have disappeared.",
                    "Hope begins to fade.",
                    "Come back tomorrow for more news."
                ]
            },
            6: {
                titulo: "Fear Takes Over",
                texto: [
                    "Villagers avoid leaving home after sunset.",
                    "Screams were heard from the forest at dawn.",
                    "Some families are considering leaving the village.",
                    "Come back tomorrow for more news."
                ]
            },
            7: {
                titulo: "Disappearances Confirmed",
                texto: [
                    "Three hunters did not return from an expedition.",
                    "Monstrous footprints were seen near houses.",
                    "Tension grows among the residents.",
                    "Come back tomorrow for more news."
                ]
            },
            8: {
                titulo: "Darkness Approaches",
                texto: [
                    "Reports indicate creatures prowling the village at night.",
                    "Doors remain locked at all times now.",
                    "No one feels safe, even inside their homes.",
                    "Come back tomorrow for more news."
                ]
            },
            9: {
                titulo: "Final Warning",
                texto: [
                    "The village bells rang during the dawn.",
                    "Something huge was seen on the nearby hills.",
                    "The villagers pray for a miracle.",
                    "Come back tomorrow for more news."
                ]
            },
            10: {
                titulo: "The Carrier vanished",
                texto: [
                    "The newspaper carrier did not show up today.",
                    "They say he fled or was taken.",
                    "The silence in the village is deafening.",
                    "Prepare yourself."
                ]
            }
        },

        // TUTORIAL
        tutorialTitulo: "📖 Tutorial",
        tutorialFechar: "Close",

        // MENU
        novoJogo: "New Game",
        continuar: "Continue",
        idiomaAlteradoPT: "Idioma alterado para Português",
        idiomaAlteradoEN: "Language changed to English",

        titulo_jogo: "The Last Hero Origins",
        btn_jogar: "Play / Load Game",
        btn_finais: "🏆 Endings Gallery",
        btn_creditos: "Credits",
        btn_idioma: "🌍 Idioma",
        placeholder_codigo: "Enter code...",
        btn_resgatar: "Redeem",
        label_volume: "🔊 Volume",
        titulo_status: "📊 Stats",
        label_dia: "📅 Day:",
        label_nome: "Name:",
        label_vida: "HP:",
        label_ouro: "Gold:",
        btn_tutorial: "📖 Tutorial",
        titulo_vila: "🏠 Village",
        label_nivel: "Level:",
        btn_salvar: "💾 Save & Quit",
        btn_inventario: "Inventory",
        label_madeira: "Wood:",
        label_pedra: "Stone:",
        label_ferro: "Iron:",

        // --- TRANSLATION: PHASER ACTIONS ---
        acao_madeira: "🌲 Gather WOOD",
        acao_minerar: "⛏️ Mine STONE and IRON",
        acao_mercado: "🕶️ Black Market",
        acao_caverna: "⚔️ Explore Cave",
        acao_melhorar: "🏠 Upgrade VILLAGE",
        acao_dormir: "💤 Sleep",
        acao_loja: "🛒 Enter Shop",
        acao_jornal: "📰 Read Newspaper",
        acao_templo: "⛩️ Enter Temple",
        acao_ferreiro: "🔨 Talk to Blacksmith",
        pressione_espaco: "Press SPACE to {acao}",

        // --- TRANSLATION: LOGS ---
        viagem_vila: "🌍 You traveled to: VILLAGE",
        viagem_floresta: "🌍 You traveled to: FOREST",
        viagem_caverna: "🌍 You traveled to: CAVE",
        recursos_insuficientes: "❌ Not enough resources!",
        btn_fechar: "❌ Close",
        ouro_insuficiente: "❌ Not enough gold.",
        pocao_comprada: "🧪 Potion purchased.",
        dia_iniciado: "💤 Day {dia} started. HP and Energy restored.",
        chefe_final_aviso: "👹 THE FINAL BOSS IS ATTACKING THE VILLAGE!",
        melhoria_sem_recursos: "❌ Not enough resources! Requires {madeira} Wood/Stone and {ferro} Iron.",
        subiuNivel: "🎉 Level Up! You reached Level {nivel}!",

        label_energia: "⚡ Energy:",
        titulo_slots: "Select a Slot",
        vazio: "Empty",
        btn_voltar: "Back",
        diario: "📜 Journal",
        bem_vindo: "Welcome back! Use arrows to move and Space to interact.",
        viajouPara: "🌍 You traveled to: {lugar}",
        dicaMovimento: "Welcome back! Use arrow keys to move and Space to interact.",

        // Items
        item_pedra: "Stone",
        item_galho: "Stick",
        coletouItem: "You collected {item}.",
        item_madeira: "Wood",
        item_pedra: "Stone",
        item_ferro: "Iron",

        // Endings
        boss_desperta: "🔥 The Original Creature awakens...",
        boss_derrota: "☠️ You fell before the Original Creature...",
        boss_criador: "♾️ You become the new Creator.",
        final_ruim: "🌑 BAD ENDING REGISTERED!",
        jogo_acabou: "⛔ Game Over. Start a new slot.",
        energia_estranha: "🖤 A strange energy pulses inside you...",
        bruxa_some: "🧙‍♀️ The witch disappears, as if she already knew.",
        mudanca_interna: "⚠️ Something inside you has changed.",

        slot_titulo: "💾 Select a Slot",
        slot_vazio: "Empty",
        slot_dia: "Day {dia}",
        slot_ouro: "Gold: {ouro}",
        slot_nivel: "Village Level {nivel}",
        btn_jogar: "Play",
        btn_apagar: "Delete",
        btn_voltar: "Back",

        //---- finals
        final_bom_on: "🌟 Good Ending: Unlocked!",
        final_bom_off: "🔒 Good Ending: Locked",
        final_ruim_on: "💀 Bad Ending: Unlocked!",
        final_ruim_off: "🔒 Bad Ending: Locked",

        /* INVENTORY */
        inventarioTitulo: "🎒 Inventory",
        inventarioVazio: "Inventory empty.",
        armasTitulo: "⚔️ Weapons:",
        escudosTitulo: "🛡️ Shields:",
        espadaComum: "Common Sword",
        escudoComum: "Common Shield",

        //-seller

        vendedorArmadura: "Cave Smith",
        comprarArmadura: "Buy Armor Piece",
        jaComprouHoje: "The smith is mining... Come back tomorrow for new pieces.",
        armaduraAdquirida: "You acquired: ",
        inventarioTitulo: "--- INVENTORY (TAB) ---",
        statsAtaque: "Attack",
        statsDefesa: "Defense",
        statsVida: "Health",
        pecasNome: {
            boots: "Boots (+Speed)",
            legs: "Leggings (+5 Defense)",
            chest: "Chestplate (+20 Health)",
            helmet: "Helmet (+5 Attack)"
        },

        /* TEMPLE EXPANDED */
        temploFrase: "Life is power. Power demands sacrifice.",
        temploAtk: "Sacrifice 5 HP → +2 ATK",
        temploDef: "Sacrifice 5 HP → +2 DEF",
        temploAtkOk: "🔥 Your attack increased!",
        temploDefOk: "🛡️ Your defense increased!",
        temploVidaInsuficiente: "❌ Not enough HP for the ritual.",

        /* BLACK MARKET EXPANDED */
        mercadoItemComprado: "🕶️ Black market item purchased!",
        mercadoSemOuro: "❌ Not enough gold in the black market.",
        mercadoJaPossui: "⚠️ You already own this black market item.",

        /* ENDINGS DETAILED */
        finalBom1: "🌟 The Original Creature was defeated.",
        finalBom2: "👑 You broke the cycle.",
        finalBom3: "✨ GOOD ENDING RECORDED!",
        finalRuim1: "☠️ You fell to forbidden power...",
        finalRuim2: "🧪 The witch watches as you lose your humanity.",
        finalRuim3: "💀 BAD ENDING RECORDED!",

        /* SLEEP WARNINGS */
        chefeChegouDormir: "⚠️ THE FINAL BOSS HAS ARRIVED! NO TIME TO SLEEP!",
        chefeAtacando: "👹 THE FINAL BOSS IS ATTACKING THE VILLAGE!",

        // Additional messages
        espadaAmaldicoada_possui: "⚠️ You already own the Cursed Sword.",
        escudoRachado_possui: "⚠️ You already own the Cracked Shield.",
        bem_vindo: "Welcome back! Use arrows to move and Space to interact.",
        energia_estranha_msg: "🖤 A strange energy pulses inside you...",
        bruxa_desaparece_msg: "🧙‍♀️ The witch disappears, as if she already knew the outcome.",
        mudanca_interna_msg: "⚠️ Something inside you has changed.",
        energia_dormir: "😴 You are out of energy. Need to sleep.",
        ouro_insuf_espada: "❌ Not enough gold to buy the sword.",
        ja_tem_escudo: "🛡️ You already have a shield.",
        ouro_insuf_escudo: "❌ Not enough gold to buy the shield.",
        escudo_comprado: "🛡️ Shield purchased! Defense increased.",
        criatura_desperta: "🔥 The Original Creature awakens...",
        destino_selado: "⛔ Your fate has been sealed.",
        sem_batalhas: "🌑 There are no more battles.",
        jogo_acabou_slot: "⛔ Game over. Start a new Slot to seek the other path.",
        destino_ja_selado: "⛔ Your fate is already sealed.",
        ouro_insuficiente_geral: "❌ Not enough gold.",
        ganhou_exp: "⭐ +{qtd} EXP",

        // More translations
        dinheiro_insuficiente_mercado: "❌ Not enough money.",
        compra_mercado_negro: "🕶️ Black market purchase completed...",
        templo_forca: "🗡️ You feel your strength growing...",
        templo_resistencia: "🛡️ Your skin becomes more resistant...",
        pocao_comprada_preco: "🧪 Potion purchased for {preco} gold.",
        vila_evoluida_nivel: "🎉 Village upgraded to Level {nivel}!",
        vilaVidaUp: "🏠 Housing improved: +10 Max HP!",
        vilaAtaqueUp: "⚔️ Training Field built: +2 Attack!",
        vilaDesconto: "💰 Trade routes opened: 5 gold discount in Shop!",
        ferreiro_custo: "💰 Cost: {valor} gold",
        dia_comecou: "💤 Day {dia} started. HP and energy restored.",
        lojaEntrou: "🛒 You entered the shop.",
        lojaSaiu: "👋 You left the shop.",
        pecaI: 'piece',

        //- monsters 

        inimigo_slime: "Corrupted Slime",
        inimigo_lobo: "Shadow Wolf",
        inimigo_espirito: "Lost Spirit",
        inimigo_guerreiro: "Cursed Warrior",
        inimigo_aranha: "Giant Spider",
        monstroApareceu: "⚔️ A wild {nome} appeared!",

        // Black Market Items
        mercado_espada_nome: "🗡️ Cursed Sword",
        mercado_espada_desc: "+5 ATK",
        mercado_escudo_nome: "🛡️ Cracked Shield",
        mercado_escudo_desc: "+5 DEF",
        mercado_elixir_nome: "🧪 Forbidden Elixir",
        mercado_elixir_desc: "+10 MAX HP",

        local_vila: "Village",
        local_floresta: "Forest",
        local_caverna: "Cave",

        //-----tutorial

        tutorialTitulo: "📖 Tutorial",
        tutorialFechar: "Close",
        tut_sobre_titulo: "📖 About the World",
        tut_sobre_texto1: "Your village was a peaceful place... until monsters began to emerge from the forests and caves.",
        tut_sobre_texto2: "The villagers live in fear. You are one of the few who still has the courage to go out and face the unknown.",
        tut_energia_titulo: "⚡ Energy",
        tut_energia_texto1: "You have 10 energy per day.",
        tut_energia_texto2: "Every action consumes energy (fighting, gathering, exploring).",
        tut_energia_texto3: "When it runs out, you need to sleep in the village.",
        tut_energia_texto4: "Choose your actions wisely.",
        tut_recursos_titulo: "🪨 Resources",
        tut_recursos_texto1: "Stones and branches can be collected around the map.",
        tut_recursos_texto2: "Take them to the blacksmith to craft your first equipment.",
        tut_combate_titulo: "⚔️ Combat",
        tut_combate_texto1: "Without a weapon, you cannot fight.",
        tut_combate_texto2: "Get stronger to face increasingly dangerous creatures.",
        tut_jornal_titulo: "📰 Newspaper",
        tut_jornal_texto1: "Every day the newspaper brings news about the progress of the monsters.",
        tut_jornal_texto2: "The world is changing… and your choices can define everyone's fate.",

        // --- BLACKSMITH (Adicione isto) ---
        ferreiroTitulo: "⚒️ Blacksmith",
        ferreiroCriarEspadaBase: "Craft Wooden Sword (2 Branches + 1 Stone)",
        ferreiroCriarEscudoBase: "Craft Wooden Shield (2 Branches + 1 Stone)",
        item_pedra: "Stone",
        item_galho: "Branch",

        // --- SHOP (Adicione isto) ---
        loja_titulo: "🛒 Shop",
        loja_item_pocao: "🧪 Potion (heals 30) – 20 gold",
        loja_item_espada: "⚔️ Sword (+5 ATK) – 50 gold",
        loja_item_escudo: "🛡️ Shield (+3 DEF) – 40 gold",
        btn_sair_loja: "❌ Leave Shop",

        // Garantir que botões comuns existam
        btn_fechar: "Close",

    }
};

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
        getNome: () => t("mercado_espada_nome"),
        getDescricao: () => t("mercado_espada_desc"),
        preco: 50,
        comprar() {

            if (heroi.espadaBlack) {
                log(t("espadaAmaldicoada_possui"));
                return false; // COMPRA CANCELADA
            }

            heroi.ataque += 5;
            heroi.espadaBlack = true;
            return true; // COMPRA OK
        }
    },
    {
        id: 'escudo_rachado',
        getNome: () => t("mercado_escudo_nome"),
        getDescricao: () => t("mercado_escudo_desc"),
        preco: 50,
        comprar() {

            if (heroi.escudoBlack) {
                log(t("escudoRachado_possui"));
                return false; // COMPRA CANCELADA
            }

            heroi.defesa += 5;
            heroi.escudoBlack = true;
            return true; // COMPRA OK
        }
    },
    {
        id: 'elixir_proibido',
        getNome: () => t("mercado_elixir_nome"),
        getDescricao: () => t("mercado_elixir_desc"),
        preco: 40,
        comprar() {
            heroi.vidaMaxima += 10;
            heroi.vida += 10;
            return true;
        }
    }
];

const inimigosBase = [
    {
        nome: "inimigo_slime", // Antes era "Slime Corrompido"
        vida: 12, ataque: 3, defesa: 0, ouro: 4
    },
    {
        nome: "inimigo_lobo", // Antes era "Lobo Sombrio"
        vida: 18, ataque: 5, defesa: 1, ouro: 6
    },
    {
        nome: "inimigo_espirito",
        vida: 10, ataque: 7, defesa: 0, ouro: 7
    },
    {
        nome: "inimigo_guerreiro",
        vida: 25, ataque: 6, defesa: 3, ouro: 10
    },
    {
        nome: "inimigo_aranha",
        vida: 16, ataque: 4, defesa: 2, ouro: 5
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
        if (dados.idioma) idiomaAtual = dados.idioma;
    } else {
        // NOVO JOGO: Mantive exatamente o seu objeto original
        heroi = {
            nome: "Herói", vida: 100, vidaMaxima: 100, dinheiro: 0,
            ataque: 10, defesa: 0, nivel: 1, exp: 0, expProximo: 10,
            equipamento: { espada: false, escudo: false },
            codigosResgatados: {}, // Adicionamos isso para garantir que o objeto exista
            pedras: 0,
            galhos: 0,
            espadaBase: false,
            escudoBase: false,
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
    atualizarTextosHTML();

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
    let idioma = idiomaAtual;
    let dados = { heroi, vila, dia, estadoJogo, energiaAtual, idioma };
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

        if (!infoP) continue;

        if (salvo) {
            let d = JSON.parse(salvo);

            infoP.innerHTML = `
                ${t("slot_nivel", { nivel: d.vila.nivel })} |
                ${t("slot_dia", { dia: d.dia })}
            `;
        } else {
            infoP.innerHTML = t("slot_vazio");
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
            <h3>${t("mercadoNegroTitulo")}</h3>

            ${itensMercadoNegro.map(item => `
                <button class="btn-item" onclick="comprarItemMercadoNegro('${item.id}')">
                    <strong>${item.getNome()}</strong><br>
                    <small>${item.getDescricao()}</small><br>
                    💰 ${item.preco} ouro
                </button>
            `).join('')}

            <button class="btn-fechar" onclick="fecharMenu()">${t("btn_fechar")}</button>
        </div>
    `;
    }

    if (estadoJogo.menuAberto === 'templo') {
        ui.innerHTML = `
        <div class="menu templo">
        <h3>${t("temploTitulo")}</h3>
        <p><em>${t("temploFrase")}</em></p>

        <button onclick="sacrificarVida('ataque')">${t("temploAtk")}</button>
        <button onclick="sacrificarVida('defesa')">${t("temploDef")}</button>

        <button class="btn-fechar" onclick="fecharMenu()">${t("btn_fechar")}</button>
        </div>
    `;
    }
    if (estadoJogo.menuAberto === 'ferreiro') {
        ui.innerHTML = `
        <h3>${t("ferreiroTitulo")}</h3>
        <p>${t("item_pedra")}: ${heroi.pedras} | ${t("item_galho")}: ${heroi.galhos}</p>

        <button onclick="criarEspadaBase()">${t("ferreiroCriarEspadaBase")}</button>
        <button onclick="criarEscudoBase()">${t("ferreiroCriarEscudoBase")}</button>

        <button onclick="fecharMenu()">${t("btn_fechar")}</button>
    `;
    }
    if (estadoJogo.menuAberto === 'bruxa') {
        ui.innerHTML = `
        <div class="menu-bruxa">
            <h2>${t("bruxa_titulo")}</h2>
            <p>${t("bruxa_linha1")}</p>
            <p>${t("bruxa_linha2")}</p>
            <p>${t("bruxa_linha3")}</p>
            <p>${t("bruxa_linha4")}</p>
            <p><em>${t("boss_derrota")}</em></p>
            <button onclick="fecharHistoriaBruxa()">...</button>
        </div>
        `;
    }
}

//-------------- linguagem ----------

function t(chave, vars = {}) {
    let texto = TEXTOS[idiomaAtual][chave] || chave;

    for (let v in vars) {
        texto = texto.replace(`{${v}}`, vars[v]);
    }

    return texto;
}

function atualizarTextosHTML() {
    // Atualiza elementos com data-lang (texto interno)
    document.querySelectorAll('[data-lang]').forEach(el => {
        const chave = el.getAttribute('data-lang');
        el.innerText = t(chave);
    });

    // Atualiza placeholders de inputs
    document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
        const chave = el.getAttribute('data-lang-placeholder');
        el.placeholder = t(chave);
    });

    // Atualiza a UI dinâmica também (status, menus abertos)
    atualizarUI();
}

function trocarIdioma() {
    idiomaAtual = idiomaAtual === 'pt' ? 'en' : 'pt';
    atualizarTextosHTML();
    atualizarInfosSlots();

    // Feedback visual do sistema
    const msg = idiomaAtual === 'pt' ? "Idioma: Português" : "Language: English";
    console.log(`🌍 ${msg}`);
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
            elBom.style.color = "#4c4"; // Verde
        } else {
            elBom.style.color = "#ccc"; // Cinza
        }
    }

    if (elRuim) {
        if (finais.ruim) {
            elRuim.style.color = "#d44"; // Vermelho
        } else {
            elRuim.style.color = "#ccc"; // Cinza
        }
    }
    elBom.textContent = finais.bom ? t("final_bom_on") : t("final_bom_off");
    elRuim.textContent = finais.ruim ? t("final_ruim_on") : t("final_ruim_off");
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
    // 1. Pega os dados do idioma atual (pt ou en)
    const dadosIdioma = TEXTOS[idiomaAtual];

    // 2. Busca o jornal do dia atual. Se não existir (dia > 10), pega o do dia 10 ou um padrão.
    const jornalHoje = dadosIdioma.jornais[dia] || dadosIdioma.jornais[10];

    // 3. Monta o HTML dos parágrafos
    // O .map transforma cada linha de texto em um <p>...</p> e o .join junta tudo
    const htmlTexto = jornalHoje.texto.map(linha => `<p>${linha}</p>`).join("");

    ui.innerHTML = `
        <div class="painel">
            <h2 style="border-bottom: 2px solid #5a3b1a; padding-bottom: 10px; margin-bottom: 15px;">
                ${jornalHoje.titulo}
            </h2>
            <div style="text-align: left; margin-bottom: 20px;">
                ${htmlTexto}
            </div>
            <button onclick="fecharJornal()">${t("jornalFechar")}</button>
        </div>
    `;
}

function fecharJornal() {
    ui.innerHTML = '';  // Limpa o conteúdo do ui
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
    atualizarTextosHTML();
    log(`<b>${t("bem_vindo")}</b>`);
}

function mudarCenario(cenario) {
    cenarioAtual = cenario;
    // Paineis HTML
    document.getElementById('melhorar-vila').style.display = (cenario === 'vila') ? 'block' : 'none';
    document.getElementById('explorar-floresta').style.display = (cenario === 'floresta') ? 'block' : 'none';
    document.getElementById('caverna-acoes').style.display = (cenario === 'caverna') ? 'block' : 'none';

    // CORREÇÃO AQUI: Usa uma chave de tradução baseada no ID do cenário
    // Ex: "local_vila", "local_floresta"
    const nomeLugar = t("local_" + cenario);
    log(t("viajouPara", { lugar: nomeLugar }));

    atualizarTela();
}

//------------- sistema da bruxa --------------------

function fecharHistoriaBruxa() {
    estadoJogo.menuAberto = null;
    morreuParaBossFinal = false;

    heroi.vida = Math.floor(heroi.vidaMaxima * 0.5);

    log(t("energia_estranha_msg"));
    log(t("bruxa_desaparece_msg"));
    log(t("mudanca_interna_msg"));

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

//-------------- energia --------

function gastarEnergia(qtd = 1) {
    if (energiaAtual < qtd) {
        log(t("energia_dormir"));
        return false;
    }

    energiaAtual -= qtd;
    atualizarTela();
    return true;
}

function gastarEnergiaEsp(valor) {
    if (heroi.energia < valor) {
        log(t("energiaBaixa"));
        return false;
    }

    heroi.energia -= valor;
    atualizarUI();
    return true;
}

//------------- ferreiro ----------------

function abrirFerreiro() {
    estadoJogo.menuAberto = 'ferreiro';
    atualizarUI();
}

function criarEspadaBase() {
    if (heroi.espadaBase) {
        log(t("ferreiroJaTemEspada"));
        return;
    }

    if (heroi.pedras >= 2 && heroi.galhos >= 1) {
        heroi.pedras -= 2;
        heroi.galhos -= 1;
        heroi.ataque += 2;
        heroi.espadaBase = true;
        log(t("ferreiroEspadaPronta"));
    } else {
        log(t("ferreiroSemMaterial"));
    }
    atualizarUI();
}

function criarEscudoBase() {
    if (heroi.escudoBase) {
        log(t("ferreiroJaTemEscudo"));
        return;
    }
    if (heroi.pedras >= 1 && heroi.galhos >= 2) {
        heroi.pedras -= 1;
        heroi.galhos -= 2;
        heroi.defesa += 2;
        log(t("ferreiroEscudoPronto"));
    } else {
        log(t("ferreiroSemMaterial"));
    }
    atualizarUI();
}

//------------ exp ----------

function ganharExp(qtd) {
    heroi.exp += qtd;
    log(t("ganhou_exp", { qtd: qtd }));

    if (heroi.exp >= heroi.expProximo) {
        heroi.exp -= heroi.expProximo;
        heroi.nivel++;
        heroi.expProximo = Math.floor(heroi.expProximo * 1.4);

        heroi.vidaMaxima += 10;
        heroi.ataque += 2;
        heroi.defesa += 2;

        log(t("subiuNivel", { nivel: heroi.nivel }));
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
        log(t("dinheiro_insuficiente_mercado"));
        return;
    }

    // Tenta comprar
    const comprou = item.comprar();

    // Se a função comprar() retornou false, não cobra dinheiro
    if (!comprou) return;

    heroi.dinheiro -= item.preco;

    log(t("compra_mercado_negro"));
    atualizarUI();
}

function fecharMenu() {
    estadoJogo.menuAberto = null;
    atualizarUI();
}

function abrirLoja() {
    document.getElementById('loja-menu').style.display = 'block';
    log(t("lojaEntrou"));
}

function fecharLoja() {
    document.getElementById('loja-menu').style.display = 'none';
    log(t("lojaSaiu"));
}

function comprarEspada() {
    if (heroi.equipamento.espada) {
        log(t("jaTemEspada"));
        return;
    }

    if (heroi.dinheiro < 50) {
        log(t("ouro_insuf_espada"));
        return;
    }

    if (!gastarEnergia(1)) return;

    heroi.dinheiro -= 50;
    heroi.ataque += 5;
    heroi.equipamento.espada = true;

    log(t("espadaComprada"));
    atualizarTela();
}

function comprarEscudo() {
    if (heroi.equipamento.escudo) {
        log(t("ja_tem_escudo"));
        return;
    }

    if (heroi.dinheiro < 40) {
        log(t("ouro_insuf_escudo"));
        return;
    }

    if (!gastarEnergia(1)) return;

    heroi.dinheiro -= 40;
    heroi.defesa += 4;
    heroi.equipamento.escudo = true;

    log(t("escudo_comprado"));
    atualizarTela();
}

//--------- inventario -----------

function abrirInventario() {
    const painel = document.getElementById("painel-inventario");
    const conteudo = document.getElementById("conteudo-inventario");

    let html = "";

    html += `<p><b>${t("armasTitulo")}</b><br>`; // Usa a tradução do título
    // Usa t() para traduzir os itens
    html += heroi.equipamento.espada ? `🗡️ ${t("espadaComum")}<br>` : "";
    html += heroi.espadaBlack ? `🗡️ ${t("mercado_espada_nome")}<br>` : "";
    html += "</p>";

    html += `<p><b>${t("escudosTitulo")}</b><br>`;
    html += heroi.equipamento.escudo ? `🛡️ ${t("escudoComum")}<br>` : "";
    html += heroi.escudoBlack ? `🛡️ ${t("mercado_escudo_nome")}<br>` : "";
    html += "</p>";

    if (html.trim() === `<p><b>${t("armasTitulo")}</b><br></p><p><b>${t("escudosTitulo")}</b><br></p>`) {
        html = `<p>${t("inventarioVazio")}</p>`;
    }

    conteudo.innerHTML = html;
    painel.classList.remove("oculto");
}

function fecharInventario() {
    document.getElementById("painel-inventario").classList.add("oculto");
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        toggleInventario();
    }
});

function toggleInventario() {
    const idInv = "painel-inv";
    const existente = document.getElementById(idInv);

    if (existente) {
        existente.remove();
        return;
    }

    const d = TEXTOS[idiomaAtual];
    const div = document.createElement("div");
    div.id = idInv;
    div.className = "painel";
    div.style.border = "2px solid #ffd700"; // Destaque dourado

    let listaArmadura = "";
    const pecas = {
        boots: "👢",
        legs: "👖",
        chest: "🛡️",
        helmet: "🪖"
    };

    for (let chave in heroi.armadura) {
        const tem = heroi.armadura[chave];
        listaArmadura += `
            <div style="margin: 10px; padding: 10px; background: ${tem ? '#2a4d2a' : '#333'}; border-radius: 5px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">${pecas[chave]}</span>
                <span style="color: ${tem ? '#00ff00' : '#888'}">
                    ${d.pecasNome[chave]} ${tem ? ' (Equipado)' : ' (Vazio)'}
                </span>
            </div>
        `;
    }

    div.innerHTML = `
        <div class="painel-conteudo" style="min-width: 300px;">
            <h2 style="font-family: 'Cinzel', serif;">${d.inventarioTitulo}</h2>
            <div style="display: grid; grid-template-columns: 1fr; margin: 20px 0;">
                ${listaArmadura}
            </div>
            <button onclick="this.parentElement.parentElement.remove()">Fechar</button>
        </div>
    `;
    document.body.appendChild(div);
}

//------------ templo ---------------

function abrirTemplo() {

    estadoJogo.menuAberto = 'templo';
    atualizarUI();
}

function sacrificarVida(tipo) {
    if (!gastarEnergia(1)) return;

    if (heroi.vidaMaxima <= 5) {
        log(t("temploSemVida"));
        return;
    }

    heroi.vidaMaxima -= 5;

    if (heroi.vida > heroi.vidaMaxima) {
        heroi.vida = heroi.vidaMaxima;
    }

    if (tipo === 'ataque') {
        heroi.ataque += 2;
        log(t("templo_forca"));
    }

    if (tipo === 'defesa') {
        heroi.defesa += 2;
        log(t("templo_resistencia"));
    }

    atualizarUI();
}

//--------------- lutar -------------

function iniciarLuta() {
    if (!heroi.espadaBase) {
        log(t("semArma"));
        return;
    }
    if (!gastarEnergia(1)) return;

    // 🔒 Garantias
    heroi.vida = Math.max(heroi.vida, 1);
    heroi.defesa = heroi.defesa || 0;

    const monstro = gerarMonstro();

    log(t("monstroApareceu", { nome: t(monstro.nome) }));

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
        log(t("foiDerrotado"));
        heroi.vida = Math.floor(heroi.vidaMaxima / 2);
        log(t("escapouFerido"));
    } else {
        ganharExp(10);
        heroi.dinheiro += monstro.ouro;
        log(t("venceuMonstro"));
    }

    atualizarUI();
}

function gerarMonstro() {
    const diaAtual = estadoJogo.dia || 1;

    // dificuldade escala com o dia
    const fator = 1 + (diaAtual * 0.15);

    const base = inimigosBase[Math.floor(Math.random() * inimigosBase.length)];

    return {
        nome: base.nome,
        vida: Math.floor(base.vida * fator),
        ataque: Math.floor(base.ataque * fator),
        defesa: Math.floor(base.defesa * fator),
        ouro: Math.floor(base.ouro * fator)
    };
}

function iniciarLutaFinal() {
    const monstro = gerarMonstroFinal();
    log(t("criatura_desperta"));

    while (heroi.vida > 0 && monstro.vida > 0) {
        monstro.vida -= heroi.ataque;
        if (monstro.vida <= 0) break;

        heroi.vida -= monstro.ataque;
    }

    if (heroi.vida < 1) {
        finalRuim();
        morreuParaBossFinal = true;
        mostrarBruxaHistoria();
        return;
    } else {
        finalBom();

    }

    atualizarUI();
}

function gerarMonstroFinal() {
    return {
        nome: "Criatura Original",
        vida: 170,
        ataque: 20
    };
}

function decidirLuta() {
    if (estadoJogo.jogoEncerrado) {
        log(t("destino_selado"));
        return;
    }

    if (dia === DIA_FINAL) {
        iniciarLutaFinal();
    } else if (dia < DIA_FINAL) {
        iniciarLuta();
    } else {
        log(t("sem_batalhas"));
    }
}

function finalBom() {
    estadoJogo.final = "bom";
    estadoJogo.jogoEncerrado = true;

    // Registra na memória global
    registrarFinalGlobal('bom');

    log(t("finalBom1"));
    log(t("finalBom2"));
    log(t("finalBom3"));
    log(t("jogo_acabou_slot"));

    salvarProgresso(); // Salva o estado travado deste slot
}

function finalRuim() {
    estadoJogo.final = "ruim";
    estadoJogo.jogoEncerrado = true;

    // Registra na memória global
    registrarFinalGlobal('ruim');

    log(t("finalRuim1"));
    log(t("finalRuim2"));
    log(t("finalRuim3"));
    log(t("jogo_acabou_slot"));

    salvarProgresso(); // Salva o estado travado deste slot
}

function verificarFimDeJogo() {
    if (estadoJogo.jogoEncerrado) {
        log(t("destino_ja_selado"));
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
        log(t("ouro_insuficiente_geral"));
        return;
    }

    heroi.dinheiro -= precoFinal;
    heroi.vida = Math.min(heroi.vida + 30, heroi.vidaMaxima);

    log(t("pocao_comprada_preco", { preco: precoFinal }));
    atualizarUI();
}

//--- vendedor da caverna

function menuVendedorArmadura() {
    if (!heroi.armadura) {
        heroi.armadura = { boots: false, legs: false, chest: false, helmet: false };
    }

    const d = TEXTOS[idiomaAtual];
    let proxima = "";
    if (!heroi.armadura.boots) proxima = "boots";
    else if (!heroi.armadura.legs) proxima = "legs";
    else if (!heroi.armadura.chest) proxima = "chest";
    else if (!heroi.armadura.helmet) proxima = "helmet";

    if (document.getElementById('painel-vendedor')) return;

    const div = document.createElement("div");
    div.id = "painel-vendedor";
    // Estilo compacto para não vazar da tela
    div.style = `
        position: absolute; top: 50%; left: 50%; 
        transform: translate(-50%, -50%);
        background: rgba(20, 20, 20, 0.95); border: 2px solid #ffd700;
        padding: 12px; color: white; text-align: center;
        min-width: 200px; border-radius: 8px; z-index: 1000;
        box-shadow: 0 0 20px rgba(0,0,0,0.8); font-family: 'Courier New', Courier, monospace;
    `;

    // Título e Ouro com tradução dinâmica
    let conteudo = `<h4 style="margin: 0 0 8px 0; color: #ffd700; text-transform: uppercase;">${d.vendedorArmadura}</h4>`;
    conteudo += `<p style="margin: 4px 0; font-size: 13px;">💰 ${t("label_ouro")}: <span style="color: #00ff00;">${heroi.dinheiro}</span></p>`;
    conteudo += `<hr style="border: 0; border-top: 1px solid #444; margin: 8px 0;">`;

    if (proxima === "") {
        conteudo += `<p style="color: #00ff00; font-size: 13px;">${d.setCompleto || "FULL SET!"}</p>`;
    } else if (heroi.comprouHoje) {
        conteudo += `<p style="font-size: 12px; color: #ffae00;">${d.jaComprouHoje}</p>`;
    } else {
        const preco = precosArmadura[proxima];
        // O botão agora usa t("label_ouro") para mudar entre Ouro/Gold
        conteudo += `
            <p style="margin: 5px 0; font-size: 12px;">${t("pecaI") || "Item"}: <strong>${d.pecasNome[proxima]}</strong></p>
            <button onclick="confirmarCompra('${proxima}')" style="
                background: #27ae60; color: white; border: none; 
                padding: 8px; cursor: pointer; width: 100%;
                font-weight: bold; border-radius: 4px; margin: 8px 0;
                font-size: 11px;
            ">🛒 ${d.comprarArmadura} (${preco} ${t("label_ouro")})</button>
        `;
    }

    conteudo += `
        <button onclick="fecharVendedor()" style="
            background: #c0392b; color: white; border: none; 
            padding: 4px; cursor: pointer; width: 100%;
            border-radius: 4px; font-size: 11px;
        ">${t("btn_fechar")}</button>
    `;

    div.innerHTML = conteudo;
    document.body.appendChild(div);
} document.body.appendChild(div);


// Ajuste na função de fechar para remover do body
function fecharVendedor() {
    const painel = document.getElementById('painel-vendedor');
    if (painel) painel.remove();
}

function confirmarCompra(peca) {
    const d = TEXTOS[idiomaAtual];
    const preco = precosArmadura[peca]; // Busca o preço

    // 1. Verifica se tem dinheiro
    if (heroi.dinheiro < preco) {
        log(t("dinheiroInsuficiente")); // "Dinheiro insuficiente"
        return;
    }

    // 2. Desconta o ouro e entrega o item
    heroi.dinheiro -= preco;
    heroi.armadura[peca] = true;
    heroi.comprouHoje = true;

    // 3. Aplica bônus
    if (peca === "legs") heroi.defesa += 5;
    if (peca === "chest") { heroi.vidaMaxima += 20; heroi.vida = heroi.vidaMaxima; }
    if (peca === "helmet") heroi.ataque += 5;

    // 4. Logs e Atualizações
    log(`-${preco} ${t("label_ouro")}`); // Avisa que gastou ouro
    log(d.armaduraAdquirida + d.pecasNome[peca], "gold");

    fecharVendedor();
    atualizarTela();
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
        log(t("vila_evoluida_nivel", { nivel: vila.nivel }));
        aplicarBonusVila()
        atualizarTela();
        salvarProgresso();
    } else {
        log(t("melhoria_sem_recursos", { madeira: custoBase, ferro: custoFerro }));
    }
}

function aplicarBonusVila() {
    switch (vila.nivel) {
        case 2:
            heroi.vidaMaxima += 10;
            heroi.vida = heroi.vidaMaxima;
            log(t("vilaVidaUp"));
            break;

        case 3:
            heroi.ataque += 2;
            log(t("vilaAtaqueUp"));
            break;

        case 4:
            vila.descontoLoja = 5;
            log(t("vilaDesconto"));
            break;

    }

    atualizarUI();
}

function coletar(recurso) {
    if (!gastarEnergia(1)) return;
    let qtd = 1 + Math.floor(vila.nivel / 2);

    // Atualiza lógica interna
    if (recurso === 'madeira') vila.madeira += qtd;
    else if (recurso === 'pedra') vila.pedra += qtd;
    else if (recurso === 'ferro') vila.ferro += qtd;

    // LOG CORRETO COM TRADUÇÃO
    // Precisamos criar chaves como 'item_madeira', 'item_pedra' no TEXTOS
    log(`+${qtd} ${t("item_" + recurso)}`);

    atualizarTela();
}

function coletarRecurso(tipo) {
    if (!gastarEnergia(0.5)) return;

    heroi[tipo + 's']++;

    log(t("coletouItem", { item: t("item_" + tipo) }));

    atualizarUI();
    return true;
}

function dormir() {
    if (dia >= 10) {
        log(t("chefeChegouDormir"));
        return;
    }
    dia++;
    energiaAtual = energiaMaxima;
    heroi.vida = heroi.vidaMaxima;
    heroi.comprouHoje = false;
    log(t("dia_comecou", { dia: dia }));
    if (dia === 10) log(t("chefeAtacando"));

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