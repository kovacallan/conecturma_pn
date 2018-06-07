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

        this.TEMPO_INTRO = 29500;
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

        /*

        Vamos ver imagens da Conecturma fazendo várias coisas, mas tem um probleminha: os relatos estão com uma palavra errada! 
        Temos que escolher a palavra certa, a que tem a ver com a foto para substituí-la e irmos em frente! 
        Olhem isso:"Amei este tijolo". Tijolo? Não, gente! Café! Escolho e plim! Fechou? 
 

        */

        var t1 = "Vamos ver imagens da Conecturma \nfazendo várias coisas, mas tem um \nprobleminha: os relatos estão com \numa palavra errada!";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 21, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t11 = "Temos que escolher a [palavra certa], \na que tem a ver com a foto para \nsubstituí-la e irmos em frente! ";
        var tutorialText11 = this.drawText(this.world.centerX+60, 30, t11, 21, "left");
        tutorialText11.alpha = 0;
        this.groupIntro.add(tutorialText11);

        var t2 = "Olhem isso:\"[Amei este tijolo]\". Tijolo? Não, \ngente! Café! Escolho e plim! Fechou? ";
        var tutorialText1 = this.drawText(this.world.centerX, 30, t2, 21, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);

        var kim = this.showKim(19500);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        //this.showLiveTutorial
        this.createDelayTime(11000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(tutorialText11).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
            }, this);
            
        });

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);


        this.createDelayTime(19500, function() {
            this.add.tween(tutorialText11).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
            this.add.tween(this.tutorialPlacar).to({y: -120}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                 this.add.tween(tutorialText1).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true);
            }, this);
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
            console.log("*** hideLevel imagem null***");
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
            if(this.currentLevel <= 3 && this.corrects <= 2) {
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
        //this.background = this.addSpriteMeu('background',100,-100,0);
        this.background = this.add.sprite(-51,-72, 'background');
        //this.initLevel3();
        //this.showResumo();
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");

        this.textoFrase = [ "[amei este tijolo.]",
                            "",
                            ""
                            ];
        this.cenas = [9,null,null];
        this.item= 0;
       
        var aux = new Array([28,27,1],[null,null,null],[null,null,null]);
        this.certo = aux[this.item][0];
         
        this.btn = aux[this.item].slice();

        this.level(0);// condicao para inserir no grupo de level 
        this.arrow = this.add.sprite(430,190, 'arrow');
        this.arrow.alpha =0;
        this.groupIntro.add(this.arrow);
        this.add.tween(this.arrow).to({alpha:1},200, Phaser.Easing.Linear.None, true);
        
        

        this.createDelayTime(6000, function() {
            this.add.tween(this.arrow).to({x:700,y:150+80},1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.buttons[1].scale).to({x:1.2,y:1.2}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.add.tween(this.buttons[1].scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true);
                },this);
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
        console.log("showFinishedLiveTutorial");
        this.createDelayTime( 1000, function() {
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
        var t1 = "Um relato deve fazer sentido. Até porque num \nrelato pessoal, estamos falando sobre [algo que] \n[fizemos], algo que aconteceu com a gente, sabem? \nVamos recomeçar!";
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
                this.initLevel1();
                /*if(this.showCallToAction) {
                    this.initLevel1();
                } else {   
                    this.sound.play("soundP1").onStop.addOnce(this.initLevel1, this);
                }*/
            break;
            case 2:
                this.showQuestion(2);
                this.initLevel2();
                /*if(this.showCallToAction) {
                    this.initLevel2();
                } else {   
                    this.sound.play("soundP2").onStop.addOnce(this.initLevel2, this);
                }*/
                
            break;
            case 3:
                this.showQuestion(3);
                this.initLevel3();
                /*if(this.showCallToAction) {
                    this.initLevel3();
                } else {   
                    this.sound.play("soundP3").onStop.addOnce(this.initLevel3, this);
                }*/  
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
        console.log("***showQuestion ***");
        var questionList = [ null,
            "",
            "",
            ""
        ];

        this.imageQuestion = this.drawText(this.world.centerX, 30, questionList[num]);
        this.imageQuestion.alpha = 1;

        if(this.showCallToAction) {
            return;
        }

        if(this.ENABLE_PLACAR){
            this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        }else{
            this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        }
    },
           
    initLevel1: function() {

        console.log("***initLevel1***");
        this.groupLevel[this.currentLevel] = this.add.group();

        this.frase = [0,1,2];
        //this.fraseFrame = [0,1,2];
        this.textoFrase = [ "[\"Este é um MACARRÃO da memória!\" Macarrão] \n[não! Que palavra entra aqui?]",
                            "[\"Adoro CADEIRA com chocolate!\" Cadeira não!] \n[ Que palavra entra aqui?]",
                            "[\"Brinquei a GARRAFA toda!\" Garrafa? Não!] \n[ Que palavra entra aqui?]"
                            ];
        this.cenas = [0,1,2];

        this.temp_array = this.frase.slice();
        this.item= this.sorteio();
        this.frase= this.temp_array.slice();

        ///para teste 
        //this.item = 2;

        var aux = new Array([0,1],[2,3],[4,5]);
        this.certo = aux[this.item][0];
        //this.itemOriginal = this.fraseFrame[this.item];

        // misturando os botoes 
        this.btn = aux[this.item].slice();
        this.btn.sort(function() {
            return .5 - Math.random();
        });

        this.level(1);// condicao para inserir no grupo de level 
    },

    initLevel2: function() {
        console.log("***initLevel2***");
        this.groupLevel[this.currentLevel] = this.add.group();

        this.frase = [0,1,2];
        //this.fraseFrame = [3,4,5];
        this.textoFrase = [ "[\"Eu tirei uma NUVEM.\" Nuvem? Delirou!] \n[Que palavra entra aqui?]",
                            "[\"Vi filhotes de PORTA!\" Porta, nada a ver!] \n[Que palavra entra aqui?]",
                            "[\"Tem uma CADEIRA na janela!\" Cadeira, hahaha!] \n[ Que palavra entra aqui?]"
                            ];
        this.cenas = [3,4,5];

        this.temp_array = this.frase.slice();
        this.item= this.sorteio();
        this.frase= this.temp_array.slice();

        ///para teste 
        //this.item = 2;

        var aux = new Array([6,7,8],[9,10,11],[12,13,14]);
        this.certo = aux[this.item][0];
        //this.itemOriginal = this.fraseFrame[this.item];

        // misturando os botoes 
        this.btn = aux[this.item].slice();
        this.btn.sort(function() {
            return .5 - Math.random();
        });



        this.level(1);// condicao para inserir no grupo de level 
        
    },

    initLevel3: function() {
        console.log("***initLevel3***");
        this.groupLevel[this.currentLevel] = this.add.group();

        this.frase = [0,1,2];
        //this.fraseFrame = [3,4,5];
        this.textoFrase = [ "[\"Apertei a CABEÇA errada!\", não é cabeça! Qual]\n[ é a palavra certa?]",
                            "[\"Escutei ABELHA na internet!\" Que abelha que nada,]\n[ qual é a palavra?]",
                            "[\"Escrevo meu ROSTO assim!\", isso não faz sentido… ]\n[o que entra no lugar de rosto?]"
                            ];
        this.cenas = [6,7,8];

        this.temp_array = this.frase.slice();
        this.item= this.sorteio();
        this.frase= this.temp_array.slice();

        ///para teste 
        //this.item = 1;

        var aux = new Array([15,16,17,18],[19,20,21,22],[23,24,25,26]);
        this.certo = aux[this.item][0];
        //this.itemOriginal = this.fraseFrame[this.item];

        // misturando os botoes 
        this.btn = aux[this.item].slice();
        this.btn.sort(function() {
            return .5 - Math.random();
        });

        this.level(1);// condicao para inserir no grupo de level 
        
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

    update: function () {

        //this.updateTimer();

    },

    
    
    //____________________________ funcoes do jogo ____________________________________________________________________________________
    //funcoes de sorteio///
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
    //fim funcoes de sorteio///


    level:function(tipo){ // funcionalidades comuns de todos os niveis e criacao do mini toturial 
        console.log("--> tipo: "+tipo)
        //this.imageQuestion = this.drawText(this.world.centerX, 30, questionList[num]);
        //this.imageQuestion.alpha = 0;
        //this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        //this.Marca_cabo = this.addSpriteMeu('marca_cabo',100,100,0);
        //this.sound.play("soundP1").onStop.addOnce(this.initLevel1, this);
         //this.cabo = this.add.sprite(546.83,782.47, 'cabo',this.item);

        var difY = 0;
        var font = 24;
        if(tipo==0){
            difY=50;
            font = 30;
        }
        console.log(this.item);
        console.log("--> item: "+this.item);
        console.log("--> frase: "+this.textoFrase[this.item]);
        console.log("--> cena: "+this.item);
        console.log("--> cena Frame: "+this.cenas[this.item]);
        console.log("--> certo: "+this.certo);
        console.log("--> btn: "+this.btn);

        this.imagemTextoFrase = this.drawText(this.world.centerX,430+difY,this.textoFrase[this.item],font);
        this.imagemTextoFrase.alpha = 0;
        this.imagemFrase =this.add.sprite(199,100+difY, 'cenas',this.cenas[this.item]); 
        this.imagemFrase.alpha = 0;

        if(tipo==1){ // adiciona as imagens no grupo do level 
            this.addLevelGroup(this.imagemTextoFrase);
            this.addLevelGroup(this.imagemFrase);
            this.createButton(1,difY);

        }else{// é intro adicona as imagens no grupo da intro 
            this.addIntroGroup(this.imagemTextoFrase);
            this.addIntroGroup(this.imagemFrase);
            this.createButton(0,difY);
        }

        

        var som = "C"+this.imagemFrase.frame; 

        var delay = (this.btn.length*500) +500;

        //this.createDelayTime(delay, function() {
            this.add.tween(this.imagemTextoFrase).to({alpha: 1}, delay, Phaser.Easing.Linear.None, true);
            this.add.tween(this.imagemFrase).to({alpha: 1}, delay, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                if(tipo==1){
                    this.sound.play(som).onStop.addOnce(function(){
                        console.log("----liberar----");
                        this.enableEventMouse();
                    }, this);
                }     
            },this);

        ///});
    },


    createButton:function(tipo,difY){
        this.buttons = [];
        var tam = this.btn.length;
        var y = 130+difY;
        var delay = 500;
        for(i=0; i<tam; i++){
            this.buttons[i] = this.add.sprite(1300,y, 'palavras',this.btn[i]);
            this.buttons[i].anchor.set(0.5,0.5);
            this.buttons[i].name  = this.buttons[i].frame;
            this.buttons[i].click = true;
            y+=70;

            if(tipo==1){ // adiciona as imagens no grupo do level 
                 this.addLevelGroup( this.buttons[i]);
            }else{// é intro adicona as imagens no grupo da intro 
                this.addIntroGroup( this.buttons[i]);
            }

            this.add.tween(this.buttons[i]).to({x:700}, delay, Phaser.Easing.Linear.None, true);
            delay+=500;

        }
    },


    addIntroGroup:function(elem){
        this.groupIntro.add(elem);
    },


    addLevelGroup:function(elem){
        this.groupLevel[this.currentLevel].add(elem);    
    },

    enableEventMouse:function(){
        console.log("***enableEventMouse***");
        //elem.inputEnabled = true;
        //elem.input.useHandCursor = true;
        //elem.events.onInputDown.add(this.mouseInputDown, this); // click no mouse 
        tam = this.buttons.length;
        for(i=0; i<tam; i++){  
            console.log("button "+i);       
            this.buttons[i].inputEnabled = true;
            this.buttons[i].input.useHandCursor = true;
            this.buttons[i].events.onInputDown.add(this.mouseInputDown, this); // click no mouse 
        }
    },

    disableEventMouse:function(){
        console.log("***disableEventMouse***");
        //elem.inputEnabled = false;
        //elem.input.useHandCursor = false;
        //elem.input.reset();

        tam = this.buttons.length;
        for(i=0; i<tam; i++){         
            this.buttons[i].inputEnabled = false;
            this.buttons[i].input.useHandCursor = false;
            this.buttons[i].input.reset();
        }
    },

    mouseInputDown:function(elem){
        console.log("***mouseInputDown***");
        if(elem.click){
            this.disableEventMouse();
            elem.click = false;
            this.add.tween(elem.scale).to({x:1.2,y:1.2}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(elem.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    // logica do jogo
                    this.checkGame(elem);
                },this);
            },this);
        }
    },

    checkGame:function(elem){
        console.log("***checkGame***");
        var som = "P"+elem.frame;
        if(elem.name==this.certo){
            console.log("CORRETA");
            this.sound.play(som).onStop.addOnce(function(){
                this.sound.play("hitAcerto");
                this.createDelayTime(200, function() {
                    this.clickRightButton();
                });
            }, this);
            
        }else{
            console.log("ERRADA");
             this.sound.play(som).onStop.addOnce(function(){
                this.sound.play("hitErro");
                this.createDelayTime(200, function() {
                    this.clickWrongButton();
                });
            }, this);

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



    
    /**** editor *****/
    // somente habilitar em caso da criacao da cena e posicionamento dos elementos 

    /*drawPoint:function(x,y){ 
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(0);
        graphics.beginFill(0xff0000,1);
        graphics.drawCircle(x,y,5);
        graphics.endFill();

        //graphics.moveTo(0, 0);
        //graphics.lineStyle(5, 0xFFFFFF, 1);
        //graphics.lineTo(x, y);
    },

    gradeGuia:function(width,height){
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

    addSpriteMeu:function(sprite,x,y,frame){
        spr = this.game.add.sprite(x,y, sprite,frame);
        //spr.anchor.set(0.5,0.5);
        this.enableDragDropMeu(spr);
        return spr;
    },

    enableDragDropMeu:function(elem){
        elem.inputEnabled = true;
        elem.input.enableDrag();
        elem.events.onDragStart.add(this.onDragStartMeu, this);
        elem.events.onDragStop.add(this.onDragStopMeu, this);
    },

    onDragStartMeu:function(sprite, pointer) {

        this.result = "Dragging " + sprite.key;
    },

    onDragStopMeu:function (sprite, pointer) {

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





