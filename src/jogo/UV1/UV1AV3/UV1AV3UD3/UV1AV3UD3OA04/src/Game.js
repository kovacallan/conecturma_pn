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
        this.totalLevel1 = 2;
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

        this.createScene();
        this.showIntro();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();
        //this.goGame = true;
        this.playSound = false; // para tocar um som de uma vez
        this.som = null; // recebe o som que está tocando

        this.questions1 = [0, 1, 2, 3, 4];
        this.questions2 = [5, 6, 7, 8, 9];
        this.questions3 = [10, 11, 12, 13, 14, 15];
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

        var t1 = "Oh não! O Ser folclórico danado\n corrompeu os arquivos de imagens!\n As [fotos] que estavam no sistema!\n Porém, somos espertos e conseguimos\n resolver isso em dois tempos, é fácil:";
        var tutorialText1 = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var t2 = "O arquivo de imagem vai aparecer no monitor\n e teremos duas palavras, numa estará escrito\n corretamente o nome do\n objeto retratado.";
        var tutorialText2 = this.drawText(this.world.centerX, 15, t2, 21, "center");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);

        var t3 = "Na outra ele vai estar escrito errado!\n Basta ler… e escolher!";
        var tutorialText3 = this.drawText(this.world.centerX, 35, t3, 21, "center");
        tutorialText3.alpha = 0;
        this.groupIntro.add(tutorialText3);

        var kim = this.showKim(14500);

        //setup level tutorial
        this.setupLevel(1);

        //t1in
        this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0);

        //t1out
        this.add.tween(tutorialText1).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 15000);

        //placar sobe
        this.add.tween(this.tutorialPlacar).to({y: -125}, 500, Phaser.Easing.Bounce.Out, true, 15200);
        //t2in
        this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 15700);
        //t2out
        this.add.tween(tutorialText2).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 27000);
        //t3in
        this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 27200).onComplete.add(function(){
                this.showLiveTutorial();
        }, this);
        //t3out
        this.add.tween(tutorialText3).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true, 35000);

        //objetos
        this.add.tween(this.objetos).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 20000);

        //palavras1
        this.add.tween(this.palavras1).to({x: this.palavras1X}, 500, Phaser.Easing.Linear.None, true, 23000);

        //palavras2
        this.add.tween(this.palavras2).to({x: this.palavras2X}, 500, Phaser.Easing.Linear.None, true, 23000);      

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
        this.add.tween(this.arrowGroup).to({alpha:1}, 200, Phaser.Easing.Linear.None, true, 3000).onComplete.add(function(){
            this.add.tween(this.arrowGroup).to({x: this.getRightButton().x , y:  this.getRightButton().y}, 1000, Phaser.Easing.Linear.None, true, 2000).onComplete.add(function(){
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
    setupLevel: function(question){
        console.log("question: "+question);
        answer = this.game.rnd.integerInRange(0, 1);

        this.palavras1.frame = (question + 1)*2 - 2;
        this.palavras2.frame = (question + 1)*2 - 2;  
        if(answer == 1)
            this.palavras1.frame++;
        else
            this.palavras2.frame++;

        this.objetos.frame = question;
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

        this.add.tween(this.palavras1).to({x: this.palavras1XInitial}, 1000, Phaser.Easing.Linear.None, true);

        this.add.tween(this.palavras2).to({x: this.palavras2XInitial}, 1000, Phaser.Easing.Linear.None, true);

        this.add.tween(this.objetos).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);

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
        this.background = this.add.sprite(0, 0, 'background');

        this.bumba = this.add.sprite(110, 450, 'anim_bumba');
        this.bumba.anchor.set(0.5, 0.5);
        frames = [];
        for(i=0;i<70;i++)
            frames.push(i);
        this.bumba.animations.add('idle', frames, 18, true);
        frames = [];
        for(i=70;i<98;i++)
            frames.push(i);
        this.bumba.animations.add('cheer', frames, 18, true);

        this.bumba.play('idle');

        this.objetos = this.add.sprite(760, 200, 'objetos');
        this.objetos.alpha = 0;
        this.objetos.scale.set(0.7, 0.7);
        this.objetos.anchor.set(0.5, 0.5);

        this.palavras1XInitial = -370;
        this.palavras1X = 260;
        this.palavras1 = this.add.sprite(this.palavras1XInitial, 550, 'palavras');
        this.palavras1.anchor.setTo(0.5, 0.5);
        this.palavras1.width = 225;
        this.palavras1.height = 70;

        this.palavras2XInitial = -125;
        this.palavras2X = 500;
        this.palavras2 = this.add.sprite(this.palavras2XInitial, 550, 'palavras');
        this.palavras2.anchor.setTo(0.5, 0.5);
        this.palavras2.width = 225;
        this.palavras2.height = 70;


        this.palavras1.events.onInputDown.add(this.mouseInputDown, this);
        this.palavras2.events.onInputDown.add(this.mouseInputDown, this);
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
        var t1 = "Às vezes confundimos o [G] com o [J],\n às vezes não sabemos se usamos [GU] ou\n só o [G], [QU] ou só o [C] ou o [Q]...\n não é mole não, mas é lindo! Aprendendo\n mais e aprendendo sempre, vamos\n tentar outra vez, Conecturma!";

        var tutorialText1 = this.drawText(this.world.centerX, 30, t1, 22, "center");
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

        this.bumba.play('idle');

        console.log("init level", levelNum, this.currentLevel);

        console.log("remaining questions", this.questions1.toString(), this.questions2.toString(), this.questions3.toString());

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
            case 6:
                this.initLevel6();
            break;
        }
    },
           
    initLevel1: function() {
        this.question = this.questions1.splice(this.game.rnd.integerInRange(0,this.questions1.length-1), 1)[0];
        this.playQuestion(this.question, function(){
            this.palavras1.inputEnabled = true;
            this.palavras2.inputEnabled = true;
        });
        this.setupLevel(this.question);
        this.showLevel();
    },

    initLevel2: function() {
        this.question = this.questions1.splice(this.game.rnd.integerInRange(0,this.questions1.length-1), 1)[0];
        this.playQuestion(this.question, function(){
            this.palavras1.inputEnabled = true;
            this.palavras2.inputEnabled = true;
        });
        this.setupLevel(this.question); 
        this.showLevel();      
    },

    initLevel3: function() {
        this.question = this.questions2.splice(this.game.rnd.integerInRange(0,this.questions2.length-1), 1)[0];
        this.playQuestion(this.question, function(){
            this.palavras1.inputEnabled = true;
            this.palavras2.inputEnabled = true;
        });
        this.setupLevel(this.question);    
        this.showLevel();   
    },

    initLevel4: function() {
        this.question = this.questions2.splice(this.game.rnd.integerInRange(0,this.questions2.length-1), 1)[0];
        this.playQuestion(this.question, function(){
            this.palavras1.inputEnabled = true;
            this.palavras2.inputEnabled = true;
        });
        this.setupLevel(this.question);    
        this.showLevel();
    },

    initLevel5: function() {
        this.question = this.questions3.splice(this.game.rnd.integerInRange(0,this.questions3.length-1), 1)[0];
        this.playQuestion(this.question, function(){
            this.palavras1.inputEnabled = true;
            this.palavras2.inputEnabled = true;
        });
        this.setupLevel(this.question);     
        this.showLevel();  
    },

    initLevel6: function() {
        this.question = this.questions3.splice(this.game.rnd.integerInRange(0,this.questions3.length-1), 1)[0];
        this.question = this.game.rnd.integerInRange(10,15);
        this.playQuestion(this.question, function(){
            this.palavras1.inputEnabled = true;
            this.palavras2.inputEnabled = true;
        });
        this.setupLevel(this.question);  
        this.showLevel();     
    },

    mouseInputDown:function(elem){ // elem = elemento que foi clicado
        console.log("***mouseInputDown***");
        this.palavras1.inputEnabled = false;
        this.palavras2.inputEnabled = false;
        this.checkGame(elem);
    },

    checkGame:function(elem){
        console.log("***checkGame***");
        if(elem == this.getRightButton()){
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

        this.resetLevel();

        this.bumba.play('cheer');

        this.createDelayTime(1000, function() {
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

    resetLevel:function(){
        console.log("***resetLevel***");
        
        this.add.tween(this.palavras1).to({x: this.palavras1XInitial}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.palavras2).to({x: this.palavras2XInitial}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.objetos).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
    },

    showLevel: function(){
        console.log("***showLevel***");
        
        this.add.tween(this.palavras1).to({x: this.palavras1X}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.palavras2).to({x: this.palavras2X}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.objetos).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
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
        soundName = "sound";
        soundNames = [
            'P1_camera', 
            'P1_queijo', 
            'P1_mosquito',
            'P1_jacare', 
            'P1_galo',
            'P2_girafa', 
            'P2_jaca',
            'P2_joelho', 
            'P2_jujuba', 
            'P2_guache', 
            'P3_quindim',
            'P3_basquete',
            'P3_parque', 
            'P3_caju',
            'P3_feijoada',
            'P3_beijo',
        ];
        soundName += soundNames[question];
        sound = this.sound.play(soundName);
        sound.onStop.addOnce(callback, this);
        console.log("playing ", soundName);
    },

    getRightButton: function(){
        if(this.palavras1.frame%2 == 0)
            return this.palavras1;
        else
            return this.palavras2;
    },


};