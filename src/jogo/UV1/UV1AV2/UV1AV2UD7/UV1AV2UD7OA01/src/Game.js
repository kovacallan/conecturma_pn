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
            

        this.TEMPO_INTRO = 22700;
        this.ENABLE_CALL_TO_ACTION = true;


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
        this.fadas = [];
        this.arrow;

        
        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

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
    createAnimation: function( x, y,image, scaleX, scaleY) {
        
        if(image == null){
            var rand_fada = this.rnd.integerInRange(1,3); 
            var spr = this.add.sprite(x,y, "anim_fada"+rand_fada);
            spr.anchor.set(0.5,0.5);
        } else {
            var spr = this.add.sprite(x,y, image);
        }
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

        var t1 = '"1,2,3 fadinhas, 4,5,6 fadinhas, 7,8,9 fadinhas, \n 10 em um barquinho…” Nessa música, uma \n fadinha é igual a uma unidade. Uma dezena é \n um conjunto de 10 unidades. Para \n treinar, vamos completar as dezenas!';
        this.tutorialText = this.drawText(this.world.centerX+60, 30, t1, 18, "left");

        this.tutorialText.alpha = 0;

        this.groupIntro.add(this.tutorialText);

        var kim = this.showKim(this.TEMPO_INTRO);

        
        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
            this.soundIntro.onStop.addOnce(this.initGame, this);
        }, this);


        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(this.tutorialText).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
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

        this.add.tween(this.placar).to({y: -320}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
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
        this.add.tween(this.groupLevel).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

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
            console.log(this.currentLevel, this.corrects);
            if(this.currentLevel <= 3 && this.corrects <= 2) {

                this.add.tween(this.placar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);

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

        this.background = this.add.sprite( this.world.centerX, this.world.centerY, 'background');
        this.background.anchor.set(0.5,0.5);

    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {

        this.groupIntro = this.add.group();

        var t2 = " É só escolher o número de fadinhas que \n estão faltando para completarmos um \n conjunto de 10! Nesse caso… 5! ";
        this.tutorialText = this.drawText(this.world.centerX, 30, t2, 22, "left");
        this.groupIntro.add(this.tutorialText);
        
        this.drawFadas(5, 1);

        // gera um item errado de acordo com a lista
        var _letters = [1, 5, 8];

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX-120, 540, _letters[0], false, false) );
        this.buttons.push( this.createButton(this.world.centerX, 540, _letters[1],false, false) );
        this.buttons.push( this.createButton(this.world.centerX+120, 540, _letters[2], false, false) );

        this.groupIntro.add(this.buttons[0]);
        this.groupIntro.add(this.buttons[1]);
        this.groupIntro.add(this.buttons[2]);

        this.createDelayTime(100, function(){
            this.showFinishedLiveTutorial();
        });

    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showFinishedLiveTutorial:function() {

        this.createDelayTime( 7000, function() {
            
            this.arrow = this.add.sprite(this.world.centerX, this.world.centerY+50, "arrow");
            this.arrow.anchor.set(0.5,0.5);
            this.add.tween(this.arrow).to({x: this.buttons[1].x, y: this.buttons[1].y - 30}, 1200, Phaser.Easing.Linear.None, true);
            this.groupIntro.add(this.arrow);

        });

        this.createDelayTime( 8200, function() {
            this.click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
            this.click.animations.add('idle', null, 18, true);
            this.click.animations.play('idle');

            this.groupIntro.add(this.click);
        });

        // remover click
        this.createDelayTime( 10000, function() {
            this.click.alpha = 0;
            this.click.destroy();
        });

        // remover tudo
        this.createDelayTime( 11000, function() {

            this.add.tween(this.arrow).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[0]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[1]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[2]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500);

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
        var t1 = "Quando temos uma bolinha de gude, dizemos \n que temos uma unidade. Quando juntamos dez \n unidades de bolinhas de gude, temos uma \n dezena de bolinhas de gude.\n Um, uma unidade. dez unidades, uma dezena!";
        var tutorialText = this.drawText(this.world.centerX, 30, t1, 22, "center");
            tutorialText.alpha = 0;

        var unidade = this.add.sprite(350, 350, "unidade");
            unidade.anchor.set(0.5,0.5);
            unidade.alpha = 0;

        var dezena = this.add.sprite(620, 350, "dezena");
            dezena.anchor.set(0.5,0.5);
            dezena.alpha = 0;

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.setDebugAudio("soundResumo");

        this.createDelayTime(5000, function(){  
            this.add.tween(unidade).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        });

        this.createDelayTime(12000, function(){
            this.add.tween(dezena).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        });

        this.createDelayTime(16000, function(){
            this.add.tween(unidade.scale).to({x: 1.4, y: 1.4}, 300, Phaser.Easing.Linear.None, true, 500);
        });

        this.createDelayTime(18500, function(){
            this.add.tween(unidade.scale).to({x: 1.0, y: 1.0}, 500, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(dezena.scale).to({x: 1.4, y: 1.4}, 300, Phaser.Easing.Linear.None, true, 500);
        });

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(dezena.scale).to({x: 1.0, y: 1.0}, 500, Phaser.Easing.Linear.None, true, 500);
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

        switch(levelNum) {
            case 1:

                this.showQuestion(1);
                if(this.showCallToAction) {
                    this.initLevel1();
                } else {
                    this.sound.play("soundCtA").onStop.addOnce(this.initLevel1, this);
                }
            break;
            case 2:

                this.showQuestion(2);
                if(this.showCallToAction) {
                    this.initLevel2();
                } else {
                    this.sound.play("soundCtA").onStop.addOnce(this.initLevel2, this);
                }
            break;
            case 3:

                this.showQuestion(3);
                if(this.showCallToAction) {
                this.initLevel3();
                } else {
                    this.sound.play("soundCtA").onStop.addOnce(this.initLevel3, this);
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
            "Qual desses DOIS objetos têm\nnúmeros? cliquem!",
            "Entre esses dois...\nqual deles têm números?",
            "E agora? cliquem no objeto com\nnúmeros!"
        ];

        this.imageQuestion = this.drawText(this.world.centerX, 50, questionList[num]);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        //this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    drawFadas: function( quantity, intro){

        var position_x

        for( var i = 0; i < 10 - quantity; i++){

            if( i == 0 ) position_x = 500 - ( 30 * (10 - quantity));
            else position_x += 80;

            if( i % 2 == 0) var position_y = 200;
            else var position_y = 280;

            this.fadas[i] = this.createAnimation( 1200, this.rnd.integerInRange(500,700), null, 1.0, 1.0);
            this.game.add.tween(this.fadas[i]).to({ x: position_x}, 1000, Phaser.Easing.Linear.InOut, true, 0);
            this.game.add.tween(this.fadas[i]).to({ y: position_y}, 1000, Phaser.Easing.Cubic.In, true, 0);

            if(intro != null || intro != undefined) this.groupIntro.add(this.fadas[i]);
            else this.groupLevel.add(this.fadas[i]);
        }
    },

    initLevel1: function() {

        this.groupLevel = this.add.group();

        var random_question = this.rnd.integerInRange(1,3);

        this.errados = [4, 5, 6, 7, 8, 9, 10];
        
        this.drawFadas(random_question);

        // gera um item errado de acordo com a lista
        var _letters = this.createRandomItens(this.errados, 2);
        _letters.push( random_question );


        _letters.sort(function() {
          return .5 - Math.random();
        });
    

        console.log(" O valor de letters 0 :", _letters[0]);
        console.log(" O valor de letters 1 :", _letters[1]);
        console.log(" O valor de letters 2 :", _letters[2]);

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX-120, 540, _letters[0], _letters[0] == random_question) );
        this.buttons.push( this.createButton(this.world.centerX, 540, _letters[1], _letters[1] == random_question) );
        this.buttons.push( this.createButton(this.world.centerX+120, 540, _letters[2], _letters[2] == random_question) );

        this.groupLevel.add(this.buttons[0]);
        this.groupLevel.add(this.buttons[1]);
        this.groupLevel.add(this.buttons[2]);
    },

    

    initLevel2: function() {

        this.groupLevel = this.add.group();

        var random_question = this.rnd.integerInRange(2,5);

        this.errados = [1, 6, 7, 8, 9, 10];
        
        this.drawFadas(random_question);

        // gera um item errado de acordo com a lista
        var _letters = this.createRandomItens(this.errados, 2);
        _letters.push( random_question );


        _letters.sort(function() {
          return .5 - Math.random();
        });
    

        console.log(" O valor de letters 0 :", _letters[0]);
        console.log(" O valor de letters 1 :", _letters[1]);
        console.log(" O valor de letters 2 :", _letters[2]);

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX-120, 540, _letters[0], _letters[0] == random_question) );
        this.buttons.push( this.createButton(this.world.centerX, 540, _letters[1], _letters[1] == random_question) );
        this.buttons.push( this.createButton(this.world.centerX+120, 540, _letters[2], _letters[2] == random_question) );

        this.groupLevel.add(this.buttons[0]);
        this.groupLevel.add(this.buttons[1]);
        this.groupLevel.add(this.buttons[2]);
    },

    initLevel3: function() {

        this.groupLevel = this.add.group();

        var random_question = this.rnd.integerInRange(4,7);

        this.errados = [1, 2, 3, 8, 9, 10];
        
        this.drawFadas(random_question);

        // gera um item errado de acordo com a lista
        var _letters = this.createRandomItens(this.errados, 2);
        _letters.push( random_question );


        _letters.sort(function() {
          return .5 - Math.random();
        });
    

        console.log(" O valor de letters 0 :", _letters[0]);
        console.log(" O valor de letters 1 :", _letters[1]);
        console.log(" O valor de letters 2 :", _letters[2]);

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX-120, 540, _letters[0], _letters[0] == random_question) );
        this.buttons.push( this.createButton(this.world.centerX, 540, _letters[1], _letters[1] == random_question) );
        this.buttons.push( this.createButton(this.world.centerX+120, 540, _letters[2], _letters[2] == random_question) );

        this.groupLevel.add(this.buttons[0]);
        this.groupLevel.add(this.buttons[1]);
        this.groupLevel.add(this.buttons[2]);
    },

    /**
    *
    * Controle de Perguntas, que serão mostradas no jogo
    * 
    **/
    createButton: function( x, y, imagem, right, canInteract) {

        var _canInteract = (canInteract==null||canInteract==undefined) ? true : false;
        
        imagem -= 1;

        console.log(imagem, right);

        var btn;
        if(right) {

            btn = this.add.button(x,y, 'numbers', (_canInteract)?this.clickRightButton:null, this, imagem,imagem,imagem);
            btn.isCorrect = true;
            this.correctItem = btn;

        } else {
            btn = this.add.button(x,y, 'numbers', (_canInteract)?this.clickWrongButton:null, this, imagem,imagem,imagem);

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

        if(target != null && target.alpha < 1) {
            return;
        }

        this.onPlayerSuccess();

        this.sound.play("hitAcerto");
        this.clearButtons(true);

        this.showCorrectName(true);

    },




    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção ERRADA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickWrongButton: function(target) {
        if(target != null && target.alpha < 1) {
            return;
        }
        
        if(this.currentLocalErrors > 0) {
            
            this.currentLocalErrors--;

            this.sound.play("hitErro");
            this.onErrorChance(target);
            return;
        }
        
        this.onPlayerError();
        
        this.sound.play("hitErro");
        this.clearButtons(false);
        
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

};





