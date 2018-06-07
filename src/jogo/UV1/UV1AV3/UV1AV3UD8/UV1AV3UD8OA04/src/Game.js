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

        this.TEMPO_INTRO = 32200;
        this.ENABLE_CALL_TO_ACTION = true;
        this.ENABLE_PLACAR = true; // para desabilitar o placar 

        // quantidade de perguntas que tem em cada nivel
        // 3 acertos em cada rodada para passar para a próxima
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
        this.groupLevel = [null,1 ,2 ,3];

        this.num_level = [[null], [0, 1, 2], [0, 1, 2], [0, 1, 2]];
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

        this.arrow = this.add.sprite(427, 227, "arrow"); 
        this.arrow.anchor.set(0.5,0.5);
        this.arrow.alpha = 0; 

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
        var t1 = "O Juninho teve a ideia de mandar um [SMS]\n para o [Mapinguari]! O pessoal adorou a\n ideia, então temos que mostrar que sa-\n bemos o que pode ou não pode ter numa\n SMS, essas mensagens que mandamos\n por texto pelo [celular]!";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t2 = " Por exemplo, podemos usar… [emojis] ou [selos]\n numa SMS? Emojis, né? Selos vão em cartas!\n O que mais?";
        var tutorialText1 = this.drawText(this.world.centerX+5, 15, t2, 22, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);
        
        //ADICIONA KIM
        var kim = this.showKim(19900);

        //TEXTO 0 APARECE E INICIA O ÁUDIO DA INTRO 
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);

         //DESAPARECE TEXTO 0 E INICIA TEXTO 1
        this.createDelayTime(20100, function() {
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

        this.celular = this.add.sprite(370, 604, 'celular');
        this.tela = this.add.sprite(396,235, 'tela');
        this.tela.alpha = 0;
        this.intro_1 = this.add.sprite(214, 700, 'intro_1'); 
        this.intro_1.alpha = 0;
        this.intro_2 = this.add.sprite(643, 700, 'intro_2');
        this.intro_2.alpha = 0;
        this.arrow = this.add.sprite(354, 199, "arrow");
        this.arrow.alpha = 0;  // emoticon - 248, 486 / inicial - 354, 199
        
        this.addIntroGroup(this.celular);
        this.addIntroGroup(this.tela);
        this.addIntroGroup(this.intro_1);
        this.addIntroGroup(this.intro_2);
        this.addIntroGroup(this.arrow);

        this.add.tween(this.celular).to({y:206}, 500, "Quart.easeOut", true).onComplete.add(function(){
            //anim tela
            this.add.tween(this.tela).to({alpha:1}, 500, "Quart.easeOut", true).onComplete.add(function() { 
                //anim emoticon e selo
                this.add.tween(this.intro_1).to({alpha:1}, 500, "Quart.easeOut", true);
                this.add.tween(this.intro_2).to({alpha:1}, 500, "Quart.easeOut", true);
                this.add.tween(this.intro_1).to({y:436}, 800, "Quart.easeOut", true).onComplete.add(function(){
                    this.createDelayTime(3800, function() {
                        //anim arrow and click
                        this.add.tween(this.arrow).to({alpha:1}, 800, "Quart.easeOut", true).onComplete.add(function() {
                            this.add.tween(this.arrow).to({x:248, y:486}, 1000, "Quart.easeOut", true).onComplete.add(function() {
                                var click = this.add.sprite(250, 478, "clickAnimation"); 
                                click.animations.add('clickAnim', null, 18, true);
                                click.animations.play('clickAnim'); 
                                this.addIntroGroup(click);
                                this.createDelayTime(1000, function() {
                                    click.animations.stop();
                                    click.alpha = 0;
                                    this.arrow.alpha = 0;
                                    //ANIM EMOTICON PARA O CELULAR
                                    this.add.tween(this.intro_1.scale).to({x:0.8, y:0.8}, 800, "Quart.easeOut", true);
                                    this.add.tween(this.intro_1).to({x:445, y:295}, 1000, "Quart.easeOut", true);
                                });
                            }, this);
                        }, this);
                    }, this);
                }, this);
                this.add.tween(this.intro_2).to({y:480}, 800, "Quart.easeOut", true).onComplete.add(function(){
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

        this.add.tween(this.imageQuestion).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);

        if(callback != null) {
            console.log("*** hideLevel null***");
            this.add.tween(this.placar).to({y: -300}, 300, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
        } else {
            console.log("*** hideLevel else ***");
            this.add.tween(this.placar).to({y: -300}, 300, Phaser.Easing.Linear.None, true, 500);
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
                    this.createDelayTime(200, function() {
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
        // this.background = this.addSpriteMeu('background',-1289,-453);
        this.background = this.add.sprite(-1289,-453, 'background');
        this.guri = this.add.sprite(682,267, 'guri_keep_alive');
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
        var t1 = "Existem várias formas de mandarmos mensagens\n uns para os outros e uma delas é usando o [SMS].\n Precisamos lembrar que tipo de mensagem é essa\n e quais as vantagens de usá-la, tá bom?";
        var tutorialText = this.drawText(this.world.centerX, 20, t1, 21, "center");
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
        /********************************************CONF LEVEL */
        this.groupLevel[this.currentLevel] = this.add.group();
        this.nivel = level;

        
        console.log("Array de números pra sorteio: " + this.num_level[level]);
        this.num_sorteado = this.defineNumSorteado(this.num_level[level]);
        console.log("Número sorteado: " + this.num_sorteado);
        
        //DEFINE RESP. CERTA - BOTÃO COM NAME 0 É SEMPRE O CERTO
        this.certo = 0;

        //define alternativas
        this.createArrayAnswer(this.num_sorteado, level, this.groupLevel[this.currentLevel]);

        /********************************************ANIM LEVEL */
        this.celular = this.add.sprite(370, 604, 'celular');
        this.tela = this.add.sprite(396,235, 'tela');
        this.tela.alpha = 0;
        this.addLevelGroup(this.celular);
        this.addLevelGroup(this.tela);

        this.add.tween(this.celular).to({y:206}, 500, "Quart.easeOut", true).onComplete.add(function() {
            this.add.tween(this.tela).to({alpha:1}, 500, "Quart.easeOut", true).onComplete.add(function() {
                //TOCA SOM DA PERGUNTA
                this.soundQuestion = this.setDebugAudio("P"+level);
                this.soundQuestion.onStop.add(function () {
                    this.showAlternativas();
                }, this);   
            }, this);
         }, this);
    },

    createArrayAnswer:function(num, nivel, group) {
        console.log('*********************createArrayAnswer*********************');
        this.buttonsAnswer = [];
        var arraySprites = [[null], [[0,1], [2,3], [4,5]],[[6,7], [8,9], [10,11]],[[12,13], [14,15], [16,17]]];
        var arrayImages = arraySprites[nivel][num];
       
        if(nivel == 1) {
            this.buttonsAnswer[0] = this.add.sprite(-250, 403, "alternativas", arrayImages[0]);
            this.buttonsAnswer[0].name =  0;
            this.buttonsAnswer[1] = this.add.sprite(-250, 293, "alternativas", arrayImages[1]);
            this.buttonsAnswer[1].name =  1;
        } else if(nivel == 2) {
            this.buttonsAnswer[0] = this.add.sprite(-250, 293, "alternativas", arrayImages[0]);
            this.buttonsAnswer[0].name =  0;
            this.buttonsAnswer[1] = this.add.sprite(-250, 403, "alternativas", arrayImages[1]);
            this.buttonsAnswer[1].name =  1;
        } else if(nivel == 3){
            this.buttonsAnswer[0] = this.add.sprite(-250, 403, "alternativas", arrayImages[1]);
            this.buttonsAnswer[0].name =  1;
            this.buttonsAnswer[1] = this.add.sprite(-250, 293, "alternativas", arrayImages[0]);
            this.buttonsAnswer[1].name =  0;
        }
       
        group.add(this.buttonsAnswer[0]);
        group.add(this.buttonsAnswer[1]);

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
    overButtonAnswer: function(elem) {
        console.log("***overButtonAnswer***");
        console.log("audio " + "P"+this.nivel+"_"+this.num_sorteado+"_"+elem.name);
        this.audio_answer = this.add.audio("P"+this.nivel+"_"+this.num_sorteado+"_"+elem.name);
        this.audio_answer.play();
    },

    //SE O MOUSE SAIR DE CIMA DA IMAGEM, O SOM DELA PARA
    outButtonAnswer:function(sound) {
        console.log("***outButtonAnswer***");
        this.audio_answer.stop();
    },

    showAlternativas:function() {
        console.log("**********show alternativas***********");
        this.add.tween(this.buttonsAnswer[0]).to({x:125}, 300, "Quart.easeOut", true).onComplete.add(function() {
            this.add.tween(this.buttonsAnswer[0]).to({x:111}, 400, "Quart.easeOut", true).onComplete.add(function() {
                this.add.tween(this.buttonsAnswer[1]).to({x:125}, 300, "Quart.easeOut", true).onComplete.add(function() {
                    this.add.tween(this.buttonsAnswer[1]).to({x:111}, 400, "Quart.easeOut", true).onComplete.add(function() {
                        this.enableSomQuestion();
                        this.enableEventMouse();
                    }, this);
                }, this);
            }, this);
        }, this);
    },

    defineNumSorteado:function(array) {
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

    mouseInputDown:function(elem){ // elem = elemento que foi clicado
        console.log("***mouseInputDown***");
        if(elem.click){
            elem.click = false;
            this.disableEventMouse();
            elem.bringToTop();
            var x = 415;
            if((this.nivel == 2 && this.num_sorteado == 0) || (this.nivel == 3 && this.num_sorteado == 0) || (this.nivel == 3 && this.num_sorteado == 2) || (this.nivel == 3 && this.num_sorteado == 1 && elem.name == 1)) {
                x = 390;
            }
            this.add.tween(elem).to({x:x, y:295}, 400, Phaser.Easing.Quadratic.InOut, true).onComplete.add(function() {
                this.add.tween(elem).to({alpha:0}, 400, Phaser.Easing.Quadratic.InOut, true);
                this.createDelayTime(500, function() {
                    this.checkGame(elem);
                });   
            }, this);   
        }
    },

    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção CORRETA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickRightButton: function(target) {
        console.log("*******************clickRightButton*******************");
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
        console.log("*******************clickWrongButton*******************");
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

    },

    //____________________________ funcoes do jogo ___________________________________________________________________________________
    addTextInSprite:function(texto, tint, scale, x, y, spriteFather) { 
        console.log("******addTextInSprite*****");
        var text = texto.toString(); 
        var newText =  this.add.bitmapText(0,0, "Luckiest", texto,100);
        newText.tint = tint;
        newText.scale.set(scale, scale);
        newText.x = -(spriteFather.width*0.5)+x;
        newText.y = -(spriteFather.height/2)+y;
        spriteFather.addChild(newText);
    },

    addText:function(texto, tint, scale, x, y, group) { 
        console.log("******addTextInSprite*****");
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

    animBoomerang:function(sprite, x_avanco, y_avanco, x_final, y_final) {
        this.add.tween(sprite).to({x:x_avanco, y:y_avanco}, 800, "Quart.easeOut", true).onComplete.add(function() {
            this.add.tween(sprite).to({x:x_final, y:y_final}, 800, "Quart.easeOut", true);
        }, this);  
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
                this.changeHappy(this.guri, 677, 266, 'guri_happy', 300, 682, 267, 'guri_keep_alive');
                this.createDelayTime(200, function() {
                    this.clickRightButton();
                });
        } else { 
            console.log("ERRADA");
            this.sound.play("hitErro");
            this.createDelayTime(200, function() {
                this.clickWrongButton(); 
            });
            this.updateLivesText();
        }
    },

    changeHappy:function(elem, x, y, anim, timer, x1, y1, anim1) {
        elem.alpha = 0;
        elem = this.add.sprite(x, y, anim);
        this.createDelayTime(timer, function() {
            elem.alpha = 0;
            elem = this.add.sprite(x1, y1, anim1);
        }, this);
    },

    resetLevel:function(nivel){
        console.log("***resetLevel***");
            this.add.tween(this.tela).to({alpha:0}, 300, Phaser.Easing.Quadratic.InOut, true).onComplete.add(function() {
             this.add.tween(this.celular).to({y:604}, 300, Phaser.Easing.Quadratic.InOut, true).onComplete.add(function() {
             this.add.tween(this.buttonsAnswer[0]).to({x:-250}, 300, Phaser.Easing.Quadratic.InOut, true).onComplete.add(function() {
                this.add.tween(this.buttonsAnswer[1]).to({x:-250}, 300, Phaser.Easing.Quadratic.InOut, true).onComplete.add(function() {
                this.createDelayTime(100, function() {
                this.add.tween(this.groupLevel[nivel]).to({alpha:0}, 500, Phaser.Easing.Linear.None, true, 500);
                    if(this.groupLevel[nivel] != null) {
                        this.groupLevel[nivel].removeAll(true);
                    }
                }); 
                }, this);
            }, this);
        }, this);
        }, this);
    }
};

    // EDITOR
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
