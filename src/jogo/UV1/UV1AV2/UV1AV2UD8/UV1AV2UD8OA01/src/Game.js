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
            

        this.TEMPO_INTRO = 16000;
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
        this.keyboard_permission = false;
        this.right_keyboard_answear;
        this.input.keyboard.addCallbacks(this, null, null, this.keyPress);

        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

        this.createScene();
        this.showIntro();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();

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


        num = this.add.sprite(this.fred.x - 70, this.fred.y - 60, "numbers",9);
        this.groupIntro.add(num);
        num1 = this.add.sprite(this.juninho.x - 70, this.juninho.y - 30, "numbers",8);
        this.groupIntro.add(num1);
        num2 = this.add.sprite(this.poly.x - 130, this.poly.y - 45, "numbers",0);
        this.groupIntro.add(num2);
        num3 = this.add.sprite(this.poly.x + 25, this.poly.y - 45, "numbers",3);
        this.groupIntro.add(num3);
        


        

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

        var t1 = "Para encontrar o coração da árvore,\no Saci bem disse que o caminho é tão\nimportante quanto o resultado! Nesse\ndesafio temos que prestar atenção nos\nnúmeros e escolher o resultado certo! ";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 21, "left");

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
                this.add.tween(this.poly).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.juninho).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.fred).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
                    this.poly.destroy();
                    this.juninho.destroy();
                    this.fred.destroy();
                },this);

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

        this.background = this.add.sprite( -340, -550, 'background');

        this.fred = this.add.sprite(500, 390, "fred_anim");
        this.fred.animations.add('idle', null, 18, true);
        this.fred.animations.play('idle');
        this.fred.scale.set(0.9, 0.9);
        this.fred.anchor.set(0.5,0.5);

        this.juninho = this.add.sprite(750, 360, "juninho_anim");
        this.juninho.animations.add('idle', null, 18, true);
        this.juninho.animations.play('idle');
        this.juninho.scale.set(0.9, 0.9);
        this.juninho.anchor.set(0.5,0.5);

        this.poly = this.add.sprite(250, 360, "poly_anim");
        this.poly.animations.add('idle', null, 18, true);
        this.poly.animations.play('idle');
        this.poly.scale.set(0.8, 0.8);
        this.poly.anchor.set(0.5,0.5);


        
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {

        this.add.tween(this.tutorialPlacar).to({y: -140}, 1000, Phaser.Easing.Linear.None, true, 500);

        var t2 = "Nossos amigos vão segurar cartazes \n e devemos clicar no que for pedido. \n Prontos? Vamos lá! ";
        
        this.tutorialText = this.drawText(this.world.centerX, 20, t2, 22, "left");
        this.groupIntro.add(this.tutorialText);

        this.createDelayTime( 100, function() {
            
            this.showFinishedLiveTutorial();

        }, this);
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showFinishedLiveTutorial:function() {


        this.createDelayTime( 10000, function() {
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
        var t1 = " JÁ CONHECEMOS OS [NÚMEROS NATURAIS], COMO O [1,2,3,4,5]…\nOS [NÚMEROS ORDINAIS] SÃO AQUELES NÚMEROS QUE TÊM\nESTE SÍMBOLO  “ º “, DAÍ FICA: [1º, 2º, 3º, 4º, 5º]  E OS [NÚMEROS]\n[DECIMAIS], TÊM UMA VÍRGULA, ASSIM: [1,0, 1,5], ETCETERA!\nVAMOS TENTAR MAIS UMA VEZ!";
        
        var tutorialText = this.drawText(this.world.centerX, 30, t1, 20.5, "center");
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

        var levelNum = this.verifyCurrentLevel();

        console.log("init level", levelNum, this.currentLevel);

        switch(levelNum) {
            case 1:

                this.showQuestion(1);

                this.add.tween(this.fred.scale).to({x: 0.9, y: 0.9}, 1000, Phaser.Easing.Linear.None, true, 500)
                this.add.tween(this.fred).to({x: this.world.centerX, y: 330}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
                    this.question_number = this.add.sprite(this.fred.x - 80, this.fred.y - 60, "numbers");
                    this.question_number.frame = 9;
                }, this);
                this.add.tween(this.juninho).to({x: 750, y: 300}, 1000, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.juninho.scale).to({x: 0.7, y: 0.7}, 1000, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.poly).to({x: 250, y: 300}, 1000, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.poly.scale).to({x: 0.7, y: 0.7}, 1000, Phaser.Easing.Linear.None, true, 500);

                console.log("e ai? 4");

                if(this.showCallToAction) {
                    this.initLevel1();
                    console.log("e ai? 3");
                } else {
                    console.log("e ai? 1");
                    this.sound.play("soundP1").onStop.addOnce(this.initLevel1, this);
                }
            break;
            case 2:
                x = this.juninho.x;
                y = this.juninho.y;

                this.add.tween(this.fred.scale).to({x: 0.7, y: 0.7}, 1000, Phaser.Easing.Linear.None, true, 500)
                this.add.tween(this.fred).to({x:x, y: y}, 1000, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.juninho.scale).to({x: 0.9, y: 0.9}, 1000, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.juninho).to({x: this.world.centerX, y: 370}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
                    this.question_number = this.add.sprite(this.juninho.x - 80, this.juninho.y - 30, "numbers");
                    this.question_number.frame = 8;
                    this.question_number2 = this.add.sprite(this.juninho.x, this.juninho.y - 40, "ordinal");
                    this.question_number2.scale.set(0.5,0.5);
                }, this);;
                //this.add.tween(this.juninho.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.poly).to({x: 250, y: 300}, 1000, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.poly.scale).to({x: 0.7, y: 0.7}, 1000, Phaser.Easing.Linear.None, true, 500);

                this.showQuestion(2);
                if(this.showCallToAction) {
                    this.initLevel2();
                } else {
                    this.sound.play("soundP2").onStop.addOnce(this.initLevel2, this);
                }
            break;
            case 3:

                x = this.poly.x;
                y = this.poly.y;

                this.add.tween(this.fred).to({x:x, y:y}, 1000, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.fred.scale).to({x: 0.7, y: 0.7}, 1000, Phaser.Easing.Linear.None, true, 500)
                this.add.tween(this.juninho).to({x: 750, y: 300}, 1000, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.juninho.scale).to({x: 0.7, y: 0.7}, 1000, Phaser.Easing.Linear.None, true, 500);
                 this.add.tween(this.poly.scale).to({x: 0.9, y: 0.9}, 1000, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.poly).to({x: this.world.centerX, y: 370}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
                    this.question_number = this.add.sprite(this.poly.x - 150, this.poly.y - 45, "numbers");
                    this.question_number.frame = 0;
                    this.question_number2 = this.add.sprite(this.poly.x + 45, this.poly.y - 45, "numbers");
                    this.question_number2.frame = 3;
                }, this);;
                //this.add.tween(this.poly.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Linear.None, true, 500);

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

        this.poly.animations.play('idle');
        this.fred.animations.play('idle');
        this.juninho.animations.play('idle');

        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        var questionList = [ null,
            "Fred está segurando um cartaz que tem um \n [número natural], cliquem no número natural \n que é [menor] do que o número do cartaz!",
            "JUNINHO ESTÁ SEGURANDO UM CARTAZ QUE TEM UM \n [NÚMERO ORDINAL]. CLIQUEM NO NÚMERO ORDINAL \n QUE É [MAIOR] DO QUE O NÚMERO DO CARTAZ!",
            "POLY ESTÁ SEGURANDO DOIS CARTAZES, ELES TÊM \n [NÚMEROS DECIMAIS]. CLIQUEM NO NÚMERO DECIMAL \n QUE FICA [ENTRE] ESSES DOIS NÚMEROS DOS CARTAZES!"
        ];

        this.imageQuestion = this.drawText(this.world.centerX, 30, questionList[num]);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    initLevel1: function() {

        console.log("e ai? 2");

        this.itens = ["7", "8", "9"];
        this.errados = ["11", "12", "13", "14", "15"];

        // gera um item unico de acordo com regras do jogo para a lista
        var item = this.getRandomUniqueItem(this.itens);
        
        // gera um item errado de acordo com a lista
        var _letters = this.createRandomItens(this.errados, 2);
        _letters.push( item );


        _letters.sort(function() {
            return .5 - Math.random();
        });

        this.buttons = [];
        this.buttons.push( this.add.sprite( 330, 540, "placa"));
        this.buttons[0].anchor.set(0.5, 0.7);
        this.buttons[0].scale.set(0.7,0.7);
        this.buttons.push( this.add.sprite( 500, 540, "placa"));
        this.buttons[1].anchor.set(0.5, 0.7);
        this.buttons[1].scale.set(0.7,0.7);
        this.buttons.push( this.add.sprite( 670, 540, "placa"));
        this.buttons[2].anchor.set(0.5, 0.7);
        this.buttons[2].scale.set(0.7,0.7);
        this.buttons.push( this.createButton(this.buttons[0].x, this.buttons[0].y + 25, 0, _letters[0] - 1, this.itens.indexOf(_letters[0])>=0) );
        this.buttons.push( this.createButton(this.buttons[1].x, this.buttons[1].y + 25, 1, _letters[1] - 1, this.itens.indexOf(_letters[1])>=0) );
        this.buttons.push( this.createButton(this.buttons[2].x, this.buttons[2].y + 25, 2, _letters[2] - 1, this.itens.indexOf(_letters[2])>=0) );

    },

    

    initLevel2: function() {

        this.itens = ["11", "12", "10"];
        this.errados = ["1","2","3","4","5",'6','7','8'];

        // gera um item unico de acordo com regras do jogo para a lista
        var item = this.getRandomUniqueItem(this.itens);
        
        // gera um item errado de acordo com a lista
        var _letters = this.createRandomItens(this.errados, 2);
        _letters.push( item );


        _letters.sort(function() {
            return .5 - Math.random();
        });

        this.buttons = [];
        this.buttons.push( this.add.sprite( 330, 540, "placa"));
        this.buttons[0].anchor.set(0.5, 0.7);
        this.buttons[0].scale.set(0.7,0.7);
        this.buttons.push( this.add.sprite( 500, 540, "placa"));
        this.buttons[1].anchor.set(0.5, 0.7);
        this.buttons[1].scale.set(0.7,0.7);
        this.buttons.push( this.add.sprite( 670, 540, "placa"));
        this.buttons[2].anchor.set(0.5, 0.7);
        this.buttons[2].scale.set(0.7,0.7);
        this.buttons.push( this.createButton(this.buttons[0].x, this.buttons[0].y + 25, 0, _letters[0] - 1, this.itens.indexOf(_letters[0])>=0) );
        this.buttons.push( this.createButton(this.buttons[1].x, this.buttons[1].y + 25, 1, _letters[1] - 1, this.itens.indexOf(_letters[1])>=0) );
        this.buttons.push( this.createButton(this.buttons[2].x, this.buttons[2].y + 25, 2, _letters[2] - 1, this.itens.indexOf(_letters[2])>=0) );
        this.buttons.push( this.add.sprite(this.buttons[0].x + 25, this.buttons[0].y - 35, "ordinal"));
        this.buttons[6].scale.set(0.5,0.5);
        this.buttons.push( this.add.sprite(this.buttons[1].x + 25, this.buttons[1].y - 35, "ordinal"));
        this.buttons[7].scale.set(0.5,0.5);
        this.buttons.push( this.add.sprite(this.buttons[2].x + 25, this.buttons[2].y - 35, "ordinal"));
        this.buttons[8].scale.set(0.5,0.5);
    },

    initLevel3: function() {

        this.itens = ["16", "17", "18"];
        this.errados = ["1","2","3","4","5"];

        // gera um item unico de acordo com regras do jogo para a lista
        var item = this.getRandomUniqueItem(this.itens);
        
        // gera um item errado de acordo com a lista
        var _letters = this.createRandomItens(this.errados, 2);
        _letters.push( item );


        _letters.sort(function() {
            return .5 - Math.random();
        });

        this.buttons = [];
        this.buttons.push( this.add.sprite( 330, 540, "placa"));
        this.buttons[0].anchor.set(0.5, 0.7);
        this.buttons[0].scale.set(0.7,0.7);
        this.buttons.push( this.add.sprite( 500, 540, "placa"));
        this.buttons[1].anchor.set(0.5, 0.7);
        this.buttons[1].scale.set(0.7,0.7);
        this.buttons.push( this.add.sprite( 670, 540, "placa"));
        this.buttons[2].anchor.set(0.5, 0.7);
        this.buttons[2].scale.set(0.7,0.7);
        this.buttons.push( this.createButton(this.buttons[0].x, this.buttons[0].y + 25, 0, _letters[0] - 1, this.itens.indexOf(_letters[0])>=0) );
        this.buttons.push( this.createButton(this.buttons[1].x, this.buttons[1].y + 25, 1, _letters[1] - 1, this.itens.indexOf(_letters[1])>=0) );
        this.buttons.push( this.createButton(this.buttons[2].x, this.buttons[2].y + 25, 2, _letters[2] - 1, this.itens.indexOf(_letters[2])>=0) );

    },

    /**
    *
    * Controle de Perguntas, que serão mostradas no jogo
    * 
    **/
    createButton: function( x, y, array_pos, imagem, right, canInteract) {

        var _canInteract = (canInteract==null||canInteract==undefined) ? true : false;
        
        var btn;
        this.buttons[array_pos].inputEnabled = true;
        this.buttons[array_pos].input.useHandCursor = true;

        if(right) {

            btn = this.add.button(x,y, 'numbers', (_canInteract)?this.clickRightButton:null, this, imagem,imagem,imagem);
            btn.isCorrect = true;
            this.correctItem = btn;
            this.buttons[array_pos].events.onInputDown.add(this.clickRightButton, this);

        } else {
            btn = this.add.button(x,y, 'numbers', (_canInteract)?this.clickWrongButton:null, this, imagem,imagem,imagem);
            this.buttons[array_pos].events.onInputDown.add(this.clickWrongButton, this);
        }

        btn.anchor.set(0.5,1);
        btn.alpha = 0;
        btn.scale.set(0.5,0.5);
        btn.click=true;

        if(_canInteract) {
            btn.onInputOver.add(this.onGameButtonOver, this);
            btn.onInputOut.add(this.onGameButtonOut, this);
        }

        this.add.tween(btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(btn.scale).to({x: 0.8, y: 0.8}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            if(_canInteract) {
                btn.input.useHandCursor = true;
            }
        }, this);

        return btn;
    },
    
    onGameButtonOver: function(elem){
        this.add.tween(elem.scale).to({x: 0.9, y: 0.9}, 200, Phaser.Easing.Linear.None, true);
    },

    onGameButtonOut: function(elem){
        this.add.tween(elem.scale).to({x: 0.8, y: 0.8}, 200, Phaser.Easing.Linear.None, true);
    },

    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção CORRETA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickRightButton: function(target) {

        console.log('--------------------clickRightButton ');

        console.log('target '+target.click);

        if(target.click){
            target.click=false;
            if(target != null && target.alpha < 1) {
                return;
            }

            this.add.tween(this.question_number).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            if(this.question_number2 != null) this.add.tween(this.question_number2).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            
            this.keyboard_permission = false;

            this.onPlayerSuccess();

            this.sound.play("hitAcerto");
            this.clearButtons(false);

            this.showCorrectName(true);

        }
        
    },




    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção ERRADA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickWrongButton: function(target) {


        console.log('--------------------clickWrongButton ');

        console.log('target '+target.click);

        if(target.click){
            target.click=false;

            if(target != null && target.alpha < 1) {
                return;
            }
            
            this.add.tween(this.question_number).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            if(this.question_number2 != null) this.add.tween(this.question_number2).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);

            if(this.currentLocalErrors > 0) { 
                this.currentLocalErrors--;

                this.sound.play("hitErro");
                this.onErrorChance(target);
                return;
            }

            this.keyboard_permission = false;
            
            this.onPlayerError();
            
            this.sound.play("hitErro");
            this.clearButtons(false);

            this.question_number.destroy();
            
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

};





