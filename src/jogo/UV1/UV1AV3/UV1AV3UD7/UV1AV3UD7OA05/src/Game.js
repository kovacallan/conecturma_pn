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
        // this.gradeGuia(1000, 600);            

        this.TEMPO_INTRO = 35700;
        this.ENABLE_CALL_TO_ACTION = true;
        this.ENABLE_PLACAR = true; // para desabilitar o placar 

        // quantidade de perguntas que tem em cada nivel
        // 3 acertos em cada rodada para passar para a próxima
        this.totalLevel1 = 2;
        this.totalLevel2 = 2;
        this.totalLevel3 = 2;

        // quantidade total de erros permitido em cada nivel - SEM TOLERANCIA NESSE CASO
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

        //VARIAVEIS DO JOGO
        this.groupLevel = [null,1 ,2 ,3 , 4, 5, 6, 7, 8, 9];

        this.direcoes = [0, 2, 4, 6];
        
        /*****************************************************************/

        this.resetRandom();
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

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextIntro, this);
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
    showTextIntro: function() {
        var t1 = "Existe uma lenda indígena muito\n bonita, a história da vitória-régia.\n Poly se lembrou que viu algumas nas\n aventuras da Árvore da Vida e Amary\n lembrou-se que num lago, perto do\n cafezal, também havia algumas… ";
        var tutorialText = this.drawText(this.world.centerX+58, 20, t1, 22, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t2 = "Chegando ao lago… cadê a vitória-régia? O ser\n folclórico danado escondeu todas elas também!\n Mas encontrá-las vai ser fácil, basta me escutar\n e levar essa folha de café pela lagoa…";
        var tutorialText1 = this.drawText(this.world.centerX, 10, t2, 22, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);
        
        //ADICIONA KIM
        var kim = this.showKim(20000);

        //TEXTO 0 APARECE E INICIA O ÁUDIO DA INTRO 
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);

         //DESAPARECE TEXTO 0 E INICIA TEXTO 1
        this.createDelayTime(20000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.tutorialPlacar).to({y: -120}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                    this.add.tween(tutorialText1).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
                }, this);
            }, this);   
        });     

        this.createDelayTime(this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText1).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                this.showFinishedLiveTutorial();
            }, this);
        });
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");

        this.createDelayTime(7500, function() {
            this.folha = this.add.sprite(415,307, 'folha');
            this.folha.alpha = 0;
            this.addIntroGroup(this.folha);
            this.add.tween(this.folha).to({alpha: 1}, 500, Phaser.Easing.Quadratic.InOut, true).onComplete.add(function() {
                this.createSprite("anim_setas", 716, 400, false, this.groupIntro);
                //ANIMAÇÃO FOLHA - BAIXO - > ESQUERDA - > CIMA - > DIREITA
                this.add.tween(this.folha).to({y: 457}, 800, Phaser.Easing.Quadratic.InOut, true, 500).onComplete.add(function() {
                    this.add.tween(this.folha).to({x: 215}, 800, Phaser.Easing.Quadratic.InOut, true, 500).onComplete.add(function() {
                        this.add.tween(this.folha).to({y: 307}, 800, Phaser.Easing.Quadratic.InOut, true, 500).onComplete.add(function() {
                            this.add.tween(this.folha).to({x: 415}, 800, Phaser.Easing.Quadratic.InOut, true, 500).onComplete.add(function() {
                            }, this);
                        }, this);
                    }, this);
                }, this);
            }, this);
        }, this);
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
        console.log("*********create scene*********");

        this.createSprite("peixe_1", 18, -280, true);
        this.createSprite("peixe_2", 293, -267, true);
        this.createSprite("peixe_3", 400, -280, true);

        // this.background = this.addSpriteMeu('background',-394,-353);
        this.background = this.add.sprite(-394,-353, 'background');
        this.background.alpha = 0.9;
    },

    createSprite:function(nameSprite, x, y, repeat, group) {
        var elem = this.add.sprite(x,y, nameSprite);
        elem.alpha = 0;
        elem.animations.add('anim', null, 18, repeat);
        elem.animations.play('anim');
        this.add.tween(elem).to({alpha: 1}, 500, "Quart.easeOut", true);
        if(group != null) {
            group.add(elem);
        }
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

        this.add.tween(this.tutorialPlacar).to({y: -100}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextResumo, this);
    },

    /**
    *
    * Função que mostra o texto do resumo.
    * Ao final chama a função global que esconde o resumo
    * 
    **/
    showTextResumo: function() {
        console.log("******show text resumo********");
        var t1 = "Saber o que está de um lado, do outro, na frente\n ou atrás é fundamental pra gente poder fazer\n qualquer coisa, até mesmo pra sair andando \npor aí! É fácil, gente! Vamos lá!";
        var tutorialText = this.drawText(this.world.centerX, 20, t1, 22, "center");
            tutorialText.alpha = 0;                      

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundResumo = this.setDebugAudio("soundResumo");
            this.soundResumo.onStop.addOnce(function(){
            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
        }, this);
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
                this.initLevel(1);
            break;
            case 2:
                this.showQuestion(2);
                this.initLevel(2);
            break;
            case 3:
                this.showQuestion(3);
                this.initLevel(3);
            break;
            case 4:
                this.showQuestion(4);
                this.initLevel(4);
            break;
            case 5:
                this.resetaArray();
                this.showQuestion(5);
                this.initLevel(5);
            break;
            case 6:
                this.showQuestion(6);
                this.initLevel(6);
            break;
        }
        this.showCallToAction = false;
    },

    /**
    *
    * Controle de Perguntas, que serão mostradas no jogo
    * OBRIGATORIO
    **/
    showQuestion: function(num) {

        console.log("***showQuestion ***");
        var questionList = [ null,
            "",
            "",
            "",
            "",
            "",
            "",
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
    
           
    initLevel: function(level) {
        
        console.log("***initLevel***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.nivel = level;

        //DEFINE DIRECOES = RESP. CERTA
        console.log("[0 - DIREITA, 2 - ESQUERDA, 4 - CIMA, 6 - BAIXO]");
        console.log("level " + level);
        console.log("Direções disponiveis: " + this.direcoes);
        this.certo = this.defineDirSorteada(this.direcoes);
        console.log("Direção sorteada (R. certa): " + this.certo);

        //DESCE PLACA, MOSTRA LEGENDA E TOCA SOUNDQUESTION E ENABLE CLICK NO FIM DO AUDIO
        this.showTutorialPlacar(this.groupLevel[this.currentLevel]);

        //MOSTRA FOLHA
        this.folha = this.add.sprite(599, 333, 'folha');
        this.folha.alpha = 0;
        this.addLevelGroup(this.folha);
        this.add.tween(this.folha).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            //MOSTRA TECLADO - buttonsanswer
            this.showButtonsAnswer(this.groupLevel[this.currentLevel]);
        }, this);
    },

    resetaArray:function() {
        this.direcoes = [0, 2, 4, 6];
    },

    showButtonsAnswer:function(group) {
        console.log("**********show buttons answer (teclas)***********");

        this.groupBack = this.add.group();
        this.groupMiddle = this.add.group();
        this.groupFront = this.add.group();

        this.buttonsAnswer = [];

        //cima
        this.buttonsAnswer[0] = this.groupBack.create(213, 276, "setas", 4);
        this.buttonsAnswer[0].name = 4;
        this.buttonsAnswer[0].alpha = 0;
        //direita
        this.buttonsAnswer[1] = this.groupMiddle.create(261, 308, "setas", 2);
        this.buttonsAnswer[1].name = 0;
        this.buttonsAnswer[1].alpha = 0;
        //esquerda
        this.buttonsAnswer[2] = this.groupMiddle.create(166, 308, "setas", 0);
        this.buttonsAnswer[2].name = 2;
        this.buttonsAnswer[2].alpha = 0;
        //baixo
        this.buttonsAnswer[3] = this.groupFront.create(213, 344, "setas", 6);
        this.buttonsAnswer[3].name = 6;
        this.buttonsAnswer[3].alpha = 0;
        
        this.addLevelGroup(this.groupBack);
        this.addLevelGroup(this.groupMiddle);
        this.addLevelGroup(this.groupFront);

        this.add.tween(this.buttonsAnswer[0]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.buttonsAnswer[1]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.buttonsAnswer[2]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.buttonsAnswer[3]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    defineDirSorteada:function(array) {
        console.log("**********define num. sorteado***********");
        var numSorteado;
        numSorteado = this.randomQuestion(array);
        array.splice(this.index_question, 1);
        return numSorteado;
    },

    enableEventMouse:function(){
        console.log("***enableEventMouse***");
        tam = this.buttonsAnswer.length;
        for(i=0; i<tam; i++){  
            console.log("button "+i);   
            this.buttonsAnswer[i].click = true;    
            this.buttonsAnswer[i].inputEnabled = true;
            this.buttonsAnswer[i].input.useHandCursor = true;
            this.buttonsAnswer[i].events.onInputDown.add(this.mouseInputDown, this); 
        }
    },

    disableEventMouse:function(){
        console.log("***disableEventMouse***");
        tam = this.buttonsAnswer.length;
        for(i=0; i<tam; i++){         
            this.buttonsAnswer[i].inputEnabled = false;
            this.buttonsAnswer[i].input.useHandCursor = false;
            this.buttonsAnswer[i].input.reset();
        }
    },

    mouseInputDown:function(elem){ 
        console.log("***mouseInputDown***");
        if(elem.click){
            this.movimentaFolha(elem);
            this.changeImage(elem, "setas", elem.x, elem.y, elem.name);
            this.disableEventMouse();
            elem.click = false;
        }
    },

    movimentaFolha:function(elem) {
        console.log("************movimenta folha ************");
        //ANIMAÇÃO FOLHA - BAIXO 6 - > ESQUERDA 0 - > CIMA 4 - > DIREITA 2
        console.log("Nome da seta clicada: " + elem.name);
        if(elem.name == 2) {
            this.add.tween(this.folha).to({x: this.folha.x - 200}, 400, Phaser.Easing.Sinusoidal.InOut, true, 500).onComplete.add(function() { this.checkGame(elem);}, this);
        } else if(elem.name == 0) {
            this.add.tween(this.folha).to({x: this.folha.x + 200}, 400, Phaser.Easing.Sinusoidal.InOut, true, 500).onComplete.add(function() { this.checkGame(elem);}, this);
        } else if(elem.name == 4) {
            this.add.tween(this.folha).to({y: this.folha.y - 150}, 400, Phaser.Easing.Sinusoidal.InOut, true, 500).onComplete.add(function() { this.checkGame(elem);}, this);
        } else if(elem.name == 6) {
            this.add.tween(this.folha).to({y: this.folha.y + 150}, 400, Phaser.Easing.Sinusoidal.InOut, true, 500).onComplete.add(function() { this.checkGame(elem);}, this);
        }
    },

    changeImage:function(elem, image,x, y, positionSprite) {
        console.log("*****change image clicked**********");
        
        if(positionSprite == 0) {
            positionSprite = 2;
        } else if(positionSprite == 2) {
            positionSprite = 0;
        }
        var position = [];
        position = [elem.x, elem.y];
        elem.alpha = 0;
        elem = this.add.sprite(x, y, image, positionSprite + 1);
        if((positionSprite + 1) == 1 || (positionSprite + 1) == 3){
            this.groupMiddle.add(elem);
        } else if((positionSprite + 1) == 5) {
            this.groupBack.add(elem);
        } else if((positionSprite + 1) == 7) {
            this.groupFront.add(elem);
        }

        this.createDelayTime(300, function() {
            elem = this.add.sprite(position[0], position[1], image, positionSprite);
            if(positionSprite == 0 || positionSprite == 2) {
                this.groupMiddle.add(elem);
            } else if(positionSprite == 4) {
                this.groupBack.add(elem);
            } else {
                this.groupFront.add(elem);
            }
        }, this);

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
        this.createDelayTime(200, function() {
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

        this.resetaArray();
        this.resetLevel(this.currentLevel);
        if(this.currentLocalErrors > 0) {
            
            this.currentLocalErrors--;

            //this.sound.play("hitErro");
            this.onErrorChance(target);
            return;
        }
        
        this.onPlayerError();
        
        switch(this.lives) {
            case 1: // mostra dica 1

                this.createDelayTime(300, function() {
                    this.hideLevel(function() {
                        this.onCompleteShowDica();
                    });
                }); 
                
            break;
            case 0: // toca som de resumo
                this.lives = 0;

                this.createDelayTime(300, function() {
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

    },

    //____________________________ funcoes do jogo ____________________________________________________________________________________
    showTutorialPlacar:function(group) { 
        this.tutorialPlacar = this.add.sprite(this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);
        group.add(this.tutorialPlacar);
        this.add.tween(this.tutorialPlacar).to({y: -140}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
            this.showTextLevel(this.certo);
        }, this);
    }, 

    showTextLevel:function(direcao) {
        var text; 
        if(direcao == 0) {           
            text = "Levem a folha para a direita!";
        } else if(direcao == 2) {
            text = "Levem a folha para a esquerda!";
        } else if(direcao == 4) {
            text = "Levem a folha para cima!";
        } else if(direcao == 6) {
            text = "Levem a folha para baixo!";
        }
        var levelText = this.drawText(this.world.centerX, 45, text, 22, "center");
        levelText.alpha = 0;
        this.addLevelGroup(levelText);
        this.add.tween(levelText).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
            //TOCA SOM Call to Action e depois o sound question
            this.soundCtA = this.setDebugAudio('soundCtA');
            this.soundCtA.onStop.add(function() {
                this.soundQuestion = this.setDebugAudio('sound_'+direcao);
                this.soundQuestion.onStop.add(function() {
                    this.enableEventMouse();
                }  , this);    
        }, this);
        },this);
    },

    addText:function(texto, tint, scale, x, y, group) { 
        console.log("******addText*****");
        var text = texto.toString(); 
        var newText =  this.add.bitmapText(x,y, "Luckiest", texto,100);
        newText.tint = tint;
        newText.scale.set(scale, scale);
        newText.alpha = 0;
        group.add(newText);
        this.add.tween(newText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    randomIndexQuestion:function(arrayName){
        console.log("***randomIndexQuestion***");
        var sizeArray = arrayName.length;
        this.randomIndex = Math.floor(Math.random() * ((sizeArray - 1) - 0 + 1)) + 0;
        return this.randomIndex;
    },

     randomQuestion: function(arrayName) {
        console.log("******randomQuestion*****");
        this.index_question = this.randomIndexQuestion(arrayName);
        var ramdomQuestion = arrayName[this.index_question];
        return ramdomQuestion;
    },

    stopClickAnimation:function(elem, tempo) {
        this.createDelayTime(tempo, function() {
            elem.animations.stop();
            elem.alpha = 0;
        });
    },

    resetRandom: function() { 
        this.spliceLetter = [
            null,
            [],
            [],
            [],
            []
        ];
    },

    addIntroGroup:function(elem){
        this.groupIntro.add(elem);
    },

    addLevelGroup:function(elem){
        this.groupLevel[this.currentLevel].add(elem);    
    },

    checkGame:function(elem){
        console.log("***checkGame***");
        if(elem.name == this.certo){
            console.log("CORRETA");
                this.sound.play("hitAcerto");
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
        this.add.tween(this.folha).to({alpha: 0}, 400, Phaser.Easing.Linear.None, true).onComplete.add(function() {
        this.add.tween(this.buttonsAnswer[0]).to({alpha: 0}, 400, Phaser.Easing.Linear.None, true);
        this.add.tween(this.buttonsAnswer[1]).to({alpha: 0}, 400, Phaser.Easing.Linear.None, true);
        this.add.tween(this.buttonsAnswer[2]).to({alpha: 0}, 400, Phaser.Easing.Linear.None, true);
        this.add.tween(this.buttonsAnswer[3]).to({alpha: 0}, 400, Phaser.Easing.Linear.None, true);
        
        this.createDelayTime(450, function() {
        this.add.tween(this.groupLevel[nivel]).to({alpha:0}, 400, Phaser.Easing.Linear.None, true, 500);
            if(this.groupLevel[nivel] != null) {
                this.groupLevel[nivel].removeAll(true);
            }
        });
        }, this);
    }
};

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

    } 
};
*/


