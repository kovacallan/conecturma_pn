
/**
* @version    1.0.2
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

        this.input.onTap.add(function() {
            console.log("Posicao do Mouse:", this.input.x, this.input.y);
        }, this);

        this.initGlobal();
            

        this.TEMPO_INTRO = 9000;
        this.ENABLE_CALL_TO_ACTION = true; // enibe o show call to action


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
        this.groupLevel = [null,1,2,3];
        this.resetRandom();
        this.createScene();
        this.showIntro();
        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();

        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);

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

    //O Bumba se enrolou no QU e no GU desses cartazes, e agora teremos que ajudá-lo com isso. [MC] É como nessa frase, onde falta um QU. Temos que arrastar essas letras até o lugarzinho delas e pronto! Nosso cartaz está completo! [/MC] Nossa vez!

    showTextoIntro: function() {

        var t1 = "O Bumba se enrolou no [QU] e no [GU] \ndesses cartazes, e agora teremos \nque ajudá-lo com isso.";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 22, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var kim = this.showKim(this.TEMPO_INTRO);

        
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true)


        this.createDelayTime(this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.showLiveTutorial();
            }, this);
        });
        //this.createDelayTime(this.TEMPO_INTRO, function() {
            //this.add.tween(tutorialText1).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
        //});
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

        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
    },

    /**
    *
    * Esconde o texto da pergunta quando tiver e esconde a placa que mostra o texto.
    * Ao final do efeito executa a função {callback} se houver
    * 
    **/
    hideLevel: function(callback) {
        if(this.imageQuestion == null) {
            return;
        }

        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        if(callback != null) {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
        } else {
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
                if(this.showCallToAction){
                    this.showNextLevel();
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
    * Remove ações do botão e direciona para o proximo level se {gotoNext} for verdadeiro
    * 
    **/
    showCorrectName: function(gotoNext) {
        if(gotoNext) {
            this.createDelayTime(500, this.gotoNextLevel);
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


    createScene: function() {//finished

        this.add.sprite(-737, -1723, 'background');
        
        this.bumba = this.add.sprite(735,212, 'bumba',1);
        this.bumba.animations.add('bumba');
        this.bumba.animations.play('bumba', 15, true);

        //this.initGame();
        //this.showResumo();

        //var x1 = BasicGame.Game.Cenario.addSpriteMeu('bumba',300,100);
        
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("showLiveTutorial");

        var t1 = " É como nessa frase, onde falta um [QU]. \nTemos que arrastar essas letras até \no lugarzinho delas e pronto! \nNosso cartaz está completo!Nossa vez!";
        this.tutorialText = this.drawText(this.world.centerX, 50, t1, 22, "left");
        this.tutorialText.alpha = 0;
        this.groupIntro.add(this.tutorialText);

        this.add.tween(this.tutorialText).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);

        this.cartaz = this.add.sprite(293,177, 'cartaz',0);
        this.cartaz.alpha=0;
        this.groupIntro.add(this.cartaz);

        this.add.tween(this.cartaz).to({alpha:1},1000, Phaser.Easing.Linear.None, true);

        this.imagem = [];

        this.posicao = new Array([399,503],[503,503])
        
        this.imagem[0] = this.add.sprite(this.posicao[0][0],this.posicao[0][1], 'letras',0);
        this.imagem[0].name = "qu";
        this.imagem[0].pos = 0;
        this.imagem[0].alpha = 0;

        this.imagem[1] = this.add.sprite(this.posicao[1][0],this.posicao[1][1], 'letras',1);
        this.imagem[1].name = "gu";
        this.imagem[1].pos = 1;
        this.imagem[1].alpha = 0;

        this.groupIntro.add(this.imagem[0]);
        this.groupIntro.add(this.imagem[1]);

        this.arrow = this.add.sprite(510,390, 'arrow');
        this.arrow.alpha =1;

        this.click = this.add.sprite(0, 0, "clickAnimation");
        this.click.animations.add('idle', null, 18, true);
        this.click.alpha = 0;

        this.groupIntro.add(this.arrow);
        this.groupIntro.add(this.click);

        this.add.tween(this.imagem[0]).to({alpha:1},1000, Phaser.Easing.Linear.None, true);
        this.add.tween(this.imagem[1]).to({alpha:1},1000, Phaser.Easing.Linear.None, true);
        
        
        this.createDelayTime(6000, function() {
            x = this.imagem[0].x+35;
            y = this.imagem[0].y+5;
            this.add.tween(this.arrow).to({x:x,y:y}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.animClick();         
            },this);
        
        });

        this.createDelayTime(8000, function() {
            x = 433+35;
            y = 258+5;
            x1 = 433-20;
            y1 = 258-20;

            this.add.tween(this.arrow).to({x:x,y:y}, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(this.imagem[0]).to({x:x1,y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.imagem[0].scale).to({x:0.6,y:0.6},500, Phaser.Easing.Linear.None, true);
                this.changeHappy(this.bumba,"bumba_happy","bumba",735,212);          
            },this);
        
        });

        this.createDelayTime(10000, function() { 
            this.showFinishedLiveTutorial();
        });
    },

   

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showFinishedLiveTutorial:function() {
        this.createDelayTime(1000, function() {
           this.FinishedLiveTutorial(); 
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

        var textList = [ 
            "As letras [Q] e [G] acompanhadas do [U] podem ou \nnão deixar que o [U] seja dito em alto e bom som,\nmas ele está sempre nas palavras desse jogo, \nnem que seja pra mudar o som do [G] e do [Q]. \nVamos tentar outra vez?"
        ];

        var tutorialText = this.drawText(500, 40, textList[0], 22, "left");
        tutorialText.alpha = 0;
       
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

    

    // level - mostrar proximo
    showNextLevel: function() {

        //1-verifica level de 1 a maximo
        // para cada level tocar som intro do level e carregar level
        switch(this.currentLevel) {
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
                    this.sound.play("soundP2").onStop.addOnce(this.initLevel2, this);
                }
            break;
            case 3:
                this.showQuestion(3);
                if(this.showCallToAction) {
                this.initLevel3();
                } else {
                    this.sound.play("soundP3").onStop.addOnce(this.initLevel3, this);
                }
            break;
        }
        this.showCallToAction = false;
    },

    showQuestion: function(num) {

        var q = [ null,
            "Escutem a palavra que está com \num pedacinho faltando e cliquem no GU ou QU!",
            "Olhem só! Duas palavras! Vamos lá!",
            "Agora são três palavras! Não dá pra \nescutar o U sendo pronunciado, detalhe! \nMas vamos lá!"
        ];


        this.imageQuestion = this.drawText(this.world.centerX, 50, q[num]);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },


    initLevel1: function() {

        console.log("initLevel1");

        //this.initLevel3();
        
        this.groupLevel[this.currentLevel] = this.add.group();
        this.acertos = 1;
        this.itens = ["0", "2", "4"];

        this.temp_array = this.itens.slice();
        item = this.sorteio();
        this.itens = this.temp_array.slice();

        this.newFrame = 0;
        //item  = 0;
        //item  = 2;
        //item  = 4;
        this.marca = [];
        this.marcaOcupada = [];

        switch(item){
            case 0://__ando acharemos nossos amigos?
                this.newFrame = 1;
                this.marca[0] = this.add.sprite(433,258, 'marca');
                this.marca[0].name = "qu";
                this.marca[0].audio = "quando"; 
                this.marcaOcupada[0] = false;
            break;
            case 2://Estamos __ase lá!
                this.newFrame = 3;
                this.marca[0] = this.add.sprite(422,336, 'marca');
                this.marca[0].name = "qu";
                this.marca[0].a = "qu";
                this.marca[0].audio ="quase"; 
                this.marcaOcupada[0] = false;
            break;
            case 4://Preciso de á__a.
                this.newFrame = 5;
                this.marca[0] = this.add.sprite(485,336, 'marca');
                this.marca[0].name = "gu";
                this.marca[0].audio ="agua";
                this.marcaOcupada[0] = false;
            break;
        }

        this.marca[0].alpha = 0;

        this.cartaz = this.add.sprite(293,177, 'cartaz',item);
        this.groupLevel[this.currentLevel].add(this.cartaz);

        //var x1 = BasicGame.Game.Cenario.addSpriteMeu('marca',300,100);
        
        this.imagem = [];

        this.posicao = new Array([399,503],[503,503])
        
        this.imagem[0] = this.add.sprite(this.posicao[0][0],this.posicao[0][1], 'letras',0);
        this.imagem[0].name = "qu";
        this.imagem[0].pos = 0;

        this.imagem[1] = this.add.sprite(this.posicao[1][0],this.posicao[1][1], 'letras',1);
        this.imagem[1].name = "gu";
        this.imagem[1].pos = 1;


        this.groupLevel[this.currentLevel].add(this.imagem[0]);
        this.groupLevel[this.currentLevel].add(this.imagem[1]);

        this.groupLevel[this.currentLevel].add(this.marca[0]);
        
        this.createDelayTime(500, function() {
            this.inputMovable(0,this.imagem, null);
        });
    },
    initLevel2: function() {
        console.log("initLevel2");  

        this.groupLevel[this.currentLevel] = this.add.group();
        this.acertos = 2;
        this.itens = ["6", "8", "10"];

        this.temp_array = this.itens.slice();
        item = this.sorteio();
        this.itens = this.temp_array.slice();

        this.newFrame = 0;
        //item  = 6;
        //item  = 8;
        //item  = 10;
        this.marca = [];
        this.marcaOcupada = [];

        switch(item){
            case 6:///Será __e é a__i?

                this.newFrame = 7;
                this.marca[0] = this.add.sprite(513,281, 'marca');
                this.marca[0].name = "qu";
                this.marca[0].audio = "que"; 

                this.marca[1] = this.add.sprite(487,335, 'marca');
                this.marca[1].name = "qu";
                this.marca[1].audio = "aqui"; 
                
                this.marcaOcupada[0] = false;
                this.marcaOcupada[1] = false;
            break;
            case 8://Pra conse__ir é só __erer!
                this.newFrame = 9;
                this.marca[0] = this.add.sprite(573,282, 'marca');
                this.marca[0].name = "gu";
                this.marca[0].audio = "conseguir"; 

                this.marca[1] = this.add.sprite(477,335, 'marca');
                this.marca[1].name = "qu";
                this.marca[1].audio = "querer"; 

                this.marcaOcupada[0] = false;
                this.marcaOcupada[1] = false;
            break;
            case 10://Por __e a__i?
                this.newFrame = 11;
                this.marca[0] = this.add.sprite(450,306, 'marca');
                this.marca[0].name = "qu";
                this.marca[0].audio = "porque"; 

                this.marca[1] = this.add.sprite(562,306, 'marca');
                this.marca[1].name = "qu";
                this.marca[1].audio = "aqui"; 

                this.marcaOcupada[0] = false;
                this.marcaOcupada[1] = false;
            break;
        }
        this.marca[0].alpha = 0;
        this.marca[1].alpha = 0;

        this.cartaz = this.add.sprite(293,177, 'cartaz',item);
        this.groupLevel[this.currentLevel].add(this.cartaz);

        //var x1 = BasicGame.Game.Cenario.addSpriteMeu('marca',300,100);
        this.imagem = [];

        this.posicao = new Array([338,503],[451,503],[567,503])
        
        this.imagem[0] = this.add.sprite(this.posicao[0][0],this.posicao[0][1], 'letras',0);
        this.imagem[0].name = "qu";
        this.imagem[0].pos = 0;

        this.imagem[1] = this.add.sprite(this.posicao[1][0],this.posicao[1][1], 'letras',1);
        this.imagem[1].name = "gu";
        this.imagem[1].pos = 1;

        this.imagem[2] = this.add.sprite(this.posicao[2][0],this.posicao[2][1], 'letras',0);
        this.imagem[2].name = "qu";
        this.imagem[2].pos = 2;


        this.groupLevel[this.currentLevel].add(this.imagem[0]);
        this.groupLevel[this.currentLevel].add(this.imagem[1]);
        this.groupLevel[this.currentLevel].add(this.imagem[2]);

        this.groupLevel[this.currentLevel].add(this.marca[0]);
        this.groupLevel[this.currentLevel].add(this.marca[1]);
        
        this.createDelayTime(500, function() {
            this.inputMovable(0,this.imagem, null);
        });  
    },

    initLevel3: function() {
        console.log("initLevel3");

        this.groupLevel[this.currentLevel] = this.add.group();
        this.acertos = 3;
        this.itens = ["12", "14", "16"];

        this.temp_array = this.itens.slice();
        item = this.sorteio();
        this.itens = this.temp_array.slice();

        //this.newFrame = 0;
        //item  = 12;
        //item  = 14;
        //item  = 16;
        this.marca = [];
        this.marcaOcupada = [];

        switch(item){
            case 12://O __e acha de fazermos uma fo__eira a__i?
                this.newFrame = 13;
                this.marca[0] = this.add.sprite(412,257, 'marca');
                this.marca[0].name = "qu";
                this.marca[0].audio = "que"; 

                this.marca[1] = this.add.sprite(404,361, 'marca');
                this.marca[1].name = "gu";
                this.marca[1].audio = "fogueira"; 

                this.marca[2] = this.add.sprite(578,360, 'marca');
                this.marca[2].name = "qu";
                this.marca[2].audio = "aqui"; 

                this.marcaOcupada[0] = false;
                this.marcaOcupada[1] = false;
                this.marcaOcupada[2] = false;

            break;
            case 14://Por __e não conse__imos achar nossos __eridos amigos?
                this.newFrame = 15;
                this.marca[0] = this.add.sprite(469,203, 'marca');
                this.marca[0].name = "qu";
                this.marca[0].audio = "porque"; 

                this.marca[1] = this.add.sprite(499,256, 'marca');
                this.marca[1].name = "gu";
                this.marca[1].audio = "conseguimos"; 

                this.marca[2] = this.add.sprite(419,362, 'marca');
                this.marca[2].name = "qu";
                this.marca[2].audio = "queridos"; 

                this.marcaOcupada[0] = false;
                this.marcaOcupada[1] = false;
                this.marcaOcupada[2] = false;
            break;
            case 16://__em mais __er nos ajudar a conse__ir encontrar nossos amigos?

                this.newFrame = 17;
                this.marca[0] = this.add.sprite(353,230, 'marca');
                this.marca[0].name = "qu";
                this.marca[0].audio = "quem"; 

                this.marca[1] = this.add.sprite(572,230, 'marca');
                this.marca[1].name = "qu";
                this.marca[1].audio = "quer"; 

                this.marca[2] = this.add.sprite(550,331, 'marca');
                this.marca[2].name = "gu";
                this.marca[2].audio = "conseguir"; 

                this.marcaOcupada[0] = false;
                this.marcaOcupada[1] = false;
                this.marcaOcupada[2] = false;
            break;
        }

        this.marca[0].alpha = 0;
        this.marca[1].alpha = 0;
        this.marca[2].alpha = 0;

        this.cartaz = this.add.sprite(293,177, 'cartaz',item);
        this.groupLevel[this.currentLevel].add(this.cartaz);

        //var x1 = BasicGame.Game.Cenario.addSpriteMeu('marca',300,100);
        this.imagem = [];

        this.posicao = new Array([300,503],[402,503],[502,503],[598,503])
        
        this.imagem[0] = this.add.sprite(this.posicao[0][0],this.posicao[0][1], 'letras',0);
        this.imagem[0].name = "qu";
        this.imagem[0].pos = 0;

        this.imagem[1] = this.add.sprite(this.posicao[1][0],this.posicao[1][1], 'letras',1);
        this.imagem[1].name = "gu";
        this.imagem[1].pos = 1;

        this.imagem[2] = this.add.sprite(this.posicao[2][0],this.posicao[2][1], 'letras',0);
        this.imagem[2].name = "qu";
        this.imagem[2].pos = 2;

        this.imagem[3] = this.add.sprite(this.posicao[3][0],this.posicao[3][1], 'letras',1);
        this.imagem[3].name = "gu";
        this.imagem[3].pos = 3;


        this.groupLevel[this.currentLevel].add(this.imagem[0]);
        this.groupLevel[this.currentLevel].add(this.imagem[1]);
        this.groupLevel[this.currentLevel].add(this.imagem[2]);
        this.groupLevel[this.currentLevel].add(this.imagem[3]);

        this.groupLevel[this.currentLevel].add(this.marca[0]);
        this.groupLevel[this.currentLevel].add(this.marca[1]);
        this.groupLevel[this.currentLevel].add(this.marca[2]);
        
        
        this.createDelayTime(500, function() {
            this.inputMovable(0,this.imagem, null);
        });  
    },

    //criacao de botao de resposta - manter estrutura
    createButton: function( x, y, imagem, right, time, canInteract) {

        var _canInteract = (canInteract==null||canInteract==undefined) ? true : false;
        
        var btn;
        if(right) {

            btn = this.add.button(x,y, 'letras', (_canInteract)?this.clickRightButton:null, this, imagem,imagem,imagem);
            btn.isCorrect = true;
            this.correctItem = btn;

        } else {
            btn = this.add.button(x,y, 'letras', (_canInteract)?this.clickWrongButton:null, this, imagem,imagem,imagem);

        }


        btn.anchor.set(0.5,1);
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
    
    /**
    *
    * Funcao para ser chamada quando o usuario clica em uma opção ERRADA, 
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
        //if(target != null && target.alpha < 1) {
            ///return;
        //}
        this.showCallToAction = true;
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
                this.hideLevel(function() {
                    this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
                });
            break;
            case 0: // toca som de resumo
                this.lives = 0;
                this.hideLevel();
                this.showResumo();
            break;
        }
        this.updateLivesText();
    },

    //____________________________AV1AV2UD7OA04__________________________________________________

    resetLevel:function(nivel){
        
        console.log("***resetLevel***");
        
        this.createDelayTime(500, function() {
             this.add.tween(this.groupLevel[nivel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
             
             if(this.groupLevel[nivel] != null) {
                this.groupLevel[nivel].removeAll(true);
             }
        }); 
    },

    changeHappy:function(elem, anim,anim2,x,y){
        elem.loadTexture(anim, 0);
        elem.x = x;
        elem.y = y;
        var anim  = elem.animations.add(anim);
        
        anim.onComplete.add(function() {
            this.changeIdlle(elem,anim2,x,y);
        }, this);
        anim.play(15);
    },

    changeIdlle:function(elem,anim,x,y){
        elem.loadTexture(anim, 0);
        elem.x = x;
        elem.y = y;
        elem.animations.add(anim);
        elem.animations.play(anim, 15, true);
    },

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

    shuffle:function(array,tam) {
        var currentIndex = tam, temporaryValue, randomIndex ;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },

    inputMovable:function(modo, array_elem, elem){
        switch(modo){
            case 0: // habilitar todos os elementos 
                for(var i=0; i<array_elem.length;i++){ 
                    array_elem[i].inputEnabled = true;
                    array_elem[i].input.enableDrag(false, true);
                    array_elem[i].events.onDragStart.add(this.onStartDragElem, this);
                    array_elem[i].events.onDragStop.add(this.onStopDragElem, this);
                }
            break;// habilitar um elemento
            case 1:       
                elem.inputEnabled = true;
                elem.input.enableDrag(false, true);
                elem.events.onDragStart.add(this.onStartDragElem, this);
                elem.events.onDragStop.add(this.onStopDragElem, this);     
            break;
            case 2: // bloquear todos os elemento 
            
                for(var i=0; i<array_elem.length;i++){ 
                    array_elem[i].inputEnabled = false;
                    array_elem[i].input.reset();
                }
            break;
            case 3: // bloquear um elemento
                elem.inputEnabled = false;
                elem.input.reset();
            break;
        }
    },

    onStartDragElem: function(elem) {
        console.log("*** onStartDragNumber ***");
        this.add.tween(elem.scale).to({x:0.5,y:0.5},100, Phaser.Easing.Linear.None, true);
		this.idlex = elem.x;
        this.idley = elem.y;

    },

    verificacao:function(elem){
        console.log("-- verificacao --");
        for(i=0; i<this.marca.length;i++){

            if(!this.marcaOcupada[i]){
                this.colider = this.enableOverLap(elem,this.marca[i]);
                console.log(i+" - "+ this.colider);
                console.log("elem "+ elem.name);
                console.log("marca "+ this.marca[i].name);
                if(this.colider){
                    console.log("colider "+ this.marca[i].name);
                    if(elem.name == this.marca[i].name){
                        this.marcaOcupada[i] = true;
                        this.som =this.marca[i].audio;
                        this.marcaPos = i;
                        return 0;
                    }else{
                        return 1;
                    }
                }
            }
        }

        return 2;
    },

    onStopDragElem: function(elem){
        console.log("*** onStopDragNumber ***");
        this.colider = false;
        this.certo = 2;
        this.som = null;
        this.marcaPos = null;
        this.reposiciona = false;

        console.log(this.marcaOcupada); 
        this.certo = this.verificacao(elem);

        switch(this.certo){
            case 0:
                console.log("certo");
                this.inputMovable(3, null,elem);
                x1 = this.marca[this.marcaPos].x-10;
                y1 = this.marca[this.marcaPos].y-20;
                this.changeHappy(this.bumba,"bumba_happy","bumba",735,212);          
                this.add.tween(elem).to({x:x1,y:y1},500, Phaser.Easing.Linear.None, true);
                //this.add.tween(elem.scale).to({x:0.5,y:0.5},500, Phaser.Easing.Linear.None, true);
                console.log(this.som);
                this.sound.play(this.som);


                console.log(this.marcaOcupada); 

                if(this.acertos>0){ // se ainda tem espaços em branco na frase
                     this.acertos--;
                }
                if(this.acertos==0){ // frese está completa 
                    this.inputMovable(2,this.imagem,null);
                    this.createDelayTime(1000, function() {
                        for(i=0; i<this.imagem.length;i++){
                            this.imagem[i].alpha = 0;
                        }
                    }); 
                    this.createDelayTime(1500, function() {
                        this.cartaz.frame = this.newFrame;
                    });  
                    this.createDelayTime(2000, function() {
                       this.clickRightButton();
                    });
                } 
                this.sound.play("hitAcerto");
            break;
            case 1:
                console.log("errado");
                this.inputMovable(2,this.imagem,null);
                this.sound.play("hitErro");
                this.add.tween(elem.scale).to({x:1,y:1},100, Phaser.Easing.Linear.None, true);
                this.add.tween(elem).to({x:this.posicao[elem.pos][0],y:this.posicao[elem.pos][1]},500, Phaser.Easing.Linear.None, true);

                this.createDelayTime(1000, function() {
                  this.resetLevel(this.currentLevel);
                });
                this.createDelayTime(1500, function() {
                   this.clickWrongButton();
                }); 
            break;
            case 2:
                console.log("reposiciona");
                
				if((this.idlex!=elem.x)||(this.idley!=elem.y)){
                   this.sound.play("hitErro"); 
                   console.log("som");
                }else{
                    console.log("!!!");
                }

                this.add.tween(elem.scale).to({x:1,y:1},100, Phaser.Easing.Linear.None, true);
                this.add.tween(elem).to({x:this.posicao[elem.pos][0],y:this.posicao[elem.pos][1]},500, Phaser.Easing.Linear.None, true);
            break;
        }
    },

    enableOverLap:function(elem,elem1){
        console.log("*** enableOverLap ***");
        this.game.physics.enable(elem, Phaser.Physics.ARCADE);
        this.game.physics.enable(elem1, Phaser.Physics.ARCADE);
        resultado = false;
        if(this.game.physics.arcade.overlap(elem,elem1)){
            resultado = true;
        }
        return resultado;
    },

    FinishedLiveTutorial:function(){
        this.time.events.removeAll();
        this.tweens.removeAll();

        if(this.soundIntro != null) {
            this.soundIntro.stop();
        }

        if(this.tutorialPlacar) {
            this.add.tween(this.tutorialPlacar).to({y: -300}, 400, Phaser.Easing.Linear.None, true, 200);
        }

        this.add.tween(this.groupIntro).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
    },

    animClick:function(prox,img){
        this.click.x = this.arrow.x;
        this.click.y = this.arrow.y;
        this.click.alpha = 1;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;
            this.arrow.alpha = 0;
        }, this);
    },
    render:function(){
        
    },
    update:function(){
        //this.updateTimer();
    }

};