/** 
* version 1.0.2
**/

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
            

        this.TEMPO_INTRO = 6500;
        this.ENABLE_CALL_TO_ACTION = true;


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

        // variaveis do jogo 
        this.textGame();
        this.buttonTutorial = [];
        this.TEMPO_INTRO2 = 24500;
        this.groupLevel = [null,1,2,3];


        this.input.onTap.add(function() {
            console.log("Posicao do Mouse:", this.input.x, this.input.y);
        }, this);

    },


    // textos do jogo 
    textGame:function(){

        this.texto = new Array();
        this.texto['initialText'] = "O Bumba teve um sonho em que \na Conecturma disputava várias \ncorridas! Daí, Vejam só.";
        this.texto['initialText2'] ="O primeiro lugar é o [número 1], o segundo, \n[número] [2], o terceiro: [número 3] e assim por \ndiante! Então,vamos ajudar o Bumba a \narrumar os vencedores da corrida nos \npódios?";
        this.texto['imgResumo'] ="[Os números] ordinais servem para colocarmos as \ncoisas em ordem. Podem ser usados em filas, em \npódio de vencedores de algum esporte, nos \ncampeonatos de futebol e de beleza, em concursos, \netc."; 
        this.texto['imgResumo1'] ="Representamos os números ordinais usando o \nnúmero com este sinal: [º], assim: [1º- primeiro], \n[2º - segundo], [3º- terceiro], e por aí vai! \nVamos colocar as coisas em ordem? "; 
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = [ null,
            "",
            "",
            ""
        ];
    },

    /**
    *
    * Cria um sprite com uma animação simples em loop na velocidade padrão usando todos os frames que tiverem no objeto
    *
    **/
    createAnimation: function( x, y, name, scaleX, scaleY) { 
        var spr = this.add.sprite(x,y, name);
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

        this.groupIntro = this.add.group();

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.groupIntro.add(this.tutorialPlacar);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");
        this.tutorialPlacar.addChild(this.skipButton);


        

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

        this.tutorialText = this.drawText(this.world.centerX+60, 50, this.texto['initialText'], 22, "left");//this.add.sprite( this.world.centerX+60, 110, 'initialText');
        this.tutorialText.alpha = 0;
        //this.tutorialText.anchor.set(0.5, 0.5);

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(this.tutorialText);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(this.tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
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
        this.placar.alpha=1;

        //this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
        // não há placar 
        this.createDelayTime(500, this.showNextLevel);
    },

    /**
    *
    * Esconde o texto da pergunta quando tiver e esconde a placa que mostra o texto.
    * Ao final do efeito executa a função {callback} se houver
    * 
    **/
    hideLevel: function(callback) {
        console.log("*** hideLevel ***");
        //if(this.imageQuestion == null) {
            ///return;
        //}

        //this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        if(callback != null) {
            //não há placar 
            this.createDelayTime(800, callback);
            //this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
        } /*else {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500);
        }*/
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
        this.hideLevel(function() {
            console.log("-> hideLevel");
            console.log(this.currentLevel +" <= 3 && "+ this.corrects + "<= 2");
            if(this.currentLevel <= 3 && this.corrects <= 2) {
                console.log("-> if hideAndShowLevel");
                //não há placar 
                this.createDelayTime(800, this.showNextLevel);
                //this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);

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
    * Remove ações do botão e direciona para o proximo level se {gotoNext} for verdadeiro
    * 
    **/
    showCorrectName: function(gotoNext) {
        console.log("*** showCorrectName ***");
        //this.removeButtonAction();

        if(gotoNext) {
            this.createDelayTime( 2000, this.gotoNextLevel);
        }
    },

    /**
    *
    * Faz calculo de qual deve ser o nível seguinte e direciona o jogador para o nivel seguinte se houver
    * 
    **/
    gotoNextLevel: function() {
        console.log("*** gotoNextLevel ***");
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

        this.background = this.add.sprite( -400, -670, 'background');
        
        this.pedras = this.add.sprite( 140, 230, 'position_rocks');
        this.pedras.scale.set(0.9,0.9);
        
        this.cenario = this.add.sprite( -420, 400, 'cenario');

        this.createSprites();

    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        this.add.tween(this.tutorialPlacar).to({y: -100}, 1000, Phaser.Easing.Linear.None, true, 500);
        
        this.tutorialText = this.drawText(this.world.centerX, 10, this.texto['initialText2'], 22, "left");//this.add.sprite( this.world.centerX, 70, 'initialText2');
        this.tutorialText.alpha = 0;

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(this.tutorialText);
        
        for( var i = 0; i < 3; i++ ){
            
            var x_location = 200 + ( 60 * i );
            var y_location = 470;
                
            this.buttonTutorial[i] = this.createButton( x_location, y_location, i, 100, true);
            
            this.groupIntro.add(this.buttonTutorial[i]);
                
        }
        
        this.createDelayTime( 100, function() {
            this.showFinishedLiveTutorial();
        }, this);
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showFinishedLiveTutorial:function() {

        this.createDelayTime( 5500, function(){
            this.arrow = this.add.sprite(this.world.centerX, this.world.centerY, "arrow");
            this.arrow.anchor.set(0.5,0.5);
            this.groupIntro.add(this.arrow);
            this.add.tween(this.arrow).to({x: this.buttonTutorial[0].x + 30, y: this.buttonTutorial[0].y + 20}, 600, Phaser.Easing.Linear.None, true);
        },this);
        
        this.createDelayTime( 7500, function(){
            
            var click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
            click.animations.add('idle', null, 18, true);
            click.animations.play('idle');
            this.groupIntro.add(click);
            
            this.createDelayTime( 2400, function() {
                click.alpha = 0;
                click.destroy();
            });
        });
        
        this.createDelayTime( 10000, function(){
            
            this.add.tween(this.buttonTutorial[0]).to({x: 545, y: 185}, 1200, Phaser.Easing.Linear.None, true);
            this.add.tween(this.arrow).to({x: 545 + 30, y: 185 + 20}, 1200, Phaser.Easing.Linear.None, true);
            
        });
        
        this.createDelayTime( 12000, function(){
            
            this.createDelayTime( 100, function(){
                this.add.tween(this.arrow).to({x: this.buttonTutorial[1].x + 30, y: this.buttonTutorial[1].y + 20}, 400, Phaser.Easing.Linear.None, true);
            });
            
            this.createDelayTime( 600, function(){
                
                this.add.tween(this.buttonTutorial[1]).to({x: 700, y: 290}, 1200, Phaser.Easing.Linear.None, true);
                this.add.tween(this.arrow).to({x: 700 + 30, y: 290 + 20}, 1200, Phaser.Easing.Linear.None, true);
                
            }); 
        }, this);
        
        this.createDelayTime( 14000, function(){
            
            this.createDelayTime( 100, function(){
                this.add.tween(this.arrow).to({x: this.buttonTutorial[2].x + 30, y: this.buttonTutorial[2].y + 20}, 400, Phaser.Easing.Linear.None, true);
            });
            
            this.createDelayTime( 600, function(){
                
                this.add.tween(this.buttonTutorial[2]).to({x: 380, y: 230}, 1200, Phaser.Easing.Linear.None, true);
                this.add.tween(this.arrow).to({x: 380 + 30, y: 230 + 20}, 1200, Phaser.Easing.Linear.None, true);
                
            }); 
        }, this);
        
        this.createDelayTime( this.TEMPO_INTRO2, function() {
            
            this.add.tween(this.groupIntro).to({alpha: 0}, 1200, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);

        });

    },

    /**
    *
    * Função inicial para mostrar resumo do jogo. Sempre que o jogador errar 2x.
    * Todos os itens criados no resumo devem ser adicionados ao grupo 'this.groupIntro'
    * 
    **/
    showResumo: function() {
        console.log("*** showResumo ***");
        this.groupIntro = this.add.group();
        
        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placarResumo');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.skipButton = this.add.button(230, 220, "hud", this.skipResumo, this,"skipButton","skipButton","skipButton","skipButton");
        this.tutorialPlacar.addChild(this.skipButton);

        this.groupIntro.add(this.tutorialPlacar);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextResumo, this);
        //this.add.tween(this.groupLevel).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){ this.groupLevel.removeAll(); }, this);
        //this.add.tween(this.groupFront).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){ this.groupFront.removeAll(); }, this);
    },

    /**
    *
    * Função que mostra o texto do resumo.
    * Ao final chama a função global que esconde o resumo
    * 
    **/
    showTextResumo: function() {
        


        this.tutorialText = this.drawText(this.world.centerX, 30, this.texto['imgResumo'], 21, "left");//this.add.sprite( this.world.centerX, 90, 'resumo_img');
        this.tutorialText.alpha = 0;
        //this.tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(this.tutorialText);

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);


        this.tutorialText1 = this.drawText(this.world.centerX, 30, this.texto['imgResumo1'], 21, "left");//this.add.sprite( this.world.centerX, 90, 'resumo_img');
        this.tutorialText1.alpha = 0;
        //this.tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(this.tutorialText1);

        this.createDelayTime(17000, function(){
            this.add.tween(this.tutorialText).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        });

        this.soundResumo = this.setDebugAudio("soundResumo");
        
        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(this.tutorialText1).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
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

        console.log("init level", levelNum, this.currentLevel);

        switch(levelNum) {
            case 1:

                //this.showQuestion(1);
                if(this.showCallToAction) {
                    this.initLevel1();
                } else {
                    this.sound.play("soundCallToAction").onStop.addOnce(this.initLevel1, this);
                }
            break;
            case 2:

                //this.showQuestion(2);
                if(this.showCallToAction) {
                    this.initLevel2();
                } else {
                    this.sound.play("soundCallToAction").onStop.addOnce(this.initLevel2, this);
                }
            break;
            case 3:

                //this.showQuestion(3);
                if(this.showCallToAction) {
                this.initLevel3();
                } else {
                    this.sound.play("soundCallToAction").onStop.addOnce(this.initLevel3, this);
                }
            break;
        }
        this.showCallToAction = false;
    },

    /**
    *
    * Controle de Perguntas, que serão mostradas no jogo
    * 
    **/
    showQuestion: function(num) {

        /*this.delay = 500;
        
        if(!this.showCallToAction){
          this.levelAudio = this.sound.play('soundCallToAction'); 
          this.delay = 6000;  
        }
        else{
            this.delay = 1500;
        }
        
        if(this.showCallToAction) {
            return;
        }*/
       
    },


    initLevel1: function() {

        console.log("*** initLevel1 ***");
        this.groupLevel[this.currentLevel] = this.add.group();  
        this.corretas = 3;//3
        this.quantidade = 3;//3
        this.errosRodada = 0;
        var item;

        item = this.rnd.integerInRange(0,2);
        //item =0;
        console.log("item: "+item);
        this.jogadores = new Array();
        for( var i = 0; i < this.quantidade; i++ ){
                var jog = item+i;
                var x = 200 + ( 60 * i );
                var y = 470;
                console.log("jog: "+jog);
                this.jogadores[i] = this.add.sprite(x,y, "position_"+jog);
                this.jogadores[i].anchor.set(0.5,0.5);
                this.jogadores[i].scale.set(0.8,0.8);
                this.groupLevel[this.currentLevel].add(this.jogadores[i]);
                this.jogadores[i].id = jog;
                console.log("id: "+this.jogadores[i].id);
                this.habilitarFuncoes(this.jogadores[i]); 

                //var texto  = jog.toString();
                //this.drawText(x, y, texto, 30, "left"); 
        }
    },

    

    initLevel2: function() {

        console.log("*** initLevel2 ***");
        this.groupLevel[this.currentLevel] = this.add.group();  
        this.corretas = 4;//3
        this.quantidade = 4;//3
        this.errosRodada = 0;
        var item;

        item = this.rnd.integerInRange(0,1);
        //item =0;
        console.log("item: "+item);
        this.jogadores = new Array();
        for( var i = 0; i < this.quantidade; i++ ){
                var jog = item+i;
                var x = 200 + ( 60 * i );
                var y = 470;
                console.log("jog: "+jog);
                this.jogadores[i] = this.add.sprite(x,y, "position_"+jog);
                this.jogadores[i].anchor.set(0.5,0.5);
                this.jogadores[i].scale.set(0.8,0.8);
                this.groupLevel[this.currentLevel].add(this.jogadores[i]);
                this.jogadores[i].id = jog;
                console.log("id: "+this.jogadores[i].id);
                this.habilitarFuncoes(this.jogadores[i]); 

                //var texto  = jog.toString();
                //this.drawText(x, y, texto, 30, "left"); 
        }

    },

    initLevel3: function() {
        console.log("*** initLevel3 ***");
        this.groupLevel[this.currentLevel] = this.add.group();  
        this.corretas = 5;//3
        this.quantidade = 5;//3
        this.errosRodada = 0;
        var item;

        //item = this.rnd.integerInRange(0,1);
        item =0;
        console.log("item: "+item);
        this.jogadores = new Array();
        for( var i = 0; i < this.quantidade; i++ ){
                var jog = item+i;
                var x = 200 + ( 60 * i );
                var y = 470;
                console.log("jog: "+jog);
                this.jogadores[i] = this.add.sprite(x,y, "position_"+jog);
                this.jogadores[i].anchor.set(0.5,0.5);
                this.jogadores[i].scale.set(0.8,0.8);
                this.groupLevel[this.currentLevel].add(this.jogadores[i]);
                this.jogadores[i].id = jog;
                console.log("id: "+this.jogadores[i].id);
                this.habilitarFuncoes(this.jogadores[i]); 

                //var texto  = jog.toString();
                //this.drawText(x, y, texto, 30, "left"); 
        }
    },

    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção CORRETA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    
    clickRightButton: function(target) {
        console.log("*** clickRightButton ***");
        this.onPlayerSuccess();
        this.resetLevel(this.currentLevel);
        this.createDelayTime(1500, function() {
          this.showCorrectName(true);  
        }); 
    },




    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção ERRADA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    
    clickWrongButton: function(target) {
        console.log("*** clickWrongButton ***");
        this.resetLevel(this.currentLevel);
        
        if(this.currentLocalErrors > 0) {
            
            this.currentLocalErrors--;

            this.sound.play("hitErro");
            this.onErrorChance(target);
            return;
        }
        
        this.onPlayerError();

        console.log("live: "+this.lives);
        switch(this.lives) {
            case 1: // mostra dica 1
                console.log("caso 1: ");
                this.hideLevel(function() {
                    this.sound.play("soundDica").onStop.addOnce(this.onCompleteShowDica, this);
                });
            break;
            case 0: // toca som de resumo
                console.log("caso 2: ");
                this.lives = 0;
                this.hideLevel();
                this.showResumo();
            break;
        }
        this.updateLivesText();
    },

    /**
    *
    * Função disparada como callback case o usuario ainda possua mais de uma chance de clicar no item antes de ser considerado como erro
    * 
    **/
    onErrorChance: function(target) {

    },

    /**
    *
    * Função Auxiliar disparada quando o jogador acerta a pergunta.
    * 
    **/
    createAnimationCorrect: function(target) {
        
        console.log(this.correctItem);

        var t = this.add.tween(this.correctItem)
                    .to({x:this.world.centerX-450 + this.verifyCurrentLevel()*200, y: 250}, 1300, Phaser.Easing.Linear.None)
                    .to({y: 290}, 200, Phaser.Easing.Linear.None);
        t.start();
    },

    /**
    * GAMEPLAY
    * Função do Jogo - UV1AV1UD6OA05-.
    * 
    **/

    // original usada na intro somente 
    createButton: function( x, y, hitGroupValue, time, canInteract) {
        
        var btn; 
        
        btn = this.add.button(x,y, "position_"+hitGroupValue, null, this);
    
        btn.anchor.set(0.5,0.5); 
        btn.scale.set(0.8,0.8);
        btn.origin_x = x;
        btn.origin_y = y;
        btn.position_x = x;
        btn.position_y = y;
        btn.hitGroup = hitGroupValue;
    

        return btn;
    },

    createSprites:function(){
        console.log("*** createSprites  ***");
        //this.hitmap(755, 320, 855, 445, 3, 800, 340);
        /*this.drawPoint(0xff0000,755,320);
        this.drawPoint(0xff0000,755,445);
        this.drawPoint(0xff0000,855,320);
        this.drawPoint(0xff0000,855,445);

        //this.hitmap(650, 245, 750, 360, 1, 700, 290);
        this.drawPoint(0x0000ff,650,245);
        this.drawPoint(0x0000ff,650,360);
        this.drawPoint(0x0000ff,750,245);
        this.drawPoint(0x0000ff,750,360);

        //this.hitmap(475, 155, 615, 300, 0, 545, 185);
        this.drawPoint(0x0ffff0,475,155);
        this.drawPoint(0x0ffff0,475,300);
        this.drawPoint(0x0ffff0,615,155);
        this.drawPoint(0x0ffff0,615,300);

        //this.hitmap(235, 265, 325, 350, 4, 280, 280);
        this.drawPoint(0x00000f,235,265);
        this.drawPoint(0x00000f,235,350);
        this.drawPoint(0x00000f,325,265);
        this.drawPoint(0x00000f,325,350);

        //this.hitmap(335, 180, 445, 325, 2, 380, 230);
        this.drawPoint(0xffff00,335,180);
        this.drawPoint(0xffff00,335,325);
        this.drawPoint(0xffff00,445,180);
        this.drawPoint(0xffff00,445,325);*/

        this.posPedras = new Array(0,1,2,3,4)

        this.posPedras[0] = new Array([475,155],[615,300]); // [xInicial,yInicial][xFinal,yFinal]
        this.posPedras[1] = new Array([650,245],[750,360]); // [xInicial,yInicial][xFinal,yFinal]
        this.posPedras[2] = new Array([335,180],[445,325]); // [xInicial,yInicial][xFinal,yFinal]
        this.posPedras[3] = new Array([755,320],[855,445]); // [xInicial,yInicial][xFinal,yFinal]
        this.posPedras[4] = new Array([235,265],[325,350]); // [xInicial,yInicial][xFinal,yFinal]

        this.posCorreta = new Array(0,1,2,3,4);

        this.posCorreta[0] = new Array(506, 237);
        this.posCorreta[1] = new Array(693, 307);
        this.posCorreta[2] = new Array(361, 250);
        this.posCorreta[3] = new Array(788, 376);
        this.posCorreta[4] = new Array(270, 286);

        console.log(this.posPedras[0][0][0]);

        this.pedras = new Array();

        for(i=0; i<5; i++){

            var width = this.posPedras[i][1][0]-this.posPedras[i][0][0]; // xFinal - xInicial
            var height = this.posPedras[i][1][1]-this.posPedras[i][0][1]; // yFinal - yInicial

            var x  = this.posPedras[i][0][0];//xInicial;
            var y  = this.posPedras[i][0][1];//yInicial;
           
            

            console.log("--> width "+width);
            console.log("--> height "+height);
            console.log("--> x "+x);
            console.log("--> y "+y);

            this.pedras[i] = this.drawSprite(width,height,x,y);
            this.pedras[i].id = i;
            this.pedras[i].check = false; // para saber se a pedra já está ocupada e não testar

            //var texto  = i.toString();
            //this.drawText(x, y, texto, 30, "left"); 
        }
    },

    drawSprite:function(w,h,x,y) {
        console.log("*** drawSprite  ***");
        // create a new bitmap data object
        var bmd = this.game.add.bitmapData(w,h);

        // draw to the canvas context like normal
        bmd.ctx.beginPath();
        bmd.ctx.rect(0,0,w,h);
        bmd.ctx.fillStyle = '#ff0000';
        bmd.ctx.fill();

        var sprite = this.game.add.sprite(x, y, bmd);
        sprite.alpha =0;

        return sprite;
    },

    drawPoint:function(cor,x,y){ 
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(0);
        graphics.beginFill(cor,1);
        graphics.drawCircle(x,y,5);
        graphics.endFill();

        //graphics.moveTo(0, 0);
        //graphics.lineStyle(5, 0xFFFFFF, 1);
        //graphics.lineTo(x, y);
    },

    habilitarFuncoes:function(spr){
        spr.inputEnabled = true;
        spr.input.enableDrag(false, true);
        spr.input.useHandCursor = true;

        spr.events.onDragStart.add(this.onStartDrag, this);
        spr.events.onDragStop.add(this.onStopDrag, this); 
        //spr.events.onInputOver.add(this.onGameButtonOver, this);
        
    },

    desabilitarFuncoes: function(){
        for( var i = 0; i < this.quantidade; i++ ){
            this.jogadores[i].inputEnabled = false;
            this.jogadores[i].input.useHandCursor = false;
        }
    },

    resetLevel:function(nivel){
        
        console.log("***resetLevel***");
        this.stone_text = null;
        this.createDelayTime(1500, function() {
             this.add.tween(this.groupLevel[nivel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
             for(var itm in this.pedras) {
                this.pedras[itm].check = false;
                console.log(" check "+this.pedras[itm].check);
                console.log("--");
            }
             
             if(this.groupLevel[nivel] != null) {
                this.groupLevel[nivel].removeAll(true);
             }
        }); 
    },

    checkOverlap:function(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    },

    onStartDrag: function(elem) {
        console.log("*** onStartDrag ***");
        this.initialPos = {x:elem.x, y:elem.y};
        //this._onStartDrag = true;
        //this._onStopDrag = false;

    },

    onStopDrag: function(elem) {
        console.log("*** onStopDrag ***");
        console.log("x: "+elem.x, " y: "+elem.y);
        var resultado = 0;
        var countOverlap = 0; // contador para quando o jogador colocar entre duas posiçoes e houver duas interseçoes 
        var numCorreta = null;
        console.log("--> contador  antes do for -> "+countOverlap);
        for(var itm in this.pedras) {
            console.log("elem: "+elem.id+" pedras: "+this.pedras[itm].id);
            console.log("verificar: "+this.pedras[itm].check);
            if(!this.pedras[itm].check){ // verificar somente se uma marca não está ocupada 
                if (this.checkOverlap(elem, this.pedras[itm])){ // verificando interseção entre as imagens do holder(marca) com a pedra 
                    //countOverlap++;
                    console.log("--> contador -> "+countOverlap);
                    console.log("*** houve  Overlap; true ***");
                    console.log("elem: "+elem.id +" - pedra: "+this.pedras[itm].id);
                    if(elem.id == this.pedras[itm].id){
                        console.log("*** Correto ***");
                        resultado = 1; // se estiver correto 
                        numCorreta = itm; 
                        break; 
                    }else{
                        console.log("*** Errado ***");
                        resultado = 2; // se estiver errado
                        break;
                    }    
                }else{
                    console.log("*** houve  Overlap; false ***");
                    console.log("*** Reposiona ***");
                    //resultado = 0; // se estiver que reposicionar 
                }
            }

            
        }

        // se houver interseção em duas áreas é considerado errado
        console.log("--> countOverlap: "+countOverlap); 
        if(countOverlap>=2){
            console.log("-- if countOverlap: ---"+countOverlap); 
            resultado = 2;
        }
        // 
        console.log("-- ErrosRodada: ---"+this.errosRodada); 
        console.log("-- resultado: ---"+resultado); 
        if(resultado==2){
            console.log("-- if ErrosRodada: ---"+resultado); 
            this.errosRodada++;
            console.log("-- if ErrosRodada err: ---"+this.errosRodada +' < 2');
            if(this.errosRodada<2){
                console.log("-- if ErrosRodada: ---"+this.errosRodada); 
                resultado = 0;
            }
                         
        }

       

        console.log("-----RESULTADO------");
            console.log("x: "+elem.x+" y: "+elem.y);
            switch(resultado){
                case 0:
                    console.log("*** Reposiona ***");
                    this.sound.play("hitErro");
                    this.add.tween(elem).to({x: this.initialPos.x, y: this.initialPos.y}, 200, Phaser.Easing.Linear.None, true);
                break;
                case 1:
                    console.log("*** Correto ***");
                    this.sound.play('hitAcerto');
                    elem.inputEnabled = false;
                    elem.input.useHandCursor = false;
                    console.log("-> numCorreta: "+numCorreta);
                    console.log("x: "+elem.x+" y: "+elem.y);
                    console.log("x: "+this.posCorreta[numCorreta][0]+" y: "+this.posCorreta[numCorreta][1]);
                    elem.x = this.posCorreta[numCorreta][0];
                    elem.y = this.posCorreta[numCorreta][1];
                    this.pedras[numCorreta].check = true;

                    for(var itm in this.pedras) {
                        console.log(" check "+this.pedras[itm].check);
                        console.log("--");
                    }
                    if(this.corretas>0){
                        this.corretas--;
                    }
                    console.log("--> this.corretas: "+this.corretas);
                    if(this.corretas==0){
                        // chamar a funçao de reposta certa para mudar de nível 
                        this.desabilitarFuncoes(); // desabilitar os drag and drop 
                        this.createDelayTime(1000, function() {
                            console.log("-> clickRightButton");
                            this.clickRightButton();
                        });  
                        
                    }
                break;
                case 2:
                    console.log("*** Errado ***");
                    this.sound.play("hitErro");
                    this.desabilitarFuncoes(); // desabilitar os drag and drop 
                    // chamar a funçao de reposta errada
                    this.createDelayTime(1000, function() {
                        console.log("-> clickWrongButton");
                        this.clickWrongButton();
                    });
                break;
            }
            console.log("-----FIM RESULTADO------");

    },

};





