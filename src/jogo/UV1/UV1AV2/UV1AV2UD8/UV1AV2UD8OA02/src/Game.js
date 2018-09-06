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
            

        this.TEMPO_INTRO = 10000;
        this.ENABLE_CALL_TO_ACTION = true;


        // quantidade de perguntas que tem em cada nivel
        this.totalLevel1 = 1;
        this.totalLevel2 = 0;
        this.totalLevel3 = 0;

        // quantidade total de erros permitido em cada nivel
        // ex: se valor está definido para 2 erros, usuario pode errar 2x e na terceira é considerado errado
        this.totalErro1 = 0;
        this.totalErro2 = 0;
        this.totalErro3 = 0;

        /*****************************************************************/
        
        this.currentLocalLevel = 0;
        this.currentLocalErrors = this["totalErro" + this.currentLevel];

        //BasicGame.Game.Cenario.create(this.game);
        //BasicGame.Game.Cenario.gradeGuia(this.world.width,this.world.height);
        
        this.groupLevel = [null,1,2,3];
        
        this.dica = false;
        this.createScene();
        this.showIntro();

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();

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

        var t1 = "O coração da árvore bate de \ndiversas formas, e uma delas é \ncom palavras iguais procurando \npor seu par.";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 22, "left");

        tutorialText.alpha = 0;

        this.groupIntro.add(tutorialText);

        var kim = this.showKim(this.TEMPO_INTRO);

        
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);


        this.createDelayTime( this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
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
        //-120
        this.add.tween(this.placar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
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

            //if(this.currentLevel <= 3 && this.corrects <= 2) {

                //this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);

            //} else {
                this.gameOverMacaco();
            //}
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
            this.createDelayTime( 750, this.gotoNextLevel);
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

        this.add.sprite(-209, -262, 'background');
        this.showCallToAction = true;
        //this.showResumo();
        //this.initGame();
        

    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {

        console.log("showLiveTutorial");

        var t1 = "Para ajudar temos que ir virando coração \npor coração até lembrar onde vimos aquela \npalavra antes, num grande jogo da memória. \nQueremos brincar também, não é? \nVamos lá!";
        var tutorialText = this.drawText(this.world.centerX, 30, t1, 22, "left");

        tutorialText.alpha = 0;

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);

        //showFinishedLiveTutorial

        this.imagens = [];        
        this.imagens[0] = this.add.sprite(294, 269, 'cartas','maca');//click
        this.groupIntro.add(this.imagens[0]);
        this.imagens[1] = this.add.sprite(432, 269, 'cartas','sapo');
        this.groupIntro.add(this.imagens[1]);
        this.imagens[2] = this.add.sprite(571, 269, 'cartas','bacia');
        this.groupIntro.add(this.imagens[2]);

        this.imagens[3] = this.add.sprite(294, 389, 'cartas','bacia');
        this.groupIntro.add(this.imagens[3]);
        this.imagens[4] = this.add.sprite(432, 389, 'cartas','sapo');
        this.groupIntro.add(this.imagens[4]);
        this.imagens[5] = this.add.sprite(571, 389, 'cartas','maca');//click
        this.groupIntro.add(this.imagens[5]);

        this.imagens[0].id = this.imagens[0].frame;
        this.imagens[1].id = this.imagens[0].frame;
        this.imagens[2].id = this.imagens[0].frame;
        this.imagens[3].id = this.imagens[0].frame;
        this.imagens[4].id = this.imagens[0].frame;
        this.imagens[5].id = this.imagens[0].frame;

        this.imagens[0].scale.set(0,0);
        this.imagens[1].scale.set(0,0);
        this.imagens[2].scale.set(0,0);
        this.imagens[3].scale.set(0,0);
        this.imagens[4].scale.set(0,0);
        this.imagens[5].scale.set(0,0);

        time = 700;
        this.createDelayTime(1000, function() {
            for(i=0; i<this.imagens.length; i++){
                this.add.tween(this.imagens[i].scale).to({x:1,y:1}, time, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                   time+=200;
                },this)
            }
        });

        aux =4000 + time;
        this.createDelayTime(aux, function() {
            for(i=0; i<this.imagens.length; i++){
                this.imagens[i].frame = 16;
            }
        }); 


        

        aux =7000 + time;
        this.createDelayTime(aux, function() {

            this.arrow = this.add.sprite(this.world.centerX+300, this.world.centerY+50, "arrow");
            this.arrow.anchor.set(0.5,0.5);
            this.groupIntro.add(this.arrow);

            this.click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
            this.click.animations.add('idle', null, 18, true);
            this.click.animations.play('idle');
            this.click.alpha = 0;

            this.groupIntro.add(this.click);
            
            
            this.efeitoMouse(1);
        }); 



        //var x1 = BasicGame.Game.Cenario.addSpriteMeu('cartas',300,100,'maca');
        
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
        console.log("showTextResumo");
        var textList = [ 
            "Se prestarmos atenção veremos que todas as \npalavras dos corações possuem o mesmo som \nda [letra Ç] dentro delas, seja o [C], o [SS] ou o [S]. \nSe o som nos confunde, atenção à palavra \nescrita. Vamos lá!"
        ];

        var tutorialText = this.drawText(500, 40, textList[0], 22, "left");
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
            "Qual desses DOIS objetos têm\nnúmeros? cliquem!",
            "Entre esses dois...\nqual deles têm números?",
            "E agora? cliquem no objeto com\nnúmeros!"
        ];

        this.imageQuestion = this.drawText(this.world.centerX, 50, questionList[num]);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },


    initLevel1: function() {

        console.log("*** nivel 1 ***");

        this.groupLevel[this.currentLevel] = this.add.group();
        this.acertos = 0;
        this.num_erros = 0;
        this.carta = false; 
        this.carta1 = false; 
        this.imagemCarta = false;
        this.imagemCarta1 = false;
        this.click = 0;

        this.itens = ["maca", "osso", "sorvete","cereja", "onca", "girassol","sol", "cenoura", "palhaco","professor", "sapo", "cigarra","danca", "sopa", "bacia"];
        this.sorteados = [];
        this.temp_array = [];

        for(it=0; it<10; it++){
            this.temp_array = this.itens.slice();
            var item = this.getRandomUniqueItem(this.itens);
            this.sorteados[it] = item;
            this.retirarArrayElemento(item);
            this.itens = this.temp_array.slice();
        }

        for(it=0; it<10; it++){
            this.sorteados.push(this.sorteados[it]);
        }

        this.sorteados.sort(function() {
          return .5 - Math.random();
        });

        console.log(this.sorteados);

        x = 197;
        y = 50;

        difX = 125 +10;
        difY = 116 +10;

        linha = 0; // maximo =6

        this.imagens = [];

        for(i=0; i<this.sorteados.length; i++){
            this.imagens[i] = this.add.sprite(x, y, 'cartas',this.sorteados[i]);
            this.imagens[i].name = this.sorteados[i];
            this.imagens[i].id = this.imagens[i].frame;
            this.imagens[i].img = i;
            this.imagens[i].scale.set(0,0);
            //console.log(this.imagens[i].frame);
            if(linha==4){
                linha = 0;
                x = 197;
                y+=difY;
            }else{
                x+=difX;
                linha++;
            }

            this.groupLevel[this.currentLevel].add(this.imagens[i]);
        }

        this.createDelayTime(1000, function() {
            for(i=0; i<this.imagens.length; i++){
                this.add.tween(this.imagens[i].scale).to({x:1,y:1}, 1000, Phaser.Easing.Linear.None, true);
            }
        });

        this.createDelayTime(10000, function() {
            for(i=0; i<this.imagens.length; i++){
                this.imagens[i].frame = 16;
                //this.imagens[i].alpha = 0.5;
            }
        });

        this.createDelayTime(10500, function() {
            this.enableClick(0,this.imagens,null);
        });

         
    },

    

    initLevel2: function() {

    },

    initLevel3: function() {

       
    },

    /**
    *
    * Controle de Perguntas, que serão mostradas no jogo
    * 
    **/
    createButton: function( x, y, imagem, right, canInteract) {

        var _canInteract = (canInteract==null||canInteract==undefined) ? true : false;
        
        var btn;
        if(right) {

            btn = this.add.button(x,y, 'sprites', (_canInteract)?this.clickRightButton:null, this, imagem,imagem,imagem);
            btn.isCorrect = true;
            this.correctItem = btn;

        } else {
            btn = this.add.button(x,y, 'sprites', (_canInteract)?this.clickWrongButton:null, this, imagem,imagem,imagem);

        }


        btn.anchor.set(0.5,1);
        btn.alpha = 0;
        btn.scale.set(0.5,0.5);

        if(_canInteract) {
            btn.onInputOver.add(this.onButtonOver, this);
            btn.onInputOut.add(this.onButtonOut, this);
        }

        this.add.tween(btn).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(btn.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            if(_canInteract) {
                btn.input.useHandCursor = true;
            }
        }, this);

        return btn;
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


    //__________________________________AV1AV2UD8OA02_________________________________________
    retirarArrayElemento:function(elem){
        var index = this.temp_array.indexOf(elem);
      
        for (w=index; w<this.temp_array.length-1; w++)
        {
            this.temp_array[w] = this.temp_array[w+1];
        }
        this.temp_array.pop();
    },

    enableClick:function(modo,array_elem,elem,perfectOver){ // habilidar e dasabilitar o click em uma imagem
        switch(modo)
        {
            case 0:// habilitar o click em todos 
                for(var i=0; i<array_elem.length;i++)
                {     
                    array_elem[i].inputEnabled = true;
                    array_elem[i].input.useHandCursor = true;
                    array_elem[i].pixelPerfectOver = perfectOver;
                    array_elem[i].events.onInputDown.add(this.mouseInputDown, this);
                    
                }
            break;
            case 1:// habilitar o click em todos 
                elem.inputEnabled = true;
                elem.input.useHandCursor = true;
                elem.pixelPerfectOver = perfectOver;
                elem.events.onInputDown.add(this.mouseInputDown, this);
                
            break;
            case 2:// desabilitar o click em todos 
                for(var i=0; i<array_elem.length;i++){

                    array_elem[i].inputEnabled = false;
                    array_elem[i].input.useHandCursor = false;
                    array_elem[i].events.onInputDown.removeAll();
                    array_elem[i].input.reset();
                }
            break;
            case 3:// desabilitar o click em um elemento
                elem.inputEnabled = false;
                elem.input.useHandCursor = false;
                elem.events.onInputDown.removeAll();
                elem.input.reset();
            break;
        }   
    },

    mouseInputDown:function(elem){
        console.log("**mouseInputDown**");
        console.log(elem.name);
        console.log(elem.id);

       

        this.enableClick(3,null,elem);
        this.click++;
        console.log(this.click);
        if(this.click==1 && !this.carta){
            elem.frame = elem.id;
            //elem.alpha = 1;

            this.carta = elem.name;
            this.imagemCarta = elem.img;
            console.log("carta: "+this.carta);
        }
        if(this.click==2 && !this.carta1){
            
            elem.frame = elem.id;
            //elem.alpha = 1;

            this.carta1 = elem.name;
            this.imagemCarta1 = elem.img;
            
            console.log("carta1: "+this.carta1);
            
            if(this.carta==this.carta1){
                console.log("acertou!!!");
                this.sound.play("hitAcerto");
                this.acertos++;
                this.enableClick(2,this.imagens,null);
                
                this.add.tween(this.imagens[this.imagemCarta].scale).to({x:0,y:0}, 500, Phaser.Easing.Linear.None, true);
                this.add.tween(this.imagens[this.imagemCarta1].scale).to({x:0,y:0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    //this.imagens[this.imagemCarta].destroy();
                    //this.imagens[this.imagemCarta1].destroy();
                    this.enableClick(0,this.imagens,null);
                    this.imagemCarta = false;
                    this.imagemCarta1 = false;
                },this)
                
                this.carta = false; 
                this.carta1 = false; 
                
                this.click =0;

                if(this.acertos==10){ // frese está completa 
                    this.enableClick(2,this.imagens,null);
                    this.createDelayTime(1500, function() {
                        this.clickRightButton();
                    });  
                } 

            }else{
                console.log("invalida errou!!!");
                this.sound.play("hitErro");
                
                this.enableClick(2,this.imagens,null);
                this.num_erros++;
                this.carta = false; 
                this.carta1 = false; 
                this.click =0;

                this.createDelayTime(1000, function() {
                    
                    this.imagens[this.imagemCarta].frame =16;
                    this.imagens[this.imagemCarta1].frame =16;

                    this.enableClick(0,this.imagens,null);

                    //this.imagens[this.imagemCarta].alpha = 0.5;
                    //this.imagens[this.imagemCarta1].alpha = 0.5;

                    
                    
                });
                
                
                if(!this.dica){
                    if(this.num_erros==3){
                        console.log("errou!!!");
                        console.log("dica");
                        this.dica = true;

                        this.carta = true; 
                        this.carta1 = true; 
                        this.click =2;

                        this.enableClick(2,this.imagens,null);
                        this.createDelayTime(1200, function() {
                            this.resetLevel(this.currentLevel);
                        });
                        this.createDelayTime(1500, function() {
                            this.clickWrongButton();
                        });
                    }
                }
                
                if(this.num_erros==5){
                    console.log("errou!!!");
                    console.log("resumo");
                    
                    this.carta = true; 
                    this.carta1 = true; 
                    this.click =2;

                    this.enableClick(2,this.imagens,null);
                    this.createDelayTime(1200, function() {
                        this.resetLevel(this.currentLevel);
                    });
                    this.createDelayTime(1500, function() {
                        this.clickWrongButton();
                    });
                }
            }
        }
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

    animClick:function(prox){
        this.click.alpha = 1;
        this.click.x = this.arrow.x-35;
        this.click.y = this.arrow.y-35;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;
            this.efeitoMouse(prox);
        }, this);
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
    efeitoMouse:function(passo){
        //this.createDelayTime(1000, function() {
            switch(passo){
                case 1:

                    this.world.bringToTop(this.arrow);
                    this.world.bringToTop(this.click);

                    x = this.imagens[0].x+65;
                    y = this.imagens[0].y+45;
                    this.add.tween(this.arrow).to({x:x,y:y},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        
                        this.animClick(2);            
                    },this);
                break;
                case 2:
                    this.imagens[0].frame = this.imagens[0].id;
                    this.efeitoMouse(3);
                break;
                case 3:
                    this.world.bringToTop(this.arrow);
                    this.world.bringToTop(this.click);

                    x = this.imagens[5].x+65;
                    y = this.imagens[5].y+45;
                    this.add.tween(this.arrow).to({x:x,y:y},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        
                        this.animClick(4);            
                    },this);
                break;
                case 4:
                    this.imagens[5].frame = this.imagens[5].id;
                    this.add.tween(this.arrow).to({alpha:0},200, Phaser.Easing.Linear.None, true)
                    this.efeitoMouse(5);
                break;
                case 5:
                    this.add.tween(this.imagens[0].scale).to({x:0,y:0},1000, Phaser.Easing.Linear.None, true);
                    this.add.tween(this.imagens[5].scale).to({x:0,y:0},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                        this.efeitoMouse(6);
                    },this)
                    
                break;
                case 6:
                    this.soundIntro.onStop.addOnce(function(){
                        this.showFinishedLiveTutorial();
                    }, this);
                break;
            }
        //});
        

    },
    
    

    render:function(){
        //BasicGame.Game.Cenario.render();
    },
    update:function(){
        //this.updateTimer();
    }



};





