class CenaVila extends Phaser.Scene {
    constructor() {
        super({ key: 'CenaVila' });
    }

    preload() {
        // ⚠️ OPCIONAL: só carregue se tiver os arquivos
        this.load.image('heroi', 'assets/heroi.png');
        this.load.image('arvore', 'assets/arvore.png');
        this.load.image('minerio', 'assets/minerio.png');
        this.load.image('vila', 'assets/vila.png');
        this.load.image('cama', 'assets/cama.png');
        this.load.image('loja', 'assets/loja.png');
        this.load.image('caverna', 'assets/caverna.png');
        this.load.image('bgVila', 'backgrounds/vila.png');
        this.load.image('bgFloresta', 'backgrounds/floresta.png');
        this.load.image('bgCaverna', 'backgrounds/caverna.png');
        this.load.image('mercadoNegro', 'assets/mercado_negro.png');
        this.load.image('templo', 'assets/templo.png');

    }

    create() {

        // ----------- mundo ----------

        const LARGURA_MUNDO = 1200;
        const ALTURA_MUNDO = 800;

        this.physics.world.setBounds(0, 0, LARGURA_MUNDO, ALTURA_MUNDO);

        const ESPACO = 250;

        // --------- cenario -------

        this.bgVila = this.add.tileSprite(
            0, 0,
            LARGURA_MUNDO,
            ALTURA_MUNDO,
            'bgVila'
        ).setOrigin(0, 0);

        this.bgFloresta = this.add.tileSprite(
            0, 0,
            LARGURA_MUNDO,
            ALTURA_MUNDO,
            'bgFloresta'
        ).setOrigin(0, 0);

        this.bgCaverna = this.add.tileSprite(
            0, 0,
            LARGURA_MUNDO,
            ALTURA_MUNDO,
            'bgCaverna'
        ).setOrigin(0, 0);

        /* =====================
           JOGADOR
        ===================== */
        // 👉 usando retângulo para evitar bug caso não haja sprite

        this.player = this.physics.add.sprite(300, 200, 'heroi');
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        // ----------------- camera --------

        this.cameras.main.setBounds(0, 0, LARGURA_MUNDO, ALTURA_MUNDO);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        /* =====================
           ZONAS (INVISÍVEIS)
        ===================== */

        this.grupoVila = this.add.group();
        this.grupoFloresta = this.add.group();
        this.grupoCaverna = this.add.group();

        // VILA
        this.zonaUpgrade = this.criarZona(270 + ESPACO, 300 - ESPACO, 64, 64);
        this.zonaJornal = this.criarZona(310 + ESPACO, 310 + ESPACO, 60, 60);
        this.zonaLoja = this.criarZona(380 + ESPACO, 300, 60, 60);
        this.zonaCama = this.criarZona(500 - ESPACO, 430 + ESPACO, 70, 70);
        this.zonaTemplo = this.criarZona(180, 250 + ESPACO, 60, 60);

        // FLORESTA
        this.zonaArvore = this.criarZona(500 - ESPACO, 100, 50, 50);
        this.zonaMinerio = this.criarZona(100 + ESPACO, 300, 40, 40);
        this.zonaMercadoNegro = this.criarZona(700 + ESPACO, 450 + ESPACO, 60, 60);

        // CAVERNA
        this.zonaLuta = this.criarZona(600, 700, 80, 80);

        /* =====================
             SPRITES VISUAIS
         ===================== */
        this.spriteVila = this.add.sprite(
            this.zonaUpgrade.x,
            this.zonaUpgrade.y,
            'vila'
        );

        this.grupoVila.add(this.spriteVila);

        this.spriteArvore = this.add.sprite(
            this.zonaArvore.x,
            this.zonaArvore.y,
            'arvore'
        );

        this.grupoFloresta.add(this.spriteArvore);

        this.spriteMinerio = this.add.sprite(
            this.zonaMinerio.x,
            this.zonaMinerio.y,
            'minerio'
        );

        this.grupoFloresta.add(this.spriteMinerio);

        this.spriteCaverna = this.add.sprite(
            this.zonaLuta.x,
            this.zonaLuta.y,
            'caverna'
        );

        this.grupoCaverna.add(this.spriteCaverna);

        this.spriteLoja = this.add.sprite(
            this.zonaLoja.x,
            this.zonaLoja.y,
            'loja'
        );

        this.grupoVila.add(this.spriteLoja);

        this.spriteCama = this.add.sprite(
            this.zonaCama.x,
            this.zonaCama.y,
            'cama'
        );

        this.grupoVila.add(this.spriteCama);

        this.spriteJornal = this.add.text(
            this.zonaJornal.x,
            this.zonaJornal.y,
            '📰',
            { fontSize: '32px' }
        ).setOrigin(0.5);

        this.grupoVila.add(this.spriteJornal);

        this.spriteMercadoNegro = this.add.sprite(
            this.zonaMercadoNegro.x,
            this.zonaMercadoNegro.y,
            'mercadoNegro'
        );

        this.grupoFloresta.add(this.spriteMercadoNegro);

        this.spriteTemplo = this.add.sprite(
            this.zonaTemplo.x,
            this.zonaTemplo.y,
            'templo'
        );

        this.grupoVila.add(this.spriteTemplo);

        this.bgVila.setDepth(0);
        this.bgFloresta.setDepth(0);
        this.bgCaverna.setDepth(0);

        this.spriteVila.setDepth(1);
        this.spriteArvore.setDepth(1);
        this.spriteMinerio.setDepth(1);
        this.spriteLoja.setDepth(1);
        this.spriteCama.setDepth(1);
        this.spriteCaverna.setDepth(1);
        this.spriteJornal.setDepth(1);
        this.spriteMercadoNegro.setDepth(1);
        this.spriteTemplo.setDepth(1);

        this.player.setDepth(2);

        /* =====================
           TEXTO DE AÇÃO
        ===================== */
        this.textoAcao = this.add.text(300, 370, '', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 6, y: 4 }
        })
            .setOrigin(0.5)
            .setScrollFactor(0)   // 🔑 ESSENCIAL
            .setDepth(1000);      // Sempre por cima
    }

    criarZona(x, y, w, h) {
        const zona = this.add.rectangle(x, y, w, h).setVisible(false);
        this.physics.add.existing(zona, true);
        return zona;

    }



    update() {
        if (typeof cenarioAtual === 'undefined') return;

        /* =====================
           MOVIMENTO
        ===================== */
        const speed = 160;
        this.player.body.setVelocity(0);

        if (this.cursors.left.isDown) this.player.body.setVelocityX(-speed);
        else if (this.cursors.right.isDown) this.player.body.setVelocityX(speed);

        if (this.cursors.up.isDown) this.player.body.setVelocityY(-speed);
        else if (this.cursors.down.isDown) this.player.body.setVelocityY(speed);

        this.textoAcao.setText('');

        /* =====================
           VISIBILIDADE DAS ZONAS
        ===================== */
        this.bgVila.setVisible(cenarioAtual === 'vila');
        this.bgFloresta.setVisible(cenarioAtual === 'floresta');
        this.bgCaverna.setVisible(cenarioAtual === 'caverna');

        const naVila = cenarioAtual === 'vila';
        const naFloresta = cenarioAtual === 'floresta';
        const naCaverna = cenarioAtual === 'caverna';

        this.zonaUpgrade.visible = naVila;
        this.zonaCama.visible = naVila;
        this.zonaLoja.visible = naVila;
        this.zonaJornal.visible = naVila;
        this.zonaTemplo.visible = naVila;

        this.zonaArvore.visible = naFloresta;
        this.zonaMinerio.visible = naFloresta;

        this.zonaLuta.visible = naCaverna;

        this.grupoVila.setVisible(cenarioAtual === 'vila');
        this.grupoFloresta.setVisible(cenarioAtual === 'floresta');
        this.grupoCaverna.setVisible(cenarioAtual === 'caverna');

        /* =====================
           INTERAÇÕES
        ===================== */

        // FLORESTA
        if (naFloresta) {
            if (this.overlap(this.zonaArvore)) {
                this.acao('🌲 Pegar MADEIRA', () => coletar('madeira'));
            }

            if (this.overlap(this.zonaMercadoNegro)) {
                this.acao('🕶️ Mercado Negro', () => abrirMercadoNegro());
            }

            if (this.overlap(this.zonaMinerio)) {
                this.acao('⛏️ Minerar PEDRA e FERRO', () => {
                    coletar('pedra');
                    coletar('ferro');
                });
            }
        }

        // CAVERNA (LUTA)
        if (naCaverna && this.overlap(this.zonaLuta)) {
            this.acao('⚔️ LUTAR', () => decidirLuta());
        }

        // VILA
        if (naVila) {
            if (this.overlap(this.zonaUpgrade)) {
                this.acao('🏠 Melhorar VILA', () => executarMelhoriaVila());
            }

            if (this.overlap(this.zonaCama)) {
                this.acao('💤 Dormir', () => dormir());
            }

            if (this.overlap(this.zonaLoja)) {
                this.acao('🛒 Entrar na loja', () => abrirLoja());
            }

            if (this.overlap(this.zonaJornal)) {
                this.acao('📰 Ler Jornal', () => lerJornal());
            }

            if (this.overlap(this.zonaTemplo)) {
                this.acao('⛩️ Entrar no Templo', () => abrirTemplo());
            }
        }
    }

    overlap(zona) {
        return this.physics.overlap(this.player, zona);
    }

    acao(texto, callback) {
        this.textoAcao.setText(`Pressione ESPAÇO para ${texto}`);
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            callback();
        }
    }
}

/* =====================
   CONFIGURAÇÃO DO PHASER
===================== */
const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: CenaVila
};

new Phaser.Game(config);