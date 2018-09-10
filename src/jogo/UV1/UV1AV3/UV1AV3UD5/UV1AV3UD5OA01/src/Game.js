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

        this.TEMPO_INTRO = 31400;
        this.TEMPO_DICA = 4000;
        this.TEMPO_RESUMO = 28000;
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

        //VARIAVEIS DO JOGO
        this.groupLevel = [null,1,2,3];
        this.qtdeCerta = [null, [2, 3], [1 ,2], [2, 3]];
        this.qtdeFrutas = [null, [4, 6], [4, 8], [6, 9]]; //[352, 482, 616, 746, 514, 659]
        this.qtdeCestos = [null, 2, 4, 3];

        this.coordenadas_cesto_x = [[400.8, 689.8], [327.8,  508.8,  694.8, 882.8], [348.8,546.8, 749.8]];
        this.coordenadas_cesto_y = [[462.85, 462.85], [463.85, 431.85, 429.85, 465.85], [ 463.85, 436.85, 458.85]];
        
        this.coordenadas_answer_x = [[[352, 482, 616, 746], [352, 482, 616, 746, 464, 609]], [[387, 517, 651, 781],[369,  514,  659, 804, 369, 514, 659, 804]], [[352, 482, 616, 746, 514, 659],[287, 417, 547, 677, 807, 365, 495, 625,  755]]];
        this.coordenadas_answer_y = [[[280], [280, 140]], [[280],[270, 140]], [[280, 140] ,[250, 160]]];
        this.position_x = [];
        
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
        //Gente, tá muito seco aqui! Onde era pra ser um mega rio, só a terra rachada… mas nós sabemos que frutas também têm água, então vamos dividir todas as frutas em números iguais nos potes… é assim: [MC] se tenho 3 frutas e 3 potes, coloco uma em cada pote, daí a divisão fica igual… [/MC] sacaram?

        var t1 = "Gente, tá muito seco aqui! Onde era \npra ser um mega rio, só a terra \nrachada… mas nós sabemos que \nfrutas também têm água, então \nvamos [dividir] todas as frutas \nem números [iguais] nos potes…";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 22, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t2 = "É assim: se tenho [3 frutas] e [3 potes], coloco \numa em cada pote, daí a divisão fica igual… \nsacaram?";
        var tutorialText1 = this.drawText(this.world.centerX, 20, t2, 22, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);
        
        //ADICIONA KIM
        var kim = this.showKim(19400);

        //TEXTO 0 APARECE E INICIA O ÁUDIO DA INTRO 
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);

        //DESAPARECE TEXTO 0 E INICIA TEXTO 1
        this.createDelayTime(19600, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.tutorialPlacar).to({y: -140}, 200, Phaser.Easing.Linear.None, true);
                this.add.tween(tutorialText1).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true);
                //INICIA TUTORIAL
                this.createDelayTime(500, function() {
                    this.showLiveTutorial();
                });
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

        //**************************CENARIO***************************
        this.background = this.add.sprite(487.8, 272.85, 'background');
        this.background.anchor.set(0.5,0.5);

        // this.guri_1 = this.addSpriteMeu('guri_2_keep_alive',172, 326.85);
        this.guri_1 = this.add.sprite(172, 326.85, 'guri_2_keep_alive');
        this.guri_1.anchor.set(0.5,0.5);
        this.guri_1.animations.add('animacao', null, 18, true);
        this.guri_1.animations.play('animacao');

        // this.guri_2 = this.addSpriteMeu('guri_1_keep_alive',109.8, 365.85);
        this.guri_2 = this.add.sprite(109.8, 365.85, 'guri_1_keep_alive');
        this.guri_2.anchor.set(0.5,0.5);
        // this.guri_2.animations.add('animacao', null, 18, true);
        // this.guri_2.animations.play('animacao');

        /*// this.guri_1_happy = this.addSpriteMeu('guri_2_happy',178, 326.85);
        this.guri_1_happy = this.add.sprite(178, 326.85, 'guri_2_happy');
        this.guri_1_happy.anchor.set(0.5,0.5);
        this.guri_1_happy.animations.add('animacao', null, 18, true);
        this.guri_1_happy.animations.play('animacao');

        // this.guri_2_happy = this.addSpriteMeu('guri_1_happy',105.8, 364.85);
        this.guri_2_happy = this.add.sprite(104.8, 363.85, 'guri_1_happy');
        this.guri_2_happy.anchor.set(0.5,0.5);
        this.guri_2_happy.animations.add('animacao', null, 18, true);
        this.guri_2_happy.animations.play('animacao');*/

        // this.changeHappy(this.guri_1, "guri_2_happy","guri_2_keep_alive", 178, 326.85, 172, 326.85);
        // this.changeHappy(this.guri_2, "guri_1_happy","guri_1_keep_alive", 109.8, 365.85, 105.8, 364.85);
    },



    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");

        //CESTOS
        this.groupCestos = this.add.group();
        var coordenadasX = this.coordenadas_cesto_x[3 - 1];
        var coordenadasY = this.coordenadas_cesto_y[3 - 1];
        this.cesto = [];

        for (var i = 3 - 1; i >= 0; i--) {
            this.cesto[i] = this.add.sprite(1200, coordenadasY[i], 'cesto');
            this.cesto[i].anchor.set(0.5,0.5);
            this.cesto[i].name = i;
            this.groupCestos.add(this.cesto[i]);
        };

        this.groupIntro.add(this.groupCestos);
    
        this.animCestos(this.cesto[0], coordenadasX[0] - 20, coordenadasX[0]);
        this.animCestos(this.cesto[1], coordenadasX[1] - 20, coordenadasX[1]);
        this.animCestos(this.cesto[2], coordenadasX[2] - 20, coordenadasX[2]);
    
        //FRUTAS
        this.groupAnswers = this.add.group();
        // this.fruta1 = this.addSpriteMeu('fruta_1',747, 282);
        this.fruta1 = this.add.sprite(747, 282, "fruta_1");
        this.fruta1.anchor.set(0.5,0.5);
        this.fruta1.scale.set(0.1,0.1);
        this.fruta1.alpha = 0;
        this.groupAnswers.add(this.fruta1);

        // this.fruta2 = this.addSpriteMeu('fruta_3',544, 287);
        this.fruta2 = this.add.sprite(544, 287, "fruta_3");
        this.fruta2.anchor.set(0.5,0.5);
        this.fruta2.scale.set(0.1,0.1);
        this.fruta2.alpha = 0;
        this.groupAnswers.add(this.fruta2);

        // this.fruta3 = this.addSpriteMeu('fruta_5',347, 291);
        this.fruta3 = this.add.sprite(347, 291, "fruta_5");
        this.fruta3.anchor.set(0.5,0.5);
        this.fruta3.scale.set(0.1,0.1);
        this.fruta3.alpha = 0;
        this.groupAnswers.add(this.fruta3);

        this.addIntroGroup(this.groupAnswers);

        this.createDelayTime(800, function() {
            this.animButtonAnswer(this.fruta1);
            this.animButtonAnswer(this.fruta2);
            this.animButtonAnswer(this.fruta3);
        });
       
        //ARROW - TUTORIAL
        // this.arrow = this.addSpriteMeu( "arrow", 420, 228, 1);
        this.arrow = this.add.sprite(420, 228, "arrow");
        this.arrow.anchor.set(0.5,0.5);
        this.arrow.alpha = 1;
        this.groupIntro.add(this.arrow);

        this.createDelayTime(3500, function() {
            this.add.tween(this.arrow).to({alpha:1},500, Phaser.Easing.Linear.None, true);
            this.createDelayTime(200, function() {
                this.add.tween(this.arrow).to({x:350,y:301}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                    var click = this.add.sprite(313, 261, "clickAnimation");
                    click.animations.add('clickAnim', null, 18, true);
                    click.animations.play('clickAnim'); 
                    this.stopClickAnimation(click, 1000);
                    this.createDelayTime(950, function() {
                        this.add.tween(this.arrow).to({y: + 420}, 500, Phaser.Easing.Linear.None, true, 500);
                        this.add.tween(this.fruta3).to({y: + 420}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {    
                            this.add.tween(this.arrow).to({x:546,y:302}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
                                var click1 = this.add.sprite(509, 262, "clickAnimation");
                                click1.animations.add('clickAnim', null, 18, true);
                                click1.animations.play('clickAnim');
                                this.stopClickAnimation(click1, 1000);
                            }, this);
                            this.createDelayTime(1900, function() {
                                this.add.tween(this.arrow).to({y: + 400}, 500, Phaser.Easing.Linear.None, true, 500);
                                this.add.tween(this.fruta2).to({y: + 390}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
                                    this.add.tween(this.arrow).to({x:752,y:297}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
                                        var click2 = this.add.sprite(715, 257, "clickAnimation");
                                        click2.animations.add('clickAnim', null, 18, true);
                                        click2.animations.play('clickAnim'); 
                                        this.stopClickAnimation(click2, 1000);
                                    }, this);
                                   
                                    this.createDelayTime(1900, function() {
                                        this.add.tween(this.arrow).to({y: + 400}, 500, Phaser.Easing.Linear.None, true, 500);
                                        this.add.tween(this.fruta1).to({y: + 390}, 500, Phaser.Easing.Linear.None, true, 500)
                                    }, this);
                                }, this);
                            },this);
                        }, this);
                    });
                }, this);
            }, this);
        });
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

        
        this.groupCestos = this.add.group();
        this.groupFrutas = this.add.group();

        //FRUTAS
        var x_position = [345,405,465,525,585,645, 705];
        this.fruta = [];
        var position_anim_x = [334, 354, 487, 509, 643, 665];
        var position_anim_y = [161, 162, 157, 157, 163, 164];
       
        this.fruta[0] = this.add.sprite(x_position[0], 113, "fruta_1");
        // this.fruta[0] = this.addSpriteMeu("fruta_1", x_position[0], 113);
        this.fruta[0].anchor.set(0.5,0.5);
        this.fruta[0].scale.set(0.5,0.5);
        this.fruta[0].alpha = 0;
        this.groupFrutas.add(this.fruta[0]);

        this.fruta[1] = this.add.sprite(x_position[1], 113, "fruta_1");
        // this.fruta[1] = this.addSpriteMeu("fruta_1",x_position[1], 113);
        this.fruta[1].anchor.set(0.5,0.5);
        this.fruta[1].scale.set(0.5,0.5);
        this.fruta[1].alpha = 0;
        this.groupFrutas.add(this.fruta[1]);

        this.fruta[2] = this.add.sprite(x_position[2], 113, "fruta_1");
        // this.fruta[2] = this.addSpriteMeu("fruta_1",x_position[2], 113);
        this.fruta[2].anchor.set(0.5,0.5);
        this.fruta[2].scale.set(0.5,0.5);
        this.fruta[2].alpha = 0;
        this.groupFrutas.add(this.fruta[2]);

        this.fruta[3] = this.add.sprite(x_position[3], 113, "fruta_1");
        // this.fruta[3] = this.addSpriteMeu("fruta_1", x_position[3], 113);
        this.fruta[3].anchor.set(0.5,0.5);
        this.fruta[3].scale.set(0.5,0.5);
        this.fruta[3].alpha = 0;
        this.groupFrutas.add(this.fruta[3]);

        this.fruta[4] = this.add.sprite(x_position[4], 113, "fruta_1");
        // this.fruta[4] = this.addSpriteMeu("fruta_1", x_position[4], 113);
        this.fruta[4].anchor.set(0.5,0.5);
        this.fruta[4].scale.set(0.5,0.5);
        this.fruta[4].alpha = 0;
        this.groupFrutas.add(this.fruta[4]);

        this.fruta[5] = this.add.sprite(x_position[5], 113, "fruta_1");
        // this.fruta[5] = this.addSpriteMeu("fruta_1", x_position[5], 113);
        this.fruta[5].anchor.set(0.5,0.5);
        this.fruta[5].scale.set(0.5,0.5);
        this.fruta[5].alpha = 0;
        this.groupFrutas.add(this.fruta[5]);

        //CESTOS
        var x_cesto = [349, 501, 657];
        var y_cesto = [196, 189, 195];
        var cestos = [];
        cestos[0] = this.add.sprite(x_cesto[0], y_cesto[0], "cesto");
        cestos[0].anchor.set(0.5,0.5);
        cestos[0].scale.set(0.5,0.5);
        cestos[0].alpha = 0;
        this.groupCestos.add(cestos[0]);

        cestos[1] = this.add.sprite(x_cesto[1], y_cesto[1], "cesto");
        cestos[1].anchor.set(0.5,0.5);
        cestos[1].scale.set(0.5,0.5);
        cestos[1].alpha = 0;
        this.groupCestos.add(cestos[1]);

        cestos[2] = this.add.sprite(x_cesto[2], y_cesto[2], "cesto");
        cestos[2].anchor.set(0.5,0.5);
        cestos[2].scale.set(0.5,0.5);
        cestos[2].alpha = 0;
        this.groupCestos.add(cestos[2]);

        //TEXTOS
        var t1 = "Se temos que dividir uma quantidade de coisas \npor igual, é preciso prestar atenção! Primeiro,\n no [número de coisas] que temos pra dividir. \nSegundo, no número de [divisões] que vamos \nprecisar fazer.";
        var tutorialText = this.drawText(this.world.centerX, 40, t1, 22, "center");
            tutorialText.alpha = 0;                      

        var t2 = "Seis morangos em três potes… \nDá dois em cada pote! Entenderam?";
        var tutorialText1 = this.drawText(this.world.centerX, 20, t2, 19, "center");
            tutorialText1.alpha = 0; 

        this.groupIntro.add(tutorialText);
        this.groupIntro.add(tutorialText1);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.soundResumo = this.setDebugAudio("soundResumo");

        this.createDelayTime(19200, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                   this.add.tween(cestos[0]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
                   this.add.tween(cestos[1]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
                   this.add.tween(cestos[2]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
                  for (var i = 6 - 1; i >= 0; i--) {
                     this.add.tween(this.fruta[i]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
                  }

                  this.createDelayTime(3800, function() {
                    for (var i = 6 - 1; i >= 0; i--) {   
                     this.add.tween(this.fruta[i]).to({x:position_anim_x[i], y:position_anim_y[i]}, 500, Phaser.Easing.Linear.None, true);
                    } 
                  }, this);
                }, this);
            }, this);
        }, this);

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(this.groupCestos).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(this.groupFrutas).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText1).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
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

        //para o som estático em função do somCtA
        this.stopSoundEstatico();
        this.removeTimer();

        switch(levelNum) {
            case 1:
                this.showQuestion(1);
                this.initLevel(1, this.qtdeCestos[1]);
            break;
            case 2:
                this.showQuestion(2);
                this.initLevel(2, this.qtdeCestos[2]);
            break;
            case 3:
                this.showQuestion(3);
                this.initLevel(3, this.qtdeCestos[3]);
                this.stopSoundEstatico();
                this.removeTimer();
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
    
           
    initLevel: function(level, qtdeCestos) {

        console.log("***initLevel***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.num_erros = 0;
        this.position_x = [];
       
        this.qtde_frutas = [0,0,0,0,0,0,0,0,0];
        this.nivel = level;

        //TOCA SOUND CALL TO ACTION
        this.CallToAction();

        //ADICIONA OS CESTOS
        this.groupCestos = this.add.group();
        this.showCestos(level, qtdeCestos);

        //CRIA ARRAY DE ALTERNATIVAS DE RESPOSTAS
        var qtdeFrutasDoNivel = this.qtdeFrutas[level];
        var index_array = this.randomIndexQuestion(qtdeFrutasDoNivel);
        this.index_array_qtde_frutas = index_array;
        this.quantidade_frutas = qtdeFrutasDoNivel[this.index_array_qtde_frutas];
        console.log("array de opcoes de tamnho de resposta: " + qtdeFrutasDoNivel);
        console.log("index_array_qtde_frutas : " + this.index_array_qtde_frutas);
        console.log("Qtde definitiva de frutas: " + this.quantidade_frutas);
        
        this.arrayAnswers = this.createArrayAnswers(this.quantidade_frutas);

        //CRIA BOTÕES DE RESPOSTA
        this.groupAnswers = this.add.group();
        this.createDelayTime(2000, function(){
            this.createButtonAnswer(level,  this.arrayAnswers);
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
                        this.stopSoundEstatico();
                        this.removeTimer();
                        this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
                        this.createDelayTime(this.TEMPO_DICA, function() {
                            this.createTimer();
                        });
                    });
                }); 
            

            break;
            case 0: // toca som de resumo
                this.stopSoundEstatico();
                this.removeTimer();
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
    showCestos:function(level, qtdeCestos) {
        var coordenadasX = this.coordenadas_cesto_x[level - 1];
        var coordenadasY = this.coordenadas_cesto_y[level - 1];
        this.cesto = [];

        for (var i = qtdeCestos - 1; i >= 0; i--) {
            console.log("Cesto " + i);
            this.cesto[i] = this.add.sprite(1200, coordenadasY[i], 'cesto');
            this.cesto[i].anchor.set(0.5,0.5);
            this.cesto[i].name = i;
            this.groupCestos.add(this.cesto[i]);
        };

        this.groupLevel[this.currentLevel].add(this.groupCestos);
    
        if(level == 1) {
            this.animCestos(this.cesto[0], coordenadasX[0] - 20, coordenadasX[0]);
            this.createDelayTime(500, function() {
                this.animCestos(this.cesto[1], coordenadasX[1] - 20, coordenadasX[1]);
            });
        } else if(level == 2) {
            this.animCestos(this.cesto[0], coordenadasX[0] - 20, coordenadasX[0]);
            this.createDelayTime(500, function() {
                this.animCestos(this.cesto[1], coordenadasX[1] - 20, coordenadasX[1]);
                this.createDelayTime(500, function() {
                    this.animCestos(this.cesto[2], coordenadasX[2] - 20, coordenadasX[2]);
                    this.createDelayTime(500, function() {
                        this.animCestos(this.cesto[3], coordenadasX[3] - 20, coordenadasX[3]);
                    }, this);
                }, this);
            });
        } else if(level == 3) {
            this.animCestos(this.cesto[0], coordenadasX[0] - 20, coordenadasX[0]);
            this.createDelayTime(500, function() {
                this.animCestos(this.cesto[1], coordenadasX[1] - 20, coordenadasX[1]);
                this.createDelayTime(500, function() {
                    this.animCestos(this.cesto[2], coordenadasX[2] - 20, coordenadasX[2]);
                }, this);
            });
        }
    },

    animCestos:function(sprite,  xAvanco, xFinal) {
        this.add.tween(sprite).to({x:xAvanco}, 925, "Quart.easeOut", true).onComplete.add(function() {
            this.add.tween(sprite).to({x:xFinal}, 925, "Quart.easeOut", true);
        }, this);  
    },

    updateCounter: function() {
        this.counter++;
        // console.log("contador: " + this.counter);
        //se chegou nos 5 minutos é pq o jogador não clicou em nenhuma opção - > considerar erro
        if(this.counter == 12) {
            this.removeTimer();

            this.soundEstatico.play();
            this.soundEstatico.onStop.add(this.createTimer, this);
        }
    },

    createTimer: function() {
        this.counter = 1;
        this.totalTimer = 10;
        this.soundEstatico =  this.add.audio("soundEstatico");
        this.gameTimer = this.game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
        this.input.onDown.add(this.stopSoundEstatico, this);
    },

    removeTimer: function() {
        if(this.gameTimer) {
            this.game.time.events.remove(this.gameTimer);
            this.gameTimer = null;

        }
    },

    stopSoundEstatico: function() {
        this.soundEstatico =  this.add.audio("soundEstatico");
        this.soundEstatico.stop();
        this.counter = 1;
    },

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

    CallToAction:function() {
        console.log("***SoundCallToAction***");
        this.soundCallToAction = this.setDebugAudio("soundCallToAction");
        this.soundCallToAction.onStop.add(this.createTimer, this);
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
                this.buttonsAnswer[i].events.onInputOver.add(this.overButtonAnswer, this);
            }
        });
        
        this.arrayAnswers = [];
    }, 

    animButtonAnswer:function(sprite) {
        this.add.tween(sprite).to({alpha:1}, 700, "Quart.easeOut", true, 500);
        this.add.tween(sprite.scale).to({x:0.7, y:0.7}, 700, "Quart.easeOut", true, 500);  
    },

    ajustaY:function(level, coordenadasY, i) {
        var y;
        if(level == 1 && i > 3) {
            y = coordenadasY[1];
        }
        else if(level == 2 && i > 3) {
            y = coordenadasY[1];
        } else if(level == 3 && i > 3) {
            if(this.index_array_qtde_frutas == 1) {
               if((i + 1) == 4) {
                y = coordenadasY[0];
               } else {
                y = coordenadasY[1];
               }
            } else {
                y = coordenadasY[1];
            }
        } else {
            y = coordenadasY[0];
        }
        return y;
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

    checkGame:function(elem, level){
        console.log("***checkGame***");
          
        var arrasteAleatorio = true;

        if(level == 1) {
            var condicao1 = this.checkOverlap(elem, this.cesto[0]);
            var condicao2 = this.checkOverlap(elem, this.cesto[1]);
            this.position_x.push(this.cesto[0].x - 30);
            this.position_x.push(this.cesto[1].x - 30);
                if(condicao1 || condicao2) {
                    if(condicao1) {
                        this.frutaNoCesto(elem, 0);
                    } else {
                        this.frutaNoCesto(elem, 1);
                    }
                } else {
                    if(arrasteAleatorio) {
                        this.arrasteAleatorio(elem);
                    }
                }

        } else if(level == 2) {
            var condicao1 = this.checkOverlap(elem, this.cesto[0]);
            var condicao2 = this.checkOverlap(elem, this.cesto[1]);
            var condicao3 = this.checkOverlap(elem, this.cesto[2]);
            var condicao4 = this.checkOverlap(elem, this.cesto[3]);
            this.position_x.push(this.cesto[0].x - 30);
            this.position_x.push(this.cesto[1].x - 30);
            this.position_x.push(this.cesto[2].x - 30);
            this.position_x.push(this.cesto[3].x - 30);
                if((condicao1 || condicao2) || (condicao3 || condicao4)) {
                    if(condicao1) {
                        this.frutaNoCesto(elem, 0);
                    } else if(condicao2){
                        this.frutaNoCesto(elem, 1);
                    } else if(condicao3) {
                        this.frutaNoCesto(elem, 2);
                    } else if(condicao4) {
                        this.frutaNoCesto(elem, 3);
                    }
                } else {
                    if(arrasteAleatorio) {
                        this.arrasteAleatorio(elem);
                    }
                }
        } else { 
            var condicao1 = this.checkOverlap(elem, this.cesto[0]);
            var condicao2 = this.checkOverlap(elem, this.cesto[1]);
            var condicao3 = this.checkOverlap(elem, this.cesto[2]);
            this.position_x.push(this.cesto[0].x - 40);
            this.position_x.push(this.cesto[1].x - 40);
            this.position_x.push(this.cesto[2].x - 40);
                if((condicao1 || condicao2) || (condicao2 || condicao3)) {
                    if(condicao1) {
                        this.frutaNoCesto(elem, 0);
                    } else if(condicao2){
                        this.frutaNoCesto(elem, 1);
                    } else if(condicao3) {
                        this.frutaNoCesto(elem, 2);
                    } 
                } else {
                    if(arrasteAleatorio) {
                        this.arrasteAleatorio(elem);
                    }
                }
        }
    },

    resetLevel:function(nivel){
        console.log("***resetLevel***");
        this.add.tween(this.groupLevel[nivel]).to({alpha:0}, 400, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() { 
            if(this.groupLevel[nivel] != null) {
                this.groupLevel[nivel].removeAll(true);
            }
        }, this); 
    },

    enableDragAndDrop:function(elem){
        console.log("*************enableDragAndDrop**************");
        elem.inputEnabled = true;
        elem.input.enableDrag();
        elem.events.onDragStart.add(this.onDragStart, this);
        elem.events.onDragStop.add(this.onDragStop, this);
    },

    overButtonAnswer:function(elem) {
        console.log("*************overButtonAnswer**************");
        this.add.tween(elem.scale).to({x:0.8, y:0.8}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.add.tween(elem.scale).to({x:0.7, y:0.7}, 200, Phaser.Easing.Linear.None, true);
        }, this); 
    },

    onDragStart:function(elem, pointer) { //pointer = localização pointer.x and pointer.y
        console.log("*** ondragStart ***");
        this.positionInitial = [elem.x,elem.y];
        console.log(this.positionInitial);
        //this.result = "Dragging " + sprite.key;
    },

    checkOverlap:function(spriteA,spriteB) {
        console.log("*** checkOverlap ****");
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);
    },

    onDragStop:function(elem, pointer) {
        console.log("*** onDragStop ***");
        this.checkGame(elem, this.nivel);
    },

    frutaNoCesto:function(elem, indexCesto) {
        elem.bringToTop();
        //acrescenta 1 na qtde_frutas daquele cesto
        this.qtde_frutas[indexCesto] = this.qtde_frutas[indexCesto] + 1;
        console.log("qtde_frutas no cesto " + indexCesto + ": " + this.qtde_frutas[indexCesto]);
        //ver coordenada pra colocar as frutas dentro do cesto
        elem.x = this.position_x[indexCesto];
        elem.y = this.cesto[indexCesto].y - 60;
        this.position_x[indexCesto] = this.position_x[indexCesto] + 35;
        //se arrasto pra algum cesto, não tá arrastando aleatoriamente
        arrasteAleatorio = false;

        //VERIFICA SE JÁ ESTA TUDO CERTO
        if(this.nivel == 1) {
            this.verificaNumFrutasNosCestos(elem, indexCesto);
        } else if(this.nivel == 2) {
            this.verificaNumFrutasNosCestos(elem, indexCesto);
        } else if(this.nivel == 3) {
           this.verificaNumFrutasNosCestos(elem, indexCesto);
        }
    },

    verificaNumFrutasNosCestos:function(elem, indexCesto) {
        if(this.nivel == 1) {
            if(this.qtde_frutas[0] > this.qtdeCerta[this.nivel][this.index_array_qtde_frutas] || this.qtde_frutas[1] > this.qtdeCerta[this.nivel][this.index_array_qtde_frutas]) {
                this.arrasteAleatorio(elem);
                //descrecenta 1 na qtde_frutas daquele cesto
                this.qtde_frutas[indexCesto] = this.qtde_frutas[indexCesto] - 1;
                this.num_erros++;
                if(this.num_erros > 1) {
                    this.acaoErro();
                } else {
                    this.sound.play("hitErro");
                }  
           } else {
                this.sound.play("hitAcerto");
                
                if(this.qtde_frutas[0] == this.qtdeCerta[this.nivel][this.index_array_qtde_frutas]  && this.qtde_frutas[1] == this.qtdeCerta[this.nivel][this.index_array_qtde_frutas]) { 
                    this.disableDragDrop(elem);
                    this.acaoAcerto();
                } else {
                    this.disableDragDrop(elem);
                }
           }
       } else if(this.nivel == 2) {
         if(this.qtde_frutas[0] > this.qtdeCerta[this.nivel][this.index_array_qtde_frutas] || this.qtde_frutas[1] > this.qtdeCerta[this.nivel][this.index_array_qtde_frutas] || this.qtde_frutas[2] > this.qtdeCerta[this.nivel][this.index_array_qtde_frutas] || this.qtde_frutas[3] > this.qtdeCerta[this.nivel][this.index_array_qtde_frutas]) {
                this.arrasteAleatorio(elem);
                //descrecenta 1 na qtde_frutas daquele cesto
                this.qtde_frutas[indexCesto] = this.qtde_frutas[indexCesto] - 1;
                this.num_erros++;
                if(this.num_erros > 1) {
                    this.acaoErro();
                } else {
                    this.sound.play("hitErro");
                }  
           } else {
                this.sound.play("hitAcerto");
                if(this.qtde_frutas[0] == this.qtdeCerta[this.nivel][this.index_array_qtde_frutas] && this.qtde_frutas[1] == this.qtdeCerta[this.nivel][this.index_array_qtde_frutas] & this.qtde_frutas[2] == this.qtdeCerta[this.nivel][this.index_array_qtde_frutas] && this.qtde_frutas[3] == this.qtdeCerta[this.nivel][this.index_array_qtde_frutas]) { 
                    this.disableDragDrop(elem);
                    this.acaoAcerto();
                } else {
                    this.disableDragDrop(elem);
                }
           }
       } else {
           if(this.qtde_frutas[0] > this.qtdeCerta[this.nivel][this.index_array_qtde_frutas] || this.qtde_frutas[1] > this.qtdeCerta[this.nivel][this.index_array_qtde_frutas] || this.qtde_frutas[2] > this.qtdeCerta[this.nivel][this.index_array_qtde_frutas]) {
                this.arrasteAleatorio(elem);
                //descrecenta 1 na qtde_frutas daquele cesto
                this.qtde_frutas[indexCesto] = this.qtde_frutas[indexCesto] - 1;
                this.num_erros++;
                if(this.num_erros > 1) {
                    this.acaoErro();
                } else {
                    this.sound.play("hitErro");
                }  
           } else {
                this.sound.play("hitAcerto");
                
                if(this.qtde_frutas[0] == this.qtdeCerta[this.nivel][this.index_array_qtde_frutas] && this.qtde_frutas[1] == this.qtdeCerta[this.nivel][this.index_array_qtde_frutas] && this.qtde_frutas[2] == this.qtdeCerta[this.nivel][this.index_array_qtde_frutas]) { 
                    this.disableDragDrop(elem);
                    this.acaoAcerto();
                } else {
                    this.disableDragDrop(elem);
                }
           }
       }
    },

    arrasteAleatorio:function(elem) {
        console.log("arraste Aleatorio");
        elem.x =  this.positionInitial[0];
        elem.y =  this.positionInitial[1];
    },

    acaoAcerto:function() {
                console.log("CORRETA");
                this.sound.play("hitAcerto");
                this.disableAllDragDrop();
                this.changeHappy(this.guri_1, "guri_2_happy","guri_2_keep_alive", 178, 326.85, 172, 326.85);
                this.changeHappy(this.guri_2, "guri_1_happy","guri_1_keep_alive", 109.8, 365.85, 105.8, 364.85);
                this.createDelayTime(200, function() {
                    this.clickRightButton();
                });
    },

    acaoErro:function() {
                console.log("ERRADA");
                this.sound.play("hitErro");
                this.disableAllDragDrop();
                this.createDelayTime(500, function() {
                    this.clickWrongButton();
                });
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
    },
};
/*/*
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
    
    
};*/
