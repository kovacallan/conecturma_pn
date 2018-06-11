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

        this.TEMPO_INTRO = 19400;
        this.ENABLE_CALL_TO_ACTION = true;
        this.ENABLE_PLACAR = true; // para desabilitar o placar 

        // quantidade de perguntas que tem em cada nivel
        // 2 acertos em cada rodada para passar para a próxima
        this.totalLevel1 = 1;
        this.totalLevel2 = 1;
        this.totalLevel3 = 1;

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

        this.groupLevel = [null, 1, 2, 3];
        this.arrayQuestion = [[null], [0, 1, 2], [0, 1, 2], [0, 1, 2]];
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
        console.log("************show text intro**************");
        
        var t1 = "Esses [3 indiozinhos] são muito fofos!\n E familiares também… eles querem\n dizer pra gente o nome da tribo onde \neles cresceram, mas para que eles\n escrevam o nome em nosso caderno,\n vamos mostrar que sabemos\n usar tudo direitinho?";
        var tutorialText = this.drawText(this.world.centerX+60, 13, t1, 22, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);
        
        var kim = this.showKim(this.TEMPO_INTRO - 50);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);

        this.createDelayTime(this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                this.showFinishedLiveTutorial();
            }, this);
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
        this.add.tween(this.assets3[0]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.assets2[0]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.assets2[1]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.assets2[2]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
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
        console.log("********create scene**********");
        // this.background = this.addSpriteMeu('background',-11, -40);
        this.background = this.add.sprite(-11, -40, 'background');

        // this.apontador = this.addSpriteMeu('apontador',689, 417);
        this.apontador = this.add.sprite(689, 417, 'apontador');

        this.assets1 = [];
        // this.assets1[0] = this.addSpriteMeu('lapis',271, 79);
        this.assets1[0] = this.add.sprite(271, 79, 'lapis');
        this.assets1[0].name = 0;
        this.assets1[0].angle = 25;
        // this.assets1[1] = this.addSpriteMeu('caneta',214, 84);
        this.assets1[1] = this.add.sprite(214, 84, 'caneta');
        this.assets1[1].name = 1;
        this.assets1[1].angle = 25;
        // this.assets1[2] = this.addSpriteMeu('pincel',257, 207);
        this.assets1[2] = this.add.sprite(257, 207, 'pincel');
        this.assets1[2].name = 2;
        this.assets1[2].angle = 10;

        this.assets2 = [];
        // this.assets2[0] = this.addSpriteMeu('rabisco_bumba',507, 422);
        this.assets2[0] = this.add.sprite(507, 422, 'rabisco_bumba');
        this.assets2[0].name = 0;
        this.assets2[0].alpha = 1;
        // this.assets2[1] = this.addSpriteMeu('rabisco_sorriso',561, 236);
        this.assets2[1] = this.add.sprite(561, 236, 'rabisco_sorriso');
        this.assets2[1].name = 1;
        this.assets2[1].alpha = 1;
        // this.assets2[2] = this.addSpriteMeu('rabisco_trovao',409, 328);
        this.assets2[2] = this.add.sprite(409, 328, 'rabisco_trovao');
        this.assets2[2].name = 2;
        this.assets2[2].alpha = 1;
        // this.assets2[3] = this.addSpriteMeu('borracha',708, 477);
        this.assets2[3] = this.add.sprite(708, 477, 'borracha');

        this.assets3 = [];
        // this.assets3[0] = this.addSpriteMeu('regua',882, 128);
        this.assets3[0] = this.add.sprite(882, 128, 'regua');

    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");

    },

    stopClickAnimation:function(elem, tempo) {
        this.createDelayTime(tempo, function() {
            elem.animations.stop();
            elem.alpha = 0;
        });
    },
    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showFinishedLiveTutorial:function() {
        console.log("showFinishedLiveTutorial");
        this.createDelayTime(300, function() {
            this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialPlacar).to({y: -300}, 600, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);
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

       console.log("******show text resumo********");
        var t1 = "Lápis é pra [escrever], caneta pra escrever [sem]\n [medo de errar], régua para [medir], pincel para \n [pintar]… nossa, tá parecendo uma poesia… ou\n uma música! Se nos lembrarmos direitinho\n como usamos nosso material escolar, esse\n jogo é moleza! Vamos lá!";
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
        
        //sorteia num. question
        console.log("Array questions: " + this.arrayQuestion[level]);
        this.question = this.randomQuestion(this.arrayQuestion[level]);
        var indexRandomQuestion = this.index_question;
        
        console.log("Question: " + this.question);
        this.arrayQuestion[level].splice(indexRandomQuestion, 1);
        this.certo = this.question;
        console.log("Resp. Certa: " + this.certo);
        
        //toca sound question sorteada. libera click se nivel 1. libera drag and drop se nivel 2 ou 3
        this.soundQuestion = this.setDebugAudio('P'+level+'_'+this.question);
        this.soundQuestion.onStop.add(function() {
            if(level == 1) {
                this.createTimer(10);
                this.enableEventMouse();
            } else if(level == 2) {
                this.createTimer(8);
                this.enableDragAndDrop(this.assets2[3]);
            } else if(level == 3) {
                this.createTimer(6);
                this.assets3[0].alpha = 0;
                this.assets3[0] = this.add.sprite(853, 126, 'regua_2');
                this.enableDragAndDrop(this.assets3[0]);
            }
        }  , this); 
    },

     updateCounter: function() {
        console.log("**************UPDATECOUNTER***************");
        this.counter--;
        this.textTimerShadow.text = this.textTimer.text = this.counter;
        //se chegou em 0 segundos é pq o jogador não clicou em nenhuma opção - > considerar erro
        if(this.counter == 0) {
            if(this.nivel == 1) {
                this.disableEventMouse();
            } else if(this.nivel == 2) {
                this.disableDragDrop(this.assets2[3]);
            } else if(this.nivel == 3) {    
                this.disableDragDrop(this.assets3[0]);
            }
            this.removeTimer();
            this.createDelayTime(200, function() {
                this.sound.play("hitErro");
                this.clickWrongButton(); 
            });
        }
    },

    createTimer: function(totalTimer) {
        this.counter = totalTimer;
        this.gameTimer = this.game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
        this.textTimerShadow =  this.add.bitmapText(this.world.centerX-20,  540, "JandaManateeSolid", this.counter.toString(), 48);
        this.textTimerShadow.tint = 0x010101;
        this.textTimer = this.add.bitmapText(this.world.centerX-22,533, "JandaManateeSolid", this.counter.toString(), 48);
        this.textTimer.tint = 0xFDB40B;
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

    enableEventMouse:function(){
        console.log("***enableEventMouse***");
        for (var i = this.assets1.length - 1; i >= 0; i--) {
            console.log("button "+i);  
            this.assets1[i].click = true;     
            this.assets1[i].inputEnabled = true;
            this.assets1[i].useHandCursor = true;
            this.assets1[i].events.onInputDown.add(this.mouseInputDown, this); 
        }
    },

    mouseInputDown:function(elem){ 
        console.log("***mouseInputDown***");
        if(elem.click){
            elem.click = false;
            this.removeTimer();
            this.disableEventMouse();
            this.add.tween(elem.scale).to({x:1.2,y:1.2}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(elem.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                    this.checkGame(elem);
                }, this);
            },this);
        }
    },

    disableEventMouse:function(){
        console.log("***disableEventMouse***");
        for (var i = this.assets1.length - 1; i >= 0; i--) {
            this.assets1[i].click = false;
            this.assets1[i].inputEnabled = false;
            this.assets1[i].useHandCursor = false;
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
        
        //CONTROLE DE NÍVEL
        if(this.nivel == 2) {
            this.nivel--;
        } else if(this.nivel == 3) {
            this.nivel--;
        }

        this.resetLevel(this.currentLevel);
        if(this.currentLocalErrors > 0) {
            
            this.currentLocalErrors--;

            this.sound.play("hitErro");
            this.onErrorChance(target);
            return;
        }
        
        this.onPlayerError();
        
        switch(this.lives) {
            case 1: // mostra dica 1

                this.createDelayTime(500, function() {
                    this.hideLevel(function() {
                        this.onCompleteShowDica();
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

    },

    //____________________________ funcoes do jogo ____________________________________________________________________________________
    checkGame:function(elem){
        console.log("***checkGame***");
        if(elem.name == this.certo){
            console.log("CORRETA");
            this.sound.play("hitAcerto");
            this.createDelayTime(200, function() {
                this.clickRightButton();
            });
        } else {
            console.log("ERRADA");
            this.sound.play("hitErro");
            this.createDelayTime(200, function() {
                this.clickWrongButton(); 
            });   
        }
        
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

    createArrayAnswers:function(qtdeAnswers) {
        console.log("***createArrayAnswers*** " + qtdeAnswers);
        
        var arrayAnswers = [];
        var opcoesAnswers = [1,2,3,4,5];

        for (var i = qtdeAnswers - 1; i >= 0; i--) {
            arrayAnswers.push(this.randomQuestion(opcoesAnswers));
            opcoesAnswers.splice(this.randomIndex, 1);
            if(opcoesAnswers.length == 1) {
                opcoesAnswers = [1,2,3,4,5];
            }
        };
        
        //desordena o array pras alternativas não aparecerem sempre na mesma ordem
        for(var j, x, i = arrayAnswers.length; i; j = Math.floor(Math.random() * i), x = arrayAnswers[--i], arrayAnswers[i] = arrayAnswers[j], arrayAnswers[j] = x);
        
        console.log("Array das opções de respostas: " + arrayAnswers);
        return arrayAnswers;
    },

    createButtonAnswer:function(level, arrayAnswers) {
        console.log("******createButtonAnswer*****");
        this.buttonsAnswer = [];
        var coordenadasX = this.coordenadas_answer_x[level - 1][this.index_array_qtde_frutas];
        var coordenadasY = this.coordenadas_answer_y[level - 1][this.index_array_qtde_frutas];
        console.log("array_x: " + coordenadasX);
        console.log("array_y: " + coordenadasY);
        for (var i = arrayAnswers.length - 1; i >= 0; i--) {
            this.buttonsAnswer[i] = this.add.sprite(coordenadasX[i], this.ajustaY(level, coordenadasY, i), "fruta_"+ arrayAnswers[i]);
            console.log(coordenadasX[i] + " <- x - y -> "+ this.ajustaY(level, coordenadasY, i));
            this.buttonsAnswer[i].anchor.set(0.5,0.5);
            this.buttonsAnswer[i].scale.set(0.1,0.1);
            this.buttonsAnswer[i].alpha = 0;
            this.buttonsAnswer[i].name = arrayAnswers[i];
            this.groupAnswers.add(this.buttonsAnswer[i]);
            this.animButtonAnswer(this.buttonsAnswer[i]);
        };

        this.groupLevel[this.currentLevel].add(this.groupAnswers);

        //DELAY - FIM - SOUND CALL TO ACTION
        this.createDelayTime(4000, function() {
            for (var i = this.buttonsAnswer.length - 1; i >= 0; i--) {
                this.enableDragAndDrop(this.buttonsAnswer[i]);
            }
        });
        
        this.arrayAnswers = [];
    }, 

    animButtonAnswer:function(sprite) {
        this.add.tween(sprite).to({alpha:1}, 700, "Quart.easeOut", true, 500);
        this.add.tween(sprite.scale).to({x:0.7, y:0.7}, 700, "Quart.easeOut", true, 500);  
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

    resetLevel:function(nivel){
        console.log("***resetLevel***");

        this.createDelayTime(300, function() { 
            if(this.groupLevel[nivel] != null) {
                this.groupLevel[nivel].removeAll(true);
            }
        }); 
    },

    enableDragAndDrop:function(elem){
        console.log("*************enableDragAndDrop**************");
        elem.inputEnabled = true;
        elem.input.enableDrag();
        elem.events.onDragStart.add(this.onDragStart, this);
        elem.events.onDragStop.add(this.onDragStop, this);
    },

    onDragStart:function(elem, pointer) { 
        console.log("*** ondragStart ***");
        this.positionInitial = [elem.x,elem.y];
        console.log(this.positionInitial);
    },

    checkOverlap:function(spriteA,spriteB) {
        console.log("*** checkOverlap ****");
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);
    },

    onDragStop:function(elem, pointer) {
        console.log("*** onDragStop ***");
        if(this.nivel == 2) { 
            var condicao1 = this.checkOverlap(elem, this.assets2[0]);
            var condicao2 = this.checkOverlap(elem, this.assets2[1]);
            var condicao3 = this.checkOverlap(elem, this.assets2[2]);
            
            if(condicao1 || condicao2 || condicao3) {
                this.removeTimer();
                this.disableDragDrop(elem);
                if(condicao1) {
                    this.add.tween(this.assets2[0]).to({alpha:0}, 700, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
                        this.add.tween(elem).to({x:this.positionInitial[0], y:this.positionInitial[1]}, 300, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
                            this.checkGame(this.assets2[0]);
                        }, this);
                    }, this);
                } else if(condicao2) {
                    this.add.tween(this.assets2[1]).to({alpha:0}, 700, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
                        this.add.tween(elem).to({x:this.positionInitial[0], y:this.positionInitial[1]}, 300, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
                            this.checkGame(this.assets2[1]);
                        }, this);
                    }, this);
                } else if(condicao3) {
                    this.add.tween(this.assets2[2]).to({alpha:0}, 700, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
                        this.add.tween(elem).to({x:this.positionInitial[0], y:this.positionInitial[1]}, 300, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
                            this.checkGame(this.assets2[2]);
                        }, this);
                    }, this);
                }
            } else {
                this.arrasteAleatorio(elem);
            }
            
        } else if(this.nivel == 3) {
            if(elem.x >= 386 && elem.x <= 593 && elem.y > 200) {
               //perto da linha 1 y - 226
               if(elem.y <= 236 && elem.y >= 201) {
                    this.removeTimer();
                    this.disableDragDrop(elem);
                    this.add.tween(elem).to({y: 226}, 200, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
                        this.acaoDefault(elem, 0);
                    }, this);
               }
               //perto da linha 2 y - 272
               else if(elem.y <= 282 && elem.y >= 262) {
                    this.removeTimer();
                    this.disableDragDrop(elem);
                    this.add.tween(elem).to({y: 272}, 200, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
                        this.acaoDefault(elem, 1);
                    }, this);
               }
               //perto da linha 3 y - 320
               else if(elem.y <= 350 && elem.y >= 310) {
                    this.removeTimer();
                    this.disableDragDrop(elem);
                    this.add.tween(elem).to({y: 320}, 200, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
                        this.acaoDefault(elem, 2);
                    }, this);
               } else {
                    this.removeTimer();
                    this.disableDragDrop(elem);
                    this.acaoDefault(elem, 888);
               }
            } else {
                this.arrasteAleatorio(elem);
            }
        }
    },

    acaoDefault:function(elem, nameElement) {
        elem.name = nameElement;
        this.add.tween(elem).to({x:this.positionInitial[0], y:this.positionInitial[1]}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
            this.checkGame(elem);
        }, this);
    },

    arrasteAleatorio:function(elem) {
        console.log("arraste Aleatorio");
        elem.x =  this.positionInitial[0];
        elem.y =  this.positionInitial[1];
    },

    disableAllDragDrop:function() {
        //desabilita o arraste de todos os botões
        for (var i = this.buttonsAnswer.length - 1; i >= 0; i--) {
            this.disableDragDrop(this.buttonsAnswer[i]);
        };
    },

    disableDragDrop:function(elem){   
        console.log("*** disableDragDrop ***");    
        elem.inputEnabled = false;
        elem.input.useHandCursor = false;
        elem.input.reset();
    }
};

/*
    //editor
    // somente habilitar em caso da criacao da cena e posicionamento dos elementos 

    drawPoint:function(x,y){ 
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(0);
        graphics.beginFill(0xff0000,1);
        graphics.drawCircle(x,y,5);
        graphics.endFill();

        // graphics.moveTo(0, 0);
        // graphics.lineStyle(5, 0xFFFFFF, 1);
        // graphics.lineTo(x, y);
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
};*/



