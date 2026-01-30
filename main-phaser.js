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
        this.load.image('bruxa', 'assets/bruxa.png');
        this.load.audio('musicaNormal', 'audio/musica.mp3');
        this.load.audio('musicaCaverna', 'audio/caverna_ambiente.mp3');
    }

    create() {

        // ----------- mundo ----------

        const LARGURA_MUNDO = 3000;
        const ALTURA_MUNDO = 800;

        this.physics.world.setBounds(0, 0, LARGURA_MUNDO, ALTURA_MUNDO);

        const ESPACO = 250;

        this.miniMapa = this.add.graphics()
            .setScrollFactor(0)
            .setDepth(999);

        // --------- cenario -------

        this.bgVila = this.add.tileSprite(0, 0, 1000, 800, 'bgVila').setOrigin(0, 0);
        this.bgFloresta = this.add.tileSprite(1000, 0, 1000, 800, 'bgFloresta').setOrigin(0, 0);
        this.bgCaverna = this.add.tileSprite(2000, 0, 1000, 800, 'bgCaverna').setOrigin(0, 0);

        /* =====================
           JOGADOR
        ===================== */
        // 👉 usando retângulo para evitar bug caso não haja sprite

        this.player = this.physics.add.sprite(300, 200, 'heroi');
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        // ----------------- camera --------

        this.cameras.main.setBounds(0, 0, LARGURA_MUNDO, ALTURA_MUNDO);
        this.cameras.main.startFollow(this.player);

        //-------------- musica -----------

        this.musicaNormal = this.sound.add('musicaNormal', { loop: true, volume: 0.5 });
        this.musicaCaverna = this.sound.add('musicaCaverna', { loop: true, volume: 0.5 });

        // Começa com a música normal
        this.musicaAtual = 'normal';
        this.musicaNormal.play();

        /* =====================
           ZONAS (INVISÍVEIS)
        ===================== */

        this.grupoVila = this.add.group();
        this.grupoFloresta = this.add.group();
        this.grupoCaverna = this.add.group();

        // VILA
        this.zonaUpgrade = this.criarZona(250, 200, 70, 70)
        this.zonaLoja = this.criarZona(200, 400, 80, 80);
        this.zonaCama = this.criarZona(500, 200, 80, 80);
        this.zonaTemplo = this.criarZona(800, 450, 80, 80);
        this.zonaJornal = this.criarZona(350, 150, 60, 60);

        // FLORESTA
        this.zonaArvore = this.criarZona(1300, 300, 60, 60);
        this.zonaMinerio = this.criarZona(1700, 500, 60, 60);
        this.zonaMercadoNegro = this.criarZona(1900, 200, 70, 70);
        // Posição na floresta (longe da vila)
        this.bruxa = this.add.sprite(1700, 80, 'bruxa');
        this.bruxa.setAlpha(0.8);
        this.bruxa.setDepth(5);

        this.bruxaVisivel = true;
        // CAVERNA
        this.zonaLuta = this.criarZona(2500, 400, 120, 120);

        /* =====================
             SPRITES VISUAIS
         ===================== */
        this.spriteVila = this.add.sprite(200, 200, 'vila');

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

        this.time.addEvent({
            delay: 4000,
            loop: true,
            callback: () => {
                if (!this.bruxaVisivel) return;

                this.cameras.main.shake(100, 0.001);
            }
        });

        /* =====================
           CONFIGURAÇÃO DO MINI-MAPA
        ===================== */
        // Definimos as medidas para usar tanto no create quanto no update
        this.miniMapaConfig = {
            x: 20,
            y: 20,
            largura: 200,
            altura: 40,
            larguraMundo: 3000 // A largura total dos 3 cenários
        };

        // 1. Fundo Preto do Mini-mapa
        this.bgMiniMapa = this.add.rectangle(
            this.miniMapaConfig.x,
            this.miniMapaConfig.y,
            this.miniMapaConfig.largura,
            this.miniMapaConfig.altura,
            0x000000, 0.8
        ).setOrigin(0).setScrollFactor(0).setDepth(2000);

        // 2. Cores dos Setores (Vila, Floresta, Caverna)
        // Vila (Cinza)
        this.add.rectangle(this.miniMapaConfig.x, this.miniMapaConfig.y, 66, 40, 0x555555, 0.5)
            .setOrigin(0).setScrollFactor(0).setDepth(2001);
        // Floresta (Verde)
        this.add.rectangle(this.miniMapaConfig.x + 66, this.miniMapaConfig.y, 66, 40, 0x228b22, 0.5)
            .setOrigin(0).setScrollFactor(0).setDepth(2001);
        // Caverna (Roxo/Preto)
        this.add.rectangle(this.miniMapaConfig.x + 132, this.miniMapaConfig.y, 68, 40, 0x2e0854, 0.5)
            .setOrigin(0).setScrollFactor(0).setDepth(2001);

        // 3. Indicador do Herói (Bolinha Amarela)
        this.indicadorHeroi = this.add.circle(
            this.miniMapaConfig.x,
            this.miniMapaConfig.y + 20,
            5,
            0xffff00
        ).setScrollFactor(0).setDepth(2005);

        // 4. Bordas
        this.add.graphics()
            .lineStyle(2, 0xffffff, 1)
            .strokeRect(this.miniMapaConfig.x, this.miniMapaConfig.y, this.miniMapaConfig.largura, this.miniMapaConfig.altura)
            .setScrollFactor(0).setDepth(2006);

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

    trocarMusica(tipo) {
        const fadeOut = this.musicaAtual === 'caverna' ? this.musicaCaverna : this.musicaNormal;
        const fadeIn = tipo === 'caverna' ? this.musicaCaverna : this.musicaNormal;

        this.tweens.add({
            targets: fadeOut,
            volume: 0,
            duration: 800,
            onComplete: () => fadeOut.stop()
        });

        fadeIn.setVolume(0);
        fadeIn.play();

        this.tweens.add({
            targets: fadeIn,
            volume: 0.5,
            duration: 800
        });

        this.musicaAtual = tipo;
    }



    update() {

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

        this.controlarBruxa();

        //-------------- musica ------------

        let novaMusica = 'normal';

        if (this.player.x >= 2000) {
            novaMusica = 'caverna';
        }

        if (novaMusica !== this.musicaAtual) {
            this.trocarMusica(novaMusica);
        }

        //----------- fundos -----------

        // 🏠 VILA (canto superior esquerdo)
        this.add.image(500, 400, 'bgVila');

        // 🌲 FLORESTA (meio do mapa)
        this.add.image(2000, 1500, 'bgFloresta');

        // 🕳️ CAVERNA (canto inferior direito)
        this.add.image(3500, 2600, 'bgCaverna');


        /* =====================
           INTERAÇÕES
        ===================== */

        // FLORESTA
        if (this.overlap(this.zonaArvore)) {
            this.acao('🌲 Pegar MADEIRA', () => coletar('madeira'));
        }

        // MINÉRIO
        if (this.overlap(this.zonaMinerio)) {
            this.acao('⛏️ Minerar PEDRA e FERRO', () => {
                coletar('pedra');
                coletar('ferro');
            });
        }

        // MERCADO NEGRO
        if (this.overlap(this.zonaMercadoNegro)) {
            this.acao('🕶️ Mercado Negro', () => abrirMercadoNegro());
        }

        // LUTA
        if (this.overlap(this.zonaLuta)) {
            this.acao('⚔️ Explorar Caverna', () => decidirLuta());
        }

        // VILA
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


        /* =====================
               ATUALIZAÇÃO DO MINI-MAPA
            ===================== */
        if (this.indicadorHeroi && this.miniMapaConfig) {
            // Calcula a porcentagem do caminho percorrido (0 a 1)
            const porcentagemX = this.player.x / this.miniMapaConfig.larguraMundo;

            // Aplica essa porcentagem na largura do mini-mapa + o offset inicial (x: 20)
            this.indicadorHeroi.x = this.miniMapaConfig.x + (porcentagemX * this.miniMapaConfig.largura);
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

    controlarBruxa() {
        if (!this.bruxa) return;

        const distancia = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.bruxa.x, this.bruxa.y
        );

        // Se chegar perto, ela some
        if (distancia < 200 && this.bruxaVisivel) {
            this.bruxaVisivel = false;

            this.tweens.add({
                targets: this.bruxa,
                alpha: 0,
                duration: 600,
                onComplete: () => {
                    this.bruxa.setVisible(false);
                }
            });
        }

        // Se afastar, ela reaparece
        if (distancia > 350 && !this.bruxaVisivel) {
            this.bruxaVisivel = true;

            this.bruxa.setVisible(true);
            this.bruxa.setAlpha(0);

            this.tweens.add({
                targets: this.bruxa,
                alpha: 0.8,
                duration: 800
            });
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

const game = new Phaser.Game(config);

function alterarVolume(valor) {
    const cena = game.scene.keys['CenaVila'];
    if (cena && cena.sound) {
        cena.sound.volume = valor;
    }
}