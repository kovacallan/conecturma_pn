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

        this.createScene();
        this.showIntro();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();
        //this.goGame = true;
        this.playSound = false; // para tocar um som de uma vez
        this.som = null; // recebe o som que está tocando

        this.answers = [
            ['SE', 'DE'],
            ['MO', 'LHA', 'DO'],
            ['LI', 'QUI', 'DO'],
            ['SO', 'LI', 'DO'],
            ['TOR', 'NEI', 'RA'],
            ['MAN', 'GUEI', 'RA'],
            ['EN', 'CHEN', 'TE'],
            ['TA', 'MAN', 'DU', 'A'],
            ['TE', 'LE', 'FO', 'NAR'],
            ['SAN', 'DU', 'I', 'CHE']
        ];

        this.nuvensX = [
            [425, 575],
            [325, 500, 675],
            [250, 425, 575, 750]
        ];

        this.remainingQuestions1 = [1, 2, 3];
        this.remainingQuestions2 = [4, 5, 6];
        this.remainingQuestions3 = [7, 8, 9];

        this.nuvensSprites = [];
        this.chuvaSprites = [];

        this.nuvensPositioned = [-1, -1, -1, -1];
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

        var t1 = "Tudo seco, os bichos com sede… mas\n estou vendo nuvens cheinhas de água\n perto do horizonte! Usando uma mágica\n que o Saci me ensinou, vamos\n fazer chover um pouquinho?";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "É assim, eu vou falar uma palavra, tipo [\"SEDE\"]\n depois as sílabas dela vão aparecer em nuvens\n que vocês têm que levar lá pra cima, mas na\n [ordem certa], pra formar a palavra…\n daí chove um pouco! Nossa vez!";
        var tutorialText2 = this.drawText(this.world.centerX, 20, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var kim = this.showKim(14000);

        //t1in
        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        //t1out
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 14000);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -85}, 500, Phaser.Easing.Bounce.Out, true, 14200);

        //t2in
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 14700).onComplete.add(function(){
            this.setupLevel(0);
            this.showLevel();
            this.showLiveTutorial();
        }, this);

        //t2out
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 35000);

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
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");

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
        
        nuvem1 = null;
        nuvem2 = null;
        for(i = 0; i < this.nuvensSprites.length; i++){
            if(this.nuvensSprites[i].frame == 0)
                nuvem1 = this.nuvensSprites[i];
            else if (this.nuvensSprites[i].frame == 1)
                nuvem2 = this.nuvensSprites[i];
        }

        //aparece
        this.add.tween(this.arrowGroup).to({alpha:1}, 200, Phaser.Easing.Linear.None, true, 10000).onComplete.add(function(){
            this.add.tween(this.arrowGroup).to({x: nuvem1.x , y:  nuvem1.y}, 1000, Phaser.Easing.Linear.None, true, 1000).onComplete.add(function(){
                this.click.animations.play('click', 30, false);
                this.add.tween(this.arrowGroup).to({x: 420 , y:  this.nuvem.y}, 1000, Phaser.Easing.Linear.None, true);
                this.add.tween(nuvem1).to({x: 420 , y:  this.nuvem.y}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        this.add.tween(this.arrowGroup).to({x: nuvem2.x , y:  nuvem2.y}, 1000, Phaser.Easing.Linear.None, true, 1000).onComplete.add(function(){
                                this.click.animations.play('click', 30, false);
                                this.add.tween(this.arrowGroup).to({x: 600 , y: this.nuvem.y}, 1000, Phaser.Easing.Linear.None, true);
                                this.add.tween(nuvem2).to({x: 600 , y:  this.nuvem.y}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                                        for(i = 0; i < this.chuvaSprites.length; i++){
                                            this.chuvaSprites[i].animations.play('rain', 18, true);
                                            this.chuvaSprites[i].alpha = 1;
                                        }
                                }, this);
                        }, this);
                }, this);

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
        this.add.tween(this.groupIntro).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.arrowGroup).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
        this.add.tween(this.tutorialPlacar).to({y: -300}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
    },

    /**
    *
    * Função para gerar valores do nível
    *
    **/ 
    setupLevel: function(question){
        console.log("question: "+question);
        
        totalNuvens = this.answers[question].length;
        this.nuvensSprites = [];
        this.chuvaSprites = [];

        nuvensAux = [];
        for(i = 0; i < totalNuvens; i++)
            nuvensAux.push(i);

        i = 0;
        while(nuvensAux.length > 0){
            silabaI = nuvensAux.splice(this.game.rnd.integerInRange(0, nuvensAux.length-1), 1)[0];
            nuvemY = 800;
            nuvemX = this.nuvensX[totalNuvens-2][i];
            nuvemSprite = this.add.group();
            nuvemSprite.x = nuvemX;
            nuvemSprite.y = nuvemY;
            
            nuvemSprite = this.add.sprite(nuvemX, nuvemY, 'nuvens');
            nuvemSprite.anchor.set(0.5, 0.5);

            silabaFrame = 0;
            if(this.question == 0)
                silabaFrame += 2;
            else if(this.question >= 1 && this.question <= 6){
                silabaFrame += 2;
                silabaFrame += 3*(this.question - 1);
            } else if(this.question > 6) {
                silabaFrame += 2;
                silabaFrame += 18;
                silabaFrame += 4*(this.question - 7);
            }

            nuvemSprite.frame = silabaFrame + silabaI; 

            if(question > 0){
                nuvemSprite.inputEnabled = true;
                nuvemSprite.input.enableDrag();
                nuvemSprite.events.onDragStop.add(this.checkPosition, this);
                nuvemSprite.events.onDragStart.add(this.startDrag, this);
            }

            this.nuvensSprites.push(nuvemSprite);

            chuvaSprite = this.add.sprite(nuvemX-20, this.nuvem.y + 30, 'chuva');
            chuvaSprite.anchor.set(0.5, 0);
            chuvaSprite.scale.set(0.6, 0.6);
            chuvaSprite.animations.add('rain');
            chuvaSprite.alpha = 0;
            this.chuvaSprites.push(chuvaSprite);

            i++;
        }

        this.nuvem.frame = totalNuvens-1;
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

        this.resetLevel(this.showNextLevel);
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

        this.menino = this.add.sprite(100, 500, 'menino');
        this.menino.anchor.set(0.5, 0.5);
        frames = [];
        for(i = 0; i < 25; i++)
            frames.push(i);
        this.menino.animations.add('idle', frames, 18, true);
        frames = [];
        for(i = 25; i < 51; i++)
            frames.push(i);
        this.menino.animations.add('cheer', frames, 18, false);
        this.menino.animations.play('idle');

        this.nuvem = this.add.sprite(500, 250, 'nuvem');
        this.nuvem.anchor.set(0.5, 0.5);
        this.nuvem.alpha = 0;
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
        var t1 = "As nuvens que estão bem em cima\n do cânion do São Francisco só vão se juntar\n se formarem uma [palavra].\n Sendo assim, cada [sílaba] tem que ir pro seu\n lugar certo. Atenção!";

        var tutorialText1 = this.drawText(this.world.centerX, 35, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 23000);

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
        questionRandom = this.game.rnd.integerInRange(0, this.remainingQuestions1.length-1);
        this.question = this.remainingQuestions1.splice(questionRandom, 1)[0];
        this.playQuestion(this.question);
        this.setupLevel(this.question);
        this.showLevel();
    },

    initLevel2: function() {
        questionRandom = this.game.rnd.integerInRange(0, this.remainingQuestions2.length-1);
        this.question = this.remainingQuestions2.splice(questionRandom, 1)[0];
        this.playQuestion(this.question);
        this.setupLevel(this.question);
        this.showLevel();     
    },

    initLevel3: function() {
        questionRandom = this.game.rnd.integerInRange(0, this.remainingQuestions3.length-1);
        this.question = this.remainingQuestions3.splice(questionRandom, 1)[0];
        this.playQuestion(this.question);
        this.setupLevel(this.question);
        this.showLevel(); 
    },

    checkGame:function(elem){
        console.log("***checkGame***");

        totalNuvens = this.answers[this.question].length;
        won = true;
        last = -1;
        ended = true;
        for(i = 0; i < totalNuvens; i++){
            if(this.nuvensPositioned[i] == -1){
                ended = false;
            }
            if(this.nuvensPositioned[i] <= last){
                won = false;
            }
            last = this.nuvensPositioned[i];
        }

        string = "";
        for(i = 0; i < this.nuvensPositioned.length; i++)
            string+= this.nuvensPositioned[i]+" ";
        console.log(string);

        if(ended) this.toggleInput(false);
        else this.toggleInput(true);

        if(ended && won){
            console.log("CORRETA");
            for(i = 0; i < this.chuvaSprites.length; i++){
                this.chuvaSprites[i].animations.play('rain', 18, true);
                this.chuvaSprites[i].alpha = 1;
            }
            sound = this.sound.play("hitAcerto");
            sound.onStop.addOnce(function(){
                this.createDelayTime(2000, this.clickRightButton);
            }, this);
        } else if(ended && !won) {
            console.log("ERRADA");
            sound = this.sound.play("hitErro");
            sound.onStop.addOnce(function(){
                this.clickWrongButton();
            }, this);
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

        this.resetLevel(function(){
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
        this.resetLevel(function(){
            if(this.currentLocalErrors > 0) {
        
                this.currentLocalErrors--;

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
        
        this.add.tween(this.nuvem).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        delay = 0;
        kill = this.add.group();
        if(this.nuvensSprites.length > 0){
            for(i = 0; i < this.nuvensSprites.length; i++){
                tween = this.add.tween(this.nuvensSprites[i]).to({y: 800}, 500, Phaser.Easing.Linear.None, true, delay);
                kill.add(this.nuvensSprites[i]);
                delay += 500;
                if(callback != null && i == this.nuvensSprites.length - 1){
                    tween.onComplete.add(function(){
                        kill.forEach(function(sprite){
                            sprite.destroy();
                        });
                        this.nuvensSprites = [];
                        callback.call(this);
                    }, this);
                }
            }
        } else {
            if(callback != null)
                callback.call(this);
        }

        for(i = 0; i < this.chuvaSprites.length; i++){
            this.chuvaSprites[i].alpha = 0;
            this.chuvaSprites[i].destroy();
        }
        this.chuvaSprites = [];

        this.nuvensPositioned = [-1, -1, -1, -1];

    },

    showLevel: function(callback){
        console.log("***showLevel***");
        
        this.add.tween(this.nuvem).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        delay = 0;
        for(i = 0; i < this.nuvensSprites.length; i++){
            tween = this.add.tween(this.nuvensSprites[i]).to({y: 500}, 500, Phaser.Easing.Linear.None, true, delay);
            delay += 500;
            if(callback != null && i == this.nuvensSprites.length - 1)
                tween.onComplete.add(callback, this);
        }
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

    playQuestion: function(question, callback){
        soundName = "soundP";
        soundName += Math.ceil(question/3)+"_";
        soundName += question - (Math.ceil(question/3)-1)*3;

        sound = this.sound.play('soundP');
        sound.onStop.addOnce(function(){
            sound = this.sound.play(soundName);
            if(callback != null)
                sound.onStop.addOnce(function(){
                    callback.call(this);
                }, this);
        }, this);

        console.log("playing ", soundName);
    },

    playAnswer: function(elem){
        soundName = "soundP";
        soundName += Math.ceil(this.question/3)+"_";
        
        silabaFrame0 = 0;
        if(this.question == 0)
            silabaFrame0 += 2;
        else if(this.question >= 1 && this.question <= 6){
            silabaFrame0 += 2;
            silabaFrame0 += 3*(this.question - 1);
        } else if(this.question > 6) {
            silabaFrame0 += 2;
            silabaFrame0 += 18;
            silabaFrame0 += 4*(this.question - 7);
        }

        answerFrame = elem.frame;
        soundName += this.answers[this.question][answerFrame-silabaFrame0];

        sound = this.sound.play(soundName); 
    },

    checkPosition: function(elem){
        this.toggleInput(false);
        position = -1;
        totalNuvens = this.answers[this.question].length;
        nuvensSize = 180;
        y0 = this.nuvem.y - this.nuvem.height/2;
        y1 = this.nuvem.y + this.nuvem.height/2;
        for(i = 0; i < totalNuvens; i++){
            x0 = this.world.centerX - (totalNuvens/2)*nuvensSize;
            x0 += nuvensSize*i;
            x1 = x0 + nuvensSize;

            if(elem.x > x0 && elem.x < x1 && elem.y > y0 && elem.y < y1){
                if(this.nuvensPositioned[i] == -1){
                    elem.x = (x1 - x0)/2 + x0;
                    elem.y = (y1 - y0)/2 + y0;
                    this.nuvensPositioned[i] = elem.frame;
                }
            }
        }
        this.checkGame();
    },

    startDrag: function(elem){
        this.game.world.bringToTop(elem);
        index = this.nuvensPositioned.indexOf(elem.frame);
        this.nuvensPositioned[index] = -1;
        this.playAnswer(elem);
    },

    toggleInput: function(flag){
        for(i = 0; i < this.nuvensSprites.length; i++){
            this.nuvensSprites[i].inputEnabled = flag;
        }
    }

};