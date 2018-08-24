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
            

        this.TEMPO_INTRO = 11000;
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
        this.galhos = [];

        this.keyboard_permission = false;
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

    keyPress: function(elem){
        console.log("entrou aqui");
        if( this.keyboard_permission ){
            console.log("Valor colocado: " + elem);
            console.log("Valor certo: "+ this.right_keyboard_answear);
            if(elem == this.right_keyboard_answear) this.clickRightButton(elem);
            else this.clickWrongButton(elem);
        }
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

        var t1 = "Nossos amigos passaram por \nmuitos desafios para ajudar a \nárvore da vida que, agradecida, \ngravou todas as frases ditas \npor eles. ";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 22, "left");

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

        this.background = this.add.sprite( -340, -420, 'background');

        this.galhos[0] = this.add.sprite(-90, 280, "galho_1");
        this.galhos[0].anchor.set(0.5,0.5);
        this.galhos[1] = this.add.sprite(1090, 280, "galho_2");
        this.galhos[1].anchor.set(0.5,0.5);

        this.poly = this.add.sprite(140, 400, "poly_anim");
        this.poly.animations.add('idle', this.math.numberArray(0,28), 18, true);
        this.poly.animations.add('comemora', this.math.numberArray(30,59), 18, true);
        this.poly.animations.play('idle');
        this.poly.scale.set( 1.0, 1.0);

        this.fred = this.add.sprite(260, 380, "fred_anim");
        this.fred.animations.add('idle', this.math.numberArray(0,28), 18, true);
        this.fred.animations.add('comemora', this.math.numberArray(30,59), 18, true);
        this.fred.animations.play('idle');
        this.fred.scale.set( 1.0, 1.0);

        this.juninho = this.add.sprite(380, 420, "juninho_anim");
        this.juninho.animations.add('idle', this.math.numberArray(0,28), 18, true);
        this.juninho.animations.add('comemora', this.math.numberArray(30,59), 18, true);
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

        var t2 = "Temos que ler as que aparecerem e dizer \n quantas palavras ela possui, é só clicar \n no número certo em nosso teclado. Ah, \n cuidado com o tempo! Vamos?" ;
        
        this.tutorialText = this.drawText(this.world.centerX, 30, t2, 22, "left");
        this.groupIntro.add(this.tutorialText);

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX, 300, 6) );
        this.buttons[0].anchor.set(0.5,0.5);

        this.buttons[1] = this.add.sprite(this.buttons[0].x - 149, this.buttons[0].y + 2, "intro_1");
        this.buttons[1].anchor.set(0.5,0.5);
        this.buttons[1].alpha = 0;
        this.buttons[2] = this.add.sprite(this.buttons[0].x - 62, this.buttons[0].y - 1, "intro_2");
        this.buttons[2].anchor.set(0.5,0.5);
        this.buttons[2].alpha = 0;
        this.buttons[3] = this.add.sprite(this.buttons[0].x + 2, this.buttons[0].y - 1, "intro_3");
        this.buttons[3].anchor.set(0.5,0.5);
        this.buttons[3].alpha = 0;
        this.buttons[4] = this.add.sprite(this.buttons[0].x + 39, this.buttons[0].y - 1, "intro_4");
        this.buttons[4].anchor.set(0.5,0.5);
        this.buttons[4].alpha = 0;
        this.buttons[5] = this.add.sprite(this.buttons[0].x + 124.5, this.buttons[0].y + 3, "intro_5");
        this.buttons[5].anchor.set(0.5,0.5);
        this.buttons[5].alpha = 0;

        this.groupIntro.add(this.buttons[0]);
        this.groupIntro.add(this.buttons[1]);
        this.groupIntro.add(this.buttons[2]);
        this.groupIntro.add(this.buttons[3]);
        this.groupIntro.add(this.buttons[4]);
        this.groupIntro.add(this.buttons[5]);

        this.groupIntro.add( this.buttons[6] = this.add.sprite( this.world.centerX + 200, this.world.centerY + 200, "intro_keyboard") );
        this.buttons[6].anchor.set(0.5,0.5);
        this.buttons[6].scale.set(0.8,0.8);
        
        this.groupIntro.add( this.buttons[7] = this.add.sprite( this.world.centerX + 200, this.world.centerY + 210, "intro_button") );
        this.buttons[7].anchor.set(0.5,0.5);
        this.buttons[7].scale.set(0.8,0.8);
        this.buttons[7].alpha = 0;
        
        this.groupIntro.add(this.buttons[8] = this.add.sprite( this.world.centerX + 150, this.world.centerY + 260, "intro_dedo") );
        this.buttons[8].anchor.set(0.5,0.5);
        this.buttons[8].scale.set(0.8,0.8);
        this.buttons[8].alpha = 0;

        this.createDelayTime( 100, function() {
            
            this.showFinishedLiveTutorial();

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
        var t1 = " ENTRE DUAS PALAVRAS SEMPRE HAVERÁ UM \n ESPAÇO, E AO FINAL DA FRASE UMA PONUTAÇÃO. \n O QUE CONTAMOS É TUDO QUE NÃO É \n ESPAÇO NEM PONTUAÇÃO, OU SEJA, AS \n PALAVRAS. VAMOS LÁ!";
        
        var tutorialText = this.drawText(this.world.centerX, 30, t1, 22, "center");
            tutorialText.alpha = 0;

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.setDebugAudio("soundResumo");

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

        this.poly.animations.play('idle');
        this.fred.animations.play('idle');
        this.juninho.animations.play('idle');

        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        var questionList = [ null,
            "A primeira frase é uma pergunta, \n então termina com um ponto de interrogação. \n Quantas palavras ela tem? 10 segundos!",
            "Essa frase é uma afirmação e ela \n termina com um ponto final. Vamos que só \n teremos 9 segundos!",
            "Legal! Essa frase aqui termina com \n uma exclamação! Mas cuidado, só teremos \n 8 segundos. Já!"
        ];

        this.add.tween(this.galhos[0]).to({x:200}, 1200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.galhos[1]).to({x:800}, 1200, Phaser.Easing.Linear.None, true);

        this.imageQuestion = this.drawText(this.world.centerX, 30, questionList[num]);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    createTimer: function() {

        var _timers = [null, 10, 9, 8];

        var totalTimer = _timers[this.currentLevel];

        this.gameTimer = this.game.time.events.add(totalTimer*1000, this.clickWrongButton, this);

        this.textTimerShadow =  this.add.bitmapText(this.world.centerX,  540, "JandaManateeSolid", totalTimer.toString(), 48);
        this.textTimerShadow.tint = 0x010101;
        this.textTimer =        this.add.bitmapText(this.world.centerX+2,542, "JandaManateeSolid", totalTimer.toString(), 48);
    },
    updateTimer: function() {
        if(this.gameTimer) {
            //console.log(this.game.time.events.duration);
            var _time = parseInt(this.game.time.events.duration/1000)+1;
            this.textTimerShadow.text = this.textTimer.text = _time.toString();
        }
    },
    removeTimer: function() {

        if(this.gameTimer) {
            this.game.time.events.remove(this.gameTimer);
            this.gameTimer = null;
        }

        if(this.textTimerShadow != null) {
            this.textTimerShadow.destroy();
            this.textTimer.destroy();
        }

    },


    initLevel1: function() {

        var random_item = this.rnd.integerInRange(0,2);

        this.createTimer();

        if(random_item == 0) this.right_keyboard_answear = 4;
        else if (random_item == 1) this.right_keyboard_answear = 5;
        else this.right_keyboard_answear = 6;

        console.log("Random é:" + random_item);
        console.log("O valor certo é:" + this.right_keyboard_answear);

        console.log(" Level 1 ");

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX, 300, random_item) );

        this.groupFront = this.add.group();
        this.world.bringToTop(this.hud);

        this.groupFront.add(this.galhos[0]);
        this.groupFront.add(this.galhos[1]);
        this.groupFront.add(this.juninho);
        this.groupFront.add(this.fred);
        this.groupFront.add(this.poly);

        this.add.tween(this.galhos[0]).to({x:-90}, 1200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.galhos[1]).to({x:1090}, 1200, Phaser.Easing.Linear.None, true);

        this.createDelayTime( 500, function(){
            this.keyboard_permission = true;
        });

    },

    

    initLevel2: function() {

        var random_item = this.rnd.integerInRange(3,5);

        this.createTimer();

        if(random_item == 3) this.right_keyboard_answear = 6;
        else if (random_item == 4) this.right_keyboard_answear = 7;
        else this.right_keyboard_answear = 4;

        console.log("Random é:" + random_item);
        console.log("O valor certo é:" + this.right_keyboard_answear);

        console.log(" Level 2 ");

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX, 300, random_item) );

        this.groupFront = this.add.group();
        this.world.bringToTop(this.hud);

        this.groupFront.add(this.galhos[0]);
        this.groupFront.add(this.galhos[1]);
        this.groupFront.add(this.juninho);
        this.groupFront.add(this.fred);
        this.groupFront.add(this.poly);

        this.add.tween(this.galhos[0]).to({x:-90}, 1200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.galhos[1]).to({x:1090}, 1200, Phaser.Easing.Linear.None, true);

        this.createDelayTime( 500, function(){
            this.keyboard_permission = true;
        });

    },

    initLevel3: function() {

        var random_item = this.rnd.integerInRange(6,8);

        this.createTimer();

        if(random_item == 6) this.right_keyboard_answear = 5;
        else if (random_item == 7) this.right_keyboard_answear = 6;
        else this.right_keyboard_answear = 8;

        console.log("Random é:" + random_item);
        console.log("O valor certo é:" + this.right_keyboard_answear);

        console.log(" Level 3 ");

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX, 300, random_item) );

        this.groupFront = this.add.group();
        this.world.bringToTop(this.hud);

        this.groupFront.add(this.galhos[0]);
        this.groupFront.add(this.galhos[1]);
        this.groupFront.add(this.juninho);
        this.groupFront.add(this.fred);
        this.groupFront.add(this.poly);

        this.add.tween(this.galhos[0]).to({x:-90}, 1200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.galhos[1]).to({x:1090}, 1200, Phaser.Easing.Linear.None, true);

        this.createDelayTime( 500, function(){
            this.keyboard_permission = true;
        });
    },

    /**
    *
    * Controle de Perguntas, que serão mostradas no jogo
    * 
    **/
    createButton: function( x, y, imagem) {

        btn = this.add.button(x,y, 'palavras', null, this, imagem,imagem,imagem);

        this.correctItem = btn;

        btn.frame = imagem;
        btn.anchor.set(0.5,0.5);
        btn.alpha = 0;
        btn.scale.set(0.5,0.5);

        this.add.tween(btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(btn.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Linear.None, true);

        return btn;
    },
    

    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção CORRETA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickRightButton: function(target) {

        this.removeTimer();

        if(target != null && target.alpha < 1) {
            return;
        }

        
        this.keyboard_permission = false;

        this.onPlayerSuccess();
        
        this.poly.animations.play('comemora');
        this.fred.animations.play('comemora');
        this.juninho.animations.play('comemora');

        this.sound.play("hitAcerto");
        this.clearButtons(true);

        this.showCorrectName(true);
    },




    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção ERRADA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickWrongButton: function(target) {

        this.removeTimer();

        if(target != null && target.alpha < 1) {
            return;
        }
        
        if(this.currentLocalErrors > 0) { 
            this.currentLocalErrors--;

            this.sound.play("hitErro");
            this.onErrorChance(target);
            return;
        }

        this.keyboard_permission = false;
        
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

    update: function () {   

        this.updateTimer();
        
    }

};





