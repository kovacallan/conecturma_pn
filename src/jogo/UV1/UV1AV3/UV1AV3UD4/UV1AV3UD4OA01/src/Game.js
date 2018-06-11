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

        this.TEMPO_INTRO = 32500;
        this.ENABLE_CALL_TO_ACTION = true;
        this.ENABLE_PLACAR = true; // para desabilitar o placar 


        // quantidade de perguntas que tem em cada nivel
        // 2 acertos em cada rodada para passar para a próxima
        this.totalLevel1 = 2;
        this.totalLevel2 = 2;
        this.totalLevel3 = 2;

        // quantidade total de erros permitido em cada nivel
        // tolerar um erro em cada nível antes de chamarmos a dica / resuminho
        // ex: se valor está definido para 2 erros, usuario pode errar 2x e na terceira é considerado errado
        this.totalErro1 = 0;
        this.totalErro2 = 0;
        this.totalErro3 = 0;

        // tolerancia de erro 
        // dentro dos níveis 1, 3, 5 essa variavel é zerada
        // já que a tolerância é um por nível
        this.num_erros = 0;

        /*****************************************************************/
        this.keyboard_permission = false;
        this.right_keyboard_answear;
        this.input.keyboard.addCallbacks(this, null, null, this.keyPress);

        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];


        this.groupLevel = [null,1,2,3,4,5,6];
        this.centenas_level_1 = [100, 200, 300, 400, 500, 600, 700, 800, 900];
        this.centenas_level_2 = [100, 200, 300, 400, 500, 600, 700, 800, 900];
        this.centenas_level_3 = [100, 200, 300, 400, 500, 600, 700, 800, 900];
        this.centenas_level_4 = [100, 200, 300, 400, 500, 600, 700, 800, 900];
        this.centenas_level_5 = [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950];
        this.centenas_level_6 = [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950];
        
        this.arrayAux1 = this.centenas_level_1;
        this.arrayAux2 = this.centenas_level_2;
        this.arrayAux3 = this.centenas_level_3;
        this.arrayAux4 = this.centenas_level_4;
        this.arrayAux5 = this.centenas_level_5;
        this.arrayAux6 = this.centenas_level_6;

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

        var t1 = "Pessoal, dentro desse cavalinho há \numa [mensagem] com uma dica do que\naconteceu com o pessoal da\nCavalhada!";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t2 = "Pra que ele nos diga o que aconteceu, só \nprecisamos acertar o alvo, escolhendo\n o que tem o número que somado ao do\n cavalinho vai dar [1000]!";
        var tutorialText1 = this.drawText(this.world.centerX, 20, t2, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);
        
        var t3 = "Assim: Lá vem o cavalinho com o número \n[500]! Pra dar [1000] precisamos de... mais \n[500]! Eu escolho e pronto! É com vocês!";
        var tutorialText2 = this.drawText(this.world.centerX, 20, t3, 21, "left");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        //ADICIONA KIM
        var kim = this.showKim(8000);

        //TEXTO 0 APARECE E INICIA O ÁUDIO DA INTRO 
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);
        //DESAPARECE TEXTO 0 E INICIA TEXTO 1
        this.createDelayTime(8000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.tutorialPlacar).to({y: -120}, 200, Phaser.Easing.Linear.None, true);
                this.add.tween(tutorialText1).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true);
            }, this);   
        });

        //DESAPARECE TEXTO 1 E INICIA TEXTO 2
        this.createDelayTime(20050, function() {
            this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(tutorialText2).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);;
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
        //this.background = this.addSpriteMeu('background',100,-100,0);
        this.background = this.add.sprite(-54,-116, 'background');
        
        this.anim_cavalo = this.add.sprite(1000, 600, 'anim_cavalo', 0);
        this.anim_cavalo.animations.add('animacao', null, 18, true);
        this.anim_cavalo.animations.play('animacao');
        this.anim_cavalo.scale.set(1, 1);
        this.anim_cavalo.anchor.set(1,1);

        //this.arrow = this.addSpriteMeu('arrow',257,277,0);
        //this.background.scale.set(0.5,0.5);
        //this.initLevel1();
        //this.showResumo();
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");

        //CAVALO GRANDE - TUTORIAL
        this.createDelayTime(1000, function() {
            this.soundCavalinho = this.setDebugAudio("soundCavalinho");
            this.showImageQuestion(500); 
                this.createDelayTime(2000, function() {
                    this.soundCavalinho.stop();
                });
            this.groupIntro.add(this.cavalo);   
        });
       
        //CAVALINHO 1 - TUTORIAL
        var opcao_1 = this.add.sprite(282, 700, 'cavalo', 0);
        opcao_1.anchor.set(0.5,0.5);
        opcao_1.scale.set(0.9,0.9);
        opcao_1.alpha = 0;
        opcao_1.name = "õpção - 100"; 
        this.groupIntro.add(opcao_1);
        this.addTextInSprite(100, 0x4A2B0E, 0.3, 19, 3, opcao_1);

        //CAVALINHO 2 - TUTORIAL
        var opcao_2 = this.add.sprite(487, 700, 'cavalo', 0);
        opcao_2.anchor.set(0.5,0.5);
        opcao_2.scale.set(0.9,0.9);
        opcao_2.alpha = 0;
        opcao_2.name = "opção - 700";
        this.groupIntro.add(opcao_2);
        this.addTextInSprite(700, 0x4A2B0E, 0.3, 19, 3, opcao_2);

        //CAVALINHO 3 - TUTORIAL
        var opcao_3 = this.add.sprite(692, 700, 'cavalo', 0);
        opcao_3.anchor.set(0.5,0.5);
        opcao_3.scale.set(0.9,0.9);
        opcao_3.alpha = 0;
        opcao_3.name = "opção - 500";
        this.groupIntro.add(opcao_3);
        this.addTextInSprite(500, 0x4A2B0E, 0.3, 19, 3, opcao_3);

        //ANIMATION - CAVALINHOS
        this.createDelayTime(2000, function(){
            this.add.tween(opcao_1).to({alpha:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                this.add.tween(opcao_1).to({x:282, y:510}, 500, "Quart.easeOut", true).onComplete.add(function(){
                    this.add.tween(opcao_1).to({x:282, y:550}, 500, "Quart.easeOut", true);
                }, this);
            }, this);

            this.createDelayTime(600, function() {
                this.add.tween(opcao_2).to({alpha:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                    this.add.tween(opcao_2).to({x:487, y:510}, 500, "Quart.easeOut", true).onComplete.add(function(){
                    this.add.tween(opcao_2).to({x:487, y:550}, 500, "Quart.easeOut", true);
                }, this);
            }, this);
            });
        
            this.createDelayTime(1200, function() {
                this.add.tween(opcao_3).to({alpha:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                    this.add.tween(opcao_3).to({x:692, y:510}, 500, "Quart.easeOut", true).onComplete.add(function(){
                    this.add.tween(opcao_3).to({x:692, y:550}, 500, "Quart.easeOut", true);
                }, this);
            }, this);
            });
        });

        //ARROW - TUTORIAL
        this.arrow = this.add.sprite(292,260, 'arrow');
        this.arrow.anchor.set(0.5,0.5);
        this.arrow.alpha = 0;
        this.groupIntro.add(this.arrow);
        
        this.createDelayTime(4000, function() {
            this.add.tween(this.arrow).to({alpha:1},500, Phaser.Easing.Linear.None, true);
            console.log("aparece arrow");
        });

        //ANIMATION - ARROW AND CLICK
        this.createDelayTime(9170, function() {
           this.add.tween(this.arrow).to({x:729,y:579}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {  
                var click = this.add.sprite(692, 545, "clickAnimation");
                click.animations.add('clickAnim', null, 18, true);
                click.animations.play('clickAnim'); 
                 //ANIMATION - MUDA COR CAVALINHO
                opcao_3.tint = 0xB79423;
                //ANIMATION - AUMENTA SCALE CAVALINHO
                this.add.tween(opcao_3.scale).to({x:1.1, y:1.1},500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                    this.add.tween(opcao_3.scale).to({x:0.9, y:0.9}, 500,  Phaser.Easing.Linear.None, true);
                }, this);
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
        var t1 = "Contar é muito fácil! Depois que aprendemos a \ncontar até [100] então... é [200], [300], [400], [500]...";
        var tutorialText = this.drawText(this.world.centerX, 70, t1, 22, "center");
            tutorialText.alpha = 0;                        

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        var imagem = [];

        imagem[0] = this.add.sprite(this.world.centerX, 110, 'img_resumo_1');
        imagem[0].anchor.set(0.5,0.5);

        imagem[1] = this.add.sprite(this.world.centerX, 110, 'img_resumo_2');
        imagem[1].anchor.set(0.5,0.5);

        
        imagem[0].alpha = 0;
        imagem[1].alpha = 0;
       
        this.groupIntro.add(imagem[0]);
        this.groupIntro.add(imagem[1]);
        
        this.createDelayTime(10200, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                this.add.tween(imagem[0]).to({alpha:1}, 600, Phaser.Easing.Linear.None, true);
            }, this);
        });

        this.createDelayTime(24000, function() {
            this.add.tween(imagem[0]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                this.add.tween(imagem[1]).to({alpha:1}, 600, Phaser.Easing.Linear.None, true);    
            }, this);
        });

        this.soundResumo = this.setDebugAudio("soundResumo");

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(imagem[1]).to({alpha:0}, 700, Phaser.Easing.Linear.None, true);
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
                this.initLevel1();
            break;
            case 2:
                this.CallToAction();
                this.showQuestion(2);
                this.initLevel2();
            break;
            case 3:
                this.CallToAction();
                this.showQuestion(3);
                this.initLevel3();
            break;
             case 4:
                this.CallToAction();
                this.showQuestion(4);
                this.initLevel4();
            break;
            case 5:
                this.CallToAction();
                this.showQuestion(5);
                this.initLevel5();
            break;
            case 6:
                this.CallToAction();
                this.showQuestion(6);
                this.initLevel6();
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

        this.num_erros = 0;

        console.log("***initLevel1***");
        this.groupLevel[this.currentLevel] = this.add.group();

        this.randomQuestion(this.centenas_level_1);
        console.log("Número que o cavalo trouxe: " + this.numberRandom);

        //calcula o número da resposta certa
        this.certo = 1000 - this.numberRandom;
        console.log(this.numberRandom + " <- [Nº sorteado] + " + this.certo + " <- [opção correta] = 1000");
    
        //Retira número escolhido do array das centenas e retira resposta certa do array auxiliar
        this.organizaArrays(this.centenas_level_1, this.arrayAux1);

        this.createArrayAnswers(this.arrayAux1, 2);

        this.showImageQuestion(this.numberRandom);
        this.addLevelGroup(this.cavalo); 

        this.createDelayTime(2000, function(){
             
        console.log("***showImagesAnswer***");
        this.buttonsAnswer = [];
        this.buttonsAnswer[0] = this.add.sprite(365, 700, 'cavalo', 0);
        this.buttonsAnswer[0].anchor.set(0.5,0.5);
        this.buttonsAnswer[0].scale.set(0.9,0.9);
        this.buttonsAnswer[0].alpha = 0;
        this.buttonsAnswer[0].name = this.arrayAnswers[0]; //1º POSIÇÃO NO ARRAY DAS RESPOSTAS
        this.addLevelGroup(this.buttonsAnswer[0]);
        this.addTextInSprite(this.arrayAnswers[0], 0x4A2B0E, 0.3, 19, 3, this.buttonsAnswer[0]);

        this.buttonsAnswer[1] = this.add.sprite(610, 700, 'cavalo', 0);
        this.buttonsAnswer[1].anchor.set(0.5,0.5);
        this.buttonsAnswer[1].scale.set(0.9,0.9);
        this.buttonsAnswer[1].alpha = 0;
        this.buttonsAnswer[1].name = this.arrayAnswers[1]; //2º POSICAO ARRAY DAS RESPOSTAS
        this.addLevelGroup(this.buttonsAnswer[1]);
        this.addTextInSprite(this.arrayAnswers[1], 0x4A2B0E, 0.3, 19, 3, this.buttonsAnswer[1]);

        this.add.tween(this.buttonsAnswer[0]).to({alpha:1}, 400, "Quart.easeOut", true).onComplete.add(function() {
            this.add.tween(this.buttonsAnswer[0]).to({x:365, y:510}, 400, "Quart.easeOut", true).onComplete.add(function(){
                this.add.tween(this.buttonsAnswer[0]).to({x:365, y:550}, 400, "Quart.easeOut", true);
            }, this);
        }, this);

        this.createDelayTime(600, function() {
            this.add.tween(this.buttonsAnswer[1]).to({alpha:1}, 400, "Quart.easeOut", true).onComplete.add(function() {
                this.add.tween(this.buttonsAnswer[1]).to({x:610, y:510}, 400, "Quart.easeOut", true).onComplete.add(function(){
                this.add.tween(this.buttonsAnswer[1]).to({x:610, y:550}, 400, "Quart.easeOut", true).onComplete.add(function() {
                    // libera click;
                    this.enableEventMouse();
                }, this);
            }, this);
        }, this);
        }, this);

        //limpa array de respostas
        this.arrayAnswers = [];
        });
    },

    initLevel2: function() {
       
        console.log("***initLevel2***");
        this.groupLevel[this.currentLevel] = this.add.group();

        this.randomQuestion(this.centenas_level_2);
        console.log("Número que o cavalo trouxe: " + this.numberRandom);

        //calcula o número da resposta certa
        this.certo = 1000 - this.numberRandom;
        console.log(this.numberRandom + " <- [Nº sorteado] + " + this.certo + " <- [opção correta] = 1000");
    
        //Retira número escolhido do array das centenas e retira resposta certa do array auxiliar
        this.organizaArrays(this.centenas_level_2, this.arrayAux2);

        this.createArrayAnswers(this.arrayAux2, 2);

        this.showImageQuestion(this.numberRandom);
        this.addLevelGroup(this.cavalo); 

        this.createDelayTime(2000, function(){
           
        console.log("***showImagesAnswer***");
        this.buttonsAnswer = [];
        this.buttonsAnswer[0] = this.add.sprite(365, 700, 'cavalo', 0);
        this.buttonsAnswer[0].anchor.set(0.5,0.5);
        this.buttonsAnswer[0].scale.set(0.9,0.9);
        this.buttonsAnswer[0].alpha = 0;
        this.buttonsAnswer[0].name = this.arrayAnswers[0]; //1º POSIÇÃO NO ARRAY DAS RESPOSTAS
        this.addLevelGroup(this.buttonsAnswer[0]);
        this.addTextInSprite(this.arrayAnswers[0], 0x4A2B0E, 0.3, 19, 3, this.buttonsAnswer[0]);

        this.buttonsAnswer[1] = this.add.sprite(610, 700, 'cavalo', 0);
        this.buttonsAnswer[1].anchor.set(0.5,0.5);
        this.buttonsAnswer[1].scale.set(0.9,0.9);
        this.buttonsAnswer[1].alpha = 0;
        this.buttonsAnswer[1].name = this.arrayAnswers[1]; //2º POSICAO ARRAY DAS RESPOSTAS
        this.addLevelGroup(this.buttonsAnswer[1]);
        this.addTextInSprite(this.arrayAnswers[1], 0x4A2B0E, 0.3, 19, 3, this.buttonsAnswer[1]);

        this.add.tween(this.buttonsAnswer[0]).to({alpha:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.add.tween(this.buttonsAnswer[0]).to({x:365, y:510}, 500, "Quart.easeOut", true).onComplete.add(function(){
                this.add.tween(this.buttonsAnswer[0]).to({x:365, y:550}, 500, "Quart.easeOut", true);
            }, this);
        }, this);

        this.createDelayTime(600, function() {
            this.add.tween(this.buttonsAnswer[1]).to({alpha:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                this.add.tween(this.buttonsAnswer[1]).to({x:610, y:510}, 500, "Quart.easeOut", true).onComplete.add(function(){
                this.add.tween(this.buttonsAnswer[1]).to({x:610, y:550}, 500, "Quart.easeOut", true).onComplete.add(function() {
                    // libera click;
                    this.enableEventMouse();
                }, this);
            }, this);
        }, this);
        }, this);

        //limpa array de respostas
        this.arrayAnswers = [];
        });
    },

    initLevel3: function() {
        
        this.num_erros = 0;

        console.log("***initLevel3***");
        this.groupLevel[this.currentLevel] = this.add.group();

        this.randomQuestion(this.centenas_level_3);
        console.log("Número que o cavalo trouxe: " + this.numberRandom);

        //calcula o número da resposta certa
        this.certo = 1000 - this.numberRandom;
        console.log(this.numberRandom + " <- [Nº sorteado] + " + this.certo + " <- [opção correta] = 1000");
    
        //Retira número escolhido do array das centenas e retira resposta certa do array auxiliar
        this.organizaArrays(this.centenas_level_3, this.arrayAux3);

        this.createArrayAnswers(this.arrayAux3, 3);

        this.showImageQuestion(this.numberRandom);
        this.addLevelGroup(this.cavalo); 

        this.createDelayTime(2000, function(){
            this.showImagesAnswer();
        });
    },


    initLevel4: function() {
        
        console.log("***initLevel4***");
        this.groupLevel[this.currentLevel] = this.add.group();

        this.randomQuestion(this.centenas_level_4);
        console.log("Número que o cavalo trouxe: " + this.numberRandom);

        //calcula o número da resposta certa
        this.certo = 1000 - this.numberRandom;
        console.log(this.numberRandom + " <- [Nº sorteado] + " + this.certo + " <- [opção correta] = 1000");
    
        //Retira número escolhido do array das centenas e retira resposta certa do array auxiliar
        this.organizaArrays(this.centenas_level_4, this.arrayAux4);

        this.createArrayAnswers(this.arrayAux4, 3);

        this.showImageQuestion(this.numberRandom);
        this.addLevelGroup(this.cavalo); 

        this.createDelayTime(2000, function(){
            this.showImagesAnswer();
        });
    },


    initLevel5: function() {
        
        this.num_erros = 0;

        console.log("***initLevel5***");
        this.groupLevel[this.currentLevel] = this.add.group();

        this.randomQuestion(this.centenas_level_5);
        console.log("Número que o cavalo trouxe: " + this.numberRandom);

        //calcula o número da resposta certa
        this.certo = 1000 - this.numberRandom;
        console.log(this.numberRandom + " <- [Nº sorteado] + " + this.certo + " <- [opção correta] = 1000");
    
        //Retira número escolhido do array das centenas e retira resposta certa do array auxiliar
        this.organizaArrays(this.centenas_level_5, this.arrayAux5);

        this.createArrayAnswers(this.arrayAux5, 3);

        this.showImageQuestion(this.numberRandom);
        this.addLevelGroup(this.cavalo); 

        this.createDelayTime(2000, function(){
            this.showImagesAnswer();
        });
    },

    initLevel6: function() {
        
        console.log("***initLevel6***");
        this.groupLevel[this.currentLevel] = this.add.group();

        this.randomQuestion(this.centenas_level_6);
        console.log("Número que o cavalo trouxe: " + this.numberRandom);

        //calcula o número da resposta certa
        this.certo = 1000 - this.numberRandom;
        console.log(this.numberRandom + " <- [Nº sorteado] + " + this.certo + " <- [opção correta] = 1000");
    
        //Retira número escolhido do array das centenas e retira resposta certa do array auxiliar
        this.organizaArrays(this.centenas_level_6, this.arrayAux6);

        this.createArrayAnswers(this.arrayAux6, 3);

        this.showImageQuestion(this.numberRandom);
        this.addLevelGroup(this.cavalo); 

        this.createDelayTime(2000, function(){
            this.showImagesAnswer();
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
        if(this.currentLocalErrors > 0) {
            
            this.currentLocalErrors--;

            //this.sound.play("hitErro");
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
    randomIndexQuestion:function(arrayName){
        console.log("***randomIndexQuestion***");
        var sizeArray = arrayName.length;
        var randomIndex = Math.floor(Math.random() * ((sizeArray - 1) - 0 + 1)) + 0;
        return randomIndex;
    },

     randomQuestion: function(arrayName) {
        console.log("******randomQuestion*****");
        this.index_num_sorteado = this.randomIndexQuestion(arrayName);
        this.numberRandom = arrayName[this.index_num_sorteado];
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

    showImageQuestion:function(imageText) {
        console.log("***createAnimationAndShowQuestion***");
        //ADD SPRITE - CAVALO
        this.cavalo = this.add.sprite(-200, 310, 'cavalo');
        this.cavalo.scale.set(1.2,1.2);
        this.cavalo.anchor.set(0.5,0.5);
        this.cavalo.alpha = 0;

        if(imageText != null) {
            this.addTextInSprite(imageText, 0x4A2B0E, 0.3, 20, 3, this.cavalo); 
        }
        
        //ANIMATION - CAVALO
        this.add.tween(this.cavalo).to({alpha:1}, 700, "Quart.easeOut", true).onComplete.add(function() {
            this.add.tween(this.cavalo).to({x:700, y:310}, 800, "Quart.easeOut", true).onComplete.add(function() {
                 this.add.tween(this.cavalo).to({x:487, y:310}, 800, "Quart.easeOut", true);
            }, this);  
        }, this); 
    },

    CallToAction:function() {
        console.log("***SoundCallToAction***");
        this.soundCallToAction = this.setDebugAudio("soundCallToAction");
    },

    createArrayAnswers:function(arrayAuxName, quantAnswers) {
        console.log("***createArrayAnswers***");
        //cria array de opções de respostas
        this.arrayAnswers = [this.certo];
        console.log("Array das opções de respostas: " +this.arrayAnswers);

        var indexs = [];
        var answers = [];
        for(var x = 0; x < quantAnswers; x++) {
            indexs[x] =  this.randomIndexQuestion(arrayAuxName);
            answers[x] = arrayAuxName[indexs[x]];
            this.arrayAnswers.push(answers[x]);
            arrayAuxName.splice(indexs[x], 1);
        }

        console.log("Array das opções de respostas: " +this.arrayAnswers);
        
    },

    organizaArrays:function(arrayCentenas, arrayAux) {
        console.log("******organizaArrays*****");
        console.log("Array Auxiliar: " +  this.arrayAux1);
        // tira o número escolhido do array de centenas 
        arrayCentenas.splice(this.index_num_sorteado, 1);
        console.log("Array Centena: " +  arrayCentenas);

        // tira a resposta certa do array auxiliar
        for(var i = arrayAux.length - 1; i >= 0; i--) {
          if(arrayAux[i] === this.certo) {
            arrayAux.splice(i, 1);
          }
        }

        console.log("Array das centenas: " + this.centenas_level_1);
        console.log("Array Auxiliar: " + this.arrayAux1);
    },

    showImagesAnswer:function() {
        console.log("***showImagesAnswer***");
        this.buttonsAnswer = [];
        this.buttonsAnswer[0] = this.add.sprite(282, 700, 'cavalo', 0);
        this.buttonsAnswer[0].anchor.set(0.5,0.5);
        this.buttonsAnswer[0].scale.set(0.9,0.9);
        this.buttonsAnswer[0].alpha = 0;
        this.buttonsAnswer[0].name = this.arrayAnswers[0]; //1º POSIÇÃO NO ARRAY DAS RESPOSTAS
        this.addLevelGroup(this.buttonsAnswer[0]);
        this.addTextInSprite(this.arrayAnswers[0], 0x4A2B0E, 0.3, 19, 3, this.buttonsAnswer[0]);

        this.buttonsAnswer[1] = this.add.sprite(487, 700, 'cavalo', 0);
        this.buttonsAnswer[1].anchor.set(0.5,0.5);
        this.buttonsAnswer[1].scale.set(0.9,0.9);
        this.buttonsAnswer[1].alpha = 0;
        this.buttonsAnswer[1].name = this.arrayAnswers[1]; //2º POSICAO ARRAY DAS RESPOSTAS
        this.addLevelGroup(this.buttonsAnswer[1]);
        this.addTextInSprite(this.arrayAnswers[1], 0x4A2B0E, 0.3, 19, 3, this.buttonsAnswer[1]);
        
        this.buttonsAnswer[2] = this.add.sprite(692, 700, 'cavalo', 0);
        this.buttonsAnswer[2].anchor.set(0.5,0.5);
        this.buttonsAnswer[2].scale.set(0.9,0.9);
        this.buttonsAnswer[2].alpha = 0;
        this.buttonsAnswer[2].name = this.arrayAnswers[2]; //3º POSICAO ARRAY DAS RESPOSTAS
        this.addLevelGroup(this.buttonsAnswer[2]);
        this.addTextInSprite(this.arrayAnswers[2], 0x4A2B0E, 0.3, 19, 3, this.buttonsAnswer[2]);

        this.add.tween(this.buttonsAnswer[0]).to({alpha:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.add.tween(this.buttonsAnswer[0]).to({x:282, y:510}, 500, "Quart.easeOut", true).onComplete.add(function(){
                this.add.tween(this.buttonsAnswer[0]).to({x:282, y:550}, 500, "Quart.easeOut", true);
            }, this);
        }, this);

        this.createDelayTime(600, function() {
            this.add.tween(this.buttonsAnswer[1]).to({alpha:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                this.add.tween(this.buttonsAnswer[1]).to({x:487, y:510}, 500, "Quart.easeOut", true).onComplete.add(function(){
                this.add.tween(this.buttonsAnswer[1]).to({x:487, y:550}, 500, "Quart.easeOut", true);
            }, this);
        }, this);
        });
    
        this.createDelayTime(1200, function() {
            this.add.tween(this.buttonsAnswer[2]).to({alpha:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                this.add.tween(this.buttonsAnswer[2]).to({x:692, y:510}, 500, "Quart.easeOut", true).onComplete.add(function(){
                this.add.tween(this.buttonsAnswer[2]).to({x:692, y:550}, 500, "Quart.easeOut", true).onComplete.add(function() {
                   // libera click;
                    this.enableEventMouse();
                }, this);
            }, this);
        }, this);
        }, this);

        //limpa array de respostas
        this.arrayAnswers = [];
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
                this.add.tween(elem.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.createDelayTime(500, function() {
                    });
                },this);
            },this);
    
            if(elem.name == this.certo) {
                this.disableEventMouse();
                this.checkGame(elem);
            } else {
                this.num_erros++;
                this.sound.play("hitErro");  
                if(this.num_erros >= 2) {
                    this.disableEventMouse();
                    this.checkGame(elem);
                }
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
            //this.num_erros++;
             if(this.num_erros > 1) {
                this.createDelayTime(200, function() {
                    this.clickWrongButton(); 
                });   
             }   
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

