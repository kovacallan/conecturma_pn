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

        this.TEMPO_INTRO = 34500;
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
        this.num_level1 = [21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38,39];
        this.num_level2 = [41,42,43,44,45,46,47,48,49,51,52,53,54,55,56,57,58,59,61,62,63,64,65,66,67,68,69];
        this.num_level3 = [71,72,73,74,75,76,77,78,79,81,82,83,84,85,86,87,88,89,91,92,93,94,95,96,97,98,99];
        
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

        var t1 = "Gente, cada [número] tem uma forma \nde ser [escrito]. Usando números mesmo\n ou por [extenso], com palavras! ";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t2 = "Agora eu vou mostrar um número e vocês têm \nque escolher os troncos que o representam! \nPrimeiro o das [dezenas] e depois o das [unidades]! \nTipo: [21]. Escolho o tronco do [20]… e depois \no do [1]. E tenho [21]! Vamos lá!";
        var tutorialText1 = this.drawText(this.world.centerX, 30, t2, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var kim = this.showKim(10000);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.createDelayTime(10000, function() {
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
        this.background = this.add.sprite(-340,-196, 'background');

        //this.guri1 = this.addSpriteMeu('anim_guri_happy',100,100,0);

        this.guri = this.add.sprite(244, 425, "anim_guri");
        this.guri.animations.add('idle', null, 18, true);
        this.guri.animations.play('idle');
        //this.guri.scale.set(0.5, 0.5);
        this.guri.anchor.set(0.5,0.5);

         //this.guri1 = this.addSpriteMeu('anim_guri_happy',100,100,0);
         //this.guri1.anchor.set(0.5,0.5);

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

        this.item = 21;
        this.result_dezenas = 20;
        this.result_unidades =1.
        this.btn = [this.result_dezenas,this.result_unidades, "2"];
        this.level(0);
        this.arrow = this.add.sprite(430,190, 'arrow');
        this.arrow.alpha =0;
        this.groupIntro.add(this.arrow);
        this.add.tween(this.arrow).to({alpha:1},200, Phaser.Easing.Linear.None, true);

        //this.buttons[0]

        this.createDelayTime(18000, function() {
            aux = this.buttons[0].x+0;
            auy = this.buttons[0].y+0;
            this.add.tween(this.arrow).to({x:aux,y:auy},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                //_______________________________
                aux = this.marca[0].posX;
                auy = this.marca[0].posY;
                this.add.tween(this.arrow).to({x:aux+20,y:auy+20},500, Phaser.Easing.Linear.None, true);
                this.add.tween(this.buttons[0]).to({x:aux,y:auy+40},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    aux = this.buttons[1].x+0;
                    auy = this.buttons[1].y+0;
                     this.add.tween(this.arrow).to({x:aux,y:auy},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                         //_______________________________
                         aux = this.marca[1].posX;
                         auy = this.marca[1].posY;
                         this.add.tween(this.arrow).to({x:aux+20,y:auy+20},500, Phaser.Easing.Linear.None, true);
                         this.add.tween(this.buttons[1]).to({x:aux,y:auy+40},500, Phaser.Easing.Linear.None, true);
                     },this);'' 
                },this)
            },this);
        });


        this.createDelayTime(25000, function() {
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
        var t1 = "Cada [número] possui uma forma de ser [escrito].";
        var tutorialText = this.drawText(this.world.centerX, 30, t1, 22, "center");
            tutorialText.alpha = 0;

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);


        var imagem = [];

        imagem[0] = this.add.sprite( this.world.centerX,70, 'resumo_img',0);
        imagem[0].anchor.set(0.5,0);

        imagem[1] = this.add.sprite( this.world.centerX,70, 'resumo_img',1);
        imagem[1].anchor.set(0.5,0);

        
        imagem[0].alpha = 0;
        imagem[1].alpha = 0;
       

        this.groupIntro.add(imagem[0]);
        this.groupIntro.add(imagem[1]);
        

        this.createDelayTime(5000, function() {
            this.add.tween(imagem[0]).to({alpha:1}, 700, Phaser.Easing.Linear.None, true);

        });

        this.createDelayTime(10000, function() {
            this.add.tween(imagem[0]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true);
            this.add.tween(imagem[1]).to({alpha:1}, 700, Phaser.Easing.Linear.None, true);

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

        this.temp_array = this.num_level1.slice();
        this.item= this.sorteio();
        this.num_level1= this.temp_array.slice();

        console.log("numero "+this.item);
        this.result_dezenas = Math.floor(this.item/10);
        this.result_dezenas = this.result_dezenas*10;
        this.result_unidades =this.item - this.result_dezenas;
        console.log("--> result dezenas: "+this.result_dezenas);
        console.log("--> result unidades: "+this.result_unidades);

        //botoes 
        fator = Math.floor(Math.random() * 4);

        if(fator==0){
            fator=1;
        }

        console.log("--> fator: "+fator);
        
        var _btn = 0;
        if(this.result_unidades>4){
            _btn  = this.result_unidades - fator;
        }else{
            _btn  = this.result_unidades + fator;
        }
        this.btn = [this.result_dezenas,this.result_unidades, _btn];

        this.btn.sort(function() {
            return .5 - Math.random();
        });

        console.log(this.btn);

        this.level(1);

    },

    initLevel2: function() {
        console.log("***initLevel2***");
        this.groupLevel[this.currentLevel] = this.add.group();

        this.temp_array = this.num_level2.slice();
        this.item= this.sorteio();
        this.num_level2= this.temp_array.slice();

        console.log("numero "+this.item);
        this.result_dezenas = Math.floor(this.item/10);
        this.result_dezenas = this.result_dezenas*10;
        this.result_unidades =this.item - this.result_dezenas;
        console.log("--> result dezenas: "+this.result_dezenas);
        console.log("--> result unidades: "+this.result_unidades);

        //botoes 
        fator = Math.floor(Math.random() * 4);

        if(fator==0){
            fator=1;
        }

        console.log("--> fator: "+fator);
        
        var _btn = 0;
        if(this.result_unidades>4){
            _btn  = this.result_unidades - fator;
        }else{
            _btn  = this.result_unidades + fator;
        }
        this.btn = [this.result_dezenas,this.result_unidades, _btn];

        this.btn.sort(function() {
            return .5 - Math.random();
        });

        console.log(this.btn);

        this.level(1);
        
    },

    initLevel3: function() {
        console.log("***initLevel3***");
        this.groupLevel[this.currentLevel] = this.add.group();

        this.temp_array = this.num_level3.slice();
        this.item= this.sorteio();
        this.num_level3= this.temp_array.slice();

        console.log("numero "+this.item);
        this.result_dezenas = Math.floor(this.item/10);
        this.result_dezenas = this.result_dezenas*10;
        this.result_unidades =this.item - this.result_dezenas;
        console.log("--> result dezenas: "+this.result_dezenas);
        console.log("--> result unidades: "+this.result_unidades);

        //botoes 
        fator = Math.floor(Math.random() * 4);

        if(fator==0){
            fator=1;
        }

        console.log("--> fator: "+fator);
        
        var _btn = 0;
        if(this.result_unidades>4){
            _btn  = this.result_unidades - fator;
        }else{
            _btn  = this.result_unidades + fator;
        }
        this.btn = [this.result_dezenas,this.result_unidades, _btn];

        this.btn.sort(function() {
            return .5 - Math.random();
        });

        console.log(this.btn);

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
        console.log("--> tipo: "+tipo)
        //this.imageQuestion = this.drawText(this.world.centerX, 30, questionList[num]);
        //this.imageQuestion.alpha = 0;
        //this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        //this.Marca_cabo = this.addSpriteMeu('marca_cabo',100,100,0);
        //this.sound.play("soundP1").onStop.addOnce(this.initLevel1, this);
         //this.cabo = this.add.sprite(546.83,782.47, 'cabo',this.item);

         this.acertosGame = 0;
        
        var difY = 50;
        if(tipo==0){difY=0;}

        posy = 300-difY;

        this.madeira = this.add.sprite(1000,posy, 'madeira'); //this.addSpriteMeu('madeira',100,100,0);
        this.madeira.anchor.set(0.5,0.5);

        var t1 = this.item.toString();

        var t2 =  this.add.bitmapText(0,0, "Luckiest", t1,50);
        t2.x = -(t2.width*0.5)+3;
        t2.y = -(t2.height/2)+3;
        t2.tint = 0x6f6440;

        this.madeira.addChild(t2);

        this.marca = [];

        //S = this.addSpriteMeu('20',542,399,0);
        //S.anchor.set(0.5,0.5);
        //S.scale.set(0.4, 0.4);

        this.marca[0] = this.add.sprite(522,399-difY, 'madeira');//this.addSpriteMeu('20',542,399,0);
        this.marca[0].anchor.set(0.5,0.5);
        this.marca[0].scale.set(0.1, 0.1);
        this.marca[0].name = this.result_dezenas;

        this.marca[1] = this.add.sprite(704,399-difY, 'madeira');//this.addSpriteMeu('20',684,399,0);
        this.marca[1].anchor.set(0.5,0.5);
        this.marca[1].scale.set(0.1, 0.1);
        this.marca[1].name = this.result_unidades;

        this.marca[0].alpha =0;
        this.marca[1].alpha =0;

        this.marca[0].posX = 507;
        this.marca[1].posX = 744;

        this.marca[0].posY = 356;
        this.marca[1].posY = 356;
   
        auy = this.marca[0].posY;
        if(tipo==0){
            auy = this.marca[0].posY+40; 
        }

        this.marca[2] = this.add.sprite(this.marca[0].posX,auy, 'madeira');//this.addSpriteMeu('20',542,399,0);
        this.marca[2].anchor.set(0.5,0.5);
        this.marca[2].scale.set(0.4, 0.4);

        this.marca[3] = this.add.sprite(this.marca[1].posX,auy, 'madeira');//this.addSpriteMeu('20',542,399,0);
        this.marca[3].anchor.set(0.5,0.5);
        this.marca[3].scale.set(0.4, 0.4);

        this.marca[2].alpha =0.4;
        this.marca[3].alpha =0.4;

        this.add.tween(this.madeira).to({x:618}, 500, Phaser.Easing.Linear.None, true);


        if(tipo==1){ // adiciona as imagens no grupo do level 
            this.addLevelGroup(this.madeira);
            this.addLevelGroup(this.marca[0]);
            this.addLevelGroup(this.marca[1]);
            this.addLevelGroup(this.marca[2]);
            this.addLevelGroup(this.marca[3]);
            this.createButton(1);

        }else{// é intro adicona as imagens no grupo da intro 
            this.addIntroGroup(this.madeira);
            this.addIntroGroup(this.marca[0]);
            this.addIntroGroup(this.marca[1]);
            this.addIntroGroup(this.marca[2]);
            this.addIntroGroup(this.marca[3]);
            this.createButton(0,difY);
        }

    },


    createButton:function(tipo){
        this.buttons = [];
        
        this.buttons[0] = this.add.sprite(427,1000, this.btn[0]);//this.addSpriteMeu('20',427,528,0);
        this.buttons[0].anchor.set(0.5,0.5);
        this.buttons[0].scale.set(0.4, 0.4);
        this.buttons[0].name = this.btn[0];

        this.buttons[1] = this.add.sprite(632,1000, this.btn[1]); //this.addSpriteMeu('1',632,528,0);
        this.buttons[1].anchor.set(0.5,0.5);
        this.buttons[1].scale.set(0.4, 0.4);

        this.buttons[2] = this.add.sprite(848,1000, this.btn[2]); //this.addSpriteMeu('2',848,528,0);
        this.buttons[2].anchor.set(0.5,0.5);
        this.buttons[2].scale.set(0.4, 0.4);

        this.buttons[0].name = this.btn[0];
        this.buttons[1].name = this.btn[1];
        this.buttons[2].name = this.btn[2];

        if(tipo==1){ // adiciona as imagens no grupo do level 
             this.addLevelGroup( this.buttons[0]);
             this.addLevelGroup( this.buttons[1]);
             this.addLevelGroup( this.buttons[2]);
        }else{// é intro adicona as imagens no grupo da intro 
            this.addIntroGroup( this.buttons[0]);
            this.addIntroGroup( this.buttons[1]);
            this.addIntroGroup( this.buttons[2]);
        }

        this.add.tween(this.buttons[0]).to({y:528}, 700, Phaser.Easing.Linear.None, true);
        this.add.tween(this.buttons[1]).to({y:528}, 800, Phaser.Easing.Linear.None, true);
        this.add.tween(this.buttons[2]).to({y:528}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            if(tipo==1){
                this.enableDragDrop(this.buttons[0]);
                this.enableDragDrop(this.buttons[1]);
                this.enableDragDrop(this.buttons[2]);
            }
        },this)
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
        elem.inputEnabled = false;
        elem.input.useHandCursor = false;

        elem.input.reset();
    },

    ondragStart:function(elem, pointer) {
        console.log("*** ondragStart ***");
        this.comeco = [elem.x,elem.y];
    },

    ondragStop:function (elem, pointer) {
        console.log("*** ondragStop ***");

        if(elem.drop){
            this.checkGame(elem);
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

    checkGame:function(elem){
        console.log("***checkGame***");
        var check1 = this.checkOverlap(elem,this.marca[0]);
        var check2 = this.checkOverlap(elem,this.marca[1]);
        console.log("--> check1  "+check1);
        console.log("--> check2  "+check2);

        if(check1 && check2){ // se as duas for verdade quando fica no meio
            console.log("***REPOSICIONA TRUE DUAS***");
            this.sound.play("hitErro");
            elem.x = this.comeco[0];
            elem.y = this.comeco[1];
        }else if(check1){
            console.log("***CHECK1 TRUE***");
            console.log(elem.name +"==" +this.marca[0].name);
            if(elem.name == this.marca[0].name){
                this.changeHappy(this.guri,"anim_guri_happy","anim_guri",255.71, 428.83,244, 425);
                som = "A"+elem.name;
                this.acertosGame++;
                this.sound.play(som).onStop.addOnce(function(){ }, this);
                this.sound.play("hitAcerto");
                this.disableDragDrop(elem);
                elem.drop = false;
                elem.x = this.marca[0].posX;
                elem.y = this.marca[0].posY;

                if(this.acertosGame==2) {
                    this.disableDragDrop(this.buttons[1]);
                    this.disableDragDrop(this.buttons[2]);
                    this.buttons[0].drop = false;
                    this.buttons[1].drop = false;
                    this.buttons[2].drop = false;
                    this.createDelayTime(200, function() { 
                        
                        this.clickRightButton();
                        
                    });
                }
               

            }else{
                    console.log("ERRADA");
                    this.sound.play("hitErro");
                    this.disableDragDrop(this.buttons[0]);
                    this.disableDragDrop(this.buttons[1]);
                    this.disableDragDrop(this.buttons[2]);
                    this.buttons[0].drop = false;
                    this.buttons[1].drop = false;
                    this.buttons[2].drop = false;
                    this.createDelayTime(200, function() {
                        this.clickWrongButton();
                    }); 
                    elem.x = this.comeco[0];
                    elem.y = this.comeco[1];
            }
        }else if(check2){
            console.log("***CHECK2 TRUE***");
            console.log(elem.name +"==" +this.marca[1].name);
            if(elem.name == this.marca[1].name){
                this.changeHappy(this.guri,"anim_guri_happy","anim_guri",255.71, 428.83,244, 425);
                som = "A"+elem.name;
                this.acertosGame++;
                this.sound.play(som).onStop.addOnce(function(){ }, this);
                this.sound.play("hitAcerto");
                this.disableDragDrop(elem);
                elem.drop = false;
                elem.x = this.marca[1].posX;
                elem.y = this.marca[1].posY;

                if(this.acertosGame==2) {
                    this.disableDragDrop(this.buttons[1]);
                    this.disableDragDrop(this.buttons[2]);
                    this.buttons[0].drop = false;
                    this.buttons[1].drop = false;
                    this.buttons[2].drop = false;
                    this.createDelayTime(200, function() { 
                        
                        this.clickRightButton();
                    });
                }
               

            }else{
                    console.log("ERRADA");
                    this.sound.play("hitErro");
                    this.disableDragDrop(this.buttons[0]);
                    this.disableDragDrop(this.buttons[1]);
                    this.disableDragDrop(this.buttons[2]);
                    this.buttons[0].drop = false;
                    this.buttons[1].drop = false;
                    this.buttons[2].drop = false;
                    this.createDelayTime(200, function() {
                        this.clickWrongButton();
                    }); 
                    elem.x = this.comeco[0];
                    elem.y = this.comeco[1];
            }
        }
        else{
            console.log("***REPOSICIONA OUTRO LUGAR***");
            this.sound.play("hitErro");
            elem.x = this.comeco[0];
            elem.y = this.comeco[1];
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





