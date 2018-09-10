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
        this.totalErro1 = 1;
        this.totalErro2 = 1;
        this.totalErro3 = 1;

        /*****************************************************************/
        this.keyboard_permission = false;
        this.right_keyboard_answear;
        this.input.keyboard.addCallbacks(this, null, null, this.keyPress);

        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

        this.groupLevel = [null,1,2,3];

        this.questions = [
            "Vamos resolver isso já!\nVamos resolverisso jâ!",
            "Não tem!\nNao tem!",
            "Vamos resolver.\nVamosresolver.",
            "Onde ele foi?\nOnde ele foi ",
            "Como vamos resolver isso?\nComovamos resolver isso ",
            "Não alcanço daqui de baixo.\nNao alcanco daqui de baixo.",
            "Preciso de um chá para me acalmar!\nPreciso de um cha para me acalmar ",
            "Esta bagunça está sem pé nem cabeça.\nEsta bagunca está sem pe nem cabeca.",
            "Onde será que está esse ser folclórico?\nOnde sera que esta esse ser folclorico?",
            "Como faço para sistema funcionar direito?\nComo faco para sistema funcionardireito "
        ];

        this.answersSpots = [
            [13, 20],
            [1],
            [5],
            [12],
            [4, 23],
            [1, 9],
            [16, 32],
            [10, 22, 33],
            [8, 17, 33],
            [7, 32, 39]
        ];

        this.answerType = [
            [' ', 'Á'],
            ['Ã'],
            [' '],
            ['?'],
            [' ', '?'],
            ['Ã', 'Ç'],
            ['Á', '!'],
            ['Ç', 'É', 'Ç'],
            ['Á', 'Á', 'Ó'],
            ['Ç', ' ', '?'],
        ];

        this.createScene();
        this.showIntro();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();
        //this.goGame = true;
        this.playSound = false; // para tocar um som de uma vez
        this.som = null; // recebe o som que está tocando

        x = this.createFrase('x');
        this.xWidth = x.width;
        this.xHeight = x.height;
        x.destroy();

        this.inputEnabled = false;
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

        var t1 = "A tela do sistema [C] de Conecturma\n está maluca!";
        var tutorialText1 = this.drawText(530, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "Toda hora mostra duas frases iguais,\n mas a segunda sempre tem um erro!\nOu mais! Vejam, tem um erro aqui, faltou\n [espaço] entre as palavras!";
        var tutorialText2 = this.drawText(this.world.centerX, 20, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var t3 = "Outro bem aqui, o [A] não tem\n acento circunflexo! Pronto,\n um problema a menos. É com a gente!";
        var tutorialText3 = this.drawText(this.world.centerX, 30, t3, 21, "center");
        tutorialText3.alpha = 0;
        this.groupIntro.add(tutorialText3);

        this.kim = this.showKim(3800);

        this.setupLevel(0);

        

        //t1in
        this.add.tween(tutorialText1).to({alpha: 1},100, Phaser.Easing.Linear.None, true, 0).onComplete.add(function(){
            this.soundIntro = this.setDebugAudio("soundIntro");
            this.soundIntro.onStop.addOnce(this.showFinishedLiveTutorial, this);
        },this);

        //t1out
        

        this.createDelayTime(3600, function(){
            // alpha em kim
            this.add.tween(this.kim).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.add.tween(this.tutorialPlacar).to({y: -125}, 500, Phaser.Easing.Bounce.Out, true).onComplete.add(function(){
                        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

                    },this);
                },this);
            },this);
        });

        this.createDelayTime(5500, function(){
            this.showLiveTutorial();
        });

        this.createDelayTime(17800, function(){ 
            this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            },this);
        });

        //sound
       
        

        
        

        /*//placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -125}, 500, Phaser.Easing.Bounce.Out, true, 4500);

        //t2in
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 4900);

        //texto
        this.add.tween(this.groupFrase).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 5500).onComplete.add(function(){
            this.showLiveTutorial();
        }, this);

        //t2out
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 17800);
        //t3in
        this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 18000);
        //t3out
        this.add.tween(tutorialText3).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 28000);

        //chama tuto
        this.createDelayTime(13000, function(){;});

        //sound
        this.soundIntro = this.setDebugAudio("soundIntro");
        this.onStopAudio(this.soundIntro, this.showFinishedLiveTutorial);
        */
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");
        tutorialLevel = 0;

        aux = 315;
        auy = 230;
        
        this.arrowGroup = this.game.add.group();
        this.arrowGroup.alpha =0;
        this.arrowGroup.x = aux;
        this.arrowGroup.y = auy;
        this.click = this.add.sprite(0, 0, 'clickAnimation');
        this.arrow = this.add.sprite(0, 0, 'arrow');
        this.click.animations.add('click');
        this.arrowGroup.add(this.arrow);
        this.arrowGroup.add(this.click); 
        this.groupIntro.add(this.arrowGroup);     

        this.game.world.bringToTop(this.arrowGroup);
        
        //aparece
        this.add.tween(this.arrowGroup).to({alpha:1},200, Phaser.Easing.Linear.None, true);
        
        answersPositions = this.calculateAnswer(tutorialLevel, 0);

        //se move até a resposta correta
        this.add.tween(this.arrowGroup).to({x: answersPositions[0] , y: answersPositions[1]}, 1000, Phaser.Easing.Linear.None, true, 10500).onComplete.add(function(){
            this.click.animations.play('click', 30, false);
            this.animateFrase(tutorialLevel, 0, function(){});
            answersPositions = this.calculateAnswer(tutorialLevel, 1);
            this.add.tween(this.arrowGroup).to({x: answersPositions[0] , y: answersPositions[1]}, 1000, Phaser.Easing.Linear.None, true, 1200).onComplete.add(function(){
                this.click.animations.play('click', 30, false);
                this.animateFrase(tutorialLevel, 1, function(){});
            }, this);
        }, this);
    },    

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showFinishedLiveTutorial:function() {
        console.log("showFinishedLiveTutorial");
        this.add.tween(this.groupIntro).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
           this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this); 
        },this);
    },


    /**
    *
    * Função para iniciar o jogo em si. Chamada após a introdução ou ao clicar no botão de skip.
    * Ela esconde o placar, remove o grupo da introdução e mostra o primeiro level do jogador
    * 
    **/
    initGame: function() {

        console.log("initGame");
        
        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        if(this.groupIntro != null) {
            this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.groupIntro.removeAll(true);
            }, this);
        }
        
        if(this.arrowGroup != null) {
            this.arrowGroup.removeAll(true);
        }
        if(this.groupFrase != null) {
            this.add.tween(this.groupFrase).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.groupFrase.removeAll(true);
                this.showNextLevel();
               
            }, this);
        } else {
            this.showNextLevel();
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
                    this.createDelayTime(500, function() {
                        this.showNextLevel();
                    });
                }else{
                    this.add.tween(this.placar).to({y: -120}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
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
        this.background = this.add.sprite(0, 0, 'background');
        this.background.width = 1000;
        this.background.height = 600;

        bumba_idle_frames = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
        bumba_jump_frames = [17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39];
        this.bumba = this.add.sprite(910, 450, 'anim_bumba');
        this.bumba.animations.add('idle', bumba_idle_frames, 18, true);
        this.bumba.animations.add('jump', bumba_jump_frames, 18, true);
        this.bumba.animations.play('idle');
        this.bumba.anchor.set(0.5, 0.5);
    },    

    createFrase: function(text){
        var frase = this.add.bitmapText(0, 0, "lucky-64", text.toUpperCase(), 64);
        frase.tint = 0x0C5B7C;
        return frase;
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

        this.add.tween(this.tutorialPlacar).to({y: -60}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextResumo, this);

        this.add.tween(this.groupFrase).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
    },

    /**
    *
    * Função que mostra o texto do resumo.
    * Ao final chama a função global que esconde o resumo
    * 
    **/
    showTextResumo: function() {
        var t1 = "Quando escrevemos, além das letras,\n usamos pontuações, sinais, espaços e\n outras coisinhas que nos ajudam\n a dar mais clareza, sentido ao texto!\n Vamos ficar atentos e recomeçar?";

        var tutorialText1 = this.drawText(this.world.centerX, 60, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 18000);

        this.soundResumo = this.setDebugAudio("soundResumo");

        this.soundResumo.onStop.add(function(){
            this.add.tween(tutorialText1).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.hideResumo();
            }, this);
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

        if(this.groupFrase) {
            this.add.tween(this.groupFrase).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true);
            this.groupFrase.removeAll();
        }

        var levelNum = this.verifyCurrentLevel();

        this.bumba.play('idle');
        console.log("init level", levelNum, this.currentLevel);
        switch(levelNum) {
            case 1:
                sound = this.setDebugAudio("soundP1");
                sound.onStop.addOnce(this.enableEventMouse, this);
                this.initLevel1();
            break;
            case 2:
                sound = this.setDebugAudio("soundP2");
                sound.onStop.addOnce(this.enableEventMouse, this);  
                this.initLevel2();
            break;
            case 3:
                sound = this.setDebugAudio("soundP3");
                sound.onStop.addOnce(this.enableEventMouse, this);
                this.initLevel3();
            break;
        }
    },
           
    initLevel1: function() {
        this.countObjective = 1;
        this.setupLevel(this.game.rnd.integerInRange(1,3));
        //this.setupLevel(1);    
    },

    initLevel2: function() {
        this.countObjective = 2;
        this.setupLevel(this.game.rnd.integerInRange(4,6));
        //this.setupLevel(4);
    },

    initLevel3: function() {
        this.countObjective = 3;
        this.setupLevel(this.game.rnd.integerInRange(7,9));
        //this.setupLevel(7);
    },

    showQuestion: function(num) {
        console.log("***showQuestion ***");
        var questionList = [ null,
            "",
            "",
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

    

    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção CORRETA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickRightButton: function(target) {
        this.inputEnabled = false;
        this.onPlayerSuccess();

        this.setDebugAudio("hitAcerto");
        this.add.tween(this.groupFrase).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 1000).onComplete.add(function(){
            this.destroyBoundingBox();
            this.groupFrase.removeAll();
        }, this);

        this.createDelayTime(1000, function(){
            this.bumba.play('jump');
        });
        
        
        this.createDelayTime(3000, function() {
          this.gotoNextLevel(); 
        }); 
    },
    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção ERRADA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickWrongButton: function(target) {

        this.createDelayTime(1000, function() {
            sound = this.setDebugAudio("hitErro");
            if(this.currentLocalErrors > 0) {
                
                this.currentLocalErrors--;

                
                sound.onStop.addOnce(this.enableEventMouse, this);                //this.onErrorChance(target);
                return;
            }
            
            this.onPlayerError();

            switch(this.lives) {
                case 1: // mostra dica 1
                    this.destroyBoundingBox();
                    this.createDelayTime(500, function() {
                        this.hideLevel(function() {
                            this.soundDica = this.setDebugAudio("soundDica");
                            this.soundDica.onStop.addOnce(this.onCompleteShowDica, this);
                        });
                    }); 
                    
                break;
                case 0: // toca som de resumo
                    this.lives = 0;
                    this.destroyBoundingBox();
                    this.createDelayTime(500, function() {
                        this.hideLevel();
                        this.showResumo(); 
                    });
                    
                break;
            }
            this.updateLivesText();
        });
    },

    ///////////////////////////////////////


    /**
    *
    * Função para gerar valores do nível
    *
    **/ 

    addIntroGroup:function(elem){
        this.groupIntro.add(elem);
    },

    addLevelGroup:function(elem){
        this.groupLevel[this.currentLevel].add(elem);    
    },
    setupLevel: function(question){
        console.log("***--- setupLevel ---***");
        console.log("question: "+question);

        this.count = 0;
        this.canClick = false;

        this.currentQuestion = question;
        this.groupFrase = this.add.group();
        this.remainingAnswers = this.answersSpots[question].slice(0);

        console.log(this.remainingAnswers);

        fraseBase =  this.add.group();
        fraseBaseString = this.questions[question].split('\n')[0]; //parte de cima
        aux = 0;
        for(i = 0; i < fraseBaseString.length; i++){
            
            letra = this.createFrase(fraseBaseString.charAt(i));
            letra.x = aux;
            if(fraseBaseString.charAt(i) == ' ')
                aux += this.xWidth;
            aux += letra.width;
            fraseBase.add(letra);
        }
        this.groupFrase.add(fraseBase);


        aux = 0;
        fraseString = this.questions[question].split('\n')[1]; //parte de baixo

        currentIndex = 0;
        lastIndex = 0;
        
        for(i = 0; i < fraseString.length; i++){
            //console.log(fraseString[i]);
            letra = this.createFrase(fraseString.charAt(i));
            letra.x = aux;
            letra.y = fraseBase.height*1.5;
            if(fraseString.charAt(i) == ' ')
                aux += this.xWidth;
            aux += letra.width;
            this.groupFrase.add(letra);
        }


        if(this.groupFrase.width > 510){
            scale = 510/this.groupFrase.width;
            this.groupFrase.width = this.groupFrase.width*scale;
            this.groupFrase.height = this.groupFrase.height*scale;
        }

        this.groupFrase.x = this.world.centerX - this.groupFrase.width/2;
        this.groupFrase.y = this.world.centerY - this.groupFrase.height/2;
        this.groupFrase.alpha = 0;
        this.game.world.swap(this.groupFrase, this.bumba);

        this.config = new Array([0,0,0,0],[503,357,300,50],[492,352,500,50],[485,356,410,50],[490,333,490,50],[500,333,520,50],[500,333,520,50],[500,333,520,50],[500,333,520,50],[500,333,520,50]);

        if(question>0){
            console.log("createBoundingBox");
            this.fraseSpr =  this.createBoundingBox(this.config[question][0],this.config[question][1],this.config[question][2],this.config[question][3],question,"marca",'#ff0000');
        }  


        this.spriteBoundingBox = [];
        
        this.add.tween(this.groupFrase).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            for(i=0; i<this.remainingAnswers.length; i++){
                if(this.remainingAnswers[i] != -1){
                    this.spriteBoundingBox[i] = this.calculateAnswer(this.currentQuestion, i);
                    this.spriteBoundingBox[i].check = true;

                }
            }
        },this)    
    },

    calculateAnswer: function(question, answer){
        console.log("calculating answer", "question: "+question, "answer: "+answer);
        if(this.answersSpots[question][answer] != -1){
            spot = this.groupFrase.children[this.answersSpots[question][answer]+1];
            x = 0;
            y = 0;
            if(this.answerType[question][answer] == ' '){
                x = spot.world.x;
                y = spot.world.y + this.xHeight/2;
            } else if(this.answerType[question][answer] == '?' || this.answerType[question][answer] == '!'){
                x = spot.world.x + this.xWidth/2;
                y = spot.world.y + this.xHeight/2;
            } else {
                x = spot.world.x + spot.width/2;
                y = spot.world.y + this.xHeight/2;
            }
        }

        if(question>0){
            spr = this.createBoundingBox(x,y,60,60,question,answer,'#000000');
            return spr;
        }else{
            return [x,y];
        }     
    },

    animateFrase: function(question, answer, callback){
        type = this.answerType[question][answer];
        spot = this.answersSpots[question][answer];

        if(spot == 4 || spot == 5) { spot = spot - 1;}

        if(spot == 32 && question == 6) { spot = 33;}

        if(spot == 22) { spot = 23;}

        if(spot == 32 && question == 9) { spot = 31;}

        console.log("animate frase", "question: "+question, "answer: "+spot)
        if(type == ' '){
            spot+=2;
            for(i = spot; i < this.groupFrase.children.length; i++){
                letter = this.groupFrase.children[i];
                if(i == this.groupFrase.children.length-1)
                    this.add.tween(letter).to({x: letter.x + this.xWidth}, 1000, Phaser.Easing.Elastic.InOut, true).onComplete.add(callback, this);
                else
                    this.add.tween(letter).to({x: letter.x + this.xWidth}, 1000, Phaser.Easing.Elastic.InOut, true);

            }
        } else {
            spot++;
            this.add.tween(this.groupFrase.children[spot]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.groupFrase.children[spot].text = type;
                this.add.tween(this.groupFrase.children[spot]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(callback, this);
            }, this);
        }
    },

    playAnswer: function(question, answer, callback){
        soundName = "soundP";
        if(question >= 1 && question <= 3){
            soundName += "1_"+question;
        } else {
            if(question >= 4 && question <= 6){
                soundName += "2_"+(question-3)+"_";
            } else if(question >= 7 && question <= 9){
                soundName += "3_"+(question-6)+"_";
            }
            switch(answer){
                case 0:
                    soundName += "A";
                    break;
                case 1:
                    soundName += "B";
                    break;
                case 2:
                    soundName += "C";
                    break;
            }
        } 
        sound = this.setDebugAudio(soundName);
        sound.onStop.addOnce(callback, this);
        console.log("playing ", soundName);
    },

    createBoundingBox:function(x,y,tamX, tamY,question, answer,cor){
        // create a new bitmap data object
        var bmd = this.game.add.bitmapData(tamX,tamY);

        // draw to the canvas context like normal
        bmd.ctx.beginPath();
        bmd.ctx.rect(0,0,tamX,tamY);
        bmd.ctx.fillStyle = cor;
        bmd.ctx.fill();

        // use the bitmap data as the texture for the sprite
        var spr = this.addSpriteMeu(x, y, bmd,question, answer);
        spr.alpha=0;


        //this.groupFrase.add(spr);
        return spr;
    },


    enableEventMouse:function(){
        console.log("***enableEventMouse***");
        this.canClick = true;
        tam = this.spriteBoundingBox.length;
        for(i=0; i<tam; i++){  
            console.log("button "+i);       
            this.spriteBoundingBox[i].inputEnabled = true;
            this.spriteBoundingBox[i].input.useHandCursor = true;
            this.spriteBoundingBox[i].events.onInputDown.add(this.mouseInputDownBoundingBox, this); // click no mouse 
        }

        this.fraseSpr.inputEnabled = true;
        this.fraseSpr.input.useHandCursor = true;
        this.fraseSpr.events.onInputDown.add(this.mouseInputDownBoundingBox, this); // click no mouse 
    },

    //this.buttons[i].input.reset();

    disableEventMouse:function(tipo,elem){
        console.log("***enableEventMouse***");

        if(tipo==1){

            tam = this.spriteBoundingBox.length;
            for(i=0; i<tam; i++){  
                console.log("button "+i);       
                this.spriteBoundingBox[i].inputEnabled = false;
                this.spriteBoundingBox[i].input.useHandCursor = false;
                this.spriteBoundingBox[i].input.reset();
                //this.spriteBoundingBox[i].destroy();

            }

            this.fraseSpr.inputEnabled = false;
            this.fraseSpr.input.useHandCursor = false;
            this.fraseSpr.input.reset();
            //this.fraseSpr.destroy();
            
        }else{

            elem.inputEnabled = false;
            elem.input.useHandCursor = false;
            elem.input.reset();

        }     
    },

    destroyBoundingBox:function(){
        for(i=0; i<tam; i++){  
            console.log("button "+i);       
            this.spriteBoundingBox[i].destroy();
        }
        this.fraseSpr.destroy();
    },


    mouseInputDownBoundingBox:function(elem){
        console.log("***mouseInputDownBoundingBox***");    
        console.log("question "+elem.question);
        console.log("answer "+elem.answer);
        //alert("answer "+elem.answer);
       
        if(this.canClick){
            this.checkGame(elem);
        }
    },

    checkGame:function(elem){
        console.log("***checkGame***");

        tam = this.spriteBoundingBox.length;
        if(this.currentQuestion == elem.question){
            if(elem.answer=="marca"){
                console.log("ERRADA");
                this.disableEventMouse(1,elem);
                this.clickWrongButton();
            }else{

                console.log("elem.check: "+elem.check);
                if(elem.check){
                    this.disableEventMouse(1,elem);
                    elem.check = false;
                    this.count++;
                    console.log("elem.question: " + elem.question);
                    console.log("elem.answer: " + elem.answer);
                    this.animateFrase(elem.question,elem.answer, function(){
                        console.log("CORRETA");
                        this.playAnswer(elem.question,elem.answer, function(){
                            if(this.count==tam){
                                this.disableEventMouse(1,elem);
                                this.clickRightButton();
                            }else{
                                this.enableEventMouse();
                            }
                        }, this);
                    }, this);   

                }
                 
            }
        }
    },

    addSpriteMeu:function(x,y,sprite,question,answer){
        spr = this.game.add.sprite(x,y, sprite);
        spr.anchor.set(0.5,0.5);
        //spr.alpha=0.5;
        spr.answer = answer;
        spr.question = question;
        //this.enableDragDropMeu(spr);
        return spr;
    },

      /**** editor *****/
    // somente habilitar em caso da criacao da cena e posicionamento dos elementos 

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

    },*/
    
    
    

};