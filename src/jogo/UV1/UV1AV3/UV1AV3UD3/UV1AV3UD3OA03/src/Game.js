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
        this.totalErro3 = 0;

        /*****************************************************************/
        this.keyboard_permission = false;
        this.right_keyboard_answear;
        this.input.keyboard.addCallbacks(this, null, null, this.keyPress);

        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

        this.groupLevel = [null,1,2,3];

        this.questionsCharacter = [0, 4, -1, 2, -1];
        this.questionsColumns = [2, 3, 3, 5, 5];
        this.characters = ['bug', 'omega', 'pi', 'robo', 'robocam'];

        this.createScene();
        this.showIntro();

        this.question = 0;
        this.setupLevel(1);

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

        var t1 = "Blackout! Estamos sem luz!\n Existe um Bug dourado que\n acende de novo todas as lâmpadas!";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "Para o encontrarmos precisamos clicar na\n informação correta do gráfico de emergência,\n pois as perguntas foram feitas para que pessoas\ninteligentes conseguissem religar tudo!";
        var tutorialText2 = this.drawText(this.world.centerX, 15, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var kim = this.showKim(6000);

        //setup level tutorial

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0).onComplete.add(function(){
            this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 6000).onComplete.add(function(){
                this.add.tween(this.tutorialPlacar).to({y: -105}, 500, Phaser.Easing.Bounce.Out, true, 200);
                this.showLevel();
                this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
                    this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 12000).onComplete.add(function(){
                            this.add.tween(this.tutorialPlacar).to({y: -300}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
                    }, this);
                }, this);
            }, this);
        }, this);

        //sound
        this.soundIntro = this.setDebugAudio("soundIntro");
    },
    /**
    *
    * Função para gerar valores do nível
    *
    **/ 
    setupLevel: function(level){
        console.log("level: "+level);
        //set values
        columnWidth = 65;
        minColumnHeight = 20;
        maxPadding = 100;
        minPadding = 20;
        containerWidth = 535;
        containerHeight = 345;
        spriteHeight = 90;
        totalColumns = this.questionsColumns[level];
        innerSize = totalColumns*columnWidth + (totalColumns + 1)*maxPadding;
        if(innerSize > containerWidth){
            padding = (containerWidth - totalColumns*columnWidth)/(totalColumns + 1);
            if(padding < minPadding) padding = minPadding;
            innerSize = totalColumns*columnWidth + (totalColumns + 1)*padding;
        } else {
            padding = maxPadding;
        }
        this.columnHeights = [];
        heightsAux = [1, 2, 3, 4, 5];
        //stepSize = (containerHeight - spriteHeight - minColumnHeight)/heightsAux.length;
        stepSize = 60;
        higher = -1;
        lower = heightsAux[heightsAux.length-1];
        higherId = -1;
        lowerId = -1;
        for(i = 0; i < totalColumns; i++){
            randomHeight = heightsAux.splice(this.game.rnd.integerInRange(0, heightsAux.length - 1), 1)[0];
            console.log("randomHeight " + randomHeight);
            if(randomHeight > higher){
                higher = randomHeight;
                higherId = i;
            }
            if(randomHeight < lower){
                lower = randomHeight;
                lowerId = i;
            }
            this.columnHeights.push(randomHeight*stepSize - minColumnHeight);
        }
        console.log("higher "+higherId, "lower "+lowerId);
        charactersAux = this.characters.slice(0);
        if(this.questionsCharacter[level] == -1)
            randomCharacter = true
        else
            randomCharacter = false;

        //groups
        this.graphGameGroup = this.add.group();
        this.graph = [];
        columnsGroup = [];
        charactersGroup = [];
        //draw
        cursorX = this.world.centerX - innerSize/2;
        cursorY = this.world.centerY + 210;
        for(i = 0; i < totalColumns; i++){
            cursorX += padding;
            columnSprite = this.add.sprite(cursorX, cursorY, 'coluna');
            columnSprite.anchor.set(0, 1);
            columnSprite.width = columnWidth;
            columnSprite.height = 0;
            if( ((i == higherId && this.question == 0) || (i == lowerId && this.question == 1)) || (this.question == 2 && i != higherId && i != lowerId) )
                this.rightColumn = columnSprite;
            columnSprite.events.onInputDown.add(this.mouseInputDown, this);
            columnsGroup.push(columnSprite);
            this.graphGameGroup.add(columnSprite);

            if(randomCharacter)
                character = charactersAux.splice(this.game.rnd.integerInRange(0, charactersAux.length - 1),1)[0];
            else
                character = this.characters[this.questionsCharacter[level]];

            characterSprite = this.add.sprite(0, 0, character);
            characterSprite.anchor.set(0.5, 0.5);
            characterSprite.x = cursorX + columnWidth/2;
            characterSprite.y = columnSprite.y - this.columnHeights[i] - characterSprite.height/2 - 10;
            characterSprite.alpha = 0;
            charactersGroup.push(characterSprite);
            this.graphGameGroup.add(characterSprite);
            cursorX += columnWidth;
        }
        this.graph.push(columnsGroup);
        this.graph.push(charactersGroup);
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

        this.resetLevel(function(){
            this.graphGameGroup.removeAll(true);
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
        var t1 = "Um [gráfico de colunas] possui duas linhas:\n [horizontal] e [vertical]. Eles existem para\n mostrarmos informações de uma maneira mais\n visual, diferente de quando usamos apenas a\n escrita, a palavra, para explicarmos tudo."

        var tutorialText1 = this.drawText(this.world.centerX, 30, t1, 22, "center");
            tutorialText1.alpha = 0;
            this.groupIntro.add(tutorialText1);

        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 20000);

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
            case 4:
                this.initLevel4();
            break;
            case 5:
                this.initLevel5();
            break;
        }
    },
           
    initLevel1: function() {
        this.level = 0;
        possibleQuestions = [0, 1];
        this.question = possibleQuestions[this.game.rnd.integerInRange(0,possibleQuestions.length-1)];
        this.playQuestion(this.question);
        this.setupLevel(this.level);
        this.showLevel(function(){
            this.toggleInputs(true);
        });
    },

    initLevel2: function() {
        this.level = 1;
        possibleQuestions = [0, 1];
        this.question = possibleQuestions[this.game.rnd.integerInRange(0,possibleQuestions.length-1)];
        this.playQuestion(this.question);
        this.setupLevel(this.level);
        this.showLevel(function(){
            this.toggleInputs(true);
        });   
    },

    initLevel3: function() {
        this.level = 2;
        possibleQuestions = [0, 1, 2];
        this.question = possibleQuestions[this.game.rnd.integerInRange(0,possibleQuestions.length-1)];
        this.playQuestion(this.question);
        this.setupLevel(this.level);
        this.showLevel(function(){
            this.toggleInputs(true);
        });
    },

    initLevel4: function() {
        this.level = 3;
        possibleQuestions = [0, 1];
        this.question = possibleQuestions[this.game.rnd.integerInRange(0,possibleQuestions.length-1)];
        this.playQuestion(this.question);
        this.setupLevel(this.level);
        this.showLevel(function(){
            this.toggleInputs(true);
        });
    },

    initLevel5: function() {
        this.level = 4;
        possibleQuestions = [0, 1];
        this.question = possibleQuestions[this.game.rnd.integerInRange(0,possibleQuestions.length-1)];
        this.playQuestion(this.question);
        this.setupLevel(this.level);
        this.showLevel(function(){
            this.toggleInputs(true);
        });
    },

    mouseInputDown:function(elem){ // elem = elemento que foi clicado
        console.log("***mouseInputDown***");
        this.toggleInputs(false);
        this.checkGame(elem);
    },

    checkGame:function(elem){
        console.log("***checkGame***");
        if(elem == this.rightColumn){
            console.log("CORRETA");
            this.sound.play("hitAcerto");
            this.clickRightButton();
        } else {
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

        this.resetLevel(this.gotoNextLevel); 
    },
    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção ERRADA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickWrongButton: function(target) {

        this.createDelayTime(1000, function() {

            if(this.currentLocalErrors > 0) {
                
                this.currentLocalErrors--;

                this.sound.play("hitErro");
                return;
            }
            
            this.onPlayerError();
            
            switch(this.lives) {
                case 1: // mostra dica 1
                    this.createDelayTime(500, function() {
                        this.sound.play("soundDica").onStop.add(function(){
                            this.resetLevel(this.onCompleteShowDica);
                        }, this);
                    }); 
                    
                break;
                case 0: // toca som de resumo
                    this.lives = 0;
                    this.createDelayTime(500, function() {
                        this.resetLevel(this.showResumo);
                    });
                    
                break;
            }
            this.updateLivesText();
        });
    },

    resetLevel:function(callback){
        console.log("***resetLevel***");
        
        delay = 0;
        for(i = 0; i < this.graph[0].length; i++){
            this.add.tween(this.graph[1][i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, delay);
            tween = this.add.tween(this.graph[0][i]).to({height: 0}, 500, Phaser.Easing.Linear.None, true, delay+500);
            if(i == this.graph[0].length - 1 && callback != null)
                tween.onComplete.add(callback, this);
            delay += 500;
        }
    },

    showLevel: function(callback){
        console.log("***showLevel***");

        delay = 0;
        for(i = 0; i < this.graph[0].length; i++){
            this.add.tween(this.graph[0][i]).to({height: this.columnHeights[i]}, 1000, Phaser.Easing.Linear.None, true, delay);
            tween = this.add.tween(this.graph[1][i]).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, delay + 1000);
            if(i == this.graph[0].length - 1 && callback != null)
                tween.onComplete.add(callback, this);
            delay += 1000;
        }
        
    },

    toggleInputs: function(flag){
        for(i = 0; i < this.graph[0].length; i++){
            this.graph[0][i].inputEnabled = flag;
        }
    },

    playQuestion: function(question, callback){
        soundName = "soundP";
        soundName += (this.level+1)+"_";
        soundName += this.question+1;
        sound = this.sound.play(soundName);
        if(callback != null)
            sound.onStop.addOnce(callback, this);
        console.log("playing ", soundName);
    },


};