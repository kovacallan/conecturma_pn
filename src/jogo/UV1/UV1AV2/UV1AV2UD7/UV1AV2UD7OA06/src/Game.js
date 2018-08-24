
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
            

        this.TEMPO_INTRO = 11000;
        this.ENABLE_CALL_TO_ACTION = true;


        // quantidade de perguntas que tem em cada nivel
        this.totalLevel1 = 1;
        this.totalLevel2 = 1;
        this.totalLevel3 = 1;

        // quantidade total de erros permitido em cada nivel
        // ex: se valor está definido para 2 erros, usuario pode errar 2x e na terceira é considerado errado
        this.totalErro1 = 1;
        this.totalErro2 = 1;
        this.totalErro3 = 1;

        /*****************************************************************/
        this.letters_position = [];
        this.buttons = [];
        this.letters_position_corrects = [];
        this.draw_letter = [];
        this.level_corrects = 0;
        this.level_corrects_total;

        this.click_wrong = true;
        
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
    createAnimation: function( x, y, image, scaleX, scaleY) {
        
        var spr = this.add.sprite(x,y, image);
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

        var t1 = ' PRA CONSEGUIR ESCREVER TODOS ESSES \n CARTAZES O BUMBA TEVE QUE PRATICAR \n ALGUMAS LETRAS EM ALGUMAS \n PALAVRAS OU FRASES QUE ELE CRIOU. ';
        this.tutorialText = this.drawText(this.world.centerX+60, 40, t1, 22, "left");

        this.tutorialText.alpha = 0;

        this.groupIntro.add(this.tutorialText);

        var kim = this.showKim(this.TEMPO_INTRO);

        
        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);


        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(this.tutorialPlacar).to({y: -120}, 300, Phaser.Easing.Linear.None, true, 500);
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

        this.showNextLevel();
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

            if(this.currentLevel <= 3 && this.corrects <= 2) {

                this.showNextLevel();

            } else {
                this.bumba.animations.play("comemora");
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

    onButtonOver: function(elem){
        this.add.tween(elem.scale).to({x: 0.9, y: 0.9}, 500, Phaser.Easing.Linear.None, true)
    },

    onButtonOut: function(elem){
        this.add.tween(elem.scale).to({x: 0.8, y: 0.8}, 500, Phaser.Easing.Linear.None, true)
    },
    /**
    *
    * Faz calculo de qual deve ser o nível seguinte e direciona o jogador para o nivel seguinte se houver
    * 
    **/
    gotoNextLevel: function() {

        this.currentLocalLevel++;
        this.level_corrects = 0;

        for( var i = 0; i < this.level_corrects_total; i++){
            if(this.letters_position_corrects[i] == 1) this.letters_position_corrects[i] = 0;
        }

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

        this.background = this.add.sprite( this.world.centerX + 80, this.world.centerY - 720, 'background');
        this.background.anchor.set(0.5,0.5);

        this.bumba = this.add.sprite(100, 370, "anim_bumba");
        this.bumba.anchor.set(0.5,0.5);
        this.bumba.animations.add('idle', this.math.numberArray(0,28), 18, true);
        this.bumba.animations.add('comemora', this.math.numberArray(30,57), 18, true);
        this.bumba.animations.play('idle');
    },

    level_clicked: function() {

        if( this.input.x > this.buttons[0].x) console.log("O x é: +" + ( this.input.x - this.buttons[0].x));
        else console.log("O x é: -" + ( this.buttons[0].x - this.input.x));

        if( this.input.y > this.buttons[0].y) console.log("O y é: +" + ( this.input.y - this.buttons[0].y));
        else console.log("O y é: -" + ( this.buttons[0].y - this.input.y));

        if( this.buttons[0] != null && this.input.x > this.buttons[0].x - 175 && this.input.x < this.buttons[0].x + 190 && this.input.y > 
            this.buttons[0].y - 330 && this.input.y < this.buttons[0].y - 20){

                if( this.letters[0] != null && this.check_click_position(this.letters[0],this.letters[1],this.letters[2],this.letters[3])){
                    this.clickRightButton(0);
                    this.buttons.push( this.createButton( this.draw_letter[0],this.draw_letter[1],this.random_question, true) );
                } else if ( this.letters[4] != null && this.check_click_position(this.letters[4],this.letters[5],this.letters[6],this.letters[7])) {
                    this.clickRightButton(1);
                    this.buttons.push( this.createButton(this.draw_letter[2],this.draw_letter[3],this.random_question, true) );
                } else if ( this.letters[8] != null && this.check_click_position(this.letters[8],this.letters[9],this.letters[10],this.letters[11])) {
                    this.clickRightButton(2);
                    this.buttons.push( this.createButton(this.draw_letter[4],this.draw_letter[5],this.random_question, true) );
                } else if ( this.letters[12] != null && this.check_click_position(this.letters[12],this.letters[13],this.letters[14],this.letters[15])) {
                    this.clickRightButton(3);
                    this.buttons.push( this.createButton(this.draw_letter[6],this.draw_letter[7],this.random_question, true) );
                } else if ( this.letters[16] != null && this.check_click_position(this.letters[16],this.letters[17],this.letters[18],this.letters[19])) {
                    this.clickRightButton(4);
                    this.buttons.push( this.createButton(this.draw_letter[8],this.draw_letter[9],this.random_question, true) );
                } else if ( this.letters[20] != null && this.check_click_position(this.letters[20],this.letters[21],this.letters[22],this.letters[23])) {
                    this.clickRightButton(5);
                    this.buttons.push( this.createButton(this.draw_letter[10],this.draw_letter[11],this.random_question, true) );
                } else if(this.error_places()){
                    this.clickWrongButton();
                } else {
                    this.sound.play("hitErro");
                }

        } else {

            console.log("Fora do painel!");

        }
    },

    error_places: function(){

        if(this.currentLevel == 1){

            if(this.random_question == 0){
                if(this.check_click_position(-108, +121, -199, -124)){
                    return true;
                }
            } else if(this.random_question == 1){
                if(this.check_click_position(-133, 142, -198, -117)){
                    return true;
                }
            } else {
                if(this.check_click_position(-116, +105, -199, -122)){
                    return true;
                }
            }

        } else if (this.currentLevel == 2){

            if (this.random_question == 3){
                if(this.check_click_position(-156, -2, -175, -128) || this.check_click_position(17, 162, -175, -128)){
                    return true;
                }
            } else if (this.random_question == 4){
                if(this.check_click_position(-157, -30, -169, -133) || this.check_click_position(-24, 167, -180, -134)){
                    return true;
                }
            } else {
                if(this.check_click_position(-156, -17, -177, -134) || this.check_click_position(-6, 61, -178, -135)){
                    return true;
                }
            }

        } else {

            if (this.random_question == 6){
                if(this.check_click_position(-146, -116, -249, -217) || this.check_click_position(-102, +27, -261, -214) || this.check_click_position(43, 160, -261, -214) || this.check_click_position(-116, +75, -180, -132) || this.check_click_position(91, 121, -168, -132) || this.check_click_position(-60, 71, -85, -49)){
                    return true;
                }
            } else if (this.random_question == 7){
                if(this.check_click_position(-125, -95, -249, -217) || this.check_click_position(-74, 63, -259, -214) || this.check_click_position(76, 135, -260, -218) || this.check_click_position(-84, 55 , -171, -133) || this.check_click_position(69, 101, -183, -134) || this.check_click_position(-78, 94, -92, -51)){
                    return true;
                }
            } else {
                if(this.check_click_position(-79, -53, -250, -218) || this.check_click_position(-35, 89, -260, -216) || this.check_click_position(-88, 9, -171, -135) || this.check_click_position(25, 94, -169, -134) || this.check_click_position(-49, +67, 91, 52)){
                    return true;
                }
            }

        }

    },

    check_click_position: function(x_inicial, x_final, y_inicial, y_final){

        if(this.input.x > this.buttons[0].x + x_inicial && this.input.x < this.buttons[0].x + x_final && this.input.y > 
            this.buttons[0].y + y_inicial && this.input.y < this.buttons[0].y + y_final ){
                return true;
        }

    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {

        this.groupIntro = this.add.group();

        var t2 = " VAMOS PINTAR AS [LETRAS] QUE ELE \n ESTAVA PRATICANDO?  "
        var t3 = " NESSA PALAVRA AQUI ELE ESTAVA PRATICANDO O [T], \n ENTÃO PINTAMOS TODOS OS [TS] QUE SE REPETEM. \n ONDE ESTÃO AS OUTRAS LETRAS QUE O BUMBA \n PRATICOU? CLIQUEM NELAS! ";
        this.tutorialText = this.drawText(this.world.centerX, 35, t2, 22, "left");
        this.tutorialText.alpha = 0;
        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.groupIntro.add(this.tutorialText);

        // gera um item errado de acordo com a lista
        var _letters = [7, 10];

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX, 580, 6) );

        this.groupIntro.add(this.buttons[0]);

        this.draw_letter = [ -78 , -246, -31, -246, 114, -246, -92, -164, -36 , -83, 25, -83];

        this.createDelayTime(100, function(){
            this.showFinishedLiveTutorial();
        });

        this.createDelayTime(4000, function(){
            this.add.tween(this.tutorialPlacar).to({y: -100}, 300, Phaser.Easing.Linear.None, true, 500);
            this.add.tween(this.tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.tutorialText = this.drawText(this.world.centerX, 25, t3, 22, "left");
                this.tutorialText.alpha = 0;
                this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
                this.groupIntro.add(this.tutorialText);
            }, this);
        });

    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showFinishedLiveTutorial:function() {

        this.createDelayTime( 5000, function() {
            
            this.arrow = this.add.sprite(this.world.centerX, this.world.centerY+50, "arrow");
            this.arrow.anchor.set(0.5,0.5);
            this.add.tween(this.arrow).to({x: this.buttons[0].x + this.draw_letter[0], y: this.buttons[0].y + this.draw_letter[1]}, 1000, Phaser.Easing.Linear.None, true);
            this.groupIntro.add(this.arrow);

        });

        this.createDelayTime( 6000, function() {

            this.buttons.push( this.createButton( this.draw_letter[0],this.draw_letter[1], 6, 6) );

            this.click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
            this.click.animations.add('idle', null, 18, true);
            this.click.animations.play('idle');

            this.groupIntro.remove(this.arrow);
            this.groupIntro.add(this.buttons[1]);
            this.groupIntro.add(this.click);
            this.groupIntro.add(this.arrow);
        });

        // remover click
        this.createDelayTime( 6800, function() {
            this.click.alpha = 0;
            this.click.destroy();
        });

        this.draw_intro(7000, 2, 3,2);
        this.draw_intro(9000, 4, 5,3);
        this.draw_intro(11000, 6, 7,4);
        this.draw_intro(13000, 8, 9,5);
        this.draw_intro(15000, 10, 11,6);

        // remover tudo
        this.createDelayTime( 17500, function() {

            this.bumba.animations.play("comemora");

            this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);
        });

    },

    draw_intro: function( time_value, draw_1, draw_2, array_value){
        this.createDelayTime( time_value, function(){
            this.add.tween(this.arrow).to({x: this.buttons[0].x + this.draw_letter[draw_1], y: this.buttons[0].y + this.draw_letter[draw_2]}, 1000, Phaser.Easing.Linear.None, true);
        });

        this.createDelayTime( time_value + 1200, function() {
            this.buttons.push( this.createButton( this.draw_letter[draw_1],this.draw_letter[draw_2],6, 6) );

            this.click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
            this.click.animations.add('idle', null, 18, true);
            this.click.animations.play('idle');

            this.groupIntro.remove(this.arrow);
            this.groupIntro.add(this.buttons[array_value]);
            this.groupIntro.add(this.click);
            this.groupIntro.add(this.arrow);
        });

        this.createDelayTime( time_value + 2000, function() {
            this.click.alpha = 0;
            this.click.destroy();
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
        var t1 = "As letras podem se repetir em uma \n mesma palavra ou em uma mesma frase. \n É uma festa de letras iguais acompanhadas de \n outras letras e isso acontece o tempo \n todo. De novo! ";
        var tutorialText = this.drawText(this.world.centerX, 30, t1, 22, "center");
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
        this.bumba.animations.play('idle');

        this.click_wrong = true;

        this.letters = [];
        this.letters_position = [];

        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
            switch(levelNum) {
                case 1:

                    this.showQuestion(1);
                    if(this.showCallToAction) {
                        this.initLevel1();
                    } else {
                        this.sound.play("pergunta_1").onStop.addOnce(this.initLevel1, this);
                    }
                break;
                case 2:

                    this.showQuestion(2);
                    if(this.showCallToAction) {
                        this.initLevel3();
                    } else {
                        this.sound.play("pergunta_2").onStop.addOnce(this.initLevel2, this);
                    }
                break;
                case 3:

                    this.showQuestion(3);
                    if(this.showCallToAction) {
                        this.initLevel3();
                    } else {
                        this.sound.play("pergunta_3").onStop.addOnce(this.initLevel3, this);
                    }
                break;
            }
            this.showCallToAction = false;
        }, this);
    },

    /**
    *
    * Controle de Perguntas, que serão mostradas no jogo
    * 
    **/
    showQuestion: function(num) {

        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        var questionList = [ null,
            "Olhem só a letra que está em cima \n do cartaz. Onde ela se repete nessa \n palavra? Vamos pintar? ",
            "Onde será que essa letra de cima se \n repete agora? Hora de pintar!",
            "E esta aqui de cima se repete muito \n mais vezes. Vamos lá?"
        ];
        if (this.currentLevel == 1) this.imageQuestion = this.drawText(this.world.centerX, 20, questionList[num]);
        else this.imageQuestion = this.drawText(this.world.centerX, 40, questionList[num]);
        this.imageQuestion.alpha = 0;

        /*if(this.showCallToAction) {
            return;
        }*/
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    initLevel1: function() {

        this.groupLevel = this.add.group();

        this.letters = [];

        this.random_question = this.rnd.integerInRange(0,2);
        this.level_corrects_total = 2;

        switch(this.random_question){
            case 0:
                this.letters = [-105, -55, -210, -80, -5, 50, -210, -80];
                this.draw_letter = [ -90 , -164, 10, -164];
                break;
            case 1:
                this.letters = [-134, -61, -200, -122, -22, 52, -200, -122];
                this.draw_letter = [ -102 , -164, 10, -164];
                break;
            case 2:
                this.letters = [-99, -41, -200, -114, -18, 38, -200, -114];
                this.draw_letter = [ -68 , -164, 10, -164];
                break;
        }

        console.log("1º group: "+ this.letters[0]);
        console.log("2º group: "+ this.letters[4]);

        // gera um item errado de acordo com a lista

        console.log(" O valor de letters 0 :", this.random_question);

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX, 580, this.random_question) );
        this.buttons[0].inputEnabled = true;
        this.buttons[0].events.onInputDown.add(this.level_clicked, this);

        this.groupLevel.add(this.buttons[0]);
    },

    

    initLevel2: function() {

        this.groupLevel = this.add.group();

        this.letters = [];

        this.random_question = this.rnd.integerInRange(3,5);
        this.level_corrects_total = 3;

        switch(this.random_question){
            case 3:
                this.letters = [-155, -114, -189, -131, -81, -39, -189, -132, 19, 64, -189, -129];
                this.draw_letter = [ -130 , -164, -56, -164, 44, -164];
                break;
            case 4:
                this.letters = [-159, -121, -186, -126, -96, -57, -183, -129, -25, 12, -180, -130];
                this.draw_letter = [ -134 , -164, -71, -164, -2, -164];
                break;
            case 5:
                this.letters = [-152, -112, -189, -131, -87, -47, -189, -131, -2, 40, -189, -131];
                this.draw_letter = [ -130 , -166, -65, -166, 21, -166];
                break;
        }
        // gera um item errado de acordo com a lista

        console.log("1º group: "+ this.letters[0]);
        console.log("2º group: "+ this.letters[4]);
        console.log("3º group: "+ this.letters[8]);

        console.log(" O valor de letters 0 :", this.random_question);

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX, 580, this.random_question) );
        this.buttons[0].inputEnabled = true;
        this.buttons[0].events.onInputDown.add(this.level_clicked, this);

        this.groupLevel.add(this.buttons[0]);
    },

    initLevel3: function() {

        this.groupLevel = this.add.group();

        this.letters = [];

        this.random_question = this.rnd.integerInRange(6,8);
        this.level_corrects_total = 5;

        switch(this.random_question){
            case 6:
                this.level_corrects_total = 6;
                this.letters = [-100, -65, -264, -215, -51, -18, -264, -215, 90, 128, -264, -215, -115, -78, -185, -132, -58, -21, -100, -50, 4, 39, -100, -50];
                this.draw_letter = [ -78 , -246, -31, -246, 114, -246, -92, -164, -36 , -83, 25, -83];
                break;
            case 7:
                this.letters = [-80, -44, -260, -210, -16, 15, -260, -210, -95, -55, -181, -132, -87, -50, -100, -50, -24, 13, -100, -50];
                this.draw_letter = [ -54 , -246, 6, -246, -68, -164, -61, -83, 0 ,-83];
                break;
            case 8:
                this.letters = [-34, -4, -264, -213, 25, 64, -264, -213, -87, -47, -182, -130, -62, -21, -100, -50, 1, 39, -100, -50];
                this.draw_letter = [ -10 , -246, 49, -246, -62, -164, -35, -83, 25 ,-83];
                break;
        }

        console.log("1º group: "+ this.letters[0]);
        console.log("2º group: "+ this.letters[4]);
        console.log("3º group: "+ this.letters[8]);
        console.log("4º group: "+ this.letters[12]);
        console.log("5º group: "+ this.letters[16]);
        console.log("6º group: "+ this.letters[20]);
        // gera um item errado de acordo com a lista

        console.log(" O valor de letters 0 :", this.random_question);

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX, 580, this.random_question) );
        this.buttons[0].inputEnabled = true;
        this.buttons[0].events.onInputDown.add(this.level_clicked, this);

        this.groupLevel.add(this.buttons[0]);
    },

    /**
    *
    * Controle de Perguntas, que serão mostradas no jogo
    * 
    **/
    createButton: function( x, y, imagem, letter) {

        var btn;

        if( letter == null || letter == undefined){
            btn = this.add.button(x,y, 'paineis', null, this, imagem,imagem,imagem);
            btn.anchor.set(0.5,1);

            btn.alpha = 0;
            btn.scale.set(0.5,0.5);

            this.add.tween(btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(btn.scale).to({x: 0.9, y: 0.9}, 500, Phaser.Easing.Linear.None, true);
        } else {
            btn = this.add.button( this.buttons[0].x + x, this.buttons[0].y + y, 'right_letters', null, this,imagem,imagem,imagem);
            btn.anchor.set(0.5,0.5);

            btn.alpha = 0;
            btn.scale.set(0.9,0.9);

            this.add.tween(btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        }

        return btn;
    },
    

    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção CORRETA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickRightButton: function(value) {

        if(this.letters_position_corrects[value] != 1){

            this.level_corrects++;
            this.sound.play("hitAcerto");

            this.letters_position_corrects[value] = 1;

            if( this.level_corrects == this.level_corrects_total ){

                this.bumba.animations.stop();
                this.bumba.animations.play('comemora');

                this.createDelayTime( 2000, function(){
                    this.onPlayerSuccess();
                    this.clearButtons(false);
                    this.gotoNextLevel();
                });

            }

        }

    },




    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção ERRADA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickWrongButton: function() {
        
        if(this.click_wrong){
            this.click_wrong = false;
            if(this.currentLocalErrors > 0) {
                
                this.currentLocalErrors--;

                this.sound.play("hitErro");
                this.click_wrong = true;
                this.onErrorChance();
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
        }
    },

    /**
    *
    * Função disparada como callback case o usuario ainda possua mais de uma chance de clicar no item antes de ser considerado como erro
    * 
    **/
    onErrorChance: function() {
        
    },

    /**
    *
    * Função Auxiliar disparada quando o jogador acerta a pergunta.
    * 
    **/

};





