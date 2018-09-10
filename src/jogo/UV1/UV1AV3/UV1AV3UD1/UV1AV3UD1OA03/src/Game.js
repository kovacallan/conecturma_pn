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
            

        this.TEMPO_INTRO = 19000;
        this.ENABLE_CALL_TO_ACTION = false;

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
        this.resetRandom();
        this.createScene();
        this.showIntro();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();
        this.goGame = true;

    },



    keyPress: function(elem){
        console.log("entrou aqui");
        if( this.keyboard_permission ){
            console.log("Valor colocado: " + elem);
            console.log("Valor certo: "+ this.right_keyboard_answear);
            if(elem == this.right_keyboard_answear) this.clickRightButton(elem);
            else this.clickWrongButton(elem);
        }
    },

    /**
    *
    * Cria um sprite com uma animação simples em loop na velocidade padrão usando todos os frames que tiverem no objeto
    *
    **/
    createAnimation: function( x, y, name, scaleX, scaleY) { 
        var spr = this.add.sprite(x,y, name);
        spr.animations.add('idle', null, 18, true);
        spr.animations.play('idle');
        spr.scale.set( scaleX, scaleY);

        return spr;
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

        var t1 = "Bumba está jogando o “[Decompondo] \n[Números]”. Vejam só:";
        // Mas para conseguir,temos \nque ajudar fazendo a conta certa! Vamos lá: 
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t2 = "apareceu na tela o [número 14], então ele tem \nque levar a quantidade correta de dezenas \ne unidades para a tabela.Vamos jogar com ele?";
        var tutorialText1 = this.drawText(this.world.centerX, 30, t2, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var kim = this.showKim(6000);

    
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);


        this.createDelayTime(6000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
            this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        });

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
        //this.background = this.addSpriteMeu('background',-244.25,-199.75,0);
        this.background = this.add.sprite(-189.25,-203.5, 'background');

        this.bumba = this.add.sprite(162.19,506.32, "bumba_anim");
        //this.bumba = this.addSpriteMeu('bumba_anim',162.19,506.32,0);
        this.bumba.animations.add('idle', null, 18, true);
        this.bumba.animations.play('idle');
        this.bumba.anchor.set(0.5,0.5);

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
        this.certo = 14;
        
        //var passos = [];
        this.createDelayTime(500, function() {
            this.level(0,2,6);
            this.arrow = this.add.sprite(640,190, 'arrow');
            this.arrow.alpha =1;
            this.groupIntro.add(this.arrow);
           
        });

        

        this.createDelayTime(5000, function() {
            this.add.tween(this.arrow).to({x:this.dezenas[1].x,y:this.dezenas[1].y},700, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.dezenas[1]).to({x:this.dezenas_posX[1]+20,y:this.dezenas_posY[1]+170}, 700, Phaser.Easing.Linear.None, true)
                this.add.tween(this.arrow).to({x:this.dezenas_posX[1],y:this.dezenas_posY[1]+170}, 700, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    //----------------------------------------------unidades-----------------------------------------------//
                    //1
                    this.add.tween(this.arrow).to({x:this.unidades[1].x,y:this.unidades[1].y},700, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        this.add.tween(this.unidades[1]).to({x:this.unidades_posX[1],y:this.unidades_posY[1]+170}, 700, Phaser.Easing.Linear.None, true)
                        this.add.tween(this.arrow).to({x:this.unidades_posX[1],y:this.unidades_posY[1]+170}, 700, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                            //2  
                            this.add.tween(this.arrow).to({x:this.unidades[2].x,y:this.unidades[2].y},700, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                this.add.tween(this.unidades[2]).to({x:this.unidades_posX[2],y:this.unidades_posY[2]+170}, 700, Phaser.Easing.Linear.None, true)
                                this.add.tween(this.arrow).to({x:this.unidades_posX[2],y:this.unidades_posY[2]+170}, 700, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                    //3
                                    this.add.tween(this.arrow).to({x:this.unidades[3].x,y:this.unidades[3].y},700, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                        this.add.tween(this.unidades[3]).to({x:this.unidades_posX[3],y:this.unidades_posY[3]+170}, 700, Phaser.Easing.Linear.None, true)
                                        this.add.tween(this.arrow).to({x:this.unidades_posX[3],y:this.unidades_posY[3]+170}, 700, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                            //4
                                            this.add.tween(this.arrow).to({x:this.unidades[4].x,y:this.unidades[4].y},700, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                                this.add.tween(this.unidades[4]).to({x:this.unidades_posX[4],y:this.unidades_posY[4]+170}, 700, Phaser.Easing.Linear.None, true)
                                                this.add.tween(this.arrow).to({x:this.unidades_posX[4],y:this.unidades_posY[4]+170}, 700, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                                    //final
                                                    this.createDelayTime(700, function() {
                                                        this.showFinishedLiveTutorial();
                                                    });
                                                }, this);
                                            }, this);

                                        }, this);
                                    }, this);
                                }, this);
                            }, this);
                            
                        }, this);
                    }, this);

                }, this);
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
        var t1 = "Decompomos um número quando separamos \nas [dezenas] e as [unidades] dele.";
        
        var tutorialText = this.drawText(this.world.centerX, 30, t1, 22, "center");
            tutorialText.alpha = 0;

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        var imagem = [];

        imagem[0] = this.add.sprite( this.world.centerX-120,120, 'mc_resumo',1);
        imagem[0].anchor.set(0.5,0);

        imagem[1] = this.add.sprite( this.world.centerX-60,120, 'mc_resumo',2);
        imagem[1].anchor.set(0.5,0);

        imagem[2] = this.add.sprite( this.world.centerX-20,120, 'mc_resumo',3);
        imagem[2].anchor.set(0.5,0);

        imagem[3] = this.add.sprite( this.world.centerX+40,125, 'mc_resumo',4);
        imagem[3].anchor.set(0.5,0);

        imagem[4] = this.add.sprite( this.world.centerX+80,120, 'mc_resumo',0);
        imagem[4].anchor.set(0.5,0);

        imagem[0].alpha = 0;
        imagem[1].alpha = 0;
        imagem[2].alpha = 0;
        imagem[3].alpha = 0;
        imagem[4].alpha = 0;

        this.groupIntro.add(imagem[0]);
        this.groupIntro.add(imagem[1]);
        this.groupIntro.add(imagem[2]);
        this.groupIntro.add(imagem[3]);
        this.groupIntro.add(imagem[4]);


        this.createDelayTime( 10000, function() {

            this.add.tween(imagem[0]).to({alpha:1}, 700, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
                //1
                this.add.tween(imagem[1]).to({alpha:1}, 300, Phaser.Easing.Linear.None, true, 400).onComplete.add(function(){
                    //2
                    this.add.tween(imagem[2]).to({alpha:1}, 400, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
                        //3
                        this.add.tween(imagem[3]).to({alpha:1}, 400, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
                            //4
                            this.add.tween(imagem[4]).to({alpha:1}, 400, Phaser.Easing.Linear.None, true, 500);
                        }, this);
                    }, this);
                }, this);
            }, this);
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
                    this.sound.play("soundP1").onStop.addOnce(this.initLevel1, this);
                }
            break;
            case 2:
                this.showQuestion(2);
                if(this.showCallToAction) {
                    this.initLevel2();
                } else {   
                    this.sound.play("soundP1").onStop.addOnce(this.initLevel2, this);
                }
                
            break;
            case 3:
                this.showQuestion(3);
                if(this.showCallToAction) {
                    this.initLevel3();
                } else {   
                    this.sound.play("soundP1").onStop.addOnce(this.initLevel3, this);
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

        var questionList = [ null,
            "Decomponham o número...",
            "Decomponham o número...",
            "Decomponham o número..."
        ];

        this.imageQuestion = this.drawText(this.world.centerX, 30, questionList[num]);
        this.imageQuestion.alpha = 0;

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

        console.log("***initLevel1***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.contadorDezenas = 0;
        this.contadorUnidades = 0;
        this.goGame = true;

        var itens = [11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
      
        this.temp_array = itens.slice();
        item = this.sorteio();
        itens= this.temp_array.slice();

        this.certo = item;

        console.log(item);
        console.log("--> item certo: "+item);

        this.sound.play(this.certo).onStop.addOnce(function(){console.log("--> liberar: ");}, this);

        this.result_dezenas = Math.floor(this.certo/10);
        this.result_unidades =this.certo - (this.result_dezenas*10);
        console.log("--> result dezenas: "+this.result_dezenas);
        console.log("--> result unidades: "+this.result_unidades);

        num_dezd = this.result_dezenas+1;
        num_unid = this.result_unidades+2;

        this.level(1,num_dezd,num_unid);
    },

    initLevel2: function() {
        console.log("***initLevel2***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.contadorDezenas = 0;
        this.contadorUnidades = 0;
        this.goGame = true;

        var itens = [31,32,33,34,35,36,37,38,39];
      
        this.temp_array = itens.slice();
        item = this.sorteio();
        itens= this.temp_array.slice();

        this.certo = item;

        console.log(item);
        console.log("--> item certo: "+item);

        this.sound.play(this.certo).onStop.addOnce(function(){console.log("--> liberar: ");}, this);

        this.result_dezenas = Math.floor(this.certo/10);
        this.result_unidades =this.certo - (this.result_dezenas*10);
        console.log("--> result dezenas: "+this.result_dezenas);
        console.log("--> result unidades: "+this.result_unidades);

        num_dezd = this.result_dezenas+1;
        num_unid = this.result_unidades+2;

        this.level(1,num_dezd,num_unid);     
    },

    initLevel3: function() {
        console.log("***initLevel3***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.contadorDezenas = 0;
        this.contadorUnidades = 0;
        this.goGame = true;

        var itens = [41,42,43,44,45,46,47,48,49];
      
        this.temp_array = itens.slice();
        item = this.sorteio();
        itens= this.temp_array.slice();

        this.certo = item;

        console.log(item);
        console.log("--> item certo: "+item);

        this.sound.play(this.certo).onStop.addOnce(function(){console.log("--> liberar: ");}, this);

        this.result_dezenas = Math.floor(this.certo/10);
        this.result_unidades =this.certo - (this.result_dezenas*10);
        console.log("--> result dezenas: "+this.result_dezenas);
        console.log("--> result unidades: "+this.result_unidades);

        num_dezd = this.result_dezenas+1;
        num_unid = this.result_unidades+2;

        this.level(1,num_dezd,num_unid);
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

        this.updateTimer();

    },

    //____________________________ funcoes do jogo ____________________________________________________________________________________

    level:function(tipo,num_dezd,num_unid){
        //this.painel_quadrado = this.addSpriteMeu('painel_quadrado',100,100,0);
        this.painel_quadrado = this.add.sprite(-500,256.25, 'painel_quadrado');
        this.painel_quadrado.anchor.set(0.5,0.5);
        this.painel_quadrado.scale.set(0.5,0.5);

        /*this.drawPoint(720,32);
        this.drawPoint(847,32);
        this.drawPoint(720,467);
        this.drawPoint(847,467);

        this.drawPoint(863,111);
        this.drawPoint(993,111);
        this.drawPoint(863,516);
        this.drawPoint(993,516);*/

        //painel_dezenas //757.5
    
        var dy=0;
        if(tipo==0){
            dy=170;
        }
        this.painel_dezenas = this.add.sprite(1300,258.75+dy, 'painel_dezenas');
        this.painel_dezenas.anchor.set(0.5,0.5);
        this.painel_dezenas.scale.set(0.4,0.5);

        //painel_unidades //906.25
        this.painel_unidades = this.add.sprite(1300,303.75+dy, 'painel_unidades');
        this.painel_unidades.anchor.set(0.5,0.5);
        this.painel_unidades.scale.set(0.4,0.5);

        this.limiteDezenaA = 757.5;
        this.limiteDezenaB = 757.5+100;
        this.limiteUnidadeA = 906.25;
        this.limiteUnidadeB = 906.25+100;
        
        var t1 = this.certo.toString();    
        //var t2 = this.drawText(0, 0, t1, 140, "center");

        var t2 =  this.add.bitmapText(0,0, "JandaManateeSolid", t1,100);
        t2.tint = 0x010101;
        t2.x = -(t2.width*0.5)+3;
        t2.y = -(t2.height/2)+3;

        var t3 =  this.add.bitmapText(0,0, "JandaManateeSolid", t1,100);
        t3.tint = 0xFFD200;
        t3.x = -t3.width*0.5;
        t3.y = -t3.height/2;

        this.painel_quadrado.addChild(t2);
        this.painel_quadrado.addChild(t3);
         
        this.createDezenas();
        this.createUnidade();
        // adiconando no grupo
        if(tipo == 1){
            this.addLevelGroup();
        }else{
            this.addIntroGroup();
        }

        //this.text1 = this.add.text(30,100, 'Drag the sprites. Overlapping: false', { fill: '#ffffff' });

        //206.25
        this.add.tween(this.painel_quadrado).to({x:266.25},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
               this.add.tween(this.painel_quadrado).to({x:206.25}, 500, Phaser.Easing.Linear.None, true);
               // mostrando as unidades 
               for(i=1; i<num_unid; i++){
                    this.add.tween(this.unidades[i]).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
               }
               //mostrando as dezenas 
               //this.result_dezenas=4;
               for(i=1; i<num_dezd; i++){
                    this.add.tween(this.dezenas[i]).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
               }

               this.add.tween(this.painel_dezenas).to({x:757.5},700, Phaser.Easing.Linear.None, true);
               this.add.tween(this.painel_unidades).to({x:906.25},700, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.painel_dezenas.x = 757.5;
                    this.painel_unidades.x = 906.25;
                    if(tipo == 1){
                        this.createTimer();
                        for(i=1; i<num_unid; i++){
                            this.enableDragDrop(this.unidades[i]);
                        }
                        for(i=1; i<num_dezd; i++){
                            this.enableDragDrop(this.dezenas[i]);
                        }
                    }
                    
               }, this);
        }, this);  
    },
    
    addIntroGroup:function(){
        this.groupIntro.add(this.painel_quadrado);
        this.groupIntro.add(this.painel_dezenas);
        this.groupIntro.add(this.painel_unidades);

        this.groupIntro.add(this.dezenas[1]);
        this.groupIntro.add(this.dezenas[2]);
        this.groupIntro.add(this.dezenas[3]);
        this.groupIntro.add(this.dezenas[4]);

        this.groupIntro.add(this.unidades[1]);
        this.groupIntro.add(this.unidades[2]);
        this.groupIntro.add(this.unidades[3]);
        this.groupIntro.add(this.unidades[4]);
        this.groupIntro.add(this.unidades[5]);
        this.groupIntro.add(this.unidades[6]);
        this.groupIntro.add(this.unidades[7]);
        this.groupIntro.add(this.unidades[8]);
        this.groupIntro.add(this.unidades[9]);
        this.groupIntro.add(this.unidades[10]);
        this.groupIntro.add(this.unidades[11]);
        this.groupIntro.add(this.unidades[12]);    
    },

    addLevelGroup:function(){
        this.groupLevel[this.currentLevel].add(this.painel_quadrado);
        this.groupLevel[this.currentLevel].add(this.painel_dezenas);
        this.groupLevel[this.currentLevel].add(this.painel_unidades);

        this.groupLevel[this.currentLevel].add(this.dezenas[1]);
        this.groupLevel[this.currentLevel].add(this.dezenas[2]);
        this.groupLevel[this.currentLevel].add(this.dezenas[3]);
        this.groupLevel[this.currentLevel].add(this.dezenas[4]);

        this.groupLevel[this.currentLevel].add(this.unidades[1]);
        this.groupLevel[this.currentLevel].add(this.unidades[2]);
        this.groupLevel[this.currentLevel].add(this.unidades[3]);
        this.groupLevel[this.currentLevel].add(this.unidades[4]);
        this.groupLevel[this.currentLevel].add(this.unidades[5]);
        this.groupLevel[this.currentLevel].add(this.unidades[6]);
        this.groupLevel[this.currentLevel].add(this.unidades[7]);
        this.groupLevel[this.currentLevel].add(this.unidades[8]);
        this.groupLevel[this.currentLevel].add(this.unidades[9]);
        this.groupLevel[this.currentLevel].add(this.unidades[10]);
        this.groupLevel[this.currentLevel].add(this.unidades[11]);
        this.groupLevel[this.currentLevel].add(this.unidades[12]);  
    },

    checkOverlap:function(elem,sprite) {
        console.log("*** checkOverlap ****");
        this.game.physics.enable(elem, Phaser.Physics.ARCADE);
        this.game.physics.enable(sprite, Phaser.Physics.ARCADE);      

        if(this.game.physics.arcade.overlap(elem,sprite))
        {
            //this.text1.text = 'Drag the sprites. Overlapping: true';
            return true;
        }else{
            //this.text1.text = 'Drag the sprites. Overlapping: false';
            return false;
        }
    },

    checkOverlapTeste:function(elem,xi,yi,xf,yf) {
        console.log("*** checkOverlap Teste ****");

        if(elem.name=='dezena'){
            if((elem.x>720)&&(elem.x<847)){
                if((elem.y>32)&&(elem.y<467)){
                    return 1; //correto na dezena 
                }else{

                   return 0; //errado - reposicione  
                }
            }
            else if((elem.x>863)&&(elem.x<993)){
                if((elem.y>111)&&(elem.y<516)){
                    return 2; //errado nas unidades considerado erro de pontuação 
                }else{

                   return 0; //errado - reposicione  
                }
            }else{

                return 0; //errado - reposicione 
            }
        }

        if(elem.name=='unidade'){
            
            if((elem.x>863)&&(elem.x<993)){
                if((elem.y>111)&&(elem.y<516)){
                    return 1; //correto nas unidade 
                }
                else{

                   return 0; //errado - reposicione  

                }
            }
            else if((elem.x>720)&&(elem.x<847)){
                if((elem.y>32)&&(elem.y<467)){
                    return 2; //errado nas dezenas considerado erro de pontuação 
                }
                else{

                   return 0; //errado - reposicione  
                }
            }
            else{

                return 0; //errado - reposicione 
            }
        }




        /*if((elem.x>xi)&&(elem.x<xf)){
            if((elem.y>yi)&&(elem.y<yf)){
                return true;
            }else{
                return false;
            }   
        }else{
            return false;
        }*/
        
    },

    enableDragDrop:function(elem){
        console.log("*** enableDragDrop ***");
        elem.inputEnabled = true;
        elem.input.enableDrag();
        elem.events.onDragStart.add(this.ondragStart, this);
        elem.events.onDragStop.add(this.ondragStop, this);
        elem.drop=true;
    },

    disableDragDrop:function(){
        for(i=1; i<13; i++){
            //this.enableDragDrop(this.unidades[i]);
            this.unidades[i].inputEnabled = false;
            //this.unidades[i].input.reset();
        }
        for(i=1; i<5; i++){
            //this.enableDragDrop(this.dezenas[i]);
            this.dezenas[i].inputEnabled = false;
            //this.dezenas[i].input.reset();
        }
    },

    ondragStart:function(elem, pointer) {
        console.log("*** ondragStart ***");
        this.result = "--<Dragging " + elem.key;
    },

    ondragStop:function (elem, pointer) {
        //if(this.goGame){
              console.log("*** ondragStop ***");
            this.mouse = " mouse  x:" + pointer.x + " y: " + pointer.y;
            this.result = " -->sprite:" + elem.key + " dropped at x:" + elem.x + " y: " + elem.y;
           
            console.log(" --> nome:" + elem.name);
            console.log(" --> contadorDezenas:" + this.contadorDezenas);
            console.log(" --> contadorUnidades:" + this.contadorUnidades);
            if(elem.drop){
                if(elem.name=='dezena'){
                    this.checkDezenas(elem);
                }
                if(elem.name=='unidade'){
                    this.checkUnidades(elem);
                }
            }

            console.log(" --> contadorDezenas:" + this.contadorDezenas);
            console.log(" --> contadorUnidades:" + this.contadorUnidades);  
        //}
    },

    checkUnidades:function(elem){
        console.log("*** checkUnidades ***");
        var checkOverlapUnidades = this.checkOverlapTeste(elem,863,111,993,516);

        switch(checkOverlapUnidades){
            case 0: // reposiona 
                this.sound.play("hitErro");
                elem.x = elem.posX;
                elem.y = elem.posY;
            break;
            case 1: // correto
                this.contadorUnidades++;
                elem.x = this.unidades_posX[this.contadorUnidades];
                elem.y = this.unidades_posY[this.contadorUnidades];
                this.unidades_ocupada[this.contadorUnidades] = true;
                elem.drop=false;
                //desabilitar o drop;
                elem.inputEnabled = false;
                elem.input.reset();

                if(this.contadorUnidades>this.result_unidades) {
                    console.log("*** Erro ***");
                    this.goGame=false;
                    this.sound.play("hitErro");
                    this.disableDragDrop();
                    elem.x = elem.posX;
                    elem.y = elem.posY;
                    this.removeTimer();
                    this.createDelayTime(200, function() {
                        this.clickWrongButton();
                    }); 
                }else{
                    // verificando 
                    this.sound.play("hitAcerto");
                    //this.checkGame();
                }
            break;
            case 2:// nas dezenas
                    console.log("*** Erro nas  dezenas ***");

                    elem.drop=false;
                    //desabilitar o drop;
                    elem.inputEnabled = false;
                    elem.input.reset();

                    this.goGame=false;
                    this.sound.play("hitErro");
                    this.disableDragDrop();
                    elem.x = elem.posX;
                    elem.y = elem.posY;
                    this.removeTimer();
                    this.createDelayTime(200, function() {
                        this.clickWrongButton();
                    }); 
            break;
        }
        /*if(checkOverlapUnidades){
            this.contadorUnidades++;

            elem.x = this.unidades_posX[this.contadorUnidades];
            elem.y = this.unidades_posY[this.contadorUnidades];
            this.unidades_ocupada[this.contadorUnidades] = true;
            elem.drop=false;
            //desabilitar o drop;
            elem.inputEnabled = false;
            elem.input.reset();

            if(this.contadorUnidades>this.result_unidades) {
                console.log("*** Erro ***");
                this.goGame=false;
                this.sound.play("hitErro");
                this.disableDragDrop();
                elem.x = elem.posX;
                elem.y = elem.posY;
                this.removeTimer();
                this.createDelayTime(200, function() {
                    this.clickWrongButton();
                }); 
            }else{
                // verificando 
                this.sound.play("hitAcerto");
                //this.checkGame();
            }
        }else{
            this.sound.play("hitErro");
            elem.x = elem.posX;
            elem.y = elem.posY;
        }*/
    },

    checkDezenas:function(elem){
        console.log("*** checkDezenas ***");
        //var checkOverlapDezenas = this.checkOverlap(elem,this.painel_dezenas);
        var checkOverlapDezenas = this.checkOverlapTeste(elem,720,32,847,467);

        switch(checkOverlapDezenas){
            case 0://reposiciona
                this.sound.play("hitErro");
                elem.x = elem.posX;
                elem.y = elem.posY;
            break;
            case 1: // correto
                this.contadorDezenas++;
                elem.x = this.dezenas_posX[this.contadorDezenas];
                elem.y = this.dezenas_posY[this.contadorDezenas];
                this.dezenas_ocupada[this.contadorDezenas] = true;
                elem.drop=false;
                //desabilitar o drop;
                elem.inputEnabled = false;
                elem.input.reset();

                if(this.contadorDezenas>this.result_dezenas) {
                    console.log("*** Erro ***");
                    this.sound.play("hitErro");
                    elem.x = elem.posX;
                    elem.y = elem.posY;
                    this.removeTimer();
                    this.createDelayTime(200, function() {
                        this.clickWrongButton();
                    }); 
                }else{
                    this.sound.play("hitAcerto");
                    //this.checkGame();
                }
            break;
            case 2: // errado nas unidades 
                elem.drop=false;
                //desabilitar o drop;
                elem.inputEnabled = false;
                elem.input.reset();

                console.log("*** Erro ***");
                this.sound.play("hitErro");
                elem.x = elem.posX;
                elem.y = elem.posY;
                this.removeTimer();
                this.createDelayTime(200, function() {
                    this.clickWrongButton();
                }); 


            break;
        }
        /*if(checkOverlapDezenas){
            this.contadorDezenas++;

            elem.x = this.dezenas_posX[this.contadorDezenas];
            elem.y = this.dezenas_posY[this.contadorDezenas];
            this.dezenas_ocupada[this.contadorDezenas] = true;
            elem.drop=false;
            //desabilitar o drop;
            elem.inputEnabled = false;
            elem.input.reset();

            if(this.contadorDezenas>this.result_dezenas) {
                console.log("*** Erro ***");
                this.sound.play("hitErro");
                elem.x = elem.posX;
                elem.y = elem.posY;
                this.removeTimer();
                this.createDelayTime(200, function() {
                    this.clickWrongButton();
                }); 
            }else{
                this.sound.play("hitAcerto");
                //this.checkGame();
            }
        }else{
            this.sound.play("hitErro");
            elem.x = elem.posX;
            elem.y = elem.posY;
        }*/
    },

    checkGame:function(){
        this.sound.play("hitAcerto");
        this.goGame=false;
        if((this.contadorDezenas==this.result_dezenas) && (this.contadorUnidades==this.result_unidades)){
            console.log("*** Correto ***");
            this.disableDragDrop();
            this.removeTimer();
            this.changeHappy(this.bumba,"bumba_anim_happy","bumba_anim",162.19,506.32,162.19,506.32);
            this.createDelayTime(200, function() {
                this.clickRightButton();
            }); 
        }
    },

    createUnidade:function(){

        this.unidades = [null,1,2,3,4,5,6,7,8,9,10,11,12];
        this.unidades_posX = [null,896.25,943.75,896.25,943.75,896.25,943.75,896.25,943.75,896.25,943.75];
        this.unidades_posY = [null,174.50,174.50,220,220,265,265,308.75,308.75,356.25,356.25];
        this.unidades_ocupada = [false,false,false,false,false,false,false,false,false,false,false];

        //this.unidades[0] = this.addSpriteMeu('unidade',100,100,0);
        //this.unidades[1] = this.addSpriteMeu('unidade',200,200,0);
        this.unidades[1] = this.add.sprite(347.5,445, 'unidade');
        this.unidades[1].anchor.set(0.5,0.5);
        this.unidades[1].scale.set(0.5,0.5);

        this.unidades[2] = this.add.sprite(311.25,456.25, 'unidade');
        this.unidades[2].anchor.set(0.5,0.5);
        this.unidades[2].scale.set(0.5,0.5);

        this.unidades[3] = this.add.sprite(325,481.25, 'unidade');
        this.unidades[3].anchor.set(0.5,0.5);
        this.unidades[3].scale.set(0.5,0.5);

        //this.unidades[4] = this.addSpriteMeu('unidade',200,200,0);
        this.unidades[4] = this.add.sprite(360,470, 'unidade');
        this.unidades[4].anchor.set(0.5,0.5);
        this.unidades[4].scale.set(0.5,0.5);

        this.unidades[5] = this.add.sprite(383.75,425, 'unidade');
        this.unidades[5].anchor.set(0.5,0.5);
        this.unidades[5].scale.set(0.5,0.5);

        this.unidades[6] = this.add.sprite(415,425, 'unidade');
        this.unidades[6].anchor.set(0.5,0.5);
        this.unidades[6].scale.set(0.5,0.5);

        this.unidades[7] = this.add.sprite(435,445, 'unidade');
        this.unidades[7].anchor.set(0.5,0.5);
        this.unidades[7].scale.set(0.5,0.5);

        this.unidades[8] = this.add.sprite(383.75,445, 'unidade');
        this.unidades[8].anchor.set(0.5,0.5);
        this.unidades[8].scale.set(0.5,0.5);

        this.unidades[9] = this.add.sprite(420,475, 'unidade');
        this.unidades[9].anchor.set(0.5,0.5);
        this.unidades[9].scale.set(0.5,0.5);

        this.unidades[10] = this.add.sprite(393.75,475, 'unidade');
        this.unidades[10].anchor.set(0.5,0.5);
        this.unidades[10].scale.set(0.5,0.5);

        this.unidades[11] = this.add.sprite(408.75,502, 'unidade');
        this.unidades[11].anchor.set(0.5,0.5);
        this.unidades[11].scale.set(0.5,0.5);

        this.unidades[12] = this.add.sprite(318.75,437.5, 'unidade');
        this.unidades[12].anchor.set(0.5,0.5);
        this.unidades[12].scale.set(0.5,0.5);

        //this.groupLevel[this.currentLevel].add(this.unidades[0]);
        

        //this.unidades[0].alpha=0;

        this.unidades[1].name='unidade';
        this.unidades[2].name='unidade';
        this.unidades[3].name='unidade';
        this.unidades[4].name='unidade';
        this.unidades[5].name='unidade';
        this.unidades[6].name='unidade';
        this.unidades[7].name='unidade';
        this.unidades[8].name='unidade';
        this.unidades[9].name='unidade';
        this.unidades[10].name='unidade';
        this.unidades[11].name='unidade';
        this.unidades[12].name='unidade';


        this.unidades[1].alpha=0;
        this.unidades[2].alpha=0;
        this.unidades[3].alpha=0;
        this.unidades[4].alpha=0;
        this.unidades[5].alpha=0;
        this.unidades[6].alpha=0;
        this.unidades[7].alpha=0;
        this.unidades[8].alpha=0;
        this.unidades[9].alpha=0;
        this.unidades[10].alpha=0;
        this.unidades[11].alpha=0;
        this.unidades[12].alpha=0;

        this.unidades[1].drop=false;
        this.unidades[2].drop=false;
        this.unidades[3].drop=false;
        this.unidades[4].drop=false;
        this.unidades[5].drop=false;
        this.unidades[6].drop=false;
        this.unidades[7].drop=false;
        this.unidades[8].drop=false;
        this.unidades[9].drop=false;
        this.unidades[10].drop=false;
        this.unidades[11].drop=false;
        this.unidades[12].drop=false;

        this.unidades[1].posX=this.unidades[1].x;
        this.unidades[2].posX=this.unidades[2].x;
        this.unidades[3].posX=this.unidades[3].x;
        this.unidades[4].posX=this.unidades[4].x;
        this.unidades[5].posX=this.unidades[5].x;
        this.unidades[6].posX=this.unidades[6].x;
        this.unidades[7].posX=this.unidades[7].x;
        this.unidades[8].posX=this.unidades[8].x;
        this.unidades[9].posX=this.unidades[9].x;
        this.unidades[10].posX=this.unidades[10].x;
        this.unidades[11].posX=this.unidades[11].x;
        this.unidades[12].posX=this.unidades[12].x;

        this.unidades[1].posY=this.unidades[1].y;
        this.unidades[2].posY=this.unidades[2].y;
        this.unidades[3].posY=this.unidades[3].y;
        this.unidades[4].posY=this.unidades[4].y;
        this.unidades[5].posY=this.unidades[5].y;
        this.unidades[6].posY=this.unidades[6].y;
        this.unidades[7].posY=this.unidades[7].y;
        this.unidades[8].posY=this.unidades[8].y;
        this.unidades[9].posY=this.unidades[9].y;
        this.unidades[10].posY=this.unidades[10].y;
        this.unidades[11].posY=this.unidades[11].y;
        this.unidades[12].posY=this.unidades[12].y;

    },

    createDezenas:function(){
        this.dezenas = [null,1,2,3,4];
        this.dezenas_posX=[null,739.75,807.25,739.75,807.25];
        this.dezenas_posY=[null,173.5,173.5,358.5,358.5];
        this.dezenas_ocupada = [false,false,false,false,false];

        //this.dezenas[1] = this.addSpriteMeu('dezenas',100,100,0);
        this.dezenas[1] = this.add.sprite(493.5,441, 'dezenas');
        this.dezenas[1].anchor.set(0.5,0.5);
        this.dezenas[1].scale.set(0.5,0.5);

        this.dezenas[2] = this.add.sprite(493.5+50,441, 'dezenas');
        this.dezenas[2].anchor.set(0.5,0.5);
        this.dezenas[2].scale.set(0.5,0.5);

        this.dezenas[3] = this.add.sprite(493.5+100,441, 'dezenas');
        this.dezenas[3].anchor.set(0.5,0.5);
        this.dezenas[3].scale.set(0.5,0.5);

        this.dezenas[4] = this.add.sprite(493.5+150,441, 'dezenas');
        this.dezenas[4].anchor.set(0.5,0.5);
        this.dezenas[4].scale.set(0.5,0.5);

        this.dezenas[1].alpha = 0;
        this.dezenas[2].alpha = 0;
        this.dezenas[3].alpha = 0;
        this.dezenas[4].alpha = 0;

        this.dezenas[1].drop = false;
        this.dezenas[2].drop = false;
        this.dezenas[3].drop = false;
        this.dezenas[4].drop = false;

        this.dezenas[1].posX = this.dezenas[1].x;
        this.dezenas[2].posX = this.dezenas[2].x;
        this.dezenas[3].posX = this.dezenas[3].x;
        this.dezenas[4].posX = this.dezenas[4].x;

        this.dezenas[1].posY = this.dezenas[1].y;
        this.dezenas[2].posY = this.dezenas[2].y;
        this.dezenas[3].posY = this.dezenas[3].y;
        this.dezenas[4].posY = this.dezenas[4].y;

        this.dezenas[1].name = 'dezena';
        this.dezenas[2].name = 'dezena';
        this.dezenas[3].name = 'dezena';
        this.dezenas[4].name = 'dezena';

        
    },
    animClick:function(){
        this.click.x = this.arrow.x;
        this.click.y = this.arrow.y;
        this.click.alpha = 1;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},800, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;
            //this.arrow.alpha = 0;
        }, this);
    },
    
    liberarClick:function(){
        console.log("*** liberarClick ***");
        this.buttons[0].inputEnabled = true;
        this.buttons[0].input.useHandCursor = true;
        this.buttons[0].events.onInputDown.add(this.mouseInputDown, this);

        this.buttons[1].inputEnabled = true;
        this.buttons[1].input.useHandCursor = true;
        this.buttons[1].events.onInputDown.add(this.mouseInputDown, this);
    },

    mouseInputDown:function(elem){
        console.log("mouseInputDown");
        //console.log("elem: "+elem.name + " == "+this.certo);
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

    // troca de animacao 
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

    updateCounter: function() {

        this.textTimerShadow.text = this.textTimer.text = "0";


        if((this.contadorDezenas==this.result_dezenas) && (this.contadorUnidades==this.result_unidades)){
            console.log("*** updateCounter --> Correto ***");
            this.goGame=false;
            this.sound.play("hitAcerto");
            this.disableDragDrop();
            this.removeTimer();
            this.changeHappy(this.bumba,"bumba_anim_happy","bumba_anim",162.19,506.32,162.19,506.32);
            this.createDelayTime(200, function() {
                this.clickRightButton();
            }); 
        }else{
            console.log("*** updateCounter --> Errado ***");
            this.goGame=false;
            this.disableDragDrop();
            this.sound.play("hitErro");
            this.removeTimer();
            this.createDelayTime(200, function() {
                this.clickWrongButton();
            }); 
           
        }
    },

    //funcoes de tempo 
    createTimer: function() {
        var totalTimer = 30;

        this.gameTimer = this.game.time.events.add(totalTimer*1000, this.updateCounter, this);

        this.textTimerShadow =  this.add.bitmapText(this.world.centerX-20,  540, "JandaManateeSolid", totalTimer.toString(), 48);
        this.textTimerShadow.tint = 0x010101;
        this.textTimer = this.add.bitmapText(this.world.centerX-22,542, "JandaManateeSolid", totalTimer.toString(), 48);
    },
    updateTimer: function() {
        if(this.gameTimer) {
            //console.log(this.game.time.events.duration);
            var _time = parseInt(this.game.time.events.duration/1000)+1;
            this.textTimerShadow.text = this.textTimer.text = _time.toString();
        }
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



    /**** editor *****/

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

    /*gradeGuia:function(width,height){
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

    addSpriteMeu:function(sprite,x,y,frame)
    {
        spr = this.game.add.sprite(x,y, sprite,frame);
        //spr.anchor.set(0.5,0.5);
        this.enableDragDrop(spr);
        return spr;
    },

    enableDragDrop:function(elem)
    {
        elem.inputEnabled = true;
        elem.input.enableDrag();
        elem.events.onDragStart.add(this.onDragStart, this);
        elem.events.onDragStop.add(this.onDragStop, this);
    },

    onDragStart:function(sprite, pointer) {

        this.result = "Dragging " + sprite.key;

    },

    onDragStop:function (sprite, pointer) {

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





