/* 
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
        //this.gradeGuia(1000, 600);    //function that enable see the coordenates x and y of the screen        

        this.TEMPO_INTRO = 14000;
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

        this.soundCallToAction = 'soundCallAction';

        this.groupLevel = [null,1,2,3];

        this.frasesQuestionLevel1 = [0, 1, 2];
        this.frasesQuestionLevel2 = [3, 4, 5];
        this.frasesQuestionLevel3 = [6, 7, 8];

        this.respostaCertaQuestionLevel1 = [0, 1, 1]; 
        this.respostaCertaQuestionLevel2 = [0, 1, 0];
        this.respostaCertaQuestionLevel3 = [1, 0, 1];
        //resposta certa = 2 OPÇÕES = BOTÃO 0 ->"RELATO" - BOTÃO 1 -> "NÃO RELATO"

        this.audio_level1 = ["P1_1", "P1_2", "P1_3"];
        this.audio_level2 = ["P2_1", "P2_2", "P2_3"];
        this.audio_level3 = ["P3_1", "P3_2", "P3_3"];

        //this.resetRandom();
        this.createScene();
        this.showIntro(); 

        /* HUD */
        this.hudBottom = this.createBottomHud();
        this.hud = this.createHud();

        
    },

    /**
    *
    * Função para começar a mostrar a introdução inicial do jogo.
    * Todos os itens criados na introdução devem ser adicionados ao grupo 'this.groupIntro'
    *
    **/
    showIntro: function() {

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -200, 'placar');
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
        console.log("*** showTextoIntro *** ");

        var texto = "Uau!";
        var tutorialText = this.drawText(this.world.centerX-110, 20, texto, 22, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var texto2 = "Vamos ver se esse aqui é um relato: \"[Minha vó]\n[fez um suco de goiaba que estava delicioso]\".\nIsso mesmo, é um relato! O que mais vem por ai?";
        var tutorialText2 = this.drawText(this.world.centerX+5, 18, texto2, 22, "left");
        tutorialText2.alpha = 0;
        this.groupIntro.add(tutorialText2);
        
        //ADICIONA KIM
        var kim = this.showKim(1000);
        //FAZ O TEXTO APARECER  
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        //INICIA O SOM DA INTRODUÇÃO
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);
        
         this.createDelayTime(1000, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.tutorialPlacar).to({y: -115}, 200, Phaser.Easing.Linear.None, true);
                this.add.tween(tutorialText2).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
            }, this);
        });
    },

    /**
    *
    * Função para iniciar o jogadorogo em si. Chamada após a introdução ou ao clicar no botão de skip.
    * Ela esconde o placar, remove o grupo da introdução e mostra o primeiro level do jogador
    * 
    **/
    initGame: function() {

        console.log("initGame");
        if(this.groupIntro != null) { // verifica se há algo do group da introdução e remove caso tenho
            this.groupIntro.removeAll(true);
        }

        this.placar = this.add.sprite(this.world.centerX, -300, 'placar');
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
                    this.createDelayTime(100, function() {
                        this.showNextLevel();
                    });
                }else{
                    this.createDelayTime(100, function() {
                        this.showNextLevel();
                    });
                    //this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
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

        this.background = this.add.sprite(-341,-269, 'background');
        //this.background.scale.set(0.5,0.5);
        // this.initLevel3();
        // this.showResumo();
        //this.anim_guri = this.addSpriteMeu('anim_guri',100,-100,0);
        this.anim_guri = this.add.sprite(460, 254, "anim_guri");
        this.anim_guri.animations.add('anim_guri', null, 18, true);
        this.anim_guri.animations.play('anim_guri');
        this.anim_guri.scale.set(1, 1);

        //this.anim_poly = this.addSpriteMeu('anim_poly',100,-100,0);
        this.anim_poly = this.add.sprite(660, 274, "anim_poly");
        this.anim_poly.animations.add('anim_poly', null, 18, true);
        this.anim_poly.animations.play('anim_poly');

    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");
        
        //ANIMACAO - FRASE - TUTORIAL
        this.frases = this.add.sprite(240, 343, 'frases', 9);
        this.frases.anchor.set(0.5,0.5);
        this.frases.scale.set(1,1);
        this.frases.alpha = 0;
        this.groupIntro.add(this.frases);
        this.add.tween(this.frases.scale).to({x:1.3, y:1.3}, 450, "Quart.easeOut", true);
        this.add.tween(this.frases).to({alpha:1}, 450, "Quart.easeOut", true).onComplete.add(function() {
            this.add.tween(this.frases.scale).to({x:1.1, y:1.1}, 450, "Quart.easeOut", true);  
           }, this);
        
        //ANIMACAO - OPCOES - TUTORIAL 
        //this.opcao1 = this.addSpriteMeu('opcao',100,200, 0); 
        //this.opcao2 = this.addSpriteMeu('opcao',100,200, 1); 
        
        this.opcao1 = this.add.sprite(-224, 546, 'opcao', 0);
        this.opcao1.anchor.set(0.5,0.5);
        this.opcao1.scale.set(1,1);
        this.opcao1.alpha = 0;
        this.groupIntro.add(this.opcao1);

        this.opcao2 = this.add.sprite(-392, 546, 'opcao', 1);
        this.opcao2.anchor.set(0.5,0.5);
        this.opcao2.scale.set(1,1);
        this.opcao2.alpha = 0;
        this.groupIntro.add(this.opcao2);

        this.add.tween(this.opcao1).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.opcao1).to({x:280,y:546},500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.add.tween(this.opcao1).to({x:224,y:546},500, Phaser.Easing.Linear.None, true)
        }, this);
         
        this.createDelayTime(700, function() { 
            this.add.tween(this.opcao2).to({alpha:1}, 600, Phaser.Easing.Linear.None, true);
            this.add.tween(this.opcao2).to({x:400,y:546}, 600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                this.add.tween(this.opcao2).to({x:392,y:546}, 500, Phaser.Easing.Linear.None, true)
            }, this);
        });

        //ANIMACAO - ARROW - TUTORIAL
        this.arrow = this.add.sprite(430,190, 'arrow');
        this.arrow.alpha = 0;
        this.groupIntro.add(this.arrow);
        this.add.tween(this.arrow).to({alpha:1},500, Phaser.Easing.Linear.None, true);
        this.createDelayTime(7700, function() { 
            this.add.tween(this.arrow).to({x:224,y:546}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {  
            var click = this.add.sprite(224, 546, "clickAnimation");
            click.animations.add('clickAnim', null, 18, true);
            click.animations.play('clickAnim'); 
            this.createDelayTime(1000, function() {
                click.animations.stop();
            });
            this.groupIntro.add(click);
            }, this);
         }, this);

       

        this.createDelayTime(12000, function() {
            this.showFinishedLiveTutorial();
        });
    },

    /**
    *
    * Função auxiliar para esconder painel e iniciar jogo
    * 
    **/
    showFinishedLiveTutorial:function() {
        console.log("showFinishedLiveTutorial");
        this.createDelayTime(1000, function() {
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
        var texto = "Quando fazemos um [relato pessoal], sabemos \nque se trata de uma pessoa contando alguma \ncoisa que aconteceu com ela antes de ela contar \no relato, ou escrevê-lo.";
        var tutorialText = this.drawText(this.world.centerX, 30, texto, 22, "center");
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
            break;
            case 2:
                this.showQuestion(2);
                this.initLevel2();
            break;
            case 3:
                this.showQuestion(3);
                this.initLevel3();
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
        console.log("*** Nivel 1 ***");

        this.groupLevel[this.currentLevel] = this.add.group();
    
        this.numberRandomQuestion = this.randomQuestion(this.frasesQuestionLevel1);
        console.log("Número da frase sorteada no array: " + this.numberRandomQuestion);

        this.showImageQuestion(this.frasesQuestionLevel1, this.numberRandomQuestion);
 
        this.showImagesAnswer();

        this.createDelayTime(700, function() {
            this.SoundQuestionAndCallToAction(this.audio_level1, this.numberRandomQuestion);
        });

        this.certo = this.respostaCertaQuestionLevel1[this.numberRandomQuestion];
    },

    initLevel2: function() {
        console.log("***initLevel2***");
        console.log("*** Nivel 2 ***");
        this.groupLevel[this.currentLevel] = this.add.group();

        this.numberRandomQuestion = this.randomQuestion(this.frasesQuestionLevel2);
        console.log("Número da frase sorteada no array: " + this.numberRandomQuestion);

        this.showImageQuestion(this.frasesQuestionLevel2, this.numberRandomQuestion);
 
        this.showImagesAnswer();

        this.createDelayTime(700, function() {
            this.SoundQuestionAndCallToAction(this.audio_level2, this.numberRandomQuestion);
        });

        this.certo = this.respostaCertaQuestionLevel2[this.numberRandomQuestion];

    },

    initLevel3: function() {
        console.log("***initLevel3***");
        console.log("*** Nivel 3 ***");
        this.groupLevel[this.currentLevel] = this.add.group();
        
        this.groupLevel[this.currentLevel] = this.add.group();

        this.numberRandomQuestion = this.randomQuestion(this.frasesQuestionLevel3);
        console.log("Número da frase sorteada no array: " + this.numberRandomQuestion);

        this.showImageQuestion(this.frasesQuestionLevel3, this.numberRandomQuestion);
 
        this.showImagesAnswer();

        this.createDelayTime(700, function() {
            this.SoundQuestionAndCallToAction(this.audio_level3, this.numberRandomQuestion);
        });

        this.certo = this.respostaCertaQuestionLevel3[this.numberRandomQuestion];
   
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
        this.createDelayTime(200, function() {
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
        if(this.currentLocalErrors > 0) {
            
            this.currentLocalErrors--;

            this.sound.play("hitErro");
            this.onErrorChance(target);
            return;
        }
        
        this.onPlayerError();
        
        switch(this.lives) {
            case 1: // mostra dica 

                this.createDelayTime(200, function() {
                    this.hideLevel(function() {
                        this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
                    });
                }); 
                
            break;
            case 0: // toca som de resumo
                this.lives = 0;
                this.createDelayTime(200, function() {
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
        randomQuestion: function(arrayName) {
            console.log("***randomQuestion***");
            var sizeArray = arrayName.length;
            var randomNumber = Math.floor(Math.random() * ((sizeArray - 1) - 0 + 1)) + 0;
            //var randomNumber = Math.random() * ((sizeArray - 1) - 0) + 0;
            return randomNumber;
        },

        showImageQuestion:function(arrayLevelQuestions, numberQuestionRandom) {
            console.log("***createAnimationAndShowQuestion***");
            this.question = this.add.sprite(240, 343, 'frases', arrayLevelQuestions[numberQuestionRandom]);
            this.question.anchor.set(0.5,0.5);
            this.question.scale.set(0.1,0.1);
            this.question.alpha = 0;
            this.addLevelGroup(this.question);
            this.add.tween(this.question.scale).to({x:1.3, y:1.3},450, "Quart.easeOut", true);
            this.add.tween(this.question).to({alpha:1}, 450, "Quart.easeOut", true).onComplete.add(function() {
                this.add.tween(this.question.scale).to({x:1.1, y:1.1},450, "Quart.easeOut", true);  
           }, this);
        

        },

        SoundQuestionAndCallToAction:function(nameArraySoundLevel, numberRandomQuestion) {
            console.log("***SoundQuestionAndCallToAction***");
            this.sound.play(nameArraySoundLevel[numberRandomQuestion]).onStop.addOnce(function(){
                this.createDelayTime(400, function() {
                    this.sound.play(this.soundCallToAction).onStop.addOnce(function(){
                        // libera click;
                        this.enableEventMouse();
                     }, this);
                });    
            }, this);
        },

        showImagesAnswer:function() {
            console.log("***showImagesAnswer***");
            this.buttonsAnswer = [];
            this.buttonsAnswer[0] = this.add.sprite(224, 546, 'opcao', 0);
            this.buttonsAnswer[0].anchor.set(0.5,0.5);
            this.buttonsAnswer[0].scale.set(1,1);
            this.buttonsAnswer[0].alpha = 0;
            this.buttonsAnswer[0].name = "0"; //RELATO
            this.buttonsAnswer[0].click = true;
            this.addLevelGroup(this.buttonsAnswer[0]);
            this.buttonsAnswer[1] = this.add.sprite(392, 546, 'opcao', 1);
            this.buttonsAnswer[1].anchor.set(0.5,0.5);
            this.buttonsAnswer[1].scale.set(1,1);
            this.buttonsAnswer[1].alpha = 0;
            this.buttonsAnswer[1].name = "1"; //NÃO RELATO
            this.buttonsAnswer[1].click = true;
            this.addLevelGroup(this.buttonsAnswer[1]);
            this.add.tween(this.buttonsAnswer[0]).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.buttonsAnswer[1]).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
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
    //fim funcoes de sorteio///


    level:function(tipo){ // funcionalidades comuns de todos os niveis e criacao do mini toturial 
        console.log("--> tipo: "+tipo);

        if(tipo==1){ 
            this.createButton(1);
        }else{
            this.createButton(0);
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
        tam = this.buttonsAnswer.length;
        for(i=0; i<tam; i++){  
            console.log("button "+i);       
            this.buttonsAnswer[i].inputEnabled = true;
            this.buttonsAnswer[i].input.useHandCursor = true;
            this.buttonsAnswer[i].events.onInputDown.add(this.mouseInputDown, this); 
        }
    },

    disableEventMouse:function(){
        console.log("***disableEventMouse***");
        tam = this.buttonsAnswer.length;
        for(i=0; i<tam; i++){         
            this.buttonsAnswer[i].inputEnabled = false;
            this.buttonsAnswer[i].input.useHandCursor = false;
            this.buttonsAnswer[i].input.reset();
        }
    },

    mouseInputDown:function(elem){ // elem = elemento que foi clicado
        console.log("***mouseInputDown***");
        if(elem.click){
            this.disableEventMouse();
            elem.click = false;
            this.add.tween(elem.scale).to({x:1.2,y:1.2}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(elem.scale).to({x:1,y:1}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.createDelayTime(500, function() {
                        this.checkGame(elem);
                    });
                },this);
            },this);
        }
    },

    checkGame:function(elem){
        console.log("***checkGame***");
        
        if(elem.name==this.certo){
            console.log("CORRETA");
                this.sound.play("hitAcerto");
                this.changeHappy(this.anim_poly,"anim_poly_happy","anim_poly", 656, 250, 660, 274); 
                this.changeHappy(this.anim_guri,"anim_guri_happy","anim_guri", 460, 254, 460, 254);
                this.createDelayTime(200, function() {
                    this.clickRightButton();
                });
        }else{
            console.log("ERRADA");
                this.sound.play("hitErro");
                this.createDelayTime(200, function() {
                    this.clickWrongButton();
                });
        }
    },

    resetLevel:function(nivel){
        console.log("***resetLevel***");
        this.add.tween(this.question.scale).to({x:0.1, y:0.1},300, Phaser.Easing.Linear.None, true);
            this.add.tween(this.question).to({alpha:0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                this.add.tween(this.buttonsAnswer[0]).to({alpha:0}, 300, Phaser.Easing.Linear.None, true);
                this.add.tween(this.buttonsAnswer[1]).to({alpha:0}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                    this.createDelayTime(100, function() {
                    this.add.tween(this.groupLevel[nivel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
                        if(this.groupLevel[nivel] != null) {
                            this.groupLevel[nivel].removeAll(true);
                        }
                    }); 
                }, this);
            }, this);
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
    }
}
    //,
    /**** editor *****/
    // somente habilitar em caso da criacao da cena e posicionamento dos elementos 
/*
    drawPoint:function(x,y){ 
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

    }
};
    




*/