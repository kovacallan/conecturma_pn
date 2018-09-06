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

        /*editor*/
        this.pointX = [];
        this.pointY = [];
        //this.gradeGuia(1000, 600);            

        this.TEMPO_INTRO = 18000;
        this.ENABLE_CALL_TO_ACTION = true;
        this.ENABLE_PLACAR = true; // para desabilitar o placar 


        // quantidade de perguntas que tem em cada nivel
        this.totalLevel1 = 2;
        this.totalLevel2 = 2;
        this.totalLevel3 = 1;

        // quantidade total de erros permitido em cada nivel
        // ex: se valor está definido para 2 erros, usuario pode errar 2x e na terceira é considerado errado
        this.totalErro1 = 0;
        this.totalErro2 = 0;
        this.totalErro3 = 0;

        /*****************************************************************/
        this.keyboard_permission = false;
        this.right_keyboard_answear;
        this.input.keyboard.addCallbacks(this, null, null, this.keyPress);

        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];


        this.groupLevel = [null,1,2,3];

        this.num_frases_level1 = [0,1,2,3,4];
        this.num_frases_level2 = [0,1,2,3,4,5];
        this.num_frases_level3 = [0,1,2];

        this.img_frases_level1 = [1,2,3,4,5];
        this.img_frases_level2 = [6,7,8,10,11,12];
        this.img_frases_level3 = [13,14,15];

        this.frases_level1 = [];
        this.frases_level1[0]="Escolham a carta que tem [uma esfera]!";
        this.frases_level1[1]="Escolham a carta que tem [um cubo]!";
        this.frases_level1[2]="Escolham a carta que tem \n[um paralelepípedo]!";
        this.frases_level1[3]="Escolham a carta que tem [dois cubos]!";
        this.frases_level1[4]="Escolham a carta que tem [três cubos]!";


        this.audio_level1 = [];
        this.audio_level1[0]="P1_1";
        this.audio_level1[1]="P1_2";
        this.audio_level1[2]="P1_3";
        this.audio_level1[3]="P1_4";
        this.audio_level1[4]="P1_5";
       
        this.frases_level2 = [];
        this.frases_level2[0]="Escolham a carta que tem [dois cubos]!";
        this.frases_level2[1]="Escolham a carta que tem [três cubos]!";
        this.frases_level2[2]="Escolham a carta que tem [três esferas]!";
        this.frases_level2[3]="Escolham a carta que tem [cinco esferas]!";
        this.frases_level2[4]="Escolham a carta que tem \n[quatro paralelepípedos]!";
        this.frases_level2[5]="Escolham a carta que tem \n[dois paralelepípedos]!";

        this.audio_level2 = [];
        this.audio_level2[0]="P2_1";
        this.audio_level2[1]="P2_2";
        this.audio_level2[2]="P2_3";
        this.audio_level2[3]="P2_4";
        this.audio_level2[4]="P2_5";
        this.audio_level2[5]="P2_6";
        
        this.frases_level3 = [];
        this.frases_level3[0] = "Escolham a carta que tem [um cubo] \ne [uma esfera]!";
        this.frases_level3[1] ="Escolham a carta que tem [um cubo] \ne [um paralelepípedo]!";
        this.frases_level3[2] ="Escolham a carta que tem [uma esfera] \ne [um paralelepípedo]!";

        this.audio_level3 = [];
        this.audio_level3[0]="P3_1";
        this.audio_level3[1]="P3_2";
        this.audio_level3[2]="P3_3";


        

        this.resetRandom();
        this.createScene();
        this.showIntro();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();

        
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
        console.log("*** showTextoIntro *** ");

        var t1 = "BUMBA está jogando um [jogo da] \n[memória], vamos brincar também?";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t2 = "Para isso temos que clicar nas cartas \ncom os [poliedros] que eu pedir, ok? Teremos a \n[esfera], o [cubo] e o [paralelepípedo]! \nEstão Prontos? Vamos lá! ";
        var tutorialText1 = this.drawText(this.world.centerX, 30, t2, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);
        
        var kim = this.showKim(5000);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);


        this.createDelayTime(5000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText1).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
        });

        this.createDelayTime(this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText1).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);//.onComplete.add(this.showFinishedLiveTutorial, this);
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

        if(this.ENABLE_PLACAR){
            this.createDelayTime(500, function() {
                this.showNextLevel();
            });

        }else{          
            this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
        } 
    },

    /**
    *
    * Esconde o texto da pergunta quando tiver e esconde a placa que mostra o texto.
    * Ao final do efeito executa a função {callback} se houver
    * 
    **/
    hideLevel: function(callback) {
        console.log("*** hideLevel ***");
        //console.log("callback " + callback);
        if(this.imageQuestion == null) {
            console.log("*** hideLevel imagem null***");
            return;
        }

        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        if(callback != null) {
            console.log("*** hideLevel null***");
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
        } else {
            console.log("*** hideLevel else ***");
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
        console.log("*** hideAndShowLevel *** " + this.showCallToAction);
        this.hideLevel(function() {       
            if(this.currentLevel <= 3 && this.corrects <= 2) {
                if(this.ENABLE_PLACAR){
                    this.createDelayTime(1000, function() {
                        this.showNextLevel();
                    });
                }else{
                    this.createDelayTime(1000, function() {
                        this.showNextLevel();
                    });
                    //this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                }
                
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

        //this.removeButtonAction();

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
        //this.background = this.addSpriteMeu('background',100,-100,0);
        this.background = this.add.sprite(-202,-148, 'background');
        //this.initLevel3();
        //this.showResumo();
        //this.bumba1= this.addSpriteMeu('bumba_anim_happy',100,300,1);
        //this.bumba1.anchor.set(0.5,0.5);
        this.bumba = this.add.sprite(914, 454, "bumba_anim");
        this.bumba.animations.add('idle', null, 18, true);
        this.bumba.animations.play('idle');
        //this.bumba.scale.set(0.5, 0.5);
        this.bumba.anchor.set(0.5,0.5);

        //this.initGame();
        //this.showResumo();
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");
        this.fraseFrame = [1,4,5]; // esfera,2cubos, 3cubos
        

        this.level(0);// condicao para inserir no grupo de level 
        this.arrow = this.add.sprite(430,190, 'arrow');
        this.arrow.alpha =0;
        this.groupIntro.add(this.arrow);
        this.add.tween(this.arrow).to({alpha:1},1000, Phaser.Easing.Linear.None, true);

        this.createDelayTime(1000, function() {
            this.buttons[0].frame = 0;
            this.buttons[1].frame = 0;
            this.buttons[2].frame = 0;
            //this.add.tween(this.buttons[0]).to({frame:0},100, Phaser.Easing.Linear.None, true);
        });
        
        
        this.createDelayTime(2000, function() {
            this.add.tween(this.arrow).to({x:200,y:350+10},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.buttons[0].scale).to({x:1.2,y:1.2}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.add.tween(this.buttons[0].scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        this.buttons[0].frame = this.buttons[0].name;
                    },this); 
                },this);
            },this);
        });

    
        this.createDelayTime(15000, function() {
            this.showFinishedLiveTutorial();
        });
    
    },

    

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showFinishedLiveTutorial:function() {
        console.log("showFinishedLiveTutorial");
        this.createDelayTime( 1000, function() {
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
        var t1 = "Nós já aprendemos o que são [poliedros]!";
        var tutorialText = this.drawText(this.world.centerX, 30, t1, 22, "center");
            tutorialText.alpha = 0;

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);


        var imagem = [];

        imagem[0] = this.add.sprite( this.world.centerX,70, 'resumo_img',0);
        imagem[0].anchor.set(0.5,0);

        imagem[1] = this.add.sprite( this.world.centerX,70, 'resumo_img',1);
        imagem[1].anchor.set(0.5,0);

        imagem[2] = this.add.sprite( this.world.centerX,70, 'resumo_img',2);
        imagem[2].anchor.set(0.5,0);

        imagem[0].alpha = 0;
        imagem[1].alpha = 0;
        imagem[2].alpha = 0;

        this.groupIntro.add(imagem[0]);
        this.groupIntro.add(imagem[1]);
        this.groupIntro.add(imagem[2]);

        this.createDelayTime( 7000, function() {
            this.add.tween(imagem[0]).to({alpha:1}, 700, Phaser.Easing.Linear.None, true);

        });

        this.createDelayTime(11000, function() {
            this.add.tween(imagem[0]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true);
            this.add.tween(imagem[1]).to({alpha:1}, 700, Phaser.Easing.Linear.None, true);

        });

        this.createDelayTime(15000, function() {
            this.add.tween(imagem[1]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true);
            this.add.tween(imagem[2]).to({alpha:1}, 700, Phaser.Easing.Linear.None, true);

        });

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
        console.log("***showNextLevel***");
        var levelNum = this.verifyCurrentLevel();

        console.log("init level", levelNum, this.currentLevel);
        console.log("showCallToAction " + this.showCallToAction);

        switch(levelNum) {
            case 1:
                this.showQuestion(1);
                this.initLevel1();
            break;
            case 2:
                this.showQuestion(2);
                this.initLevel2();
            break;
            case 3:
                this.showQuestion(3);
                this.initLevel3();
            break;
            case 4:
                this.showQuestion(3);
                this.initLevel4();
            break;
            case 5:
                this.showQuestion(3);
                this.initLevel5();
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
        console.log("***showQuestion ***");
        var questionList = [ null,
            "",
            "",
            ""
        ];

        this.imageQuestion = this.drawText(this.world.centerX, 30, questionList[num]);
        this.imageQuestion.alpha = 1;

        if(this.showCallToAction) {
            return;
        }

        if(this.ENABLE_PLACAR){
            this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        }else{
            this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        }
    },
           
    initLevel1: function() {

        console.log("***initLevel1***");
        console.log("***Nivel 1 - RODADA 1  ***");

        this.groupLevel[this.currentLevel] = this.add.group();

        //console.log(this.num_frases_level1);
        this.temp_array = this.num_frases_level1.slice();
        this.item= this.sorteio();
        this.num_frases_level1 = this.temp_array.slice();

        // 1-4 
        // para teste
        //this.item = 0;

        this.certo = this.img_frases_level1[this.item];
        
        //console.log("item-> "+this.item);
        //console.log(this.num_frases_level1);
        //console.log(this.frases_level1[this.item]);
        //console.log(this.audio_level1[this.item]);


        var aux = this.img_frases_level1.slice();
        //console.log("antes");
        //console.log(aux);

        // retira a carta do elemento certo;
        this.temp_array = this.img_frases_level1.slice();
        this.retirarArrayElemento(this.certo); 
        aux = this.temp_array.slice();
        //console.log("1");
        //console.log(aux);


        var btn = [];
        // outro botao 
        this.temp_array = aux.slice();
        btn[0]= this.sorteio();
        aux = this.temp_array.slice();

        //console.log("2");
        //console.log(aux);

        // outro botao 
        this.temp_array = aux.slice();
        btn[1]= this.sorteio();
        aux = this.temp_array.slice();

        //console.log("3");
        //console.log(aux);

        this.fraseFrame = [this.certo,btn[0],btn[1]];

        //console.log("botoes");
        //console.log(this.fraseFrame);

        this.fraseFrame.sort(function() {
            return .5 - Math.random();
        });

        //console.log("botoes");
        //console.log(this.fraseFrame);

        this.level(1);

        this.imageQuestion = this.drawText(this.world.centerX,60, this.frases_level1[this.item]);
        this.imageQuestion.alpha = 0;

        this.addLevelGroup(this.imageQuestion);


        this.createDelayTime(4000, function() {
            this.buttons[0].frame = 0;
            this.buttons[1].frame = 0;
            this.buttons[2].frame = 0;
        });

        this.createDelayTime(5000, function() {
            this.add.tween(this.placar).to({y: -120},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.sound.play(this.audio_level1[this.item]).onStop.addOnce(function(){
                        // liberar click;
                        this.enableEventMouse();
                    }, this);
                },this);
            }, this);

        });
    },

    initLevel2: function() {
        console.log("***initLevel2***");
        console.log("***Nivel 1 - RODADA 2  ***");
        this.groupLevel[this.currentLevel] = this.add.group();

        //console.log(this.num_frases_level1);
        this.temp_array = this.num_frases_level1.slice();
        this.item= this.sorteio();
        this.num_frases_level1 = this.temp_array.slice();

        // para teste
        //this.item = 4;

        this.certo = this.img_frases_level1[this.item];
        
        //console.log("item-> "+this.item);
        //console.log(this.num_frases_level1);
       // console.log(this.frases_level1[this.item]);
        //console.log(this.audio_level1[this.item]);


        var aux = this.img_frases_level1.slice();
        //console.log("antes");
        //console.log(aux);

        // retira a carta do elemento certo;
        this.temp_array = this.img_frases_level1.slice();
        this.retirarArrayElemento(this.certo); 
        aux = this.temp_array.slice();
        //console.log("1");
        //console.log(aux);


        var btn = [];
        // outro botao 
        this.temp_array = aux.slice();
        btn[0]= this.sorteio();
        aux = this.temp_array.slice();

        //console.log("2");
        //console.log(aux);

        // outro botao 
        this.temp_array = aux.slice();
        btn[1]= this.sorteio();
        aux = this.temp_array.slice();

        //console.log("3");
        //console.log(aux);

        this.fraseFrame = [this.certo,btn[0],btn[1]];

        //console.log("botoes");
        //console.log(this.fraseFrame);

        this.fraseFrame.sort(function() {
            return .5 - Math.random();
        });

        //console.log("botoes");
        //console.log(this.fraseFrame);

        this.level(1);

        this.imageQuestion = this.drawText(this.world.centerX,60, this.frases_level1[this.item]);
        this.imageQuestion.alpha = 0;

        this.addLevelGroup(this.imageQuestion);


        this.createDelayTime(4000, function() {
            this.buttons[0].frame = 0;
            this.buttons[1].frame = 0;
            this.buttons[2].frame = 0;
        });

        this.createDelayTime(5000, function() {
            this.add.tween(this.placar).to({y: -120},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.sound.play(this.audio_level1[this.item]).onStop.addOnce(function(){
                        // liberar click;
                         this.enableEventMouse();
                    }, this);
                },this);
            }, this);

        });
    },

    initLevel3: function() {
        console.log("***initLevel3***");
        console.log("***Nivel 2 - RODADA 1  ***");
        this.groupLevel[this.currentLevel] = this.add.group();

        //console.log(this.num_frases_level2);
        this.temp_array = this.num_frases_level2.slice();
        this.item= this.sorteio();
        this.num_frases_level2 = this.temp_array.slice();

        // para teste
        //this.item = 4;

        this.certo = this.img_frases_level2[this.item];
        
        //console.log("item-> "+this.item);
        //console.log(this.num_frases_level2);
        //console.log(this.frases_level2[this.item]);
        //console.log(this.audio_level2[this.item]);


        var aux = this.img_frases_level2.slice();
       // console.log("antes");
        //console.log(aux);

        // retira a carta do elemento certo;
        this.temp_array = this.img_frases_level2.slice();
        this.retirarArrayElemento(this.certo); 
        aux = this.temp_array.slice();
       // console.log("1");
        //console.log(aux);


        var btn = [];
        // outro botao 
        this.temp_array = aux.slice();
        btn[0]= this.sorteio();
        aux = this.temp_array.slice();

        //console.log("2");
        //console.log(aux);

        // outro botao 
        this.temp_array = aux.slice();
        btn[1]= this.sorteio();
        aux = this.temp_array.slice();

        //console.log("3");
        //console.log(aux);

        this.fraseFrame = [this.certo,btn[0],btn[1]];

        //console.log("botoes");
        //console.log(this.fraseFrame);

        this.fraseFrame.sort(function() {
            return .5 - Math.random();
        });

       // console.log("botoes");
        //console.log(this.fraseFrame);

        this.level(1);

        this.imageQuestion = this.drawText(this.world.centerX,60, this.frases_level2[this.item]);
        this.imageQuestion.alpha = 0;

        this.addLevelGroup(this.imageQuestion);


        this.createDelayTime(4000, function() {
            this.buttons[0].frame = 0;
            this.buttons[1].frame = 0;
            this.buttons[2].frame = 0;
        });

        this.createDelayTime(5000, function() {
            this.add.tween(this.placar).to({y: -120},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.sound.play(this.audio_level2[this.item]).onStop.addOnce(function(){
                        // liberar click;
                         this.enableEventMouse();
                    }, this);
                },this);
            }, this);

        });
    },

    initLevel4: function() {
        console.log("***initLevel4***");
        console.log("***Nivel 2 - RODADA 2  ***");
        this.groupLevel[this.currentLevel] = this.add.group();

        //console.log(this.num_frases_level2);
        this.temp_array = this.num_frases_level2.slice();
        this.item= this.sorteio();
        this.num_frases_level2 = this.temp_array.slice();


        // para teste
        //this.item = 5;

        this.certo = this.img_frases_level2[this.item];
        
        //console.log("item-> "+this.item);
        //console.log(this.num_frases_level2);
        //console.log(this.frases_level2[this.item]);
        //console.log(this.audio_level2[this.item]);


        var aux = this.img_frases_level2.slice();
        //console.log("antes");
        //console.log(aux);

        // retira a carta do elemento certo;
        this.temp_array = this.img_frases_level2.slice();
        this.retirarArrayElemento(this.certo); 
        aux = this.temp_array.slice();
        //console.log("1");
        //console.log(aux);


        var btn = [];
        // outro botao 
        this.temp_array = aux.slice();
        btn[0]= this.sorteio();
        aux = this.temp_array.slice();

        //console.log("2");
       // console.log(aux);

        // outro botao 
        this.temp_array = aux.slice();
        btn[1]= this.sorteio();
        aux = this.temp_array.slice();

        //console.log("3");
        ///console.log(aux);

        this.fraseFrame = [this.certo,btn[0],btn[1]];

        //console.log("botoes");
        //console.log(this.fraseFrame);

        this.fraseFrame.sort(function() {
            return .5 - Math.random();
        });

        //console.log("botoes");
        //console.log(this.fraseFrame);

        this.level(1);

        this.imageQuestion = this.drawText(this.world.centerX,60, this.frases_level2[this.item]);
        this.imageQuestion.alpha = 0;

        this.addLevelGroup(this.imageQuestion);


        this.createDelayTime(4000, function() {
            this.buttons[0].frame = 0;
            this.buttons[1].frame = 0;
            this.buttons[2].frame = 0;
        });

        this.createDelayTime(5000, function() {
            this.add.tween(this.placar).to({y: -120},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.sound.play(this.audio_level2[this.item]).onStop.addOnce(function(){
                        // liberar click;
                         this.enableEventMouse();
                    }, this);
                },this);
            }, this);

        });
    },

    initLevel5: function() {
        console.log("***initLevel5***");
        console.log("***Nivel 3 - RODADA 1  - UNICA  ***");
        this.groupLevel[this.currentLevel] = this.add.group();

        console.log(this.num_frases_level3);
        this.temp_array = this.num_frases_level3.slice();
        this.item= this.sorteio();
        this.num_frases_level3 = this.temp_array.slice();

        // para teste
        //this.item = 2;

        this.certo = this.img_frases_level3[this.item];
        
        //console.log("item-> "+this.item);
        //console.log(this.num_frases_level3);
        //console.log(this.frases_level3[this.item]);
        //console.log(this.audio_level3[this.item]);


        var aux = this.img_frases_level3.slice();
        //console.log("antes");
        //console.log(aux);

        // retira a carta do elemento certo;
        this.temp_array = this.img_frases_level3.slice();
        this.retirarArrayElemento(this.certo); 
        aux = this.temp_array.slice();
        //console.log("1");
        //console.log(aux);


        var btn = [];
        // outro botao 
        this.temp_array = aux.slice();
        btn[0]= this.sorteio();
        aux = this.temp_array.slice();

        //console.log("2");
        //console.log(aux);

        // outro botao 
        this.temp_array = aux.slice();
        btn[1]= this.sorteio();
        aux = this.temp_array.slice();

        //console.log("3");
        //console.log(aux);

        this.fraseFrame = [this.certo,btn[0],btn[1]];

        //console.log("botoes");
        //console.log(this.fraseFrame);

        this.fraseFrame.sort(function() {
            return .5 - Math.random();
        });

        //console.log("botoes");
        //console.log(this.fraseFrame);

        this.level(1);

        this.imageQuestion = this.drawText(this.world.centerX,60, this.frases_level3[this.item]);
        this.imageQuestion.alpha = 0;

        this.addLevelGroup(this.imageQuestion);


        this.createDelayTime(4000, function() {
            this.buttons[0].frame = 0;
            this.buttons[1].frame = 0;
            this.buttons[2].frame = 0;
        });

        this.createDelayTime(5000, function() {
            this.add.tween(this.placar).to({y: -120},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.sound.play(this.audio_level3[this.item]).onStop.addOnce(function(){
                        // liberar click;
                         this.enableEventMouse();
                    }, this);
                },this);
            }, this);

        });
    },
    
    


    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção CORRETA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickRightButton: function(target) {
        this.onPlayerSuccess();
        this.resetLevel(this.currentLevel);
        this.createDelayTime(500, function() {
          this.showCorrectName(true);  
        }); 
    },
    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção ERRADA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickWrongButton: function(target) {
        this.resetLevel(this.currentLevel);
        //if(target != null && target.alpha < 1) {
            ///return;
        //}
        /***
            this.ENABLE_CALL_TO_ACTION = true para desabilitar o erro no painel 
        ***/
        if(this.currentLocalErrors > 0) {
            
            this.currentLocalErrors--;

            this.sound.play("hitErro");
            this.onErrorChance(target);
            return;
        }
        
        this.onPlayerError();
        
        
        //this.sound.play("hitErro");
        //this.clearButtons(false);
        
        switch(this.lives) {
            case 1: // mostra dica 1

                this.createDelayTime(500, function() {
                    this.hideLevel(function() {
                        this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
                    });
                }); 
                
            break;
            case 0: // toca som de resumo
                this.lives = 0;

                this.createDelayTime(500, function() {
                    this.hideLevel();
                    this.showResumo(); 
                });
                
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

        //this.updateTimer();

    },

    
    
    //____________________________ funcoes do jogo ____________________________________________________________________________________
    //funcoes de sorteio///
        resetRandom: function() { 
            this.spliceLetter = [
                null,
                [],
                [],
                [],
                []
            ];
        },
        getRandomItem: function(list, level) {
            var letters = this.getNonRepeat(list, level);
            var n = this.rnd.integerInRange(0,letters.length-1);
            return letters[n];
        },
        getNonRepeat: function(itens, num) {
            var _name = [];
            for(var i = 0; i < itens.length; i++) {
                _name.push(itens[i]);
            }
            for(var i = 0; i < this.spliceLetter[num].length; i++) {
                if(_name.indexOf(this.spliceLetter[num]) >= 0) {
                    _name.splice(i,1);
                }
            }

            if(_name.length < 1) {
                return itens;
            }
            return _name;
        },
        retirarArrayElemento:function(elem){
            var index = this.temp_array.indexOf(elem);
            for (i=index; i<this.temp_array.length-1; i++)
            {
                this.temp_array[i] = this.temp_array[i+1];
            }
            this.temp_array.pop();
        },
        sorteio:function(){    
            var item = parseInt(this.getRandomItem(this.temp_array, 1));   
            this.retirarArrayElemento(item); 
            return item;
        },
    //fim funcoes de sorteio///


    level:function(tipo){ // funcionalidades comuns de todos os niveis e criacao do mini toturial 
        console.log("--> tipo: "+tipo);

        if(tipo==1){ 
            this.createButton(1);
        }else{
            this.createButton(0);
        }
    },


    createButton:function(tipo){
        this.buttons = [];
        this.buttons[0] = this.add.sprite(200,1000, 'cartas',this.fraseFrame[0]);
        this.buttons[1] = this.add.sprite(420,1000, 'cartas',this.fraseFrame[1]);
        this.buttons[2] = this.add.sprite(642,1000, 'cartas',this.fraseFrame[2]);

        this.buttons[0].anchor.set(0.5,0.5);
        this.buttons[1].anchor.set(0.5,0.5);
        this.buttons[2].anchor.set(0.5,0.5);

        this.buttons[0].name = this.buttons[0].frame;
        this.buttons[1].name = this.buttons[1].frame;
        this.buttons[2].name = this.buttons[2].frame;

        this.buttons[0].click = true;
        this.buttons[1].click = true;
        this.buttons[2].click = true;

        

        if(tipo==1){ // adiciona as imagens no grupo do level 
             this.addLevelGroup( this.buttons[0]);
             this.addLevelGroup( this.buttons[1]);
             this.addLevelGroup( this.buttons[2]);

            this.add.tween(this.buttons[0]).to({y:350},500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[1]).to({y:350},1000, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[2]).to({y:350},1500, Phaser.Easing.Linear.None, true);

        }else{// é intro adicona as imagens no grupo da intro 
            this.addIntroGroup( this.buttons[0]);
            this.addIntroGroup( this.buttons[1]);
            this.addIntroGroup( this.buttons[2]);

            this.add.tween(this.buttons[0]).to({y:350},200, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[1]).to({y:350},400, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[2]).to({y:350},600, Phaser.Easing.Linear.None, true);

        }

    },


    addIntroGroup:function(elem){
        this.groupIntro.add(elem);
    },


    addLevelGroup:function(elem){
        this.groupLevel[this.currentLevel].add(elem);    
    },

    enableEventMouse:function(){
        console.log("***enableEventMouse***");
        //elem.inputEnabled = true;
        //elem.input.useHandCursor = true;
        //elem.events.onInputDown.add(this.mouseInputDown, this); // click no mouse 
        tam = this.buttons.length;
        for(i=0; i<tam; i++){  
            console.log("button "+i);       
            this.buttons[i].inputEnabled = true;
            this.buttons[i].useHandCursor = true;
            this.buttons[i].events.onInputDown.add(this.mouseInputDown, this); // click no mouse 
        }
    },

    disableEventMouse:function(){
        console.log("***disableEventMouse***");
        //elem.inputEnabled = false;
        //elem.input.useHandCursor = false;
        //elem.input.reset();

        tam = this.buttons.length;
        for(i=0; i<tam; i++){         
            this.buttons[i].inputEnabled = false;
            this.buttons[i].useHandCursor = false;
            this.buttons[i].input.reset();
        }
    },

    mouseInputDown:function(elem){
        console.log("***mouseInputDown***");
        if(elem.click){
            this.disableEventMouse();
            elem.click = false;
            this.add.tween(elem.scale).to({x:1.2,y:1.2}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(elem.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    // logica do jogo
                    elem.frame = elem.name;
                    this.createDelayTime(500, function() {
                        this.checkGame(elem);
                    });
                    
                },this);
            },this);
        }
    },

    checkGame:function(elem){
        console.log("***checkGame***");
        
        if(elem.name==this.certo){
            console.log("CORRETA");
                this.sound.play("hitAcerto");
                this.changeHappy(this.bumba,"bumba_anim_happy","bumba_anim",887, 459,914, 454);
                this.createDelayTime(200, function() {
                    this.clickRightButton();
                });
        }else{
            console.log("ERRADA");
                this.sound.play("hitErro");
                this.createDelayTime(200, function() {
                    this.clickWrongButton();
                });
        }
    },

    resetLevel:function(nivel){
        
        console.log("***resetLevel***");
        
        this.createDelayTime(500, function() {
             this.add.tween(this.groupLevel[nivel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
             
             if(this.groupLevel[nivel] != null) {
                this.groupLevel[nivel].removeAll(true);
             }
        }); 
    },

    changeHappy:function(elem, anim,anim2,x,y,x1,y1){
        elem.loadTexture(anim, 0);
        elem.x = x;
        elem.y = y;
        var anim  = elem.animations.add(anim);
        
        anim.onComplete.add(function() {
            this.changeIdlle(elem,anim2,x1,y1);
        }, this);
        anim.play(18);
    },

    changeIdlle:function(elem,anim,x,y){
        elem.loadTexture(anim, 0);
        elem.x = x;
        elem.y = y;
        elem.animations.add(anim);
        elem.animations.play(anim, 18, true);
    },



    
    /**** editor *****/
    // somente habilitar em caso da criacao da cena e posicionamento dos elementos 

    /*drawPoint:function(x,y){ 
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(0);
        graphics.beginFill(0xff0000,1);
        graphics.drawCircle(x,y,5);
        graphics.endFill();

        //graphics.moveTo(0, 0);
        //graphics.lineStyle(5, 0xFFFFFF, 1);
        //graphics.lineTo(x, y);
    },

    gradeGuia:function(width,height){
        console.log("gradeGuia");

        console.log(width);
        console.log(height);

        this.line = [];
        this.col = [];

        var x = 0;
        var aux = width/10;
        for(var linhas=0; linhas<=10; linhas++)
        {
            this.line[linhas] = new Phaser.Line(x, 0, x, height);
            x += aux;
        }

       
        var y = 0;
        var aux = height/6;
        for(var cols=0; cols<=6; cols++)
        {
            this.col[cols] = new Phaser.Line(0, y,width, y);
            y += aux;
        }
    },

    addSpriteMeu:function(sprite,x,y,frame){
        spr = this.game.add.sprite(x,y, sprite,frame);
        //spr.anchor.set(0.5,0.5);
        this.enableDragDropMeu(spr);
        return spr;
    },

    enableDragDropMeu:function(elem){
        elem.inputEnabled = true;
        elem.input.enableDrag();
        elem.events.onDragStart.add(this.onDragStartMeu, this);
        elem.events.onDragStop.add(this.onDragStopMeu, this);
    },

    onDragStartMeu:function(sprite, pointer) {

        this.result = "Dragging " + sprite.key;
    },

    onDragStopMeu:function (sprite, pointer) {

        this.mouse = " mouse  x:" + pointer.x + " y: " + pointer.y;
        this.result = " sprite:" + sprite.key + " dropped at x:" + sprite.x + " y: " + sprite.y;
    },


    /// desenha um ponto no click no mouse 
    drawPoint:function(x,y){ 
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(0);
        graphics.beginFill(0xff0000,1);
        graphics.drawCircle(x,y,5);
        graphics.endFill();

        graphics.moveTo(0, 0);
        graphics.lineStyle(5, 0xFFFFFF, 1);
        graphics.lineTo(x, y);
    },
    
    

    render:function() {
        for(var i=0; i<=10; i++)
        {
             this.game.debug.geom(this.line[i]);
        }
        for(var i=0; i<=6; i++)
        {
             this.game.debug.geom(this.col[i]);
        }
        this.game.debug.text(this.mouse, 10, 250);
        this.game.debug.text(this.result, 10, 300);

    },*/
};





