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
            

        this.TEMPO_INTRO = 16000;
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


        /// variaveis do jogo 

        this.groupLevel = [null,1,2,3];
        this._onStartDrag = false;
        this._onStopDrag= false;
        
        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];
        this.textGame();
        this.createScene();
        this.showIntro();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();
        this.callDica = false;

    },

    textGame:function(){

        this.texto = new Array();
        this.texto['initialText'] = "Agora a atenção da Polly e do Saci está \ntoda no caminho... Mas no caminho havia \numa pedra, aliás, no caminho havia \nvárias pedras com sílabas formando \npalavras... Todas embaralhadas!";
        this.texto['initialText2'] ="Antes de continuar, vamos deixá-las \norganizadas, formando a sua palavra, \ncomo aqui. [NA – TU – RE – ZA]. É com a gente!";
        this.texto['imgResumo'] ="As sílabas precisam estar na ordem correta para \nque uma palavra surja delas. Lendo cada uma das \nsílabas vemos se elas fazem sentido daquele jeito \nou não. Vamos praticar?";
         
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

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");
        this.tutorialPlacar.addChild(this.skipButton);


        this.groupIntro = this.add.group();
        this.groupIntro.add(this.tutorialPlacar);

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

        this.tutorialText = this.drawText(this.world.centerX+60, 30, this.texto['initialText'], 21, "left");
        this.tutorialText.alpha = 0;

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

        console.log("*** initGame ***");

        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }

        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

       this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
    },

    /**
    *
    * Esconde o texto da pergunta quando tiver e esconde a placa que mostra o texto.
    * Ao final do efeito executa a função {callback} se houver
    * 
    **/
    hideLevel: function(callback) {

        console.log("*** hideLevel ***");
        if(this.imageQuestion == null) {
            return;
        }

        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        if(callback != null) {
            console.log("*** callback != null  ***");
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
        } else {
            console.log("*** callback ***");
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
        console.log("*** hideAndShowLevel ***");
        this.hideLevel(function() {

            if(this.currentLevel <= 3 && this.corrects <= 2) {
                console.log("*** NEXT ***");
                this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);

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
        this.removeButtonAction();

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

        this.background = this.add.sprite( -440, -720, 'background');
        
        this.poly = this.createAnimation( 95, 190, "poly_anim", 1.0, 1.0);  
        this.poly.animations.add('idle', this.math.numberArray(0,29), 18, true);
        this.poly.animations.add('comemora', this.math.numberArray(30,59), 18, false);
        this.poly.animations.play('idle');
        
        this.saci = this.createAnimation( 45, 255, "saci_anim", 1.0, 1.0);  
        this.saci.animations.add('idle', this.math.numberArray(0,29), 18, true);
        this.saci.animations.add('comemora', this.math.numberArray(30,59), 18, false);
        this.saci.animations.play('idle');

        //temporaria 
        //this.initGame();

    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");
        this.tutorialText =this.drawText(this.world.centerX, 30, this.texto['initialText2'], 21, "left"); 
        this.tutorialText.alpha = 0;
        this.buttonTutorial = [];

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(this.tutorialText);
        
        for( var i = 0; i < 4; i++ ){
            
            var position_x = 400 + ( 120 * i );
            
            switch(i){
                case 0:
                this.buttonTutorial[i] = this.createButton( position_x , 515, i, 1, 100, false, 3);
                this.buttonTutorial[i].frame = 1;
                break;
                case 1:
                this.buttonTutorial[i] = this.createButton( position_x , 515, i, 2, 100, false, 1);
                this.buttonTutorial[i].frame = 2;
                break;
                case 2:
                this.buttonTutorial[i] = this.createButton( position_x , 515, i, 0, 100, false, 2);
                this.buttonTutorial[i].frame = 0;
                break;
                case 3:
                this.buttonTutorial[i] = this.createButton( position_x , 515, i, 4, 100, false, 0);
                this.buttonTutorial[i].frame = 4;
                break;
            }
            
            this.groupIntro.add(this.buttonTutorial[i]);
        }

        this.createDelayTime( 100, function() {
            this.tween_words(this.buttonTutorial[0]);
            this.tween_words(this.buttonTutorial[1]);
            this.tween_words(this.buttonTutorial[2]);
            this.tween_words(this.buttonTutorial[3]);
            this.showFinishedLiveTutorial();
        }, this);
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showFinishedLiveTutorial:function() {
        console.log("*** showFinishedLiveTutorial ***");
        this.createDelayTime( 5500, function(){
            this.arrow = this.add.sprite(this.world.centerX, this.world.centerY, "arrow");
            this.arrow.anchor.set(0.5,0.5);
            this.groupIntro.add(this.arrow);
            this.add.tween(this.arrow).to({x: this.buttonTutorial[3].x + 30, y: this.buttonTutorial[3].y + 20}, 600, Phaser.Easing.Linear.None, true);
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
            
            this.add.tween(this.buttonTutorial[3]).to({x: 500, y: 360}, 1200, Phaser.Easing.Linear.None, true);
            this.add.tween(this.arrow).to({x: 530, y: 360}, 1200, Phaser.Easing.Linear.None, true);
            
        });
        
        this.createDelayTime( 12000, function(){ this.move_tutorial(620, 1)}, this);
        this.createDelayTime( 13000, function(){ this.move_tutorial(720, 2)}, this);
        this.createDelayTime( 14000, function(){ this.move_tutorial(860, 0)}, this);
        
        this.createDelayTime( 16000, function() {
            
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

        this.groupIntro = this.add.group();

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placarResumo');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.skipButton = this.add.button(230, 220, "hud", this.skipResumo, this,"skipButton","skipButton","skipButton","skipButton");
        this.tutorialPlacar.addChild(this.skipButton);

        this.groupIntro.add(this.tutorialPlacar);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextResumo, this);
    },

    /**
    *
    * Função que mostra o texto do resumo.
    * Ao final chama a função global que esconde o resumo
    * 
    **/
    showTextResumo: function() {

        this.sound.stopAll();
        this.tutorialText = this.drawText(this.world.centerX, 50, this.texto['imgResumo'], 21, "left");
        this.tutorialText.alpha = 0;
       
        this.groupIntro.add(this.tutorialText);

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.sound.play("soundResumo");

        // tempo para mostrar o tutorial das letras
        this.createDelayTime( 15000, function() {

            this.add.tween(this.tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.hideResumo();
            },this);

        });
    },

    /**
    *
    * Controla qual será o proximo level que o jogador irá jogar.
    * Caso o jogo possua mais de 3 perguntas, deve-se adicionar mais itens no 'switch' com contagem corrida de level de 1 a X
    * e fazer a configuração dos detalhes do nível no topo do jogo
    * 
    **/
    showNextLevel: function() {
        console.log("*** showNextLevel ***");
        var levelNum = this.verifyCurrentLevel();

        console.log("init level", levelNum, this.currentLevel);

        switch(levelNum) {
            case 1:

                this.showQuestion(1);
                if(this.showCallToAction) {
                    this.initLevel1();
                } else {
                    this.sound.play("soundCallToAction").onStop.addOnce(this.initLevel1, this);
                }
            break;
            case 2:

                this.showQuestion(2);
                if(this.showCallToAction) {
                    this.initLevel2();
                } else {
                    this.sound.play("soundCallToAction").onStop.addOnce(this.initLevel2, this);
                }
            break;
            case 3:

                this.showQuestion(3);
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

        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        var questionList = [ null,
            "Pedras bagunçadas... \nQue palavra elas formam?",
            "Pedras bagunçadas... \nQue palavra elas formam?",
            "Pedras bagunçadas... \nQue palavra elas formam?"
        ];

        this.imageQuestion = this.drawText(this.world.centerX, 50, questionList[num]);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },


    initLevel1: function() {

        //this.initLevel3();
        console.log("*** initLevel1  ***");
        
        this.groupLevel[this.currentLevel] = this.add.group();
        this._onStartDrag = false;
        this._onStopDrag = false;

        this.itens = [0,1,2];
        this.corretas = 2;

        
        // silalas para sorteio 
        this.silabas = [0,1,2];
        this.silabas[0] = new Array(0,1);//GRU – TA
        this.silabas[1] = new Array(2,3);//PE – DRA
        this.silabas[2] = new Array(4,5);//FO – LHA

        // posicao das pedas 

        this.posicao = [0,1];
        this.posicao[0] = new Array(305,540);// posicionamento em x
        this.posicao[1] = new Array(515,545);// posicionamento em y
    
        // gera um item unico de acordo com regras do jogo para a lista
        var item = this.getRandomUniqueItem(this.itens);

        console.log("item: "+item);
        //sequencia correta
        this.iscorrect = this.silabas[item].slice();
        console.log("seq: "+this.iscorrect);

        this.somPalavra = 'palavra_1_'+item;

        console.log("som: "+this.somPalavra);

        this.silabas[item].sort(function() {
          return .5 - Math.random();
        });
        console.log(this.silabas[item]);

        // desenhando as pedras 
        this.pedras = new Array();

        console.log(this.silabas[item][0]);
        console.log(this.silabas[item][1]);

        this.pedras[0] = this.add.sprite(this.posicao[0][0],this.posicao[1][0], 'palavras',this.silabas[item][1]);
        this.pedras[1] = this.add.sprite(this.posicao[0][1],this.posicao[1][1], 'palavras',this.silabas[item][0]);

        this.pedras[0].anchor.set(0.5,0.5);
        this.pedras[1].anchor.set(0.5,0.5);

        this.pedras[0].scale.set(0.6,0.6);
        this.pedras[1].scale.set(0.6,0.6);

        this.pedras[0].id=this.silabas[item][1];
        this.pedras[1].id=this.silabas[item][0];

        this.pedras[0].som='pedra_1_'+this.silabas[item][1]; 
        this.pedras[1].som='pedra_1_'+this.silabas[item][0]; 

        console.log("som silb: "+this.pedras[0].som);
        console.log("som silb: "+this.pedras[1].som);

        this.groupLevel[this.currentLevel].add(this.pedras[0]);
        this.groupLevel[this.currentLevel].add(this.pedras[1]);          

        this.habilitarFuncoes(this.pedras[0]);
        this.habilitarFuncoes(this.pedras[1]);

        // marcas para arrastar as folhas 
        this.holder = new Array();
        position_x_holder = new Array(0,1);
        position_x_holder[0] = new Array(547,296);
        position_x_holder[1] = new Array(718,302);

        for(var i = 0; i <this.corretas; i++ ){
            //var position_x_holder = 500 + ( 220 * i );
            this.holder[i] = this.add.sprite(position_x_holder[i][0],position_x_holder[i][1], 'holder');
            this.groupLevel[this.currentLevel].add(this.holder[i]);
            
            this.holder[i].id = this.iscorrect[i];
            this.holder[i].anchor.set(0.5,0.5);
            this.holder[i].check = false;
            this.holder[i].scale.set(0.5,0.5);

            //this.habilitarFuncoes(this.holder[i]);
        }

    },

    initLevel2: function() {
        console.log("*** initLevel2  ***");

        this.groupLevel[this.currentLevel] = this.add.group();
        this._onStartDrag = false;
        this._onStopDrag = false;

        this.itens = [0,1,2];
        this.corretas = 3;

        
        // silalas para sorteio 
        this.silabas = [0,1,2];
        this.silabas[0] = new Array(6,7,8);//AR - VO - RE 
        this.silabas[1] = new Array(9,10,11);//RI - A - CHO 
        this.silabas[2] = new Array(12,13,14);//FLO - RES - TA

        // posicao das pedas 

        this.posMarca = [0,1,2];
        console.log("Marca: "+this.posMarca);
        this.posMarca.sort(function() {
          return .5 - Math.random();
        });
        console.log("sorte Marca: "+this.posMarca);
        

        this.posicao = [0,1];
        this.posicao[0] = new Array(305,510,670);// posicionamento em x
        this.posicao[1] = new Array(525,545,525);// posicionamento em y
       

        // gera um item unico de acordo com regras do jogo para a lista
        var item = this.getRandomUniqueItem(this.itens);
        //item = 2;

        console.log("item: "+item);
        //sequencia correta
        this.iscorrect = this.silabas[item].slice();
        console.log("seq: "+this.iscorrect);

        this.somPalavra = 'palavra_2_'+item;

        console.log("som: "+this.somPalavra);

        this.silabas[item].sort(function() {
          return .5 - Math.random();
        });
        console.log(this.silabas[item]);

        // desenhando as pedras 
        this.pedras = new Array();

        console.log("silaba: "+this.silabas[item][0]);
        console.log("silaba: "+this.silabas[item][1]);
        console.log("silaba: "+this.silabas[item][2]);


        for(var i = 0; i <this.corretas; i++ ){
            this.pedras[i] = this.add.sprite(this.posicao[0][i],this.posicao[1][i], 'palavras',this.silabas[item][i]);
            this.pedras[i].anchor.set(0.5,0.5);
            this.pedras[i].scale.set(0.6,0.6);
            this.pedras[i].som='pedra_2_'+this.silabas[item][i]; 
            this.pedras[i].id=this.silabas[item][i];

            console.log("som silb: "+this.pedras[i].som);
            this.groupLevel[this.currentLevel].add(this.pedras[i]);
            this.habilitarFuncoes(this.pedras[i]);
        }

        // marcas para arrastar as folhas 
        this.holder = new Array();
        position_x_holder = new Array(0,1);
        position_x_holder[0] = new Array(487,657,842); // posicionamento em x
        position_x_holder[1] = new Array(292,310,322); // posicionamento em y

        for(var i = 0; i <this.corretas; i++ ){
            //var position_x_holder = 500 + ( 220 * i );
            this.holder[i] = this.add.sprite(position_x_holder[0][i],position_x_holder[1][i], 'holder');
            this.groupLevel[this.currentLevel].add(this.holder[i]);
            
            this.holder[i].id = this.iscorrect[i];
            this.holder[i].anchor.set(0.5,0.5);
            this.holder[i].check = false;
            this.holder[i].scale.set(0.5,0.5);

            //this.habilitarFuncoes(this.holder[i]);
        }
       
    },

    initLevel3: function() {
        console.log("*** initLevel3  ***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this._onStartDrag = false;
        this._onStopDrag = false;

        this.itens = [0,1,2];

        // silalas para sorteio 
        this.silabas = [0,1,2];
        this.silabas[0] = new Array(15,16,17,18);//SA - MAN - BAI - A
        this.silabas[1] = new Array(19,20,21,22,23);//EN - SO - LA - RA - DO 
        this.silabas[2] = new Array(24,25,26,27);//EN - TRE - VIS - TA 

        // gera um item unico de acordo com regras do jogo para a lista
        var item = this.getRandomUniqueItem(this.itens);
        console.log("item: "+item);
        item = 2;

        // se for a palavra ensolarado tem 5 sílabas 
        if(item==1){
            this.corretas = 5;
            this.posMarca = [0,1,2,3,4];
        }else{
            this.corretas = 4;
            this.posMarca = [0,1,2,3];
        }

        // posicao das pedas 
        console.log("Marca: "+this.posMarca);
        this.posMarca.sort(function() {
          return .5 - Math.random();
        });
        console.log("sorte Marca: "+this.posMarca);
        
        this.posicao = [0,1];
        this.posicao[0] = new Array(219,398,560,741,902);// posicionamento em x
        this.posicao[1] = new Array(507,531,508,533,539);// posicionamento em y

        //sequencia correta
        this.iscorrect = this.silabas[item].slice();
        console.log("seq: "+this.iscorrect);

        this.somPalavra = 'palavra_3_'+item;

        console.log("som: "+this.somPalavra);

        this.silabas[item].sort(function() {
          return .5 - Math.random();
        });
        console.log(this.silabas[item]);

        // desenhando as pedras 
        this.pedras = new Array();

        console.log("silaba: "+this.silabas[item][0]);
        console.log("silaba: "+this.silabas[item][1]);
        console.log("silaba: "+this.silabas[item][2]);


        for(var i = 0; i <this.corretas; i++ ){
            this.pedras[i] = this.add.sprite(this.posicao[0][i],this.posicao[1][i], 'palavras',this.silabas[item][i]);
            this.pedras[i].anchor.set(0.5,0.5);
            this.pedras[i].scale.set(0.6,0.6);
            this.pedras[i].som='pedra_3_'+this.silabas[item][i]; 
            this.pedras[i].id=this.silabas[item][i];

            console.log("som silb: "+this.pedras[i].som);
            this.groupLevel[this.currentLevel].add(this.pedras[i]);
            this.habilitarFuncoes(this.pedras[i]);
        }

        // marcas para arrastar as folhas 
        this.holder = new Array();
        position_x_holder = new Array(0,1);
    
        if(item==1){
            position_x_holder[0] = new Array(423,523,667,788,902); // posicionamento em x
            position_x_holder[1] = new Array(258,277,294,307,311); // posicionamento em y
        }else{
            position_x_holder[0] = new Array(523,646,788,902); // posicionamento em x
            position_x_holder[1] = new Array(277,294,307,311); // posicionamento em y
        }

        for(var i = 0; i <this.corretas; i++ ){
            //var position_x_holder = 500 + ( 220 * i );
            this.holder[i] = this.add.sprite(position_x_holder[0][i],position_x_holder[1][i], 'holder');
            this.groupLevel[this.currentLevel].add(this.holder[i]);
            
            this.holder[i].id = this.iscorrect[i];
            this.holder[i].anchor.set(0.5,0.5);
            this.holder[i].check = false;
            this.holder[i].scale.set(0.5,0.5);

            //this.habilitarFuncoes(this.holder[i]);
        }
    },

    /**
    *
    * Controle do jogo 
    * 
    **/

    move_tutorial: function(place, tutorial_number){
        this.groupIntro.remove(this.buttonTutorial[tutorial_number]);
        this.groupIntro.add(this.buttonTutorial[tutorial_number]);
        this.groupIntro.remove(this.arrow);
        this.groupIntro.add(this.arrow);
        
        this.createDelayTime( 100, function(){
            this.add.tween(this.arrow).to({x: this.buttonTutorial[tutorial_number].x, y: this.buttonTutorial[tutorial_number].y}, 200, Phaser.Easing.Linear.None, true);
        });
        
        this.createDelayTime( 600, function(){
            
            this.add.tween(this.buttonTutorial[tutorial_number]).to({x: place, y: 360}, 600, Phaser.Easing.Linear.None, true);
            this.add.tween(this.arrow).to({x: place + 30, y: 360}, 600, Phaser.Easing.Linear.None, true);
            
        });
    },

    tween_words: function( elem ){
        this.add.tween(elem).to({x: elem.go_x,y: elem.go_y}, 500,Phaser.Easing.Linear.None, true);          
        this.add.tween(elem.scale).to({x: 0.8,y: 0.8}, 510,Phaser.Easing.Linear.None, true);
    },

    createButton: function( x, y, letterValue, image_value, time, canInteract, tutorial) {
        
        var btn; 
        
        if( tutorial != null ) btn = this.add.button(x,y, "tutorial_"+tutorial, null, this);
        else btn = this.add.button(x,y, "palavras", null, this);
    
        btn.anchor.set(0.5,0.5); 
        btn.scale.set(0.1,0.1);
        btn.unclickable = false;
        btn.originX = x;
        btn.originY = y;
        btn.hitGroup = letterValue;
        btn.clickBtn = 0;

        return btn;
    },

    resetLevel:function(nivel){
        
        console.log("***resetLevel***");
        this.stone_text = null;
        this.createDelayTime(1500, function() {
             this.add.tween(this.groupLevel[nivel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
             
             if(this.groupLevel[nivel] != null) {
                this.groupLevel[nivel].removeAll(true);
             }
        }); 
    },


    habilitarFuncoes:function(spr){
        spr.inputEnabled = true;
        spr.input.enableDrag(false, true);
        spr.input.useHandCursor = true;

        spr.events.onDragStart.add(this.onStartDrag, this);
        spr.events.onDragStop.add(this.onStopDrag, this); 
        spr.events.onInputOver.add(this.onGameButtonOver, this);
        
    },

    checkOverlap:function(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    },

    onStartDrag: function(elem) {
        console.log("*** onStartDrag ***");
        this.initialPos = {x:elem.x, y:elem.y};
        this._onStartDrag = true;
        this._onStopDrag = false;

    },

    onStopDrag: function(elem) {
        console.log("*** onStopDrag ***");
        console.log("x: "+elem.x, " y: "+elem.y);
    
        this._onStopDrag = true;
        this._onStartDrag = false;
        _Overlap = 0; // para mostrar o resultado 
        num_holder = 0;
        // conferindo com todas as marcas
        
        console.log("-------INICIO FOR---------"); 
        for(var itm in this.holder) {
            console.log("elem: "+elem.id+" holder: "+this.holder[itm].id);
            console.log("verificar: "+this.holder[itm].check);
            if(!this.holder[itm].check){ // verificar somente se uma marca não está ocupada 
                if (this.checkOverlap(elem, this.holder[itm])){ // verificando interseção entre as imagens do holder(marca) com a pedra 
                    if(elem.id == this.holder[itm].id){
                         // certo: espera outra pedra, até a palavra completa para ir para o próximo nível 
                        console.log('*** no lugar certo ***');
                        this.holder[itm].check = true; 
                        num_holder = itm;
                        _Overlap = 1;
                    }else{
                        // erro: recomeça o nivel ou volta um 
                        console.log('*** no lugar errado ***'); 
                        _Overlap = 2;
                    }     
                }else{
                    // como não tem interseção do holder com a pedra ela será colocada no lugar de origem 
                    console.log('Drag the sprites. Overlapping: false');
                
                }
            }  
        }

        console.log("---------FIM FOR ----------");
        console.log('Overlapping: '+ _Overlap);
        console.log("RESULTADO");
        switch(_Overlap){
            case 0:// resposiona
                console.log("reposiciona"); 
                this.add.tween(elem).to({x:this.initialPos.x, y: this.initialPos.y}, 700,Phaser.Easing.Linear.None, true); 
                this.sound.play("hitErro");
                this._onStopDrag = false;
            break;
            case 1:// no lugar certo 
                console.log('*** no lugar certo ***');
                this.sound.play('hitAcerto');
                elem.inputEnabled = false;
                elem.input.useHandCursor = false;

                // animação de comemoração

                this.saci.animations.play('comemora');
                this.poly.animations.play('comemora');
                this.animationHit = true;
                this._onStopDrag = false;
                
                if(this.corretas>0){
                    this.corretas--;
                }  



                // colocando no lugar 
                this.add.tween(elem).to({x:this.holder[num_holder].x, y:this.holder[num_holder].y - 30}, 700,Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    if(this.corretas==0){
                        console.log('*** proximo nivel ***');
                        this.clickRightButton();
                    }
                },this);

            break;
            case 2:// no lugar errado
                console.log("reposiciona"); 
                this.add.tween(elem).to({x:this.initialPos.x, y: this.initialPos.y}, 700,Phaser.Easing.Linear.None, true); 
                this.sound.play("hitErro");
                
                this.inputMovable(); // impedir movimentos 
                this.createDelayTime(1500, function() {
                    this.clickWrongButton();
                });  
            break;
        }
        

        console.log("*** fim onStopDrag ***");    
    },

    onGameButtonOver: function(elem) {
        console.log("*** onGameButtonOver ***");
        console.log("-> som: "+elem.som);
        console.log("-> this._onStartDrag: "+this._onStartDrag+" -> this._onStopDrag: "+this._onStopDrag);
        if(!this._onStartDrag && !this._onStopDrag){
            if(this.stone_text == null){       
                this.stone_text = this.sound.play(elem.som); 
                this.stone_text.onStop.addOnce(function(){
                    this.stone_text = null;   
                }, this);
            } 
        }
        
    },

    inputMovable:function(){
        console.log("*** inputMovable ***");
        console.log("-> "+this.pedras.length);
        for(var i=0; i<this.pedras.length;i++){ 
            this.pedras[i].inputEnabled = false;
            this.pedras[i].input.reset();
        }
    },

    update:function(){
        if(this.animationHit){
            if( this.saci != null){
                console.log("--> animations");
                this.saci.events.onAnimationComplete.add(function(){
                    if(this.animationHit){
                        this.saci.play('idle');
                        this.poly.play('idle');
                        this.animationHit = false;
                    }
                }, this);
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
        console.log("*** clickRightButton ***");
        this.onPlayerSuccess();
        this.stone_text = this.sound.play(this.somPalavra);
        this.resetLevel(this.currentLevel);
        this.createDelayTime(2000, function() {
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
        //if(target != null && target.alpha < 1) {
            //return;
        //}
        dica = false;
        this.resetLevel(this.currentLevel);
        
        if(this.currentLocalErrors > 0) {
            
            this.currentLocalErrors--;

            this.sound.play("hitErro");
            this.onErrorChance(target);
            return;
        }
        
        this.onPlayerError();
        //this.sound.play("hitErro");
        //this.clearButtons(false);
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
    /*createAnimationCorrect: function(target) {
        
        console.log(this.correctItem);

        var t = this.add.tween(this.correctItem)
                    .to({x:this.world.centerX-450 + this.verifyCurrentLevel()*200, y: 250}, 1300, Phaser.Easing.Linear.None)
                    .to({y: 290}, 200, Phaser.Easing.Linear.None);
        t.start();
    },*/



};





