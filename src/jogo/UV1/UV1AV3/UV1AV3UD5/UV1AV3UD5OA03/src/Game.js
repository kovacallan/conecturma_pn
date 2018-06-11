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

        this.TEMPO_INTRO = 39500;
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

        this.avesX = [ 60, 363, 664 ];
        this.avesY = [ 191, 209, 191 ];
        this.pedrasX = [173, 506, 816]; 
        this.pedrasY = [408, 404, 411];

        this.pedras = [];
        this.aves = []; 
        this.numeros = [];

        this.respostas_certas = [[null], [9, 7, 8], [11, 14, 13], [15, 20, 50]];
        this.sequencias = [[null],["3 5 7", "1 3 5", "2 4 6"], ["5 7 9", "8 10 12", "7 9 11"], ["3 6 9 12", "5 10 15 20", "10 20 30 40"]];
        this.ajusteX = [[null], [120, 120, 120], [120, 70, 70], [70, 45, 45]];
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
        var t1 = "Oh não! O ser folclórico misterioso\n hipnotizou os [carcarás], pobres\n carcarás, para nos atacarem com\n pedras!";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 22, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t2 = "Mas calma! Vejam que as pedras têm um número\n nelas e se clicarmos no número certo, o bando vai\n embora! Pra saber o número certo é só escolher a\n que completa a sequência de baixo: [4, 6, 8]… o próxi-\nmo número é o [10], sacaram? A sequência era de [2 em]\n [dois]! Sua vez!";
        var tutorialText1 = this.drawText(this.world.centerX, 20, t2, 20, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);
        
        //ADICIONA KIM
        var kim = this.showKim(11200);

        //TEXTO 0 APARECE E INICIA O ÁUDIO DA INTRO 
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);

        //DESAPARECE TEXTO 0 E INICIA TEXTO 1
        this.createDelayTime(11300, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
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
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");

        this.createPedra(0, 1117, 150, 12);
        this.addIntroGroup(this.pedras[0]);
        this.createPedra(1, 1117, 150, 3);
        this.addIntroGroup(this.pedras[1]);
        this.createPedra(2, 1117, 150, 10);
        this.addIntroGroup(this.pedras[2]);
        
        for (var i = 3 - 1; i >= 0; i--) {
            this.add.tween(this.pedras[i]).to({x:this.pedrasX[i], y:this.pedrasY[i]}, 1200, Phaser.Easing.Linear.None, true);
        }

        this.createDelayTime(1300, function() {
            this.placa = this.add.sprite(503, 763, "placa");
            this.placa.anchor.set(0.5, 0.5);
            this.add.tween(this.placa).to({y: 563}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.addTextInSprite("4 6 8", 0x333333, 0.7, 120, 15, this.placa);
            this.addTextInSprite("4 6 8", 0x0199CC, 0.7, 117, 12, this.placa); 
            this.addIntroGroup(this.placa);
        }, this);
        });

        this.arrow = this.add.sprite(391, 269, "arrow");
        this.arrow.anchor.set(0.5,0.5);
        this.arrow.alpha = 0;
        this.groupIntro.add(this.arrow);

        this.createDelayTime(3500, function() {
            this.add.tween(this.arrow).to({alpha:1}, 700, Phaser.Easing.Linear.None, true);
            this.createDelayTime(19000, function() {
                this.add.tween(this.arrow).to({x:828, y:429}, 700, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                var click = this.add.sprite(791, 390, "clickAnimation");
                click.animations.add('clickAnim', null, 18, true);
                click.animations.play('clickAnim'); 
                this.stopClickAnimation(click, 1000);
                this.createDelayTime(2000, function() {
                    this.addTextInSprite("10", 0x333333, 0.9, 325, 3, this.placa); 
                    this.addTextInSprite("10", 0x0199CC, 0.9, 322, 0, this.placa); 
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

        //**************************CENARIO***************************
        // this.background = this.addSpriteMeu('background',-225,-48);
        this.background = this.add.sprite(-225,-48, 'background');
    },

    createPedra:function(index, x, y, num) {
        this.pedras[index] = this.add.sprite(x, y, "pedra");
        this.pedras[index].anchor.set(0.5, 0.5);
        this.pedras[index].alpha = 1;
        this.pedras[index].name = num;
        this.addAves(index,-45, -65, this.pedras[index]);   
        this.addTextInSprite(num.toString(), 0x333333, 0.6, 44, 33, this.pedras[index]);
        this.addTextInSprite(num.toString(), 0x0199CC, 0.6, 41, 33, this.pedras[index]);
    }, 

    addAves:function(index, x, y, spriteFather) {
        this.aves[index] = this.add.sprite(-(spriteFather.width*0.5)+x, -(spriteFather.height-y), "ave");
        // this.aves[index] = addImageInSprite this.addSpriteMeu("ave", this.avesX[i], this.avesY[i]);
        this.aves[index].animations.add('anim_ave', null, 18, true);
        this.aves[index].animations.play('anim_ave');
        spriteFather.addChild(this.aves[index]);
    },

    addNumero:function(index, x  , y, spriteFather, sprite) {
        this.numeros[index] = this.add.sprite(-(spriteFather.width*0.5)+x, -((spriteFather.height/2)-y), "numeros", sprite);
        spriteFather.addChild(this.numeros[index]);
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

        
        var t1 = "Temos vários tipos de sequências: podem ser de \n [dois em dois, três em três, cinco em cinco, dez em]\n [dez]! Com um pouco de atenção conseguimos\n descobrir qual é o próximo número numa\n sequência!";
        var tutorialText = this.drawText(this.world.centerX, 40, t1, 22, "left");
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
    
           
    /*initLevel: function(level) {

        console.log("***initLevel***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.num_erros = 0;
    
        this.nivel = level;

        //TOCA SOUND CALL TO ACTION
        console.log("***SoundCallToAction***");
        this.soundCallToAction = this.setDebugAudio("soundCallToAction");


        this.certo = this.randomQuestion(this.respostas_certas[level]);
        this.sequenciaLevel = this.sequencias[level][this.index_question];
        console.log("Resposta certa: " + this.certo);
        console.log("sequencia: " + this.sequenciaLevel);
        var indexSequencia = this.index_question;
        this.indexRespostaCerta = indexSequencia;

        //CRIA ARRAY DE ALTERNATIVAS DE RESPOSTAS
        this.arrayAnswers = this.createArrayAnswers(this.certo);

        //TOCA SOM DA SEQUENCIA
        this.soundCallToAction.onStop.add(function() {
            this.soundSequencia = this.setDebugAudio("P"+level+"_"+indexSequencia);
            this.soundSequencia.onStop.add(function() {
                this.enableEventMouse(this.arrayAnswers);    
            }, this);
        }, this);

        //ADICIONA QUADRO COM SEQUENCIA
         this.placa = this.add.sprite(503, 763, "placa");
            this.placa.anchor.set(0.5, 0.5);
            this.add.tween(this.placa).to({y: 563}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.addTextInSprite(this.sequenciaLevel, 0x333333, 0.7, this.ajusteX[level][indexSequencia], 15, this.placa); //this.ajusteX[level][indexQuestion];
            this.addTextInSprite(this.sequenciaLevel, 0x0199CC, 0.7, this.ajusteX[level][indexSequencia] - 3, 12, this.placa); 
            this.addLevelGroup(this.placa);
        }, this);

        //ADICIONA AS AVES COM AS PEDRAS E NÚMEROS DA SEQUENCIA
        for (var i = 3 - 1; i >= 0; i--) {
            this.createPedra(i, 1117, 150, this.arrayAnswers[i]);
            this.addLevelGroup(this.pedras[i]);
        }

        for (var i = 3 - 1; i >= 0; i--) {
            this.add.tween(this.pedras[i]).to({x:this.pedrasX[i], y:this.pedrasY[i]}, 1200, Phaser.Easing.Linear.None, true);
        }

    },*/

    initLevel: function(level) {

        console.log("***initLevel***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.num_erros = 0;
    
        this.nivel = level;

        //TOCA SOUND CALL TO ACTION
        console.log("***SoundCallToAction***");
        this.soundCallToAction = this.setDebugAudio("soundCallToAction");


        this.certo = this.randomQuestion(this.respostas_certas[level]);
        this.sequenciaLevel = this.sequencias[level][this.index_question];
        console.log("Resposta certa: " + this.certo);
        console.log("sequencia: " + this.sequenciaLevel);
        var indexSequencia = this.index_question;
        this.indexRespostaCerta = indexSequencia;

        //CRIA ARRAY DE ALTERNATIVAS DE RESPOSTAS
        this.arrayAnswers = this.createArrayAnswers(this.certo);

        //TOCA SOM DA SEQUENCIA
        this.soundCallToAction.onStop.add(function() {
            this.soundSequencia = this.setDebugAudio("P"+level+"_"+indexSequencia);
            this.soundSequencia.onStop.add(function() {
                this.enableEventMouse(this.arrayAnswers);    
            }, this);
        }, this);
        

        //ADICIONA QUADRO COM SEQUENCIA
         this.placa = this.add.sprite(503, 763, "placa");
         this.placa.scale.set(1.3, 1.3);
            this.placa.anchor.set(0.5, 0.5);
            this.add.tween(this.placa).to({y: 563}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.addTextInSprite(this.sequenciaLevel, 0x333333, 0.6, this.ajusteX[level][indexSequencia], 35, this.placa); //this.ajusteX[level][indexQuestion];
            this.addTextInSprite(this.sequenciaLevel, 0x0199CC, 0.6, this.ajusteX[level][indexSequencia] - 3, 32, this.placa); 
            this.addLevelGroup(this.placa);
        }, this);

        //ADICIONA AS AVES COM AS PEDRAS E NÚMEROS DA SEQUENCIA
        for (var i = 3 - 1; i >= 0; i--) {
            this.createPedra(i, 1117, 150, this.arrayAnswers[i]);
            this.addLevelGroup(this.pedras[i]);
        }

        for (var i = 3 - 1; i >= 0; i--) {
            this.add.tween(this.pedras[i]).to({x:this.pedrasX[i], y:this.pedrasY[i]}, 1200, Phaser.Easing.Linear.None, true);
        }

    },

    enableEventMouse:function(){
        console.log("***enableEventMouse***");
        tam = this.pedras.length;
        for(i=0; i<tam; i++){  
            console.log("button "+i);   
            this.pedras[i].click = true;    
            this.pedras[i].inputEnabled = true;
            this.pedras[i].input.useHandCursor = true;
            this.pedras[i].events.onInputDown.add(this.mouseInputDown, this); 
        }
    },

    disableEventMouse:function(){
        console.log("***disableEventMouse***");
        tam = this.pedras.length;
        for(i=0; i<tam; i++){         
            this.pedras[i].inputEnabled = false;
            this.pedras[i].input.useHandCursor = false;
            this.pedras[i].input.reset();
        }
    },

    mouseInputDown:function(elem){ // elem = elemento que foi clicado
        console.log("***mouseInputDown***");
        
        this.addTextInSprite(elem.name.toString(), 0x333333, 0.9, 315, 3, this.placa);
        this.addTextInSprite(elem.name.toString(), 0x0199CC, 0.9, 312, 0, this.placa); 
    
        if(elem.click){
            this.disableEventMouse();
            elem.click = false;
            this.add.tween(elem.scale).to({x:1.2,y:1.2}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(elem.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.createDelayTime(500, function() {
                        this.checkGame(elem, this.nivel);
                    }); 
                },this);
            },this);
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
                        this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
                    });
                }); 
            

            break;
            case 0: 
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
    /*addTextInSprite:function(texto, tint, scale, x, y, spriteFather) { 
        console.log("******addTextInSprite*****");
        var text = texto.toString(); 
        var newText =  this.add.bitmapText(0,0, "Luckiest", texto,100);
        newText.tint = tint;
        newText.scale.set(scale, scale);
        newText.x = -(spriteFather.width*0.5)+x;;
        newText.y = -(spriteFather.height/2)+y;
        newText.alpha = 0;
        spriteFather.addChild(newText);
        this.add.tween(newText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },*/

    addTextInSprite:function(texto, tint, scale, x, y, spriteFather) { 
        console.log("******addTextInSprite*****");
        var text = texto.toString(); 
        var newText =  this.add.bitmapText(0,0, "Luckiest", texto,100);
        newText.tint = tint;
        newText.scale.set(scale, scale);
        newText.x = -(spriteFather.width*0.4)+x;
        newText.y = -(spriteFather.height/2)+y;
        newText.alpha = 0;
        spriteFather.addChild(newText);
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

    createArrayAnswers:function(respCerta) {
        console.log("***createArrayAnswers*** ");
        
        var arrayAnswers = [respCerta];
        var opcoesSoma = [2, 3, 4, 5];
        var numRandomSoma = this.randomQuestion(opcoesSoma);
        console.log("Num. random soma " + numRandomSoma);

        for (var i = 2 - 1; i >= 0; i--) {
            arrayAnswers.push(respCerta + numRandomSoma);
            opcoesSoma.splice(this.index_question, 1);
            numRandomSoma = this.randomQuestion(opcoesSoma);
            console.log("Num. random soma " + numRandomSoma);
        };
        
        //desordena o array pras alternativas não aparecerem sempre na mesma ordem
        arrayAnswers = arrayAnswers.sort(function() {return Math.random() - 0.5});
        console.log("Array das opções de respostas: " + arrayAnswers);
        return arrayAnswers;
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
        if(elem.name==this.respostas_certas[level][this.indexRespostaCerta]){
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

        this.createDelayTime(300, function() { 
            if(this.groupLevel[nivel] != null) {
                this.groupLevel[nivel].removeAll(true);
            }
        }); 
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
