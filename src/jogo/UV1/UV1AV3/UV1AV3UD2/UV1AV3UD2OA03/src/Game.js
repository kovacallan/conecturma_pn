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

        this.TEMPO_INTRO = 43500;
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


        this.groupLevel = [null,1,2,3,4,5];
       
        this.resetRandom();
        this.createScene();
        //this.showResumo();
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

        var t1 = "E o ser folclórico misterioso \nse trancou no celeiro e para \nabrí-lo vamos [decifrar][códigos]!  \nÉ fácil, mas temos que ser rápidos!  ";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t2 = " Cada código tem [3 números]: o da casa da [centena], o \nda casa da [dezena] e o da casa da [unidade], certo?";
        var tutorialText1 = this.drawText(this.world.centerX, 30, t2, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t3 = "Vejam esse número: [386]. Vou pedir uma casa:\n \"CENTENA!\", daí eu vejo que na casa da centena \ntemos o número 3, escolho o 3 no teclado e pronto!";
        var tutorialText2 = this.drawText(this.world.centerX, 8, t3, 21, "left");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var kim = this.showKim(13000);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);

        
        this.createDelayTime(13000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.tutorialPlacar).to({y: -140}, 200, Phaser.Easing.Linear.None, true);
                this.add.tween(tutorialText1).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true);
            }, this);
            
        });

        this.createDelayTime(24000, function() {
            this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(tutorialText2).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
            }, this);
            
        });

       

        this.createDelayTime(this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);//.onComplete.add(this.showFinishedLiveTutorial, this);
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
       
        this.background = this.add.sprite(-29,-1.47, 'background');
    
        this.polly= this.add.sprite(116.17,432.35, "anim_polly");
        this.polly.animations.add('idle', null, 18, true);
        this.polly.animations.play('idle');
        this.polly.anchor.set(0.5,0.5);

        this.guri= this.add.sprite(845.58,441.17, "anim_guri");
        this.guri.animations.add('idle', null, 18, true);
        this.guri.animations.play('idle');
        this.guri.anchor.set(0.5,0.5);

        this.celeiro = this.add.sprite(480,273.52, 'celeiro');
        this.celeiro.anchor.set(0.5,0.5);

        this.porta = this.add.sprite(476,395.58, 'anim_porta');
        this.porta.anchor.set(0.5,0.5);

       
        this.placa_celeiro = this.add.sprite(382.35,157.35, 'placa');

        this.computador = this.add.sprite(482.35,511.76, 'computador');
        this.computador.anchor.set(0.5,0.5);
        
        //this.initLevel1();
        //this.showResumo();
        //this.initGame();
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");

        this.numero_texto =  this.add.bitmapText(470,177, "Luckiest", "386",50);
        this.numero_texto.tint = 0xDCC89A;
        this.numero_texto.anchor.set(0.5,0.5);
        this.groupIntro.add( this.numero_texto);
        this.numero_texto.alpha=0;

        this.teclado = this.add.sprite(694,526, 'teclado');//this.addSpriteMeu('teclado',100,100,0);
        this.teclado.anchor.set(0.5,0.5);
        this.teclado.scale.set(0.1,0.1);
        this.groupIntro.add(this.teclado);
        this.teclado.alpha=0;

        this.tecla = this.add.sprite(747,477, 'tecla');//this.addSpriteMeu('tecla',400,500,0);
        this.tecla.anchor.set(0.5,0.5);
        this.tecla.scale.set(0.1,0.1);
        this.groupIntro.add(this.tecla);
        this.tecla.alpha=0;

        this.mao = this.add.sprite(514,680, 'mao');//this.addSpriteMeu('mao',100,300,0);
        this.mao.anchor.set(0.5,0.5);
        this.mao.scale.set(0.5,0.5);
        this.groupIntro.add(this.mao);
        this.mao.alpha=0;

        this.letter="3";

        this.createDelayTime(2000, function() { 
            this.add.tween(this.numero_texto).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true);
        });

        this.createDelayTime(15000, function() { 
            //teclado
            this.add.tween(this.teclado.scale).to({x:0.5,y:0.5},500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.teclado).to({alpha: 1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                //tecla
                this.add.tween(this.tecla.scale).to({x:1,y:1},500, Phaser.Easing.Linear.None, true)
                this.add.tween(this.tecla).to({alpha: 1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    // mao 
                    this.mao.alpha=1;
                    this.add.tween(this.mao).to({x:694,y:526},500, Phaser.Easing.Linear.None, true);
                    this.createDelayTime(2000, function() {this.showLetra(0);});
                },this);
            },this);
        }); 

        this.createDelayTime(21000, function() {
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
        var t1 = "";
        var tutorialText = this.drawText(this.world.centerX, 30, t1, 22, "center");
            tutorialText.alpha = 0;

        var dois = this.add.sprite(this.world.centerX-100, 100, 'dois');
        dois.anchor.set(0.5,0.5);
        dois.scale.set(0.5,0.5);

        var centena = this.add.sprite(this.world.centerX-100, 200, 'centena');
        centena.anchor.set(0.5,0.5);
        centena.scale.set(0.5,0.5);

        var quatro = this.add.sprite(this.world.centerX-20, 100, 'quatro');
        quatro.anchor.set(0.5,0.5);
        quatro.scale.set(0.5,0.5);

        var dezena = this.add.sprite(this.world.centerX-20, 200, 'dezena');
        dezena.anchor.set(0.5,0.5);
        dezena.scale.set(0.5,0.5);

        var sete = this.add.sprite(this.world.centerX+60, 100, 'sete');
        sete.anchor.set(0.5,0.5);
        sete.scale.set(0.5,0.5);

        var unidade = this.add.sprite(this.world.centerX+60, 200, 'unidade');
        unidade.anchor.set(0.5,0.5);
        unidade.scale.set(0.5,0.5);
        

        this.groupIntro.add(tutorialText);
        this.groupIntro.add(dois);
        this.groupIntro.add(centena);
        this.groupIntro.add(quatro);
        this.groupIntro.add(dezena);
        this.groupIntro.add(sete);
        this.groupIntro.add(unidade);

        dois.alpha =0;
        quatro.alpha=0;
        sete.alpha=0;
        centena.alpha=0;
        dezena.alpha=0;
        unidade.alpha=0;

        this.add.tween(dois).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(quatro).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(sete).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.createDelayTime(5000, function() {

            this.add.tween(dois.scale).to({x:0.7,y:0.7}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(dois.scale).to({x:0.5,y:0.5}, 500, Phaser.Easing.Linear.None, true);
            },this);

            this.add.tween(quatro.scale).to({x:0.7,y:0.7}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(quatro.scale).to({x:0.5,y:0.5}, 500, Phaser.Easing.Linear.None, true)
            },this);

            this.add.tween(sete.scale).to({x:0.7,y:0.7}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(sete.scale).to({x:0.5,y:0.5}, 500, Phaser.Easing.Linear.None, true);
            },this);
            
                    
        });

        this.createDelayTime(12000, function() {

            this.add.tween(sete.scale).to({x:0.7,y:0.7},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(unidade).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            },this);
                   
        });

        this.createDelayTime(16000, function() {
            
            this.add.tween(sete.scale).to({x:0.5,y:0.5},200, Phaser.Easing.Linear.None, true);
            this.add.tween(unidade).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

            this.add.tween(quatro.scale).to({x:0.7,y:0.7},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(dezena).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            },this);
        }); 

        this.createDelayTime(18000, function() {
            
            this.add.tween(quatro.scale).to({x:0.5,y:0.5},200, Phaser.Easing.Linear.None, true);
            this.add.tween(dezena).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

            this.add.tween(dois.scale).to({x:0.7,y:0.7},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(centena).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            },this);

        }); 

        this.createDelayTime(21000, function() {
            this.add.tween(dois.scale).to({x:0.5,y:0.5},200, Phaser.Easing.Linear.None, true);
            this.add.tween(centena).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
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
                if(this.showCallToAction) {
                    this.initLevel1();
                } else { 
                    this.initLevel1(); 
                    //this.sound.play("soundP1").onStop.addOnce(this.initLevel1, this);
                }
            break;
            case 2:
                this.showQuestion(2);
                if(this.showCallToAction) {
                    this.initLevel2();
                } else { 
                    this.initLevel2();  
                    //this.sound.play("soundP1").onStop.addOnce(this.initLevel2, this);
                }
                
            break;
            case 3:
                this.showQuestion(3);
                if(this.showCallToAction) {
                    this.initLevel3();
                } else {   
                    this.initLevel3();
                    //this.sound.play("soundP1").onStop.addOnce(this.initLevel3, this);
                }  
            break;
            case 4:
                this.showQuestion(3);
                if(this.showCallToAction) {
                    this.initLevel4();
                } else {   
                    this.initLevel4();
                    //this.sound.play("soundP1").onStop.addOnce(this.initLevel3, this);
                }  
            break;
            case 5:
                this.showQuestion(3);
                if(this.showCallToAction) {
                    this.initLevel5();
                } else {   
                    this.initLevel5();
                    //this.sound.play("soundP1").onStop.addOnce(this.initLevel3, this);
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

        console.log("***initLevel 1 1 ***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.level(1);
    },

    initLevel2: function() {
        console.log("***initLevel 1 2 ***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.level(1);
    },

    initLevel3: function() {
        console.log("***initLevel 2 1 ***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.level(1); 
    },

    initLevel4: function() {
        console.log("***initLevel 2 2***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.level(1); 
    },

    initLevel5: function() {
        console.log("***initLevel 3 ***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.level(1); 
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

        this.parte = [0,1,2]; // unidade, dezena, centena 
        this.numeros = [1,2,3,4,5,6,7,8,9];

        this.temp_array = this.parte.slice();
        this.pergunta= this.sorteio();

        this.temp_array = this.numeros.slice();
        this.centena= this.sorteio();
        this.numeros= this.temp_array.slice();

        this.temp_array = this.numeros.slice();
        this.dezena= this.sorteio();
        this.numeros= this.temp_array.slice();

        this.temp_array = this.numeros.slice();
        this.unidade= this.sorteio();
        this.numeros= this.temp_array.slice(); 

        this.numero = this.centena.toString()+this.dezena.toString()+this.unidade.toString();
        this.certo = "";
        this.audioPergunta = "";
        switch(this.pergunta){
            case 0:
                this.certo = this.unidade;
                this.audioPergunta= 'unidade';
            break;
            case 1:
                this.certo = this.dezena;
                this.audioPergunta= 'dezena';
            break;
            case 2:
                this.certo = this.centena;
                this.audioPergunta= 'centena';
            break;
        }


       console.log("pergunta: "+this.pergunta);
       console.log("numero: "+this.numero);
       console.log("certo: "+this.certo);
        
        this.numero_texto =  this.add.bitmapText(470,177, "Luckiest", this.numero,50);
        this.numero_texto.tint = 0xDCC89A;
        this.numero_texto.anchor.set(0.5,0.5);
        this.letter="#";

        if(tipo==1){
            this.addLevelGroup(this.numero_texto);
            this.sound.play(this.audioPergunta).onStop.addOnce(function(){
            this.createDelayTime(200, this.initKeyboard);
            }, this);
            
        }else{
            this.addIntroGroup(this.numero_texto);
        }
    },


    initKeyboard: function() {
        console.log("***initKeyboard***");
        this.game.input.keyboard.addCallbacks(this,null,null, this.onKeyPressed);
    },

    removeKeyboard: function() {
        console.log("***removeKeyboard***");
        this.game.input.keyboard.addCallbacks( this, null, null, null );
    },
    
    onKeyPressed: function(evt) {
       //var regex = new RegExp("[a-zA-ZãÃáÁàÀêÊéÉèÈíÍìÌôÔõÕóÓòÒúÚùÙûÛçÇºª' ']");
       //console.log( "letras: " + this.letter.length );
        //if(evt.match(regex))
        //{
            if(this.letter.length<=1)
            {
                this.letter = evt;
                this.removeKeyboard();
                this.showLetra(1);
                this.createDelayTime(200, this.checkGame);
                
            }
        //}
    },


    showLetra:function(tipo){

        this.novo_numero_texto =  this.add.bitmapText(480,465, "Luckiest", this.letter,100);
        this.novo_numero_texto.tint = 0xFFD200;
        this.novo_numero_texto.anchor.set(0.5,0.5);

        if(tipo==1){
            this.addLevelGroup(this.novo_numero_texto);
        }else{
            this.addIntroGroup(this.novo_numero_texto);
        }

    },
    

    checkGame:function(elem){
        console.log("***checkGame***");
        if(this.letter==this.certo){
            console.log("correto");
            this.createDelayTime(1000, function() { 
                this.sound.play("hitAcerto");    
                this.clickRightButton();
            });
        }else{
            console.log("errado");
            this.sound.play("hitErro");
            this.createDelayTime(1000, function() {
                this.clickWrongButton();
            }); 
        }
        
    },

    

    addIntroGroup:function(elem){
        this.groupIntro.add(elem);
    },


    addLevelGroup:function(elem){
        this.groupLevel[this.currentLevel].add(elem);    
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





