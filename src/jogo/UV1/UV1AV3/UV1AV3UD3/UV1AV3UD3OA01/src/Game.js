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
        this.totalLevel2 = 2;
        this.totalLevel3 = 2;

        // quantidade total de erros permitido em cada nivel
        // ex: se valor está definido para 2 erros, usuario pode errar 2x e na terceira é considerado errado
        this.totalErro1 = 0;
        this.totalErro2 = 0;

        /*****************************************************************/
        this.keyboard_permission = false;
        this.right_keyboard_answear;
        this.input.keyboard.addCallbacks(this, null, null, this.keyPress);

        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

        this.groupLevel = [null,1,2,3];

        this.createScene();
        this.showIntro();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();
        //this.goGame = true;
        this.playSound = false; // para tocar um som de uma vez
        this.som = null; // recebe o som que está tocando

        this.selectedHand1 = null;
        this.selectedHand2 = null;

        this.playerUpperHand = false;

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

        var t0 = "Oh, não! Pessoal, alguns Bugs possuíam\n várias pintinhas nas costas, mas na\n maluquice que eles estão, elas caíram!";
        var tutorialText0 = this.drawText(this.world.centerX+60, 30, t0, 21, "left");
        tutorialText0.alpha = 0;
        this.groupIntro.add(tutorialText0);

        var t1 = "O Robocam, que tem várias mãos,\n nos emprestou algumas para\n nos ajudar! O jogo é assim:";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "Contamos quantas pintinhas faltam e clicamos\n nas mãos que dão o número de pintas que caíram\n para que elas voltem!";
        var tutorialText2 = this.drawText(this.world.centerX, 30, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var t3 = "Aqui faltam… hmmm… cinco!\n Só escolher essa daqui!";
        var tutorialText3 = this.drawText(this.world.centerX, 30, t3, 21, "center");
        tutorialText3.alpha = 0;
        this.groupIntro.add(tutorialText3);

        var kim = this.showKim(19000);

        //setup level tutorial
        this.setupLevel(5);

        //t0in
        this.add.tween(tutorialText0).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        //t0out
        this.add.tween(tutorialText0).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 11000);

        //t1in
        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 11200).onComplete.add(function(){
            this.add.tween(this.maos[0]).to({y:this.maos[0].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 2000);
            this.add.tween(this.maos[1]).to({y:this.maos[1].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 3000);
            this.add.tween(this.maos[2]).to({y:this.maos[2].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 4000);
        }, this);
        //t1out
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 19500);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -125}, 500, Phaser.Easing.Bounce.Out, true, 20000).onComplete.add(function(){
            this.add.tween(this.bug).to({x: 500}, 1000, Phaser.Easing.Linear.None, true);
        }, this);
        //t2in
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 20500).onComplete.add(function(){
            this.showLiveTutorial();
        }, this);
        //t2out
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 29000);
        //t3in
        this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 29500);
        
        //sound
        this.soundIntro = this.sound.play("soundIntro");
        this.soundIntro.onStop.addOnce(this.showFinishedLiveTutorial, this);
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");

        aux = this.bug.x;
        auy = this.bug.y;
        
        this.arrowGroup = this.game.add.group();
        this.arrowGroup.alpha =0;
        this.arrowGroup.x = aux;
        this.arrowGroup.y = auy;
        this.click = this.add.sprite(0, 0, 'clickAnimation');
        this.arrow = this.add.sprite(0, 0, 'arrow');
        this.click.animations.add('click');
        this.arrowGroup.add(this.arrow);
        this.arrowGroup.add(this.click);        

        this.game.world.bringToTop(this.arrowGroup);
        
        this.add.tween(this.arrowGroup).to({alpha:1},200, Phaser.Easing.Linear.None, true);
        
        this.add.tween(this.arrowGroup).to({x: this.maos[this.answerHand].x , y: this.maos[this.answerHand].y-50}, 1000, Phaser.Easing.Linear.None, true, 15200).onComplete.add(function(){
            this.click.animations.play('click', 30, false);
        }, this);
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
    * Função para gerar valores do nível
    *
    **/ 
    setupLevel: function(question){
        console.log("question: "+question);
        this.bug.frame = 9-question;
        answers = [0,1,2,3,4,5];
        maosPositions = [0,1,2];
        this.answerHand = -1;
        this.answerHand2 = -1;

        this.dualAnswer = false;
        if(question <= 5){
            answer = question;
        } else {
            answer = question - 5;
            this.dualAnswer = true;
            console.log("Dual answer!");
        }

        //escolhe maos
        if(this.dualAnswer){
            //mao 5
            this.answerHand2 = maosPositions.splice( this.game.rnd.integerInRange(0,maosPositions.length-1), 1)[0];
            console.log("answer hand2 "+this.answerHand2);
            this.maos[this.answerHand2].frame = answers.splice(5, 1)[0]; 

            //mao certa
            this.answerHand = maosPositions.splice( this.game.rnd.integerInRange(0,maosPositions.length-1), 1)[0];
            console.log("answer hand "+this.answerHand);
            this.maos[this.answerHand].frame = answers.splice(answer, 1)[0];

            //mao remanescente
            this.maos[maosPositions.splice( this.game.rnd.integerInRange(0,maosPositions.length-1), 1)[0]].frame = answers.splice(answers.length-1, 1)[0]; 
        } else {
            this.answerHand = maosPositions.splice( this.game.rnd.integerInRange(0,maosPositions.length-1), 1)[0];
            console.log("answer hand "+this.answerHand);
            this.maos[this.answerHand].frame = answers.splice(answer, 1)[0];

            this.maos[maosPositions.splice( this.game.rnd.integerInRange(0,maosPositions.length-1), 1)[0]].frame = answers.splice(answers.length-1, 1)[0]; 

            this.maos[maosPositions.splice( this.game.rnd.integerInRange(0,maosPositions.length-1), 1)[0]].frame = answers.splice(answers.length-1, 1)[0]; 

        }

        console.log(answers.toString());
        console.log(this.maos[0].frame+" "+this.maos[1].frame+" "+this.maos[2].frame);
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
        if(this.arrowGroup != null) {
            this.arrowGroup.removeAll(true);
        }

        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        this.add.tween(this.bug).to({x: 1200}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.bug.x = this.bugInitialX;
        }, this);

        this.add.tween(this.maos[0]).to({y:this.maoInitialY}, 1000, Phaser.Easing.Elastic.InOut, true);
        this.add.tween(this.maos[1]).to({y:this.maoInitialY}, 1000, Phaser.Easing.Elastic.InOut, true);
        this.add.tween(this.maos[2]).to({y:this.maoInitialY}, 1000, Phaser.Easing.Elastic.InOut, true);

        this.createDelayTime(1500, function(){
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
        this.background = this.add.sprite(0, 0, 'background');

        this.bug = this.add.sprite(-200, 250, 'bug');
        this.bug.anchor.setTo(0.5,0.5);
        this.bugInitialX = this.bug.x;

        this.maosDelta = 270;

        this.maos = new Array();
        for(i = 0; i < 3; i++){
            mao = this.add.sprite(0,0,'maos');
            mao.x = 295+220*i;
            mao.y = 755;
            mao.anchor.setTo(0.5, 0.5);
            mao.scale.setTo(0.8, 0.8);
            mao.frame = 5;
            mao.events.onInputDown.add(this.mouseInputDown, this);
            this.maos[i] = mao;
        }
        this.maoInitialY = this.maos[0].y;

        this.maquina = this.add.sprite(0,0, 'maquina');
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
        var t1 = "Gente, às vezes podemos usar\n os dedos de nossas mãos para\nfazermos contas simples. Vejam:\n Uma mão, cinco dedos! Mais uma\n mão… 10 dedos! Fizemos uma soma!";

        var t2 = "E se tirarmos 3 dedos,\n com quantos ficamos? Cinco\n de um lado e dois do outro…\n 7 dedos! Viram só?";

        var tutorialText1 = this.drawText(this.world.centerX, 30, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        var tutorialText2 = this.drawText(this.world.centerX, 30, t2, 22, "center");
            tutorialText2.alpha = 0;
            this.groupIntro.add(tutorialText2);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 18000);
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 18500);
        this.add.tween(tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 30000);


        //maos
        this.maos[0].frame = 5;
        this.maos[1].frame = 5;
        this.createDelayTime(10000, function(){
            this.add.tween(this.maos[0]).to({y:this.maos[0].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 0);
            this.add.tween(this.maos[1]).to({y:this.maos[1].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 3000).onComplete.add(function(){
                this.add.tween(this.maos[1]).to({y:this.maoInitialY}, 1000, Phaser.Easing.Elastic.InOut, true, 7000).onComplete.add(function(){
                this.maos[1].frame = 2;
                this.add.tween(this.maos[1]).to({y:this.maos[1].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 1000);
            }, this);
            }, this);
        });

        this.soundResumo = this.sound.play("soundResumo");

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
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

        this.maos[0].inputEnabled = false;
        this.maos[1].inputEnabled = false;
        this.maos[2].inputEnabled = false;

        console.log("init level", levelNum, this.currentLevel);

        switch(levelNum) {
            case 1:
                this.sound.play("soundP1");
                this.initLevel1();
            break;
            case 2:
                this.sound.play("soundP1");
                this.initLevel2();
            break;
            case 3:
                this.sound.play("soundP1");
                this.initLevel3();
            break;
            case 4:
                this.sound.play("soundP1");
                this.initLevel4();
            break;
            case 5:
                this.sound.play("soundP1");
                this.initLevel5();
            break;
        }
    },
           
    initLevel1: function() {
        this.showQuestion(1);
        this.setupLevel(this.game.rnd.integerInRange(1,5));
        
        //bug
        this.add.tween(this.bug).to({x: 500}, 1000, Phaser.Easing.Linear.None, true);

        //maos
        this.add.tween(this.maos[0]).to({y:this.maos[0].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 0);
        this.add.tween(this.maos[1]).to({y:this.maos[1].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 1000);
        this.add.tween(this.maos[2]).to({y:this.maos[2].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 2000).onComplete.add(function(){
            this.maos[0].inputEnabled = true;
            this.maos[1].inputEnabled = true;
            this.maos[2].inputEnabled = true;
        }, this);
    },

    initLevel2: function() {
        this.showQuestion(2);
        if(this.playerUpperHand)
            this.setupLevel(this.game.rnd.integerInRange(6,9));
        else
            this.setupLevel(this.game.rnd.integerInRange(1,5));

        //bug
        this.add.tween(this.bug).to({x: 500}, 1000, Phaser.Easing.Linear.None, true);

        //maos
        this.add.tween(this.maos[0]).to({y:this.maos[0].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 0);
        this.add.tween(this.maos[1]).to({y:this.maos[1].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 1000);
        this.add.tween(this.maos[2]).to({y:this.maos[2].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 2000).onComplete.add(function(){
            this.maos[0].inputEnabled = true;
            this.maos[1].inputEnabled = true;
            this.maos[2].inputEnabled = true;
        }, this);
    },

    initLevel3: function() {
        this.showQuestion(3);
        if(this.playerUpperHand)
            this.setupLevel(this.game.rnd.integerInRange(6,9));
        else
            this.setupLevel(this.game.rnd.integerInRange(1,5));

        //bug
        this.add.tween(this.bug).to({x: 500}, 1000, Phaser.Easing.Linear.None, true);

        //maos
        this.add.tween(this.maos[0]).to({y:this.maos[0].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 0);
        this.add.tween(this.maos[1]).to({y:this.maos[1].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 1000);
        this.add.tween(this.maos[2]).to({y:this.maos[2].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 2000).onComplete.add(function(){
            this.maos[0].inputEnabled = true;
            this.maos[1].inputEnabled = true;
            this.maos[2].inputEnabled = true;
        }, this);
    },


    initLevel4: function() {
        this.showQuestion(4);
        if(this.playerUpperHand)
            this.setupLevel(this.game.rnd.integerInRange(6,9));
        else
            this.setupLevel(this.game.rnd.integerInRange(1,5));

        //bug
        this.add.tween(this.bug).to({x: 500}, 1000, Phaser.Easing.Linear.None, true);

        //maos
        this.add.tween(this.maos[0]).to({y:this.maos[0].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 0);
        this.add.tween(this.maos[1]).to({y:this.maos[1].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 1000);
        this.add.tween(this.maos[2]).to({y:this.maos[2].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 2000).onComplete.add(function(){
            this.maos[0].inputEnabled = true;
            this.maos[1].inputEnabled = true;
            this.maos[2].inputEnabled = true;
        }, this);
    },

    initLevel5: function() {
        this.showQuestion(5);
        if(this.playerUpperHand)
            this.setupLevel(this.game.rnd.integerInRange(6,9));
        else
            this.setupLevel(this.game.rnd.integerInRange(1,5));

        //bug
        this.add.tween(this.bug).to({x: 500}, 1000, Phaser.Easing.Linear.None, true);

        //maos
        this.add.tween(this.maos[0]).to({y:this.maos[0].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 0);
        this.add.tween(this.maos[1]).to({y:this.maos[1].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 1000);
        this.add.tween(this.maos[2]).to({y:this.maos[2].y - this.maosDelta}, 1500, Phaser.Easing.Elastic.InOut, true, 2000).onComplete.add(function(){
            this.maos[0].inputEnabled = true;
            this.maos[1].inputEnabled = true;
            this.maos[2].inputEnabled = true;
        }, this);
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

    mouseInputDown:function(elem){ // elem = elemento que foi clicado
        console.log("***mouseInputDown***");
        if(!this.dualAnswer){
            this.maos[0].inputEnabled = false;
            this.maos[1].inputEnabled = false;
            this.maos[2].inputEnabled = false;
            this.selectedHand1 = elem;
            this.add.tween(elem.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(elem.scale).to({x:0.8,y:0.8}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        this.checkGame(elem);
                },this);
            },this);
        } else {
            if(this.selectedHand1 == null){
                console.log("selected hand 1 - "+ elem.frame);
                this.selectedHand1 = elem;
                this.add.tween(this.selectedHand1.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true);
            } else {
                console.log("selected hand 2 - "+ elem.frame);
                this.maos[0].inputEnabled = false;
                this.maos[1].inputEnabled = false;
                this.maos[2].inputEnabled = false;
                this.selectedHand2 = elem;
                this.add.tween(this.selectedHand2.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.add.tween(this.selectedHand1.scale).to({x:0.8,y:0.8}, 500, Phaser.Easing.Linear.None, true)
                    this.add.tween(this.selectedHand2.scale).to({x:0.8,y:0.8}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                            this.checkGame(elem);
                    },this);
                },this);
            }

        }
    },

    checkGame:function(elem){
        console.log("***checkGame***");

        if(this.selectedHand1 != null && ((!this.dualAnswer && this.selectedHand1 == this.maos[this.answerHand]) || (this.dualAnswer && this.selectedHand1 == this.maos[this.answerHand] && this.selectedHand2 != null && this.selectedHand2.frame == 5) || (this.dualAnswer && this.selectedHand2 != null  && this.selectedHand2 == this.maos[this.answerHand] && this.selectedHand1.frame == 5))){
                console.log("CORRETA");
                this.sound.play("hitAcerto");
                this.clickRightButton();
        }
        else{
            console.log("ERRADA");
            this.sound.play("hitErro");
            this.clickWrongButton();
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
        this.playerUpperHand = true;

        this.add.tween(this.bug).to({x: 1200}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.bug.x = this.bugInitialX;
        }, this);

        this.add.tween(this.maos[0]).to({y:this.maoInitialY}, 1000, Phaser.Easing.Elastic.InOut, true);
        this.add.tween(this.maos[1]).to({y:this.maoInitialY}, 1000, Phaser.Easing.Elastic.InOut, true);
        this.add.tween(this.maos[2]).to({y:this.maoInitialY}, 1000, Phaser.Easing.Elastic.InOut, true);
        
        this.createDelayTime(2000, function() {
          this.resetLevel(this.currentLevel);
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
        this.resetLevel(this.currentLevel);

        this.playerUpperHand = false;

        this.add.tween(this.bug).to({x: 1200}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            this.bug.x = this.bugInitialX;
        }, this);

        this.add.tween(this.maos[0]).to({y:this.maoInitialY}, 1000, Phaser.Easing.Elastic.InOut, true);
        this.add.tween(this.maos[1]).to({y:this.maoInitialY}, 1000, Phaser.Easing.Elastic.InOut, true);
        this.add.tween(this.maos[2]).to({y:this.maoInitialY}, 1000, Phaser.Easing.Elastic.InOut, true);

        this.createDelayTime(1000, function() {

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

    resetLevel:function(nivel){
        
        console.log("***resetLevel***");
        
        this.selectedHand1 = null;
        this.selectedHand2 = null;
        this.answerHand = -1;
        this.answerHand2 = -1;
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
};