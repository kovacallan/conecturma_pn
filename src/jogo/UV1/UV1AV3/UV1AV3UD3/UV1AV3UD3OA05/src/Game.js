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

        this.waypoint1 = new Object();
        this.waypoint2 = new Object();
        this.waypoint3 = new Object();
        this.waypoint4 = new Object();
        this.waypointCorner1 = new Object();
        this.waypointCorner2 = new Object();
        this.waypointCorner3 = new Object();
        this.waypointCorner4 = new Object();
        this.waypointFork1 = new Object();
        this.waypointFork2 = new Object();
        this.waypointCenter = new Object();

        this.waypoint1.x = 150;
        this.waypoint1.y = 180;
        this.waypoint1.answer = false;
        this.waypoint1.up = null;
        this.waypoint1.down = null;
        this.waypoint1.left = null;
        this.waypoint1.right = null;
        this.waypoint1.down = this.waypointCorner1;

        this.waypoint2.x = 410;
        this.waypoint2.y = 520;
        this.waypoint2.answer = false;
        this.waypoint2.up = null;
        this.waypoint2.down = null;
        this.waypoint2.left = null;
        this.waypoint2.right = null;
        this.waypoint2.left = this.waypointCorner2;

        this.waypoint3.x = 645;
        this.waypoint3.y = 150;
        this.waypoint3.answer = false;
        this.waypoint3.up = null;
        this.waypoint3.down = null;
        this.waypoint3.left = null;
        this.waypoint3.right = null;
        this.waypoint3.right = this.waypointCorner3;

        this.waypoint4.x = 800;
        this.waypoint4.y = 520;
        this.waypoint4.answer = false;
        this.waypoint4.up = null;
        this.waypoint4.down = null;
        this.waypoint4.left = null;
        this.waypoint4.right = null;
        this.waypoint4.up = this.waypointFork2;

        this.waypointCorner1.x = 105;
        this.waypointCorner1.y = 345;
        this.waypointCorner1.up = null;
        this.waypointCorner1.down = null;
        this.waypointCorner1.left = null;
        this.waypointCorner1.right = null;
        this.waypointCorner1.up = this.waypoint1;
        this.waypointCorner1.right = this.waypointFork1;
        
        this.waypointCorner2.x = 180;
        this.waypointCorner2.y = 520;
        this.waypointCorner2.up = null;
        this.waypointCorner2.down = null;
        this.waypointCorner2.left = null;
        this.waypointCorner2.right = null;
        this.waypointCorner2.right = this.waypoint2;
        this.waypointCorner2.up = this.waypointFork1;

        this.waypointCorner3.x = 840;
        this.waypointCorner3.y = 150;
        this.waypointCorner3.up = null;
        this.waypointCorner3.down = null;
        this.waypointCorner3.left = null;
        this.waypointCorner3.right = null;
        this.waypointCorner3.left = this.waypoint3;
        this.waypointCorner3.down = this.waypointCorner4;

        this.waypointCorner4.x = 900;
        this.waypointCorner4.y = 345;
        this.waypointCorner4.up = null;
        this.waypointCorner4.down = null;
        this.waypointCorner4.left = null;
        this.waypointCorner4.right = null;
        this.waypointCorner4.up = this.waypointCorner3;
        this.waypointCorner4.left = this.waypointFork2;

        this.waypointFork1.x = 220;
        this.waypointFork1.y = 345;
        this.waypointFork1.up = null;
        this.waypointFork1.down = this.waypointCorner2;
        this.waypointFork1.left = this.waypointCorner1;
        this.waypointFork1.right = this.waypointCenter;

        this.waypointFork2.x = 790;
        this.waypointFork2.y = 345;
        this.waypointFork2.up = null;
        this.waypointFork2.down = this.waypoint4;
        this.waypointFork2.left = this.waypointCenter;
        this.waypointFork2.right = this.waypointCorner4;


        this.waypointCenter.x = 500;
        this.waypointCenter.y = 345;
        this.waypointCenter.up = null;
        this.waypointCenter.down = null;
        this.waypointCenter.left = null;
        this.waypointCenter.right = null;
        this.waypointCenter.left = this.waypointFork1;
        this.waypointCenter.right = this.waypointFork2;

        this.currentWaypoint = this.waypointCenter;
        this.rightWaypoint = null;

        this.waypointsAnswers = [
            this.waypoint1,
            this.waypoint2,
            this.waypoint3,
            this.waypoint4
        ];


        this.questions = [
            500,
            300,
            400,
            600
        ]

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

        var t1 = "Algo deixou as salas de circuitos\n molhadas! Bumba já recolheu boa parte\n do líquido, mas as 4 garrafas que\n ele tem ainda precisam ser preenchidas.";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "É fácil, Pi vai andar pelas salas, subindo,\n descendo, indo para os lados e vai achar as\n quantidades de água que precisamos\n para completar um litro.";
        var tutorialText2 = this.drawText(this.world.centerX, 15, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var t3 = "Assim: se eu tenho uma garrafa com meio litro,\n eu preciso levar Pi até a poça de meio litro,\n ou seja, 500 ml, pra completar\n a garrafa! Vamos lá!";
        var tutorialText3 = this.drawText(this.world.centerX, 15, t3, 21, "center");
        tutorialText3.alpha = 0;
        this.groupIntro.add(tutorialText3);

        var kim = this.showKim(12000);

        //setup level tutorial
        this.question = this.questions[0]
        this.aguas[0].children[1].frame = 0;
        this.aguas[1].children[1].frame = 4;
        this.aguas[2].children[1].frame = 2;
        this.aguas[3].children[1].frame = 6;

        //t1in
        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        //t1out
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 12500);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -125}, 500, Phaser.Easing.Bounce.Out, true, 12700);
        //t2in
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 13000);
        //t2out
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 26000);
        //t3in
        this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 26200);
        //t3out
        this.add.tween(tutorialText3).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 42000);

        //pi
        this.add.tween(this.pi).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 14000);

        this.add.tween(this.pi).to({x: this.waypointFork1.x, y: this.waypointFork1.y}, 1000, Phaser.Easing.Linear.None, true, 32000).onComplete.add(function(){
                this.add.tween(this.pi.scale).to({x: this.piScale*1.15, y: this.piScale*1.15}, 1000, Phaser.Easing.Linear.None, true, 500);
                this.add.tween(this.pi).to({x: this.waypointCorner2.x, y: this.waypointCorner2.y}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
                        this.add.tween(this.pi).to({x: this.waypoint2.x, y: this.waypoint2.y}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
                                this.pi.frame = 0;
                        }, this);
                }, this);
        }, this);


        this.createDelayTime(32000, function(){
            this.pi.frame = 1;
            this.teclas.children[1].frame++;
            this.createDelayTime(500, function(){
                this.teclas.children[1].frame--;
            });
        });
        this.createDelayTime(33500, function(){
            this.pi.frame = 0;
            this.teclas.children[3].frame++;
            this.createDelayTime(500, function(){
                this.teclas.children[3].frame--;
            });
        });
        this.createDelayTime(35000, function(){
            this.pi.frame = 3;
            this.teclas.children[2].frame++;
            this.createDelayTime(500, function(){
                this.teclas.children[2].frame--;
            });
        });

        //aguas aparecem
        for(i = 0; i < this.aguas.length; i++){
            this.add.tween(this.aguas[i].children[0]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 1000);
        }

        //aguas aparecem
        for(i = 0; i < this.aguas.length; i++){
            this.add.tween(this.aguas[i].children[1]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 16000);
        }

        //garrafa
        this.add.tween(this.garrafa).to({x: this.garrafaX}, 500, Phaser.Easing.Linear.None, true, 29000).onComplete.add(function(){
            this.setGarrafaFrame(500, function(){});
            this.add.tween(this.pi).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 3000);
        }, this);

        //teclas
        this.add.tween(this.teclas).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 14000);

        //sound
        this.soundIntro = this.setDebugAudio("soundIntro");
        this.soundIntro.onStop.addOnce(function(){
            this.showFinishedLiveTutorial();
        }, this);
    },
    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showFinishedLiveTutorial:function() {
        console.log("showFinishedLiveTutorial");
        this.add.tween(this.groupIntro).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.tutorialPlacar).to({y: -300}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
    },

    /**
    *
    * Função para gerar valores do nível
    *
    **/ 
    setupLevel: function(question){
        console.log("**setup level** question: "+question);
        this.question = question;
        waypointsAux = [0, 1, 2, 3];
        placasFrameAux = [0, 1, 2, 3, 4, 5, 6, 7, 8];

        answer = waypointsAux.splice(this.game.rnd.integerInRange(0,waypointsAux.length-1),1);

        this.rightWaypoint = this.waypointsAnswers[answer];
        this.rightWaypoint.answer = true;
        placaFrame = placasFrameAux.splice((1000-question)/100 - 1, 1)[0];
        this.aguas[answer].children[1].frame = placaFrame;
        console.log("waypoint "+answer, "placaFrame"+placaFrame);

        while(waypointsAux.length > 0){
            n = waypointsAux.splice(this.game.rnd.integerInRange(0,waypointsAux.length-1),1);

            this.waypointsAnswers[n].answer = false;

            placaFrame = placasFrameAux.splice(this.game.rnd.integerInRange(0,placasFrameAux.length-1), 1)[0];

            this.aguas[n].children[1].frame = placaFrame;
            console.log("waypoint "+n, "placaFrame"+placaFrame);
        }
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

        this.add.tween(this.teclas).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.resetLevel();

        this.createDelayTime(1200, function(){
            this.showNextLevel();
        });
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
        if(this.currentLevel <= 3) {
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
        this.add.sprite(0, 0, 'background0');

        this.aguas = [];

        for(i = 0; i < this.waypointsAnswers.length; i++){
            agua = this.add.group();
            aguaSprite = this.add.sprite(0, 0, 'agua');
            aguaSprite.alpha = 0;
            agua.add(aguaSprite);
            placa = this.add.sprite(0, -60, 'placas');
            placa.scale.set(0.5, 0.5);
            placa.alpha = 0;
            agua.add(placa);

            agua.x = this.waypointsAnswers[i].x - placa.width/4;
            agua.y = this.waypointsAnswers[i].y - placa.height/4;
            agua.scale.set(0.8, 0.8);

            this.aguas.push(agua);
        }

        this.pi = this.add.sprite(this.currentWaypoint.x, this.currentWaypoint.y, 'pi');
        this.pi.alpha = 0;
        this.pi.anchor.set(0.5, 1);
        this.piScale = 0.8;
        this.pi.scale.set(this.piScale, this.piScale);

        this.add.sprite(0, 0, 'background1');

        this.garrafaX = 975;
        this.garrafaInitialX = 1100;
        this.garrafa = this.add.sprite(this.garrafaInitialX, 575, 'garrafa');
        this.garrafa.anchor.set(1, 1);

        this.teclas = this.add.group();
        //up
        tecla = this.add.sprite(0, 0, 'teclas');
        tecla.frame = 4;
        tecla.anchor.set(0.5, 0.5);
        tecla.scale.set(0.8, 0.8);
        tecla.events.onInputDown.add(this.mouseInputDown, this);
        this.teclas.add(tecla);
        //left
        tecla = this.add.sprite(-125, 60, 'teclas');
        tecla.frame = 0;
        tecla.anchor.set(0.5, 0.5);
        tecla.events.onInputDown.add(this.mouseInputDown, this);
        this.teclas.add(tecla);
        //right
        tecla = this.add.sprite(125, 60, 'teclas');
        tecla.frame = 2;
        tecla.anchor.set(0.5, 0.5);
        tecla.events.onInputDown.add(this.mouseInputDown, this);
        this.teclas.add(tecla);
        //down
        tecla = this.add.sprite(0, 100, 'teclas');
        tecla.frame = 6;
        tecla.anchor.set(0.5, 0.5);
        tecla.scale.set(1.1, 1.1);
        tecla.events.onInputDown.add(this.mouseInputDown, this);
        this.teclas.add(tecla);

        this.teclas.x = this.world.centerX;
        this.teclas.y = this.world.centerY + 40;
        this.teclas.scale.set(0.5, 0.5);
        this.teclas.alpha = 0;
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
        var t1 = "Um [litro] tem [mil mililitros]! [Meio litro]\n tem [500 mililitros], porque [500] é a metade\n de [mil], sacaram?";

        var tutorialText1 = this.drawText(this.world.centerX, 60, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        var t2 = "E existem todas as outras quantidades\n diferentes, como [200], [300] [mililitros...] num copo\n d'água, por exemplo, cabem mais ou menos\n uns [300] [mililitros]! Legal, né?";

        var tutorialText2 = this.drawText(this.world.centerX, 40, t2, 22, "center");
            tutorialText2.alpha = 0;
            this.groupIntro.add(tutorialText2);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 13000);
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 13200);
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 29000);

        this.soundResumo = this.sound.play("soundResumo");

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(this.groupIntro).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
            this.hideResumo();
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

        switch(levelNum) {
            case 1:
                this.initLevel1();
            break;
            case 2:
                this.initLevel2();
            break;
            case 3:
                this.initLevel3();
            break;
        }
    },
           
    initLevel1: function() {
        sound = this.sound.play("soundP1");
        sound.onStop.addOnce(function(){
            this.relogioTimer = this.game.time.events.add(180000, this.stopTime, this);
            this.teclas.setAll('inputEnabled', true);
        }, this);
        this.question = this.questions[1];
        this.setupLevel(this.question);
        this.showLevel();
    },

    initLevel2: function() {
        sound = this.sound.play("soundP2");
        sound.onStop.addOnce(function(){
            this.relogioTimer = this.game.time.events.add(180000, this.stopTime, this);
            this.teclas.setAll('inputEnabled', true);
        }, this);
        this.question = this.questions[2];
        this.setupLevel(this.question);
        this.showLevel(); 
    },

    initLevel3: function() {
        sound = this.sound.play("soundP3");
        sound.onStop.addOnce(function(){
            this.relogioTimer = this.game.time.events.add(180000, this.stopTime, this);
            this.teclas.setAll('inputEnabled', true);
        }, this);
        this.question = this.questions[3];
        this.setupLevel(this.question);
        this.showLevel();
    },

    mouseInputDown:function(elem){ // elem = elemento que foi clicado
        console.log("***mouseInputDown***");
        tecla = -1;
        piDirection = -1;
        switch(elem.frame){
            case 4:
                console.log('up');
                if(this.currentWaypoint.up != null){
                    tecla = 0;
                    piDirection = 2;
                    this.currentWaypoint = this.currentWaypoint.up;
                }
                break;
            case 0:
                console.log('left');
                if(this.currentWaypoint.left != null){
                    tecla = 1;
                    piDirection = 1;
                    this.currentWaypoint = this.currentWaypoint.left;
                }
                break;
            case 2:
                console.log('right');
                if(this.currentWaypoint.right != null){
                    tecla = 2;
                    piDirection = 3;
                    this.currentWaypoint = this.currentWaypoint.right;
                }
                break;
            case 6:
                console.log('down');
                if(this.currentWaypoint.down != null){
                    tecla = 3;
                    piDirection = 0;
                    this.currentWaypoint = this.currentWaypoint.down;
                }
                break;
        }
        if(tecla != -1 && piDirection != -1){
            this.teclas.setAll('inputEnabled', false);
            this.teclas.children[tecla].frame++;
            this.teclas.children[tecla].tint = 0xffbb17;
            this.pi.frame = piDirection;
            if(this.currentWaypoint.y < 340)
                scale = this.piScale * 0.9;
            else if(this.currentWaypoint.y > 350)
                scale = this.piScale * 1.15;
            else 
                scale = this.piScale;

            this.add.tween(this.pi.scale).to({x: scale, y: scale}, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(this.pi).to({x: this.currentWaypoint.x, y: this.currentWaypoint.y}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.pi.frame = 0;
                    this.teclas.children[tecla].frame--;
                    this.teclas.children[tecla].tint = 0xffffff;
                    this.checkGame();
            }, this);   
        }
    },

    checkGame:function(){
        console.log("***checkGame***");
        if(this.relogioTimer != null){
            if(this.currentWaypoint.answer){
                this.teclas.setAll('inputEnabled', false);
                console.log("CORRETA");
                this.sound.play("hitAcerto");
                if(this.relogioTimer != null){
                    this.game.time.events.remove(this.relogioTimer);
                    this.relogioTimer = null;
                }
                this.clickRightButton();
            } else if(this.waypointsAnswers.indexOf(this.currentWaypoint) != -1){
                console.log("ERRADA");
                this.sound.play("hitErro");
                if(this.relogioTimer != null){
                    this.game.time.events.remove(this.relogioTimer);
                    this.relogioTimer = null;
                }
                this.clickWrongButton();
            } else {
                this.teclas.setAll('inputEnabled', true);
            }
        }
    },

    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção CORRETA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickRightButton: function(target) {
        this.onPlayerSuccess();


        this.setGarrafaFrame(1000, function(){
            this.createDelayTime(1500, this.resetLevel);
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
        this.resetLevel();

        this.createDelayTime(1000, function() {

            if(this.currentLocalErrors > 0) {
                
                this.currentLocalErrors--;

                this.sound.play("hitErro");
                this.onErrorChance(target);
                return;
            }
            
            this.onPlayerError();
            
            switch(this.lives) {
                case 1: // mostra dica 1
                    this.createDelayTime(500, function() {
                        this.sound.play("soundDica").onStop.add(function(){
                            this.createDelayTime(1500, this.onCompleteShowDica);
                        }, this);
                    }); 
                    
                break;
                case 0: // toca som de resumo
                    this.lives = 0;
                    this.createDelayTime(500, function() {
                        this.showResumo(); 
                    });
                    
                break;
            }
            this.updateLivesText();
        });
    },

    resetLevel:function(callback){
        console.log("***resetLevel***");
        
        this.currentWaypoint = this.waypointCenter;
        this.add.tween(this.pi).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.pi.x = this.currentWaypoint.x;
            this.pi.y = this.currentWaypoint.y;
            this.pi.scale.x = this.piScale;
            this.pi.scale.y = this.piScale;
            this.pi.frame = 0;
        }, this);

         for(i = 0; i < this.aguas.length; i++)
            this.add.tween(this.aguas[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        this.add.tween(this.garrafa).to({x: this.garrafaInitialX}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.garrafa.frame = 0;
            if(callback != null)
                callback.call(this);
        }, this);


        this.teclas.children[0].frame = 4;
        this.teclas.children[1].frame = 0;
        this.teclas.children[2].frame = 2;
        this.teclas.children[3].frame = 6;

    },

    showLevel: function(){
        console.log("***showLevel***");
        
        this.add.tween(this.pi).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        for(i = 0; i < this.aguas.length; i++){
            this.add.tween(this.aguas[i]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.aguas[i].children[0]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.aguas[i].children[1]).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        }

        this.add.tween(this.garrafa).to({x: this.garrafaX}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.setGarrafaFrame(this.question, function(){});
        }, this);
        
    },

    setGarrafaFrame: function(question, callback){
        frames = [];
        currentFrame = this.garrafa.frame;
        toFrame = (question)/100 -1;
        console.log("garrafa", currentFrame, toFrame);
        if(currentFrame < toFrame){
            for(i = currentFrame; i <= toFrame; i++)
                frames.push(i);
        } else if(currentFrame > toFrame){
            for(i = currentFrame; i >= toFrame; i--)
                frames.push(i);
        } else 
            return;
        if(frames.length > 0){
            this.garrafa.animations.add('anim', frames, 18, false);
            this.garrafa.play('anim');
            this.garrafa.animations.currentAnim.onComplete.add(callback, this);

        }
        console.log(frames.toString());
    },



    /**
    *
    * Função disparada como callback case o usuario ainda possua mais de uma chance de clicar no item antes de ser considerado como erro
    * 
    **/
    onErrorChance: function(target) {

    },

    addIntroGroup:function(elem){
        this.groupIntro.add(elem);
    },

    addLevelGroup:function(elem){
        this.groupLevel[this.currentLevel].add(elem);    
    },

    stopTime: function(){
        console.log("***time's up!***");
        this.relogioTimer = null;
        this.game.time.events.remove(this.relogioTimer);
        if(this.teclas.children[0].inputEnabled){
            this.teclas.setAll('inputEnabled', false);
            sound = this.sound.play("hitErro");

            if(this.currentLocalErrors > 0) {
                this.currentLocalErrors--;
            } else {
                this.onPlayerError();
            }
                        
            if(this.lives == 0){
                this.createDelayTime(1500, function() {
                    this.resetLevel(this.showResumo);
                });
            } else {
                this.createDelayTime(1500, function() {
                    this.resetLevel(this.showNextLevel);
                });
            }
            this.updateLivesText();
        }
    }


};