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

        this.TEMPO_INTRO = 26500;
        this.ENABLE_CALL_TO_ACTION = true;
        this.ENABLE_PLACAR = false; // para desabilitar o placar 


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
        this.keyboard_permission = false;
        this.right_keyboard_answear;
        this.input.keyboard.addCallbacks(this, null, null, this.keyPress);

        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];


        this.groupLevel = [null,1,2,3];
        this.itensP = [0,1,2,3,4,5];
        this.itensB = [6,7,8,9,10,11];
        this.itensT = [12,13,14,15,16,17,18,19];
        this.itensD = [20,21,22,23,24,25,26,27];
        this.itensV = [28,29,30,31,32,33,34,35,36,37];
        this.itensF = [38,39,40,41,42,43,44,45,46,47];
        
        
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

        var t1 = "Ah, mas o ser folclórico que estamos \nprocurando deixou tudo bagunçado por \naqui! As pinhas deviam estar empilhadas \nna coluna de suas [letras], mas acabaram \nse misturando!  ";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t2 = "Temos que separá-las novamente, basta ver \na [letra inicial] da pinha e colocá-la em sua coluna \ncerta! Vamos lá?";
        var tutorialText1 = this.drawText(this.world.centerX, 30, t2, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var kim = this.showKim(16000);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.createDelayTime(16000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(tutorialText1).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
            }, this);
            
        });

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);

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
                    this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
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
        //this.background = this.addSpriteMeu('background',-375,-313,0);

        this.background = this.add.sprite(-375,-313, 'background');
       
        //this.guri = this.addSpriteMeu('anim_guri',465,437,0);
        //this.guri.anchor.set(0.5,0.5);
        //this.guri1 = this.addSpriteMeu('anim_guri_happy',475,439,0);
        //this.guri1.anchor.set(0.5,0.5);

        this.guri = this.add.sprite(465,437, "anim_guri");
        this.guri.animations.add('idle', null, 18, true);
        this.guri.animations.play('idle');
        this.guri.anchor.set(0.5,0.5);

        //this.initLevel1();
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
        this.tutorial();
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
        var t1 = "Ao separar as pinhas em duas pilhas prestamos \natenção nas [letras] que começam as palavras \npara ficar mais fácil de organizar. \nComeçaremos de novo!";
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
        console.log("***showNextLevel***");
        var levelNum = this.verifyCurrentLevel();

        console.log("init level", levelNum, this.currentLevel);
        console.log("showCallToAction " + this.showCallToAction);

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
        console.log("***showQuestion ***");
        var questionList = [ null,
            "As pinhas dessas pilhas eram de palavras \ncomeçando em [P] e [B]. Vamos separar!",
            "Já essas pinhas têm palavras que começam \ncom [T] e [D]. Mãos à obra!",
            "Essas possuem as letras [V] ou [F] no começo. \nVamos lá!"
        ];

        if(this.showCallToAction) {
            return;
        }


        this.imageQuestion = this.drawText(this.world.centerX, 30, questionList[num]);
        this.imageQuestion.alpha = 1;

        
        if(this.ENABLE_PLACAR){
            this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        }else{
            this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        }
    },


           
    initLevel1: function() {

        console.log("***initLevel1***");
        this.groupLevel[this.currentLevel] = this.add.group();

        this.cesta = this.add.sprite(1100,509, "cesta");//this.addSpriteMeu('cesta',375,313,0);
        this.cesta.anchor.set(0.5,0.5);
        this.cesta.scale.set(0.5,0.5);

        this.cesta1 = this.add.sprite(1100,509, "cesta");//this.addSpriteMeu('cesta',375,313,0);
        this.cesta1.anchor.set(0.5,0.5);
        this.cesta1.scale.set(0.5,0.5);

        this.cesta.name = "P";
        this.cesta1.name = "B";

        this.cesta1Posicao = new Array([800.15,465.39],[770.40,471.06],[740.90,466.80],[690.90,462.55]);
        this.cestaPosicao = new Array([170.20,462.55],[198.79,462.55],[226.45,469.64],[245.53,473.97]);

        this.addLevelGroup(this.cesta);
        this.addLevelGroup(this.cesta1);

        this.letraP = this.add.sprite(177,336, "letras",0);//this.addSpriteMeu('letras',177,316,0);
        this.letraP.anchor.set(0.5,0.5);
        this.letraP.scale.set(0.1,0.1);
        this.letraP.alpha=0;

        this.letraB = this.add.sprite(809,336, "letras",1);//this.addSpriteMeu('letras',809,316,1);
        this.letraB.anchor.set(0.5,0.5);
        this.letraB.scale.set(0.1,0.1);
        this.letraB.alpha=0;

        
        this.addLevelGroup(this.letraP);
        this.addLevelGroup(this.letraB);

        this.itens =[];// QUATRO PINHAS 
        this.itensNome =[];// QUATRO PINHAS 

        this.temp_array = this.itensP.slice();
        this.itens[0]= this.sorteio();
        this.itensNome[0]="P";
        this.itensP= this.temp_array.slice();

        this.temp_array = this.itensP.slice();
        this.itens[1]= this.sorteio();
        this.itensNome[1]="P";
        this.itensP= this.temp_array.slice();

        this.temp_array = this.itensB.slice();
        this.itens[2]= this.sorteio();
        this.itensNome[2]="B";
        this.itensB= this.temp_array.slice();

        this.temp_array = this.itensB.slice();
        this.itens[3]= this.sorteio();
        this.itensNome[3]="B";
        this.itensB= this.temp_array.slice();

        this.numButtons = 4;
        this.initX = 300;
        this.numAcertos = 0;
        this.numAcertos_cesta = 0;
        this.numAcertos_cesta1 = 0;
        this.numErros=0;

        this.add.tween(this.letraP.scale).to({x:0.7,y:0.7},500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.letraB.scale).to({x:0.7,y:0.7},500, Phaser.Easing.Linear.None, true);

        this.add.tween(this.letraP).to({alpha:1},500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.letraB).to({alpha:1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.add.tween(this.cesta).to({x:250},500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.cesta1).to({x:750},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                 this.level(1);
            },this);
        },this);
    },

    initLevel2: function() {
        console.log("***initLevel2***");
        this.groupLevel[this.currentLevel] = this.add.group();
        

        this.cesta = this.add.sprite(1100,509, "cesta");//this.addSpriteMeu('cesta',375,313,0);
        this.cesta.anchor.set(0.5,0.5);
        this.cesta.scale.set(0.5,0.5);

        this.cesta1 = this.add.sprite(1100,509, "cesta");//this.addSpriteMeu('cesta',375,313,0);
        this.cesta1.anchor.set(0.5,0.5);
        this.cesta1.scale.set(0.5,0.5);

        this.cesta.name = "T";
        this.cesta1.name = "D";

        this.cesta1Posicao = new Array([800.15,465.39],[770.40,471.06],[740.90,466.80],[690.90,462.55]);
        this.cestaPosicao = new Array([170.20,462.55],[198.79,462.55],[226.45,469.64],[245.53,473.97]);

        this.addLevelGroup(this.cesta);
        this.addLevelGroup(this.cesta1);

        this.letraT = this.add.sprite(177,336, "letras",2);//this.addSpriteMeu('letras',177,316,0);
        this.letraT.anchor.set(0.5,0.5);
        this.letraT.scale.set(0.1,0.1);
        this.letraT.alpha=0;

        this.letraD = this.add.sprite(809,336, "letras",3);//this.addSpriteMeu('letras',809,316,1);
        this.letraD.anchor.set(0.5,0.5);
        this.letraD.scale.set(0.1,0.1);
        this.letraD.alpha=0;

        
        this.addLevelGroup(this.letraT);
        this.addLevelGroup(this.letraD);

        this.itens =[];// SEIS PINHAS 
        this.itensNome =[];// SEIS PINHAS 

        this.temp_array = this.itensT.slice();
        this.itens[0]= this.sorteio();
        this.itensNome[0]="T";
        this.itensT= this.temp_array.slice();

        this.temp_array = this.itensT.slice();
        this.itens[1]= this.sorteio();
        this.itensNome[1]="T";
        this.itensT= this.temp_array.slice();


        this.temp_array = this.itensT.slice();
        this.itens[2]= this.sorteio();
        this.itensNome[2]="T";
        this.itensT= this.temp_array.slice();

        //-----------------------------------

        this.temp_array = this.itensD.slice();
        this.itens[3]= this.sorteio();
        this.itensNome[3]="D";
        this.itensD= this.temp_array.slice();

        this.temp_array = this.itensD.slice();
        this.itens[4]= this.sorteio();
        this.itensNome[4]="D";
        this.itensD= this.temp_array.slice();

        this.temp_array = this.itensD.slice();
        this.itens[5]= this.sorteio();
        this.itensNome[5]="D";
        this.itensD= this.temp_array.slice();

        //------------------------------------

        this.numButtons = 6; // seis pinhas 
        this.initX = 250;
        this.numAcertos = 0;
        this.numAcertos_cesta = 0;
        this.numAcertos_cesta1 = 0;
        this.numErros=0;

        this.add.tween(this.letraT.scale).to({x:0.7,y:0.7},500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.letraD.scale).to({x:0.7,y:0.7},500, Phaser.Easing.Linear.None, true);

        this.add.tween(this.letraT).to({alpha:1},500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.letraD).to({alpha:1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.add.tween(this.cesta).to({x:250},500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.cesta1).to({x:750},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                 this.level(1);
            },this);
        },this);
    },

    initLevel3: function() {
        console.log("***initLevel3***");
        this.groupLevel[this.currentLevel] = this.add.group();
       

        this.cesta = this.add.sprite(1100,529, "cesta");//this.addSpriteMeu('cesta',375,313,0);
        this.cesta.anchor.set(0.5,0.5);
        this.cesta.scale.set(0.5,0.5);

        this.cesta1 = this.add.sprite(1100,529, "cesta");//this.addSpriteMeu('cesta',375,313,0);
        this.cesta1.anchor.set(0.5,0.5);
        this.cesta1.scale.set(0.5,0.5);

        this.cesta.name = "V";
        this.cesta1.name = "F";

        this.cesta1Posicao = new Array([800.15,475.39],[770.40,481.06],[740.90,476.80],[690.90,472.55]);
        this.cestaPosicao = new Array([170.20,472.55],[198.79,472.55],[226.45,479.64],[245.53,483.97]);

        this.addLevelGroup(this.cesta);
        this.addLevelGroup(this.cesta1);

        this.letraV = this.add.sprite(177,336, "letras",4);//this.addSpriteMeu('letras',177,316,0);
        this.letraV.anchor.set(0.5,0.5);
        this.letraV.scale.set(0.1,0.1);
        this.letraV.alpha=0;

        this.letraF = this.add.sprite(809,336, "letras",5);//this.addSpriteMeu('letras',809,316,1);
        this.letraF.anchor.set(0.5,0.5);
        this.letraF.scale.set(0.1,0.1);
        this.letraF.alpha=0;

        
        this.addLevelGroup(this.letraV);
        this.addLevelGroup(this.letraF);

        this.itens =[]; // OITO PINHAS 
        this.itensNome =[]; // OITO PINHAS 

        this.temp_array = this.itensV.slice();
        this.itens[0]= this.sorteio();
        this.itensNome[0]="V";
        this.itensV= this.temp_array.slice();

        this.temp_array = this.itensV.slice();
        this.itens[1]= this.sorteio();
        this.itensNome[1]="V";
        this.itensV= this.temp_array.slice();

        this.temp_array = this.itensV.slice();
        this.itens[2]= this.sorteio();
        this.itensNome[2]="V";
        this.itensV= this.temp_array.slice();

        this.temp_array = this.itensV.slice();
        this.itens[3]= this.sorteio();
        this.itensNome[3]="V";
        this.itensV= this.temp_array.slice();

        //-----------------------------------

        this.temp_array = this.itensF.slice();
        this.itens[4]= this.sorteio();
        this.itensNome[4]="F";
        this.itensF= this.temp_array.slice();

        this.temp_array = this.itensF.slice();
        this.itens[5]= this.sorteio();
        this.itensNome[5]="F";
        this.itensF= this.temp_array.slice();

        this.temp_array = this.itensF.slice();
        this.itens[6]= this.sorteio();
        this.itensNome[6]="F";
        this.itensF= this.temp_array.slice();

        this.temp_array = this.itensF.slice();
        this.itens[7]= this.sorteio();
        this.itensNome[7]="F";
        this.itensF= this.temp_array.slice();

       

        //------------------------------------

        this.numButtons = 8; // OITO pinhas 
        this.initX = 150;
        this.numAcertos = 0;
        this.numAcertos_cesta = 0;
        this.numAcertos_cesta1 = 0;
        this.numErros=0;

        this.add.tween(this.letraV.scale).to({x:0.7,y:0.7},500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.letraF.scale).to({x:0.7,y:0.7},500, Phaser.Easing.Linear.None, true);

        this.add.tween(this.letraV).to({alpha:1},500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.letraF).to({alpha:1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.add.tween(this.cesta).to({x:250},500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.cesta1).to({x:750},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                 this.level(1);
            },this);
        },this);
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
        console.log("--> tipo: "+tipo)
        if(tipo==1){ // adiciona as imagens no grupo do level 
            this.createButton(1);
        }else{// é intro adicona as imagens no grupo da intro 
            this.createButton(0);
        }

    },

    tutorial:function(){

        this.cesta = this.add.sprite(1100,509, "cesta");//this.addSpriteMeu('cesta',375,313,0);
        this.cesta.anchor.set(0.5,0.5);
        this.cesta.scale.set(0.5,0.5);

        this.cesta1 = this.add.sprite(1100,509, "cesta");//this.addSpriteMeu('cesta',375,313,0);
        this.cesta1.anchor.set(0.5,0.5);
        this.cesta1.scale.set(0.5,0.5);

        this.addIntroGroup(this.cesta);
        this.addIntroGroup(this.cesta1);

        this.letra = this.add.sprite(177,316, "letras",2);//this.addSpriteMeu('letras',177,316,0);
        this.letra.anchor.set(0.5,0.5);
        this.letra.scale.set(0.1,0.1);
        this.letra.alpha=0;

        this.letra1 = this.add.sprite(809,316, "letras",3);//this.addSpriteMeu('letras',809,316,1);
        this.letra1.anchor.set(0.5,0.5);
        this.letra1.scale.set(0.1,0.1);
        this.letra1.alpha=0;

        this.addIntroGroup(this.letra);
        this.addIntroGroup(this.letra1);

        this.itens =[21,15,27,18];
        this.numButtons = 4;
        this.initX = 300;
        this.itensNome =[null,null,null,null];// QUATRO PINHAS 

        this.add.tween(this.letra.scale).to({x:0.7,y:0.7},500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.letra1.scale).to({x:0.7,y:0.7},500, Phaser.Easing.Linear.None, true);

        this.add.tween(this.letra).to({alpha:1},500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.letra1).to({alpha:1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.add.tween(this.cesta).to({x:250},500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.cesta1).to({x:750},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                
                this.level(0);
                //-----------
                this.arrow = this.add.sprite(430,150, 'arrow');
                this.arrow.alpha =0;
                this.groupIntro.add(this.arrow);
                this.add.tween(this.arrow).to({alpha:1},200, Phaser.Easing.Linear.None, true);

                this.cesta1Posicao = new Array([800.15,465.39],[770.40,471.06],[740.90,466.80],[690.90,462.55]);
                this.cestaPosicao = new Array([170.20,462.55],[198.79,462.55],[226.45,469.64],[245.53,473.97]);

                this.createDelayTime(4000, function() {

                    aux = this.buttons[0].x+0;
                    auy = this.buttons[0].y+0;
                    this.add.tween(this.arrow).to({x:aux,y:auy},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        //_______________________________________________
                        aux = this.cesta1Posicao[0][0];
                        auy = this.cesta1Posicao[0][1];
                        this.add.tween(this.arrow).to({x:aux+0,y:auy+0},500, Phaser.Easing.Linear.None, true);
                        this.add.tween(this.buttons[0]).to({x:aux,y:auy},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        //________________________________________________
                            aux = this.buttons[1].x+0;
                            auy = this.buttons[1].y+0;
                            this.add.tween(this.arrow).to({x:aux,y:auy},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                //_______________________________________________
                                aux = this.cestaPosicao[0][0];
                                auy = this.cestaPosicao[0][1];
                                this.add.tween(this.arrow).to({x:aux+0,y:auy+0},500, Phaser.Easing.Linear.None, true);
                                this.add.tween(this.buttons[1]).to({x:aux,y:auy},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){ 
                                    //___________________________________
                                    aux = this.buttons[2].x+0;
                                    auy = this.buttons[2].y+0;
                                    this.add.tween(this.arrow).to({x:aux,y:auy},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                        //_______________________________________________
                                        aux = this.cesta1Posicao[1][0];
                                        auy = this.cesta1Posicao[1][1];
                                        this.add.tween(this.arrow).to({x:aux+0,y:auy+0},500, Phaser.Easing.Linear.None, true);
                                        this.add.tween(this.buttons[2]).to({x:aux,y:auy},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                            //_______________________________________________
                                            aux = this.buttons[3].x+0;
                                            auy = this.buttons[3].y+0;
                                            this.add.tween(this.arrow).to({x:aux,y:auy},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){

                                                //_______________________________________________
                                                aux = this.cestaPosicao[1][0];
                                                auy = this.cestaPosicao[1][1];
                                                this.add.tween(this.arrow).to({x:aux+0,y:auy+0},500, Phaser.Easing.Linear.None, true);
                                                this.add.tween(this.buttons[3]).to({x:aux,y:auy},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                                    this.createDelayTime(1000, function() {
                                                        this.showFinishedLiveTutorial();
                                                    });
                                                },this);

                                            },this);

                                        },this);

                                    },this);
                                
                                },this);

                            },this);

                        },this);

                    },this);

                });

            //---------------     
            },this);
        },this);

    },


    createButton:function(tipo){
        this.buttons = [];
        x=this.initX;

        this.posX = [];
        for(i=0; i<this.numButtons; i++){
            this.posX[i] = x;
            x+=100;
        }


        if(tipo==1){
            this.posX.sort(function() {
                return .5 - Math.random();
            });
        }

        for(i=0; i<this.numButtons; i++){
            this.buttons[i] = this.add.sprite(500,240, "pinhas",this.itens[i]);//this.addSpriteMeu('pinhas',500,220,this.itens[i]);
            this.buttons[i].anchor.set(0.5, 0.5);
            this.buttons[i].scale.set(0.5, 0.5);
            this.buttons[i].name= this.itensNome[i];
            this.buttons[i].alpha= 0;
            this.buttons[i].drop= true;
            
            if(tipo==1){ // adiciona as imagens no grupo do level 
                this.addLevelGroup( this.buttons[i]);   
            }else{// é intro adicona as imagens no grupo da intro 
                this.addIntroGroup( this.buttons[i]);
            }
        }

        var delay = 500;
        var finalmov =  this.numButtons;
        for(i=0; i<this.numButtons; i++){
            this.add.tween(this.buttons[i]).to({x:this.posX[i]},delay, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[i]).to({alpha:1},delay, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[i].scale).to({x:1,y:1},delay, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                console.log("--> "+i+" == "+finalmov);
                if(tipo==1){ 
                    if(i==finalmov){
                        for(it=0; it<this.numButtons; it++){
                            this.enableDragDrop(this.buttons[it]);
                        }
                    }
                }
            },this);
            delay+=200;

        }
    },


    enableDragDrop:function(elem){
        console.log("*** enableDragDrop ***");
        elem.inputEnabled = true;
        elem.input.enableDrag();
        elem.events.onDragStart.add(this.ondragStart, this);
        elem.events.onDragStop.add(this.ondragStop, this);
        elem.drop=true;
    },

    disableDragDrop:function(elem){       
        elem.inputEnabled = false;
        elem.input.reset();
    },

    disableDragDropGroup:function(){
        for(i=0; i<this.numButtons; i++){
            this.buttons[i].inputEnabled = false;
            this.buttons[i].input.reset();
            this.buttons[i].drop= false;
        }

    },

    ondragStart:function(elem, pointer) {
        console.log("*** ondragStart ***");
        this.comeco = [elem.x,elem.y];
    },

    ondragStop:function (elem, pointer) {
        console.log("*** ondragStop ***");

        if(elem.drop){
            this.checkGame(elem);
        }
        
    },

    


    addIntroGroup:function(elem){
        this.groupIntro.add(elem);
    },


    addLevelGroup:function(elem){
        this.groupLevel[this.currentLevel].add(elem);    
    },

    checkOverlap:function(spriteA,spriteB) {
        console.log("*** checkOverlap ****");
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);
    },

    reposionaElem:function(elem){
        this.sound.play("hitErro");
        elem.x = this.comeco[0];
        elem.y = this.comeco[1];
    },

    checkUm:function(elem){
        console.log(elem.name +"==" +this.cesta.name);
        if(elem.name == this.cesta.name){
            this.changeHappy(this.guri,"anim_guri_happy","anim_guri",475,439,465,437);
            this.sound.play("hitAcerto");
            this.disableDragDrop(elem);
            this.numAcertos++;
            
            elem.drop = false;
            elem.x = this.cestaPosicao[this.numAcertos_cesta][0];
            elem.y = this.cestaPosicao[this.numAcertos_cesta][1];
            this.numAcertos_cesta++;

            console.log("CORRETA "+this.numAcertos);

            if(this.numAcertos==this.numButtons) {
                this.disableDragDropGroup();
                console.log("CORRETA FINAL");
                this.createDelayTime(200, function() {       
                    this.clickRightButton();  
                });
            }
        }else{
                console.log("ERRADA");
                this.sound.play("hitErro");
                this.numErros++;
                elem.x = this.comeco[0];
                elem.y = this.comeco[1];

                console.log("ERRADA "+this.numErros);

                if(this.numErros>2){
                    console.log("ERRADA FINAL");
                    this.disableDragDropGroup();
                    this.createDelayTime(200, function() {
                        this.clickWrongButton();
                    }); 
                }     
        }
    },

    checkDois:function(elem){
        console.log(elem.name +"==" +this.cesta1.name);
        if(elem.name == this.cesta1.name){
            this.changeHappy(this.guri,"anim_guri_happy","anim_guri",475,439,465,437);
            this.sound.play("hitAcerto");
            this.disableDragDrop(elem);
            this.numAcertos++;
            
            elem.drop = false;
            elem.x = this.cesta1Posicao[this.numAcertos_cesta1][0];
            elem.y = this.cesta1Posicao[this.numAcertos_cesta1][1];
            this.numAcertos_cesta1++;

            console.log("CORRETA "+this.numAcertos);

            if(this.numAcertos==this.numButtons) {
                console.log("CORRETA FINAL");
                this.disableDragDropGroup();
                this.createDelayTime(200, function() {       
                    this.clickRightButton();  
                });
            }
        }else{
                console.log("ERRADA");
                this.sound.play("hitErro");
                this.numErros++;
                elem.x = this.comeco[0];
                elem.y = this.comeco[1];

                console.log("ERRADA "+this.numErros);

                if(this.numErros>2){
                    this.disableDragDropGroup();
                    this.createDelayTime(200, function() {
                        console.log("ERRADA FINAL");
                        this.clickWrongButton();
                    }); 
                }     
        }
    },

    checkGame:function(elem){
        console.log("***checkGame***");
        var check1 = this.checkOverlap(elem,this.cesta);
        var check2 = this.checkOverlap(elem,this.cesta1);
        console.log("--> check1  "+check1);
        console.log("--> check2  "+check2);

        if(check1 && check2){ // se as duas for verdade quando fica no meio
            console.log("***REPOSICIONA TRUE DUAS***");
            this.reposionaElem(elem);
        }else if(check1){// cesta 
            console.log("***CHECK1 TRUE***");
            this.checkUm(elem);
            
        }else if(check2){
            console.log("***CHECK2 TRUE***");
            this.checkDois(elem);
        }
        else{
            console.log("***REPOSICIONA OUTRO LUGAR***");
            this.reposionaElem(elem);
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
    /*
    drawPoint:function(x,y){ 
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

    },
    
    */
};





