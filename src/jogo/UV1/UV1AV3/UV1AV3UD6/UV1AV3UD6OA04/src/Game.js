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
        // this.gradeGuia(1000, 600);   

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

        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

        this.createScene();
        this.showIntro();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();
        this.playSound = false; 
        this.som = null; 

        //array da posição das áreas de click
        this.coordinates = [
        [[672, 202],[821, 206],[707, 259]],
        [[574, 208],[753, 209],[665, 256]],
        [[686, 180],[618, 226],[651, 275]],
        [[607, 151],[730, 199],[667, 290]],
        [[676, 178],[597, 225],[768, 273]],
        [[562, 197],[573, 245],[658, 292]],
        [[565, 122],[782, 121],[794, 171], [581, 260]],
        [[562, 122],[705,  124],[583, 214], [654, 264]],
        [[774, 123],[748, 173],[621, 215], [582, 264]],
        [[603, 203], [651, 257]]
        ];

         //x0,y0,x1,y1
        this.answers=[
            [219, 98, 399, 129],
            [209, 158, 338, 186],
            [155, 182, 333, 210],
            [120, 41, 266, 72],
            [170, 68, 333, 101],
            [8, 95, 275, 128],
            [84, 12, 209, 47],
            [47, 149, 269, 179],
            [77, 183, 269, 212],
            [182, 126, 360, 159],
        ];

        //posição da area de click certa de acordo com o texto mostrado
        this.positionRightAnswers = [0, 2, 2, 0, 0, 0, 0, 2, 3, 1];

        this.remainingQuestions1 = [0, 1, 2];
        this.remainingQuestions2 = [3, 4, 5];
        this.remainingQuestions3 = [6, 7, 8];    
    },


    /*
    para liberar o click e drag and drop em um grafico, como um quadrado ou circulo é preciso
    transforma-lo em um prite, pegando a variavel do grafico e no lugar de buscar um sprite do
    preloader, use graphics.generateTexture(). Depois consegue liberar o click e o arraste

    ex.: var sprite = this.game.add.sprite(x, y, graphics.generateTexture());

    */
    createAreaToClick:function (array, numQuestion, width) { 
        console.log("***********createAreaToClick*********");
        for (var i = this.coordinates[numQuestion].length - 1; i >= 0; i--) {
            var graphics = this.game.add.graphics(0, 0);
            graphics.lineStyle(0);
            graphics.beginFill(0xffffff, .0);
            graphics.drawRect(100, 50, width, 50);
            
            array[i] = this.game.add.sprite(this.coordinates[numQuestion][i][0], this.coordinates[numQuestion][i][1], graphics.generateTexture());
            array[i].anchor.set(0.5);
            array[i].name = i;
            graphics.destroy();

            array[i].inputEnabled = true;
            array[i].events.onInputDown.add(this.mouseInputDown, this);
        }
    },

    disableAreaToClick:function (array) {
        for (var i = array.length - 1; i >= 0; i--) {
            array[i].inputEnabled = false;
            array[i].input.useHandCursor = false;
            array[i].input.reset();
        }
    },


    showIntro: function() {
        console.log("***show intro***");
        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");
        this.tutorialPlacar.addChild(this.skipButton);

        this.groupIntro = this.add.group();

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextoIntro, this);
    },

    showTextoIntro: function() {
        var t1 = "O som do [Z] está em [casa], [Z] em [zebra] e \n som de [Z] em [exercício]! Hora de ver se\n estamos atentos às pegadinhas da\n letra [Z], ";
        var tutorialText1 = this.drawText(this.world.centerX+40, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t1 = "que não está nessas frases, mas \n que tem alguma palavra com\n uma letra que faz o som dela.";
        var tutorialText11 = this.drawText(this.world.centerX+30, 30, t1, 21, "left");
        tutorialText11.alpha = 0;
        this.groupIntro.add(tutorialText11);

        var t2 = "Aqui, a palavra com o som da letra [Z] é\n a [“atrasar”]. Eu leio as frases e vocês clicam,\n entre as palavras vermelhas,\n nas que têm som de [Z]!";
        var tutorialText2 = this.drawText(this.world.centerX, 20, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var kim = this.showKim(20000);

        //t1in
        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0).onComplete.add(function(){
            this.soundIntro = this.setDebugAudio("soundIntro");
            this.soundIntro.onStop.addOnce(function(){
                this.showFinishedLiveTutorial();
            }, this);
        },this)

        //t1out
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true,13300).onComplete.add(function(){ 
             this.add.tween(tutorialText11).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        }, this);

        this.add.tween(tutorialText11).to({alpha:0}, 500, Phaser.Easing.Linear.None, true, 20000);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -105}, 500, Phaser.Easing.Bounce.Out, true, 20200);

        //t2in
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 20700).onComplete.add(function(){
            this.question = 9;
            this.setupLevel();
            this.showLevel();
            this.frases.x = 425;
            this.showLiveTutorial();
        }, this);

        //t2out
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 35000);

        
        
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** tutorial start ***");

        aux = 370;
        auy = 220;
        
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

        this.add.tween(this.arrowGroup).to({alpha:1}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            rightX = (this.answers[this.question][2] - this.answers[this.question][0])/2 + this.frases.x + this.answers[this.question][0];
            rightY = (this.answers[this.question][3] - this.answers[this.question][1])/2 + this.frases.y + this.answers[this.question][1];
            this.add.tween(this.arrowGroup).to({x: (rightX - 5), y: (rightY- 5)}, 200, Phaser.Easing.Linear.None, true, 7000).onComplete.add(function(){
                    this.click.animations.play('click', 30, false);
            }, this);
        }, this);
    },    

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showFinishedLiveTutorial:function() {
        console.log("***tutorial end***");
        this.add.tween(this.groupIntro).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.arrowGroup).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.tutorialPlacar).to({y: -300}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
    },

    initGame: function() {
        console.log("***init game***");
        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }
        if(this.arrowGroup != null) {
            this.arrowGroup.removeAll(true);
        }

        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        this.resetLevel(this.showNextLevel);
    },

    createScene: function() {
        console.log("***create scene***");
        this.background = this.add.sprite(0, 0, 'background');
        this.livro = this.add.sprite(660, 200, 'livro');
        this.livro.anchor.set(0.5, 0.5);
        this.livro.scale.set(1.3, 1.3);
        frames = [];
        for(i = 0; i < 25; i++)
            frames.push(i);
        this.livro.animations.add('open', frames, 18, false);
        frames = [];
        for(i = 24; i >= 0; i--)
            frames.push(i);
        this.livro.animations.add('close', frames, 18, false);
        this.livro.alpha = 1;

        this.frases = this.add.sprite(393, 107, 'frases');
        this.frases.anchor.set(0, 0);
        this.frases.alpha = 0;

        this.bumba = this.add.sprite(107, 366, 'bumba');
        this.bumba.anchor.set(0.5, 0.5);
        frames = [];
        for(i = 0; i < 22; i++)
            frames.push(i);
        this.bumba.animations.add('idle', frames, 18, true);
        frames = [];
        for(i = 22; i < 46; i++)
            frames.push(i);
        this.bumba.animations.add('cheer', frames, 18, false);
        this.bumba.animations.play('idle'); 

        this.frases.events.onInputDown.add(this.mouseInputDown, this);
    },    

    showResumo: function() {
        console.log("***show resumo***");
        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placarResumo');
        this.tutorialPlacar.anchor.set(0.5,0);
        this.groupIntro = this.add.group();
        this.skipButton = this.add.button(230, 220, "hud", this.skipResumo, this,"skipButton","skipButton","skipButton","skipButton");
        this.tutorialPlacar.addChild(this.skipButton);
        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextResumo, this);
    },

    showTextResumo: function() {
        var t1 = "Para ler também precisamos estar atentos às\n  pegadinhas que algumas letras nos pregam, né?\n Como a letra [Z], que mesmo quando ela não está\n lá, o som dela pode estar. A dica é procurar \npalavras com [X] e [S], que podem soar como o [Z]!";

        var tutorialText1 = this.drawText(this.world.centerX, 45, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0).onComplete.add(function(){
            this.soundResumo = this.setDebugAudio("soundResumo");
            this.soundResumo.onStop.addOnce(function(){
                this.add.tween(this.groupIntro).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
                this.hideResumo();
            }, this);
        },this);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 21000);

        
    },

    showNextLevel: function() {
        console.log("***showNextLevel***");
        this.frases.x = 393;
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
        console.log("***init level 1***");
        this.setupLevel(1);
        this.showLevel();
        this.playQuestion(this.question, function() {
            this.areas = [];
            this.createAreaToClick(this.areas, this.question, 120);
        });
    },

    initLevel2: function() {
        console.log("***init level 2***");
        this.setupLevel(2);
        this.showLevel();
        this.playQuestion(this.question, function() {
            this.areas = [];
            this.createAreaToClick(this.areas, this.question, 120);
        });
    },

    initLevel3: function() {
        console.log("***init level 3***");
        this.setupLevel(3);
        this.showLevel();
        this.playQuestion(this.question, function() {
            this.areas = [];
            this.createAreaToClick(this.areas, this.question, 120);
        });
    },

    setupLevel: function(level){
        console.log("***setup level "+level+"***");
        switch(level){
            case 1:
                this.question = this.remainingQuestions1.splice(this.game.rnd.integerInRange(0, this.remainingQuestions1.length-1), 1)[0];
                break;
            case 2:
                this.question = this.remainingQuestions2.splice(this.game.rnd.integerInRange(0, this.remainingQuestions2.length-1), 1)[0];
                break;
            case 3:
                this.question = this.remainingQuestions3.splice(this.game.rnd.integerInRange(0, this.remainingQuestions3.length-1), 1)[0];
                break;
        }
        this.frases.frame = this.question;
        console.log("the question: " + this.question);
        console.log("remaining questions "+this.remainingQuestions1.toString()+" "+this.remainingQuestions2.toString()+" "+this.remainingQuestions3.toString()+" ");
    },

    showLevel: function(callback){
        console.log("***show level***");
        this.livro.animations.play('open');
        this.add.tween(this.frases).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            if(callback != null)
                callback.call(this);
        }, this);
    },

    resetLevel:function(callback){
        console.log("***reset level***");
        if(this.areas) {
            for (var i = this.areas.length - 1; i >= 0; i--) {
                this.add.tween(this.areas[i]).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true); 
            }    
        }
        this.add.tween(this.frases).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            if(callback != null)
                callback.call(this);
        }, this);
        this.livro.animations.play('close');        
    },

    mouseInputDown:function(elem){ // elem = elemento que foi clicado
        console.log("***mouseInputDown***");
        this.disableAreaToClick(this.areas);
        this.checkGame(elem);    //passar o elem como parametro e compara pelo name    
    },

    checkGame:function(elem){
        console.log("***checkGame***");
        answer = this.answers[this.question];
        if(elem.name == this.positionRightAnswers[this.question]){
            this.bumba.animations.play('cheer').onComplete.add(function(){
                this.bumba.play('idle');
            }, this);
            this.setDebugAudio("hitAcerto");
            this.clickRightButton();
        } else {
            this.setDebugAudio("hitErro");
            this.clickWrongButton();
        }
    },

    clickRightButton: function() {
        console.log("***right!***");
        this.onPlayerSuccess();

        this.resetLevel(function(){
            this.gotoNextLevel();
        });
    },

    clickWrongButton: function(target) {
        console.log("***wrong!***");
        this.resetLevel(function(){
            if(this.currentLocalErrors > 0) {
                this.currentLocalErrors--;
                return;
            }            
            this.onPlayerError();
            switch(this.lives) {
                case 1: // mostra dica 1
                    this.createDelayTime(500, function() {
                        this.soundDica = this.setDebugAudio("soundDica");
                        this.soundDica.onStop.addOnce(function(){
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

    playQuestion: function(question, callback){
        console.log("***play question***");
        soundName = "soundP";
        soundName += Math.ceil((question+1)/3)+"_F";
        soundName += question - (((Math.ceil((question+1)/3)-1)*3) - 1);
        

        sound = this.setDebugAudio(soundName);
        sound.onStop.addOnce(function(){
            if(callback != null)
                callback.call(this);
        }, this);

        console.log("playing ", soundName);
    },

    hideAndShowLevel: function() {
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

    gotoNextLevel: function() {
        this.currentLocalLevel++;
        if(this.currentLocalLevel >= this["totalLevel" + this.currentLevel]) {
            this.currentLevel++;
            this.currentLocalLevel = 0;
            this.currentLocalErrors = this["totalErro" + this.currentLevel];
        }
        this.hideAndShowLevel();
    }

    /* enableDragDropMeu:function(elem){
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
    },*/
    //************************************************************
    /*
    drawPoint:function(x,y){ 
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(0);
        graphics.beginFill(0xff0000,1);
        graphics.drawCircle(x,y,5);
        graphics.endFill();
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

    } */
};