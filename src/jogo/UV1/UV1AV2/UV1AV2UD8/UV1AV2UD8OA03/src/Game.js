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
            

        this.TEMPO_INTRO = 4000;
        this.ENABLE_CALL_TO_ACTION = false;


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

        //BasicGame.Game.Cenario.create(this.game);
        //BasicGame.Game.Cenario.gradeGuia(this.world.width,this.world.height);
        
        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

        this.groupLevel = [null,1,2,3];

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

        var t1 = "Conecturma, temos várias maneiras \nde medir o tempo!";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 22, "left");

        tutorialText.alpha = 0;

        this.groupIntro.add(tutorialText);

        var kim = this.showKim(this.TEMPO_INTRO);

        
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);


        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
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

        this.hideLevel(function() {

            if(this.currentLevel <= 3 && this.corrects <= 2) {

                this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);

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

        this.removeButtonAction();

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

        this.add.sprite( -841, -462, 'background');
        //this.initGame();
        //this.showResumo();

    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {

        var t1 = "Podemos medir o tempo entre antes e depois, \nentre ontem, hoje e amanhã e entre manhã, \ntarde e noite, por exemplo.";
        var tutorialText = this.drawText(this.world.centerX, 25, t1, 22, "left");

        tutorialText.alpha = 0;

        this.groupIntro.add(tutorialText);

        this.add.tween(this.tutorialPlacar).to({y: -120}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.add.tween(tutorialText).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
        }, this);

        this.itensNome = ["cena_p3_1", "cena_p3_2","cena_p3_3"];
        this.itens = [0,1,2];

        

        var t2 = "Ainda tem o dia, mês e ano, mas isso é uma \noutra aventura. Vamos organizar as cenas \nde acordo com o que se pede e botar o \ntempo em ordem!";

        var tutorialText2 = this.drawText(this.world.centerX, 25, t2, 22, "left");

        tutorialText2.alpha = 0;

        this.groupIntro.add(tutorialText2);

        this.createDelayTime(14000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(tutorialText2).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
            },this)
        });

        this.posicao = new Array([202+35,400],[403+35,400],[602+35,400]);
        this.posicaoMarca = new Array([202+35,200],[403+35,200],[602+35,200]);

        this.imagem= [];
        this.marca=[];


        this.marca[0] = this.add.sprite(this.posicaoMarca[0][0],this.posicaoMarca[0][1], 'marca');
        this.marca[0].name = 0;
        this.marca[0].scale.set(0.4,0.4);
        this.groupIntro.add(this.marca[0]);
        

        this.marca[1] = this.add.sprite(this.posicaoMarca[1][0],this.posicaoMarca[1][1], 'marca');
        this.marca[1].name = 1;
        this.marca[1].scale.set(0.4,0.4);
        this.groupIntro.add(this.marca[1]);
        

        this.marca[2] = this.add.sprite(this.posicaoMarca[2][0],this.posicaoMarca[2][1], 'marca');
        this.marca[2].name = 2;
        this.marca[2].scale.set(0.4,0.4);
        this.groupIntro.add(this.marca[2]);
        


        this.imagem[0] = this.add.sprite(this.posicao[0][0],this.posicao[0][1], this.itensNome[this.itens[0]]);
        this.imagem[0].name = this.itens[0];
        this.imagem[0].id = 0;
        this.imagem[0].scale.set(0.6,0.6);
        this.groupIntro.add(this.imagem[0]);

        this.imagem[1] = this.add.sprite(this.posicao[1][0],this.posicao[1][1], this.itensNome[this.itens[1]]);
        this.imagem[1].name = this.itens[1];
        this.imagem[1].id = 1;
        this.imagem[1].scale.set(0.6,0.6);
        this.groupIntro.add(this.imagem[1]);

        this.imagem[2] = this.add.sprite(this.posicao[2][0],this.posicao[2][1], this.itensNome[this.itens[2]]);
        this.imagem[2].name = this.itens[2];
        this.imagem[2].id = 2;
        this.imagem[2].scale.set(0.6,0.6);
        this.groupIntro.add(this.imagem[2]);

        this.arrow = this.add.sprite(this.world.centerX, this.world.centerY+50, "arrow");
        this.arrow.anchor.set(0.5,0.5);
        this.groupIntro.add(this.arrow);

        this.click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
        this.click.animations.add('idle', null, 18, true);
        this.click.animations.play('idle');
        this.click.alpha = 0;

        this.groupIntro.add(this.click);


        this.createDelayTime(20000, function() {
            this.efeitoMouse(1);
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
            "Ontem havia um [ovo], hoje o [pintinho] nasceu, \namanhã ele será um [galo]. De manhã, tomamos \n[café], à tarde [almoçamos] e à noite [dormimos]. \nTudo tem o seu tempo de acontecer. Vamos \ncolocar o tempo em ordem?"
        ];

        var tutorialText = this.drawText(500, 40, textList[0], 22, "left");
        tutorialText.alpha = 0;
       
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

        var levelNum = this.verifyCurrentLevel();

        console.log("init level", levelNum, this.currentLevel);

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
            "Coloquem as cenas na ordem \ndo que vem antes e o que vem depois.",
            "Coloquem as cenas em ordem do que aconteceu \nontem, do que está acontecendo hoje e do que \nacontecerá amanhã.",
            "Coloquem as cenas em ordem do que acontece \nde manhã, à tarde e a noite."
        ];

        pos = [null,50,30,50];

        this.imageQuestion = this.drawText(this.world.centerX,pos[num], questionList[num]);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },


    initLevel1: function() {

        console.log("*** nivel 1 ***");

        this.groupLevel[this.currentLevel] = this.add.group();
        this.acertos = 3;

        this.cenas = [0,1,2];

        this.cena = this.getRandomUniqueItem(this.cenas);
        this.nomesCenas = new Array(["cena_p1_1_1", "cena_p1_1_2", "cena_p1_1_3"],["cena_p1_2_1", "cena_p1_2_2", "cena_p1_2_3"],["cena_p1_3_1", "cena_p1_3_2", "cena_p1_3_3"])
        this.arquivo = "cena_p1";
        this.itensNome = this.nomesCenas[this.cena].slice();

        this.itens = [1,0,2];

        this.itens.sort(function() {
          return .5 - Math.random();
        });
        
        this.level();
    },
    initLevel2: function() {

        console.log("*** nivel 2 ***");

        this.groupLevel[this.currentLevel] = this.add.group();
        this.acertos = 3;

        this.cenas = [0,1,2];

        this.cena = this.getRandomUniqueItem(this.cenas);
        this.nomesCenas = new Array(["cena_p2_1_1", "cena_p2_1_2", "cena_p2_1_3"],["cena_p2_2_1", "cena_p2_2_2", "cena_p2_2_3"],["cena_p2_3_1", "cena_p2_3_2", "cena_p2_3_3"])
        this.arquivo = "cena_p2";
        this.itensNome = this.nomesCenas[this.cena].slice();
        this.itens = [0,1,2];

        this.itens.sort(function() {
          return .5 - Math.random();
        });

        this.level();
    },

    initLevel3: function() {

        console.log("*** nivel 3 ***");

        this.groupLevel[this.currentLevel] = this.add.group();
        this.acertos = 3;

        this.cenas = [0,1,2];

        this.cena = this.getRandomUniqueItem(this.cenas);
        this.nomesCenas = new Array(["cena_p3_1_1", "cena_p3_1_2", "cena_p3_1_3"],["cena_p3_2_1", "cena_p3_2_2", "cena_p3_2_3"],["cena_p3_3_1", "cena_p3_3_2", "cena_p3_3_3"])
        this.arquivo = "cena_p3";
        this.itensNome = this.nomesCenas[this.cena].slice();

        this.itens.sort(function() {
          return .5 - Math.random();
        });

        this.level();  
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
        //if(target != null && target.alpha < 1) {
            ///return;
        //}
        //this.showCallToAction = true;
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

    //____________________________AV1AV2UD8OA04___________________________________________________________________________________________
    level:function(){

        this.posicao = new Array([202+35,405],[403+35,405],[602+35,405]);
        this.posicaoMarca = new Array([202+35,200],[403+35,200],[602+35,200]);
        //this.posicaoNaMarca = new Array([252,262],[346,260]);

        this.imagem= [];
        this.marca=[];
        this.marcaOcupada = [];

        this.marca[0] = this.add.sprite(this.posicaoMarca[0][0],this.posicaoMarca[0][1], 'marca');
        this.marca[0].name = 0;
        this.marca[0].scale.set(0.4,0.4);
        this.groupLevel[this.currentLevel].add(this.marca[0]);
        this.marcaOcupada[0] = false;

        this.marca[1] = this.add.sprite(this.posicaoMarca[1][0],this.posicaoMarca[1][1], 'marca');
        this.marca[1].name = 1;
        this.marca[1].scale.set(0.4,0.4);
        this.groupLevel[this.currentLevel].add(this.marca[1]);
        this.marcaOcupada[1] = false;

        this.marca[2] = this.add.sprite(this.posicaoMarca[2][0],this.posicaoMarca[2][1], 'marca');
        this.marca[2].name = 2;
        this.marca[2].scale.set(0.4,0.4);
        this.groupLevel[this.currentLevel].add(this.marca[2]);
        this.marcaOcupada[2] = false;


        this.imagem[0] = this.add.sprite(this.posicao[0][0],this.posicao[0][1],this.arquivo, this.itensNome[this.itens[0]]);
        this.imagem[0].name = this.itens[0];
        this.imagem[0].id = 0;
        this.imagem[0].scale.set(0.6,0.6);
        this.groupLevel[this.currentLevel].add(this.imagem[0]);

        this.imagem[1] = this.add.sprite(this.posicao[1][0],this.posicao[1][1],this.arquivo, this.itensNome[this.itens[1]]);
        this.imagem[1].name = this.itens[1];
        this.imagem[1].id = 1;
        this.imagem[1].scale.set(0.6,0.6);
        this.groupLevel[this.currentLevel].add(this.imagem[1]);

        this.imagem[2] = this.add.sprite(this.posicao[2][0],this.posicao[2][1],this.arquivo, this.itensNome[this.itens[2]]);
        this.imagem[2].name = this.itens[2];
        this.imagem[2].id = 2;
        this.imagem[2].scale.set(0.6,0.6);
        this.groupLevel[this.currentLevel].add(this.imagem[2]);


        this.createDelayTime( 1000, function() {
            this.inputMovable(0,this.imagem,null);
        });

    },
    animClick:function(prox){
        this.click.alpha = 1;
        this.click.x = this.arrow.x-35;
        this.click.y = this.arrow.y-35;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;
            //this.click.destroy();
            this.efeitoMouse(prox);
    
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
    efeitoMouse:function(passo){
        switch(passo){
            case 1:
                x = this.imagem[0].x+100;
                y = this.imagem[0].y+100;
                this.add.tween(this.arrow).to({x:x,y:y},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.animClick(2);            
                },this);
            break;
            case 2:
                x = this.marca[0].x+100;
                y = this.marca[0].y+100;
                x1 = this.marca[0].x;
                y1 = this.marca[0].y;
                this.add.tween(this.arrow).to({x:x,y:y},500, Phaser.Easing.Linear.None, true);
                this.add.tween(this.imagem[0]).to({x:x1,y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.efeitoMouse(3);            
                },this);
            break;
            case 3:
                x = this.imagem[1].x+100;
                y = this.imagem[1].y+100;
                this.add.tween(this.arrow).to({x:x,y:y},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.animClick(4);            
                },this);
            break;
            case 4:
                x = this.marca[1].x+100;
                y = this.marca[1].y+100;
                x1 = this.marca[1].x;
                y1 = this.marca[1].y;
                this.add.tween(this.arrow).to({x:x,y:y},500, Phaser.Easing.Linear.None, true);
                this.add.tween(this.imagem[1]).to({x:x1,y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.efeitoMouse(5);            
                },this);
            break;
            case 5:
                x = this.imagem[2].x+100;
                y = this.imagem[2].y+100;
                this.add.tween(this.arrow).to({x:x,y:y},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.animClick(6);            
                },this);
            break;
            case 6:
                x = this.marca[2].x+100;
                y = this.marca[2].y+100;
                x1 = this.marca[2].x;
                y1 = this.marca[2].y;
                this.add.tween(this.arrow).to({x:x,y:y},500, Phaser.Easing.Linear.None, true);
                this.add.tween(this.imagem[2]).to({x:x1,y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.efeitoMouse(7);            
                },this);
            break;
            
            case 7:
                this.soundIntro.onStop.addOnce(function(){
                            this.showFinishedLiveTutorial();
                }, this);
            break;


        }

    },

    inputMovable:function(modo, array_elem, elem){
        switch(modo){
            case 0: // habilitar todos os elementos 
                for(var i=0; i<array_elem.length;i++){ 
                    array_elem[i].inputEnabled = true;
                    array_elem[i].input.enableDrag(false, true);
                    array_elem[i].events.onDragStart.add(this.onStartDragElem, this);
                    array_elem[i].events.onDragStop.add(this.onStopDragElem, this);
                }
            break;// habilitar um elemento
            case 1:       
                elem.inputEnabled = true;
                elem.input.enableDrag(false, true);
                elem.events.onDragStart.add(this.onStartDragElem, this);
                elem.events.onDragStop.add(this.onStopDragElem, this);     
            break;
            case 2: // bloquear todos os elemento 
            
                for(var i=0; i<array_elem.length;i++){ 
                    array_elem[i].inputEnabled = false;
                    array_elem[i].input.reset();
                }
            break;
            case 3: // bloquear um elemento
                elem.inputEnabled = false;
                elem.input.reset();
            break;
        }
    },

    onStartDragElem: function(elem) {
        console.log("*** onStartDragNumber ***");
        
    },

    onStopDragElem: function(elem){
        console.log("*** onStopDragNumber ***");
        this.colider = false;
        this.certo = 2;
       
        this.marcaPos = null;
        this.reposiciona = false;

        //console.log(this.marcaOcupada); 
        this.certo = this.verificacao(elem);
        console.log(elem.x);
        console.log(elem.y);

        switch(this.certo){
            case 0:
                console.log("certo");
                this.inputMovable(3, null,elem);
                x1 = this.posicaoMarca[this.marcaPos][0];
                y1 = this.posicaoMarca[this.marcaPos][1];

                this.add.tween(elem).to({x:x1,y:y1},500, Phaser.Easing.Linear.None, true);
                      
                
                console.log(this.marcaOcupada); 

                if(this.acertos>0){ // se ainda tem espaços em branco na frase
                     this.acertos--;
                }
                if(this.acertos==0){ // frese está completa 
                    console.log("clickRightButton");
                    this.inputMovable(2,this.imagem,null);
                    this.createDelayTime(1500, function() {
                        this.clickRightButton();
                    });  

                } 
                this.sound.play("hitAcerto");
            break;
            case 1:
                console.log("errado");
                
                this.sound.play("hitErro");
                this.add.tween(elem).to({x:this.posicao[elem.id][0],y:this.posicao[elem.id][1]},500, Phaser.Easing.Linear.None, true);
                this.inputMovable(2,this.imagem,null);
                this.createDelayTime(1000, function() {
                    this.resetLevel(this.currentLevel);
                });
                this.createDelayTime(1500, function() {
                    this.clickWrongButton();
                }); 
            break;
            case 2:
                console.log("reposiciona");
                this.sound.play("hitErro");
                this.add.tween(elem).to({x:this.posicao[elem.id][0],y:this.posicao[elem.id][1]},500, Phaser.Easing.Linear.None, true);
            break;
        }
    },


    verificacao:function(elem){
        console.log("-- verificacao --");
        for(i=0; i<this.marca.length;i++){

            if(!this.marcaOcupada[i]){
                this.colider = this.enableOverLap(elem,this.marca[i]);
                console.log(i+" - "+ this.colider);
                console.log("elem "+ elem.name);
                console.log("marca "+ this.marca[i].name);
                if(this.colider){
                    console.log("colider "+ this.marca[i].name);
                    if(elem.name == this.marca[i].name){
                        this.marcaOcupada[i] = true;
                        this.marcaPos = i;
                        return 0;
                    }else{
                        return 1;
                    }
                }
            }
        }

        return 2;
    },

    enableOverLap:function(elem,elem1){
        console.log("*** enableOverLap ***");
        this.game.physics.enable(elem, Phaser.Physics.ARCADE);
        this.game.physics.enable(elem1, Phaser.Physics.ARCADE);
        resultado = false;
        if(this.game.physics.arcade.overlap(elem,elem1)){
            resultado = true;
        }
        return resultado;
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



    render:function(){
        //BasicGame.Game.Cenario.render();
    },
    update:function(){
        //this.updateTimer();
    }



};





