BasicGame.Game = function (game) {
    this.initExtends();
    BasicGame.GameBase.call(game);
};

BasicGame.Game.prototype = Object.create(BasicGame.GameBase.prototype);
BasicGame.Game.prototype.constructor = BasicGame.Game;

BasicGame.Game.prototype.initExtends = function() {
    for(var name in this.extends) {
        BasicGame.Game.prototype[name] = this.extends[name];
    }
};

BasicGame.Game.prototype.extends = {

    create: function () {

        this.initGlobal();

        /*editor*/
        this.pointX = [];
        this.pointY = [];
        //this.gradeGuia(1000, 600);            

        this.TEMPO_INTRO = 34500;
        this.ENABLE_CALL_TO_ACTION = true;
        this.ENABLE_PLACAR = true; // para desabilitar o placar 

        // quantidade de perguntas que tem em cada nivel
        this.totalLevel1 = 3;
        this.totalLevel2 = 3;
        this.totalLevel3 = 3;

        // quantidade total de erros permitido em cada nivel
        // ex: se valor está definido para 2 erros, usuario pode errar 2x e na terceira é considerado errado
        this.totalErro1 = 1;
        this.totalErro2 = 1;
        this.totalErro3 = 1;

        /*****************************************************************/


        this.remainingAnswers1 = [0, 1, 2, 3, 4, 5];
        this.remainingAnswers2 = [6, 7, 8, 9, 10, 11];
        this.remainingAnswers3 = [12, 13, 14, 15, 16, 17];
        this.otherAnswers = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];

        this.bezierStart = [
            [262, 551],
            [383, 548],
            [632, 554],
            [744, 554]
        ];

        this.bezierEnd = [512, 376];

        this.startPath = [-200, 600];


        this.keyboard_permission = false;
        this.right_keyboard_answear;
        this.input.keyboard.addCallbacks(this, null, null, this.keyPress);

        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

        this.groupLevel = [null,1,2,3];

        this.createScene();
        this.showIntro();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();
        //this.goGame = true;
        this.playSound = false; // para tocar um som de uma vez
        this.som = null; // recebe o som que está tocando
    },

    /**
    *
    * Função para começar a mostrar a introdução inicial do jogo.
    * Todos os itens criados na introdução devem ser adicionados ao grupo 'this.groupIntro'
    *
    **/
    showIntro: function() {

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");
        this.tutorialPlacar.addChild(this.skipButton);

        this.groupIntro = this.add.group();

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextoIntro, this);
    },


    /**
    * @method drawText( x, y, text, fontSize=24, align="left")
    *
    * Função para desenhar textos na tela. Usada ao invés de usar imagens.
    * Quebras de linhas devem ser adicionadas manualmente.
    * Para colocar alguma palavra ou texto em cor amarela, deve-se utilizar colchetes entre o texto [ ]
    * 
    * @param fontSize padrão é 22
    * @param align padrão é 'left'. Pode ser 'left', 'center', 'right'
    **/
    showTextoIntro: function() {
        var t1 = "Gente, nessa galinhada doida vai ter\n de tudo! E agora é correria e confusão!\n Temos um reloginho que nos dá 5 \nsegundos para clicarmos na [palavra]\n [que é algo de comer]!";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "Parece fácil, mas cada vez veremos mais\n e mais palavras, sem poder escutá-las!\n Vamos lá, galera! Escolham \napenas o que é de [comer]!";
        var tutorialText2 = this.drawText(this.world.centerX, 20, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var kim = this.showKim(14000);

        this.level = 1;
        this.setupLevel();

        //t1in
        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0).onComplete.add(function(){
            this.add.tween(this.relogio).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 8000);
            this.add.tween(this.bacia1).to({y: this.baciaY}, 1000, Phaser.Easing.Linear.None, true, 9500);
            this.add.tween(this.bacia2).to({y: this.baciaY}, 1000, Phaser.Easing.Linear.None, true, 10000).onComplete.add(function(){
                this.bringPalavras(function(){
                    this.createDelayTime(10000, function(){
                        this.showLiveTutorial();
                    });
                });
            }, this);
            this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 14000).onComplete.add(function(){
                this.add.tween(this.tutorialPlacar).to({y: -105}, 500, Phaser.Easing.Bounce.Out, true, 200);
                this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 700).onComplete.add(function(){
                    this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 13000);
                }, this);
            }, this);
        }, this);

        this.soundIntro = this.setDebugAudio("soundIntro");
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");

        aux = 370;
        auy = 220;
        
        this.arrowGroup = this.game.add.group();
        this.arrowGroup.alpha =0;
        this.arrowGroup.x = aux;
        this.arrowGroup.y = auy;
        this.click = this.add.sprite(0, 0, 'clickAnimation');
        this.arrow = this.add.sprite(0, 0, 'arrow');
        this.click.animations.add('click');
        this.arrowGroup.add(this.arrow);
        this.arrowGroup.add(this.click);        

        this.game.world.bringToTop(this.arrowGroup);
        
        //aparece
        this.add.tween(this.arrowGroup).to({alpha:1}, 200, Phaser.Easing.Linear.None, true);
        
        this.add.tween(this.arrowGroup).to({x: this.correctPalavra.x , y:  this.correctPalavra.y}, 1000, Phaser.Easing.Linear.None, true, 1000).onComplete.add(function(){

                this.click.animations.play('click', 30, false);

                this.animatePalavra(this.correctPalavra, function(){
                    this.showFinishedLiveTutorial();
                });

            }, this);

    },    

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showFinishedLiveTutorial:function() {
        console.log("showFinishedLiveTutorial");
        this.add.tween(this.groupIntro).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.arrowGroup).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.tutorialPlacar).to({y: -300}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
    },

    /**
    *
    * Função para gerar valores do nível
    *
    **/ 
    setupLevel: function(){
        console.log("level: "+this.level);
        switch(this.level){
            case 1:
                answers = this.remainingAnswers1;
                break;
            case 2:
                answers = this.remainingAnswers2;
                break;
            case 3:
                answers = this.remainingAnswers3;
                break;
        }
        otherAnswersAux = this.otherAnswers.slice(0);

        palavrasAux = [];
        for(i = 0; i < this.level+1; i++)
            palavrasAux.push(i);

        correctPalavraId = palavrasAux.splice(this.game.rnd.integerInRange(0, palavrasAux.length-1), 1)[0];
        console.log("correct palavra "+correctPalavraId);
        this.correctPalavra = this.palavras[correctPalavraId];

        this.correctPalavra.frame = answers[this.game.rnd.integerInRange(0, answers.length-1)];

        while(palavrasAux.length > 0){
            palavra = palavrasAux.splice(this.game.rnd.integerInRange(0, palavrasAux.length-1), 1)[0];

            randomPalavra = otherAnswersAux.splice(this.game.rnd.integerInRange(0, otherAnswersAux.length-1), 1)[0];
            this.palavras[palavra].frame = randomPalavra;
        }
    },

    /**
    *
    * Função para iniciar o jogo em si. Chamada após a introdução ou ao clicar no botão de skip.
    * Ela esconde o placar, remove o grupo da introdução e mostra o primeiro level do jogador
    * 
    **/
    initGame: function() {

        console.log("initGame");
        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }
        if(this.arrowGroup != null) {
            this.arrowGroup.removeAll(true);
        }

        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        this.resetLevel(this.showNextLevel);
    },

    /**
    *
    * Função de atalho para mostrar o level.
    * Se ainda houver level, e se jogador não tiver acertado mais de 2x ele irá para o proximo level
    * Caso contrario é direcionado ao game over de vitória
    * 
    **/
    hideAndShowLevel: function() {
        console.log("*** hideAndShowLevel ***");
        if(this.currentLevel <= 3) {
            if(this.ENABLE_PLACAR){
                this.createDelayTime(1000, function() {
                    this.showNextLevel();
                });
            }else{
                this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
            }
            
        } else {
            this.gameOverMacaco();
        }
    },


    /**
    *
    * Remove todas as ações do item correto, e corrige problema do cursor do mouse como mão
    * 
    **/
    removeButtonAction: function() {
        this.game.canvas.style.cursor = "default";
        if(!this.correctItem) {
            return;
        }
        this.correctItem.input.useHandCursor = false;
        this.correctItem.input.reset();
        
        this.correctItem.inputEnabled = false;
        this.correctItem.onInputOver.removeAll();
        this.correctItem.onInputOut.removeAll();
        this.correctItem.onInputUp.removeAll();
    }, 

    /**
    *
    * Faz calculo de qual deve ser o nível seguinte e direciona o jogador para o nivel seguinte se houver
    * 
    **/
    gotoNextLevel: function() {

        this.currentLocalLevel++;
        
        if(this.currentLocalLevel >= this["totalLevel" + this.currentLevel]) {
            this.currentLevel++;

            this.currentLocalLevel = 0;

            this.currentLocalErrors = this["totalErro" + this.currentLevel];
        }
        this.hideAndShowLevel();
    },


    /**
    *
    * Função para criar cena do jogo. Chamada na criação do jogo. Deve conter todos personagens e animações do cenario
    * 
    **/
    createScene: function() {
        this.background = this.add.sprite(0, 0, 'background');

        this.personagens = this.add.sprite(500, 450, 'personagens');
        this.personagens.anchor.set(0.5, 0.5);
        frames = [];
        for(i = 0; i < 38; i++)
            frames.push(i);
        this.personagens.animations.add('idle', frames, 18, true);
        frames = [];
        for(i = 38; i < 63; i++)
            frames.push(i);
        this.personagens.animations.add('cheer', frames, 18);
        this.personagens.animations.play('idle');


        this.relogio = this.add.sprite(900, 150, 'relogio');
        this.relogio.animations.add('time', null, 19, false);
        this.relogio.anchor.set(0.5, 0.5);
        this.relogio.alpha = 0;

        this.baciaInitialY = 800;
        this.baciaY = 580;
        this.bacia1 = this.add.sprite(320, this.baciaInitialY, 'bacia');
        this.bacia1.anchor.set(0.5, 0.5);
        this.bacia2 = this.add.sprite(680, this.baciaInitialY, 'bacia');
        this.bacia2.anchor.set(0.5, 0.5);

        this.palavras = [];
        for(i = 0; i < 4; i++){
            palavra = this.add.sprite(this.startPath[0], this.startPath[1], 'palavras');
            palavra.anchor.set(0.5, 0.5);
            palavra.events.onInputDown.add(this.mouseInputDown, this);
            this.palavras.push(palavra);
        }

    },    

    /**
    *
    * Função inicial para mostrar resumo do jogo. Sempre que o jogador errar 2x.
    * Todos os itens criados no resumo devem ser adicionados ao grupo 'this.groupIntro'
    * 
    **/
    showResumo: function() {

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placarResumo');
        this.tutorialPlacar.anchor.set(0.5,0);
        this.groupIntro = this.add.group();

        this.skipButton = this.add.button(230, 220, "hud", this.skipResumo, this,"skipButton","skipButton","skipButton","skipButton");
        this.tutorialPlacar.addChild(this.skipButton);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextResumo, this);
    },

    /**
    *
    * Função que mostra o texto do resumo.
    * Ao final chama a função global que esconde o resumo
    * 
    **/
    showTextResumo: function() {
        var t1 = "Nem sempre podemos escutar o som das\n palavras que lemos… mas prestando atenção\n nas palavras já conseguimos identificar o\n que ela significa, não é mesmo? Outra vez!";

        var tutorialText1 = this.drawText(this.world.centerX, 35, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 23000);

        this.soundResumo = this.sound.play("soundResumo");

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(this.groupIntro).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
            this.hideResumo();
        }, this);
    },

    /**
    *
    * Controla qual será o proximo level que o jogador irá jogar.
    * Caso o jogo possua mais de 3 perguntas, deve-se adicionar mais itens no 'switch' com contagem corrida de level de 1 a X
    * e fazer a configuração dos detalhes do nível no topo do jogo
    * 
    **/
    showNextLevel: function() {
        console.log("***showNextLevel***");

        var levelNum = this.verifyCurrentLevel();

        console.log("init level", levelNum, this.currentLevel);

        switch(levelNum) {
            case 1:
                this.initLevel1();
            break;
            case 2:
                this.initLevel2();
            break;
            case 3:
                this.initLevel3();
            break;
            case 4:
                this.initLevel4();
            break;
            case 5:
                this.initLevel5();
            break;
            case 6:
                this.initLevel6();
            break;
            case 7:
                this.initLevel7();
            break;
            case 8:
                this.initLevel8();
            break;
            case 9:
                this.initLevel9();
            break;
        }
    },
           
    initLevel1: function() {
        this.level = 1;
        sound = this.sound.play("soundP1");
        sound.onStop.addOnce(function(){
            this.relogioTimer = this.game.time.events.add(5000, this.stopTime, this);
            this.relogio.animations.play('time');
            this.toggleInputs(true);
        }, this);
        this.setupLevel();
        this.showLevel();
    },

    initLevel2: function() {
        this.level = 1;
        sound = this.sound.play("soundP1");
        sound.onStop.addOnce(function(){
            this.relogioTimer = this.game.time.events.add(5000, this.stopTime, this);
            this.relogio.animations.play('time');
            this.toggleInputs(true);
        }, this);
        this.setupLevel();
        this.showLevel();   
    },

    initLevel3: function() {
        this.level = 1;
        sound = this.sound.play("soundP1");
        sound.onStop.addOnce(function(){
            this.relogioTimer = this.game.time.events.add(5000, this.stopTime, this);
            this.relogio.animations.play('time');
            this.toggleInputs(true);
        }, this);
        this.setupLevel();
        this.showLevel();   
    },

    initLevel4: function() {
        this.level = 2;
        sound = this.sound.play("soundP1");
        sound.onStop.addOnce(function(){
            this.relogioTimer = this.game.time.events.add(5000, this.stopTime, this);
            this.relogio.animations.play('time');
            this.toggleInputs(true);
        }, this);
        this.setupLevel();
        this.showLevel();   
    },

    initLevel5: function() {
        this.level = 2;
        sound = this.sound.play("soundP1");
        sound.onStop.addOnce(function(){
            this.relogioTimer = this.game.time.events.add(5000, this.stopTime, this);
            this.relogio.animations.play('time');
            this.toggleInputs(true);
        }, this);
        this.setupLevel();
        this.showLevel();   
    },

    initLevel6: function() {
        this.level = 2;
        sound = this.sound.play("soundP1");
        sound.onStop.addOnce(function(){
            this.relogioTimer = this.game.time.events.add(5000, this.stopTime, this);
            this.relogio.animations.play('time');
            this.toggleInputs(true);
        }, this);
        this.setupLevel();
        this.showLevel();   
    },

    initLevel7: function() {
        this.level = 3;
        sound = this.sound.play("soundP1");
        sound.onStop.addOnce(function(){
            this.relogioTimer = this.game.time.events.add(5000, this.stopTime, this);
            this.relogio.animations.play('time');
            this.toggleInputs(true);
        }, this);
        this.setupLevel();
        this.showLevel();   
    },

    initLevel8: function() {
        this.level = 3;
        sound = this.sound.play("soundP1");
        sound.onStop.addOnce(function(){
            this.relogioTimer = this.game.time.events.add(5000, this.stopTime, this);
            this.relogio.animations.play('time');
            this.toggleInputs(true);
        }, this);
        this.setupLevel();
        this.showLevel();   
    },

    initLevel9: function() {
        this.level = 3;
        sound = this.sound.play("soundP1");
        sound.onStop.addOnce(function(){
            this.relogioTimer = this.game.time.events.add(5000, this.stopTime, this);
            this.relogio.animations.play('time');
            this.toggleInputs(true);
        }, this);
        this.setupLevel();
        this.showLevel();   
    },

    mouseInputDown:function(elem){ // elem = elemento que foi clicado
        console.log("***mouseInputDown***");
        this.toggleInputs(false);
        if(this.relogioTimer != null){
            this.game.time.events.remove(this.relogioTimer);
            this.relogioTimer = null;
        }
        this.relogio.animations.stop('time', false);
        this.checkGame(elem);
    },

    toggleInputs: function(flag){
        for(i = 0; i < this.palavras.length; i++)
            this.palavras[i].inputEnabled = flag;
    },

    checkGame:function(elem){
        console.log("***checkGame***");

        if(elem == this.correctPalavra){
            console.log("CORRETA");
            sound = this.sound.play("hitAcerto");
            this.personagens.animations.play('cheer');
            sound.onStop.addOnce(function(){
                this.animatePalavra(elem, function(){
                    this.resetLevel(this.clickRightButton);
                });
            }, this);
        } else {
            console.log("ERRADA");
            sound = this.sound.play("hitErro");
            sound.onStop.addOnce(function(){
                this.resetLevel(this.clickWrongButton);
            }, this);
        }
    },

    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção CORRETA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickRightButton: function(target) {
        this.onPlayerSuccess();
        this.gotoNextLevel();
    },
    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção ERRADA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickWrongButton: function(target) {
        if(this.currentLocalErrors > 0) {
    
            this.currentLocalErrors--;

            this.resetLevel(this.showNextLevel);
            return;
        }
        
        this.onPlayerError();
        
        switch(this.lives) {
            case 1: // mostra dica 1
                this.createDelayTime(500, function() {
                    this.sound.play("soundDica").onStop.add(function(){
                        this.createDelayTime(1500, this.onCompleteShowDica);
                    }, this);
                }); 
                
            break;
            case 0: // toca som de resumo
                this.lives = 0;
                this.createDelayTime(500, function() {
                    this.showResumo(); 
                });
                
            break;
        }
        this.updateLivesText();

    },

    resetLevel:function(callback){
        console.log("***resetLevel***");
        
        this.personagens.animations.play('idle');

        for(i = 0; i < this.palavras.length; i++){
            this.add.tween(this.palavras[i]).to({x: this.startPath[0], y: this.startPath[1]}, 500, Phaser.Easing.Linear.None, true);
                
        }
        this.add.tween(this.bacia1).to({y: this.baciaInitialY}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.bacia2).to({y: this.baciaInitialY}, 500, Phaser.Easing.Linear.None, true);

        tween = this.add.tween(this.relogio).to({alpha: 0}, 600, Phaser.Easing.Linear.None, true);
        if(callback != null){
            tween.onComplete.add(callback, this);
        }
    },

    showLevel: function(callback){
        console.log("***showLevel***");
        
        for(i = 0; i < this.level+1; i++){
            this.palavras[i].alpha = 1;
            this.palavras[i].scale.set(1, 1);
            tween = this.add.tween(this.palavras[i]).to({x: this.bezierStart[i][0], y: this.bezierStart[i][1]}, 500, Phaser.Easing.Linear.None, true);
        }
        this.add.tween(this.bacia1).to({y: this.baciaY}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.bacia2).to({y: this.baciaY}, 500, Phaser.Easing.Linear.None, true);

        this.relogio.frame = 0;
        tween = this.add.tween(this.relogio).to({alpha: 1}, 600, Phaser.Easing.Linear.None, true);
        if(callback != null)
            tween.onComplete.add(callback, this);
    },

    /**
    *
    * Função disparada como callback case o usuario ainda possua mais de uma chance de clicar no item antes de ser considerado como erro
    * 
    **/
    onErrorChance: function(target) {

    },

    addIntroGroup:function(elem){
        this.groupIntro.add(elem);
    },

    addLevelGroup:function(elem){
        this.groupLevel[this.currentLevel].add(elem);    
    },

    bringPalavras: function(callback){
        for(i = 0; i < this.level+1; i++){
            tween = this.add.tween(this.palavras[i]).to({x: this.bezierStart[i][0], y:this.bezierStart[i][1]}, 1500, Phaser.Easing.Linear.None, true);
            if(i == this.level && callback != null)
                tween.onComplete.add(callback, this);
        }
    },

    animatePalavra: function(palavra, callback){
        i = this.palavras.indexOf(palavra);
        startX = this.bezierStart[i][0];
        startY = this.bezierStart[i][1];
        endX = this.bezierEnd[0];
        endY = this.bezierEnd[1];
        firstBezierPointX = startX;
        firstBezierPointY = endY;

        this.add.tween(this.palavras[i].scale).to({x: 0.1, y: 0.1}, 1000, Phaser.Easing.Linear.None, true);
        tween = this.add.tween(this.palavras[i]).to({x: [startX, firstBezierPointX, endX], y: [startY, firstBezierPointY, endY], alpha: 0}, 1000,Phaser.Easing.Quadratic.Out, true);
        tween.interpolation(function(v, k){return Phaser.Math.bezierInterpolation(v, k);});
        if(callback != null)
            tween.onComplete.add(callback, this);
    },

    stopTime: function(){
        console.log("***time's up!***");
        this.relogioTimer = null;
        this.game.time.events.remove(this.relogioTimer);
        if(this.palavras[0].inputEnabled){

            this.relogio.animations.stop('time', false);
            sound = this.sound.play("hitErro");

            if(this.currentLocalErrors > 0) {
                this.currentLocalErrors--;
            } else {
                this.onPlayerError();
            }
                        
            if(this.lives == 0){
                this.createDelayTime(1500, function() {
                    this.resetLevel(this.showResumo);
                });
            } else {
                this.createDelayTime(1500, function() {
                    this.resetLevel(this.showNextLevel);
                });
            }
            this.updateLivesText();
        }
    }

};