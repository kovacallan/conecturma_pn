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

        /*editor*/
        this.pointX = [];
        this.pointY = [];
        //this.gradeGuia(1000, 600);
            

        this.TEMPO_INTRO = 24000;
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
        this.resetRandom();
        this.createScene();
        this.showIntro();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();

    },



    keyPress: function(elem){
        console.log("entrou aqui");
        if( this.keyboard_permission ){
            console.log("Valor colocado: " + elem);
            console.log("Valor certo: "+ this.right_keyboard_answear);
            if(elem == this.right_keyboard_answear) this.clickRightButton(elem);
            else this.clickWrongButton(elem);
        }
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

        var t1 = "Para ajudar o Bumba a reconectar a \ninternet, precisamos [acender três] \n[antenas].";
        // Mas para conseguir,temos \nque ajudar fazendo a conta certa! Vamos lá: 
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t2 = "Ao tentar acender, elas dizem uma [palavra] que \nestá escrita em um dos botões, como nesse \nexemplo. [Clicamos] na palavra correta e pronto! \nE não podemos demorar muito, hein? Já!";
        var tutorialText1 = this.drawText(this.world.centerX, 30, t2, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var kim = this.showKim(8000);

    
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);


        this.createDelayTime(8000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
            this.add.tween(tutorialText1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        });

        this.createDelayTime(this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText1).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);//.onComplete.add(this.showFinishedLiveTutorial, this);
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
        this.luz[1].alpha = 0;
        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }

        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        if(this.ENABLE_PLACAR){
            this.createDelayTime(500, function() {
                this.showNextLevel();
            });

        }else{          
            this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
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
        //console.log("callback " + callback);
        if(this.imageQuestion == null) {
            return;
        }

        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

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
        //this.background = this.addSpriteMeu('background',-228,-246,0);
        this.background = this.add.sprite(-70,-101.11, 'background');

        this.luz = [null,1,2,3];
        this.luz[1] = this.add.sprite(366.66,275.53, 'luz');
        //this.luz[1] = this.addSpriteMeu('luz',339.60,231.35,0);
        this.luz[1].anchor.set(0.5,0.5);
        this.luz[1].scale.set(0.4,0.4);
        this.luz[1].alpha = 0;

        this.luz[2] = this.add.sprite(489.17,275.53, 'luz');
        //this.luz[2] = this.addSpriteMeu('luz',460.68,231.35,0);
        this.luz[2].anchor.set(0.5,0.5);
        this.luz[2].scale.set(0.4,0.4);
        this.luz[2].alpha = 0;

        this.luz[3] = this.add.sprite(611.74,275.53, 'luz');
        //this.luz[3] = this.addSpriteMeu('luz',584.68,231.35,0);
        this.luz[3].anchor.set(0.5,0.5);
        this.luz[3].scale.set(0.4,0.4);
        this.luz[3].alpha = 0;

        //this.initLevel1();
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");


        this.btn = this.add.sprite(392.30,527.55,"mundo");
        this.btn1 = this.add.sprite(581.76,526.36,"fundo");

        this.groupIntro.add(this.btn);
        this.groupIntro.add(this.btn1);

        this.btn.scale.set(0.7,0.7);
        this.btn.anchor.set(0.5,0.5);
        this.btn.alpha = 0;

        this.btn1.scale.set(0.7,0.7);
        this.btn1.anchor.set(0.5,0.5);
        this.btn1.alpha = 0;

        this.arrow = this.add.sprite(640,190, 'arrow');
        this.arrow.alpha =0;

        this.click = this.add.sprite(0, 0, "clickAnimation");
        this.click.animations.add('idle', null, 18, true);
        this.click.alpha = 0;

        this.groupIntro.add(this.arrow);
        this.groupIntro.add(this.click);

        this.createDelayTime(3000, function() {
            this.add.tween(this.btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true)
            this.add.tween(this.btn1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.arrow).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            }, this);
        });


        this.createDelayTime(3000, function() {
            this.add.tween(this.btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true)
            this.add.tween(this.btn1).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.arrow).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            }, this);
        });

        this.createDelayTime(9000, function() {
            this.add.tween(this.arrow).to({x:392.30,y:527.55}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.animClick();
                this.luz[1].alpha = 1;
                this.add.tween(this.luz[1].scale).to({x: 0.6, y: 0.6}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.add.tween(this.luz[1].scale).to({x: 0.4, y: 0.4}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        this.createDelayTime(3000, function() {
                            
                            this.showFinishedLiveTutorial();
                        });
                    },this);
                },this);
            }, this);

        });
    },

    animClick:function(){
        this.click.x = this.arrow.x;
        this.click.y = this.arrow.y;
        this.click.alpha = 1;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},800, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;
            //this.arrow.alpha = 0;
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
    
            this.add.tween(this.luz[1]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

            this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.initGame, this);
        });
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
        var t1 = "Para escolher a palavra certa, precisamos estar \natentos aos [sons] que ela faz e lembrar que [letras] \nvão nos ajudar a escrevê-la. É fácil, mas é preciso \nestar bem atento. Vamos lá?";
        
        var tutorialText = this.drawText(this.world.centerX, 30, t1, 22, "center");
            tutorialText.alpha = 0;

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.setDebugAudio("soundResumo");

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
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
        console.log("showCallToAction " + this.showCallToAction);

        switch(levelNum) {
            case 1:
                this.showQuestion(1);
                if(this.showCallToAction) {
                    this.initLevel1();
                } else {   
                    this.sound.play("soundP1").onStop.addOnce(this.initLevel1, this);
                }
            break;
            case 2:
                this.showQuestion(2);
                if(this.showCallToAction) {
                    this.initLevel2();
                } else {   
                    this.sound.play("soundP1").onStop.addOnce(this.initLevel2, this);
                }
                
            break;
            case 3:
                this.showQuestion(3);
                if(this.showCallToAction) {
                    this.initLevel3();
                } else {   
                    this.sound.play("soundP1").onStop.addOnce(this.initLevel3, this);
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

        var questionList = [ null,
            "",
            "",
            ""
        ];

        this.imageQuestion = this.drawText(this.world.centerX, 30, questionList[num]);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }

        if(this.ENABLE_PLACAR){
            this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        }else{
            this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        }
    },
           

    Createbuttons:function(spr,spr1){

        var sx = 0.7;
        var sx1 = 0.7;
        var sy = 0.7;
        var sy1 = 0.7;

        if(spr=='tempestade')
        {
            sx = 0.5;
            sy = 0.5;
        }
        if(spr1=='tempestade')
        {
            sx1 = 0.5;
            sy1 = 0.5;
        }

        this.buttons = [];
        this.buttons.push( this.add.sprite(392.30,527.55, spr));
        this.buttons.push( this.add.sprite(581.76,526.36, spr1));
        
        this.groupLevel[this.currentLevel].add(this.buttons[0]);
        this.groupLevel[this.currentLevel].add(this.buttons[1]);
       

        this.buttons[0].scale.set(sx,sy);
        this.buttons[0].anchor.set(0.5,0.5);
        this.buttons[0].name = spr;
        this.buttons[0].click = true;

        this.buttons[1].scale.set(sx1, sy1);
        this.buttons[1].anchor.set(0.5,0.5);
        this.buttons[1].name = spr1;
        this.buttons[1].click = true;
    },

    liberarClick:function(){
        console.log("*** liberarClick ***");
        this.buttons[0].inputEnabled = true;
        this.buttons[0].input.useHandCursor = true;
        this.buttons[0].events.onInputDown.add(this.mouseInputDown, this);

        this.buttons[1].inputEnabled = true;
        this.buttons[1].input.useHandCursor = true;
        this.buttons[1].events.onInputDown.add(this.mouseInputDown, this);
    },


    initLevel1: function() {

        console.log("***initLevel1***");
        this.currentLight = 1;
        this.groupLevel[this.currentLevel] = this.add.group();

        var itens = [0,1,2,3];
      
        this.temp_array = itens.slice();
        item = this.sorteio();
        itens= this.temp_array.slice();

        var text_itens = new Array(['vida','pingo'],['tempestade','chuva'],['tambor','bateria'],['campo','grama']);
        this.certo = text_itens[item][0];
        this.errado = text_itens[item][1];

        console.log(item);
        console.log("--> item certo: "+text_itens[item][0]);
        console.log("--> item errado: "+text_itens[item][1]);

        var aux = [text_itens[item][0],text_itens[item][1]];
     
        aux.sort(function() {
            return .5 - Math.random();
        });

        this.Createbuttons(aux[0],aux[1]);

        this.sound.play(this.certo).onStop.addOnce(function(){
            console.log("--> liberar: ");
            this.liberarClick();
        }, this);
    },

    initLevel2: function() {
        console.log("***initLevel2***");
        this.currentLight = 2;
        this.groupLevel[this.currentLevel] = this.add.group();

        var itens = [0,1,2,3];
      
        this.temp_array = itens.slice();
        item = this.sorteio();
        itens= this.temp_array.slice();

        item = 0;

        var text_itens = new Array(['lombo','tampo'],['limpo','ombro'],['lembrar','tonto'],['sempre','tanto']);
        this.certo = text_itens[item][0];
        this.errado = text_itens[item][1];

        console.log(item);
        console.log("--> item certo: "+text_itens[item][0]);
        console.log("--> item errado: "+text_itens[item][1]);

        var aux = [text_itens[item][0],text_itens[item][1]];
     
        aux.sort(function() {
            return .5 - Math.random();
        });

        this.Createbuttons(aux[0],aux[1]);

        this.sound.play(this.certo).onStop.addOnce(function(){
            console.log("--> liberar: ");
            this.liberarClick();
        }, this);
    },

    initLevel3: function() {
        console.log("***initLevel3***");
        this.currentLight = 3;
        this.groupLevel[this.currentLevel] = this.add.group();

        var itens = [0,1,2,3];
      
        this.temp_array = itens.slice();
        item = this.sorteio();
        itens= this.temp_array.slice();

        var text_itens = new Array(['flores','dores'],['vento','tempo'],['mundo','fundo'],['onda','pompa']);
        this.certo = text_itens[item][0];
        this.errado = text_itens[item][1];

        console.log(item);
        console.log("--> item certo: "+text_itens[item][0]);
        console.log("--> item errado: "+text_itens[item][1]);

        var aux = [text_itens[item][0],text_itens[item][1]];
     
        aux.sort(function() {
            return .5 - Math.random();
        });

        this.Createbuttons(aux[0],aux[1]);

        this.sound.play(this.certo).onStop.addOnce(function(){
            console.log("--> liberar: ");
            this.liberarClick();
        }, this);
        

    },

    
    /**
    *
    * Controle de Perguntas, que serão mostradas no jogo
    * 
    **/

    resetRandom: function() { 
        this.spliceLetter = [
            null,
            [],
            [],
            [],
            []
        ];
    },

    getRandomItem: function(list, level) {
        var letters = this.getNonRepeat(list, level);
        var n = this.rnd.integerInRange(0,letters.length-1);
        return letters[n];
    },
    getNonRepeat: function(itens, num) {
        var _name = [];
        for(var i = 0; i < itens.length; i++) {
            _name.push(itens[i]);
        }
        for(var i = 0; i < this.spliceLetter[num].length; i++) {
            if(_name.indexOf(this.spliceLetter[num]) >= 0) {
                _name.splice(i,1);
            }
        }

        if(_name.length < 1) {
            return itens;
        }
        return _name;
    },

    retirarArrayElemento:function(elem){
        var index = this.temp_array.indexOf(elem);
        for (i=index; i<this.temp_array.length-1; i++)
        {
            this.temp_array[i] = this.temp_array[i+1];
        }
        this.temp_array.pop();
    },
    sorteio:function(){    
        var item = parseInt(this.getRandomItem(this.temp_array, 1));   
        this.retirarArrayElemento(item); 
        return item;
    },

    mouseInputDown:function(elem){
        console.log("mouseInputDown");
        console.log("elem: "+elem.name + " == "+this.certo);

        var elem1 = this.luz[this.currentLight];
       

        if(elem.click){
            if(elem.name==this.certo){
                elem1.alpha = 1;
                this.buttons[0].click = false;
                this.buttons[1].click = false;
               
                console.log("CERTO!!!");
                this.sound.play("hitAcerto");
                this.add.tween(elem1.scale).to({x: 0.6, y: 0.6}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.add.tween(elem1.scale).to({x: 0.4, y: 0.4}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        this.clickRightButton();
                    },this);
                },this);
            }else{
                this.buttons[0].click = false;
                this.buttons[1].click = false;
                console.log("ERRADO!!!");
                this.sound.play("hitErro");

                if(this.currentLight > 1)
                    this.add.tween(this.luz[this.currentLight-1]).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        this.clickWrongButton(); 
                    }, this);
                else
                    this.clickWrongButton(); 

                //this.add.tween(elem1.scale).to({x: 0.6, y: 0.6}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    //this.add.tween(elem1.scale).to({x: 0.4, y: 0.4}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        //this.clickWrongButton();
                    //},this);
                //},this);
            }
       }

    },
    
    
    onGameButtonOver: function(elem){
        this.add.tween(elem.scale).to({x: 0.9, y: 0.9}, 200, Phaser.Easing.Linear.None, true);
    },

    onGameButtonOut: function(elem){
        this.add.tween(elem.scale).to({x: 0.8, y: 0.8}, 200, Phaser.Easing.Linear.None, true);
    },

    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção CORRETA, 
    * seja a ação por clique, drag ou keypress
    * 
    **/
    clickRightButton: function(target) {
        this.onPlayerSuccess();
        this.resetLevel(this.currentLevel);
        this.createDelayTime(500, function() {
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
        this.resetLevel(this.currentLevel);
        //if(target != null && target.alpha < 1) {
            ///return;
        //}
        /***
            this.ENABLE_CALL_TO_ACTION = true para desabilitar o erro no painel 
        ***/
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
                    this.hideLevel(function() {
                        this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
                    });
                }); 
                
            break;
            case 0: // toca som de resumo
                this.lives = 0;

                this.createDelayTime(500, function() {
                    this.hideLevel();
                    this.showResumo(); 
                });
                
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


    resetLevel:function(nivel){
        
        console.log("***resetLevel***");
        
        this.createDelayTime(500, function() {
             this.add.tween(this.groupLevel[nivel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
             
             if(this.groupLevel[nivel] != null) {
                this.groupLevel[nivel].removeAll(true);
             }
        }); 
    },


    changeHappy:function(elem, anim,anim2,x,y,x1,y1){
        elem.loadTexture(anim, 0);
        elem.x = x;
        elem.y = y;
        var anim  = elem.animations.add(anim);
        
        anim.onComplete.add(function() {
            this.changeIdlle(elem,anim2,x1,y1);
        }, this);
        anim.play(18);
    },

    changeIdlle:function(elem,anim,x,y){
        elem.loadTexture(anim, 0);
        elem.x = x;
        elem.y = y;
        elem.animations.add(anim);
        elem.animations.play(anim, 18, true);
    },



    /**** editor *****/
    /*
    gradeGuia:function(width,height)
    {
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

    addSpriteMeu:function(sprite,x,y,frame)
    {
        spr = this.game.add.sprite(x,y, sprite,frame);
        //spr.anchor.set(0.5,0.5);
        this.enableDragDrop(spr);
        return spr;
    },

    enableDragDrop:function(elem)
    {
        elem.inputEnabled = true;
        elem.input.enableDrag();
        elem.events.onDragStart.add(this.onDragStart, this);
        elem.events.onDragStop.add(this.onDragStop, this);
    },

    onDragStart:function(sprite, pointer) {

        this.result = "Dragging " + sprite.key;

    },

    onDragStop:function (sprite, pointer) {

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

    },
    */

};





