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
        this.ENABLE_CALL_TO_ACTION = true;


        // quantidade de perguntas que tem em cada nivel
        this.totalLevel1 = 2;
        this.totalLevel2 = 2;
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

        this.jogo_click = true;

        this.initVars();
        this.textGame();
        this.resetRandomLetter();
        this.createScene();
        this.showIntro();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();


    },

    textGame:function(){

        this.texto = new Array();
        this.texto['initialText'] = "Esta aventura está um show, \nou talkshow! Nesse desafio, \ntemos que ajudar nossos amigos \na chegar do outro lado do lago, \nao pé da Árvore da vida.";
        this.texto['initialText2'] ="Para dificultar, alguns números estão \nfaltando. Precisamos descobrir \nquais os números que estão faltando \npara nossos amigos poderem chegar \ndo outro lado.";
        this.texto['imgResumo'] ="";
         
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = new Array();
        this.questionList[0] = null;
        this.questionList[1] = "Cliquem nos números que estão faltando \n na trilha, entre os números [1] e [10].";
        this.questionList[2] ="Cliquem nos números que estão faltando \n entre os números [10] e [20].";
        this.questionList[3] ="Cliquem nos números que estão faltando \n entre os números [20] e [30].";
        this.questionList[4] ="Esse é um grande desafio! Cliquem \nnos números que estão faltando \nentre os números [30] e [40].";
        this.questionList[5] ="Quase lá! Cliquem nos números que \n estão faltando entre os números [40] e [50].";
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
        console.log("**** 2 showIntro ****");
        this.groupIntro = this.add.group();
        

        this.tutorial = true;

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

        console.log("**** 3 showTextoIntro ****");

        var tutorialText = this.drawText(this.world.centerX+60, 50, this.texto['initialText'], 22, "left");
        tutorialText.alpha = 0;
    
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.groupIntro.add(tutorialText);

        this.showKim(15000);

        var tutorialText2 = this.drawText(this.world.centerX, 40, this.texto['initialText2'], 22, "left");
        tutorialText2.alpha = 0;
    
        this.groupIntro.add(tutorialText2);
        this.soundIntro = this.sound.play("soundIntro");

        //this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
 

        this.createDelayTime(15000, function() {
            //this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true)
            .onComplete.add(function(){
                this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    if(this.tutorial){this.showLiveTutorial()}
                }, this);
            }, this);
        });
    },

    /**
    *
    * Função para iniciar o jogo em si. Chamada após a introdução ou ao clicar no botão de skip.
    * Ela esconde o placar, remove o grupo da introdução e mostra o primeiro level do jogador
    * 
    **/
    initGame: function() {

        console.log("*** 6 initGame ***");

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

        this.hideLevel(function() {

            if(this.currentLevel <= 3 && this.corrects <= 2) {

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

        console.log("*** 1 createScene***");

        var background = this.add.sprite(-72,-61, 'background');
        background.scale.set(0.8,0.8);
        //this.createAnimation(70,115, 'iara', 1,1);

        this.iara = this.add.sprite( 70, 115, 'iara',1);
        this.iara.animations.add('iara');
        this.iara.animations.play('iara', 15, true);

        this.quadro = this.add.sprite(214,436, 'quadro');
        this.quadro.scale.set(0.8,0.8);
        this.quadro.alpha =0;
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {

        console.log("**** 4 showLiveTutorial ****");

        this.testeTutorial=true;
        //this.add.tween(this.quadro).to({alpha:1}, 1500, Phaser.Easing.Linear.None, true);

        this.numeroInicial=0;
        this.totalNumerosLevel = 10; // total de numeros a serem mostrados no jogo 

        this.rodada = 1; // rodadas dentro do subnivel 
        this.totalRodadas = 3; // numero total de rodadas 
        this.tolerancia  = 1; // numero de erros possiveis dentro do nivel
        //this.arrayNumeros = [1,2,3,4,5,6,7,8,9,10]; // numeros para seres sorteados 

        this.numerosVazios[1]= 4;
        this.numerosVazios[2]= 6;
        this.numerosVazios[3]= 9;

        this.nivelsubNivel = -1;
        this.subNivel = 1;

        posicao = new Array([190,287],[239,328],[317,370],[405,358],[423,296],[494,252],[589,267],[675,291],[743,256],[782,201])
        posicaoBrilho = new Array([158,269],[205,312],[284,352],[372,342],[390,283],[465,241],[551,253],[636,274],[711,243],[749,188])
        this.showImagens();

        console.log("-->RODADA "+ this.rodada);
                //this.initRodada();
        this.showBotoes();
        //efeitoIntro
        this.createDelayTime(1500, function() {
            this.arrow = this.add.sprite( 570,420, 'arrow');
            this.click = this.add.sprite(0, 0, "clickAnimation");
            this.click.animations.add('idle', null, 18, true);
            this.click.alpha = 0;

            this.groupIntro.add(this.arrow);
            this.groupIntro.add(this.click);


            this.efeitoIntro(1);
            
        });
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showFinishedLiveTutorial:function() {
        console.log("**** 5 showFinishedLiveTutorial***");
        /*console.log("**** 5 showFinishedLiveTutorial***");
        this.limparSubnivel();
        this.createDelayTime(2000, function() {
            if(this.tutorial){this.initGame();}    
        });*/


        this.createDelayTime(1000, function() {
            this.add.tween(this.groupIntro).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            //this.add.tween(this.groupLevel[this.currentLevel]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
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
        console.log("*** showResumo ***");
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
        var tutorialText = this.add.sprite( this.world.centerX, 110, 'imgResumo');
        tutorialText.alpha = 0;
        tutorialText.scale.set(0.9, 0.9);
        tutorialText.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText);
        
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        
        this.soundResumo = this.sound.play("soundResumo");
        
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
        console.log("**** 8 showNextLevel ****");
        var levelNum = this.verifyCurrentLevel();

        console.log("init level", levelNum, this.currentLevel);

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
            case 4:

                this.showQuestion(4);
                if(this.showCallToAction) {
                this.initLevel4();
                } else {
                    this.sound.play("soundP4").onStop.addOnce(this.initLevel4, this);
                }
            break;
            case 5:

                this.showQuestion(5);
                if(this.showCallToAction) {
                this.initLevel5();
                } else {
                    this.sound.play("soundP5").onStop.addOnce(this.initLevel5, this);
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

        console.log("*** 7 showQuestion ***");

        this.imageQuestion = this.drawText(this.world.centerX, 30, this.questionList[num]);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    initLevel1: function() {

        console.log("**** initLevel1 ****");
        console.log("currentLevel "+ this.currentLevel);
        this.groupLevel[this.currentLevel] = this.add.group();
        this.jogo_click = true;

        this.jogo_acertos = 0;// total de subniveis no jogo
        this.numeroInicial=0;
        this.totalNumerosLevel = 10; // total de numeros a serem mostrados no jogo 
        this.rodada = 1; // rodadas dentro do subnivel 
        this.totalRodadas = 2; // numero total de rodadas 
        this.tolerancia  = 1; // numero de erros possiveis dentro do nivel
        this.arrayNumeros = [1,2,3,4,5,6,7,8,9,10]; // numeros para seres sorteados 
         


        this.temp_array = this.arrayNumeros.slice();
        num  = this.sorteio();
        this.arrayNumeros = this.temp_array.slice();

        this.temp_array = this.arrayNumeros.slice();
        num1  = this.sorteio();
        this.arrayNumeros = this.temp_array.slice();

        if(num<num1){
            this.numerosVazios[1]= num;
            this.numerosVazios[2]= num1;
        }else{
            this.numerosVazios[1]= num1;
            this.numerosVazios[2]= num;
        }

       
        console.log("-->ARRAY "+this.numerosVazios);

        posicao = new Array([190,287],[239,328],[317,370],[405,358],[423,296],[494,252],[589,267],[675,291],[743,256],[782,201])
        posicaoBrilho = new Array([158,269],[205,312],[284,352],[372,342],[390,283],[465,241],[551,253],[636,274],[711,243],[749,188])

        this.createLevel();

        this.createDelayTime(1000, function() {
            this.createButtons();
            
        });

        this.createDelayTime(2500, function() {
            this.initRodada();
            
        });
    },

    

    initLevel2: function() {

        console.log("**** initLevel2 ****");
        console.log("currentLevel "+ this.currentLevel);
        this.groupLevel[this.currentLevel] = this.add.group();
        this.jogo_click = true;
        this.jogo_acertos = 0;// total de subniveis no jogo

        this.numeroInicial=9;
        this.totalNumerosLevel = 20; // total de numeros a serem mostrados no jogo 
        this.rodada = 1; // rodadas dentro do subnivel 
        this.totalRodasdas = 2; // numero total de rodadas 
        this.tolerancia  = 1; // numero de erros possiveis dentro do nivel
        this.arrayNumeros = [10,11,12,13,14,15,16,17,18,19,20]; // numeros para seres sorteados 

        this.temp_array = this.arrayNumeros.slice();
        num  = this.sorteio();
        this.arrayNumeros = this.temp_array.slice();

        this.temp_array = this.arrayNumeros.slice();
        num1  = this.sorteio();
        this.arrayNumeros = this.temp_array.slice();

        if(num<num1){
            this.numerosVazios[1]= num;
            this.numerosVazios[2]= num1;
        }else{
            this.numerosVazios[1]= num1;
            this.numerosVazios[2]= num;
        }
        
        posicao = new Array([536,216],[459,247],[372,263],[289,274],[244,318],[330,331],[425,326],[508,346],[588,373],[654,336],[720,303])
        posicaoBrilho = new Array([505,195],[427,223],[344,237],[257,250],[210,297],[301,307],[384,312],[471,334],[554,347],[618,317],[690,282])

        this.createLevel();

        this.createDelayTime(1000, function() {
            this.createButtons();
            
        });

        this.createDelayTime(2500, function() {
            this.initRodada();
            
        });
        
    },

    initLevel3: function() {

        console.log("**** initLevel3 ****");
        console.log("currentLevel "+ this.currentLevel);
        this.groupLevel[this.currentLevel] = this.add.group();
        this.jogo_click = true;
        this.jogo_acertos = 0;// total de subniveis no jogo
        //______________________________________________________
        
        this.numeroInicial=19;
        this.totalNumerosLevel = 30; // total de numeros a serem mostrados no jogo 
        this.rodada = 1; // rodadas dentro do subnivel 
        this.totalRodadas = 3; // numero total de rodadas 
        this.tolerancia  = 1; // numero de erros possiveis dentro do nivel
        this.arrayNumeros = [20,21,22,23,24,25,26,27,28,29,30]; // numeros para seres sorteados 

        this.temp_array = this.arrayNumeros.slice();
        num  = this.sorteio();
        this.arrayNumeros = this.temp_array.slice();

        this.temp_array = this.arrayNumeros.slice();
        num1  = this.sorteio();
        this.arrayNumeros = this.temp_array.slice();

        this.temp_array = this.arrayNumeros.slice();
        num2  = this.sorteio();
        this.arrayNumeros = this.temp_array.slice();

        array_temp = [];
        array_temp.push(num);
        array_temp.push(num1);
        array_temp.push(num2);

        array_temp.sort(this.crescente);

        //console.log("-->ARRAY TEMP "+array_temp);
        for(var i=0;i<array_temp.length;i++)
        {
            this.numerosVazios[i+1] = array_temp[i];
        }

        posicao = new Array([190,287],[239,328],[317,370],[405,358],[423,296],[494,252],[589,267],[675,291],[743,256],[782,201],[862,201])
        posicaoBrilho = new Array([158,269],[205,312],[284,352],[372,342],[390,283],[465,241],[551,253],[636,274],[711,243],[749,188],[834,177])
                    

        //______________________________________________________
        this.createLevel();

        this.createDelayTime(1000, function() {
            this.createButtons();
            
        });

        this.createDelayTime(2500, function() {
            this.initRodada();
            
        });

    },


    initLevel4: function() {
        console.log("**** initLevel3 ****");
        console.log("currentLevel "+ this.currentLevel);
        this.groupLevel[this.currentLevel] = this.add.group();
        this.jogo_click = true;
        this.jogo_acertos = 0;// total de subniveis no jogo
        //______________________________________________________

        this.numeroInicial=29;
        this.totalNumerosLevel = 40; // total de numeros a serem mostrados no jogo 
        this.rodada = 1; // rodadas dentro do subnivel 
        this.totalRodadas = 3; // numero total de rodadas 
        this.tolerancia  = 1; // numero de erros possiveis dentro do nivel
        this.arrayNumeros = [30,31,32,33,34,35,36,37,38,39,40]; // numeros para seres sorteados 

        this.temp_array = this.arrayNumeros.slice();
        num  = this.sorteio();
        this.arrayNumeros = this.temp_array.slice();

        this.temp_array = this.arrayNumeros.slice();
        num1  = this.sorteio();
        this.arrayNumeros = this.temp_array.slice();

        this.temp_array = this.arrayNumeros.slice();
        num2  = this.sorteio();
        this.arrayNumeros = this.temp_array.slice();

        array_temp = [];
        array_temp.push(num);
        array_temp.push(num1);
        array_temp.push(num2);

        array_temp.sort(this.crescente);

        //console.log("-->ARRAY TEMP "+array_temp);
        for(var i=0;i<array_temp.length;i++)
        {
            this.numerosVazios[i+1] = array_temp[i];
        }
        posicao = new Array([536,216],[459,247],[372,263],[289,274],[244,318],[330,331],[425,326],[508,346],[588,373],[654,336],[720,303])
        posicaoBrilho = new Array([505,195],[427,223],[344,237],[257,250],[210,297],[301,307],[384,312],[471,334],[554,347],[618,317],[690,282])
        
        //______________________________________________________
        this.createLevel();

        this.createDelayTime(1000, function() {
            this.createButtons();
            
        });

        this.createDelayTime(2500, function() {
            this.initRodada();
            
        });

    },


    initLevel5: function() {
        console.log("**** initLevel3 ****");
        console.log("currentLevel "+ this.currentLevel);
        this.groupLevel[this.currentLevel] = this.add.group();
        this.jogo_click = true;
        this.jogo_acertos = 0;// total de subniveis no jogo
        //______________________________________________________

        this.subNivel = 1; // subnivel do jogo 
        this.totalSubNivel = 1;// total de subniveis no jogo 
        this.acertos = 4;
        this.groupLevel[this.currentLevel] = this.add.group();
        //console.log("-->ACERTOS "+ this.acertos);

        this.numeroInicial=39;
        this.totalNumerosLevel = 50; // total de numeros a serem mostrados no jogo 

        this.rodada = 1; // rodadas dentro do subnivel 
        this.totalRodadas = 4; // numero total de rodadas 
        this.tolerancia  = 1; // numero de erros possiveis dentro do nivel
        this.arrayNumeros = [40,41,42,43,44,45,46,47,48,49,50]; // numeros para seres sorteados 

        this.temp_array = this.arrayNumeros.slice();
        num  = this.sorteio();
        this.arrayNumeros = this.temp_array.slice();

        this.temp_array = this.arrayNumeros.slice();
        num1  = this.sorteio();
        this.arrayNumeros = this.temp_array.slice();

        this.temp_array = this.arrayNumeros.slice();
        num2  = this.sorteio();
        this.arrayNumeros = this.temp_array.slice();

        this.temp_array = this.arrayNumeros.slice();
        num3  = this.sorteio();
        this.arrayNumeros = this.temp_array.slice();

        array_temp = [];
        array_temp.push(num);
        array_temp.push(num1);
        array_temp.push(num2);
        array_temp.push(num3);

        array_temp.sort(this.crescente);

        //console.log("-->ARRAY TEMP "+array_temp);
        for(var i=0;i<array_temp.length;i++)
        {
            this.numerosVazios[i+1] = array_temp[i];
        }

        //console.log("-->NUMERO "+num);
        //console.log("-->NUMERO "+num1);
        //console.log("-->NUMERO "+num2);
        //console.log("-->NUMERO "+num3);
        //console.log("-->ARRAY "+this.numerosVazios);

        //this.add.tween(this.quadro).to({alpha:1}, 1500, Phaser.Easing.Linear.None, true);


        posicao = new Array([190,287],[239,328],[317,370],[405,358],[423,296],[494,252],[589,267],[675,291],[743,256],[782,201],[862,201])
        posicaoBrilho = new Array([158,269],[205,312],[284,352],[372,342],[390,283],[465,241],[551,253],[636,274],[711,243],[749,188],[834,177])
        
        this.showImagens();
        //______________________________________________________
        this.createLevel();

        this.createDelayTime(1000, function() {
            this.createButtons();
            
        });

        this.createDelayTime(2500, function() {
            this.initRodada();
            
        });

    },





    /**
    *
    * Controle de Perguntas, que serão mostradas no jogo
    * 
    **/
    createButton: function( x, y, array_pos, imagem, right, canInteract) {

        var _canInteract = (canInteract==null||canInteract==undefined) ? true : false;
        
        var btn;
        this.buttons[array_pos].inputEnabled = true;
        this.buttons[array_pos].input.useHandCursor = true;

        if(right) {

            btn = this.add.button(x,y, 'numbers', (_canInteract)?this.clickRightButton:null, this, imagem,imagem,imagem);
            btn.isCorrect = true;
            this.correctItem = btn;
            this.buttons[array_pos].events.onInputDown.add(this.clickRightButton, this);

        } else {
            btn = this.add.button(x,y, 'numbers', (_canInteract)?this.clickWrongButton:null, this, imagem,imagem,imagem);
            this.buttons[array_pos].events.onInputDown.add(this.clickWrongButton, this);
        }

        btn.anchor.set(0.5,1);
        btn.alpha = 0;
        btn.scale.set(0.5,0.5);

        if(_canInteract) {
            btn.onInputOver.add(this.onGameButtonOver, this);
            btn.onInputOut.add(this.onGameButtonOut, this);
        }

        this.add.tween(btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(btn.scale).to({x: 0.8, y: 0.8}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            if(_canInteract) {
                btn.input.useHandCursor = true;
            }
        }, this);

        return btn;
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
        this.createDelayTime(700, function() {
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
        console.log("clickWrongButton");
        this.resetLevel(this.currentLevel);
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

    /**
    *
    * Função disparada como callback case o usuario ainda possua mais de uma chance de clicar no item antes de ser considerado como erro
    * 
    **/
    onErrorChance: function(target) {

    },

    //______________________________jogo_____________________________

    getRandomUniqueItem: function(list, level) {
        console.log("---getRandomUniqueItem---");
        //console.log("---getRandomUniqueItem---");
        var letters = this.getNonRepeatLetter(list, level); // FRE
        //console.log("--> letters "+letters);
        var n = this.rnd.integerInRange(0,letters.length-1);
        //console.log("--> n " + n);

        //console.log("---getRandomUniqueItem---");

        return letters[n];
    },
    getNonRepeatLetter: function(itens, num) {
        console.log("---getNonRepeatLetter---");
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
    resetRandomLetter: function() {
        console.log("---resetRandomLetter---"); 
        this.spliceLetter = [
            null,
            [],
            [],
            [],
            []
        ];
    },
    retirarArrayElemento:function(elem){
        console.log("---retirarArrayElemento---"); 
        var index = this.temp_array.indexOf(elem);
      
        for (i=index; i<this.temp_array.length-1; i++)
        {
            this.temp_array[i] = this.temp_array[i+1];
        }
        this.temp_array.pop();
    },  
    sorteio:function(){  
        console.log("---sorteio---");   
        var item = parseInt(this.getRandomUniqueItem(this.temp_array, 1));   
        this.retirarArrayElemento(item); 
        return item;
    },
   
    mouseInputDown:function(elem){
        console.log("---mouseInputDown---"); 
        
    },
    
    resetLevel:function(curr){
        console.log("***resetLevel***");
        console.log("current: "+this.currentLevel);
        //this.initVars();

        this.createDelayTime(500, function() {
            this.add.tween(this.groupLevel[curr]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
            if(this.groupLevel[curr] != null) {
                this.groupLevel[curr].removeAll(true);
            }
        }); 
    },

    crescente:function(index1, index2){
        console.log("---crescente---");  
        return index1 - index2;
    },

    initVars:function(){
        // ________initVars____ 
        this.nivelAnterior = 0;
        this.nivelsubNivel = 0;
        this.subNivel = 0;
        this.totalSubNivel = 0;
        this.rodada =0;
        this.totalRodadas = 0;
        this.arrayNumeros = [];
        this.temp_array = [];
        this.totalNumerosLevel = 0;
        this.imagemsNumeros =[];
        this.brilhos = [];
        this.numerosVazios = [0,1,2,3,4];
        this.numerosVaziosImg = [0,1,2,3,4];
        this.numerosVaziosId = [0,1,2,3,4];
        this.acertos = 0;
        this.groupLevel=[];
        this.numeroInicial =0;
        this.tutorial = false;
        this.testeTutorial=false;
        //_____________________
    },

    initRodada:function(){
        console.log("*** initRodada***");
        console.log("rodada "+this.rodada);
        this.add.tween(this.imagemsNumeros[this.brilhos[this.rodada].imagem]).to({alpha:1},500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.brilhos[this.rodada]).to({alpha:1},800, Phaser.Easing.Linear.None, true);
        this.add.tween(this.brilhos[this.rodada].scale).to({x: 0.5, y: 0.5}, 800, Phaser.Easing.Linear.None, true)
        .onComplete.add(
            function(){
                this.add.tween(this.brilhos[this.rodada]).to({alpha:0}, 800, Phaser.Easing.Linear.None, true)
                .onComplete.add(
                    function(){
                       this.add.tween(this.brilhos[this.rodada]).to({alpha:1},800, Phaser.Easing.Linear.None, true); 
                       this.jogo_click = true;
                       this.enablebuttons();
                    }
                ,this)
            }
        ,this);
    },
    
    efeitoRodadaCorreta:function(rodada){
        console.log("***efeitoRodadaCorreta***");

        this.changeHappy(this.iara,"iara_happy","iara",70,115);
        
        x = this.imagemsNumeros[this.brilhos[rodada].imagem].x;
        y = this.imagemsNumeros[this.brilhos[rodada].imagem].y;
        
        spr = this.add.sprite(x,y, 'numeros',this.brilhos[rodada].imagem);
        this.imagemsNumeros.push(spr);
        this.groupIntro.add(spr);
        this.brilhos[rodada].destroy();
        //console.log(this.brilhos[this.rodada]);
    },
    
    limparSubnivel:function(){
        console.log("***limparSubnivel***");
        this.createDelayTime(500, function() {
             this.add.tween(this.groupLevel[this.currentLevel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
             
             if(this.groupLevel[this.currentLevel] != null) {
                this.groupLevel[this.currentLevel].removeAll(true);
             }
            if(!this.tutorial){
                this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true)
                .onComplete.add(function(){
                    this.add.tween(this.placar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500);
                    this.add.tween(this.quadro).to({alpha:0}, 700, Phaser.Easing.Linear.None, true);
                },this)
            }else{
                this.add.tween(this.groupIntro).to({y: -300}, 500, Phaser.Easing.Linear.None, true);
                this.add.tween(this.quadro).to({alpha:0}, 500, Phaser.Easing.Linear.None, true);
            }
        }); 
    },
    
    chamadaSubNivel:function(){
        console.log("***chamadaSubNivel***");
        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500)
        .onComplete.add(function(){
            img = this.currentLevel.toString()+this.subNivel.toString();
            console.log("imagem " +img);
            this.showQuestion(img);
            som = "soundP"+img;
            this.sound.play(som).onStop.add(function(){
                switch(this.currentLevel)
                {
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
            }, this);

            
        }, this);
        
    },

    testeNumerosVazios1:function(i,pos){
        //console.log("*** testeNumerosVazios ***");
        //console.log("count "+this.count);
        num = i+1;
        var _length =  this.totalRodadas+1;
        //console.log("numero teste "+num + "imagem "+ i);
        //console.log("tam "+this.numerosVazios.length);
        for(var it=1; it<_length;it++){
            //console.log("num vazio " + this.numerosVazios[it]);
            if((i+1)==this.numerosVazios[it]){
                
                nome=this.numerosVazios[it];
                //console.log("true " + this.numerosVazios[it]);
                this.brilhos[this.count] = this.add.sprite(posicaoBrilho[pos][0],posicaoBrilho[pos][1], 'brilho');
                this.brilhos[this.count].scale.set(0.5,0.5);
                this.brilhos[this.count].alpha = 0;
                this.brilhos[this.count].name = nome;
                this.brilhos[this.count].imagem = i;
                this.groupIntro.add(this.brilhos[this.count]); 
                this.count++;   
                return true;
            }
            
        }
        return false;
    },
    showImagens:function(){
        // mostrara imagens
        //console.log("***showImagens***");
        this.count = 1;  
        pos= 0;
        for(var i=this.numeroInicial; i<this.totalNumerosLevel;i++){
            resultado = this.testeNumerosVazios1(i,pos);
            //console.log("Resultado: "+resultado);
            if(resultado){
                this.imagemsNumeros[i] = this.add.sprite(posicao[pos][0],posicao[pos][1], 'numeros',50);
                this.imagemsNumeros[i].alpha = 0;
                this.imagemsNumeros[i].name = nome;
            }
            else
            {
                this.imagemsNumeros[i] = this.add.sprite(posicao[pos][0],posicao[pos][1], 'numeros',i);
            }
            this.groupIntro.add(this.imagemsNumeros[i]);
            pos++;
        }
    },

    showBotoes:function(){
        //console.log("***showBotoes***");
        x = 315;
        y = 502;
        afastamento = 0;
        botao = [];
        btnImg = [];
        var _length =  this.totalRodadas+1;
        if(!this.tutorial)
        {
            
            for(var i= 1; i<_length; i++){
                botao[i] = i;
            }
            botao.sort(this.randOrd);

            for(var i= 0; i<this.numerosVazios.length-1; i++){
                 
                 btnImg[i+1] = botao[i];
            }

        }
        else{
           
            for(var i= 1; i<this.numerosVazios.length; i++){
                btnImg[i] = i;
            }
        }
        
        //console.log("botao "+btnImg);
        
        if(this.nivelsubNivel!=this.subNivel){
            //console.log("---->LIBERAR NIVEL");
            count = 1;
            this.add.tween(this.quadro).to({alpha:1}, 700, Phaser.Easing.Linear.None, true);
            this.createDelayTime(1000, function() {
                for(var i= 1; i<_length; i++){
                    this.numerosVaziosImg[i] = this.add.sprite(x+afastamento,y, 'numeros',this.brilhos[btnImg[count]].imagem);
                    this.numerosVaziosImg[i].name = this.brilhos[btnImg[count]].name;
                    afastamento+=100;
                    count++;
                    this.groupIntro.add(this.numerosVaziosImg[i]);
                }   

            });

            // teste logico if(ele.name==this.numerosVazios[this.rodada]) no click 
        }    
    },

    enablebuttons:function(){
        console.log("---> enablebuttons");
        var _length =  this.totalRodadas+1;
        for(var i= 1; i<_length; i++){
            this.numerosVaziosImg[i].inputEnabled = true;
            this.numerosVaziosImg[i].input.useHandCursor = true;
            if(this.numerosVaziosImg[i].click){
                 this.numerosVaziosImg[i].alpha = 1;
            }
           
            this.numerosVaziosImg[i].events.onInputDown.add(this.mouseInputDownButton, this);
        }

    },


    blockBotoes:function(){
        console.log("---> blockBotoes");
        var _length =  this.totalRodadas+1;
        for(var i= 1; i<_length; i++){
            this.numerosVaziosImg[i].inputEnabled = false;
            this.numerosVaziosImg[i].events.onInputDown.removeAll();
            this.numerosVaziosImg[i].alpha = 0.5;
            //this.numerosVaziosImg[i].input.reset();
        }

    },

    animClick:function(proximo){
        //console.log("*** animClick ****");
        this.click.alpha = 1;
        this.click.x = this.arrow.x;
        this.click.y = this.arrow.y;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;
            this.efeitoIntro(proximo);
        }, this);
    },

    brilhoIntro:function(rodada,proximo){
        //console.log("*** brilhoIntro ****");
        this.add.tween(this.imagemsNumeros[this.brilhos[rodada].imagem]).to({alpha:1},300, Phaser.Easing.Linear.None, true);
        this.add.tween(this.brilhos[rodada]).to({alpha:1},800, Phaser.Easing.Linear.None, true);
        this.add.tween(this.brilhos[rodada].scale).to({x: 0.5, y: 0.5},800, Phaser.Easing.Linear.None, true)
        .onComplete.add(
            function(){
                this.add.tween(this.brilhos[rodada]).to({alpha:0},800, Phaser.Easing.Linear.None, true)
                .onComplete.add(
                    function(){
                       this.add.tween(this.brilhos[rodada]).to({alpha:1},800, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.efeitoIntro(proximo)},this) 
                    }
                ,this)
            }
        ,this);
    },

    efeitoIntro:function(tipo){
        //console.log("*** efeitoIntro ****");
        switch(tipo)
        {
            case 1:
                this.brilhoIntro(1,2);
            break;
            case 2: 
                x1 = this.numerosVaziosImg[1].x;
                y1 = this.numerosVaziosImg[1].y;
                this.add.tween(this.arrow).to({x:x1, y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.animClick(3)},this)
               
            break;
            case 3:
                this.efeitoRodadaCorreta(1);
                this.createDelayTime(100, function() {
                    this.efeitoIntro(4);
                });
            break;
            // numero 2
            case 4:
                this.brilhoIntro(2,5);
            break;
            case 5: 
                x1 = this.numerosVaziosImg[2].x;
                y1 = this.numerosVaziosImg[2].y;
                this.add.tween(this.arrow).to({x:x1, y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.animClick(6)},this)
               
            break;
            case 6:
                this.efeitoRodadaCorreta(2);
                this.createDelayTime(100, function() {
                    this.efeitoIntro(7);
                });
            break;
            // numero 3
            case 7:
                this.brilhoIntro(3,8);
            break;
            case 8: 
                x1 = this.numerosVaziosImg[3].x;
                y1 = this.numerosVaziosImg[3].y;
                this.add.tween(this.arrow).to({x:x1, y:y1},500, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.animClick(9)},this)
               
            break;
            case 9:
                this.efeitoRodadaCorreta(3);
                this.createDelayTime(1500, function() {
                    if(this.tutorial)
                    {
                        this.showFinishedLiveTutorial();
                    }    
                });
            break;

        }     
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

    //______________REPARO___________________//

    createLevel(){
        console.log("**** createLevel  ****");
        this.count = 1;  
        pos= 0;
        for(var i=this.numeroInicial; i<this.totalNumerosLevel;i++){
            resultado = this.testeNumerosVazios(i,pos);
            //console.log("Resultado: "+resultado);
            if(resultado){
                this.imagemsNumeros[i] = this.add.sprite(posicao[pos][0],posicao[pos][1], 'numeros',50);
                this.imagemsNumeros[i].alpha = 0;
                this.imagemsNumeros[i].name = nome;
            }
            else
            {
                this.imagemsNumeros[i] = this.add.sprite(posicao[pos][0],posicao[pos][1], 'numeros',i);
            }
            this.groupLevel[this.currentLevel].add(this.imagemsNumeros[i]);
            pos++;
        }
    },


    testeNumerosVazios:function(i,pos){
        num = i+1;
        var _length =  this.totalRodadas+1;
        for(var it=1; it<_length;it++){ 
            if((i+1)==this.numerosVazios[it]){
                nome=this.numerosVazios[it];
                this.brilhos[this.count] = this.add.sprite(posicaoBrilho[pos][0],posicaoBrilho[pos][1], 'brilho');
                this.brilhos[this.count].scale.set(0.5,0.5);
                this.brilhos[this.count].alpha = 0;
                this.brilhos[this.count].name = nome;
                this.brilhos[this.count].imagem = i;
                this.groupLevel[this.currentLevel].add(this.brilhos[this.count]); 
                this.count++;   
                return true;
            }
            
        }
        return false;
    },


    createButtons:function(){
        console.log("***createButtons***");
        x = 315;
        y = 502;
        afastamento = 0;
        botao = [];
        btnImg = [];
        
        for(var i= 1; i<this.numerosVazios.length; i++){
            botao[i] = i;
        }
        botao.sort(this.randOrd);

        for(var i= 0; i<this.numerosVazios.length-1; i++){
             
             btnImg[i+1] = botao[i];
        }
        count = 1;
        var _length = this.totalRodadas+1;
        console.log("--> length: "+length);
        this.add.tween(this.quadro).to({alpha:1}, 700, Phaser.Easing.Linear.None, true);
        this.createDelayTime(1000, function() {
            for(var i= 1; i<_length; i++){              
                this.numerosVaziosImg[i] = this.add.sprite(x+afastamento,y, 'numeros',this.brilhos[btnImg[count]].imagem);
                this.numerosVaziosImg[i].name = this.brilhos[btnImg[count]].name;         
                afastamento+=100;
                count++;
                this.groupLevel[this.currentLevel].add(this.numerosVaziosImg[i]);
            }   
        });

        this.createDelayTime(2000, function() {

            this.habilitar(_length);
        });
    },


    habilitar:function(_length){
        for(var i= 1; i<_length; i++){   
            this.numerosVaziosImg[i].inputEnabled = true;
            this.numerosVaziosImg[i].input.useHandCursor = true;
            this.numerosVaziosImg[i].events.onInputDown.add(this.mouseInputDownButton, this);
            this.numerosVaziosImg[i].click = true;
        }
    },

    RodadaCorreta:function(rodada){
        console.log("***efeitoRodadaCorreta***");

        this.changeHappy(this.iara,"iara_happy","iara",70,115);
        
        x = this.imagemsNumeros[this.brilhos[rodada].imagem].x;
        y = this.imagemsNumeros[this.brilhos[rodada].imagem].y;
        
        spr = this.add.sprite(x,y, 'numeros',this.brilhos[rodada].imagem);
        this.imagemsNumeros.push(spr);
        this.groupLevel[this.currentLevel].add(spr);
        this.brilhos[rodada].destroy();
        //console.log(this.brilhos[this.rodada]);
    },

    //initRodada

    mouseInputDownButton:function(elem){
        console.log("*** mouseInputDownButton ***");
        console.log("click permitido = "+this.jogo_click);

        if(elem.click){
            if(this.jogo_click){
                this.jogo_click=false;
                console.log(elem.name+" == "+this.numerosVazios[this.rodada]);
                if(elem.name==this.numerosVazios[this.rodada]) 
                {
                    console.log("CORRETO");
                    this.sound.play("hitAcerto");
                    elem.click= false;
                    elem.alpha = 0.5;
                    this.jogo_acertos++;
                    this.blockBotoes();
                    this.RodadaCorreta(this.rodada);

                    console.log(this.jogo_acertos+" == "+this.totalRodadas);
                    if(this.jogo_acertos==this.totalRodadas){
                        console.log("CORRETO FINAL");
                        this.createDelayTime(500, function() {
                            this.clickRightButton();
                        });
                    }else{
                        console.log("CORRETO PROXIMO");
                        this.rodada++;
                        this.createDelayTime(500, function() {
                            this.initRodada();
                        });
                    }
                }else{
                    console.log("ERRADO");
                    this.sound.play("hitErro");
                    this.blockBotoes();
                    elem.click = false;
                    if(this.tolerancia==0){
                        elem.click = false;
                        console.log("ERRO FINAL");
                        this.createDelayTime(500, function() {
                            this.clickWrongButton();
                            
                        });
                    }
                    else if(this.tolerancia=1)
                    {

                        console.log("TOLERANCIA");
                        elem.click = true;
                        this.tolerancia--;
                        this.enablebuttons();
                        this.jogo_click=true;
                        return false;
                        
                    }
                }
            }
        }
    }
        
       
};

/*










*/





