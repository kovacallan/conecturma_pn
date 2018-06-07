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
            

        this.TEMPO_INTRO = 23000;
        this.ENABLE_CALL_TO_ACTION = true; // enibe o show call to action


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
        
        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

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

        var t1 = "BUMBA COMENTOU QUE NO MUNDO REAL SE \nUSA [CÉDULAS E MOEDAS] PARA COMPRAR \nPÃO, PAGAR PASSAGEM DE METRÔ, ENTRE \nOUTRAS COISAS.";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 22, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t2 = "BOITATÁ EXPLICOU QUE NA FLORESTA \nA MÃE NATUREZA DÁ TUDO EM \nTROCA DE CUIDADOS, MAS FICOU \nCURIOSO PRA CONHECER NOSSO DINHEIRO.";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t2, 22, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var kim = this.showKim(this.TEMPO_INTRO);

        
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);


        this.createDelayTime(12000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                 this.add.tween(tutorialText1).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
            }, this);
        });
        this.createDelayTime(this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText1).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
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

        this.add.sprite( -697, -1148, 'background');
          
        this.bumba = this.add.sprite(43, 196, 'bumba',1);
        this.bumba.animations.add('bumba');
        this.bumba.animations.play('bumba', 15, true);

        this.boitata = this.add.sprite(54, 312, 'boitata',1);
        this.boitata.animations.add('boitata');
        this.boitata.animations.play('boitata', 15, true);
        
        this.add.sprite(-275,-207, 'frente_cenario');

        //this.initGame();
        //this.showResumo();

    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {

        var t1 = "NOSSAS [CÉDULAS DE REAL] SÃO ESSAS… \nVIRAM SÓ? GRAVARAM?";
        this.tutorialText = this.drawText(this.world.centerX, 70, t1, 22, "left");
        this.tutorialText.alpha = 0;
        this.groupIntro.add(this.tutorialText);

        var t2 = "E NOSSAS [MOEDAS DE REAL] SÃO ESSAS AQUI… \nOLHEM SÓ, PRESTEM ATENÇÃO… E VAMOS LÁ!";
        this.tutorialText1 = this.drawText(this.world.centerX, 70, t2, 22, "left");
        this.tutorialText1.alpha = 0;
        this.groupIntro.add(this.tutorialText1);

        this.add.tween(this.tutorialText).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true).onComplete.add(this.showCedulas,this);
        
       
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
            "PARA COMPRARMOS COISAS NO NOSSO PAÍS USAMOS \nCÉDULAS E MOEDAS. ELAS SÃO CHAMADAS DE REAL.",
            "AS CÉDULAS DE REAL SÃO ESTAS:\n[2 REAIS, 5, 10, 20, 50 E 100 REAIS].",
            "AS MOEDAS SÃO ESSAS: \n[1 CENTAVO, 5, 10, 25, 50 CENTAVOS E 1 REAL]."
           
        ];

        var tutorialText = this.drawText(500, 70, textList[0], 22, "left");
        tutorialText.alpha = 0;
       
        this.groupIntro.add(tutorialText);

        var tutorialText1 = this.drawText(500, 10, textList[1], 22, "left");
        tutorialText1.alpha = 0;
       
        this.groupIntro.add(tutorialText1);

        var tutorialText2 = this.add.sprite(this.world.centerX,150, 'imgResumo');
        tutorialText2.alpha = 0;
        tutorialText2.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText2);

        var tutorialText3 = this.drawText(500, 10, textList[2], 22, "left");
        tutorialText3.alpha = 0;
       
        this.groupIntro.add(tutorialText3);

        var tutorialText4 = this.add.sprite(this.world.centerX,140, 'imgResumo1');
        tutorialText4.alpha = 0;
        tutorialText4.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText4);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.createDelayTime(9000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(tutorialText1).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(tutorialText2).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
            },this);
        });

        this.createDelayTime(21000, function() {
            this.add.tween(tutorialText2).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText1).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(tutorialText3).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
                this.add.tween(tutorialText4).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
            },this);
        });

       
        //this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.setDebugAudio("soundResumo");

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(tutorialText3).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText4).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
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

        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        var questionList = [ null,
            "CLIQUEM SOMENTE NAS CÉDULAS DE REAL!",
            "CLIQUEM SOMENTE NAS CÉDULAS DE REAL!",
            "CLIQUEM NAS MOEDAS E CÉDULAS DE REAL!"
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
        this.groupLevel[this.currentLevel] = this.add.group();
        this.acertos = 2;
        this.elementos = 3;

        posicao = new Array([300,200],[520,200],[770,200],[632,398],[780,388]);
        posicao_num = [0,1,2];

        itens_reais = [0,1,2,3,4,5,6];
        itens_outras = [0,1,2,3,4,5,6,7,8,9,10,11];

        this.temp_array = itens_reais.slice();
        item = this.sorteio();
        itens_reais = this.temp_array.slice();

        this.temp_array = posicao_num.slice();
        pos = this.sorteio();
        posicao_num = this.temp_array.slice();

        this.temp_array = itens_reais.slice();
        item1 = this.sorteio();
        itens_reais = this.temp_array.slice();

        this.temp_array = posicao_num.slice();
        pos1 = this.sorteio();
        posicao_num = this.temp_array.slice();

        this.temp_array = itens_outras.slice();
        item2 = this.sorteio();
        itens_outras = this.temp_array.slice();

        this.temp_array = posicao_num.slice();
        pos2 = this.sorteio();
        posicao_num = this.temp_array.slice();

        this.imagens  = [];

        this.imagens[0] = this.add.sprite(posicao[pos][0],posicao[pos][1], 'cedulas',item);
        this.imagens[0]. id = true;
        this.imagens[0].alpha = 0;

        this.imagens[1] = this.add.sprite(posicao[pos1][0],posicao[pos1][1], 'cedulas',item1);
        this.imagens[1]. id = true;
        this.imagens[1].alpha = 0;

        this.imagens[2] = this.add.sprite(posicao[pos2][0],posicao[pos2][1], 'outras',item2);
        this.imagens[2]. id = false;
        this.imagens[2].alpha = 0;

        time = [500,1000,1500];

        for(i=0;i<this.elementos;i++){
            this.add.tween(this.imagens[i]).to({alpha:1},time[i], Phaser.Easing.Linear.None, true);
            this.groupLevel[this.currentLevel].add(this.imagens[i]);
        }



        this.createDelayTime(1500, function() {
            this.enableClick(0,this.imagens,null);
        }); 
    },

    initLevel2: function() {
        console.log("*** initLevel2 ***"); 
        this.groupLevel[this.currentLevel] = this.add.group();
        this.acertos = 2;
        this.elementos = 4;

        posicao = new Array([300,200],[520,200],[770,200],[520,330],[770,330]);
        posicao_num = [0,1,2,3];

        itens_reais = [0,1,2,3,4,5,6];
        itens_outras = [0,1,2,3,4,5,6,7,8,9,10,11];
        
        this.temp_array = itens_reais.slice();
        item = this.sorteio();
        itens_reais = this.temp_array.slice();

        this.temp_array = posicao_num.slice();
        pos = this.sorteio();
        posicao_num = this.temp_array.slice();

        this.temp_array = itens_reais.slice();
        item1 = this.sorteio();
        itens_reais = this.temp_array.slice();

        this.temp_array = posicao_num.slice();
        pos1 = this.sorteio();
        posicao_num = this.temp_array.slice();

        this.temp_array = itens_outras.slice();
        item2 = this.sorteio();
        itens_outras = this.temp_array.slice();

        this.temp_array = posicao_num.slice();
        pos2 = this.sorteio();
        posicao_num = this.temp_array.slice();

        this.temp_array = itens_outras.slice();
        item3 = this.sorteio();
        itens_outras = this.temp_array.slice();

        this.temp_array = posicao_num.slice();
        pos3 = this.sorteio();
        posicao_num = this.temp_array.slice();

        this.imagens  = [];

        this.imagens[0] = this.add.sprite(posicao[pos][0],posicao[pos][1], 'cedulas',item);
        this.imagens[0]. id = true;
        this.imagens[0].alpha = 0;

        this.imagens[1] = this.add.sprite(posicao[pos1][0],posicao[pos1][1], 'cedulas',item1);
        this.imagens[1]. id = true;
        this.imagens[1].alpha = 0;

        this.imagens[2] = this.add.sprite(posicao[pos2][0],posicao[pos2][1], 'outras',item2);
        this.imagens[2]. id = false;
        this.imagens[2].alpha = 0;

        this.imagens[3] = this.add.sprite(posicao[pos3][0],posicao[pos3][1], 'outras',item3);
        this.imagens[3]. id = false;
        this.imagens[3].alpha = 0;



        time = [100,500,1000,1500];

        for(i=0;i<this.elementos;i++){
            this.add.tween(this.imagens[i]).to({alpha:1},time[i], Phaser.Easing.Linear.None, true);
            this.groupLevel[this.currentLevel].add(this.imagens[i]);
        }

        this.createDelayTime(1500, function() {
            this.enableClick(0,this.imagens,null);
        });  
    },

    initLevel3: function() {
        console.log("*** initLevel3 ***");

        this.groupLevel[this.currentLevel] = this.add.group();
        this.acertos = 3;
        this.elementos = 5;

        posicao = new Array([300,200],[520,200],[770,200],[520,330],[770,330]);
        posicao_num = [0,1,2,3,4];

        itens_reais = [0,1,2,3];
        itens_outras = [0,1,2,3,4,5,6,7,8,9,10,11];
        

        nomedinheiro = ['moedas','cedulas'];
        arr_dinheiro = [0,1];

        this.temp_array = arr_dinheiro.slice();
        dinheiro = this.sorteio();
        arr_dinheiro = this.temp_array.slice();

        this.temp_array = arr_dinheiro.slice();
        dinheiro1 = this.sorteio();
        arr_dinheiro = this.temp_array.slice();

        //console.log(dinheiro1);
        //__________________1_________________
        this.temp_array = itens_reais.slice();
        item = this.sorteio();
        itens_reais = this.temp_array.slice();

        this.temp_array = posicao_num.slice();
        pos = this.sorteio();
        posicao_num = this.temp_array.slice();

        //__________________2_________________
        this.temp_array = itens_reais.slice();
        item1 = this.sorteio();
        itens_reais = this.temp_array.slice();

        this.temp_array = posicao_num.slice();
        pos1 = this.sorteio();
        posicao_num = this.temp_array.slice();

        //__________________3_________________
        this.temp_array = itens_reais.slice();
        item2 = this.sorteio();
        itens_reais = this.temp_array.slice();

        this.temp_array = posicao_num.slice();
        pos2 = this.sorteio();
        posicao_num = this.temp_array.slice();

        //__________________4_________________
        this.temp_array = itens_outras.slice();
        item3 = this.sorteio();
        itens_outras = this.temp_array.slice();

        this.temp_array = posicao_num.slice();
        pos3 = this.sorteio();
        posicao_num = this.temp_array.slice();

        //__________________5_________________
        this.temp_array = itens_outras.slice();
        item4 = this.sorteio();
        itens_outras = this.temp_array.slice();

        this.temp_array = posicao_num.slice();
        pos4 = this.sorteio();
        posicao_num = this.temp_array.slice();

        this.imagens  = [];

        this.imagens[0] = this.add.sprite(posicao[pos][0],posicao[pos][1], nomedinheiro[dinheiro],item);
        this.imagens[0]. id = true;
        this.imagens[0].alpha = 0;

        this.imagens[1] = this.add.sprite(posicao[pos1][0],posicao[pos1][1], nomedinheiro[dinheiro],item1);
        this.imagens[1]. id = true;
        this.imagens[1].alpha = 0;

        this.imagens[2] = this.add.sprite(posicao[pos2][0],posicao[pos2][1], nomedinheiro[dinheiro1],item2);
        this.imagens[2]. id = true;
        this.imagens[2].alpha = 0;

        this.imagens[3] = this.add.sprite(posicao[pos3][0],posicao[pos3][1], 'outras',item3);
        this.imagens[3]. id = false;
        this.imagens[3].alpha = 0;

        this.imagens[4] = this.add.sprite(posicao[pos4][0],posicao[pos4][1], 'outras',item4);
        this.imagens[4]. id = false;
        this.imagens[4].alpha = 0;

        time = [100,450,900,1200,1500];

        for(i=0;i<this.elementos;i++){
            this.add.tween(this.imagens[i]).to({alpha:1},time[i], Phaser.Easing.Linear.None, true);
            this.groupLevel[this.currentLevel].add(this.imagens[i]);
        }

        this.createDelayTime(1500, function() {
            this.enableClick(0,this.imagens,null);
        });  
    },

    /**
    *
    * Controle de Perguntas, que serão mostradas no jogo
    * 
    **/
    createButton: function( x, y, imagem, right, canInteract) {

        var _canInteract = (canInteract==null||canInteract==undefined) ? true : false;

        console.log(imagem, right);
        
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

        //if(target != null && target.alpha < 1) {
            //return;
        //}

        
        this.onPlayerSuccess();
        

        //this.sound.play("hitAcerto");
        //this.clearButtons(true);
        this.showCorrectName(true);
        //this.createAnimationCorrect(target);
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

    ///-------------------AV2UD7OA03----------------------------//
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
        console.log(elem.id);

        if(elem.id){
            if(this.acertos>0){this.acertos--;}
            console.log("acertou");
            this.enableClick(3,null,elem);//bloqueia elem
            
            this.sound.play("hitAcerto");
            this.changeHappy(this.bumba,"bumba_happy","bumba",13,196,43,196);
            this.changeHappy(this.boitata,"boitata_happy","boitata",54,312,54,312);
            this.add.tween(elem.scale).to({x:1.2,y:1.2},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(elem.scale).to({x:1,y:1},500, Phaser.Easing.Linear.None, true);
            },this);
            
            if(this.acertos==0){
                this.enableClick(2,this.imagens,null);//bloqueia todos
                console.log("acertou última");
                this.createDelayTime(700, function() {
    
                    this.efeitoCorreto();
                }); 
                this.createDelayTime(1500, function() {
                    this.clickRightButton();
                   
                }); 
                
            }
        }else{
            console.log("errou");
            this.enableClick(2,this.imagens,null);//bloqueia todos
            this.sound.play("hitErro");
            this.createDelayTime(700, function() {
    
                    this.efeitoCorreto();
                }); 
                this.createDelayTime(1500, function() {
                    this.clickWrongButton();
                   
                }); 
        }

    },

    efeitoCorreto:function(){

        for(i=0;i<this.elementos;i++){

            if(this.imagens[i].id==false){
                this.add.tween(this.imagens[i]).to({alpha:0},300, Phaser.Easing.Linear.None, true);
            }
            
        }

        this.createDelayTime(200, function() {
            this.resetLevel(this.currentLevel);
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

     showCedulas:function(){

        
        
        posicao = new Array([300,250],[520,250],[770,250]);
    
        this.imagens  = [];

        this.imagens[0] = this.add.sprite(posicao[0][0],posicao[0][1], 'cedulas',2);
        this.imagens[0]. id = true;
        this.imagens[0].alpha = 0;

        this.imagens[1] = this.add.sprite(posicao[1][0],posicao[1][1], 'outras',0);
        this.imagens[1]. id = true;
        this.imagens[1].alpha = 0;

        this.imagens[2] = this.add.sprite(posicao[2][0],posicao[2][1], 'outras',1);
        this.imagens[2]. id = false;
        this.imagens[2].alpha = 0;

        time = [100,200,300];

        for(i=0;i<3;i++){
            this.add.tween(this.imagens[i]).to({alpha:1},time[i], Phaser.Easing.Linear.None, true);
            this.groupIntro.add(this.imagens[i]);
        }

        this.createDelayTime(2800, function() {

            this.arrow = this.add.sprite(510,390, 'arrow');
        
            this.arrow.alpha =1;

            this.click = this.add.sprite(0, 0, "clickAnimation");
            this.click.animations.add('idle', null, 18, true);
            this.click.alpha = 0;

            this.groupIntro.add(this.arrow);
            this.groupIntro.add(this.click);
            x = 300+35;
            y = 250+5;
            this.add.tween(this.arrow).to({x:x,y:y}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.animClick();
                this.changeHappy(this.bumba,"bumba_happy","bumba",13,196,43,196);
                this.changeHappy(this.boitata,"boitata_happy","boitata",54,312,54,312);               
            },this);
        }); 

        this.createDelayTime(6000, function() { 
            this.showMoedas();
        });
    },

    showMoedas:function()
    {
        
        for(i=0;i<3;i++){
            this.add.tween(this.imagens[i]).to({alpha:0},100, Phaser.Easing.Linear.None, true);
        }
        this.add.tween(this.tutorialText).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.add.tween(this.tutorialText1).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
        },this);

        this.createDelayTime(700, function() { 

            posicao = new Array([400,250],[520,250],[770,250]);
    
            this.imagens  = [];

            this.imagens[0] = this.add.sprite(posicao[0][0],posicao[0][1], 'moedas',2);
            this.imagens[0]. id = true;
            this.imagens[0].alpha = 0;

            this.imagens[1] = this.add.sprite(posicao[1][0],posicao[1][1], 'outras',0);
            this.imagens[1]. id = true;
            this.imagens[1].alpha = 0;

            this.imagens[2] = this.add.sprite(posicao[2][0],posicao[2][1], 'outras',1);
            this.imagens[2]. id = false;
            this.imagens[2].alpha = 0;

            time = [100,200,300];



            for(i=0;i<3;i++){
                this.add.tween(this.imagens[i]).to({alpha:1},time[i], Phaser.Easing.Linear.None, true);
                this.groupIntro.add(this.imagens[i]);
            }

            this.createDelayTime(1800, function() {

                this.arrow = this.add.sprite(510,390, 'arrow');
            
                this.arrow.alpha =1;

                this.click = this.add.sprite(0, 0, "clickAnimation");
                this.click.animations.add('idle', null, 18, true);
                this.click.alpha = 0;

                this.groupIntro.add(this.arrow);
                this.groupIntro.add(this.click);

                
                x = 400+35;
                y = 250+5;
                this.add.tween(this.arrow).to({x:x,y:y}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.animClick();
                    this.changeHappy(this.bumba,"bumba_happy","bumba",43,196);
                    this.changeHappy(this.boitata,"boitata_happy","boitata",54,312);               
                },this);
            }); 

        });

        this.soundIntro.onStop.addOnce(function(){
            this.showFinishedLiveTutorial();
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



};





