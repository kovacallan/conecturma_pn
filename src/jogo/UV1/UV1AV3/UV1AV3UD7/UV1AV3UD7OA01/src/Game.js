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
        // this.gradeGuia(1000, 600);            

        this.TEMPO_INTRO = 24800;
        this.ENABLE_CALL_TO_ACTION = true;
        this.ENABLE_PLACAR = true; // para desabilitar o placar 

        // quantidade de perguntas que tem em cada nivel
        // 3 acertos em cada rodada para passar para a próxima
        this.totalLevel1 = 3;
        this.totalLevel2 = 3;
        this.totalLevel3 = 3;

        // quantidade total de erros permitido em cada nivel - SEM TOLERANCIA NESSE CASO
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

        //VARIAVEIS DO JOGO
        this.groupLevel = [null,1 ,2 ,3 , 4, 5, 6, 7, 8, 9];

        this.num_level = [[null], [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],[21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39], [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]];
        

        // TOLERANCIA DE ERRO
        // 3 VIDAS POR NÍVEL
        this.lives = 3;
        this.rodada = 0;
        /*****************************************************************/

        this.resetRandom();
        this.createScene();
        this.showIntro();
        // this.initGame();

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

        this.arrow = this.add.sprite(427, 227, "arrow"); 
        this.arrow.anchor.set(0.5,0.5);
        this.arrow.alpha = 0; 

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");
        this.tutorialPlacar.addChild(this.skipButton);

        this.groupIntro = this.add.group();

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextIntro, this);
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
    showTextIntro: function() {
        var t1 = "Encontramos um colar quebrado! \nAh, mas nem isso o Ser Folclórico\n maluco perdoou! Vamos consertá-lo,\n pois é um artefato indígena!";
        var tutorialText = this.drawText(this.world.centerX+60, 30, t1, 22, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);

        var t2 = "Nossa sorte é que estava tudo numerado,\n então basta colocar as sementes no lugar\n certo usando números que vem [antes] ou\n [depois] do que mostrarmos!";
        var tutorialText1 = this.drawText(this.world.centerX+5, 10, t2, 22, "left");
        tutorialText1.alpha = 0;
        this.groupIntro.add(tutorialText1);
        
        //ADICIONA KIM
        var kim = this.showKim(11900);

        //TEXTO 0 APARECE E INICIA O ÁUDIO DA INTRO 
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);

         //DESAPARECE TEXTO 0 E INICIA TEXTO 1
        this.createDelayTime(12100, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.tutorialPlacar).to({y: -120}, 200, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                    this.add.tween(tutorialText1).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
                }, this);
            }, this);   
        });     

        this.createDelayTime(this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText1).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                this.showFinishedLiveTutorial();
            }, this);
        });
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");

        //ANIM COLAR
        this.colar = this.add.sprite(290,410, 'colar');
        this.colar.scale.set(0.8, 0.8);
        this.colar.alpha = 0;
        this.addIntroGroup(this.colar);
        
        this.add.tween(this.colar).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.colar).to({x:290,y:421}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            //SHOW NUM SORTEADO
            this.showNumSorteado("13", 0XFF9900, 1.2, 200, this.groupIntro);
            this.createDelayTime(2000, function() {
                //showAlternativas
                this.showAlternativas([12, 14, 15], this.groupIntro);
            }, this);
        },this);
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

        this.add.tween(this.arrow).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
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

        this.add.tween(this.arrow).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
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
                    this.createDelayTime(400, function() {
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
        console.log("*********create scene*********");
        // this.background = this.addSpriteMeu('background',-630,-338, 0);
        this.background = this.add.sprite(-630,-338, 'background');

        // this.guria = this.addSpriteMeu("guria_keep_alive", 80,286);
        this.guria = this.add.sprite(80,286, "guria_keep_alive", 0);
        var anim = this.guria.animations.add('anim_guria', null, 18, true);
        anim.play('anim_guria');
    },

    /**
    *
    * Função Auxiliar para mostrar tutorial de introducao
    * 
    **/
    showFinishedLiveTutorial:function() {
        console.log("showFinishedLiveTutorial");
        this.createDelayTime( 1000, function() {
            this.add.tween(this.arrow).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
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

        this.add.tween(this.tutorialPlacar).to({y: -100}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextResumo, this);
    },

    /**
    *
    * Função que mostra o texto do resumo.
    * Ao final chama a função global que esconde o resumo
    * 
    **/
    showTextResumo: function() {
        console.log("******show text resumo********");
        var t1 = "O número que vem antes se chama antecessor. O\n antecessor de [5], por exemplo, é o [4]! E o número\n que vem logo após o outro se chama [sucessor]. \nO de 5, no caso, é o 6! Sacaram?";
        var tutorialText = this.drawText(this.world.centerX, 20, t1, 22, "center");
            tutorialText.alpha = 0;                      

        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.soundResumo = this.setDebugAudio("soundResumo");

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
        }, this);
    },

    /*
        Verifica se precisa resetar os erros do jogo conforme o nível atual
        A cada novo nível, os erros do nível anterior devem ser desconsideradas

        ATENCAO - > ATUALIZAR CONFORME A QUANTIDADE DE NÍVEIS DO JOGO     

        chama-lo dentro do shownextlevel();
        this.resetError();           
    */
    resetError:function() {
        var level = this.verifyCurrentLevel();
        if(level == 4 && this.previousLevel != 4) {
            this.lives = 3;
        } else if(level == 7 && this.previousLevel != 7) {
            this.lives = 3;
        }
        this.updateLivesText();
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

        this.resetError();        

        switch(levelNum) {
            case 1:
                this.showQuestion(1);
                this.initLevel(1, 1);
            break;
            case 2:
                this.showQuestion(2);
                this.initLevel(1, 2);
            break;
            case 3:
                this.showQuestion(3);
                this.initLevel(1, 3);
            break;
            case 4:
                this.showQuestion(4);
                this.initLevel(2, 4);
            break;
            case 5:
                this.showQuestion(5);
                this.initLevel(2, 5);
            break;
            case 6:
                this.showQuestion(6);
                this.initLevel(2, 6);
            break;
            case 7:
                this.showQuestion(7);
                this.initLevel(3, 7);
            break;
            case 8:
                this.showQuestion(8);
                this.initLevel(3, 8);
            break;
            case 9:
                this.showQuestion(9);
                this.initLevel(3, 9);
            break;


        }
        this.showCallToAction = false;
    },

    /**
    *
    * Controle de Perguntas, que serão mostradas no jogo
    * OBRIGATORIO
    **/
    showQuestion: function(num) {

        console.log("***showQuestion ***");
        var questionList = [ null,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
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
    
           
    initLevel: function(level, rodada) {
        
        console.log("***initLevel***");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.nivel = level;
        this.rodada = rodada;

        //DEFINE NUMERO SORTEADO
        console.log("level " + level);
        console.log("Array de números pra sorteio: " + this.num_level[level]);
        this.num_sorteado = this.defineNumSorteado(this.num_level[level]);
        console.log("Número sorteado: " + this.num_sorteado);
        
        //DEFINE RESP. CERTA
        this.certo = this.defineCerto(this.num_sorteado, level);

        //CRIA ARRAY DE ALTERNATIVAS DE RESPOSTAS
        this.arrayAnswers = this.createArrayAnswers(this.certo);

        //DESCE PLACA, MOSTRA LEGENDA E TOCA SOUNDQUESTION E ENABLE CLICK NO FIM DO AUDIO
        //this.showTutorialPlacar(this.groupLevel[this.currentLevel]);

        //TOCA SOM DA PERGUNTA
        this.soundQuestion = this.setDebugAudio("P"+this.nivel);
       
        //ANIM COLAR
        this.colar = this.add.sprite(290,410, 'colar');
        this.colar.scale.set(0.8, 0.8);
        this.colar.alpha = 0;
        this.addLevelGroup(this.colar);
        
        this.add.tween(this.colar).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.colar).to({x:290,y:421}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            
            this.showNumSorteado(this.num_sorteado.toString(), 0XFF9900, 1.2, 200, this.groupLevel[this.currentLevel]);
            this.createDelayTime(2000, function() {
                this.showAlternativas(this.arrayAnswers, this.groupLevel[this.currentLevel]);
            }, this);
        },this);
    },

    showAlternativas:function(arrayAnswers, group) {
        console.log("**********show alternativas***********");
        this.buttonsAnswer = [];
        this.buttonsAnswer[0] = this.add.sprite(389,1000, "alternativas", arrayAnswers[0]);
        this.buttonsAnswer[0].scale.set(0.7, 0.7);
        this.buttonsAnswer[0].name = arrayAnswers[0];

        this.buttonsAnswer[1] = this.add.sprite(514,1000, "alternativas", arrayAnswers[1]);
        this.buttonsAnswer[1].scale.set(0.7, 0.7);
        this.buttonsAnswer[1].name = arrayAnswers[1];

        this.buttonsAnswer[2] = this.add.sprite(644,1000, "alternativas", arrayAnswers[2]);
        this.buttonsAnswer[2].scale.set(0.7, 0.7);
        this.buttonsAnswer[2].name = arrayAnswers[2];


        group.add(this.buttonsAnswer[0]);
        group.add(this.buttonsAnswer[1]);
        group.add(this.buttonsAnswer[2]);

        //ANIM. ALTERNATIVAS
        this.animBoomerang(this.buttonsAnswer[1], 514,319, 514,340);
        this.createDelayTime(1000, function() {
            this.animBoomerang(this.buttonsAnswer[0], 389, 270, 389, 291);
            this.animBoomerang(this.buttonsAnswer[2], 644,270, 644,291);
            this.createDelayTime(1500, function() {
                this.enableEventMouse();
            }, this);
        }, this);

        if(group == this.groupIntro) {
            this.addIntroGroup(this.arrow);
            this.createDelayTime(5900, function() { 
                this.add.tween(this.arrow).to({alpha:1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                    this.add.tween(this.arrow).to({x:436,y:341}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                    this.buttonsAnswer[0].tint = 0X9D880D;
                    var click = this.add.sprite(397, 300, "clickAnimation"); //522, 350
                    click.animations.add('clickAnim', null, 18, true);
                    click.animations.play('clickAnim'); 
                    this.stopClickAnimation(click, 1000);
                    this.add.tween(this.buttonsAnswer[0].scale).to({x:0.9,y:0.9}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.add.tween(this.arrow).to({x:559,y:388}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                        click = this.add.sprite(522, 350, "clickAnimation");
                        click.animations.add('clickAnim', null, 18, true);
                        click.animations.play('clickAnim'); 
                        this.stopClickAnimation(click, 1000);
                        this.buttonsAnswer[1].tint = 0X9D880D;
                        this.add.tween(this.buttonsAnswer[1].scale).to({x:0.9,y:0.9}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
                           this.showPerola(this.groupIntro);
                        }, this);
                    }, this);
                    },this);
                }, this);
                }, this);
            }, this);
        }
    },

    showPerola:function(group) {
        console.log("*************show perola*****************");
        this.perola = this.add.sprite(489,503, "alternativas", 0);
        this.perola.scale.set(0.9,0.9);
        this.perola.alpha = 0;
        group.add(this.perola);
        this.add.tween(this.perola).to({alpha:1}, 700, "Quart.easeOut", true);
    },

    showNumSorteado:function(num, color, scale, y, group) {
        console.log("**********show num. sorteado***********");
        var x;
        if(num >= 10) {
            x = 485;
        } else {
            x = 520;
        }

       this.addText(num, color, scale, x, y, group);     
    },

    defineNumSorteado:function(array) {
        console.log("**********define num. sorteado***********");
        var numSorteado;
        numSorteado = this.randomQuestion(array);
        array.splice(this.index_question, 1);
        return numSorteado;
    },

    defineCerto:function (numSorteado, level) {
        console.log("**********define resposta certa***********");
        var certo;
        if(level == 2) {
            certo = numSorteado + 1;
            console.log("Resposta certa: " + numSorteado + " + " + 1 + " = " + certo);
        } else {
            certo = numSorteado - 1;
            console.log("Resposta certa: " + numSorteado + " - " + 1 + " = " + certo);
        }
        return certo;
    },

    enableEventMouse:function(){
        console.log("***enableEventMouse***");
        tam = this.buttonsAnswer.length;
        for(i=0; i<tam; i++){  
            console.log("button "+i);   
            this.buttonsAnswer[i].click = true;    
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
        var tint = elem.tint;
        if(elem.click){
            elem.tint = 0X9D880D;
            if(elem.name == this.certo) {
                this.showPerola(this.groupLevel[this.currentLevel]);
                this.disableEventMouse();
                elem.click = false;
                this.checkGame(elem);
            } else {
                this.lives--;
                if(this.lives <= 1) {
                    this.disableEventMouse();
                    elem.click = false;
                } else {
                    this.createDelayTime(150, function() {
                        elem.tint = tint;
                    }, this);
                }
                this.updateLivesText();
                this.checkGame(elem);
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
    
    this.previousLevel = this.rodada;
        this.resetLevel(this.currentLevel);
        if(this.currentLocalErrors > 0) {
            this.currentLocalErrors--;
            return;
        }    
        this.errors--;
        
        switch(this.lives) {
            case 1: // mostra dica 1

                this.createDelayTime(300, function() {
                    this.hideLevel(function() {
                        this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
                    });
                }); 
                
            break;
            case 0: // toca som de resumo
                this.lives = 0;

                this.createDelayTime(300, function() {
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

    },

    //____________________________ funcoes do jogo ____________________________________________________________________________________
    /*showTutorialPlacar:function(group) { 
        this.tutorialPlacar = this.add.sprite(this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);
        group.add(this.tutorialPlacar);
        this.add.tween(this.tutorialPlacar).to({y: -140}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
            this.showTextLevel();
        }, this);
    }, 

    showTextLevel:function() {
        var text; 
        var y;
        if(this.nivel == 1) {
                y = 20;            
                text = "Contando com o que a Poly tem nas mãos, se ela\n ganhar mais [2 reais], com quanto ela fica?\n Cliquem no ratinho certo!";
        } else if(this.nivel == 2) {
                y = 28;
                text = "Se tirarmos [5 reais] do valor que Poly tem nas\n mãos, com quanto ela fica? ";
        } else {
                y = 28;
                text = "Se [dobrarmos] o valor que Poly tem em Reais, \ncom quanto ela fica? Acertem!";
        }
        var levelText = this.drawText(this.world.centerX, y, text, 22, "center");
        levelText.alpha = 0;
        this.addLevelGroup(levelText);
        this.add.tween(levelText).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
            //TOCA SOM DA PERGUNTA
            this.soundQuestion = this.setDebugAudio("P"+this.nivel);
            this.soundQuestion.onStop.add(function() {
                this.enableEventMouse();    
        }, this);
        },this);
    },*/

    addTextInSprite:function(texto, tint, scale, x, y, spriteFather) { 
        console.log("******addTextInSprite*****");
        var text = texto.toString(); 
        var newText =  this.add.bitmapText(0,0, "Luckiest", texto,100);
        newText.tint = tint;
        newText.scale.set(scale, scale);
        newText.x = -(spriteFather.width*0.5)+x;
        newText.y = -(spriteFather.height/2)+y;
        spriteFather.addChild(newText);
    },

    addText:function(texto, tint, scale, x, y, group) { 
        console.log("******addTextInSprite*****");
        var text = texto.toString(); 
        this.newText =  this.add.bitmapText(x,y, "Luckiest", texto,100);
        this.newText.tint = tint;
        this.newText.scale.set(scale, scale);
        this.newText.alpha = 0;
        group.add(this.newText);
        this.add.tween(this.newText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    randomIndexQuestion:function(arrayName){
        console.log("***randomIndexQuestion***");
        var sizeArray = arrayName.length;
        this.randomIndex = Math.floor(Math.random() * ((sizeArray - 1) - 0 + 1)) + 0;
        return this.randomIndex;
    },

     randomQuestion: function(arrayName) {
        console.log("******randomQuestion*****");
        this.index_question = this.randomIndexQuestion(arrayName);
        var ramdomQuestion = arrayName[this.index_question];
        return ramdomQuestion;
    },

    animBoomerang:function(sprite, x_avanco, y_avanco, x_final, y_final) {
        this.add.tween(sprite).to({x:x_avanco, y:y_avanco}, 800, "Quart.easeOut", true).onComplete.add(function() {
            this.add.tween(sprite).to({x:x_final, y:y_final}, 800, "Quart.easeOut", true);
        }, this);  
    },

    stopClickAnimation:function(elem, tempo) {
        this.createDelayTime(tempo, function() {
            elem.animations.stop();
            elem.alpha = 0;
        });
    },

    createArrayAnswers:function(respCerta) {
        //alternativas: 3 sementes clicáveis em sequência, sendo que além da correta,
        // as incorretas serão sempre o número apresentado +2.

        console.log("***createArrayAnswers*** ");
        var arrayAnswers = [respCerta];
        var contIndex = 0;
        
        for (var i = 2 - 1; i >= 0; i--) {
            arrayAnswers.push(arrayAnswers[contIndex] + 2);
            contIndex++;
        };
        
        //desordena o array pras alternativas não aparecerem sempre na mesma ordem
        arrayAnswers = arrayAnswers.sort(function() {return Math.random() - 0.5});
        console.log("Array das opções de respostas: " + arrayAnswers);
        return arrayAnswers;
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

    addIntroGroup:function(elem){
        this.groupIntro.add(elem);
    },

    addLevelGroup:function(elem){
        this.groupLevel[this.currentLevel].add(elem);    
    },

    checkGame:function(elem){
        console.log("***checkGame***");
        if(elem.name == this.certo){
            console.log("CORRETA");
                this.sound.play("hitAcerto");
                this.createDelayTime(200, function() {
                    this.clickRightButton();
                });
        } else { 
            console.log("ERRADA");
            this.sound.play("hitErro");
            if(this.lives <= 1) {
                this.createDelayTime(200, function() {
                    this.clickWrongButton(); 
                });   
            }  
            this.updateLivesText();
        }
    },

    resetLevel:function(nivel){
        console.log("***resetLevel***");
        this.add.tween(this.buttonsAnswer[0]).to({alpha:0}, 300, Phaser.Easing.Linear.None, true);
        this.add.tween(this.buttonsAnswer[1]).to({alpha:0}, 300, Phaser.Easing.Linear.None, true);
        this.add.tween(this.buttonsAnswer[2]).to({alpha:0}, 300, Phaser.Easing.Linear.None, true);
        this.add.tween(this.newText).to({alpha:0}, 300, Phaser.Easing.Linear.None, true);
        this.add.tween(this.colar).to({x:290, y:410}, 300, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.add.tween(this.colar).to({alpha:0}, 300, Phaser.Easing.Linear.None, true);
            this.createDelayTime(300, function() {
            this.add.tween(this.groupLevel[nivel]).to({alpha:0}, 500, Phaser.Easing.Linear.None, true, 500);
            if(this.groupLevel[nivel] != null) {
                this.groupLevel[nivel].removeAll(true);
            }
        }); 
        }, this);
    }
};

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


