/**
* @version    1.0.2
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
            

        this.TEMPO_INTRO = 8500;
        this.ENABLE_CALL_TO_ACTION = true; // enibe o show call to action


        // quantidade de perguntas que tem em cada nivel
        this.totalLevel1 = 1;
        this.totalLevel2 = 1;
        this.totalLevel3 = 2;

        // quantidade total de erros permitido em cada nivel
        // ex: se valor está definido para 2 erros, usuario pode errar 2x e na terceira é considerado errado
        this.totalErro1 = 0;
        this.totalErro2 = 0;
        this.totalErro3 = 0;

        /*****************************************************************/
        
        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

        //BasicGame.Game.Cenario.create(this.game);
        //BasicGame.Game.Cenario.gradeGuia(this.world.width,this.world.height);

        this.groupLevel = [null,1,2,3];
        this.resetRandom();
        this.createScene();
        this.showIntro();

        

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();

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

        var t1 = "Conecturma, o Bumba se lembrou \nde quando ele guardava dinheiro \nno seu cofre de porquinho...";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 22, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var kim = this.showKim(this.TEMPO_INTRO);

        
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);

        this.createDelayTime(this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
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

        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
    },

    /**
    *
    * Esconde o texto da pergunta quando tiver e esconde a placa que mostra o texto.
    * Ao final do efeito executa a função {callback} se houver
    * 
    **/
    hideLevel: function(callback) {
        if(this.imageQuestion == null) {
            return;
        }

        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        if(callback != null) {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
        } else {
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
        console.log("*** hideAndShowLevel ***");
        this.hideLevel(function() {
           
            if(this.currentLevel <= 3 && this.corrects <= 2) {
                if(this.showCallToAction){
                    this.showNextLevel();
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
            this.createDelayTime(500, this.gotoNextLevel);
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

        this.add.sprite( -417, -800, 'background');
        
          
        this.bumba = this.add.sprite(43, 196, 'bumba',1);
        this.bumba.animations.add('bumba');
        this.bumba.animations.play('bumba', 15, true);
        
        this.add.sprite(-475,-336, 'frente_cenario');
        //var x1 = BasicGame.Game.Cenario.addSpriteMeu('frente_cenario',300,300);

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
        var t1 = "E só podia guardar moedas se provasse que \npodia somar o valor de duas delas. \nVejam só: se Bumba tem 25 centavos e \nganha mais 10, ele fica com... \n35 centavos! ";
        this.tutorialText = this.drawText(this.world.centerX, 50, t1, 22, "left");
        this.tutorialText.alpha = 0;
        this.groupIntro.add(this.tutorialText);

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.imagens  = [];
         posicao = new Array([436,302],[573,302],[708,202],[842,202]);

        this.imagens[0] = this.add.sprite(posicao[0][0],posicao[0][1], 'moedas',3);
        this.imagens[0]. id = true;
        this.imagens[0].alpha = 0;

        this.imagens[1] = this.add.sprite(posicao[1][0],posicao[1][1], 'moedas',0);
        this.imagens[1]. id = true;
        this.imagens[1].alpha = 0;

        this.groupIntro.add(this.imagens[0]);
        this.groupIntro.add(this.imagens[1]);

        this.createDelayTime(9000, function() {
           this.imagens[0].alpha = 1;
        }); 
        this.createDelayTime(12000, function() {
            this.imagens[1].alpha = 1;
            
        }); 

        this.createDelayTime(14000, function() {
            this.tutorial();
        }); 
    },
    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showFinishedLiveTutorial:function() {
        this.createDelayTime(1000, function() {
           this.FinishedLiveTutorial(); 
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

        var textList = [ 
            "Não é dificil somar moedas de centavos,basta  \nprestar atenção.Se temos [25 centavos de real] \ne ganhamos uma moeda de [50 centavos], \nnós temos [75 centavos de real]!",
            "Vamos somar: [25 + 50 = 75]!"
    
           
        ];

        var tutorialText = this.drawText(500,50, textList[0], 22, "left");
        tutorialText.alpha = 0;
       
        this.groupIntro.add(tutorialText);

        var tutorialText6 = this.drawText(500,20, textList[1], 22, "left");
        tutorialText6.alpha = 0;
       
        this.groupIntro.add(tutorialText6);


        var tutorialText1 = this.add.sprite(this.world.centerX-200,150, 'moedas',3);
        tutorialText1.alpha = 0;
        tutorialText1.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText1);

        var tutorialText2 = this.add.sprite(this.world.centerX-100,150, 'mais');
        tutorialText2.alpha = 0;
        tutorialText2.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText2);

        var tutorialText3 = this.add.sprite(this.world.centerX,150, 'moedas',4);
        tutorialText3.alpha = 0;
        tutorialText3.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText3);

        var tutorialText4 = this.add.sprite(this.world.centerX+100,150, 'igual');
        tutorialText4.alpha = 0;
        tutorialText4.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText4);

        var tutorialText5 = this.add.sprite(this.world.centerX+200,150, '75');
        tutorialText5.alpha = 0;
        tutorialText5.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText5);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.createDelayTime(19000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(tutorialText1).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(tutorialText6).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
            },this);
        });
        this.createDelayTime(20000, function() {
            this.add.tween(tutorialText2).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
           
        });
        this.createDelayTime(21000, function() {
            this.add.tween(tutorialText3).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
           
        });
        this.createDelayTime(23000, function() {
            this.add.tween(tutorialText4).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
           
        });
        this.createDelayTime(24000, function() {
            this.add.tween(tutorialText5).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
           
        });

        
        //this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.setDebugAudio("soundResumo");

        this.soundResumo.onStop.addOnce(function(){
           this.add.tween(tutorialText1).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(tutorialText2).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(tutorialText3).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(tutorialText4).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(tutorialText5).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(tutorialText6).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
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

        var levelNum = this.verifyCurrentLevel();

        switch(levelNum) {
            case 1:

                this.showQuestion(1);
                this.initLevel1();
                if(this.showCallToAction) {
                    this.createDelayTime(3000, function() {
                        this.level();
                    });   
                } else {
                    this.sound.play("soundP1").onStop.addOnce(this.level, this);
                }
            break;
            case 2:

                this.showQuestion(2);
                this.initLevel2();
                if(this.showCallToAction) {
                    this.createDelayTime(3000, function() {
                        this.level();
                    });
                } else {
                    this.sound.play("soundP1").onStop.addOnce(this.level, this);
                }
            break;
            case 3:

                this.showQuestion(3);
                this.initLevel3();
                if(this.showCallToAction) {
                    this.createDelayTime(3000, function() {
                        this.level();
                    });
                } else {
                    this.sound.play("soundP1").onStop.addOnce(this.level, this);
                }
            break;
            case 4:

                this.showQuestion(3);
                this.initLevel4();
                if(this.showCallToAction) {
                this.level();
                } else {
                    this.sound.play("soundP1").onStop.addOnce(this.level, this);
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

        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        var questionList = [ null,
            "Essa moeda… mais essa moeda… \ndá quantos centavos? Cliquem!",
            "Essa moeda… mais essa moeda… \ndá quantos centavos? Cliquem!",
            "Essa moeda… mais essa moeda… \ndá quantos centavos? Cliquem!"
        ];

        this.imageQuestion = this.drawText(this.world.centerX, 50, questionList[num]);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    
    initLevel1: function() {
        console.log("*** initLevel1 ***");
        console.log("corretos "+this.corrects);
        
        this.groupLevel[this.currentLevel] = this.add.group();
        
        this.elementos = 2;

        posicao = new Array([436,202],[573,202],[708,202],[842,202]);
        posicao_num = [0,1];
        auxiliar = [+5,-5,+10,-10];

        itens_reais = [0,3,5];
        valor = [10,1,100,25,50,5];
        
        this.temp_array = itens_reais.slice();
        item = this.sorteio();
        itens_reais = this.temp_array.slice();

        this.temp_array = itens_reais.slice();
        item1 = this.sorteio();
        itens_reais = this.temp_array.slice();

        this.resultado = valor[item] + valor[item1];

        //console.log(this.resultado);

        this.temp_array = auxiliar.slice();
        bnt = this.resultado + this.sorteio();
        auxiliar = this.temp_array.slice();

        this.temp_array = auxiliar.slice();
        bnt1 = this.resultado + this.sorteio();
        auxiliar = this.temp_array.slice();
        this.botoes  = [bnt,bnt1,this.resultado];
        
        this.botoesimg  = [];
        this.imagens  = [];

        this.imagens[0] = this.add.sprite(posicao[0][0],posicao[0][1], 'moedas',item);
        this.imagens[0]. id = true;
        this.imagens[0].alpha = 0;

        this.imagens[1] = this.add.sprite(posicao[1][0],posicao[1][1], 'moedas',item1);
        this.imagens[1]. id = true;
        this.imagens[1].alpha = 0;

        this.groupLevel[this.currentLevel].add(this.imagens[0]);
        this.groupLevel[this.currentLevel].add(this.imagens[1]);

        this.createDelayTime(900, function() {
           this.imagens[0].alpha = 1;
        }); 
        this.createDelayTime(3000, function() {
            this.imagens[1].alpha = 1;
        }); 

    },

    initLevel2: function() {
        console.log("*** initLevel2 ***"); 
        console.log("corretos "+this.corrects);
        
        this.groupLevel[this.currentLevel] = this.add.group();
    
        this.elementos = 2;

        posicao = new Array([436,202],[573,202],[708,202],[842,202]);
        posicao_num = [0,1];
        auxiliar = [-5,-10];

        itens_reais = [0,3,4,5];
        valor = [10,1,100,25,50,5];
        
        this.temp_array = itens_reais.slice();
        item = this.sorteio();
        itens_reais = this.temp_array.slice();

        this.temp_array = itens_reais.slice();
        item1 = this.sorteio();
        itens_reais = this.temp_array.slice();

        this.resultado = valor[item] + valor[item1];

        //console.log(this.resultado);

        this.temp_array = auxiliar.slice();
        bnt = this.resultado + this.sorteio();
        auxiliar = this.temp_array.slice();

        this.temp_array = auxiliar.slice();
        bnt1 = this.resultado + this.sorteio();
        auxiliar = this.temp_array.slice();
        this.botoes  = [bnt,bnt1,this.resultado];
        
        this.botoesimg  = [];
        this.imagens  = [];

        this.imagens[0] = this.add.sprite(posicao[0][0],posicao[0][1], 'moedas',item);
        this.imagens[0]. id = true;
        this.imagens[0].alpha = 0;

        this.imagens[1] = this.add.sprite(posicao[1][0],posicao[1][1], 'moedas',item1);
        this.imagens[1]. id = true;
        this.imagens[1].alpha = 0;

        this.groupLevel[this.currentLevel].add(this.imagens[0]);
        this.groupLevel[this.currentLevel].add(this.imagens[1]);


        this.createDelayTime(900, function() {
           this.imagens[0].alpha = 1;
        }); 
        this.createDelayTime(3000, function() {
            this.imagens[1].alpha = 1;
        }); 

    },

    initLevel3: function() {
        console.log("*** initLevel3 - 1***");
        console.log("corretos "+this.corrects);

        this.groupLevel[this.currentLevel] = this.add.group();
        this.elementos = 2;

        posicao = new Array([436,202],[573,202],[708,202],[842,202]);
        posicao_num = [0,1];
        auxiliar = [-5,-10];

        itens_reais = [3,4];
        valor = [10,1,100,25,50,5];
        
        this.temp_array = itens_reais.slice();
        item = this.sorteio();
        itens_reais = this.temp_array.slice();

        this.temp_array = itens_reais.slice();
        item1 = this.sorteio();
        itens_reais = this.temp_array.slice();

        this.resultado = valor[item] + valor[item1];

        //console.log(this.resultado);

        this.temp_array = auxiliar.slice();
        bnt = this.resultado + this.sorteio();
        auxiliar = this.temp_array.slice();

        this.temp_array = auxiliar.slice();
        bnt1 = this.resultado + this.sorteio();
        auxiliar = this.temp_array.slice();
        this.botoes  = [bnt,bnt1,this.resultado];
        
        this.botoesimg  = [];
        this.imagens  = [];

        this.imagens[0] = this.add.sprite(posicao[0][0],posicao[0][1], 'moedas',item);
        this.imagens[0]. id = true;
        this.imagens[0].alpha = 0;

        this.imagens[1] = this.add.sprite(posicao[1][0],posicao[1][1], 'moedas',item1);
        this.imagens[1]. id = true;
        this.imagens[1].alpha = 0;

        this.groupLevel[this.currentLevel].add(this.imagens[0]);
        this.groupLevel[this.currentLevel].add(this.imagens[1]);


        this.createDelayTime(900, function() {
           this.imagens[0].alpha = 1;
        }); 
        this.createDelayTime(3000, function() {
            this.imagens[1].alpha = 1;
        }); 
    
    },

    initLevel4: function() {
        console.log("*** initLevel3 - 2 ***");
        console.log("corretos "+this.corrects);
        
        this.groupLevel[this.currentLevel] = this.add.group();
        
        this.elementos = 2;

        posicao = new Array([436,202],[573,202],[708,202],[842,202]);
        posicao_num = [0,1];
        auxiliar = [-5,-10];

        itens_reais = [0,3];
        valor = [10,1,100,25,50,5];
        
        this.temp_array = itens_reais.slice();
        item = this.sorteio();
        itens_reais = this.temp_array.slice();

        this.temp_array = itens_reais.slice();
        item1 = this.sorteio();
        itens_reais = this.temp_array.slice();

        this.resultado = valor[item] + valor[item1];

        //console.log(this.resultado);

        this.temp_array = auxiliar.slice();
        bnt = this.resultado + this.sorteio();
        auxiliar = this.temp_array.slice();

        this.temp_array = auxiliar.slice();
        bnt1 = this.resultado + this.sorteio();
        auxiliar = this.temp_array.slice();
        this.botoes  = [bnt,bnt1,this.resultado];
        
        this.botoesimg  = [];
        this.imagens  = [];

        this.imagens[0] = this.add.sprite(posicao[0][0],posicao[0][1], 'moedas',item);
        this.imagens[0]. id = true;
        this.imagens[0].alpha = 0;

        this.imagens[1] = this.add.sprite(posicao[1][0],posicao[1][1], 'moedas',item1);
        this.imagens[1]. id = true;
        this.imagens[1].alpha = 0;

        this.groupLevel[this.currentLevel].add(this.imagens[0]);
        this.groupLevel[this.currentLevel].add(this.imagens[1]);


        this.createDelayTime(900, function() {
           this.imagens[0].alpha = 1;
        }); 
        this.createDelayTime(3000, function() {
            this.imagens[1].alpha = 1;
        });  
    },

    /**
    *
    * Controle de Perguntas, que serão mostradas no jogo
    * 
    **/
    createButton: function( x, y, imagem, right, canInteract) {

        var _canInteract = (canInteract==null||canInteract==undefined) ? true : false;
        
        var btn;
        if(right) {

            btn = this.add.button(x,y, 'sprites', (_canInteract)?this.clickRightButton:null, this, imagem,imagem,imagem);
            btn.isCorrect = true;
            this.correctItem = btn;

        } else {
            btn = this.add.button(x,y, 'sprites', (_canInteract)?this.clickWrongButton:null, this, imagem,imagem,imagem);

        }

        btn.anchor.set(0.5,1);
        btn.alpha = 0;
        btn.scale.set(0.5,0.5);

        if(_canInteract) {
            btn.onInputOver.add(this.onButtonOver, this);
            btn.onInputOut.add(this.onButtonOut, this);
        }

        this.add.tween(btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(btn.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            if(_canInteract) {
                btn.input.useHandCursor = true;
            }
        }, this);

        return btn;
    },
    

    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção CORRETA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickRightButton: function(target) {
        this.onPlayerSuccess();
        this.showCorrectName(true);
       
    },
    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção ERRADA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickWrongButton: function(target) {
        //if(target != null && target.alpha < 1) {
            ///return;
        //}
        this.showCallToAction = true;
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
                this.hideLevel(function() {
                    this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
                });
            break;
            case 0: // toca som de resumo
                this.lives = 0;
                this.hideLevel();
                this.showResumo();
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

    /**
    *
    * Função Auxiliar disparada quando o jogador acerta a pergunta.
    * 
    **/
    createAnimationCorrect: function(target) {
        
        console.log(this.correctItem);

        var t = this.add.tween(this.correctItem)
                    .to({x:this.world.centerX-450 + this.verifyCurrentLevel()*200, y: 250}, 1300, Phaser.Easing.Linear.None)
                    .to({y: 290}, 200, Phaser.Easing.Linear.None);
        t.start();
    },

    ///-------------------AV2UD7OA05----------------------------//
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
        anim.play(15);
    },

    changeIdlle:function(elem,anim,x,y){
        elem.loadTexture(anim, 0);
        elem.x = x;
        elem.y = y;
        elem.animations.add(anim);
        elem.animations.play(anim, 15, true);
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

    enableClick:function(modo,array_elem,elem){ // habilidar e dasabilitar o click em uma imagem
        switch(modo)
        {
            case 0:// habilitar o click em todos 
                for(var i=0; i<array_elem.length;i++)
                {     
                    array_elem[i].inputEnabled = true;
                    array_elem[i].input.useHandCursor = true;
                    array_elem[i].events.onInputDown.add(this.mouseInputDown, this);
                }
            break;
            case 1:// habilitar o click em todos 
                elem.inputEnabled = true;
                elem.input.useHandCursor = true;
                elem.events.onInputDown.add(this.mouseInputDown, this);
            break;
            case 2:// desabilitar o click em todos 
                for(var i=0; i<array_elem.length;i++){

                    array_elem[i].inputEnabled = false;
                    array_elem[i].input.useHandCursor = false;
                    array_elem[i].events.onInputDown.removeAll();
                    array_elem[i].input.reset();
                }
            break;
            case 3:// desabilitar o click em um elemento
                elem.inputEnabled = false;
                elem.input.useHandCursor = false;
                elem.events.onInputDown.removeAll();
                elem.input.reset();
            break;
        }   
    },

    mouseInputDown:function(elem){
        console.log("*** mouseInputDown ***");
        console.log(elem.name);

        if(elem.name== this.resultado){
            console.log("correto");
            this.enableClick(2,this.botoesimg,null);
            this.sound.play("hitAcerto");
            this.changeHappy(this.bumba,"bumba_happy","bumba",13,196,43,196); 
            this.add.tween(elem.scale).to({x:0.7,y:0.7},500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                this.add.tween(elem.scale).to({x:1,y:1},500, Phaser.Easing.Linear.None, true)
            }, this);

            this.createDelayTime(1200, function() {
                    this.resetLevel(this.currentLevel);
            }); 
            this.createDelayTime(1500, function() {
                    this.clickRightButton();  
            }); 
        }else{
            console.log("errado");
            this.enableClick(2,this.botoesimg,null);
            this.sound.play("hitErro");
            this.createDelayTime(1200, function() {
                    this.resetLevel(this.currentLevel);
            });
            this.createDelayTime(1500, function() {
                this.clickWrongButton();  
            }); 
        }
    },

    tutorial:function(){
      
        posicaoBtn = new Array([400,430],[550,430],[700,430]);
        this.botoesimg = [];
        this.botoesimg[0] = this.add.sprite(posicaoBtn[0][0],posicaoBtn[0][1], 'numeros',"10");
        this.botoesimg[0].alpha = 0;

        this.botoesimg[1] = this.add.sprite(posicaoBtn[1][0],posicaoBtn[1][1], 'numeros',"20");
        this.botoesimg[1].alpha = 0;

        this.botoesimg[2] = this.add.sprite(posicaoBtn[2][0],posicaoBtn[2][1], 'numeros',"35");
        this.botoesimg[2].alpha = 0;

        this.groupIntro.add(this.botoesimg[0]);
        this.groupIntro.add(this.botoesimg[1]);
        this.groupIntro.add(this.botoesimg[2]);

        this.arrow = this.add.sprite(510,390, 'arrow');
        this.arrow.alpha =1;

        this.click = this.add.sprite(0, 0, "clickAnimation");
        this.click.animations.add('idle', null, 18, true);
        this.click.alpha = 0;

        this.groupIntro.add(this.arrow);
        this.groupIntro.add(this.click);

        this.add.tween(this.botoesimg[0]).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.botoesimg[1]).to({alpha:1}, 1000, Phaser.Easing.Linear.None, true);
        this.add.tween(this.botoesimg[2]).to({alpha:1}, 1500, Phaser.Easing.Linear.None, true);

        this.createDelayTime(2000, function() {
            x = this.botoesimg[2].x+35;
            y = this.botoesimg[2].y+5;
            this.add.tween(this.arrow).to({x:x,y:y}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.animClick();
                this.changeHappy(this.bumba,"bumba_happy","bumba",13,196,43,196); 
                this.add.tween(this.botoesimg[2].scale).to({x:0.7,y:0.7},500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                    this.add.tween(this.botoesimg[2].scale).to({x:1,y:1},500, Phaser.Easing.Linear.None, true)
                }, this);  
            },this);
        }); 

         this.createDelayTime(11000, function() {
                    this.showFinishedLiveTutorial();
            }); 
    },
    animClick:function(prox,img){
        this.click.x = this.arrow.x;
        this.click.y = this.arrow.y;
        this.click.alpha = 1;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;
            this.arrow.alpha = 0;
        }, this);
    },
    FinishedLiveTutorial:function(){
        this.time.events.removeAll();
        this.tweens.removeAll();

        if(this.soundIntro != null) {
            this.soundIntro.stop();
        }

        if(this.tutorialPlacar) {
            this.add.tween(this.tutorialPlacar).to({y: -300}, 400, Phaser.Easing.Linear.None, true, 200);
        }

        this.add.tween(this.groupIntro).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
    },

    level:function(){

        //console.log(this.botoes);
        this.botoes.sort(function() {
          return .5 - Math.random();
        });
        //console.log(this.botoes);
        //console.log(this.botoes[0]);
        //console.log(this.botoes[1]);
        //console.log(this.botoes[2]);

        posicaoBtn = new Array([400,400],[550,400],[700,400]);

        this.botoesimg[0] = this.add.sprite(posicaoBtn[0][0],posicaoBtn[0][1], 'numeros',this.botoes[0].toString());
        this.botoesimg[0].name = this.botoes[0];
        this.botoesimg[0].alpha = 0;

        this.botoesimg[1] = this.add.sprite(posicaoBtn[1][0],posicaoBtn[1][1], 'numeros',this.botoes[1].toString());
        this.botoesimg[1].name = this.botoes[1];
        this.botoesimg[1].alpha = 0;

        this.botoesimg[2] = this.add.sprite(posicaoBtn[2][0],posicaoBtn[2][1], 'numeros',this.botoes[2].toString());
        this.botoesimg[2].name = this.botoes[2];
        this.botoesimg[2].alpha = 0;

        this.groupLevel[this.currentLevel].add(this.botoesimg[0]);
        this.groupLevel[this.currentLevel].add(this.botoesimg[1]);
        this.groupLevel[this.currentLevel].add(this.botoesimg[2]);

        this.add.tween(this.botoesimg[0]).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.botoesimg[1]).to({alpha:1}, 1000, Phaser.Easing.Linear.None, true);
        this.add.tween(this.botoesimg[2]).to({alpha:1}, 1500, Phaser.Easing.Linear.None, true);

        this.createDelayTime(1500, function() {
            this.enableClick(0,this.botoesimg,null);
        }); 
    },

    render:function(){
        //BasicGame.Game.Cenario.render();
    },
    update:function(){
        //this.updateTimer();
    }



};





