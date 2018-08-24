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

        this.answers = [0, 2, 4, 6, 9, 12, 15, 18, 21];

        this.remainingQuestions1 = [0, 1, 2];
        this.remainingQuestions2 = [3, 4, 5];
        this.remainingQuestions3 = [6, 7, 8];

        this.tripleAnswer = false;
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

        var t1 = "Só mais um desafio e consertamos tudo!\n Agora são as [parlendas] que estão\n embaralhadas! Bom, é simples e rápido:";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "Eu vou dizer ou cantar uma [parlenda] e vocês\n me ajudam escolhendo a palavra certa, a que\n completa! Vejam só: \"[Corre cipó, na casa da]... [Vó],\n né, gente?\" Agora é com vocês!";
        var tutorialText2 = this.drawText(this.world.centerX, 20, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var kim = this.showKim(11000);

        this.palavras2Sprites[0].frame = 24;
        this.palavras2Sprites[1].frame = 25;
        this.frases.frame = 18;

        //t1in
        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        //t1out
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 11000);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -105}, 500, Phaser.Easing.Bounce.Out, true, 11200);
        //t2in
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 11700).onComplete.add(function(){
            this.showLevel();
            this.showLiveTutorial();
        }, this);
        //t2out
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 29000);

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
        
        //aparece
        this.add.tween(this.arrowGroup).to({alpha:1}, 200, Phaser.Easing.Linear.None, true, 10000).onComplete.add(function(){
            this.add.tween(this.arrowGroup).to({x: this.palavras2Sprites[0].x , y:  this.palavras2Sprites[0].y}, 1000, Phaser.Easing.Linear.None, true, 1000).onComplete.add(function(){
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
    setupLevel: function(level){
        console.log("level: "+level);
        if(level == 1){
            answersTotal = 1;
            this.tripleAnswer = false;
        }
        else{
            answersTotal = 2;
            this.tripleAnswer = true;
        }

        palavrasAux = [];
        for(i = 0; i <= answersTotal; i++)
            palavrasAux.push(i);

        answersAux = [];
        for(i = this.answers[this.question]; i <= this.answers[this.question]+answersTotal; i++)
            answersAux.push(i);
        console.log(answersAux.toString());

        //resposta certa
        palavra = palavrasAux.splice(this.game.rnd.integerInRange(0, palavrasAux.length-1), 1)[0];
        frame = answersAux.splice(0, 1)[0];
        if(level == 1){
            this.correctPalavra = this.palavras2Sprites[palavra];
            this.palavras2Sprites[palavra].frame = frame;
        } else {
            this.correctPalavra = this.palavras3Sprites[palavra];
            this.palavras3Sprites[palavra].frame = frame;
        }

        while(palavrasAux.length > 0){
            //escolhe o botao
            palavra = palavrasAux.splice(this.game.rnd.integerInRange(0, palavrasAux.length-1), 1)[0];
            //escolhe a frame do botao
            frame = answersAux.splice(this.game.rnd.integerInRange(0, answersAux.length-1), 1)[0];
            console.log("frame", frame);
            if(level == 1)
                this.palavras2Sprites[palavra].frame = frame;
            else
                this.palavras3Sprites[palavra].frame = frame;
        }

        this.frases.frame = this.question*2;
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

        this.brilhoVerde = this.add.sprite(0, 0, 'brilho_verde');
        this.brilhoVerde.alpha = 0;
        this.brilhoVermelho = this.add.sprite(0, 0, 'brilho_vermelho');
        this.brilhoVermelho.alpha = 0;

        this.frases = this.add.sprite(this.world.centerX, this.world.centerY, 'frases');
        this.frases.anchor.setTo(0.5, 0.5);
        this.frases.alpha = 0;

        this.palavras2Sprites = [];
        this.palavras2PositionsX = [this.world.centerX - 150, this.world.centerX + 150];
        for(i = 0; i < 2; i++){
            palavra = this.add.sprite(-125, 550, 'palavras');
            palavra.anchor.setTo(0.5, 0.5);
            palavra.width = 225;
            palavra.height = 70;
            palavra.events.onInputDown.add(this.mouseInputDown, this);
            this.palavras2Sprites.push(palavra);
        }

        this.palavras3Sprites = [];
        this.palavras3PositionsX = [this.world.centerX - 255, this.world.centerX, this.world.centerX + 255];
        for(i = 0; i < 3; i++){
            palavra = this.add.sprite(-125, 550, 'palavras');
            palavra.anchor.setTo(0.5, 0.5);
            palavra.width = 225;
            palavra.height = 70;
            palavra.events.onInputDown.add(this.mouseInputDown, this);
            this.palavras3Sprites.push(palavra);
        }
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
        var t1 = "Esses versinhos que brincam com\n a gente e nos divertem se chamam [parlendas].\n Quando não estão completas temos que prestar\n atenção no que vai fazer sentido pra deixá-las\n redondinhas. Prestem atenção, pois a palavra\n que falta rima com uma outra!";

        var tutorialText1 = this.drawText(this.world.centerX, 20, t1, 22, "center");
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
        this.playQuestion(this.question, function(){
            this.toggleInputs(true);
        });
        this.setupLevel(1);
        this.showLevel();
    },

    initLevel2: function() {
        questionRandom = this.game.rnd.integerInRange(0, this.remainingQuestions2.length-1);
        this.question = this.remainingQuestions2.splice(questionRandom, 1)[0];
        this.playQuestion(this.question, function(){
            this.toggleInputs(true);
        });
        this.setupLevel(2);
        this.showLevel();     
    },

    initLevel3: function() {
        questionRandom = this.game.rnd.integerInRange(0, this.remainingQuestions3.length-1);
        this.question = this.remainingQuestions3.splice(questionRandom, 1)[0];
        this.playQuestion(this.question, function(){
            this.toggleInputs(true);
        });
        this.setupLevel(3);
        this.showLevel(); 
    },

    mouseInputDown:function(elem){ // elem = elemento que foi clicado
        console.log("***mouseInputDown***");
        this.toggleInputs(false);
        this.checkGame(elem);
    },

    toggleInputs: function(flag){
        for(i = 0; i < this.palavras3Sprites.length; i++)
            this.palavras3Sprites[i].inputEnabled = flag;
        for(i = 0; i < this.palavras2Sprites.length; i++)
            this.palavras2Sprites[i].inputEnabled = flag;
    },

    checkGame:function(elem){
        console.log("***checkGame***");

        if(elem == this.correctPalavra){
            console.log("CORRETA");
            this.frases.frame ++;
            this.playAnswer(this.question, elem.frame, this.clickRightButton);
        } else {
            console.log("ERRADA");
            this.playAnswer(this.question, elem.frame, this.clickWrongButton);
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
            this.add.tween(this.brilhoVerde).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.sound.play("hitAcerto");
                this.add.tween(this.brilhoVerde).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.gotoNextLevel();
                }, this);
            }, this);
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
            this.add.tween(this.brilhoVermelho).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.sound.play("hitErro");
                this.add.tween(this.brilhoVermelho).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
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

                }, this);
            }, this);
        });
    },

    resetLevel:function(callback){
        console.log("***resetLevel***");
        
        delay = 0;
        if(this.tripleAnswer){
            for(i = 0; i < this.palavras3Sprites.length; i++){
                this.add.tween(this.palavras3Sprites[i]).to({x: -125}, 1000, Phaser.Easing.Linear.None, true, delay);
                delay += 500;
            }
        } else {
            for(i = 0; i < this.palavras2Sprites.length; i++){
                this.add.tween(this.palavras2Sprites[i]).to({x: -125}, 1000, Phaser.Easing.Linear.None, true, delay);
                delay += 500;
            }
        }

        this.add.tween(this.frases).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        if(callback != null)
            this.createDelayTime(delay+1500, callback);
    },

    showLevel: function(callback){
        console.log("***showLevel***");
        
        delay = 0;
        if(this.tripleAnswer){
            for(i = 0; i < this.palavras3Sprites.length; i++){
                this.add.tween(this.palavras3Sprites[i]).to({x: this.palavras3PositionsX[i]}, 1000, Phaser.Easing.Linear.None, true, delay);
                delay += 500;
            }
        } else {
            for(i = 0; i < this.palavras2Sprites.length; i++){
                this.add.tween(this.palavras2Sprites[i]).to({x: this.palavras2PositionsX[i]}, 1000, Phaser.Easing.Linear.None, true, delay);
                delay += 500;
            }
        }

        this.add.tween(this.frases).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        if(callback != null)
            this.createDelayTime(delay+1000, callback);

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
        soundName += Math.floor(question/3)+1+"_";
        soundName += question - Math.floor(question/3)*3 + 1;
        sound = this.sound.play(soundName);
        sound.onStop.addOnce(callback, this);
        console.log("playing ", soundName);
    },

    playAnswer: function(question, answer, callback){
        soundName = "soundP";
        soundName += Math.floor(question/3)+1+"_";
        soundName += question - Math.floor(question/3)*3 + 1+"_";
        soundName += answer - this.answers[question] + 1;
        sound = this.sound.play(soundName);
        sound.onStop.addOnce(callback, this);
        console.log("playing ", soundName);
    },

};