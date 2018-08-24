
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
            

        this.TEMPO_INTRO = 13500;
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
        
        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];


        this.createScene();

        this.showIntro();
        //this.showResumo();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();

        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);

    },

    createAnimation: function( x, y, name, scaleX, scaleY) { 
        var spr = this.add.sprite(x,y, name);
        spr.animations.add('idle', null, 18, true);
        spr.animations.play('idle');
        spr.scale.set( scaleX, scaleY);

        return spr;
    }, 

    createRandomItens: function(itens, num) {
        var _itens = [];

        for(var i = 0; i < num; i++) {
            var n = this.rnd.integerInRange(0, itens.length-1);
            _itens.push(itens[n]);
            itens.splice(n,1);
        }
        return _itens;
    },

    getRandomUniqueItem: function(list, level) {

        var letters = this.getNonRepeatLetter(list, level); // FRE
        var n = this.rnd.integerInRange(0,letters.length-1);

        this.spliceLetter.push( letters[n] );

        return letters[n];
    },
    showIntro: function() {
        this.groupIntro = this.add.group();

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.groupIntro.add(this.tutorialPlacar);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");

        this.tutorialPlacar.addChild(this.skipButton);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextoIntro, this);
    },

    // intro-fixa
    showTextoIntro: function() {

        this.soundIntro = this.setDebugAudio("soundIntro");

        var t1 = "E O SACI TROUXE ALGUNS BRINQUEDOS! ";
        var tutorialText = this.drawText(this.world.centerX+60, 110, t1, 24, "left");
        tutorialText.alpha = 0;
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        this.groupIntro.add(tutorialText);

        var kim = this.showKim(3000);


        var t2 = " A POLY ESCOLHEU UMA [CAIXA DE JOGOS], FRED, UM\n[CUBO MÁGICO] E O JUNINHO UM [PIÃO] QUE PARECE\n ATÉ UM BALÃO. CADA BRINQUEDO TEM UM FORMATO\n DIFERENTE, E É CHAMADO DE [POLIEDRO].";

        var tutorialText2 = this.drawText(this.world.centerX, 30, t2, 21, "left");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        this.createDelayTime( 3000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true)
            this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 300);
        });

        var t3 = "VAMOS VER SE VOCÊS SÃO BONS DE VISÃO? LIGUEM\nOS OBJETOS DE CADA UM ATÉ SEU POLIEDRO DE\nMESMO FORMATO!";

        var tutorialText3 = this.drawText(this.world.centerX, 30, t3, 22, "left");
        tutorialText3.alpha = 0;
        this.groupIntro.add(tutorialText3);

        this.createDelayTime( 19000, function() {
            this.add.tween(tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true)
            this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 300);
        });


        this.createDelayTime( 5000, function() {
            this.showCurrentCharacter(1);
        });
        this.createDelayTime( 8000, function() {
            this.showCurrentCharacter(2);
        });

        this.createDelayTime( 10000, function() {
            this.showCurrentCharacter(3);
        });


        this.createDelayTime( 29000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
        });
    },

    // resumo-fixa
    showResumo: function() {

        this.groupIntro = this.add.group();

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placarResumo');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.skipButton = this.add.button(230, 220, "hud", this.skipResumo, this,"skipButton","skipButton","skipButton","skipButton");
        this.tutorialPlacar.addChild(this.skipButton);

        this.groupIntro.add(this.tutorialPlacar);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextResumo, this);
    },

    // level-fixa
    initGame: function() {

        console.log("initGame");

        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }

        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
    },

    // fixa
    hideLevel: function(callback) {
        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        if(callback != null) {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
        } else {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500);
        }
    },

    // fixa
    hideAndShowLevel: function() {

        this.hideLevel(function() {

            if(this.currentLevel <= 3 && this.corrects <= 2) {
                this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
            } else {
                this.gameOverMacaco();
            }
        });
    },

    removeButtonAction: function() {
        this.correctItem.input.useHandCursor = false;
        this.game.canvas.style.cursor = "default";
        this.correctItem.input.reset();
        
        this.correctItem.inputEnabled = false;
        this.correctItem.onInputOver.removeAll();
        this.correctItem.onInputOut.removeAll();
        this.correctItem.onInputUp.removeAll();

        for(var i = 1; i < this.spliceLetter.length; i++) {
            //this.spliceLetter.push(this.correctItem._frameName);
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
    },

    showCorrectName: function(gotoNext) {

        this.lineBitmap.visible = false;
        this.groupLine.destroy();

        this.add.tween(this.characters[this.currentLevel]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        
        if(gotoNext) {
            this.createDelayTime( 2000, this.gotoNextLevel);
        }
    },


    createScene: function() {//finished

        this.add.sprite( -352, -498, 'background');
        this.characters = [];

        this.characters[3] = this.createAnimation( 320, 252, 'anim_walter', 1,1);
        this.characters[2] = this.createAnimation( 230, 260, 'anim_fred', 1,1);
        this.characters[1] = this.createAnimation( 160, 352, 'anim_poly', 1,1);


        this.characters[1].forma = "retangulo";
        this.characters[2].forma = "quadrado";
        this.characters[3].forma = "losango";

        this.hideAllCharacters();
    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {

        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX+200, 300, "quadrado", true, 100, false) );
        this.buttons.push( this.createButton(this.world.centerX+200, 400, "retangulo", false, 100, false) );
        this.buttons.push( this.createButton(this.world.centerX+200, 500, "losango", false, 100, false) );

        this.groupIntro.add(this.buttons[0]);
        this.groupIntro.add(this.buttons[1]);
        this.groupIntro.add(this.buttons[2]);

        this.createDelayTime( 500, function() {
            this.anim = this.add.sprite(this.world.centerX, this.world.centerY+100, "animTutorial");
            this.anim.anchor.set(0.5,0.5);

            this.anim.animations.add('idle', null, 18, false);
            this.anim.animations.play('idle');

            this.groupIntro.add(this.anim);
        });

        this.createDelayTime( 14000, function() {
            
            this.add.tween(this.buttons[0]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[1]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[2]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

            this.hideAllCharacters();

            this.add.tween(this.anim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);

        });
    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {

        var click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
        click.animations.add('idle', null, 18, true);
        click.animations.play('idle');

        this.buttons[0].alpha = 0.7;

        this.groupIntro.add(click);

        // remover click
        this.createDelayTime( 1400, function() {
            click.alpha = 0;
            click.destroy();
        });

        // remover tudo
        this.createDelayTime( 4000, function() {

            this.add.tween(this.arrow).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[0]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[1]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttons[2]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);

        });
    },

    // resumo inicial
    showTextResumo: function() {
        
        var resumo = "Existem várias formas geométricas que \nparecem com dados, balões, caixas… \nChamamos essas formas geométricas de \npoliedros.";
        var tutorialText =this.drawText(this.world.centerX, 50, resumo, 22, "left");
        tutorialText.alpha = 0;
        //tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.setDebugAudio("soundResumo");;
        //this.soundResumo = this.sound.play("soundResumo");

        var resumoAnim = this.add.sprite(this.world.centerX, 100, "resumoAnim");
        resumoAnim.anchor.set(0.5,0);

        resumoAnim.animations.add('anim1-1', Phaser.Animation.generateFrameNames("resumo_", 0, 18, "", 3), 18, false);
        //resumoAnim.animations.add('anim1-2', Phaser.Animation.generateFrameNames("resumo_",18, 36, "", 3), 18, false);
        
        resumoAnim.animations.add('anim2-1', Phaser.Animation.generateFrameNames("resumo_",18, 48, "", 3), 18, false);
        //resumoAnim.animations.add('anim2-2', Phaser.Animation.generateFrameNames("resumo_",48, 72, "", 3), 18, false);

        resumoAnim.animations.add('anim3-1', Phaser.Animation.generateFrameNames("resumo_",48, 86, "", 3), 18, false);

        resumoAnim.animations.add('anim3-2', Phaser.Animation.generateFrameNames("resumo_",86,109, "", 3), 18, false);

        this.groupIntro.add(resumoAnim);

        this.createDelayTime(12000, function() {
            resumoAnim.animations.play('anim1-1');
        });
        this.createDelayTime(15000, function() {
            resumoAnim.animations.play('anim2-1');
        });
        this.createDelayTime(19000, function() {
            resumoAnim.animations.play('anim3-1');
        });
        this.createDelayTime(27000, function() {
            //resumoAnim.animations.play('anim3-2');
        });

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
        }, this);

    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        this.hideAllCharacters();

        //1-verifica level de 1 a maximo
        // para cada level tocar som intro do level e carregar level
        switch(this.currentLevel) {
            case 1:
                this.showQuestion(1);
                if(this.showCallToAction) {
                    this.initLevel('retangulo', ['quadrado', 'losango', 'triangulo', "hexagono"], 2);
                } else {
                    this.sound.play("soundP1").onStop.addOnce(function() {
                        this.initLevel('retangulo', ['quadrado', 'losango', 'triangulo', "hexagono"], 2);
                    }, this);
                }
            break;
            case 2:
                this.showQuestion(2);
                if(this.showCallToAction) {
                    this.initLevel('quadrado', ['retangulo', 'losango', 'triangulo', 'hexagono'], 3);
                } else {
                    this.sound.play("soundP2").onStop.addOnce(function() {
                        this.initLevel('quadrado', ['retangulo', 'losango', 'triangulo', 'hexagono'], 3);
                    }, this);
                }
            break;
            case 3:
                this.showQuestion(3);
                if(this.showCallToAction) {
                this.initLevel('losango', ['quadrado','triangulo', 'hexagono', 'retangulo'], 4);
                } else {
                    this.sound.play("soundP3").onStop.addOnce(function() {
                        this.initLevel('losango', ['quadrado','triangulo', 'hexagono', 'retangulo'], 4);
                    }, this);
                }
            break;
        }
        this.showCallToAction = false;
    },

    showQuestion: function(num) {

        var q = [ null,
            "LIGUEM O BRINQUEDO DE [POLY] ao poliedro\ncorrespondente!",
            "LIGUEM O BRINQUEDO DE [FRED] ao poliedro\ncorrespondente!",
            "LIGUEM O BRINQUEDO DE [JUNINHO] ao poliedro\ncorrespondente!"
        ];



        // this.world.centerX+60, 30, t1, 24, "left");

        this.imageQuestion = this.drawText(this.world.centerX, 50, q[num]);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },


    initLevel: function(corrects, wrongs, numItens) {

        
        var _letters = this.createRandomItens(wrongs, numItens-1);
        _letters.push( corrects );


        _letters.sort(function() {
          return .5 - Math.random();
        });
        
        console.log(_letters);

        // fixo - criar sistema de botoes dentro do array
        this.buttons = [];
        this.buttons.push( this.createButton(this.world.centerX+150, 530, _letters[0], corrects == _letters[0], 0) );
        this.buttons.push( this.createButton(this.world.centerX+290, 460, _letters[1], corrects == _letters[1], 0) );
        if(numItens > 2) {
            this.buttons.push( this.createButton(this.world.centerX+150, 380, _letters[2], corrects == _letters[2], 0) );
        }
        if(numItens > 3) {
            this.buttons.push( this.createButton(this.world.centerX+290, 300, _letters[3], corrects == _letters[3], 0) );   
        }

        this.characters[this.currentLevel].x2 = this.characters[this.currentLevel].right-50;
        this.characters[this.currentLevel].y2 = this.characters[this.currentLevel].y + this.characters[this.currentLevel].height*0.5;

        this.characters[this.currentLevel].pieceType = corrects;

        this.correctItem = this.characters[this.currentLevel];

        console.log(this.characters[this.currentLevel]);

        this.showCurrentCharacter(this.currentLevel);


        this.correctItem.inputEnabled = true;
        this.correctItem.events.onInputOver.add(this.onButtonOver, this);
        this.correctItem.events.onInputOut.add(this.onButtonOut, this);

        this.input.onDown.add(this.onMouseDown, this);
        this.input.onUp.add(this.onMouseUp, this);

        this.lineBitmap = this.add.bitmapData(1000,600);
        this.groupLine = this.add.sprite(0,0, this.lineBitmap);
    },

    hideAllCharacters: function() {
        for(var i = 1; i < this.characters.length; i++) {
            this.characters[i].alpha = 0;
        }
    },
    showCurrentCharacter: function(num) {

        this.characters[num].alpha = 1;
        this.add.tween(this.characters[num]).from({alpha: 0, x: -this.characters[num].width}, 300, Phaser.Easing.Linear.None, true);
    },

    onButtonOver: function(elem) {
        if(elem.alpha < 1) {
            return;
        }
        if(!elem.forma) {
            this.add.tween(elem.scale).to({x: 1.1, y: 1.1}, 100, Phaser.Easing.Linear.None, true);
        }

        console.log(elem.pieceType);

        if(!this.isPressed) {
            this.buttonOrigin = elem;
        } else {
            this.buttonTarget = elem;
        }
    },
    //fixa
    onButtonOut: function(elem) {
        if(elem.alpha < 1) {
            return;
        }

        if(!elem.forma) {
            this.add.tween(elem.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.None, true);
        }

        if(!this.isPressed) {
            this.buttonOrigin = null;
        } else {
            this.buttonTarget = null;
        }
    },

    onMouseDown: function() {
        this.isPressed = true;

        if(this.buttonOrigin != null) {
            this.isDrawing = true;
        }

    },
    onMouseUp: function() {
        this.isPressed = false;


        if(this.buttonOrigin != null && this.buttonTarget != null) {
            // console.log(this.buttonOrigin, this.buttonTarget); return;
            if(this.buttonOrigin.pieceType == this.buttonTarget.pieceType && this.buttonOrigin.key != this.buttonTarget.key) {
                console.log("IS CORRECT");

                this.isDrawing = false;
                this.drawCorrectLine();

                this.buttonOrigin.inputEnabled = false;
                this.buttonTarget.inputEnabled = false;

                this.buttonOrigin = null;
                this.buttonTarget = null;
                
                this.clickRightButton();

                return;
            } else {
                this.cleanLine();
                this.clickWrongButton();
                this.isDrawing = false;
            }
        } else {
            this.cleanLine();
            this.isDrawing = false;
            //this.sound.play("hitErro");
        }  
    },
    cleanLine: function() {
        this.lineBitmap.clear();
    },
    drawCorrectLine: function() {
        this.cleanLine();

        var line = this.add.bitmapData(1000,600);

        line.ctx.beginPath();
        line.ctx.lineWidth = 5;
        line.ctx.strokeStyle = "rgba(255,0,0,0.7)";
        line.ctx.moveTo(this.buttonOrigin.x2 || this.buttonOrigin.x, this.buttonOrigin.y2 || this.buttonOrigin.y);
        line.ctx.lineTo(this.buttonTarget.x2 || this.buttonTarget.x, this.buttonTarget.y2 || this.buttonTarget.y);
        line.ctx.stroke();

        var spr = this.add.sprite(0,0,line);

        this.groupLine.addChild(spr);
    },

    updateDrawing: function() {
        if(!this.isDrawing) {
            return;
        }
        this.cleanLine();

        this.lineBitmap.ctx.beginPath();
        this.lineBitmap.ctx.lineWidth = 5;
        this.lineBitmap.ctx.strokeStyle = "rgba(255,0,0,0.7)";
        this.lineBitmap.ctx.moveTo(this.buttonOrigin.x2 || this.buttonOrigin.x, this.buttonOrigin.y2 || this.buttonOrigin.y);
        this.lineBitmap.ctx.lineTo(this.input.x, this.input.y);
        this.lineBitmap.ctx.stroke();
    },

    //criacao de botao de resposta - manter estrutura
    createButton: function( x, y, imagem, right, time, canInteract) {

        var _canInteract = (canInteract==null||canInteract==undefined) ? true : false;
        
        var btn;
        if(right) {

            btn = this.add.button(x,y, 'formas', null, this, imagem,imagem,imagem);
            btn.isCorrect = true;
            this.correctItem = btn;

        } else {
            btn = this.add.button(x,y, 'formas', null, this, imagem,imagem,imagem);

        }

        btn.pieceType = imagem;
        btn.anchor.set(0.5,0.5);
        btn.alpha = 0;
        btn.scale.set(0.5,0.5);

        if(_canInteract) {
            btn.onInputOver.add(this.onButtonOver, this);
            btn.onInputOut.add(this.onButtonOut, this);
        }

        this.add.tween(btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, time);
        this.add.tween(btn.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Bounce.Out, true, time).onComplete.add(function() {
            if(_canInteract) {
                btn.input.useHandCursor = true;
            }
        }, this);

        return btn;
    },
    // clicar botao correto
    clickRightButton: function() {

        /* FIXO */
        this.corrects++;
        this.saveCorrect();
        //this.sound.stopAll();
        this.sound.play("hitAcerto");
        this.clearButtons();
        ////this.addPoints();
        /* FIXO */

        this.showCorrectName(true);

    },

    // clicar botao errado
    clickWrongButton: function(target) {

        if(!this.isDrawing) {
            return;
        }
        /* FIXO */
        
        if(this.currentLevel > 1) {
            this.currentLevel--;
        }
        this.lives--;
        this.errors--;
        //this.sound.stopAll();
        this.sound.play("hitErro");
        this.clearButtons();
        this.showCorrectName(false);
        
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
            default: // game over
            break;
        }
        this.updateLivesText();
        /* FIXO */
    },

    updateTutorialDrawing: function() {
        if(!this.isTutorial) {
            return;
        }

        if(this.isTutorial == 1) {
            this.tutorialSprite.clear();
            this.tutorialSprite.ctx.beginPath();
            this.tutorialSprite.ctx.lineWidth = 5;
            this.tutorialSprite.ctx.strokeStyle = "rgba(255,0,0,0.7)";
            this.tutorialSprite.ctx.moveTo(365, 60);
            this.tutorialSprite.ctx.lineTo(this.arrow.x, this.arrow.y);
            this.tutorialSprite.ctx.stroke();
        } else if(this.isTutorial == 2) {

            this.tutorialSprite.clear();
            this.tutorialSprite.ctx.beginPath();
            this.tutorialSprite.ctx.lineWidth = 5;
            this.tutorialSprite.ctx.strokeStyle = "rgba(255,0,0,0.7)";
            this.tutorialSprite.ctx.moveTo(365, 60);
            this.tutorialSprite.ctx.lineTo(565, 180);
            this.tutorialSprite.ctx.moveTo(365, 170);
            this.tutorialSprite.ctx.lineTo(this.arrow.x, this.arrow.y);
            this.tutorialSprite.ctx.stroke();
        }

    },

    update: function() {
        this.updateDrawing();

        this.updateTutorialDrawing();
    }

};