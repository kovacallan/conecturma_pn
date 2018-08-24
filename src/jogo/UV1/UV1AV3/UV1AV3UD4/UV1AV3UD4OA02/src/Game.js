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

        this.TEMPO_INTRO = 31000;
        this.ENABLE_CALL_TO_ACTION = true;
        this.ENABLE_PLACAR = true; // para desabilitar o placar 


        // quantidade de perguntas que tem em cada nivel
        // 2 acertos em cada rodada para passar para a próxima
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
        this.groupLevel = [null,1,2,3,4,5,6];

        /* 
            alternativas_level_1 = [1,4];
            alternativas_level_2 = [[6, 8], [10, 11], [13, 14]];
            alternativas_level_3 = [[1, 17, 18], [20, 21, 22], [24, 25, 26]];
            
            cada subarray é de um nível em this.rpt_certas: [[F],[ M], [D]]
        */
        this.rpt_certas = [[0, 3, 5], [7, 9, 12], [15, 19, 23]];
        this.array_alternativas = [1, 2, 4];
       
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

        var t1 = "Cavalhada combina com [galinhada]! \nPra começar a nossa, que é mágica, só \npodemos colocar ingredientes que \npossuam o som de [S] na palavra.";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 22, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t2 = "Como aqui, entre esses dois o que tem som de [S] é \n[DOCE]. Viram que DOCE não tem a letra [S] mas tem o \nSOM de [S]? " + "Doce" + ". Hmmm, O que mais temos que \ncolocar?";
        var tutorialText1 = this.drawText(this.world.centerX, 20, t2, 22, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);
        
        //ADICIONA KIM
        var kim = this.showKim(12070);

        //TEXTO 0 APARECE E INICIA O ÁUDIO DA INTRO 
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);

        //INICIA TUTORIAL
        this.createDelayTime(3600, function() {
            this.showLiveTutorial();
        });

        //DESAPARECE TEXTO 0 E INICIA TEXTO 1
        this.createDelayTime(12270, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.tutorialPlacar).to({y: -120}, 200, Phaser.Easing.Linear.None, true);
                this.add.tween(tutorialText1).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true);
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
        //this.background = this.addSpriteMeu('img_background',100,-100,0);
        this.background = this.add.sprite(398,176, 'img_background');
        this.background.scale.set(1, 1);
        this.background.anchor.set(0.5,0.5);

        //this.anim_caldeirao = this.addSpriteMeu('anim_caldeirao',100,-100);
        this.anim_caldeirao = this.add.sprite(805, 442, 'anim_caldeirao');
        this.anim_caldeirao.anchor.set(0.5,0.5);
        this.anim_caldeirao.animations.add('animacao', null, 18, true);
        this.anim_caldeirao.animations.play('animacao');

        //this.anim_guri = this.addSpriteMeu('anim_guri',100,-100);
        this.anim_guri = this.add.sprite(155, 390, 'anim_guri');
        this.anim_guri.anchor.set(0.5,0.5);
        this.anim_guri.animations.add('animacao', null, 18, true);
        this.anim_guri.animations.play('animacao');
        this.anim_guri.scale.set(1, 1);
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");

        //RESPOSTA 1 - TUTORIAL
        this.img_respostas_1 = this.add.sprite(-347, 464, 'img_respostas', 1);
        this.img_respostas_1.anchor.set(0.5,0.5);
        this.img_respostas_1.alpha = 0;
        this.groupIntro.add(this.img_respostas_1);

        this.boomerangAnimation(this.img_respostas_1, 437, 464, 347, 464);

        //RESPOSTA 2 - TUTORIAL
        this.img_respostas_2 = this.add.sprite(-347, 464, 'img_respostas', 27);
        this.img_respostas_2.anchor.set(0.5,0.5);
        this.img_respostas_2.alpha = 0;
        this.groupIntro.add(this.img_respostas_2);

        this.createDelayTime(800, function() {
            this.boomerangAnimation(this.img_respostas_2, 619, 464, 529, 464);
        });
        
        //ARROW - TUTORIAL
        this.arrow = this.add.sprite(292,290, 'arrow');
        this.arrow.anchor.set(0.5,0.5);
        this.arrow.alpha = 0;
        this.groupIntro.add(this.arrow);
        
        this.createDelayTime(22000, function() {
            this.add.tween(this.arrow).to({alpha:1},500, Phaser.Easing.Linear.None, true);
        });

        //ANIMATION - ARROW, CLICK E ALTERNATIVA CERTA - 13230
        this.createDelayTime(24000, function() {
           this.add.tween(this.arrow).to({x:541,y:461}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {  
                var click = this.add.sprite(501, 428, "clickAnimation");
                click.animations.add('clickAnim', null, 18, true);
                click.animations.play('clickAnim'); 
                //ANIMATION - COLOCA IMAGEM DENTRO DO CALDEIRÃO
                this.createDelayTime(1000, function() {
                    this.add.tween(this.img_respostas_2.scale).to({x:0.3,y:0.3}, 500, Phaser.Easing.Linear.None, true);
                    this.add.tween(this.img_respostas_2).to({x:811,y:367}, 500, "Sine.easeInOut", true).onComplete.add(function() {
                       this.add.tween(this.img_respostas_2).to({alpha:0},500, Phaser.Easing.Linear.None, true);
                    }, this);    
                    this.add.tween(this.img_respostas_2).interpolation(Phaser.Math.bezierInterpolation);
                });

               //STOP ANIMATION CLICK //805, 442
                this.createDelayTime(1000, function() {
                    click.animations.stop();
                    this.arrow.alpha = 0;
                });
                this.groupIntro.add(click);
            }, this);
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
        var t1 = "É bom lembrar que muitas palavras mesmo \ntendo som de [S] não possuem a letra [S] nelas,\nafinal outras letras também podem fazer o \nsom de [S]!";
        var tutorialText = this.drawText(this.world.centerX, 60, t1, 22, "center");
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
                this.CallToAction();
                this.showQuestion(1);
                this.initLevel1(this.rpt_certas[0], this.array_alternativas);
            break;
            case 2:
                this.CallToAction();
                this.showQuestion(2);
                this.initLevel1(this.rpt_certas[0], this.array_alternativas);
            break;
            case 3:
                this.CallToAction();
                this.showQuestion(3);
                this.array_alternativas = [[6, 8], [10, 11], [13, 14]];
                this.initLevel2(this.rpt_certas[1], this.array_alternativas);
            break;
             case 4:
                this.CallToAction();
                this.showQuestion(4);
                this.initLevel2(this.rpt_certas[1], this.array_alternativas);
            break;
            case 5:
                this.CallToAction();
                this.showQuestion(5);
                this.array_alternativas = [[1, 17, 18], [20, 21, 22], [24, 25, 26]];
                this.initLevel3(this.rpt_certas[2], this.array_alternativas);
            break;
            case 6:
                this.CallToAction();
                this.showQuestion(6);
                this.initLevel3(this.rpt_certas[2], this.array_alternativas);
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
    
    //FUNCTION USADA PARA AS DUAS RODADAS DO NIVEL 1       
    initLevel1: function(arrayAuxRespostasCertas, arrayAuxAlternativas) {

        console.log("***initLevel1***");
        this.groupLevel[this.currentLevel] = this.add.group();

        //determina o array de alternativas de respostas
        this.nivel = 1;

        //RESPOSTA CERTA
        console.log("Array Aux Certas: " + arrayAuxRespostasCertas);
        this.certo = this.randomQuestion(arrayAuxRespostasCertas);
        console.log("Questão Escolhida: " + this.certo);

        //CRIA ARRAY DE ALTERNATIVAS DE RESPOSTAS
        this.arrayAnswers = this.createArrayAnswers(this.certo, arrayAuxAlternativas);

        //Retira número escolhido do array das respostas e retira alternativa correspondente a resposta certa do array alternativas_rpt
        this.organizaArrays(arrayAuxRespostasCertas, arrayAuxAlternativas);

        //CRIA BOTÕES DE RESPOSTA
        this.buttonsAnswer = [];
        this.createDelayTime(1000, function(){
        this.createButtonAnswer(0, -347, 464, 'img_respostas', this.arrayAnswers[0]);
        this.createButtonAnswer(1, -347, 464, 'img_respostas', this.arrayAnswers[1]);

        //ANIMAÇÃO DOS BOTÕES
        this.boomerangAnimation(this.buttonsAnswer[0], 437, 464, 347, 464);

        this.createDelayTime(800, function() {
            this.boomerangAnimation(this.buttonsAnswer[1], 619, 464, 529, 464);
                this.createDelayTime(5300, function() {
                    //QUESTION - SOM
                    this.enableSomQuestion();
                    
                    // QUESTION - LIBERA CLICK
                    this.enableEventMouse();
            });
        });

        //limpa array de respostas
        this.arrayAnswers = [];
        });
    },

    //FUNCTION USADA PRAS DUAS RODADAS DO NIVEL 2
    initLevel2: function(arrayAuxRespostasCertas, arrayAuxAlternativas) {
        
        console.log("***initLevel2***");
        this.groupLevel[this.currentLevel] = this.add.group();

        //determina o array de alternativas de respostas
        this.nivel = 2;

        //RESPOSTA CERTA
        this.certo = this.randomQuestion(arrayAuxRespostasCertas);
        console.log("Questão Escolhida: " + this.certo);

        //CRIA ARRAY DE ALTERNATIVAS DE RESPOSTAS
        this.arrayAnswers = this.createArrayAnswers(this.certo, arrayAuxAlternativas);
        
        //Retira número escolhido do array das respostas e retira alternativa correspondente a resposta certa do array alternativas_rpt
        this.organizaArrays(arrayAuxRespostasCertas, arrayAuxAlternativas);

        //CRIA BOTÕES DE RESPOSTA
        this.buttonsAnswer = [];
        this.createDelayTime(1000, function(){
        this.createButtonAnswer(0, -347, 464, 'img_respostas', this.arrayAnswers[0]);
        this.createButtonAnswer(1, -347, 464, 'img_respostas', this.arrayAnswers[1]);
        this.createButtonAnswer(2, -447, 262, 'img_respostas', this.arrayAnswers[2]);

        console.log("ARRAY_ANSWER_1: " + this.arrayAnswers[0]);
        console.log("ARRAY_ANSWER_2: " + this.arrayAnswers[1]);
        console.log("ARRAY_ANSWER_3: " + this.arrayAnswers[2]);

        //ANIMAÇÃO DOS BOTÕES
        this.boomerangAnimation(this.buttonsAnswer[0], 437, 464, 347, 464);

        this.createDelayTime(800, function() {
            this.boomerangAnimation(this.buttonsAnswer[1], 619, 464, 529, 464);
                // DELAY - SOM CALLTOACTION
                this.createDelayTime(800, function() {
                    this.boomerangAnimation(this.buttonsAnswer[2], 537, 262, 447, 262);
                    
                    this.createDelayTime(4500, function() {
                        // QUESTION - SOM
                        this.enableSomQuestion();
                        
                        // QUESTION - LIBERA CLICK
                        this.enableEventMouse();
                    });
                });
        });

        //limpa array de respostas
        this.arrayAnswers = [];
        });
    },

    //FUNCTION USADA PRAS DUAS RODADAS DO NIVEL 3
    initLevel3: function(arrayAuxRespostasCertas, arrayAuxAlternativas) {
    
        console.log("***initLevel3***");
        this.groupLevel[this.currentLevel] = this.add.group();

        //determina o array de alternativas de respostas
        this.nivel = 3;

        //RESPOSTA CERTA
        this.certo = this.randomQuestion(arrayAuxRespostasCertas);
        console.log("Questão Escolhida: " + this.certo);

        //CRIA ARRAY DE ALTERNATIVAS DE RESPOSTAS
        this.arrayAnswers = this.createArrayAnswers(this.certo, arrayAuxAlternativas);
        
        //Retira número escolhido do array das respostas e retira alternativa correspondente a resposta certa do array alternativas_rpt
        this.organizaArrays(arrayAuxRespostasCertas, arrayAuxAlternativas);

        //CRIA BOTÕES DE RESPOSTA
        this.buttonsAnswer = [];
        this.createDelayTime(1000, function(){
        this.createButtonAnswer(0, -347, 464, 'img_respostas', this.arrayAnswers[0]);
        this.createButtonAnswer(1, -347, 464, 'img_respostas', this.arrayAnswers[1]);
        this.createButtonAnswer(2, -447, 262, 'img_respostas', this.arrayAnswers[2]);
        this.createButtonAnswer(3, -447, 262, 'img_respostas', this.arrayAnswers[3]);

        //ANIMAÇÃO DOS BOTÕES - DELAYS CONFORME ANIM. BOTÕES
        this.boomerangAnimation(this.buttonsAnswer[0], 437, 464, 347, 464);

        this.createDelayTime(800, function() {
            this.boomerangAnimation(this.buttonsAnswer[1], 619, 464, 529, 464);
                // DELAY - SOM CALLTOACTION
                this.createDelayTime(800, function() {
                    this.boomerangAnimation(this.buttonsAnswer[2], 437, 262, 347, 262);
                        this.createDelayTime(800, function() {
                            this.boomerangAnimation(this.buttonsAnswer[3], 619, 262, 529, 262);
                            this.createDelayTime(3700, function() {
                            // QUESTION - SOM
                            this.enableSomQuestion();
                            // QUESTION - LIBERA CLICK
                            this.enableEventMouse();
                         });
                    });
                });
        });

        //limpa array de respostas
        this.arrayAnswers = [];
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
                        this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
                    });
                }); 
            
            //RESETA ARRAYS
            this.rpt_certas = [[0, 5], [7, 9, 12], [15, 19, 23]];

            console.log("Nível atual: " + this.nivel);
            if(this.nivel == 1) {
               this.array_alternativas = [1,4];
            } if(this.nivel == 2) {
                this.array_alternativas =  [[6, 8], [10, 11], [13, 14]];
            } if(this.nivel == 3) {
                this.array_alternativas = [[1, 17, 18], [20, 21, 22], [24, 25, 26]];
            }

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
    changeHappy:function(elem, anim,anim2,x,y,x1,y1){
        elem.loadTexture(anim, 0);
        elem.x = x;
        elem.y = y;
        var anim  = elem.animations.add(anim);
        anim.onComplete.add(function() {
            this.changeNormal(elem,anim2,x1,y1);
        }, this);
        anim.play(18, false);
    },

    changeNormal:function(elem,anim,x,y){
        elem.loadTexture(anim, 0);
        elem.x = x;
        elem.y = y;
        elem.animations.add(anim);
        elem.animations.play(anim, 18, true);
    },


    boomerangAnimation:function(sprite, x_avanco, y_avanco, x_fim, y_fim) {
        this.add.tween(sprite).to({alpha:1}, 700, "Quart.easeOut", true).onComplete.add(function() {
            this.add.tween(sprite).to({x:x_avanco, y:y_avanco}, 900, "Quart.easeOut", true).onComplete.add(function() {
                this.add.tween(sprite).to({x:x_fim, y:y_fim}, 900, "Quart.easeOut", true);
            }, this);  
        }, this); 
    },

    randomIndexQuestion:function(arrayName){
        console.log("***randomIndexQuestion***");
        var sizeArray = arrayName.length;
        var randomIndex = Math.floor(Math.random() * ((sizeArray - 1) - 0 + 1)) + 0;
        return randomIndex;
    },

     randomQuestion: function(arrayName) {
        console.log("******randomQuestion*****");
        this.index_question = this.randomIndexQuestion(arrayName);
        var ramdomQuestion = arrayName[this.index_question];
        return ramdomQuestion;
    },

    CallToAction:function() {
        console.log("***SoundCallToAction***");
        this.soundCallToAction = this.setDebugAudio("soundCallToAction");
    },

    createArrayAnswers:function(respCerta, arrayAuxAlternativas) {
        console.log("***createArrayAnswers***");
        
        //cria array de opções de respostas de acordo com nível de dificuldade
        if(this.nivel == 1) {
            var arrayAnswers = [respCerta, arrayAuxAlternativas[this.index_question]];
        } if(this.nivel == 2) {
            var arrayAnswers = [respCerta, arrayAuxAlternativas[this.index_question][0], arrayAuxAlternativas[this.index_question][1]];
        } if(this.nivel == 3) {
            var arrayAnswers = [respCerta, arrayAuxAlternativas[this.index_question][0], arrayAuxAlternativas[this.index_question][1], arrayAuxAlternativas[this.index_question][2]];
        }
        
        //desordena o array pras alternativas não aparecerem sempre na mesma ordem
        for(var j, x, i = arrayAnswers.length; i; j = Math.floor(Math.random() * i), x = arrayAnswers[--i], arrayAnswers[i] = arrayAnswers[j], arrayAnswers[j] = x);
        
        console.log("Array das opções de respostas: " + arrayAnswers);
        return arrayAnswers;
    },

    /* Nos dois primeiros níveis, o index do nº sorteado e o index da alternativa de resposta serão os mesmos*/
    organizaArrays:function(arrayAuxCerta, arrayAuxAlternativa) {
        console.log("******organizaArrays*****");
        
        // tira o número escolhido do array aux de rpts certas
        console.log("Array Aux Certas: " +   arrayAuxCerta);
        console.log("Array Certas: " +   this.rpt_certas[0]);
        arrayAuxCerta.splice(this.index_question, 1);
        console.log("Array Aux Certas Sem alternativa certa: " +   arrayAuxCerta);
        console.log("Array Certas Sem alternativa certa: " +    this.rpt_certas[0]);

        // tira a alternativa corresponde a resposta certa do array de alternativa
        console.log("Array Aux Alternativas: " + arrayAuxAlternativa);
        arrayAuxAlternativa.splice(this.index_question, 1);
        console.log("Array Aux Alternativas sem opcao de resposta: " + arrayAuxAlternativa);
    },

    createButtonAnswer:function(position_button, x, y, nameSprite, nameButton) {
        console.log("******createButtonAnswer***** :img_respostas_"+position_button+": " +nameButton);
        this.buttonsAnswer[position_button] = this.add.sprite(x, y, nameSprite, nameButton);
        this.buttonsAnswer[position_button].anchor.set(0.5,0.5);
        this.buttonsAnswer[position_button].alpha = 0;
        this.buttonsAnswer[position_button].name = nameButton;
        this.addLevelGroup(this.buttonsAnswer[position_button]);
    }, 
    //INSERI FUNÇÕES PRA CHAMAR SOM DOS BOTÕES
    enableSomQuestion: function(){
        console.log("***enableSomQuestion***");
        tam = this.buttonsAnswer.length;
        for(i=0; i<tam; i++){        
            this.buttonsAnswer[i].events.onInputOver.add(this.overButtonAnswer, this);
            this.buttonsAnswer[i].events.onInputOut.add(this.outButtonAnswer, this); 
        }
    },

    // INICIA SOM QUANDO MOUSE ESTA SOBRE IMAGEQUESTION
    // RECEBE O ELEMENTO AO QUAL O MOUSE ESTA EM CIMA COMO PARAMETRO
    // onStop.add(soundStopped, this);
    overButtonAnswer: function(elemClicked) {
        console.log("***overButtonAnswer***");
        this.audio_answer = this.add.audio(elemClicked.name);
        this.audio_answer.play();
    },

    //SE O MOUSE SAIR DE CIMA DA IMAGEM, O SOM DELA PARA
    outButtonAnswer:function(sound) {
        console.log("***outButtonAnswer***");
        this.audio_answer.stop();
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

    enableEventMouse:function(){
        console.log("***enableEventMouse***");

        tam = this.buttonsAnswer.length;
        for(i=0; i<tam; i++){  
            console.log("button "+i); 
            this.buttonsAnswer[i].click = true;      
            this.buttonsAnswer[i].inputEnabled = true;
            this.buttonsAnswer[i].useHandCursor = true;
            this.buttonsAnswer[i].events.onInputDown.add(this.mouseInputDown, this); 
        }
    },

    disableEventMouse:function(){
        console.log("***disableEventMouse***");
        tam = this.buttonsAnswer.length;
        for(i=0; i<tam; i++){         
            this.buttonsAnswer[i].inputEnabled = false;
            this.buttonsAnswer[i].useHandCursor = false;
            this.buttonsAnswer[i].input.reset();
        }
    },

    mouseInputDown:function(elem){ // elem = elemento que foi clicado
        console.log("***mouseInputDown***");
        
        //SE BOTÃO FOI CLICADO, DESATIVA O SOM DELE
        elem.events.onInputOver.add(this.outButtonAnswer, this); 

        if(elem.click){
            this.disableEventMouse();
            this.add.tween(elem.scale).to({x:1.2,y:1.2}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(elem.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.createDelayTime(500, function() {
                        this.checkGame(elem);
                    });
                    
                },this);
            },this);
        }
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
                this.changeHappy(this.anim_guri, 'anim_guri_happy','anim_guri', 165, 387, 155, 390);
                this.createDelayTime(200, function() {
                    this.clickRightButton();
                });
        }else{
            console.log("ERRADA");
                this.sound.play("hitErro");
                this.createDelayTime(500, function() {
                    this.clickWrongButton();
                });
        }
    },

    resetLevel:function(nivel){
        
        console.log("***resetLevel***");
        
        this.createDelayTime(300, function() {
             this.add.tween(this.groupLevel[nivel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
             
             if(this.groupLevel[nivel] != null) {
                this.groupLevel[nivel].removeAll(true);
             }
        }); 
    },
};

/*
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

