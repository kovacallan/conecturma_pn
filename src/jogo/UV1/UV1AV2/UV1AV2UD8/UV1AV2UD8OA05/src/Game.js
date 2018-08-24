/** 
* version 1.0.2
**/

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
            

        this.TEMPO_INTRO = 4000;
        this.ENABLE_CALL_TO_ACTION = false;


        // quantidade de perguntas que tem em cada nivel
        this.totalLevel1 = 1;
        this.totalLevel2 = 1;
        this.totalLevel3 = 1;

        // quantidade total de erros permitido em cada nivel
        // ex: se valor está definido para 2 erros, usuario pode errar 2x e na terceira é considerado errado
        this.totalErro1 = 0;
        this.totalErro2 = 0;
        this.totalErro3 = 0;

        /*****************************************************************/
        this.corrects_position = [];
        this.right_total = 1;
        this.right_player = 0;

        this.click_permission = false;
        this.right_keyboard_answear;
        this.input.keyboard.addCallbacks(this, null, null, this.keyPress);

        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

        this.createScene();
        this.showIntro();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();

    },

    /**
    *
    * Cria um sprite com uma animação simples em loop na velocidade padrão usando todos os frames que tiverem no objeto
    *
    **/
    createAnimation: function( x, y, name, scaleX, scaleY) { 
        var spr = this.add.sprite(x,y, name);
        spr.animations.add('idle', null, 18, true);
        spr.animations.play('idle');
        spr.scale.set( scaleX, scaleY);

        return spr;
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

        var t1 = "FORMAS GEOMÉTRICAS FAZEM\nPARTE DO NOSSO DIA-A-DIA! ";
        var tutorialText = this.drawText(this.world.centerX+60, 70, t1, 22, "left");

        tutorialText.alpha = 0;

        this.groupIntro.add(tutorialText);

        var kim = this.showKim(this.TEMPO_INTRO);

        
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);


        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
        });
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

        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
    },

    /**
    *
    * Esconde o texto da pergunta quando tiver e esconde a placa que mostra o texto.
    * Ao final do efeito executa a função {callback} se houver
    * 
    **/
    hideLevel: function(callback) {
        if(this.imageQuestion == null) {
            return;
        }

        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        if(callback != null) {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
        } else {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500);
        }
    },

    /**
    *
    * Função de atalho para mostrar o level.
    * Se ainda houver level, e se jogador não tiver acertado mais de 2x ele irá para o proximo level
    * Caso contrario é direcionado ao game over de vitória
    * 
    **/
    hideAndShowLevel: function() {

        this.hideLevel(function() {

            if(this.currentLevel <= 3 && this.corrects <= 2) {

                this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);

            } else {
                this.gameOverMacaco();
            }
        });
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
    * Remove ações do botão e direciona para o proximo level se {gotoNext} for verdadeiro
    * 
    **/
    showCorrectName: function(gotoNext) {

        this.removeButtonAction();

        if(gotoNext) {
            this.createDelayTime( 2000, this.gotoNextLevel);
        }
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

        this.background = this.add.sprite( -260, -540, 'background');

        this.bumba = this.add.sprite(40, 400, "bumba_anim");
        this.bumba.animations.add('idle', this.math.numberArray(0,16), 18, true);
        this.bumba.animations.add('comemora', this.math.numberArray(17,39), 18, true);
        this.bumba.animations.play('idle');
        this.bumba.scale.set( 1.0, 1.0);

        this.poly = this.add.sprite(860, 400, "poly_anim");
        this.poly.animations.add('idle', this.math.numberArray(0,16), 18, true);
        this.poly.animations.add('comemora', this.math.numberArray(17,39), 18, true);
        this.poly.animations.play('idle');
        this.poly.scale.set( 1.0, 1.0);

        this.fred = this.add.sprite(700, 300, "fred_anim");
        this.fred.animations.add('idle', this.math.numberArray(0,35), 18, true);
        this.fred.animations.add('comemora', this.math.numberArray(50,89), 18, true);
        this.fred.animations.play('idle');
        this.fred.scale.set( 1.0, 1.0);

        this.juninho = this.add.sprite(770, 380, "juninho_anim");
        this.juninho.animations.add('idle', this.math.numberArray(0,16), 18, true);
        this.juninho.animations.add('comemora', this.math.numberArray(17,39), 18, true);
        this.juninho.animations.play('idle');
        this.juninho.scale.set( 1.0, 1.0);
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {

        this.add.tween(this.tutorialPlacar).to({y: -80}, 1000, Phaser.Easing.Linear.None, true, 500);

        var t2 = "ELAS ESTÃO PRESENTES NO PRÉDIOS E CASAS, NOS\nBRINQUEDOS E OBJETOS ESCOLARES, E ATÉ NA\nNATUREZA! NOSSOS AMIGOS DESCOBRIRAM ISSO NO\nDECORRER DAS AVENTURAS QUE VIVERAM\nATÉ AGORA." ;
        var t3 = "VAMOS AJUDÁ-LOS,IDENTIFICANDO AS\nFORMAS GEOMÉTRICAS NOS CENÁRIOS\nDESSE DESAFIO? ";
        
        this.tutorialText = this.drawText(this.world.centerX, 20, t2, 22, "left");
        this.groupIntro.add(this.tutorialText);

        this.createDelayTime( 15000, function() {
            this.add.tween(this.tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.tutorialText = this.drawText(this.world.centerX, 30, t3, 22, "left");
                this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true)
                this.groupIntro.add(this.tutorialText);
            }, this);
        },this);
        this.createDelayTime( 22000, function() {
            
            this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);
            //this.showFinishedLiveTutorial();

        }, this);
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showFinishedLiveTutorial:function() {

        var click = this.add.sprite(this.buttons[8].x+20, this.buttons[8].y-65, "clickAnimation");
            click.animations.add('idle', null, 18, true);
            click.animations.play('idle');
            click.alpha = 0;
            this.groupIntro.add(click);

        this.createDelayTime( 100, function() {
            this.add.tween(this.buttons[1]).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 500);
        });

        this.createDelayTime( 2000, function() {
            this.add.tween(this.buttons[1]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.buttons[2]).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 500);
        });

        this.createDelayTime( 4000, function() {
            this.add.tween(this.buttons[2]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.buttons[3]).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 500);
        });

        this.createDelayTime( 6000, function() {
            this.add.tween(this.buttons[3]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.buttons[4]).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 500);
        });

        this.createDelayTime( 8000, function() {
            this.add.tween(this.buttons[4]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.buttons[5]).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 500);
        });

        this.createDelayTime( 10000, function() {
            this.add.tween(this.buttons[5]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500);

            this.add.tween(this.buttons[7]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.buttons[8]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(
                function(){
                    click.alpha = 1;
            });

        });
        // remover tudo
        this.createDelayTime( 14000, function() {

            click.alpha = 0;
            click.destroy();

            this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);
        });
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
        var t1 = " ENCONTRAMOS FORMAS GEOMÉTRICAS EM VÁRIOS\nLUGARES, ANIMAIS, PLANTAS E OBJETOS. NOS PRÉDIOS\nE CASAS, AS JANELAS E PORTAS, TEM FORMATO\nDE[RETÂNGULO], POR EXEMPLO.";
        var t2 = " NOS BRINQUEDOS ENCONTRAMOS [CÍRCULOS], [RETÂNGULOS],\n[QUADRADOS]. O MIOLO DAS FLORES É REDONDO COMO O\n[CÍRCULO], UMA BORBOLETA PODE TER DESENHOS\nGEOMÉTRICOS EM SUAS ASAS!";
        
        var tutorialText = this.drawText(this.world.centerX, 30, t1, 22, "center");
            tutorialText.alpha = 0;

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.setDebugAudio("soundResumo");

        this.createDelayTime(15000,function(){
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                tutorialText = this.drawText(this.world.centerX, 30, t2, 21, "center");
                this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            }, this);
        }, this);
 
        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
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

        var levelNum = this.verifyCurrentLevel();

        this.right_player = 0;

        console.log("init level", levelNum, this.currentLevel);

        switch(levelNum) {
            case 1:

                this.showQuestion(1);
                if(this.showCallToAction) {
                    this.initLevel1();
                } else {
                    this.sound.play("soundP1").onStop.addOnce(this.initLevel1, this);
                }
            break;
            case 2:

                this.showQuestion(2);
                if(this.showCallToAction) {
                    this.initLevel2();
                } else {
                    this.sound.play("soundP2").onStop.addOnce(this.initLevel2, this);
                }
            break;
            case 3:

                this.showQuestion(3);
                if(this.showCallToAction) {
                this.initLevel3();
                } else {
                    this.sound.play("soundP3").onStop.addOnce(this.initLevel3, this);
                }
            break;
        }
        this.showCallToAction = false;
    },

    /**
    *
    * Controle de Perguntas, que serão mostradas no jogo
    * 
    **/
    showQuestion: function(num) {

        this.bumba.animations.play('idle');
        this.poly.animations.play('idle');
        this.fred.animations.play('idle');
        this.juninho.animations.play('idle');

        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        var questionList = [ null,
            "Encontrem um quadrado neste cenário!",
            "Encontrem 2 triângulos neste cenário!",
            "Agora encontrem um retângulo e um\ncírculo neste cenário!"
        ];

        this.imageQuestion = this.drawText(this.world.centerX, 30, questionList[num]);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    initLevel1: function() {

        this.corrects_position = [];

        this.right_total = 1;

        console.log(" Level 1 ");

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX, -100, 0) );

        this.hud.add(this.placar);
        this.hud.add(this.imageQuestion);

        this.groupFront = this.add.group();
        this.world.bringToTop(this.hud);

        this.add.tween(this.buttons[0]).to({y: this.world.centerY - 40}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.click_permission = true;
        }, this);

    },

    

    initLevel2: function() {

        this.corrects_position = [];

        this.right_total = 2;

        console.log(" Level 1 ");

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX, -100, 1) );

        this.hud.add(this.imageQuestion);
        this.hud.add(this.placar);

        this.groupFront = this.add.group();
        this.world.bringToTop(this.hud);

        this.add.tween(this.buttons[0]).to({y: this.world.centerY - 40}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.click_permission = true;
        }, this);

    },

    initLevel3: function() {

        this.corrects_position = [];

        this.right_total = 2;

        console.log(" Level 1 ");

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX, -100, 2) );

        this.hud.add(this.imageQuestion);
        this.hud.add(this.placar);

        this.groupFront = this.add.group();
        this.world.bringToTop(this.hud);

        this.add.tween(this.buttons[0]).to({y: this.world.centerY - 40}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.click_permission = true;
        }, this);
    },

    /**
    *
    * Controle de Perguntas, que serão mostradas no jogo
    * 
    **/
    createButton: function( x, y, imagem) {

        btn = this.add.button(x,y, 'quadros', this.click_verification, this, imagem,imagem,imagem);

        this.correctItem = btn;

        btn.frame = imagem;
        btn.anchor.set(0.5,0.5);
        btn.alpha = 0;
        btn.scale.set(0.5,0.5);

        this.add.tween(btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(btn.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Linear.None, true);

        return btn;
    },

    click_verification: function(elem){
        if(this.click_permission){
            if(this.input.x < elem.x) console.log("Valor de X: -" + (elem.x - this.input.x));
            else console.log("Valor de X: " + (this.input.x - elem.x));
            if(this.input.y < elem.y) console.log("Valor de Y: -" + (elem.y - this.input.y));
            else console.log("Valor de y: " + (this.input.y - elem.y));
        }

        if(this.click_permission && this.hitmap(-215,234,0,248, elem)){
            if(this.currentLevel == 1){
                if(this.hitmap(-114,-26,117,182, elem)){ this.clickRightButton(0); }
                else if (this.hitmap(55,75,178,194, elem)){ this.clickRightButton(1); }
                else this.clickWrongButton();
            } else if(this.currentLevel == 2){
                if(this.hitmap(-105,-65,6,51, elem)){ this.clickRightButton(0); }
                else if (this.hitmap(-153,-130,39,62, elem)){ this.clickRightButton(1); }
                else if (this.hitmap(-130,-109,40,58, elem)){ this.clickRightButton(2); }
                else if (this.hitmap(-197,-174,46,66, elem)){ this.clickRightButton(3); }
                else if (this.hitmap(-43,0,5,30, elem)){ this.clickRightButton(4); }
                else this.clickWrongButton();
            } else if(this.currentLevel == 3){
                if(this.hitmap(96,126,105,127, elem)){ this.clickRightButton(0); }
                else if (this.hitmap(85,100,33,47, elem)){ this.clickRightButton(1); }
                else this.clickWrongButton();
            }
        }
    },
    
    hitmap: function(x_inicial,x_final,y_inicial,y_final, elem){
        if(this.input.x > elem.x + x_inicial && this.input.x < elem.x + x_final && this.input.y > elem.y + y_inicial && this.input.y < elem.y + y_final){
            return true;
        }
    },

    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção CORRETA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickRightButton: function(value) {

        console.log(" O value "+value+" esta: " +this.corrects_position[value])

        if(this.corrects_position[value] == null){

            this.right_player++;

            this.sound.play("hitAcerto");

            if(this.right_player == this.right_total){

                this.click_permission = false;

                this.onPlayerSuccess();
                
                this.bumba.animations.play('comemora');
                this.poly.animations.play('comemora');
                this.fred.animations.play('comemora');
                this.juninho.animations.play('comemora');

                this.clearButtons(true);

                this.showCorrectName(true);

            }

            this.corrects_position[value] = 1;
        }
    },




    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção ERRADA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickWrongButton: function(target) {

        if(target != null && target.alpha < 1) {
            return;
        }
        
        if(this.currentLocalErrors > 0) { 
            this.currentLocalErrors--;

            this.sound.play("hitErro");
            this.onErrorChance(target);
            return;
        }

        this.click_permission = false;
        
        this.onPlayerError();
        
        this.sound.play("hitErro");
        this.clearButtons(false);
        
        switch(this.lives) {
            case 1: // mostra dica 1
                this.hideLevel(function() {
                    this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
                });
            break;
            case 0: // toca som de resumo
                this.lives = 0;
                this.hideLevel();
                this.showResumo();
            break;
        }
        this.updateLivesText();
    },

    /**
    *
    * Função disparada como callback case o usuario ainda possua mais de uma chance de clicar no item antes de ser considerado como erro
    * 
    **/
    onErrorChance: function(target) {

    },

};





