
BasicGame.Preloader = function (game) {

    this.initExtends();

    BasicGame.PreloaderBase.call(game);
};

BasicGame.Preloader.prototype = Object.create(BasicGame.PreloaderBase.prototype);
BasicGame.Preloader.prototype.constructor = BasicGame.Preloader;

BasicGame.Preloader.prototype.initExtends = function() {
    for(var name in this.extends) {
        BasicGame.Preloader.prototype[name] = this.extends[name];
    }
};

BasicGame.Preloader.prototype.extends = {


    preload: function () {

    	this.initPreloaderBase();
        
        //alterado caminho das imagens em função do jogo p/ tablets
        //this.caminho = getPathFile(GLOBAL);
        //console.log(this.caminho);
        
        // ANIMATION - ARROW AND CLICK
        //this.load.image('arrow', this.caminho + 'arrow.png');
        //this.load.atlas('clickAnimation', this.caminho + 'click_animation.png', this.caminho +'click_animation.json');

        //alterado caminho das imagens em função do jogo p/ tablets
        this.caminho = getPathFile(UV1AV3UD4OA02);
        console.log("Caminho das imagens e animações: " + this.caminho);

        // ANIMATIONS AND IMAGES
        this.load.image('img_background', this.caminho +'img_background.png');
        this.load.atlas('anim_caldeirao', this.caminho +'anim_caldeirao.png', this.caminho + 'anim_caldeirao.json');
        this.load.atlas('anim_guri', this.caminho +'anim_guri.png', this.caminho + 'anim_guri.json');
        this.load.atlas('anim_guri_happy', this.caminho +'anim_guri_happy.png', this.caminho + 'anim_guri_happy.json');
        this.load.atlas('img_respostas', this.caminho +'img_respostas.png',  this.caminho + 'img_respostas.json');
        
        //this.caminho = SOUNDS_UV1AV3UD4OA02;
        this.caminho = getPathFileSound(SOUNDS_UV1AV3UD4OA02); 

        //alterado caminho das imagens em função do jogo p/ tablets
        console.log("Caminho dos sons: " + this.caminho);

        // SOUNDS
        this.load.audio('soundIntro', [this.caminho + 'AV3_S4_OA2_INTRO.mp3']);
        this.load.audio('soundDica', [this.caminho + 'AV3_S4_OA2_DICA.mp3']);
        this.load.audio('soundFinal', [this.caminho + 'AV3_S4_OA2_FINAL.mp3']);
        this.load.audio('soundResumo', [this.caminho + 'AV3_S4_OA2_RESUMO.mp3']);
        this.load.audio('soundCallToAction', [this.caminho + 'AV3_S4_OA2_CtA.mp3']);

        //SOUNDS - ANSWERS 
        /*nomes dos sons estão de acordo com as imagens de respostas do sprite img_respostas
          cada figura possui um áudio*/
        this.load.audio('5', [this.caminho + 'AV3_S4_OA2_P1_ACUCAR.mp3']); //5 
        this.load.audio('1', [this.caminho + 'AV3_S4_OA2_P1_ALHO.mp3']);//1
        this.load.audio('4', [this.caminho + 'AV3_S4_OA2_P1_LOURO.mp3']); //4 
        this.load.audio('2', [this.caminho + 'AV3_S4_OA2_P1_PIMENTA.mp3']);//2
        this.load.audio('0', [this.caminho + 'AV3_S4_OA2_P1_SAL.mp3']); //0 
        this.load.audio('3', [this.caminho + 'AV3_S4_OA2_P1_SALADA.mp3']);//3 
        this.load.audio('12', [this.caminho + 'AV3_S4_OA2_P2_ARROZ.mp3']);//12 
        this.load.audio('9', [this.caminho + 'AV3_S4_OA2_P2_CEBOLA.mp3']);//9
        this.load.audio('13', [this.caminho + 'AV3_S4_OA2_P2_ERVILHA.mp3']); //13
        this.load.audio('6', [this.caminho + 'AV3_S4_OA2_P2_FRANGO.mp3']); //6
        this.load.audio('7', [this.caminho + 'AV3_S4_OA2_P2_LINGUICA.mp3']); //7
        this.load.audio('14', [this.caminho + 'AV3_S4_OA2_P2_MILHO.mp3']); //14
        this.load.audio('11', [this.caminho + 'AV3_S4_OA2_P2_OLEO.mp3']); //11
        this.load.audio('8', [this.caminho + 'AV3_S4_OA2_P2_PALMITO.mp3']); //8
        this.load.audio('10', [this.caminho + 'AV3_S4_OA2_P2_PIMENTAO.mp3']);//10
        this.load.audio('18', [this.caminho + 'AV3_S4_OA2_P3_AIPO.mp3']); //18
        this.load.audio('20', [this.caminho + 'AV3_S4_OA2_P3_ALECRIM.mp3']); //20
        this.load.audio('24', [this.caminho + 'AV3_S4_OA2_P3_CANELA.mp3']); //24
        this.load.audio('15', [this.caminho + 'AV3_S4_OA2_P3_CEBOLINHA.mp3']); //15
        this.load.audio('21', [this.caminho + 'AV3_S4_OA2_P3_COENTRO.mp3']); //21
        this.load.audio('19', [this.caminho + 'AV3_S4_OA2_P3_ERVADOCE.mp3']); //19
        this.load.audio('17', [this.caminho + 'AV3_S4_OA2_P3_GENGIBRE.mp3']); //17
        this.load.audio('22', [this.caminho + 'AV3_S4_OA2_P3_GERGELIM.mp3']); //22
        this.load.audio('25', [this.caminho + 'AV3_S4_OA2_P3_HORTELA.mp3']); //25
        this.load.audio('26', [this.caminho + 'AV3_S4_OA2_P3_OREGANO.mp3']); //26
        this.load.audio('23', [this.caminho + 'AV3_S4_OA2_P3_RAIZFORTE.mp3']); //23
    
    },

    update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    },

};