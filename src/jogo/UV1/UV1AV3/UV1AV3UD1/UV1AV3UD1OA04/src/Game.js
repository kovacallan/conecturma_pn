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
            

        this.TEMPO_INTRO = 27000;
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
        //this.goGame = true;
        this.playSound = false; // para tocar um som de uma vez
        this.som = null; // recebe o som que está tocando

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

        var t1 = "Devemos colocar esses [cabos] \nnas [entradas corretas] para \nconectar! Todo mundo de \nouvido bem limpinho?";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t2 = "Acho bom, pois na palavra do cabo haverá \num [som] que se repete na palavra da [entrada] \n[correta], ou nada se encaixa. O som do [Z de] \n[AZEITE], por exemplo, está em [COISA], ah, essa \nentrada aqui! Viram? Nossa vez!";
        var tutorialText1 = this.drawText(this.world.centerX, 30, t2, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var kim = this.showKim(7500);

    
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);


        this.createDelayTime(7500, function() {
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
        this.background = this.add.sprite(-38.75,-13.29, 'background');

        

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
        this.item = 7;//azeite
        this.palavras = new Array([null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[18,19],[null,null]);
        //this.palavras[this.item][0] = 18;
        //this.palavras[this.item][1] = 19;
        this.certo = this.palavras[this.item][0];
        
        console.log(this.item);
        console.log("--> item certo: "+this.certo);

        this.createDelayTime(1000, function() {
            this.level(0);// condicao para inserir no grupo de level 
            this.arrow = this.add.sprite(440,190, 'arrow');
            this.arrow.alpha =0;
            this.groupIntro.add(this.arrow);
            this.add.tween(this.arrow).to({alpha:1},200, Phaser.Easing.Linear.None, true);
           
        });

        this.createDelayTime(11000, function() {
            this.add.tween(this.arrow).to({x:this.cabo.x-10,y:this.cabo.y-250},1000, Phaser.Easing.Linear.None, true);
        });

        this.createDelayTime(16000, function() {
            this.add.tween(this.arrow).to({x:706+20,y:394},1000, Phaser.Easing.Linear.None, true);
            this.add.tween(this.cabo).to({x:706,y:654},1000, Phaser.Easing.Linear.None, true);
        });

        this.createDelayTime(19000, function() {
            //this.add.tween(tutorialText1).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showFinishedLiveTutorial, this);
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
        var t1 = "Algumas letras podem ter [mais de um som] e esses \nsons podem ser iguais aos de outras letras. E calma \nque não é tão confuso assim! Para ajudar podemos \n[escutar as palavras]! Vamos novamente?";
        
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
                    this.sound.play("soundP2").onStop.addOnce(this.initLevel2, this);
                }
                
            break;
            case 3:
                this.showQuestion(3);
                if(this.showCallToAction) {
                    this.initLevel3();
                } else {   
                    this.sound.play("soundP3").onStop.addOnce(this.initLevel3, this);
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
            "Qual das entradas tem uma [palavra] com o mesmo \nsom de [S] da que está no [cabo]? Lembrem-se, escutar \no som das palavras ajuda muito.",
            "Me digam agora, qual das entradas tem uma \n[palavra] com esse mesmo som de [Z] da palavra \ndo cabo?",
            "Só mais um cabo! Que entrada tem o [mesmo] \n[som] de [Z] da palavra dele?"
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
        this.check = true;

        var itens = [0,1,2];

        this.temp_array = itens.slice();
        this.item = this.sorteio();
        itens= this.temp_array.slice();

        this.palavras = new Array([0,1],[2,3],[4,5]);
        this.certo = this.palavras[this.item][0];
        this.palavras[this.item].sort(function() {
            return .5 - Math.random();
        });

        console.log(this.item);
        console.log("--> item certo: "+this.certo);

        //this.sound.play(this.certo).onStop.addOnce(function(){console.log("--> liberar: ");}, this);
        this.level(1);// condicao para inserir no grupo de level 
    },

    initLevel2: function() {
        console.log("***initLevel2***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.check = true;

        var itens = [3,4,5];

        this.temp_array = itens.slice();
        this.item = this.sorteio();
        itens= this.temp_array.slice();

        this.palavras = new Array([null,null],[null,null],[null,null],[6,7],[8,9],[10,11],[null,null],[null,null],[null,null]);

        //this.palavras = new Array([6,7],[8,9],[10,11]);
        this.certo = this.palavras[this.item][0];
        this.palavras[this.item].sort(function() {
            return .5 - Math.random();
        });

        console.log(this.item);
        console.log("--> item certo: "+this.certo);

        //this.sound.play(this.certo).onStop.addOnce(function(){console.log("--> liberar: ");}, this);
        this.level(1);// condicao para inserir no grupo de level 
          
    },

    initLevel3: function() {
        console.log("***initLevel3***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.check = true;

        var itens = [6,7,8];

        this.temp_array = itens.slice();
        this.item = this.sorteio();
        itens= this.temp_array.slice();

        //this.palavras = new Array([12,13],[14,15],[16,17]);

        this.palavras = new Array([null,null],[null,null],[null,null],[null,null],[null,null],[null,null],[12,13],[14,15],[16,17]);

        this.certo = this.palavras[this.item][0];
        this.palavras[this.item].sort(function() {
            return .5 - Math.random();
        });

        console.log(this.item);
        console.log("--> item certo: "+this.certo);

        //this.sound.play(this.certo).onStop.addOnce(function(){console.log("--> liberar: ");}, this);
        this.level(1);// condicao para inserir no grupo de level 
        
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

    level:function(tipo){
        this.som = null;
        //this.Marca_cabo = this.addSpriteMeu('marca_cabo',100,100,0);
        //this.cabo = this.add.sprite(546.83,782.47, 'cabo',this.item);
        //this.cabo = this.addSpriteMeu('cabo',100,200,0);

        if(tipo==1){
           this.cabo = this.add.sprite(536.36,490.90, 'cabo',this.item);
           this.cabo.anchor.set(0.5,0); 
        }else{
            this.cabo = this.add.sprite(546.83,782.47, 'cabo',this.item);
            this.cabo.anchor.set(0.5,0.5); 
        }

        //this.cabo = this.add.sprite(536.36,490.90, 'cabo',this.item);
        //this.cabo.anchor.set(0.5,0);
        this.cabo.drop = true;
        this.cabo.alpha =0;

        this.img_palavra = [];
        
        this.img_palavra[0] =this.add.sprite(371.87,314.06, 'palavras',this.palavras[this.item][0]); //this.addSpriteMeu('palavras',100,100,this.palavras[this.item][0]);
        this.img_palavra[0].anchor.set(0.5,0.5);

        this.img_palavra[1] =this.add.sprite(710.93,314.06, 'palavras',this.palavras[this.item][1]); //this.addSpriteMeu('palavras',100,100,this.palavras[this.item][1]);
        this.img_palavra[1].anchor.set(0.5,0.5);

        this.img_palavra[0].alpha =0;
        this.img_palavra[1].alpha =0;

        var som = "P"+this.item.toString();



        //CABO
        this.add.tween(this.cabo).to({alpha:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            //SOM PALAVRA CABO
            if(tipo==1){
                 this.sound.play(som).onStop.addOnce(function(){
                 /*aqui vai cod*/
                    if(tipo==1){
                        console.log("tipo "+tipo)
                        this.enableEventMouse(this.img_palavra[0]);
                        this.enableEventMouse(this.img_palavra[1]);
                    }

                }, this);
            }
            //PALAVRA 1
            this.add.tween(this.img_palavra[0]).to({alpha:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            //PALAVRA 2
                this.add.tween(this.img_palavra[1]).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
             },this);
        },this);

        this.img_marca = [];
        this.img_marca[0] =this.add.sprite(339,407.81, 'marca_cabo');//this.addSpriteMeu('palavras',100,100,this.palavras[this.item][0]);
        this.img_marca[0].anchor.set(0.5,0.5);
        //this.img_marca[0].posX = 395.26;
        //this.img_marca[0].posY = 654.34;
        this.img_marca[0].posX = 390.10;
        this.img_marca[0].posY = 370.62;
        //this.img_marca[0].scale.set(0.4,0.4);
        this.img_marca[0].name = this.palavras[this.item][0];

        this.img_marca[1] =this.add.sprite(770.56,407.81, 'marca_cabo'); //this.addSpriteMeu('palavras',100,100,this.palavras[this.item][1]);
        this.img_marca[1].anchor.set(0.5,0.5);
        //this.img_marca[1].posX = 706.20;
        //this.img_marca[1].posY = 654.34;
        this.img_marca[1].posX = 709.78;
        this.img_marca[1].posY = 369.22;
        //this.img_marca[1].scale.set(0.4,0.4);
        this.img_marca[1].name = this.palavras[this.item][1];

        this.img_marca[0].alpha = 0;
        this.img_marca[1].alpha = 0;

        console.log("frame "+this.img_marca[0].name)
        console.log("frame "+this.img_marca[1].name);

        if(tipo==1){
            console.log("tipo "+tipo)
            this.addLevelGroup();
            this.enableDragDrop(this.cabo);
            this.enableEventMouse(this.img_palavra[0]);
            this.enableEventMouse(this.img_palavra[1]);
        }else{
            this.addIntroGroup();
        }     
    },
    
    addIntroGroup:function(){
        this.groupIntro.add(this.cabo);
        this.groupIntro.add(this.img_palavra[0]);
        this.groupIntro.add(this.img_palavra[1]);
        this.groupIntro.add(this.img_marca[0]);
        this.groupIntro.add(this.img_marca[1]);     
    },

    addLevelGroup:function(){
        this.groupLevel[this.currentLevel].add(this.cabo);
        this.groupLevel[this.currentLevel].add(this.img_palavra[0]);
        this.groupLevel[this.currentLevel].add(this.img_palavra[1]);
        this.groupLevel[this.currentLevel].add(this.img_marca[0]);
        this.groupLevel[this.currentLevel].add(this.img_marca[1]); 
    },

    checkOverlap:function(spriteA,spriteB) {
        console.log("*** checkOverlap ****");
        //this.game.physics.enable(elem, Phaser.Physics.ARCADE);
        //this.game.physics.enable(sprite, Phaser.Physics.ARCADE);      

        /*if(this.game.physics.arcade.overlap(elem,sprite))
        {
            //this.text1.text = 'Drag the sprites. Overlapping: true';
            return true;
        }else{
            //this.text1.text = 'Drag the sprites. Overlapping: false';
            return false;
        }*/


        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);
    },

    checkGame:function(elem){
        if(elem.drop){
            var check1 = this.checkOverlap(elem,this.img_marca[0]);
            var check2 = this.checkOverlap(elem,this.img_marca[1]);
            console.log("--> check1  "+check1);
            console.log("--> check2  "+check2);

            if(check1 && check2){ // se as duas for verdade quando fica no meio
            console.log("***REPOSICIONA TRUE***");
            this.sound.play("hitErro");
            elem.x = this.comeco[0];
            elem.y = this.comeco[1];
            }else if(check1){
                console.log("***CHECK1 TRUE***");
                elem.drop = false;
                this.playSound = false;
                this.som = false;
                this.disableDragDrop(elem);
                if(this.certo == this.img_marca[0].name)
                {
                    console.log("CORRETA");
                    this.sound.play("hitAcerto");
                    this.createDelayTime(200, function() {
                        this.clickRightButton();
                    }); 
                    elem.x = this.img_marca[0].posX;
                    elem.y = this.img_marca[0].posY;
                }else{
                    console.log("ERRADA");
                    this.sound.play("hitErro");
                    this.createDelayTime(200, function() {
                        this.clickWrongButton();
                    }); 
                    elem.x = this.comeco[0];
                    elem.y = this.comeco[1];
                }
            }else if(check2){
                console.log("***CHECK2 TRUE***");
                elem.drop = false;
                this.playSound = false;
                this.som = false;
                this.disableDragDrop(elem);
                if(this.certo == this.img_marca[1].name)
                {
                    console.log("CORRETA");
                    this.sound.play("hitAcerto");
                    this.createDelayTime(200, function() {
                        this.clickRightButton();
                    }); 
                    elem.x = this.img_marca[1].posX;
                    elem.y = this.img_marca[1].posY;
                }else{
                    console.log("ERRADA");
                    this.sound.play("hitErro");
                    this.createDelayTime(200, function() {
                        this.clickWrongButton();
                    }); 
                    elem.x = this.comeco[0];
                    elem.y = this.comeco[1];
                }
            }
            else{// se as duas for falsas não tocando em nada 
                console.log("***REPOSICIONA FALSE***");
                this.sound.play("hitErro");
                elem.x = this.comeco[0];
                elem.y = this.comeco[1];

            }
            
        }

        
    },

    enventoMouse:function(elem) {
        console.log("----enventoMouse---");
            if(this.som == null){
                this.playSound = true;
                this.som = this.sound.play(elem.frame.toString());
                this.add.tween(elem.scale).to({x:1.2,y:1.2}, 200, Phaser.Easing.Linear.None, true);
                this.som.onStop.add(function(){
                    this.add.tween(elem.scale).to({x:1,y:1}, 200, Phaser.Easing.Linear.None, true);
                    this.som = null;
                    this.playSound = false;
                }, this);
            }
    },

    enableEventMouse:function(elem){
        elem.inputEnabled = true;
        elem.input.useHandCursor = true;
        elem.events.onInputOver.add(this.enventoMouse,this);

    },
    enableDragDrop:function(elem){
        console.log("*** enableDragDrop ***");
        elem.inputEnabled = true;
        elem.input.enableDrag();
        elem.events.onDragStart.add(this.ondragStart, this);
        elem.events.onDragStop.add(this.ondragStop, this);
        elem.drop=true;
    },

    disableDragDrop:function(elem){       
        elem.inputEnabled = false;
        elem.input.reset();
    },

    ondragStart:function(elem, pointer) {
        console.log("*** ondragStart ***");
        this.comeco = [elem.x,elem.y];
    },

    ondragStop:function (elem, pointer) {
        console.log("*** ondragStop ***");
        this.checkGame(elem);
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
        /*this.buttons[0].inputEnabled = true;
        this.buttons[0].input.useHandCursor = true;
        this.buttons[0].events.onInputDown.add(this.mouseInputDown, this);*/
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

    //funcoes de tempo 
    updateCounter: function() {
    },
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

    /*drawPoint:function(x,y){ 
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





