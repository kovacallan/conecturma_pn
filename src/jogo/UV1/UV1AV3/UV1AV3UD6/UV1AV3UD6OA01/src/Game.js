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

        this.TEMPO_INTRO = 23900;
        this.ENABLE_CALL_TO_ACTION = true;
        this.ENABLE_PLACAR = true; // para desabilitar o placar 

        // quantidade de perguntas que tem em cada nivel
        // 2 acertos em cada rodada para passar para a próxima
        this.totalLevel1 = 1;
        this.totalLevel2 = 1;
        this.totalLevel3 = 1;

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
        this.groupLevel = [null,1,2,3];

        this.dinheiro_poly = [null, [5, 10, 20],[10, 15, 20],[1.50, 2, 2.50]];
        this.resultados_certos = [null, [7, 12, 22],[5, 10, 15], [3, 4, 5]];
        /*****************************************************************/

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
        var t1 = "Neste jogo vamos conhecer a [família]\n [Ratori]! Eles são bem famosos por juntar\n bastante dinheiro e fazer contas como\n ninguém! Sabem economizar e gastar sem\n desperdício! Vamos mostrar para eles que\n também somos super espertos? Basta\n fazermos as continhas e pronto!";
        var tutorialText = this.drawText(this.world.centerX+60, 10, t1, 20, "left");
        tutorialText.alpha = 0;
        this.groupIntro.add(tutorialText);
        
        //ADICIONA KIM
        var kim = this.showKim(this.TEMPO_INTRO);

        //TEXTO 0 APARECE E INICIA O ÁUDIO DA INTRO 
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.soundIntro = this.setDebugAudio("soundIntro");
        }, this);

        this.createDelayTime(this.TEMPO_INTRO, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {
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

        //**************************CENARIO***************************
        //this.background = this.addSpriteMeu('background',-393,-342);
        this.background = this.add.sprite(-393,-342, 'background');

        //this.livro = this.addSpriteMeu('livro',-26,436);
        this.livro = this.add.sprite(-26,436, 'livro');

        //this.guria = this.addSpriteMeu("guria_keep_alive", 76,199);
        this.guria = this.add.sprite(76,199, "guria_keep_alive", 0);
        this.guria.scale.set(0.5, 0.5);
        var anim = this.guria.animations.add('anim_guria', null, 18, true);
        anim.play('anim_guria');
        
    },

    stopClickAnimation:function(elem, tempo) {
        this.createDelayTime(tempo, function() {
            elem.animations.stop();
            elem.alpha = 0;
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

        this.add.tween(this.tutorialPlacar).to({y: -130}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextResumo, this);
    },

    /**
    *
    * Função que mostra o texto do resumo.
    * Ao final chama a função global que esconde o resumo
    * 
    **/
    showTextResumo: function() {

        
        var t1 = "Já fizemos várias contas de [somar e diminuir]… \na diferença aqui é que estamos fazendo com \n[dinheiro]! Vamos lá, vai ser legal!";
        var tutorialText = this.drawText(this.world.centerX, 20, t1, 22, "center");
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
                this.initLevel(1);
            break;
            case 2:
                this.showQuestion(2);
                this.initLevel(2);
            break;
            case 3:
                this.showQuestion(3);
                this.initLevel(3);
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
    
           
    initLevel: function(level) {

        console.log("***initLevel***");
        this.groupRatos = this.add.group();
        this.groupLevel[this.currentLevel] = this.add.group();
        this.num_erros = 0;
    
        this.nivel = level;

        this.certo = this.randomQuestion(this.resultados_certos[level]);
        console.log("Resposta certa: " + this.certo);
        var index = this.index_question;
        var dinheiro = this.dinheiro_poly[level][index];
        this.indexRespostaCerta = index;

        //CRIA ARRAY DE ALTERNATIVAS DE RESPOSTAS
        this.arrayAnswers = this.createArrayAnswers(this.certo);

        //DESCE PLACA, MOSTRA LEGENDA E TOCA SOUNDQUESTION E ENABLE CLICK NO FIM DO AUDIO
        this.showTutorialPlacar(this.groupLevel[this.currentLevel]);

        this.createDelayTime(1500, function() {
            this.quadro = this.add.sprite(168,401, 'quadro');
            this.quadro.alpha = 0;
            this.addLevelGroup(this.quadro);
            var position = this.ajustaX(dinheiro);
            this.addTextInSprite(dinheiro.toString(), 0xFFFFFF, 0.7, position[0], position[1], this.quadro);
            this.addTextInSprite(" reais", 0xFFFFFF, 0.4, position[2], position[3], this.quadro);
            this.add.tween(this.quadro).to({alpha:1}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.quadro.scale).to({x:1.2, y:1.2}, 200, Phaser.Easing.Linear.None).onComplete.add(function() {
                 this.add.tween(this.quadro.scale).to({x:1, y:1}, 200, Phaser.Easing.Linear.None, true);
            }, this);
            
            this.createDelayTime(1000, function() {
                var position = [];
                this.rato = [];
                this.rato[0] = this.add.sprite(361,246, "rato_1"); 
                this.rato[0].animations.add('anim_rato_1', null, 18, false);
                this.rato[0].animations.play('anim_rato_1');
                this.rato[0].name = this.arrayAnswers[0];
                this.groupRatos.add(this.rato[0]);
                
                this.rato[1] = this.add.sprite(544,321, "rato_2");
                this.rato[1].animations.add('anim_rato_2', null, 18, false);
                this.rato[1].animations.play('anim_rato_2');
                this.rato[1].name = this.arrayAnswers[1];
                this.groupRatos.add(this.rato[1]);
               
                this.rato[2] = this.add.sprite(738,253, "rato_3");
                this.rato[2].animations.add('anim_rato_3', null, 18, false);
                this.groupRatos.add(this.rato[2]);
                this.rato[2].name = this.arrayAnswers[2];
                this.rato[2].animations.play('anim_rato_3').onComplete.add(function() {
                   
                    position = this.ajustaPosition(1, this.arrayAnswers[0]);
                    this.addText(this.arrayAnswers[0].toString(), 0x336633, 0.4, position[0], position[1], this.groupLevel[this.currentLevel]);

                    position = this.ajustaPosition(2, this.arrayAnswers[1]);
                    this.addText(this.arrayAnswers[1].toString(), 0x336633, 0.4, position[0], position[1], this.groupLevel[this.currentLevel]);

                    position = this.ajustaPosition(3, this.arrayAnswers[2]);
                    this.addText(this.arrayAnswers[2].toString(), 0x336633, 0.4, position[0], position[1], this.groupLevel[this.currentLevel]);
                }, this);
                });
        }, this);
    
    this.addLevelGroup(this.groupRatos);
    
    },

    ajustaPosition:function(rato, num) {
        var position = [];
        if(rato == 1) {
            if(num >= 10) {
                position = [462, 358];
            } else {
                position = [470, 358];
            }
        } else if(rato == 2) {
            if(num >= 10) {
                position = [641 ,443];
            } else {
                position = [651 ,443];
            }
        } else if(rato == 3){
            if(num >= 10) {
                position = [841, 390];
            } else {
                position = [848, 390];
            }
        }

        return position;
    },

    ajustaX:function(dinheiro) {
        var position = [];
        if(dinheiro >= 10) {
            position = [140, 105, 213, 130];
        } else {
            if(dinheiro == 2.5 || dinheiro == 1.5) {
                position = [136, 105, 216, 130];
            } else {
                position = [160, 105, 194, 130];
            }
        }
        return position;
    },

    changeHappy:function(elem, anim,anim2,x,y,x1,y1){
        elem.loadTexture(anim, 0);
        elem.x = x;
        elem.y = y;
        var anim  = elem.animations.add(anim);
        anim.onComplete.add(function() {
            this.changeNormal(elem,anim2,x1,y1);
        }, this);
        anim.play(18, false);
    },

    changeNormal:function(elem,anim,x,y){
        elem.loadTexture(anim, 0);
        elem.x = x;
        elem.y = y;
        elem.animations.add(anim);
        elem.animations.play(anim, 18, true);
    },

    enableEventMouse:function(){
        console.log("***enableEventMouse***");
        tam = this.rato.length;
        for(i=0; i<tam; i++){  
            console.log("button "+i);   
            this.rato[i].click = true;    
            this.rato[i].inputEnabled = true;
            this.rato[i].input.useHandCursor = true;
            this.rato[i].events.onInputDown.add(this.mouseInputDown, this); 
        }
    },

    disableEventMouse:function(){
        console.log("***disableEventMouse***");
        tam = this.rato.length;
        for(i=0; i<tam; i++){         
            this.rato[i].inputEnabled = false;
            this.rato[i].input.useHandCursor = false;
            this.rato[i].input.reset();
        }
    },

    mouseInputDown:function(elem){ // elem = elemento que foi clicado
        console.log("***mouseInputDown***");
        if(elem.click){
            this.disableEventMouse();
            elem.click = false;
            this.createDelayTime(500, function() {
                this.checkGame(elem, this.nivel);
            });    
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
        
        //CONTROLE DE NÍVEL
        if(this.nivel == 2) {
            this.nivel--;
        } else if(this.nivel == 3) {
            this.nivel--;
        }

        this.resetLevel(this.currentLevel);
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
                    this.hideLevel(function() {
                        this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
                    });
                }); 
            

            break;
            case 0: 
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

    },

    //____________________________ funcoes do jogo ____________________________________________________________________________________
    showTutorialPlacar:function(group) { 
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
    },

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
        var newText =  this.add.bitmapText(x,y, "Luckiest", texto,100);
        newText.tint = tint;
        newText.scale.set(scale, scale);
        newText.alpha = 0;
        group.add(newText);
        this.add.tween(newText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
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

    createArrayAnswers:function(respCerta) {
        console.log("***createArrayAnswers*** ");
        //resp erradas sempre +1 ou +2 ou -1 ou -2;
        var arrayAnswers = [respCerta];
        var op_valor_conta = [[1,2], [1,2]];
        var op_tipo_conta = [0,1];
        //sorteia o tipo de conta.cada conta tem seu array. retira numero do array de acordo com n da conta
        var randomTipo = this.randomQuestion(op_tipo_conta);
        var indexTemp = this.index_question;
        var randomNumero = this.randomQuestion(op_valor_conta[indexTemp]);
        op_valor_conta[indexTemp].splice(this.index_question, 1);
        
        for (var i = 2 - 1; i >= 0; i--) {
            console.log("Num. random pra conta: " + randomNumero);
            console.log("Tipo random pra conta (0 - subtrai/ 1 - soma): " + randomTipo);

            if(randomTipo == 0) {
                arrayAnswers.push(respCerta - randomNumero);
            } else {
                arrayAnswers.push(respCerta + randomNumero);
            }
            
            randomTipo = this.randomQuestion(op_tipo_conta);
            randomNumero = this.randomQuestion(op_valor_conta[this.index_question]);
            op_valor_conta[indexTemp].splice(this.index_question, 1);
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

    checkGame:function(elem, level){
        console.log("***checkGame***");
        if(elem.name==this.resultados_certos[level][this.indexRespostaCerta]){
            this.changeHappy(this.guria, "guria_happy","guria_keep_alive", 75, 190, 76, 199);  
            console.log("CORRETA");
                this.sound.play("hitAcerto");
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

        this.createDelayTime(300, function() { 
            if(this.groupLevel[nivel] != null) {
                this.groupLevel[nivel].removeAll(true);
            }
        }); 
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