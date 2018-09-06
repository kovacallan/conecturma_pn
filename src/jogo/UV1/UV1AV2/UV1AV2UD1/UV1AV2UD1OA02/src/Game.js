
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game
    this.add;       //  used to add sprites, text, groups, etc
    this.camera;    //  a reference to the game camera
    this.cache;     //  the game cache
    this.input;     //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;      //  for preloading assets
    this.math;      //  lots of useful common math operations
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage;     //  the game stage
    this.time;      //  the clock
    this.tweens;    //  the tween manager
    this.world;     //  the game world
    this.particles; //  the particle manager
    this.physics;   //  the physics manager
    this.rnd;       //  the repeatable random number generator


    

};

BasicGame.Game.prototype = {


    create: function () {

        /**************************** CONSTANTES GERAIS FIXAS ************************************************/
        this.TOTAL_LEVEL = 3;
        this.TIME_SOUND_IDLE = 11000;
        this.TEMPO_INTRO = 30000;
        this.TEMPO_ERRO2 = 14000;
        this.TEMPO_ERRO1 = 1000;
        this.TEMPO_RESUMO = 25000;
        this.SOUND_VITORIA = 5000;
        /**************************** CONSTANTES GERAIS FIXAS ************************************************/

        /**************************** CONSTANTES JOGO ATUAL ************************************************/
        this.LETTER_SPACING = 60;
        this.UNDERLINE_SPACING = 20;
        /**************************** CONSTANTES JOGO ATUAL ************************************************/

        /* FUTURO XML */
        this.corrects = 0;
        this.errors = 0;
        this.currentLevel = BasicGame.InitialLevel;
        this.listCorrects = [-1,-1,-1];
        this.listCompleted = [false,false,false];
        /* FUTURO XML */
        this.conclusaoEnviada = false;
        /* FUTURO XML */
        this.pointsByLevel = [0,200,300,500,500];

        this.lives = 2;
        this.points = 0;
        this.showCallToAction = false;

        this.nameShadows = [];
        this.nameTexts = [];
        
        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);
       
        //this.gradeGuia();
        this.createScene();
        this.showIntro();
      
        /* HUD */
        this.createBottomHud();
        this.createHud();
        //---- AV1AV2D1OA02 ---- //
        this.groupLevel = []; // salva tudo que compoe o nível 
		this.errou = false; // para a apresentacao show action
        this.initVar();
        this.resetRandomLetter();
        this.textGame();
        //---- AV1AV2D1OA02 ---- //
    },

    textGame:function(){

        this.texto = new Array();
        this.texto['initialText'] = "Agora temos que achar o arquivo\n comprimido em que estavam o [pai]\n [do Juninho] e os [seres folclóricos],\n mas pra isso, vamos ter que fuçar.";
        this.texto['initialText2'] ="Nesses arquivos aqui veremos algumas \npalavras que não condizem com a figura \nque está dentro dele.";
        this.texto['initialText3'] ="O arquivo só vai fechar novamente se \norganizarmos as letras dessa palavra \npra formarmos a palavra correta. \nViram? Vamos em frente! ";
        this.texto['imgResumo'] ="Com apenas [26 letras] conseguimos formar um \nmundo inteiro de palavras! Muitas delas são \nbem parecidas e usam exatamente as mesmas \nletras, como já vimos.";
        this.texto['imgResumo2'] ="Mas é impressionante o que uma reorganização \nde letras não faz. Uma coisa vira outra num \npiscar de olhos!";
 
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = [ null,
            "Neste primeiro arquivo só precisamos \nmudar as consoantes de lugar para \nformar a nova palavra. Vamos lá?",
            "Olhem só! Nesta palavra o que mudamos de \nlugar são só as vogais. Mão à obra!",
            "Mudou consoante e mudou vogal... olho na \nfigura pra deixar essa palavra certinha."
        ];
    },

    drawText: function(x,y,text, fontSize, align, lineHeight) {

        var _lineHeight = lineHeight || -2;
        var _align = align || "center";

        var textGroup = this.add.group();

        var _width = 0;

        var byLine = text.split("\n");

        var py = 0;

        for(var i = 0; i < byLine.length; i++) {

            var byColor = byLine[i].split(/(\[[^\]]+\])/gi);

            var px = 0;
            var textBase = this.add.sprite(0,0);

            for(var j = 0; j < byColor.length; j++) {
                
                var _color = 0xFBFBFB;
                var _text = byColor[j];
                if(byColor[j][0] == "[") {

                    _text = " " + byColor[j].replace(/[\[\]]/gi, "");
                    _color = 0xFFD200;

                } 

                var s = this.add.bitmapText(1+px,1+py, "lucky-32", _text.toUpperCase(), fontSize || 22);
                s.tint = 0x010101;

                var t = this.add.bitmapText(px,py, "lucky-32", _text.toUpperCase(), fontSize || 22);
                px += t.width;
                t.tint = _color;
                
                textBase.addChild(s);
                textBase.addChild(t);
            }
            textGroup.add(textBase);

            switch(_align) {
                case "left":
                    
                break;
                case "right":
                    textBase.x -= px;
                break;
                case "center":
                    textBase.x -= px*0.5;
                break;
            }

            py += textBase.height + _lineHeight;

            if(px > _width) {
                _width = px;
            }
        }

        textGroup.x = x;
        textGroup.y = y;

        switch(_align) {
            case "left":
                textGroup.x -= _width*0.5;
            break;
            case "right":
                textGroup.x += _width*0.5;
            break;
            case "center":
                
            break;
        }

        return textGroup;
    },


    initVar:function(){   
        this.tutorial = false; // para apresentacao do toturial
        this.posicaoLetrasX = [];// posicionamento em x das letras 
        this.posicaoLetrasY = 389; // posicao y para letras 
        this.palavra = []; // array com as palavras na ordem errada 
        this.letrasImg = []; 
        this.objeto = [];
        this.objetoImg =0;
        this.numObjeto = 0;
        this.marcaLugar = 0;
        this.marcaLugarX = 0;
        this.marcaLugarY = 0;
        this.posBocaOmebgaX = 0;
        this.posBocaOmebgaY = 0;
        this.marcaLugarLetras = [];
        this.posicao = [];
        this.marcaOcupada = false;
        this.letraTroca = '#';
        this.letraVazia = '#';
        this.letraMarca = '#';
        this.valorLetraMarca = '#';
        this.posicaoJogo = [];
        this.letraOcupada = [false,false,false,false,false,false];
        this.letraOcupadaX = [];
        this.letraOcupadaY = [];
        this.idDragIn = null;
        this.idDragOn = null;
    },

   
    clickRestart:function() {
        this.sound.stopAll();
        this.state.start('Game');
    },

    createBottomHud: function() {
        this.groupBottom = this.add.group();

        var bg = this.groupBottom.create(0, this.game.height, "hud", "hudBottom");
        bg.anchor.set(0,1);

        this.soundButton = this.add.button(80,this.world.height-60, "hud", this.switchSound, this, 'soundOn','soundOn','soundOn','soundOn', this.groupBottom);

        var sTool = this.add.sprite(3,-35, "hud", "soundText");
        sTool.alpha = 0;
        this.soundButton.addChild(sTool);
        this.soundButton.input.useHandCursor = true;

        this.soundButton.events.onInputOver.add(this.onOverItem, this);
        this.soundButton.events.onInputOut.add(this.onOutItem, this);

        var back = this.add.button(10,this.world.height-110, "hud", this.backButton, this, 'backButton','backButton','backButton', 'backButton', this.groupBottom);
        back.input.useHandCursor = true;

        var sTool = this.add.sprite(8,-40, "hud", "backText");
        sTool.alpha = 0;
        back.addChild(sTool);

        back.events.onInputOver.add(this.onOverItem, this);
        back.events.onInputOut.add(this.onOutItem, this);
    },
    onOverItem: function(elem) {
        elem.getChildAt(0).alpha = 1;
    },
    onOutItem: function(elem) {
        elem.getChildAt(0).alpha = 0;
    },

    backButton: function() {

        this.eventConclusao = new Phaser.Signal();
        this.eventConclusao.addOnce(function() {

            this.time.events.removeAll();
            this.tweens.removeAll();
            this.tweenBack();
            
        }, this);

        this.registrarConclusao();
    },
    tweenBack: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../UV" + BasicGame.UV + "AV" + BasicGame.AV + "UD" + BasicGame.UD + "MAPA/";
        }, this);
    },

    switchSound: function() {
        this.game.sound.mute = !this.game.sound.mute;
        var _frame = (this.game.sound.mute)? "soundOff" : "soundOn";
        this.soundButton.setFrames(_frame,_frame,_frame, _frame);
    },

    createHud: function() {

        this.add.sprite(0,0, "hud");

        this.livesTextShadow = this.add.bitmapText(111,36, "JandaManateeSolid", this.lives.toString(), 18);
        this.livesTextShadow.tint = 0x010101;
        this.livesText = this.add.bitmapText(110,35, "JandaManateeSolid", this.lives.toString(), 18);

        this.pointsTextShadow = this.add.bitmapText(51,102, "JandaManateeSolid", BasicGame.Pontuacao.moedas.toString(), 18);
        this.pointsTextShadow.tint = 0x010101;
        this.pointsText = this.add.bitmapText(50,101, "JandaManateeSolid", BasicGame.Pontuacao.moedas.toString(), 18);

        var _cVal = 0;// this.rnd.integerInRange(100,999);
        var coin = this.add.bitmapText(31,191, "JandaManateeSolid", BasicGame.Pontuacao.xp.toString(), 18);
        coin.tint = 0x010101;
        this.add.bitmapText(30,190, "JandaManateeSolid", BasicGame.Pontuacao.xp.toString(), 18);
    },

    /* -FINAL-    HUD E BOTOES */
    /*********************************************************************************************************************/


    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES AUXILIARES GAMEPLAY */

    openLevel: function() {
        if(this.currentLevel < 1 || this.currentLevel > 3) {
            return;
        }
        if(this.listCorrects[this.currentLevel-1] < 0) {
            this.listCorrects[this.currentLevel-1] = 0;
        }
    },

    saveCorrect: function(porc, completed) {
        if(this.currentLevel < 1 || this.currentLevel > 3) {
            return;
        }

        var _completed = (completed==undefined || completed)?true:false;
        var _porc = porc || 100;

        if(_porc > this.listCorrects[this.currentLevel-1]) {
            this.listCorrects[this.currentLevel-1] = _porc;
        }

        if(!this.listCompleted[this.currentLevel-1]) {
            this.listCompleted[this.currentLevel-1] = _completed;
        }

        console.log("saveCorrect", this.listCorrects, this.listCompleted );
    },
        
    //fixa
    createAnimation: function( x, y, name, scaleX, scaleY) { 
        var spr = this.add.sprite(x,y, name);
        spr.animations.add('idle', null, 18, true);
        spr.animations.play('idle');
        spr.scale.set( scaleX, scaleY);

        return spr;
    }, 

    //fixa
    onButtonOver: function(elem) {
        this.add.tween(elem.scale).to({x: 1.1, y: 1.1}, 100, Phaser.Easing.Linear.None, true);
    },
    //fixa
    onButtonOut: function(elem) {
        this.add.tween(elem.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.None, true);
    },

    createRandomItens: function(itens, num) {
        var _itens = [];

        for(var i = 0; i < num; i++) {
            var n = this.rnd.integerInRange(0, itens.length-1);
            _itens.push(itens[n]);
            itens.splice(n,1);
        }
        return _itens;
    },

    createDelayTime: function(time, callback) {

        this.add.tween(this).to({}, time, Phaser.Easing.Linear.None, true).onComplete.add(callback, this);
    },

    //---- AV1AV2D1OA01 ---- //
    getRandomUniqueItem: function(list, level) {

        //console.log("---getRandomUniqueItem---");
        var letters = this.getNonRepeatLetter(list, level); // FRE
        //console.log("--> letters "+letters);
        var n = this.rnd.integerInRange(0,letters.length-1);
        //console.log("--> n " + n);

        //console.log("---getRandomUniqueItem---");

        return letters[n];
    },
    getNonRepeatLetter: function(itens, num) {

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
        this.spliceLetter = [
            null,
            [],
            [],
            [],
            []
        ];
    },

    retirarArrayElemento:function(elem){
        var index = this.temp_array.indexOf(elem);
      
        for (i=index; i<this.temp_array.length-1; i++)
        {
            this.temp_array[i] = this.temp_array[i+1];
        }
        this.temp_array.pop();
    },

    changeOmegaHappy:function(){
        ////31, 256
        this.omega.loadTexture('omega_happy', 0);
        this.omega.x = 31;
        this.omega.y = 256;
        var anim  = this.omega.animations.add('omega_happy');
        
        anim.onComplete.add(function() {
            this.changeOmegaIdlle();
        }, this);
        anim.play(15);
    },

    changeOmegaIdlle:function(){
        this.omega.loadTexture('omega', 0);
        this.omega.x = 31;
        this.omega.y = 256;
        this.omega.animations.add('omega');
        this.omega.animations.play('omega', 15, true);
    },
  
    createLevel:function(){

        // validar somente quando a palavra estiver completa;
        // deixar guardar na marca uma letra por vez
        // se letra na marca vazio marcar # no lugar vazio;
        // testar a palvra no array objeto com numObjeto sorteado.
        
        //this.numObjeto = 0; // para sorteio 
        this.marcaLugarX = 871;
        this.marcaLugarY = 264;
        //var posX = this.marcaLugarX+(73/2);
        //var posY = this.marcaLugarY+(74/2);

        var posX = this.marcaLugarX+10;
        var posY = this.marcaLugarY+10;
        

        this.marcaLugar = this.add.sprite(posX,posY, "marca");
        this.marcaSombra = this.add.sprite(this.marcaLugarX,this.marcaLugarY, "marcaSombra");
        this.marcaLugar.alpha = 0;
        this.marcaSombra.alpha = 0;
        this.groupLevel[this.currentLevel].add(this.marcaLugar);
        this.groupLevel[this.currentLevel].add(this.marcaSombra);
        this.posicaoJogo.push(posX);
        this.posicaoJogo.push(posY);

        this.posBocaOmebgaX = 162;
        this.posBocaOmebgaY = 322;

        //this.objetoImg = this.add.sprite(576,169, "objetos",this.objeto[this.numObjetos]);

       
        this.createDelayTime(500, function() {

            //console.log("-----");
            //console.log(this.numObjeto);
            //console.log(this.objeto[this.numObjeto]);
            //console.log(this.palavra[this.numObjeto]);
            //console.log("-----");
            
            var obj = this.objeto[this.numObjeto].toString();
            this.objetoImg = this.add.sprite(160,300, "objetos",obj);
            this.groupLevel[this.currentLevel].add(this.objetoImg);
            this.objetoImg.scale.set(0.2,0.2);
            this.callEfeitoObjeto(this.objetoImg);


            for(var i=0; i<this.palavra[this.numObjeto].length;i++)
            {
                
                    this.changeOmegaHappy();
                    //posX = this.posicaoLetrasX[i]+(73/2);
                    //posY = this.posicaoLetrasY+(74/2);
                    posX = this.posicaoLetrasX[i]+10;
                    posY = this.posicaoLetrasY+10;
                    this.marcaLugarLetras[i] = this.add.sprite(posX,posY, "marca");
                    this.marcaLugarLetras[i].alpha = 0;
                    this.groupLevel[this.currentLevel].add(this.marcaLugarLetras[i]);   
                    this.letrasImg[i] = this.add.sprite(this.posBocaOmebgaX, this.posBocaOmebgaY, "letras",this.palavra[this.numObjeto][i]);
                    this.groupLevel[this.currentLevel].add(this.letrasImg[i]);
                    this.letrasImg[i].scale.set(0.2,0.2);
                    this.letrasImg[i].name = this.palavra[this.numObjeto][i];
                    this.letrasImg[i].id = i;
                    this.letrasImg[i].pos = i;
                    this.callEfeito(i,this.letrasImg[i]); 
                

                
            }
         }); // para o próximo nível
    },

    sorteio:function(){ 
        
        if(!this.tutorial)
        {
            var item = parseInt(this.getRandomUniqueItem(this.temp_array, 1));   
            this.retirarArrayElemento(item); 
            this.numObjeto = item;
        }else{
            this.numObjeto = 0;
        }

        console.log(this.numObjeto);
    },

    callEfeitoObjeto:function(spr){

       var auxX = 576;
       var auxY = 169;

       var distX = auxX - this.posBocaOmebgaX; // distancia entre o ponto da boca e ponto final 
       var iteracao = parseInt(distX /50); // quantidade de interaçoes no caminho
       var meio = distX /2; 
       var altura = 50; // altura em y 
       var posy = this.posBocaOmebgaY; 
       var passoX = []; 
       var passoY = []; 
       var passoEscala = [];
       

       //console.log(distX);
       //console.log(iteracao);

       var distScale  = 1 - 0.2;
       var fatorScale = iteracao/iteracao; 
       var escala = 0.2;
       
       for(var i=0; i<iteracao; i++)
       {

            if(iteracao==meio){posy+=altura;}
            else{posy-=altura;}
            escala+=fatorScale;

            if(i==0){
                passoX[i]=this.posBocaOmebgaX; 
                passoY[i]=this.posBocaOmebgaY;
                passoEscala[i]=0.2;
            } // primeria posicao 
            else if(i==iteracao-1){
                passoX[i]=auxX;
                passoY[i]=auxY;
                passoEscala[i]=1;
            } // segunda posicao 
            else{
                passoX[i] = distX+=50; 
                passoY[i] = posy;
                passoEscala[i]=escala;
            }

             this.add.tween(spr.scale).to({x:passoEscala[i], y:passoEscala[i]}, 1500, Phaser.Easing.Linear.None, true);
             
       }

       this.game.add.tween(spr)
        .to({
        y: [passoY[0],passoY[1],passoY[2],passoY[3],passoY[4],passoY[5],passoY[6],passoY[7]],
        x: [passoX[0],passoX[1],passoX[2],passoX[3],passoX[4],passoX[5],passoX[6],passoX[7]]
        }, 1000)
        .interpolation(Phaser.Math.bezierInterpolation)
        .start();//.onComplete.add(function() {this.efeitoNumeros2(spr);}, this);  */


       //console.log("************");
       //console.log(iteracao);
       //console.log(passoX);
       //console.log(passoY);
       //console.log("************");
    },
    
    callEfeito:function(it,spr){
       

        var dist =  this.posicaoLetrasX[0] - this.posBocaOmebgaX;
        var fator = Math.floor((Math.random() * 100) + 10);
        var pontoMedio  = this.posicaoLetrasX[0] + (dist/2)+ (it*fator);
        var altura  = this.posBocaOmebgaY - 200;

        this.add.tween(spr.scale).to({x:0.6, y:0.6}, 700, Phaser.Easing.Linear.None, true);
        this.add.tween(spr).to({x:pontoMedio, y:altura}, 700, Phaser.Easing.Linear.None, true).onComplete.add(function(){
            
            this.add.tween(spr.scale).to({x:1, y:1}, 700, Phaser.Easing.Linear.None, true);
            this.add.tween(spr).to({x:this.posicaoLetrasX[it], y:this.posicaoLetrasY}, 700, Phaser.Easing.Linear.None, true)
            .onComplete.add(function(){this.marcaSombra.alpha = 1;}, this);
        }, this);


        this.letrasImg[it].x=this.posicaoLetrasX[it];
        this.letrasImg[it].y=this.posicaoLetrasY;

        if(it == (this.palavra[this.numObjeto].length-1))
        {
            if(!this.tutorial)
            {
                this.inputMovableNumbers(1);
                
                this.habilitarFisica();
            }
            else{
                //this.marcaSombra.alpha = 1;
                this.createClick();
            }
        }     
    },

    
    inputMovableNumbers:function(tipo){
        if(tipo==1)
        {
            for(var i = 0; i < this.letrasImg.length; i++){ 
                this.groupLevel[this.currentLevel].add(this.letrasImg[i]);
                this.letrasImg[i].inputEnabled = true;
                this.letrasImg[i].input.enableDrag(false, true);
                this.letrasImg[i].events.onDragStart.add(this.onStartDragNumber, this);
                this.letrasImg[i].events.onDragStop.add(this.onStopDragNumber, this);
            }


        }
        if(tipo==2)
        {
            for(var i = 0; i < this.letrasImg.length; i++){ 
                this.groupLevel[this.currentLevel].add(this.letrasImg[i]);
                this.letrasImg[i].inputEnabled = false;
                if(!this.tutorial)
                {
                    this.letrasImg[i].input.reset();
                }    
            }

            if(this.tutorial)
            {
                this.groupLevel[this.currentLevel].add(this.arrow);
                this.groupLevel[this.currentLevel].add(this.click);
            }
        }

        //this.habilitarFisica();// habilitando a fisica no elemento 
    },

    onStartDragNumber: function(elem) {
        console.log(this.letraMarca +" <--> "+elem.name);
       if(this.letraMarca==elem.name)
       {
            this.marcaOcupada = false;
       }

       this.idDragIn = elem.id;
    },

    onStopDragNumber: function(elem, pointer) {

        console.log(" onStopDragNumber");
        var testeLetras  = this.testOverLap(elem);// testando overlap 

        console.log("LOG INI");
        //console.log("letras " +testeLetras);
        //console.log("Pos Jog " +this.posicaoJogo);
        console.log("Ocu Jog " +this.letraOcupada);
        //for(var i=0; i<this.letrasImg.length; i++)
        //{
            //console.log("id " + this.letrasImg[i].id);
            //console.log("pos " + this.letrasImg[i].pos);
        //}
        
        console.log("-----------");
        if(this.letraOcupada[this.letraVazia]=="#")
        {
            this.idDragOn = this.letrasImg[this.letraTroca].id;
            elem.x = this.letraOcupadaX[this.letraVazia];
            elem.y = this.letraOcupadaY[this.letraVazia];


            this.letraOcupada[this.letraVazia] = elem.name;
            this.letraOcupada[elem.id] = "#";
            this.letrasImg[this.letraTroca].id = this.letraVazia;
        }
        else{

            this.add.tween(elem).to({x:this.letraOcupadaX[elem.id],y:this.letraOcupadaY[elem.id]},100, Phaser.Easing.Linear.None, true,200).onComplete.add(function(){
                this.sound.play("hitErro");
            }, this);
        }
        
        console.log("LOG FIM");
        console.log("Ocu Jog " +this.letraOcupada);
        console.log("-----------");

        this.verifyCompleted();
    },

    habilitarFisica:function(){
        this.atualizarLetraOcupada();
        this.game.physics.enable(this.marcaLugar, Phaser.Physics.ARCADE);
        //console.log(this.marcaLugar);

        for(var i = 0; i<this.palavra[this.numObjeto]; i++)
        {
            this.game.physics.enable(this.letrasImg[i], Phaser.Physics.ARCADE);
            this.game.physics.enable(this.marcaLugarLetras[i], Phaser.Physics.ARCADE); 
        }
    },

    atualizarLetraOcupada:function(){
        for(var i=0; i<this.letraOcupada.length; i++)
        {
            if(i<this.palavra[this.numObjeto].length)
            {
                this.letraOcupada[i] = this.palavra[this.numObjeto][i];
                this.letraOcupadaX[i] = this.letrasImg[i].x;
                this.letraOcupadaY[i] = this.letrasImg[i].y;
            }
            else
            {
                if(i==5)
                {
                    this.letraOcupadaX[i] = this.marcaLugarX;
                    this.letraOcupadaY[i] = this.marcaLugarY;
                }
                else
                {
                    this.letraOcupadaX[i] = 0;
                    this.letraOcupadaY[i] = 0;
                }

                this.letraOcupada[i] = "#";
            }
        }

        console.log("***log***");
        console.log(this.letraOcupada);
        console.log(this.letraOcupadaY);
        console.log(this.letraOcupadaX);
    },

    testOverLap:function(elem){
        this.game.physics.enable(elem, Phaser.Physics.ARCADE);
        var resultado = false;
        for(var i = 0; i <this.marcaLugarLetras.length; i++){ 
            this.game.physics.enable(this.marcaLugarLetras[i], Phaser.Physics.ARCADE);
            if(this.game.physics.arcade.overlap(elem,this.marcaLugarLetras[i]))
            {    
                this.letraTroca = elem.pos;
                this.letraVazia = i;
                resultado = true;
            } 
        }

        if(!resultado)
        {
            if(this.game.physics.arcade.overlap(elem,this.marcaLugar))
            {
                this.letraTroca = elem.pos;
                this.letraVazia = 5;
                resultado = true;
            }
        }

        return resultado;
    },

    verifyCompleted: function() {
        var palavraTeste = "";
        for(var i=0; i<this.letraOcupada.length; i++)
        {
            if(i<this.palavra[this.numObjeto].length)
            {
                if(this.letraOcupada[i]== "#")
                {
                    return false;
                }
                else
                {
                    palavraTeste +=this.letraOcupada[i].toLowerCase(); 
                    if(i==(this.palavra[this.numObjeto].length-1))
                    {
                        if(palavraTeste==this.objeto[this.numObjeto])
                        {
                            console.log("CORRETO!");
                            this.inputMovableNumbers(2);
                            this.sound.play(this.objeto[this.numObjeto]);
                            this.createDelayTime(1300, function() {this.rightAnswer();});
                            return false;
                        }
                        else{
                            console.log("ERRADO!");
                            console.log("mesma: "+this.idDragOn+" "+this.idDragIn);
                            if(this.idDragOn==this.idDragIn){
                                this.inputMovableNumbers(2);
                                this.wrongAnswer();
                            }
                            
                            return false;
                        }
                    }
                } 
            }
        } 
    },

    resetLevel:function(nivelJogo){
        console.log('resetLevel');
        this.initVar();
        this.createDelayTime(500, function() {
             this.add.tween(this.groupLevel[nivelJogo]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
             
             if(this.groupLevel[nivelJogo] != null) {
                this.groupLevel[nivelJogo].removeAll(true);
             }
        }); 
        
       
    },

    
    createClick:function(){
        //this.createDelayTime(1000, function() {
            this.arrow = this.add.sprite(this.world.centerX-210,this.world.centerY+10, "arrow");
            this.arrow.anchor.set(0.5,0.5);
            
             // animação de click 
            this.click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
            this.click.animations.add('idle', null, 18, true);
			
			this.groupLevel[this.currentLevel].add(this.click);
			this.groupLevel[this.currentLevel].add(this.arrow);
			
           
            this.createDelayTime(9000, function() { this.efeitoClick(1);}, this);
          
    },

    animClick:function(proximo){   
       
        this.click.alpha = 1;
        this.click.x = this.arrow.x-35;
        this.click.y = this.arrow.y-35;

        this.click.animations.play('idle'); //remover click
        this.add.tween(this).to({},600, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            this.click.alpha = 0;
            //this.click.destroy(); 
            this.efeitoClick(proximo);
        }, this);
    },

    efeitoClick:function(tipo){
        switch(tipo)
        {
            case 1://a
                var  x  = 754+80;
                var  y  = 389+80;
                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.animClick(2);}, this);
            break;

            case 2://marca
                var posx = this.marcaLugarX;  
				var posy = this.marcaLugarY;

                var  x  = posx+50;
                var  y  = posy+0;
                
                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true);
                this.add.tween(this.letrasImg[3]).to({x:posx, y:posy}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.efeitoClick(3);}, this);
                
            break;

            case 3://s
                var  x  = 871+80;
                var  y  = 389+80;
                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.animClick(4);}, this);
            break;

            case 4://pos a
                var posx = 754;  
				var posy = 389;

                var  x  = posx+50;
                var  y  = posy+0;
                
                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true);
                this.add.tween(this.letrasImg[4]).to({x:posx, y:posy}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.efeitoClick(5);}, this);
                
            break;

            case 5: // marca
				var  x  = this.marcaLugarX+80;
                var  y  = this.marcaLugarY+80;
                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.animClick(6);}, this);
            break;
               
            break;

            case 6: // pos s
                var posx = 871;  
				var posy = 389;

                var  x  = posx+50;
                var  y  = posy+0;
                
                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true);
                this.add.tween(this.letrasImg[3]).to({x:posx, y:posy}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.showFinishedLiveTutorial();}, this);
                
            break;

        }
    },
    //----- FIM AV1AV2D1OA02 ---- //





    /* -FINAL-   FUNCOES AUXILIARES GAMEPLAY */
    /*********************************************************************************************************************/




    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES FIXAS TODOS JOGO */

    skipIntro: function() {
        this.tweens.removeAll();
        if(this.soundIntro != null) {
            this.soundIntro.stop();
        }
        if(this.tutorial)
        {
            this.resetLevel(this.currentLevel);
        }
        this.add.tween(this.groupIntro).to({y: -300}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
    },
    skipResumo: function() {
        this.tweens.removeAll();
        if(this.soundResumo != null) {
            this.soundResumo.stop();
        }
        this.add.tween(this.groupIntro).to({y: -300}, 500, Phaser.Easing.Linear.None, true);

        this.gameOverLose();
    },

    // intro-fixa
    showIntro: function() {
        this.groupIntro = this.add.group();

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.groupIntro.add(this.tutorialPlacar);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");

        this.tutorialPlacar.addChild(this.skipButton);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextoIntro, this);
    },

    // intro-fixa
    showKim: function() {
        var kim = this.createAnimation( this.world.centerX-320, 200, 'kimAntiga', 1,1);
        kim.alpha = 0;

        var rect = new Phaser.Rectangle(0, 0, 250, 40);
        kim.crop(rect);

        this.groupIntro.add(kim);

        this.add.tween(kim).to({y: 30, alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(rect).to({height: 210}, 500, Phaser.Easing.Linear.None, true);

        this.createDelayTime(10500, function() {
            this.add.tween(kim).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);
        });
    },

    // intro-fixa
    showTextoIntro: function() {

        this.tutorialText = this.drawText(this.world.centerX+60, 30, this.texto['initialText'], 22, "left");
        this.tutorialText.alpha = 0;

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.groupIntro.add(this.tutorialText);

        this.tutorialText2 = this.drawText(this.world.centerX, 30, this.texto['initialText2'], 22, "left");
        this.tutorialText2.alpha = 0;

        this.groupIntro.add(this.tutorialText2);

        this.tutorialText3 = this.drawText(this.world.centerX, 20, this.texto['initialText3'], 22, "left");
        this.tutorialText3.alpha = 0;

        this.groupIntro.add(this.tutorialText3);

        this.showKim();

        this.soundIntro = this.sound.play("soundIntro");

        this.createDelayTime(11000, function() {
            this.add.tween(this.tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.tutorial = true;
            this.add.tween(this.tutorialPlacar).to({y: -120}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showLiveTutorial, this);
            }, this);
            
        });
    },

    
    // resumo-fixa
    showResumo: function() {

        this.groupIntro = this.add.group();

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placarResumo');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.skipButton = this.add.button(230, 220, "hud", this.skipResumo, this,"skipButton","skipButton","skipButton","skipButton");
        this.tutorialPlacar.addChild(this.skipButton);

        this.groupIntro.add(this.tutorialPlacar);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextResumo, this);
    },

    // resumo-fixa
    hideResumo: function() {
        this.add.tween(this.tutorialPlacar).to({y: -300}, 500, Phaser.Easing.Linear.None, true);
        this.gameOverLose();
    },

    // pontuacao-fixa
    addPoints: function() {

        this.points += this.pointsByLevel[this.currentLevel];

        console.log("total de pontos: " + this.points);

        
        this.updatePointsText();

    },
    // pontuacao-fixa
    updatePointsText: function() {
        return;
        this.pointsTextShadow.text = this.points.toString();
        this.pointsTextShadow.x = 56 - 10;

        this.pointsText.setText(this.points.toString());
        this.pointsText.x = 55 - 10; // this.pointsText.width*0.5;
    },

    // vidas-fixa
    updateLivesText: function() {
        this.livesText.text = this.lives.toString();
        this.livesTextShadow.text = this.lives.toString();
    },

    // game over-fixa
    gameOverMacaco: function() {

        BasicGame.OfflineAPI.setCookieVictory();


        var bg = this.add.sprite(this.world.centerX, this.world.centerY, "backgroundWin");
        bg.anchor.set(0.5,0.5);
        bg.alpha = 0;

        var _animals = ["bumbaWin", "fredWin", "polyWin", "juniorWin"];


        var n = this.rnd.integerInRange(0, _animals.length-1);

        var pos = [510,550,520,525];

        var _name = _animals[n];


        var animal = this.createAnimation( this.world.centerX,pos[n], _name, 1,1);
        animal.animations.stop();
        animal.anchor.set(0.5,1);
        animal.alpha = 0;

        
        this.sound.play("soundFinal").onStop.add(function() {

            this.add.tween(bg).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(animal).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(function() {
                animal.animations.play('idle');

                this.showTextVictory();

                this.add.tween(animal).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 4000).onComplete.add(function(){
                        
                    this.eventConclusao = new Phaser.Signal();
                
                    this.eventConclusao.addOnce(this.showEndButtons, this);
                
                    
                
                    this.registrarConclusao();
                    
                },this);
            }, this);
        }, this);
    },

    registrarConclusao: function(forcedOnError) {
        if(this.conclusaoEnviada) {
            return;
        }
        this.conclusaoEnviada = true;

        var _this = this;

        var _hasError = true;
        for(var i = 0; i < this.listCorrects.length; i++) {
            if(this.listCorrects[i] >= 0) {
                _hasError = false;
            }
        }
        if(_hasError) {
            this.eventConclusao.dispatch();
            return;
        }

        if(BasicGame.isOnline) {
            BasicGame.OnlineAPI.registrarConclusao(this.listCorrects, this.listCompleted, function(data) {            
                if(_this.eventConclusao) {
                    _this.eventConclusao.dispatch(data);
                }
            }, function(error) {
                console.log(error)
            });
        } else {
            
            _this.eventConclusao.dispatch();
        }
    },

    showTextVictory: function() {

        var pos = [
            [513,368],
            [505,420],
            [530,407],
            [500,360],
            [525,405]
        ];
        var _angle = [1,1,0,1,1];

        var _curr = this.rnd.integerInRange(0,4);

        if(_curr == 1) {
            _curr = 2;
        }

        this.sound.play("soundVitoria" + (_curr+1));

        
        var animal = this.createAnimation( pos[_curr][0], pos[_curr][1], "textoVitoria" + (_curr+1), 1,1);
        animal.animations.stop();
        animal.anchor.set(0.5,0.5);
        animal.animations.play('idle', 18, false);
        
    },

    createEndButton: function(x,y,scale) {
        var b = this.add.sprite(x, y, "hudVitoria", "botaoVitoria");
        b.anchor.set(0.5,0.5);
        b.scale.set(0.2,0.2);
        b.scaleBase = scale;
        b.alpha = 0;
        b.inputEnabled = true;
        b.input.useHandCursor = true;
        b.events.onInputOver.add(this.onOverEndButton, this);
        b.events.onInputOut.add(this.onOutEndButton, this);

        return b;
    },

    showEndButtons: function(resposta) {
        
        var _moedas = (resposta != null) ? resposta.moedas : 0;
        var _xp = (resposta != null) ? resposta.xp : 0;
        var _medalhas = (resposta != null) ? resposta.medalhas : 0;

        console.log('-------------------------- ' +_medalhas);

        var light = this.add.sprite(-2000,50,"light");
        light.alpha = 1;
        /************************ b1 ******************************/
        var b1 = this.createEndButton(240, 150, 1);

        var i1 = this.add.sprite(0,-30,"hudVitoria", "vitoriaCoracao");
        i1.anchor.set(0.5,0.5);
        i1.alpha = 0;
        b1.addChild(i1);
        //this.add.tween(i1).to({alpha: 1, y: -40}, 900, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE);

        var t1 = this.add.bitmapText(0,0, "JandaManateeSolid", _xp.toString(), 40);
        t1.x = -t1.width*0.5;
        t1.y = -t1.height*0.3;
        b1.addChild(t1);

        var tt1 = this.add.sprite(0, -50, "hudVitoria", "vitoriaTextoBtn1");
        tt1.anchor.set(0.3,1);
        tt1.alpha = 0;
        b1.tooltip = tt1;
        b1.addChild(tt1);

        /************************ b2 ******************************/
        var b2 = this.createEndButton(100,150,1);

        var i2 = this.add.sprite(0,-27.5,"hudVitoria", "vitoriaGemasIcone");
        i2.anchor.set(0.5,0.5);
        i2.alpha = 0;
        b2.addChild(i2);

        var t2 = this.add.bitmapText(0,0, "JandaManateeSolid", _moedas.toString(), 40);
        t2.x = -t2.width*0.5;
        t2.y = -t2.height*0.3;
        b2.addChild(t2);

        var tt2 = this.add.sprite(0, -50, "hudVitoria", "vitoriaTextoBtn2");
        tt2.anchor.set(0.5,1);
        tt2.alpha = 0;
        b2.tooltip = tt2;
        b2.addChild(tt2);
        /************************ b4 ******************************/
        var b4 = this.createEndButton(900, 150, 0.65);
        b4.events.onInputUp.add(this.clickRestart, this);

        var i4 = this.add.sprite(0,0,"hudVitoria", "vitoriaRepetir");
        i4.anchor.set(0.5,0.5);
        b4.addChild(i4);

        var tt4 = this.add.sprite(0, -50, "hudVitoria", "vitoriaTextoBtn4");
        tt4.anchor.set(0.6,1);
        b4.addChild(tt4);
        tt4.alpha = 0;
        b4.tooltip = tt4;
        tt4.scale.set(1.4);

        this.add.tween(light).to({x:0}, 1100, Phaser.Easing.Linear.None, true, 1100);

        this.add.tween(b2).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 1100);
        this.add.tween(b2.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true, 1100);
        this.add.tween(i2).to({alpha:1}, 1000, Phaser.Easing.Linear.None, true, 1350);
        
        this.add.tween(b1).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 1100);
        this.add.tween(b1.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true, 1600);
        this.add.tween(i1).to({alpha:1}, 1000, Phaser.Easing.Linear.None, true, 1850);

        this.add.tween(b4).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 1100);
        this.add.tween(b4.scale).to({x:0.65,y:0.65}, 500, Phaser.Easing.Linear.None, true, 2200);

        
        /************************ Medalha ******************************/

        var light2 = this.add.sprite(-2000,340,"light");
        light2.alpha = 1;

        var eixoX = 25;
        var tempo = 2700;
        if(_medalhas != 0){ 
            var textMedalha = this.add.bitmapText(-200,280, "JandaManateeSolidRed", "MEDALHAS", 30);
            this.add.tween(textMedalha).to({x:45}, 500, Phaser.Easing.Linear.None, true, 2300);
            for(var i = 0; i < _medalhas.length; i++){
                if(i > 0){
                    var medalha = this.add.sprite(eixoX += 200,360,"medalha"+_medalhas[i]);
                    medalha.alpha = 0
                    medalha.scale.set(0);
                    
                    this.add.tween(medalha).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, tempo=tempo + 250);
                    this.add.tween(medalha.scale).to({x:0.5,y:0.5}, 500, Phaser.Easing.Linear.None, true, tempo=tempo + 500);     
                }
                else{
                    var medalha = this.add.sprite(eixoX,360,"medalha"+_medalhas[i]);
                    medalha.alpha = 0;
                    medalha.scale.set(0);

                    this.add.tween(medalha).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, tempo - 250);
                    this.add.tween(medalha.scale).to({x:0.5,y:0.5}, 500, Phaser.Easing.Linear.None, true, tempo);       
                }
            }
            this.add.tween(light2).to({x:0}, 250, Phaser.Easing.Linear.None, true, 2600);
            this.createDelayTime(8000, this.tweenBack);
        }
        else{
           this.createDelayTime(5000, this.tweenBack); 
        }
    },
    

    onOverEndButton: function(elem) {
        var sc = elem.scaleBase * 1.1;
        this.add.tween(elem.scale).to({x: sc, y: sc}, 150, Phaser.Easing.Linear.None, true);
        this.add.tween(elem.tooltip).to({alpha: 1}, 150, Phaser.Easing.Linear.None, true);
    },
    onOutEndButton: function(elem) {
        var sc = elem.scaleBase;
        this.add.tween(elem.scale).to({x: sc, y: sc}, 150, Phaser.Easing.Linear.None, true);
        this.add.tween(elem.tooltip).to({alpha: 0}, 150, Phaser.Easing.Linear.None, true);
    },

    // level-fixa
    initGame: function() {
        this.tutorial = false;
        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }

        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
    },

    // botoes auxiliar-fixa
    clearButtons: function(clearCorrect) {

        for(var i = 0; i < this.buttons.length; i++) {
            if(clearCorrect) {
                if(this.buttons[i].isCorrect == undefined || !this.buttons[i].isCorrect) {
                    this.add.tween(this.buttons[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(elem) {
                        elem.destroy();
                    });
                }
            } else {
                this.add.tween(this.buttons[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(elem) {
                    elem.destroy();
                });
            }
        }
    },

    // level-fixa
    gotoNextLevel: function() {   
        this.corrects++;
        this.saveCorrect();
        this.currentLevel++;
        this.hideAndShowLevel(false);
    },

    // fixa
    hideLevel: function(callback) {
        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        if(callback != null) {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
        } else {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500);
        }
    },

    // fixa
    hideAndShowLevel: function(isWrong) {

        this.hideLevel(function() {

            if(this.currentLevel <= this.TOTAL_LEVEL && this.corrects <= 2) {
                if(isWrong) {

                    this.createDelayTime( this.TEMPO_ERRO1, function() {
                        this.showCallToAction = true;
                        this.showNextLevel();
                    });

                } else {
                    
                    this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
        
                }
            } else {
                this.gameOverMacaco();
            }
        });
    },

    gameOverLose: function() {

        this.eventConclusao = new Phaser.Signal();
        this.eventConclusao.addOnce(this.tweenBack, this);

        this.registrarConclusao();
    },

    /* -FINAL-   FUNCOES FIXAS TODOS JOGOS */
    /*********************************************************************************************************************/



    /*********************************************************************************************************************/
    

    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished

        this.add.sprite( -466, -517, 'background');
        this.createAnimation( 7, 12, 'capsulas', 1,1);

        this.omega = this.add.sprite( 31, 256, 'omega',1);
        this.omega.animations.add('omega');
        this.omega.animations.play('omega', 15, true);
        //this.initGame();   
    },

    // tutorial demonstracao - inicio
    showLiveTutorial: function() {

        this.createTutorial();
    },

    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {

        
        // remover tudo
        this.createDelayTime(1000, function() {

            this.add.tween(this.arrow).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.resetLevel(this.currentLevel);
            this.add.tween(this.tutorialText3).to({alpha: 0},500, Phaser.Easing.Linear.None, true).onComplete.add(
                function(){
                     this.add.tween(this.tutorialPlacar).to({y: -300}, 2000, Phaser.Easing.Linear.None, true, 1500).onComplete.add(this.initGame, this);   
                }
                , this);
        });
    },

    // resumo inicial
    showTextResumo: function() {
        var tutorialText = this.drawText(this.world.centerX, 50, this.texto['imgResumo'], 22, "left");
        tutorialText.alpha = 0;
        

        this.groupIntro.add(tutorialText);
		
		var tutorialText2 = this.drawText(this.world.centerX, 50, this.texto['imgResumo2'], 22, "left");
        tutorialText2.alpha = 0;
    
        this.groupIntro.add(tutorialText2);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.sound.play("soundResumo");

        // tempo para mostrar o tutorial das letras
        this.createDelayTime( 14100, function() {

            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText2).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);

        });
		
		this.createDelayTime( this.TEMPO_RESUMO, function() {

            this.add.tween(tutorialText2).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);

        });
    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();

        
        switch(this.currentLevel) {
            case 1:
                if(!this.showCallToAction) {
                    this.sound.play("soundP1");
                }
                this.initLevel1();
            break;
            case 2:
                if(!this.showCallToAction) {
                    this.sound.play("soundP2");
                }
                this.initLevel2();
            break;
            case 3:
                if(!this.showCallToAction) {
                    this.sound.play("soundP3");
                }
                this.initLevel3();
            break;
        }
        this.showCallToAction = false;
    },

    showQuestion: function(num) {
        this.imageQuestion = this.drawText(this.world.centerX, 30, this.questionList[num]);
        this.imageQuestion.alpha = 0;

        if(this.showCallToAction) {
            return;
        }
        
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },


    createTutorial: function() {

        console.log("tutorial");

        this.createDelayTime(7000, function() {
            this.add.tween(this.tutorialText2).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                this.add.tween(this.tutorialText3).to({alpha: 1},100, Phaser.Easing.Linear.None, true);
            }, this);
        });
        
        this.groupLevel[this.currentLevel] = this.add.group();
        this.posicaoLetrasX =[393,515,635,754,871];
        
        this.posicaoLetrasY = 389;
        this.temp_array = [0,1,2];
        this.palavra =new Array(['B','O','L','A','S'])                      
        this.objeto = new Array(["bolsa"])
        this.sorteio();
		this.createDelayTime(100, function() {
                this.createLevel();
            }
        ); 
    },


    initLevel1: function() {
        
        console.log(" nivel 1");
        
        this.groupLevel[this.currentLevel] = this.add.group();
        //this.posicaoLetrasX =[393,515,635,754,871];
        this.posicaoLetrasX =[515,635,754,871];
        this.posicaoLetrasY = 389;
        this.temp_array = [0,1,2];
        this.palavra =new Array(['S','A','C','A'],
                                ['T','A','P','A'],
                                ['T','A','L','A'])                      
        this.objeto = new Array(["casa"],
                                ["pata"],
                                ["lata"])
        this.sorteio();

        var delay = 0;
		
        if(this.errou)
        {
			delay = 10;
            this.errou = false;
        }
        else{  
			delay = 10000;
			this.showQuestion(1);
        }
        this.createDelayTime(delay, function() {
                this.createLevel();
            }
        ); 
    },

    initLevel2: function() {

        console.log(" nivel 2");
        this.groupLevel[this.currentLevel] = this.add.group();
        //this.posicaoLetrasX =[393,515,635,754,871];
        this.posicaoLetrasX =[515,635,754,871];
        this.posicaoLetrasY = 389;
        this.temp_array = [0,1,2];
        this.palavra =new Array(['S','O','P','A'],
                                ['R','O','T','A'],
                                ['B','A','C','O'])                      
        this.objeto = new Array(["sapo"],
                                ["rato"],
                                ["boca"])
        this.sorteio();

        var delay = 0;
        
        if(this.errou)
        {
            delay = 10;
            this.errou = false;
        }
        else{  
            delay = 8000;
            this.showQuestion(2);
        }
        this.createDelayTime(delay, function() {
                this.createLevel();
            }
        ); 
       
        
    },

    initLevel3: function() {
        console.log(" nivel 3");
        //console.log(" nivel 2");
        this.groupLevel[this.currentLevel] = this.add.group();
        //this.posicaoLetrasX =[393,515,635,754,871];
        this.posicaoLetrasX =[515,635,754,871];
        this.posicaoLetrasY = 389;
        this.temp_array = [0,1,2];
        this.palavra =new Array(['B','O','L','A','S'],
                                ['C','O','P','A','M'],
                                ['C','A','O','S'])                      
        this.objeto = new Array(["bolsa"],
                                ["campo"],
                                ["saco"])
        this.sorteio();
        //this.numObjeto=2;
        if(this.numObjeto==2)
        {
            
            this.posicaoLetrasX =[515,635,754,871];
        }
        else
        {
            this.posicaoLetrasX =[393,515,635,754,871];
        }

        var delay = 0;
        
        if(this.errou)
        {
            delay = 10;
            this.errou = false;
        }
        else{  
            delay = 8000;
            this.showQuestion(3);
        }
        this.createDelayTime(delay, function() {
                this.createLevel();
            }
        ); 
       
    },

    rightAnswer: function() { 
        console.log("rightAnswer - 10 ");
        this.sound.play("hitAcerto");
        
        this.qtdErros = 0;
        this.addPoints();
        var nivel=this.currentLevel;
        this.resetLevel(nivel);
        this.createDelayTime(500, function() {this.gotoNextLevel();}); // para o próximo nível
    },
    
    showDica:function(){
        if(this.dica){this.somDica = this.sound.play("soundDica");}
    },

    wrongAnswer: function() { 
        console.log("wrongAnswer - 11 ");
        this.sound.play("hitErro");
        
        var nivel=this.currentLevel;
        this.errou = true;
        
        if(this.currentLevel > 1) 
        {
            this.currentLevel--;
        }
        this.lives--;
        this.errors--;
    
        switch(this.lives) {
            case 1: // mostra dica 1
                this.resetLevel(nivel);
                this.hideLevel(function(){});
                this.createDelayTime(1500, function() {  
                    this.dica = true;  
                    this.showDica();
                });
                
                this.createDelayTime(6800, function() {    
                    this.dica = false;
                    this.createDelayTime(100, function() {this.hideAndShowLevel(true);}); // para o próximo nível
                }); // para o próximo nível 
            break;
            case 0: // toca som de resumo
                this.resetLevel(nivel);
                this.lives = 0;
                this.hideLevel(function(){});
                if(!this.dica){this.showResumo();}          
            break;
            default: // game over
            break;
        }
        this.updateLivesText(); 
    },

    

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

    update: function () {



    }
};
