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

        this.TEMPO_INTRO = 36500;
        this.ENABLE_CALL_TO_ACTION = true;
        this.ENABLE_PLACAR = true; // para desabilitar o placar 

        this.explicacao = "1 - quadrado | 2 - triangulo | 3 - retangulo | 4 - hexagono";
        this.aux = [1,2,3,4];

        // quantidade de perguntas que tem em cada nivel
        // 3 acertos em cada rodada para passar para a próxima
        this.totalLevel1 = 3;
        this.totalLevel2 = 3;
        this.totalLevel3 = 3;

        // quantidade total de erros permitido em cada nivel
        // tolerar um erro em cada nível antes de chamarmos a dica / resuminho
        // ex: se valor está definido para 2 erros, usuario pode errar 2x e na terceira é considerado errado
        this.totalErro1 = 0;
        this.totalErro2 = 0;
        this.totalErro3 = 0;

        // TOLERANCIA DE ERRO
        // 3 VIDAS POR NÍVEL
        this.lives = 3;

        // ALTERNATIVAS
        this.alternativas = [1, 2, 3, 4];

        /*****************************************************************/
        this.keyboard_permission = false;
        this.right_keyboard_answear;
        this.input.keyboard.addCallbacks(this, null, null, this.keyPress);

        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

        this.groupLevel = [null,1, 2, 3, 4, 5, 6, 7, 8, 9];
        
        this.resetRandom();
        this.createScene();
        //this.showLiveTutorial();
        this.showIntro();
        //this.initGame();

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
        
        var t1 = "Galera... que ser folclórico danado! Ele \nhipnotizou vários tatus pra nos atacar! \nEles saem das tocas e tentam jogar \n[formas geométricas] na gente! Mas já \ndecifrei um código para ajudá‐los!";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 20, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t2 = "Se vocês acertarem o Tatu que traz uma [forma] \n[geométrica 3D], todos voltam pra toca! Mas se \nerrarmos ou demorarmos... ai ai ai!";
        var tutorialText1 = this.drawText(this.world.centerX, 20, t2, 21, "center");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t3 = "Cliquem nas formas 3D, gente! Só assim pra \nconseguirmos passar por mais essa!";
        var tutorialText2 = this.drawText(this.world.centerX, 30, t3, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);
        
        //ADICIONA KIM
        var kim = this.showKim(16750);

        //TEXTO 0 APARECE E INICIA O ÁUDIO DA INTRO 
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);

        //DESAPARECE TEXTO 0 E INICIA TEXTO 1
        this.createDelayTime(16750, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.tutorialPlacar).to({y: -120}, 200, Phaser.Easing.Linear.None, true);
                this.add.tween(tutorialText1).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
                //ACERTAR O DELAY
                this.createDelayTime(12000, function() {
                    this.add.tween(tutorialText1).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);
                    this.add.tween(tutorialText2).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true);
                });
            }, this);   
        });     

        this.createDelayTime(this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showFinishedLiveTutorial, this);
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
                    this.createDelayTime(300, function() {
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
        if(gotoNext) {
            this.createDelayTime(1000, this.gotoNextLevel);
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
        //this.background = this.addSpriteMeu('background',230,-100,0);
        this.background = this.add.sprite(448,159, 'background');
        this.background.anchor.set(0.5,0.5);


       /* // this.tatu_erro_1 = this.addSpriteMeu('tatu_erro_1', 248, 442, 0);
        // this.tatu_erro_1.anchor.set(0.5,0.5);
        // this.tatu_erro_2 = this.addSpriteMeu('tatu_erro_2', 434, 370, 0);
        // this.tatu_erro_2.anchor.set(0.5,0.5);
        // this.tatu_erro_3 = this.addSpriteMeu('tatu_erro_3', 650, 350, 0);
        // this.tatu_erro_3.anchor.set(0.5,0.5);
        // this.tatu_erro_4 = this.addSpriteMeu('tatu_erro_4', 826, 452, 0);
        // this.tatu_erro_4.anchor.set(0.5,0.5);
        
        this.tatu_keep_alive_1 = this.addSpriteMeu('tatu_keep_alive', 858, 508,0);
        this.tatu_keep_alive_1.anchor.set(0.5,0.5);*/

    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");

        //this.tatu_keep_alive_1 = this.addSpriteMeu('tatu_keep_alive',208, 496,0);    
        this.tatu_keep_alive_1 = this.add.sprite(244, 850, 'tatu_keep_alive');
        //this.groupTatu.add(this.tatu_keep_alive_1);
        this.tatuKeepAlive(this.tatu_keep_alive_1,'forma_geometrica_','1', -3, -22);
       
        //this.tatu_keep_alive_2 = this.addSpriteMeu('tatu_keep_alive',424, 421,0);    
        this.tatu_keep_alive_2 = this.add.sprite(460, 850, 'tatu_keep_alive');
        this.tatuKeepAlive(this.tatu_keep_alive_2,'forma_plana_','2', 9, 10);
      
        this.tatu_keep_alive_3 = this.add.sprite(695, 850, 'tatu_keep_alive');
        this.tatuKeepAlive(this.tatu_keep_alive_3,'forma_plana_','3',-16, 10);
    
        //this.tatu_keep_alive_4 = this.addSpriteMeu('tatu_keep_alive',822, 508,0);    
        this.tatu_keep_alive_4 = this.add.sprite(858, 850, 'tatu_keep_alive');
        this.tatuKeepAlive(this.tatu_keep_alive_4,'forma_plana_','4',-1.5, 5);

        this.groupIntro.add(this.tatu_keep_alive_1);
        this.groupIntro.add(this.tatu_keep_alive_2);
        this.groupIntro.add(this.tatu_keep_alive_3);
        this.groupIntro.add(this.tatu_keep_alive_4);

        this.adicionaBuraco();

        this.createDelayTime(500, function() {
            this.animTatuKeepAlive(this.tatu_keep_alive_2, 460, 401, 460, 421);
            this.createDelayTime(500, function() {
                this.animTatuKeepAlive(this.tatu_keep_alive_3, 695, 386, 695, 403);
                this.createDelayTime(500, function() {
                    this.animTatuKeepAlive(this.tatu_keep_alive_1, 244, 476, 244, 496);
                    this.createDelayTime(500, function() {
                        this.animTatuKeepAlive(this.tatu_keep_alive_4, 858, 488, 858, 508);
                    }, this);
                }, this);
            }, this);
        });

        //ARROW - TUTORIAL
        //this.add.addSpriteMeu('clickAnim', 593, 533,0)
        this.arrow = this.add.sprite(292,260, 'arrow');
        this.arrow.anchor.set(0.5,0.5);
        this.arrow.alpha = 0;
        this.groupIntro.add(this.arrow);
        
       /* this.createDelayTime(8000, function() {
            this.tatu_erro_2 = this.add.sprite(434, 370,'tatu_erro_2');
            this.tatu_erro_2.anchor.set(0.5,0.5);
            var anim = this.tatu_erro_2.animations.add('animacao', null, 18, true);
            this.groupIntro.replace(this.tatu_keep_alive_2, this.tatu_erro_2);
            anim.play('animacao');
            this.createDelayTime(1000, function() {
                this.groupIntro.replace(this.tatu_erro_2, this.tatu_keep_alive_2);
            });
        });*/

        this.createDelayTime(11000, function() {
            this.add.tween(this.arrow).to({alpha:1},500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            });
        });

        //ANIMATION - ARROW AND CLICK
        this.createDelayTime(11800, function() { 
           this.add.tween(this.arrow).to({x:244,y:496}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {  
                var click = this.add.sprite(207, 456, "clickAnimation");
                click.animations.add('clickAnim', null, 18, true);
                click.animations.play('clickAnim'); 
                 //ANIMATIONs - TATU
                this.tatu_keep_alive_1.tint = 0xB5A789;
                this.add.tween(this.tatu_keep_alive_1).to({x:244, y:482}, 500, Phaser.Easing.Linear.None, true);
                //STOP ANIMATION CLICK
                this.createDelayTime(1000, function() {
                    click.animations.stop();
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
        var imagem = [];
        var t1 = "As  formas  geométricas  [planas]  nós  conseguimos  ver \n  apenas  de  uma  forma,  as formas [espaciais] podem ser \nvistas de cima de baixo, de traz e de frente, pois são \nespaciais, ou seja, [3D]!";
        var tutorialText = this.drawText(this.world.centerX, 17, t1, 18, "center");
            tutorialText.alpha = 0;                        

        imagem[0] = this.add.sprite(353, 136, 'img_resumo_1');
        imagem[1] = this.add.sprite(576, 136, 'img_resumo_2');
        imagem[0].scale.set(0.8, 0.8);
        imagem[1].scale.set(0.8, 0.8);
        imagem[0].alpha = 0;
        imagem[1].alpha = 0;
       
        this.groupIntro.add(imagem[0]);
        this.groupIntro.add(imagem[1]);
        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.add.tween(imagem[0]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.add.tween(imagem[0].scale).to({x:0.9, y:0.9}, 500, Phaser.Easing.Linear.None, true);
        }, this);

        this.add.tween(imagem[1]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.add.tween(imagem[1].scale).to({x:0.9, y:0.9}, 500, Phaser.Easing.Linear.None, true);
        }, this);

        this.soundResumo = this.setDebugAudio("soundResumo");

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(imagem[0]).to({alpha:0}, 700, Phaser.Easing.Linear.None, true);
            this.add.tween(imagem[1]).to({alpha:0}, 700, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
        }, this);
    },

    /*
        Verifica se precisa resetar os erros do jogo conforme o nível atual
        A cada novo nível, os erros do nível anterior devem ser desconsideradas                
    */
    resetError:function() {
        var level = this.verifyCurrentLevel();
        if(level == 4 && this.previousLevel != 4) {
            this.lives = 3;
        } else if(level == 7 && this.previousLevel != 7) {
            this.lives = 3;
        }
        this.updateLivesText();
    },

    /**
    * Controla qual será o proximo level que o jogador irá jogar.
    * Caso o jogo possua mais de 3 perguntas, deve-se adicionar mais itens no 'switch' com contagem corrida de level de 1 a X
    * e fazer a configuração dos detalhes do nível no topo do jogo
    **/
    showNextLevel: function() {
        console.log("***showNextLevel***");
        var levelNum = this.verifyCurrentLevel();

        //verifica se troco de nível pra zerar os erros
        this.resetError();

        console.log("init level", levelNum, this.currentLevel);
        console.log("showCallToAction " + this.showCallToAction);

        switch(levelNum) {
            case 1:
                this.showQuestion(1);
                this.initLevel1(this.alternativas);
            break;
            case 2:
                this.showQuestion(2);
                this.initLevel2(this.alternativas);
            break;
            case 3:
                this.showQuestion(3);
                this.initLevel3(this.alternativas);
            break;
             case 4:
                this.showQuestion(4);
                this.resetaArray();
                this.initLevel4(this.alternativas);
            break;
            case 5:
                this.showQuestion(5);
                this.initLevel5(this.alternativas);
            break;
            case 6:
                this.showQuestion(6);
                this.initLevel6(this.alternativas);
            break;
             case 7:
                this.showQuestion(7);
                this.resetaArray();
                this.initLevel7(this.alternativas);
            break;
             case 8:
                this.showQuestion(8);
                this.initLevel8(this.alternativas);
            break;
             case 9:
                this.showQuestion(9);
                this.initLevel9(this.alternativas);
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
            "",
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
           
    initLevel1: function(arrayAlternativas) {

        console.log("***initLevel1 - 1******************************");
        this.level(arrayAlternativas, 1);
        console.log("ERROS - GLOBAL: " + this.currentLocalErrors);
        //CRIA BOTÕES DE RESPOSTA
        this.buttonsAnswer = [];
        this.defineImageAnswer(this.arrayAnswers, 0);
        this.createButtonAnswer(0, 460, 850, 'tatu_keep_alive', this.arrayAnswers[0], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 1);
        this.createButtonAnswer(1, 695, 850, 'tatu_keep_alive', this.arrayAnswers[1], this.nameformaGeo, this.x_elemChild, this.y_elemChild);

        this.adicionaBuraco();

        this.createDelayTime(500, function() {
            this.animTatuKeepAlive(this.buttonsAnswer[0], 460, 401, 460, 421);
            this.createDelayTime(500, function() {
                this.animTatuKeepAlive(this.buttonsAnswer[1], 695, 386, 695, 403);
            }, this);
            this.createDelayTime(1950, function() {
                this.createTimer();
                this.enableEventMouse();
            });
        }, this);

        //limpa array de respostas
        this.arrayAnswers = [];     
    },

    initLevel2: function(arrayAlternativas) {
       
        console.log("***initLevel1 - 2******************************");
        this.level(arrayAlternativas, 1);
        
        //CRIA BOTÕES DE RESPOSTA
        this.buttonsAnswer = [];
        this.defineImageAnswer(this.arrayAnswers, 0);
        this.createButtonAnswer(0, 460, 850, 'tatu_keep_alive', this.arrayAnswers[0], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 1);
        this.createButtonAnswer(1, 695, 850, 'tatu_keep_alive', this.arrayAnswers[1], this.nameformaGeo, this.x_elemChild, this.y_elemChild);

        this.adicionaBuraco();

        this.createDelayTime(500, function() {
            this.animTatuKeepAlive(this.buttonsAnswer[0], 460, 401, 460, 421);
            this.createDelayTime(500, function() {
                this.animTatuKeepAlive(this.buttonsAnswer[1], 695, 386, 695, 403);
            }, this);
            this.createDelayTime(1950, function() {
                this.createTimer();
                this.enableEventMouse();
            });
        }, this);

        //limpa array de respostas
        this.arrayAnswers = [];
    },

    initLevel3: function(arrayAlternativas) {
        
        console.log("***initLevel1 - 3******************************");
        this.level(arrayAlternativas, 1);
        
        //CRIA BOTÕES DE RESPOSTA
        this.buttonsAnswer = [];
        this.defineImageAnswer(this.arrayAnswers, 0);
        this.createButtonAnswer(0, 460, 850, 'tatu_keep_alive', this.arrayAnswers[0], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 1);
        this.createButtonAnswer(1, 695, 850, 'tatu_keep_alive', this.arrayAnswers[1], this.nameformaGeo, this.x_elemChild, this.y_elemChild);

        this.adicionaBuraco();
     
        this.createDelayTime(500, function() {
            this.animTatuKeepAlive(this.buttonsAnswer[0], 460, 401, 460, 421);
            this.createDelayTime(500, function() {
                this.animTatuKeepAlive(this.buttonsAnswer[1], 695, 386, 695, 403);
            }, this);
            this.createDelayTime(1950, function() {
                this.enableEventMouse();
                this.createTimer();
            });
        }, this);

        //limpa array de respostas
        this.arrayAnswers = [];
    },


    initLevel4: function(arrayAlternativas) {

        console.log("***initLevel2 - 1 ******************************");
        this.level(arrayAlternativas, 2);

        //CRIA BOTÕES DE RESPOSTA
        this.buttonsAnswer = [];
        this.defineImageAnswer(this.arrayAnswers, 0);
        this.createButtonAnswer(0, 244, 850, 'tatu_keep_alive', this.arrayAnswers[0], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 1);
        this.createButtonAnswer(1, 695, 850, 'tatu_keep_alive', this.arrayAnswers[1], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 2);
        this.createButtonAnswer(2, 460, 850, 'tatu_keep_alive', this.arrayAnswers[2], this.nameformaGeo, this.x_elemChild, this.y_elemChild);

        this.adicionaBuraco();
     

        this.createDelayTime(500, function() {
            this.animTatuKeepAlive(this.buttonsAnswer[0], 244, 476, 244, 496);
            this.createDelayTime(500, function() {
                this.animTatuKeepAlive(this.buttonsAnswer[1], 695, 386, 695, 403);
                this.createDelayTime(500, function() {
                    this.animTatuKeepAlive(this.buttonsAnswer[2], 460, 401, 460, 421);
                    this.createDelayTime(1600, function() {
                        this.enableEventMouse();
                        this.createTimer();
                    });
                });
            }, this);
        }, this);

        //limpa array de respostas
        this.arrayAnswers = [];
    },


    initLevel5: function(arrayAlternativas) {
    
        console.log("***initLevel2 - 2******************************");
        this.level(arrayAlternativas, 2);
        
       //CRIA BOTÕES DE RESPOSTA
        this.buttonsAnswer = [];
        this.defineImageAnswer(this.arrayAnswers, 0);
        this.createButtonAnswer(0, 244, 850, 'tatu_keep_alive', this.arrayAnswers[0], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 1);
        this.createButtonAnswer(1, 695, 850, 'tatu_keep_alive', this.arrayAnswers[1], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 2);
        this.createButtonAnswer(2, 460, 850, 'tatu_keep_alive', this.arrayAnswers[2], this.nameformaGeo, this.x_elemChild, this.y_elemChild);

        this.adicionaBuraco();
     
       this.createDelayTime(500, function() { 
            this.animTatuKeepAlive(this.buttonsAnswer[0], 244, 476, 244, 496);
            this.createDelayTime(500, function() {
                this.animTatuKeepAlive(this.buttonsAnswer[1], 695, 386, 695, 403);
                this.createDelayTime(500, function() {
                    this.animTatuKeepAlive(this.buttonsAnswer[2], 460, 401, 460, 421);
                    this.createDelayTime(1600, function() {
                        this.enableEventMouse();
                        this.createTimer();
                    });
                });
            }, this);
        }, this);

        //limpa array de respostas
        this.arrayAnswers = [];
    },

    initLevel6: function(arrayAlternativas) {

        console.log("***initLevel2 - 3******************************");
        this.level(arrayAlternativas, 2);
        
        //CRIA BOTÕES DE RESPOSTA
        this.buttonsAnswer = [];
        this.defineImageAnswer(this.arrayAnswers, 0);
        this.createButtonAnswer(0, 244, 850, 'tatu_keep_alive', this.arrayAnswers[0], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 1);
        this.createButtonAnswer(1, 695, 850, 'tatu_keep_alive', this.arrayAnswers[1], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 2);
        this.createButtonAnswer(2, 460, 850, 'tatu_keep_alive', this.arrayAnswers[2], this.nameformaGeo, this.x_elemChild, this.y_elemChild);

        this.adicionaBuraco();
    
        this.createDelayTime(500, function() { 
            this.animTatuKeepAlive(this.buttonsAnswer[0], 244, 476, 244, 496);
            this.createDelayTime(500, function() {
                this.animTatuKeepAlive(this.buttonsAnswer[1], 695, 386, 695, 403);
                this.createDelayTime(500, function() {
                    this.animTatuKeepAlive(this.buttonsAnswer[2], 460, 401, 460, 421);
                    this.createDelayTime(1600, function() {
                        this.enableEventMouse();
                        this.createTimer();
                    });
                });
            }, this);
        }, this);

        //limpa array de respostas
        this.arrayAnswers = [];
    },  

     initLevel7: function(arrayAlternativas) {

        console.log("***initLevel3 - 1******************************");
        this.level(arrayAlternativas, 3);
        
        //CRIA BOTÕES DE RESPOSTA
        this.buttonsAnswer = [];
        this.defineImageAnswer(this.arrayAnswers, 0);
        this.createButtonAnswer(0, 460, 850, 'tatu_keep_alive', this.arrayAnswers[0], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 1);
        this.createButtonAnswer(1, 695, 850, 'tatu_keep_alive', this.arrayAnswers[1], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 2);
        this.createButtonAnswer(2, 244, 850, 'tatu_keep_alive', this.arrayAnswers[2], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 3);
        this.createButtonAnswer(3, 858, 850, 'tatu_keep_alive', this.arrayAnswers[3], this.nameformaGeo, this.x_elemChild, this.y_elemChild);

        this.adicionaBuraco();

        this.createDelayTime(500, function() {
            this.animTatuKeepAlive(this.buttonsAnswer[0], 460, 401, 460, 421);
            this.createDelayTime(500, function() {
                this.animTatuKeepAlive(this.buttonsAnswer[1], 695, 386, 695, 403);
                this.createDelayTime(500, function() {
                    this.animTatuKeepAlive(this.buttonsAnswer[2], 244, 476, 244, 496);
                    this.createDelayTime(500, function() {
                        this.animTatuKeepAlive(this.buttonsAnswer[3], 858, 488, 858, 508);
                        this.createDelayTime(1900, function() {
                            this.enableEventMouse();
                            this.createTimer();
                        });
                    }, this);
                }, this);
            }, this);
        });

        //limpa array de respostas
        this.arrayAnswers = [];
    },

     initLevel8: function(arrayAlternativas) {
        
        console.log("***initLevel3 - 2******************************");
        this.level(arrayAlternativas, 3);
        
        //CRIA BOTÕES DE RESPOSTA
        this.buttonsAnswer = [];
        this.defineImageAnswer(this.arrayAnswers, 0);
        this.createButtonAnswer(0, 460, 850, 'tatu_keep_alive', this.arrayAnswers[0], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 1);
        this.createButtonAnswer(1, 695, 850, 'tatu_keep_alive', this.arrayAnswers[1], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 2);
        this.createButtonAnswer(2, 244, 850, 'tatu_keep_alive', this.arrayAnswers[2], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 3);
        this.createButtonAnswer(3, 858, 850, 'tatu_keep_alive', this.arrayAnswers[3], this.nameformaGeo, this.x_elemChild, this.y_elemChild);

        this.adicionaBuraco();
     
        this.createDelayTime(500, function() {
            this.animTatuKeepAlive(this.buttonsAnswer[0], 460, 401, 460, 421);
            this.createDelayTime(500, function() {
                this.animTatuKeepAlive(this.buttonsAnswer[1], 695, 386, 695, 403);
                this.createDelayTime(500, function() {
                    this.animTatuKeepAlive(this.buttonsAnswer[2], 244, 476, 244, 496);
                    this.createDelayTime(500, function() {
                        this.animTatuKeepAlive(this.buttonsAnswer[3], 858, 488, 858, 508);
                        this.createDelayTime(1900, function() {
                            this.enableEventMouse();
                            this.createTimer();
                        });
                    }, this);
                }, this);
            }, this);
        });

        //limpa array de respostas
        this.arrayAnswers = [];
    },

     initLevel9: function(arrayAlternativas) {
        
        console.log("***initLevel3 - 3******************************");
        this.level(arrayAlternativas, 3);
         //CRIA BOTÕES DE RESPOSTA
        this.buttonsAnswer = [];
        this.defineImageAnswer(this.arrayAnswers, 0);
        this.createButtonAnswer(0, 460, 850, 'tatu_keep_alive', this.arrayAnswers[0], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 1);
        this.createButtonAnswer(1, 695, 850, 'tatu_keep_alive', this.arrayAnswers[1], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 2);
        this.createButtonAnswer(2, 244, 850, 'tatu_keep_alive', this.arrayAnswers[2], this.nameformaGeo, this.x_elemChild, this.y_elemChild);
        this.defineImageAnswer(this.arrayAnswers, 3);
        this.createButtonAnswer(3, 858, 850, 'tatu_keep_alive', this.arrayAnswers[3], this.nameformaGeo, this.x_elemChild, this.y_elemChild);

        this.adicionaBuraco();
     
        this.createDelayTime(500, function() {
            this.animTatuKeepAlive(this.buttonsAnswer[0], 460, 401, 460, 421);
            this.createDelayTime(500, function() {
                this.animTatuKeepAlive(this.buttonsAnswer[1], 695, 386, 695, 403);
                this.createDelayTime(500, function() {
                    this.animTatuKeepAlive(this.buttonsAnswer[2], 244, 476, 244, 496);
                    this.createDelayTime(500, function() {
                        this.animTatuKeepAlive(this.buttonsAnswer[3], 858, 488, 858, 508);
                        this.createDelayTime(1900, function() {
                            this.enableEventMouse();
                            this.createTimer();
                        });
                    }, this);
                }, this);
            }, this);
        });

        //limpa array de respostas
        this.arrayAnswers = [];
    },

    level:function(arrayAlternativas, nivelJogo) {
        console.log("ERROS GLOBAL: " + this.currentLocalErrors);
        this.groupLevel[this.currentLevel] = this.add.group();

        this.nivel = nivelJogo;
        this.resetaArrayAux();
        console.log("NÍVEL ATUAL: " +this.nivel);

        this.groupLevel[this.currentLevel] = this.add.group();
        this.index_num_sorteado = this.randomIndexQuestion(arrayAlternativas);
        this.numberRandom = this.randomQuestion(arrayAlternativas, this.index_num_sorteado);
        
        console.log(this.explicacao);
        
        this.certo = this.numberRandom;

        //Retira número escolhido do array 
        this.organizaArrays(arrayAlternativas, this.index_num_sorteado, this.aux);

        //Cria o array de respostas de acordo com o nível atual
        this.arrayAnswers = this.createArrayAnswers(this.aux);
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
        this.previousLevel = this.verifyCurrentLevel();
        this.resetLevel(this.currentLevel);
        if(this.currentLocalErrors > 0) {
            this.currentLocalErrors--;
            return;
        }    
        this.errors--;
        
        switch(this.lives) {
            case 2:
                this.hideLevel(function() {
                    this.showNextLevel();
                }, this);
            break;
            case 1: // mostra dica 
                this.createDelayTime(300, function() {
                    this.hideLevel(function() {
                        this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
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

        //this.updateTimer();

    },

    changeNormal:function(elem) {
        console.log("************CHANGENORMAL*************");
        this.groupIntro.replace(this.tatu_erro_2, this.tatu_keep_alive_2);
    },
    
    updateCounter: function() {
        console.log("**************UPDATECOUNTER***************");
        this.counter++;
        this.textTimerShadow.text = this.textTimer.text = this.counter;
        //se chegou nos 5 minutos é pq o jogador não clicou em nenhuma opção - > considerar erro
        if(this.counter == 6) {
            this.removeTimer();
            this.disableEventMouse();
            this.createDelayTime(200, function() {
                //NÃO CLICO EM NADA, EQUIVALE A UM ERRO (2 PQ TEM 1 ERRO DE TOLERANCIA)
                this.lives--;
                this.sound.play("hitErro");
                this.clickWrongButton(); 
            });
        }
    },

    createTimer: function() {
        this.counter = 0;
        this.totalTimer = 5;
        this.gameTimer = this.game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
        this.textTimerShadow =  this.add.bitmapText(this.world.centerX-20,  530, "JandaManateeSolid", this.counter.toString(), 48);
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

    adicionaBuraco:function() {
        //this.mascara_buracos = this.addSpriteMeu('mascara', 593, 533,0);
        this.mascara_buracos = this.add.sprite(593, 533, 'mascara');
        this.mascara_buracos.anchor.set(0.5,0.5);
    },

    tatuKeepAlive:function(sprite, nameformaGeo, numFormaGeo, x, y) {
        sprite.anchor.set(0.5,0.5);
        sprite.animations.add('animacao', null, 18, true);
        sprite.animations.play('animacao');
        this.addImageInSprite(nameformaGeo, numFormaGeo, 1, sprite, x, y); 
    },
        
    animTatuKeepAlive:function(sprite, x_init, y_init, x_final, y_final) {
        this.add.tween(sprite).to({x:x_init, y:y_init}, 800, "Quart.easeOut", true).onComplete.add(function() {
            this.add.tween(sprite).to({x:x_final, y:y_final}, 800, "Quart.easeOut", true);
        }, this);  
    },
   

    //function pras formas planas e geometricas
    addImageInSprite:function(formaName, numberQuestion, scale, spriteFather, x, y) {
        console.log("******addImageInSprite*****");
        var image = this.add.sprite(-(spriteFather.width*0.5)+x, -(spriteFather.height-y), formaName + numberQuestion);
        image.scale.set(scale, scale);
        spriteFather.addChild(image);
    },

     //ANIM - function pras formas planas 
    addAnimInSprite:function(formaName, numberQuestion, scale, spriteFather, x, y) {
        console.log("******addImageInSprite*****");
        var x = -(spriteFather.width* x);
        var y = -(spriteFather.height- y);//arrumar tamanho
        var anim = this.add.sprite(x, y, formaName + numberQuestion);
        anim.scale.set(scale, scale);
        anim.animations.add('animacao', null, 18, true);
        anim.animations.play('animacao');
        spriteFather.addChild(anim);
    },

    createButtonAnswer:function(position_button, x_elem, y_elem, nameSprite, nameButton, nameformaGeo, x_elemChild, y_elemChild) {
        console.log("******createButtonAnswer***** :img_respostas_"+position_button+": " +nameButton);
        this.buttonsAnswer[position_button] = this.add.sprite(x_elem, y_elem, nameSprite, nameButton);
        this.buttonsAnswer[position_button].anchor.set(0.5,0.5);
        this.buttonsAnswer[position_button].alpha = 1;
        this.buttonsAnswer[position_button].name = nameButton;
        console.log("Nome botão " + position_button + ": " + this.buttonsAnswer[position_button].name);
        this.buttonsAnswer[position_button].animations.add('animacao', null, 18, true);
        this.buttonsAnswer[position_button].animations.play('animacao');
        this.addImageInSprite(nameformaGeo, nameButton, 1, this.buttonsAnswer[position_button], x_elemChild, y_elemChild); 
        this.addLevelGroup(this.buttonsAnswer[position_button]);
    }, 

    defineImageAnswer:function(arrayAnswer, position) {
        if(this.certo == arrayAnswer[position]) {
            switch(arrayAnswer[position]) {
                case 1:
                this.nameformaGeo = 'forma_geometrica_'; 
                this.x_elemChild = -3;
                this.y_elemChild =  -22;
                break;
                case 2:
                this.nameformaGeo = 'forma_geometrica_'; 
                this.x_elemChild = -10;
                this.y_elemChild =  10;
                break;
                case 3:
                this.nameformaGeo = 'forma_geometrica_'; 
                this.x_elemChild = -3; 
                this.y_elemChild =  10; 
                break;
                case 4:
                this.nameformaGeo = 'forma_geometrica_'; 
                this.x_elemChild = 13; 
                this.y_elemChild =  10; 
                break;
            }
        } else {
            switch(arrayAnswer[position]) {
                case 1:
                this.nameformaGeo = 'forma_plana_'; 
                this.x_elemChild = 13.5;
                this.y_elemChild =  0;
                break;
                case 2:
                this.nameformaGeo = 'forma_plana_'; 
                this.x_elemChild = 9; 
                this.y_elemChild = 10;
                break;
                case 3:
                this.nameformaGeo = 'forma_plana_';
                this.x_elemChild = -16; 
                this.y_elemChild =  10; 
                break;
                case 4:
                this.nameformaGeo = 'forma_plana_'; 
                this.x_elemChild = -1.5;
                this.y_elemChild =  5; 
                break;
            }
        }

        console.log("nameFormaGeo: " + this.nameformaGeo + " | "+ "x_elemChild: " + this.x_elemChild + "y_elemClild: " + this.y_elemChild);
    },

    randomIndexQuestion:function(arrayName){
        console.log("***randomIndexQuestion***");
        var sizeArray = arrayName.length;
        var randomIndex = Math.floor(Math.random() * ((sizeArray - 1) - 0 + 1)) + 0;
        return randomIndex;
    },

     randomQuestion: function(arrayName, index) {
        console.log("******randomQuestion*****");
        var numberRandom = arrayName[index];
        return numberRandom;
    },

    addTextInSprite:function(numberQuestion, tint, scale, x, y, spriteFather) {
        console.log("******addTextInSprite*****");
        var texto = numberQuestion.toString(); 
        var texto_opcao_certa =  this.add.bitmapText(0,0, "JandaManateeSolid", texto,100);
        texto_opcao_certa.tint = tint;
        texto_opcao_certa.scale.set(scale, scale);
        texto_opcao_certa.x = -(texto_opcao_certa.width*0.5)+x;
        texto_opcao_certa.y = -(texto_opcao_certa.height/2)+y;
        spriteFather.addChild(texto_opcao_certa);
    },

    createArrayAnswers:function(arrayAuxName) {
        console.log("***createArrayAnswers***");
       
        //desordena o array auxiliar antes de setar as alternativas
        for(var j, x, i = arrayAuxName.length; i; j = Math.floor(Math.random() * i), x = arrayAuxName[--i], arrayAuxName[i] = arrayAuxName[j], arrayAuxName[j] = x);
        console.log("Array auxiliar - desordenado: " + arrayAuxName);

        //cria array de opções de respostas de acordo com nível de dificuldade
        if(this.nivel == 1) {
            var arrayAnswers = [this.certo, arrayAuxName[0]];
        } if(this.nivel == 2) {
            var arrayAnswers = [this.certo,  arrayAuxName[0],  arrayAuxName[1]];
        } if(this.nivel == 3) {
            var arrayAnswers = [this.certo,  arrayAuxName[0],  arrayAuxName[1],  arrayAuxName[2]];
        }
        
        //desordena o array pras alternativas não aparecerem sempre na mesma ordem
        for(var j, x, i = arrayAnswers.length; i; j = Math.floor(Math.random() * i), x = arrayAnswers[--i], arrayAnswers[i] = arrayAnswers[j], arrayAnswers[j] = x);
        
        console.log("Array das opções de respostas: " + arrayAnswers);
        return arrayAnswers;
    },

    resetaArray:function() {
        this.alternativas = [];
        this.alternativas = [1, 2, 3, 4];
        console.log("reseta array: " + this.alternativas);
    },
    
    resetaArrayAux:function() {
        this.aux = [];
        this.aux = [1, 2, 3, 4];
        console.log("reseta aux: " + this.aux);
    },

    organizaArrays:function(arrayAlternativas, indexToRemove, arrayAux) {
        console.log("******organizaArrays*****");
        console.log("R. CERTA:  " + this.certo);
        
        // tira o número escolhido do array 
        arrayAlternativas.splice(indexToRemove, 1);
        console.log("Array alternativa: " +  arrayAlternativas);

        // tira a resposta certa do array auxiliar
        //if(this.nivel > 1) {
            for(var i = arrayAux.length - 1; i >= 0; i--) {
              if(arrayAux[i] === this.certo) {
                arrayAux.splice(i, 1);
              }
            // }
        console.log("nível > 1 - > logo. array aux sem resp. certa:" + arrayAux);
        }
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

        //ANIMATION - OPÇAO ESCOLHIDA
        if(elem.click){
            this.add.tween(elem.scale).to({x:1.2,y:1.2}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(elem.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true);
            },this);
        
            if(elem.name == this.certo) {
                this.disableEventMouse();
                this.checkGame(elem);
                //REMOVE TIMER DE 5 SEGUNDOS
                this.removeTimer();
            } else {
                this.lives--;
                this.sound.play("hitErro");  
                if(this.lives <= 1) {
                    //REMOVE TIMER DE 5 SEGUNDOS
                    this.removeTimer();
                    this.disableEventMouse();
                    this.resetaArray();
                    this.resetaArrayAux();
                    this.checkGame(elem);
                }
                this.updateLivesText();
            }
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
        if(elem.name==this.certo){
            console.log("CORRETA");
                this.sound.play("hitAcerto");
                this.createDelayTime(200, function() {
                    this.clickRightButton();
                });
        }else{
            console.log("ERRADA");
            this.createDelayTime(200, function() {
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



