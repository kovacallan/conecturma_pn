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

        this.TEMPO_INTRO = 30500;
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
        this.playLevel = true;
        
        this.resetRandom();
        this.createScene();
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

        var t1 = "Nós já estamos cansados de \nsaber sobre formas geométricas, \nnão é mesmo?";
        var tutorialText = this.drawText(this.world.centerX+60, 50, t1, 21, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);
        //

        var t2 = "[Triângulos], [círculos], [quadrados]… mas \nsabiam que as formas que têm quatro \nlados - os [quadriláteros] - possuem \nvários nomes diferentes?";
        var tutorialText1 = this.drawText(this.world.centerX+60,50, t2, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t3 = "[Quadrado], [retângulo], [trapézio], [losango]… todos \ntêm 4 lados mas são um pouco diferentes, não \né mesmo?";
        var tutorialText2 = this.drawText(this.world.centerX,30, t3, 21, "left");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var kim = this.showKim(19000);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.createDelayTime(7000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(tutorialText1).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true);
            }, this); 
        });

        this.createDelayTime(19000, function() {
            this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(tutorialText2).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
            }, this); 
        });

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);

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
        
        //this.background = this.addSpriteMeu('background',-375,-313,0);
        this.background = this.add.sprite(-178,-205, 'background');
       
        //this.polly = this.addSpriteMeu('anim_polly',204,443,0);
        //this.polly.anchor.set(0.5,0.5);
        //this.polly1 = this.addSpriteMeu('anim_polly_happy',205,441,0);
        //this.polly1.anchor.set(0.5,0.5);

        this.polly = this.add.sprite(204,443, "anim_polly");
        this.polly.animations.add('idle', null, 18, true);
        this.polly.animations.play('idle');
        this.polly.anchor.set(0.5,0.5);

        //this.initLevel1();
        //this.initGame();
        //this.showResumo();

    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");
        this.tutorial();
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
        var t1 = "Clicando na ordem em que são chamados vamos \nfixando o nome dessas [formas geométricas] nos \ndivertindo ao mesmo tempo!";
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
                //if(this.showCallToAction) {
                    this.initLevel1();
                //} else {   
                    //this.sound.play("soundP1").onStop.addOnce(this.initLevel1, this);
                //}
            break;
            case 2:
                this.showQuestion(2);
                //if(this.showCallToAction) {
                    this.initLevel2();
                //} else {   
                    //this.sound.play("soundP2").onStop.addOnce(this.initLevel2, this);
                //}
                
            break;
            case 3:
                this.showQuestion(3);
                //if(this.showCallToAction) {
                    this.initLevel3();
                //} else {   
                    //this.sound.play("soundP3").onStop.addOnce(this.initLevel3, this);
                //}  
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

        if(this.showCallToAction) {
            return;
        }


        this.imageQuestion = this.drawText(this.world.centerX, 30, questionList[num]);
        this.imageQuestion.alpha = 1;

        
        if(this.ENABLE_PLACAR){
            this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        }else{
            this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        }
    },

    
           
    initLevel1: function() {

        console.log("***initLevel1***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.nome_formas = ["quadrado", "retangulo","losango","trapezio","quadrado", "retangulo","losango","trapezio"];
        this.num_formas = [0,1,2,3,4,5,6,7];

        this.quant_formas = 3;
        this.num_erros = 0;
        this.num_click = 0;
        this.num_acertos = 0;
        this.itens = [];
        this.id_forma = [];

        this.temp_array = this.num_formas.slice();
        var aux = this.sorteio();
        console.log("item " +aux );
        this.itens[0]= this.nome_formas[aux];
        this.id_forma[0] = this.returnIdFormas(this.itens[0]);
        this.num_formas= this.temp_array.slice();

        this.temp_array = this.num_formas.slice();
        var aux = this.sorteio();
        console.log("item " +aux );
        this.itens[1]= this.nome_formas[aux];
        this.id_forma[1] = this.returnIdFormas(this.itens[1]);
        this.num_formas= this.temp_array.slice();

        this.temp_array = this.num_formas.slice();
        var aux = this.sorteio();
        console.log("item " +aux );
        this.itens[2]= this.nome_formas[aux];
        this.id_forma[2] = this.returnIdFormas(this.itens[2]);
        this.num_formas= this.temp_array.slice();
        

        this.createShowCallToAction();

        console.log("itens: "+this.itens);
        console.log("id: "+this.id_forma);


        if(this.playLevel){
            this.sound.play("soundP1").onStop.addOnce(function(){
                this.playLevel=false;
                this.createDelayTime(3000, function() {
                     this.level1();
                });                
            }, this);
        }else{

            this.createDelayTime(1000, function() {
                 this.level1();
            });
        }
        
    },

    

    initLevel2: function() {
        console.log("***initLevel2***");
        this.groupLevel[this.currentLevel] = this.add.group();

        this.nome_formas = ["quadrado", "retangulo","losango","trapezio","quadrado", "retangulo","losango","trapezio"];
        this.num_formas = [0,1,2,3,4,5,6,7];

        this.quant_formas = 4;
        this.num_erros = 0;
        this.num_click = 0;
        this.num_acertos = 0;
        this.itens = [];
        this.id_forma = [];

        this.temp_array = this.num_formas.slice();
        var aux = this.sorteio();
        console.log("item " +aux );
        this.itens[0]= this.nome_formas[aux];
        this.id_forma[0] = this.returnIdFormas(this.itens[0]);
        this.num_formas= this.temp_array.slice();

        this.temp_array = this.num_formas.slice();
        var aux = this.sorteio();
        console.log("item " +aux );
        this.itens[1]= this.nome_formas[aux];
        this.id_forma[1] = this.returnIdFormas(this.itens[1]);
        this.num_formas= this.temp_array.slice();

        this.temp_array = this.num_formas.slice();
        var aux = this.sorteio();
        console.log("item " +aux );
        this.itens[2]= this.nome_formas[aux];
        this.id_forma[2] = this.returnIdFormas(this.itens[2]);
        this.num_formas= this.temp_array.slice();

        this.temp_array = this.num_formas.slice();
        var aux = this.sorteio();
        console.log("item " +aux );
        this.itens[3]= this.nome_formas[aux];
        this.id_forma[3] = this.returnIdFormas(this.itens[3]);
        this.num_formas= this.temp_array.slice();
        

        this.createShowCallToAction();

        console.log("itens: "+this.itens);
        console.log("id: "+this.id_forma);

        this.createDelayTime(1000, function() {
            this.level2();
        });
        
        

    },

    initLevel3: function() {
        console.log("***initLevel3***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.nome_formas = ["quadrado", "retangulo","losango","trapezio","quadrado", "retangulo","losango","trapezio"];
        this.num_formas = [0,1,2,3,4,5,6,7];

        this.quant_formas = 5;
        this.num_erros = 0;
        this.num_click = 0;
        this.num_acertos = 0;
        this.itens = [];
        this.id_forma = [];

        this.temp_array = this.num_formas.slice();
        var aux = this.sorteio();
        console.log("item " +aux );
        this.itens[0]= this.nome_formas[aux];
        this.id_forma[0] = this.returnIdFormas(this.itens[0]);
        this.num_formas= this.temp_array.slice();

        this.temp_array = this.num_formas.slice();
        var aux = this.sorteio();
        console.log("item " +aux );
        this.itens[1]= this.nome_formas[aux];
        this.id_forma[1] = this.returnIdFormas(this.itens[1]);
        this.num_formas= this.temp_array.slice();

        this.temp_array = this.num_formas.slice();
        var aux = this.sorteio();
        console.log("item " +aux );
        this.itens[2]= this.nome_formas[aux];
        this.id_forma[2] = this.returnIdFormas(this.itens[2]);
        this.num_formas= this.temp_array.slice();

        this.temp_array = this.num_formas.slice();
        var aux = this.sorteio();
        console.log("item " +aux );
        this.itens[3]= this.nome_formas[aux];
        this.id_forma[3] = this.returnIdFormas(this.itens[3]);
        this.num_formas= this.temp_array.slice();

        this.temp_array = this.num_formas.slice();
        var aux = this.sorteio();
        console.log("item " +aux );
        this.itens[4]= this.nome_formas[aux];
        this.id_forma[4] = this.returnIdFormas(this.itens[4]);
        this.num_formas= this.temp_array.slice();
        

        this.createShowCallToAction();

        console.log("itens: "+this.itens);
        console.log("id: "+this.id_forma);

        this.createDelayTime(1000, function() {
            this.level3();
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

    returnIdFormas: function(name){
        switch(name){
            case "quadrado":
             return 0;
            break;
            case "retangulo":
             return 1;
            break;
            case "trapezio":
             return 2;
            break;
            case "losango":
             return 3;
            break;
        }
    },

    createShowCallToAction:function(){
        console.log("*** createShowCallToAction ***");

        this.quadro = this.add.sprite(1000,416, "quadro"); //this.addSpriteMeu('quadro',375,313,0);//
        this.quadro.anchor.set(0.5,0.5);
        this.addLevelGroup(this.quadro);

        this.formas= [];

        this.formas[0] = this.add.sprite(445,331, "quadrado"); //this.addSpriteMeu('quadrado',375,313,0);
        this.formas[0].anchor.set(0.5,0.5);
        this.formas[0].scale.set(0.4,0.4);
        this.formas[0].name = "quadrado";

        this.formas[1] = this.add.sprite(702,331, "retangulo"); //this.addSpriteMeu('retangulo',375,413,0);
        this.formas[1].anchor.set(0.5,0.5);
        this.formas[1].scale.set(0.4,0.4);
        this.formas[1].name = "retangulo";

        this.formas[2] = this.add.sprite(450,485, "trapezio"); //this.addSpriteMeu('trapezio',375,513,0);
        this.formas[2].anchor.set(0.5,0.5);
        this.formas[2].scale.set(0.4,0.4);
        this.formas[2].name = "trapezio";

        this.formas[3] = this.add.sprite(714,485, "losango"); //this.addSpriteMeu('losango',375,213,0);
        this.formas[3].anchor.set(0.5,0.5);
        this.formas[3].scale.set(0.4,0.4);
        this.formas[3].name = "losango";

        this.formas[0].alpha = 0;
        this.formas[1].alpha = 0;
        this.formas[2].alpha = 0;
        this.formas[3].alpha = 0;

        this.formas[0].click = false;
        this.formas[1].click = false;
        this.formas[2].click = false;
        this.formas[3].click = false;

        this.addLevelGroup(this.formas[0]);
        this.addLevelGroup(this.formas[1]);
        this.addLevelGroup(this.formas[2]);
        this.addLevelGroup(this.formas[3]);


        this.add.tween(this.quadro).to({x:585},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.add.tween(this.formas[0]).to({alpha:1},1000, Phaser.Easing.Linear.None, true);
            this.add.tween(this.formas[1]).to({alpha:1},1000, Phaser.Easing.Linear.None, true);
            this.add.tween(this.formas[2]).to({alpha:1},1000, Phaser.Easing.Linear.None, true);
            this.add.tween(this.formas[3]).to({alpha:1},1000, Phaser.Easing.Linear.None, true);

        },this);


        if(this.playLevel){

            this.createDelayTime(15000, function() {

                this.add.tween(this.formas[3].scale).to({x:0.6,y:0.6},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.add.tween(this.formas[3].scale).to({x:0.4,y:0.4},200, Phaser.Easing.Linear.None, true);
                    this.add.tween(this.formas[0].scale).to({x:0.6,y:0.6},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        this.add.tween(this.formas[0].scale).to({x:0.4,y:0.4},200, Phaser.Easing.Linear.None, true);
                        this.add.tween(this.formas[3].scale).to({x:0.6,y:0.6},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                            this.add.tween(this.formas[3].scale).to({x:0.4,y:0.4},200, Phaser.Easing.Linear.None, true);
                        },this);
                    },this);
                },this);
              
            });

        }
    },


    tutorial:function(){

        this.quadro = this.add.sprite(1000,416, "quadro"); //this.addSpriteMeu('quadro',375,313,0);//
        this.quadro.anchor.set(0.5,0.5);
        this.addIntroGroup(this.quadro);

        this.intro_imagem = [];
        
        this.intro_imagem[0] = this.add.sprite(586,408, "intro_quadrado");//this.addSpriteMeu('intro_quadrado',375,313,0);//
        this.intro_imagem[0].anchor.set(0.5,0.5);
        this.intro_imagem[0].scale.set(0.4,0.4);
        this.addIntroGroup(this.intro_imagem[0]);

        this.intro_imagem[1] = this.add.sprite(586,409, "intro_retangulo");//this.addSpriteMeu('intro_retangulo',375,313,0);//
        this.intro_imagem[1].anchor.set(0.5,0.5);
        this.intro_imagem[1].scale.set(0.4,0.4);
        this.addIntroGroup(this.intro_imagem[1]);

        this.intro_imagem[2] = this.add.sprite(582,408, "intro_trapezio");//this.addSpriteMeu('intro_trapezio',375,313,0);//
        this.intro_imagem[2].anchor.set(0.5,0.5);
        this.intro_imagem[2].scale.set(0.4,0.4);
        this.addIntroGroup(this.intro_imagem[2]);

        this.intro_imagem[3] = this.add.sprite(588,404, "intro_losango");//this.addSpriteMeu('intro_losango',375,313,0);//
        this.intro_imagem[3].anchor.set(0.5,0.5);
        this.intro_imagem[3].scale.set(0.4,0.4);
        this.addIntroGroup(this.intro_imagem[3]);

        this.intro_imagem[0].alpha = 0;
        this.intro_imagem[1].alpha = 0;
        this.intro_imagem[2].alpha = 0;
        this.intro_imagem[3].alpha = 0;

        this.add.tween(this.quadro).to({x:585},100, Phaser.Easing.Linear.None, true).onComplete.add(function(){ 
            this.add.tween(this.intro_imagem[0]).to({alpha:1},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){ 
                this.intro_imagem[0].alpha =0;
                this.add.tween(this.intro_imagem[1]).to({alpha:1},1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){ 
                    this.intro_imagem[1].alpha=0;
                    this.add.tween(this.intro_imagem[2]).to({alpha:1},1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){ 
                        this.intro_imagem[2].alpha=0;
                        this.add.tween(this.intro_imagem[3]).to({alpha:1},1500, Phaser.Easing.Linear.None, true).onComplete.add(function(){ 
                            this.intro_imagem[3].alpha=0;
                            this.createFormas();

                        },this);
                    },this);
                },this);
            },this);
        },this);

    },

    createFormas:function(){
        this.formas= [];

        this.formas[0] = this.add.sprite(445,331, "quadrado"); //this.addSpriteMeu('quadrado',375,313,0);
        this.formas[0].anchor.set(0.5,0.5);
        this.formas[0].scale.set(0.4,0.4);
        this.formas[0].name = "quadrado";

        this.formas[1] = this.add.sprite(702,331, "retangulo"); //this.addSpriteMeu('retangulo',375,413,0);
        this.formas[1].anchor.set(0.5,0.5);
        this.formas[1].scale.set(0.4,0.4);
        this.formas[1].name = "retangulo";

        this.formas[2] = this.add.sprite(450,485, "trapezio"); //this.addSpriteMeu('trapezio',375,513,0);
        this.formas[2].anchor.set(0.5,0.5);
        this.formas[2].scale.set(0.4,0.4);
        this.formas[2].name = "trapezio";

        this.formas[3] = this.add.sprite(714,485, "losango"); //this.addSpriteMeu('losango',375,213,0);
        this.formas[3].anchor.set(0.5,0.5);
        this.formas[3].scale.set(0.4,0.4);
        this.formas[3].name = "losango";

        this.formas[0].alpha = 0;
        this.formas[1].alpha = 0;
        this.formas[2].alpha = 0;
        this.formas[3].alpha = 0;

        this.formas[0].click = false;
        this.formas[1].click = false;
        this.formas[2].click = false;
        this.formas[3].click = false;

        this.addIntroGroup(this.formas[0]);
        this.addIntroGroup(this.formas[1]);
        this.addIntroGroup(this.formas[2]);
        this.addIntroGroup(this.formas[3]);

        this.add.tween(this.formas[0]).to({alpha:1},500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.formas[1]).to({alpha:1},500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.formas[2]).to({alpha:1},500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.formas[3]).to({alpha:1},500, Phaser.Easing.Linear.None, true);

        this.arrow = this.add.sprite(430,190, 'arrow');
        this.arrow.alpha =0;

        this.click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
        this.click.animations.add('idle', null, 18, true);
        this.click.alpha = 0;
        
        
        this.addIntroGroup(this.click );
        this.addIntroGroup(this.arrow);

        this.add.tween(this.arrow).to({alpha:1},500, Phaser.Easing.Linear.None, true);

        aux = this.formas[3].x+0;
        auy = this.formas[3].y-20;

        this.add.tween(this.arrow).to({x:aux,y:auy},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.animClick();
            this.createDelayTime(800, function() {
                aux = this.formas[0].x+0;
                auy = this.formas[0].y-20;
                this.add.tween(this.arrow).to({x:aux,y:auy},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.animClick();
                    this.createDelayTime(3000, function() {
                        this.showFinishedLiveTutorial();
                    }); 
                },this);
            }); 
        },this);

    },

    animClick:function(proximo){   
       
        this.click.alpha = 1;
        this.click.x = this.arrow.x;
        this.click.y = this.arrow.y;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;

        }, this);
    },
    

    level1:function(){

        var forma = this.id_forma[0];
        var audio = "A"+this.formas[forma].name;
        //var elem = this.formas[forma];

        //console.log("forma: "+forma);
        //console.log("audio: "+audio);
        //console.log("elem: "+elem);

        this.add.tween(this.formas[forma].scale).to({x:0.6,y:0.6},1000, Phaser.Easing.Linear.None, true);
        this.sound.play(audio).onStop.addOnce(function(){//1
            this.add.tween(this.formas[forma].scale).to({x:0.4,y:0.4},200, Phaser.Easing.Linear.None, true).onComplete.add(function(){//2
                forma = this.id_forma[1];
                audio = "A"+this.formas[forma].name;
                this.add.tween(this.formas[forma].scale).to({x:0.6,y:0.6},1000, Phaser.Easing.Linear.None, true);
                this.sound.play(audio).onStop.addOnce(function(){//3
                    this.add.tween(this.formas[forma].scale).to({x:0.4,y:0.4},200, Phaser.Easing.Linear.None, true).onComplete.add(function(){//4
                        forma = this.id_forma[2];
                        audio = "A"+this.formas[forma].name;
                        this.add.tween(this.formas[forma].scale).to({x:0.6,y:0.6},1000, Phaser.Easing.Linear.None, true);
                        this.sound.play(audio).onStop.addOnce(function(){//5
                            this.add.tween(this.formas[forma].scale).to({x:0.4,y:0.4},200, Phaser.Easing.Linear.None, true).onComplete.add(function(){//6
                                this.enableEventMouse();
                            },this)//6
                        },this);//5
                    },this);//4
                },this);//3
            },this);//2
        },this);//1
    
    },

    level2:function(){

        var forma = this.id_forma[0];
        var audio = "A"+this.formas[forma].name;
        //var elem = this.formas[forma];

        //console.log("forma: "+forma);
        //console.log("audio: "+audio);
        //console.log("elem: "+elem);

        this.add.tween(this.formas[forma].scale).to({x:0.6,y:0.6},1000, Phaser.Easing.Linear.None, true);
        this.sound.play(audio).onStop.addOnce(function(){//1
            this.add.tween(this.formas[forma].scale).to({x:0.4,y:0.4},200, Phaser.Easing.Linear.None, true).onComplete.add(function(){//2
                forma = this.id_forma[1];
                audio = "A"+this.formas[forma].name;
                this.add.tween(this.formas[forma].scale).to({x:0.6,y:0.6},1000, Phaser.Easing.Linear.None, true);
                this.sound.play(audio).onStop.addOnce(function(){//3
                    this.add.tween(this.formas[forma].scale).to({x:0.4,y:0.4},200, Phaser.Easing.Linear.None, true).onComplete.add(function(){//4
                        forma = this.id_forma[2];
                        audio = "A"+this.formas[forma].name;
                        this.add.tween(this.formas[forma].scale).to({x:0.6,y:0.6},1000, Phaser.Easing.Linear.None, true);
                        this.sound.play(audio).onStop.addOnce(function(){//5
                            this.add.tween(this.formas[forma].scale).to({x:0.4,y:0.4},200, Phaser.Easing.Linear.None, true).onComplete.add(function(){//6
                                forma = this.id_forma[3];
                                audio = "A"+this.formas[forma].name;
                                this.add.tween(this.formas[forma].scale).to({x:0.6,y:0.6},1000, Phaser.Easing.Linear.None, true);
                                this.sound.play(audio).onStop.addOnce(function(){//7
                                    this.add.tween(this.formas[forma].scale).to({x:0.4,y:0.4},200, Phaser.Easing.Linear.None, true).onComplete.add(function(){//8
                                        this.enableEventMouse();
                                   },this)//8
                                },this);//7
                            },this)//6
                        },this);//5
                    },this);//4
                },this);//3
            },this);//2
        },this);//1
    },


    level3:function(){

        var forma = this.id_forma[0];
        var audio = "A"+this.formas[forma].name;
        //var elem = this.formas[forma];

        //console.log("forma: "+forma);
        //console.log("audio: "+audio);
        //console.log("elem: "+elem);

        this.add.tween(this.formas[forma].scale).to({x:0.6,y:0.6},1000, Phaser.Easing.Linear.None, true);
        this.sound.play(audio).onStop.addOnce(function(){//1
            this.add.tween(this.formas[forma].scale).to({x:0.4,y:0.4},200, Phaser.Easing.Linear.None, true).onComplete.add(function(){//2
                forma = this.id_forma[1];
                audio = "A"+this.formas[forma].name;
                this.add.tween(this.formas[forma].scale).to({x:0.6,y:0.6},1000, Phaser.Easing.Linear.None, true);
                this.sound.play(audio).onStop.addOnce(function(){//3
                    this.add.tween(this.formas[forma].scale).to({x:0.4,y:0.4},200, Phaser.Easing.Linear.None, true).onComplete.add(function(){//4
                        forma = this.id_forma[2];
                        audio = "A"+this.formas[forma].name;
                        this.add.tween(this.formas[forma].scale).to({x:0.6,y:0.6},1000, Phaser.Easing.Linear.None, true);
                        this.sound.play(audio).onStop.addOnce(function(){//5
                            this.add.tween(this.formas[forma].scale).to({x:0.4,y:0.4},200, Phaser.Easing.Linear.None, true).onComplete.add(function(){//6
                                forma = this.id_forma[3];
                                audio = "A"+this.formas[forma].name;
                                this.add.tween(this.formas[forma].scale).to({x:0.6,y:0.6},1000, Phaser.Easing.Linear.None, true);
                                this.sound.play(audio).onStop.addOnce(function(){//7
                                    this.add.tween(this.formas[forma].scale).to({x:0.4,y:0.4},200, Phaser.Easing.Linear.None, true).onComplete.add(function(){//8
                                        forma = this.id_forma[4];
                                        audio = "A"+this.formas[forma].name;
                                        this.add.tween(this.formas[forma].scale).to({x:0.6,y:0.6},1000, Phaser.Easing.Linear.None, true);
                                        this.sound.play(audio).onStop.addOnce(function(){//9
                                            this.add.tween(this.formas[forma].scale).to({x:0.4,y:0.4},200, Phaser.Easing.Linear.None, true).onComplete.add(function(){//10
                                                this.enableEventMouse();
                                            },this)//10
                                    },this);//9
                                   },this)//8
                                },this);//7
                            },this)//6
                        },this);//5
                    },this);//4
                },this);//3
            },this);//2
        },this);//1
    },

    enableEventMouse:function(){
        console.log("***enableEventMouse***");
        //elem.inputEnabled = true;
        //elem.input.useHandCursor = true;
        //elem.events.onInputDown.add(this.mouseInputDown, this); // click no mouse 
        tam =4;
        for(i=0; i<tam; i++){  
            console.log("button "+i); 
            this.formas[i].click = true;     
            this.formas[i].inputEnabled = true;
            this.formas[i].useHandCursor = true;
            this.formas[i].events.onInputDown.add(this.mouseInputDown, this); // click no mouse 
        }
    },

    disableEventMouse:function(elem){
        console.log("***disableEventMouse***");
        elem.click = false;
        elem.inputEnabled = false;
        elem.input.useHandCursor = false;
        elem.input.reset();
    },

    disableEventMouseAll:function(){
        console.log("***disableEventMouse***");
        //elem.inputEnabled = false;
        //elem.input.useHandCursor = false;
        //elem.input.reset();

        tam = 4;
        for(i=0; i<tam; i++){ 
            this.formas[i].click = false;             
            this.formas[i].inputEnabled = false;
            this.formas[i].input.useHandCursor = false;
            this.formas[i].input.reset();
        }
    },


    mouseInputDown:function(elem){
        console.log("***mouseInputDown***");
        if(elem.click){
            //this.disableEventMouse(elem);
            //elem.click = false;
            this.add.tween(elem.scale).to({x:0.6,y:0.6}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(elem.scale).to({x:0.4,y:0.4}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    // logica do jogo
                    this.checkGame(elem);
                },this);
            },this);
        }
    },

    
    
    checkGame:function(elem){
        console.log("***checkGame***");

        if(elem.name == this.itens[this.num_click]){
            this.num_click++;
            this.num_acertos++;
            console.log("CORRETA");
            this.sound.play("hitAcerto");
            this.changeHappy(this.polly,"anim_polly_happy","anim_polly",205,441,204,443);
            if(this.num_acertos==this.quant_formas){
                this.disableEventMouseAll();
                this.createDelayTime(200, function() {
                    this.clickRightButton();
                });
            }   
        }else{
            console.log("ERRADA");
            this.sound.play("hitErro");
            if(this.num_erros==1){
                this.disableEventMouseAll();
                this.createDelayTime(200, function() {
                    this.clickWrongButton();
                });
            }
            this.num_erros++;
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





