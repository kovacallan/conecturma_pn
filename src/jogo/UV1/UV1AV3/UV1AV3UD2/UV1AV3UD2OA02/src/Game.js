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

        this.TEMPO_INTRO = 28500;
        this.ENABLE_CALL_TO_ACTION = true;
        this.ENABLE_PLACAR = true; // para desabilitar o placar 


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
        this.itensLevel1 = [0,1,2];
        this.itensLevel2 = [0,1,2,3];
        this.itensLevel3 = [0,1,2,3];

        this.animais = ['capivara','coelho','tatu'];
        this.Num_animais = [0,1,2];
    
        this.resetRandom();
        this.createScene();
        //this.showResumo();
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

        var t1 = "Gente, eu acho que tem coisa atrás \ndesses arbustos! ";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t2 = "Para descobrirmos, fazemos assim: escutamos \na palavra e colocamos as sílabas na ordem certa! \nAssim: A palavra é [TIJOLO]! Pego o [TI], depois o [JO] e \ndepois o [LO] e pronto! Abrimos e descobrimos o que \nhá no matagal!";
        var tutorialText1 = this.drawText(this.world.centerX, 30, t2, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var kim = this.showKim(4000);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.auxIntroducao,this);
        this.createDelayTime(4000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(tutorialText1).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
            }, this);
            
        });

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);

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
       
        this.background = this.add.sprite(-4.33,-10.96, 'background');

        //this.ani = this.addSpriteMeu('coelho',100,100,0);
        //this.ani.anchor.set(0.5,0.5);
        //this.ani.scale.set(0.5, 0.5);
    
        //this.polly = this.addSpriteMeu('anim_polly',100,100,0);
        //this.polly.anchor.set(0.5,0.5);

        //this.polly1 = this.addSpriteMeu('anim_polly_happy',100,100,0);
        //this.polly1.anchor.set(0.5,0.5);

        this.polly= this.add.sprite(227.37, 397.61, "anim_polly");
        this.polly.animations.add('idle', null, 18, true);
        this.polly.animations.play('idle');
        //this.guri.scale.set(0.5, 0.5);
        this.polly.anchor.set(0.5,0.5);

        //this.background.scale.set(0.5,0.5);
        //this.initLevel3();
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

        this.arrow = this.add.sprite(430,190, 'arrow');
        this.arrow.alpha =0;
        this.groupIntro.add(this.arrow);
        this.add.tween(this.arrow).to({alpha:1},200, Phaser.Easing.Linear.None, true);

        this.createDelayTime(13000, function() {

            aux = this.buttons[1].x+0;
            auy = this.buttons[1].y+0;
            btn1x =  this.buttons[1].x+0;
            btn1y =  this.buttons[1].y+0;
            btn2x =  this.buttons[2].x+0;
            btn2y =  this.buttons[2].y+0;

            this.add.tween(this.arrow).to({x:aux,y:auy},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                //______________ti____________________
                aux = this.buttons[0].x+0;
                auy = this.buttons[0].y;
                this.add.tween(this.arrow).to({x:aux,y:auy},1000, Phaser.Easing.Linear.None, true);
                this.add.tween(this.buttons[0]).to({x:aux,y:this.buttons[0].y+40},1000, Phaser.Easing.Linear.None, true);
                this.add.tween(this.buttons[1]).to({x:aux,y:auy},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    //______________jo____________________
                    aux = this.buttons[2].x+0;
                    auy = this.buttons[2].y+0;
                    this.add.tween(this.arrow).to({x:aux,y:auy},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        
                        aux = btn1x;
                        auy = btn1y;
                        this.add.tween(this.arrow).to({x:aux,y:auy},1000, Phaser.Easing.Linear.None, true);
                        this.add.tween(this.buttons[2]).to({x:aux,y:auy},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                            //_____________lo_____________________
                            aux = this.buttons[0].x+0;
                            auy = this.buttons[0].y+40;
                            this.add.tween(this.arrow).to({x:aux,y:auy},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                aux = btn2x;
                                auy = btn2y;
                                this.add.tween(this.arrow).to({x:aux,y:auy},1000, Phaser.Easing.Linear.None, true);
                                this.add.tween(this.buttons[0]).to({x:aux,y:auy},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                    //__________animal________________
                                    this.add.tween(this.arrow).to({alpha:0},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){ 
                                        this.createAnimal(0);
                                    },this);
                                },this);

                            },this);
                        },this);
                    },this);
                },this);
            },this);

        });

        this.createDelayTime(23000, function() {
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
        var t1 = "A [ordem das sílabas] é algo muito importante, \npois se trocarmos uma só de lugar… \nadeus, palavrinha! Vamos tentar outra \nvez com mais empenho!";
        var tutorialText = this.drawText(this.world.centerX, 30, t1, 22, "center");
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

    createAreaToClick:function (group) {
        this.area = this.add.sprite(322,524, 'area');
        this.area.alpha = 0.5;
        if(group) {
            group.add(this.area);
        }
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

        console.log("***initLevel1***");
        this.groupLevel[this.currentLevel] = this.add.group();
        
        this.createAreaToClick(this.groupLevel[this.currentLevel]);

        this.num_arbustos = 3;
        this.num_Erros_Level = 0;
        this.numAcertos = 0;
        this.palavraFormada=null;
        

        this.palavras = ["ciranda","caneta","silaba"];


        this.silabas = [];
        this.silabas[0] = ["ci","ran","da"];
        this.silabas[1] = ["ca","ne","ta"];
        this.silabas[2] = ["si","la","ba"];
        this.temp_silabas = [null,null,null,null];

        this.silabas_img = [];
        this.silabas_img[0] = [0,1,2];
        this.silabas_img[1] = [3,4,5];
        this.silabas_img[2] = [6,7,8];

        this.temp_array = this.itensLevel1.slice();
        this.item= this.sorteio();
        this.itensLevel1= this.temp_array.slice(); 
        console.log("array de itens");
        console.log(this.itensLevel1);

         //para teste
        //this.item = 1;

        //this.animais
        this.temp_array = this.Num_animais.slice();
        num = this.sorteio();
        //this.Num_animais= this.temp_array.slice(); 
        this.animal = this.animais[num];
        
        this.palavraCerta  =  this.palavras[this.item];
        this.ocupaPalavra = [true,true,true];
        this.ocupaPalavraCorreta = [false,false,false];

        console.log("palavra --> "+this.palavraCerta);




        this.level(1);
    },

    initLevel2: function() {
        console.log("***initLevel2***");
        this.groupLevel[this.currentLevel] = this.add.group(); 
        
        this.createAreaToClick(this.groupLevel[this.currentLevel]);
   
        this.num_arbustos = 3;
        this.num_Erros_Level = 0;
        this.numAcertos = 0;
        this.palavraFormada=null;
        

        this.palavras = ["biscoito","cirandar","macaco","domino"];
        this.silabas = [];
        this.silabas[0] = ["bis","coi","to"];
        this.silabas[1] = ["ci","ran","dar"];
        this.silabas[2] = ["ma","ca","co"];
        this.silabas[3] = ["do","mi","no"];
        this.temp_silabas = [null,null,null,null];

        this.silabas_img = [];
        this.silabas_img[0] = [10,11,12];
        this.silabas_img[1] = [13,14,15];
        this.silabas_img[2] = [16,17,18];
        this.silabas_img[3] = [19,20,21];

        this.temp_array = this.itensLevel2.slice();
        this.item= this.sorteio();
        this.itensLevel2= this.temp_array.slice(); 
        console.log("array de itens");
        console.log(this.itensLevel2);

        //para teste
        //this.item = 2;

        //this.animais
        this.temp_array = this.Num_animais.slice();
        num = this.sorteio();
        //this.Num_animais= this.temp_array.slice(); 
        this.animal = this.animais[num];
        
        this.palavraCerta  =  this.palavras[this.item];
        this.ocupaPalavra = [true,true,true,true];
        this.ocupaPalavraCorreta = [false,false,false,false];

        console.log("palavra --> "+this.palavraCerta);
        

        this.level(1);
    },

    initLevel3: function() {
        console.log("***initLevel3***");
        this.groupLevel[this.currentLevel] = this.add.group();

        this.createAreaToClick(this.groupLevel[this.currentLevel]);

        this.num_arbustos = 4;
        this.num_Erros_Level = 0;
        this.numAcertos = 0;
        this.palavraFormada=null;
        this.count = false;
        

        this.palavras = ["canivete","cirandinha","tartaruga","qualidade"];
        this.silabas = [];
        this.silabas[0] = ["ca","ni","ve","te"];
        this.silabas[1] = ["ci","ran","di","nha"];
        this.silabas[2] = ["tar","ta","ru","ga"];
        this.silabas[3] = ["qua","li","da","de"];
        
        this.temp_silabas = [null,null,null,null];

        this.silabas_img = [];
        this.silabas_img[0] = [22,23,24,25];
        this.silabas_img[1] = [26,28,29,30];
        this.silabas_img[2] = [31,32,33,34];
        this.silabas_img[3] = [35,36,37,38];

        this.temp_array = this.itensLevel3.slice();
        this.item= this.sorteio();
        this.itensLevel3= this.temp_array.slice(); 
        console.log("array de itens");
        console.log(this.itensLevel3);

        //para teste
        this.item = 3;

        //this.animais
        this.temp_array = this.Num_animais.slice();
        num = this.sorteio();
        //this.Num_animais= this.temp_array.slice(); 
        this.animal = this.animais[num];
        
        this.palavraCerta  =  this.palavras[this.item];
        this.ocupaPalavra = [true,true,true,true];
        this.ocupaPalavraCorreta = [false,false,false,false];
        this.valida = this.ocupaPalavra.slice();

        console.log("palavra --> "+this.palavraCerta);
        

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

    auxIntroducao:function(){
        this.num_arbustos = 3;
        this.item= 0;
        this.silabas_img = [];
        this.silabas_img[0] = [42,40,41];
        this.silabas = [];
        this.silabas[0] = ["lo","ti","jo"];
        this.temp_silabas = [null,null,null,null];

        this.area = this.add.sprite(302,496, 'area');
        this.area.alpha = 1;

        this.addIntroGroup(this.area);

        this.level(0);
    },

    level:function(tipo){ // funcionalidades comuns de todos os niveis e criacao do mini toturial 

       
        console.log("--> tipo: "+tipo);
        console.log("itens-> "+this.item);
        this.posicaoArbustosX=[];
        this.posicaoMarcasX=[];
        if(this.num_arbustos==4){
            this.posicaoArbustosX=[372.46,490.19,618.42,740.10];
            this.posicaoMarcasX=[372.46,490.19,618.42,740.10];
            this.posicao=[372.46,490.19,618.42,740.10];
        }else{
            this.posicaoArbustosX=[372.46,490.19,618.42];
            this.posicaoMarcasX=[372.46,490.19,618.42];
            this.posicao=[372.46,490.19,618.42];

        }
        
        this.posicaoArbustosY= 450;
        this.posicaoMarcasY= 410;



        if(tipo==1){ // adiciona as imagens no grupo do level 

            //this.sound.play(this.palavraCerta).onStop.addOnce(, this);
            this.sound.play(this.palavraCerta);

            this.posicaoArbustosX.sort();
            this.posicaoArbustosX.reverse();

            var x = this.posicaoMarcasX[this.num_arbustos-1]; // coloca na posicao do arbusto 
            var y = this.posicaoArbustosY;

            this.animal_img= this.add.sprite(x, y, this.animal);
            this.animal_img.alpha = 0;
            this.animal_img.anchor.set(0.5,0.5);
            this.animal_img.animations.add('idle', null, 18, true);
            this.addLevelGroup(this.animal_img);
            this.createButton(1);

        }else{// é intro adicona as imagens no grupo da intro 

            this.createButton(0);

            
            
        }

    },

    createMarcas:function(tipo){
        for(i=0; i<this.num_arbustos; i++){
        //for(i=0; i<4; i++){
            this.marcas[i] = this.add.sprite(this.posicaoMarcasX[i],this.posicaoMarcasY,'marca');
            this.marcas[i].anchor.set(0.5,0.5);
            this.marcas[i].scale.set(0.7, 0.7);
            this.marcas[i].name = this.silabas[this.item][i];
            this.marcas[i].posicao = i;
            this.marcas[i].ocupada = true;
            this.marcas[i].alpha = 0;

            this.marcasVisiveis[i] = this.add.sprite(this.posicaoMarcasX[i],this.posicaoArbustosY,'marcaArbusto');
            this.marcasVisiveis[i].anchor.set(0.5,0.5);
            this.marcasVisiveis[i].scale.set(0.7, 0.7);
            this.marcasVisiveis[i].name = this.silabas[this.item][i];

             console.log("marca: "+this.posicaoMarcasX[i]+" -->"+this.marcas[i].name);
             if(tipo==1){ // adiciona as imagens no grupo do level 
                this.addLevelGroup( this.marcas[i]);
                this.addLevelGroup( this.marcasVisiveis[i]);
            }else{// é intro adicona as imagens no grupo da intro 
                this.addIntroGroup( this.marcas[i]);
                this.addIntroGroup( this.marcasVisiveis[i]);
            }
        }
    },


    createButton:function(tipo){
        this.buttons = [];
        this.marcas = [];
        this.marcasVisiveis = [];

        this.groupIncial = this.add.group(); // adicionando os grupos para as imagens ficarem por cima 
        this.groupDragAndDrop = this.add.group();

        this.createMarcas(tipo); // criando as marcas para teste e marcas visiveis 

        for(i=0; i<this.num_arbustos; i++){
    
            this.buttons[i] = this.add.sprite(this.posicaoArbustosX[i],this.posicaoArbustosY,'silabas',this.silabas_img[this.item][i]);
            this.buttons[i].anchor.set(0.5,0.5);
            this.buttons[i].scale.set(0.6, 0.6);
            aux = this.silabas[this.item][i];
            this.buttons[i].name =aux;
            this.buttons[i].id =i;
            this.buttons[i].originalX =this.buttons[i].x;
            this.buttons[i].originalY =this.buttons[i].y;

    
            
            if(this.buttons[i].x==372.46){
                this.buttons[i].posicaoInicial=0;
                this.temp_silabas[0] = this.buttons[i].name;
            }else if(this.buttons[i].x==490.19){
                this.buttons[i].posicaoInicial=1;
                this.temp_silabas[1] = this.buttons[i].name;
            }else if(this.buttons[i].x==618.42){
                this.buttons[i].posicaoInicial=2;
                this.temp_silabas[2] = this.buttons[i].name;
            }else if(this.buttons[i].x==740.10){
                this.buttons[i].posicaoInicial=3;
                this.temp_silabas[3] = this.buttons[i].name;
            }

            this.buttons[i].marca =this.buttons[i].posicaoInicial;

            this.buttons[i].posicaoPalavra = i;
  
            if(tipo==1){ // adiciona as imagens no grupo do level 
                this.groupIncial.add(this.buttons[i]);
                this.enableDragDrop(this.buttons[i]);
            }else{// é intro adicona as imagens no grupo da intro 
                this.addIntroGroup( this.buttons[i]);
                if(i==2){
                    var x = this.posicaoMarcasX[1]+50; // coloca na posicao do arbusto 
                    var y = this.posicaoArbustosY;

                    this.animal_img= this.add.sprite(x, y,"capivara");
                    this.animal_img.alpha = 0;
                    this.animal_img.scale.set(0.0, 0.0);
                    this.animal_img.anchor.set(0.5,0.5);
                    this.animal_img.animations.add('idle', null, 18, true);
                    this.addIntroGroup(this.animal_img);
                }
            }

        }

        console.log("--> "+this.temp_silabas);
        for(i=0; i<this.num_arbustos; i++){
            console.log("arbusto: "+ i + " nome: "+this.buttons[i].name+ " x: "+this.posicaoArbustosX[i] + " posicao Ini: "+this.buttons[i].posicaoInicial+ " na palavra: "+this.buttons[i].posicaoPalavra+ " posicao marca: "+this.buttons[i].marca);
        }
    },


    enableDragDrop:function(elem){
        console.log("*** enableDragDrop ***");
        elem.inputEnabled = true;
        elem.input.useHandCursor = true;
        elem.input.enableDrag();
        elem.events.onDragStart.add(this.ondragStart, this);
        elem.events.onDragStop.add(this.ondragStop, this);
        elem.drop=true;
    },

    disableDragDrop:function(elem){ 
        console.log("*** disableDragDrop ***");      
        elem.inputEnabled = false;
        elem.input.useHandCursor = false;
        elem.input.reset();
    },

    ondragStart:function(elem, pointer) {
        console.log("*** ondragStart ***");
        //items.remove(item);
        //this.groupDragAndDrop.add(elem);
        //this.groupIncial

        //this.groupIncial.remove(elem);
        //this.groupDragAndDrop.add(elem);

        if(elem.drop){
            this.comeco = [elem.x,elem.y];  
        }
       
    },

    ondragStop:function (elem, pointer) {
        console.log("*** ondragStop ***");
        
        if(elem.drop){

            this.checkGame(elem);

        }   
    },

    reposionaElem:function(elem){
        console.log("***reposionaElem***");
        this.sound.play("hitErro");
        elem.x = this.comeco[0];
        elem.y = this.comeco[1]; 
    },


    checkGame:function(elem){
        console.log("***checkGame***");
        console.log("elemento: "+elem.name+" ==>  "+elem.marca);

        this.marcaOverlap = false;
        this.localOcupado = null;
        this.numlocalOcupado = null;

        limiteX = 0;

        if(this.num_arbustos==3){
            limiteX = 800;
        }else{
            limiteX = 900;
        }

        this.teste_check = false;

        for(i=0; i<this.num_arbustos;i++){

            this.teste_check = this.checkOverlap(elem,this.marcas[i]);
            console.log(" -> "+i+" -> "+this.teste_check);
            if(this.teste_check==true){
                this.marcaOverlap = this.marcas[i];
                this.numlocalOcupado = i;
                break;
            }
        }


        if(this.teste_check){
            console.log("***teste_check ***");
            console.log("logica: "+elem.name+" ==>  "+elem.marca +" ==  "+this.marcas[this.numlocalOcupado].name+" =>  "+this.marcas[this.numlocalOcupado].ocupada);
            if(this.marcas[this.numlocalOcupado].ocupada==true){
                this.reposionaElem(elem);//reposiciona
            }else{
                if(elem.name==this.marcas[this.numlocalOcupado].name){
                    console.log("***correto ***");
                    this.answerRight(elem);
                }else{
                    console.log("***errado ***");
                    this.aswerWrong(elem);
                }
            }
        }else{
            if(elem.x<300 || elem.x>limiteX){ 
                this.reposionaElem(elem);
            }else if(elem.y<400 || elem.y>560){
                this.reposionaElem(elem);
            }else{

                console.log("na area");
                console.log("elem marca: "+elem.marca);

                if(elem.marca!=null){
                    this.marcas[elem.marca].ocupada = false;
                    this.temp_silabas[elem.posicaoInicial] = "#";
                    elem.marca = null;
                    elem.posicaoInicial = null; 
                }
                

            }
        }

        this.groupIncial.add(elem);

        console.log("------conferindo-----" );
        console.log("------marcas-----" );
        for(i=0; i<this.num_arbustos; i++){
            console.log("marcas: "+i+" - "+this.marcas[i].name+" ocup-> "+this.marcas[i].ocupada);
        }
        console.log("------botoes-----" );
        for(i=0; i<this.num_arbustos; i++){
            console.log("botoes: "+i+" - "+this.buttons[i].name+" marca-> "+this.buttons[i].marca+" posiInic-> "+this.buttons[i].posicaoInicial);
        }
        console.log("------sibalas-----" );
        for(i=0; i<this.num_arbustos; i++){
            console.log("silabas: "+i+" - "+this.temp_silabas[i]);
        }

    },

    answerRight:function(elem){
        console.log("*** RESPOSTA CERTA ***");
        this.sound.play("hitAcerto");
        //this.addLevelGroup(elem);
        this.groupDragAndDrop.remove(elem);
        this.groupIncial.add(elem);

        this.sound.play(elem.name);

        elem.x = this.posicao[elem.posicaoPalavra]; // coloca na posicao do arbusto 
        elem.y = this.posicaoArbustosY;
        elem.drop = false; // desabilita a posibilidade de fazer teste em caso de falha na logica 
        this.numAcertos++;
        console.log("CORRETO NUM "+ this.numAcertos);
        //this.addLevelGroup(elem);
        var id = elem.id;
        this.disableDragDrop(this.buttons[id]); // desabilita o movimento 

        this.temp_silabas[this.numlocalOcupado] = elem.name;

        if(elem.marca == null){// vei da area 
            this.marcas[this.numlocalOcupado].ocupada = true;
            elem.marca = this.numlocalOcupado;
        }else{
            this.marcas[this.numlocalOcupado].ocupada = true; // ocupa a marca livre 
            this.temp_silabas[elem.marca] = "#";
            this.marcas[elem.marca].ocupada = false; // desocupa a sua marca 
            elem.marca = this.numlocalOcupado;
        }

        //this.buttons[i].posicaoPalavra = i;

        for(i=0; i<this.num_arbustos;i++){
            if(i==0){
                this.palavraFormada=this.temp_silabas[i];
            }else{
                this.palavraFormada+=this.temp_silabas[i];
            }
            
       }
       console.log("PALAVRA -> "+ this.palavraCerta +" ==  "+this.palavraFormada );
       
       if(this.palavraCerta==this.palavraFormada){ // testa se a palavra está completa 
            console.log("CORRETO FINAL");
            for(i=0; i<this.num_arbustos;i++){               
                this.disableDragDrop(this.buttons[i]);
                //this.groupIncial.remove(elem);
                //his.addLevelGroup(this.buttons[i]);
            }
            this.createDelayTime(1000, function() {
                this.createAnimal(1);
                this.createDelayTime(3000, function() { 
                    this.clickRightButton();     
                });
            });
            
       }  
    },
    aswerWrong:function(elem){

        console.log("*** RESPOSTA ERRADA ***");
        this.num_Erros_Level++;
        this.reposionaElem(elem);

        this.groupDragAndDrop.remove(elem);
        this.groupIncial.add(elem);

        if(this.num_Erros_Level>2){
            console.log("TOTAL ERRADA: "+this.num_Erros_Level);
            for(i=0; i<this.num_arbustos;i++){               
                this.disableDragDrop(this.buttons[i]);
                this.buttons[i].drop = false;
                this.groupIncial.remove(elem);
                this.addLevelGroup(this.buttons[i]);
            }

            this.createDelayTime(200, function() { 
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

    checkOverlap:function(spriteA,spriteB) {
        console.log("*** checkOverlap ****");
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);
    },

    createAnimal:function(tipo){
        this.animal_img.alpha = 1;
        this.animal_img.animations.play('idle');
        
        this.add.tween(this.animal_img.scale).to({x:1,y:1}, 500,Phaser.Easing.Linear.None, true, 500);
        

        if(tipo==1){
            this.sound.play(this.animal);
            this.changeHappy(this.polly,"anim_polly_happy","anim_polly",228.72, 396.61,227.37, 397.61);
            this.add.tween(this.animal_img).to({x:this.animal_img.x+150}, 500,Phaser.Easing.Linear.None, true, 500);
        }else{
            this.add.tween(this.animal_img).to({x:this.animal_img.x+90}, 500,Phaser.Easing.Linear.None, true, 500);
        }
        
    },

    resetLevel:function(nivel){
        
        console.log("***resetLevel***");
        
        this.createDelayTime(500, function() {
             this.add.tween(this.groupLevel[nivel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
             this.add.tween(this.groupIncial).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
             this.add.tween(this.groupDragAndDrop).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
             
             if(this.groupLevel[nivel] != null) {
                this.groupLevel[nivel].removeAll(true);
             }

             if(this.groupDragAndDrop != null) {
                this.groupDragAndDrop.removeAll(true);
             }

             if(this.groupIncial != null) {
                this.groupIncial.removeAll(true);
             }
        }); 
    },

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





