

BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator


    

};

BasicGame.Game.prototype = {


	create: function () {

        /**************************** CONSTANTES GERAIS FIXAS ************************************************/
        this.TOTAL_LEVEL = 3;
        this.TIME_SOUND_IDLE = 11000;
        this.TEMPO_INTRO = 27000;
        this.TEMPO_ERRO2 = 14000;
        this.TEMPO_ERRO1 = 1000;
        this.TEMPO_RESUMO = 25000;
        this.SOUND_VITORIA = 3500;
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
        //var x = this.addSpriteMeu('numeros',100,500,1);
        this.createScene();
        this.showIntro();
        /* HUD */
        this.createBottomHud();
        this.createHud();


        //---- AV1AV2D1OA01 ---- //
        this.groupLevel = [];
        this.numerosLevel = 0;
        this.numerosSoretados = 0; 
        this.arrayNumeros = [];
        this.arrayNumerosImg = [];
        this.arrayNumerosSorteados=[];
        this.arrayNumerosMarca = [];
        this.movableNumbers = [];
        this.countNum = 0;
        this.validar = [];
        this.numAcertos = 0;
        this.elemLugar = false;
        this.levelCol = 0;
        this.movableNumbersX = [];
        this.movableNumbersY = [];
        this.resetRandomLetter();
        this.errou = false;
        this.subLevel = 1;
        this.tutorial = false;
        this.textGame();

        //---- AV1AV2D1OA01 ---- //
	},


    textGame:function(){

        this.texto = new Array();
        this.texto['initialText'] = "A Conecturma está voltando para \n casa. Para isso Ômega está liberando \n [vários arquivos] do computador, ";
        this.texto['initialText2'] = "usando um painel numérico. Mas os números\n estão vivos, e insistem em pular fora do painel.\n Temos que colocar os números sapecas de volta\n ao lugar! Olhe para o [painel] e guarde bem o \n lugar de cada um!! ";
        this.texto['imgResumo'] ="Já conhecemos os números [até 20]. Agora vamos\n conhecer os números [até 50]. Observem bem o \n painel, é fácil, os números estão arrumados de \n [10 em 10]! O número 21, por exemplo, é o 20, que \n perdeu o 0 e juntou com o 1.";
         
        // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
        this.questionList = [ null,
            "Vamos levar os números de volta ao seu lugar!",
            "",
            ""
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
            py += 30 + _lineHeight;

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
        var n = this.rnd.integerInRange(this.levelCol,letters.length-1);
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

    changePolyHappy:function(){
        ////console.log('fred!!!');
        this.poly.loadTexture('poly_happy', 0);
        this.poly.x = 18;
        this.poly.y = 398;
        var anim  = this.poly.animations.add('poly_happy');
        
        anim.onComplete.add(function() {
            this.changePolyIdlle();
        }, this);
        anim.play(15);
    },

    changePolyIdlle:function(){
        this.poly.loadTexture('poly', 0);
        this.poly.x = 18;
        this.poly.y = 398;
        this.poly.animations.add('poly');
        this.poly.animations.play('poly', 15, true);
    },

    changeBumbaHappy:function(){
        ////console.log('fred!!!');
        this.bumba.loadTexture('bumba_happy', 0);
        this.bumba.x = 848;
        this.bumba.y = 407;
        var anim  = this.bumba.animations.add('bumba_happy');
        
        anim.onComplete.add(function() {
            this.changeBumbaIdlle();
        }, this);
        anim.play(15);
    },

    changeBumbaIdlle:function(){
        this.bumba.loadTexture('bumba', 0);
        this.bumba.x = 848;
        this.bumba.y = 407;
        this.bumba.animations.add('bumba');
        this.bumba.animations.play('bumba', 15, true);
    },

    changeJuninhoHappy:function(){
        ////console.log('fred!!!');
        this.juninho.loadTexture('juninho_happy', 0);
        this.juninho.x = 805;
        this.juninho.y = 347;
        var anim  = this.juninho.animations.add('juninho_happy');
        
        anim.onComplete.add(function() {
            this.changeJuninhoIdlle();
        }, this);
        anim.play(15);
    },

    changeJuninhoIdlle:function(){
        this.juninho.loadTexture('juninho', 0);
        this.juninho.x = 805;
        this.juninho.y = 347;
        this.juninho.animations.add('juninho');
        this.juninho.animations.play('juninho', 15, true);
    },

    createLevel:function(){

        this.area = 650/this.numerosSoretados; // para divisao de posicionamento 
        this.posX = 219; // x da posicao inicial 
        this.posY = 540; // y de posicionamento 

        this.levelPanel = this.game.add.sprite(-685,243,'imgPainel');
        this.add.tween(this.levelPanel).to({x:127, y: 243}, 500, Phaser.Easing.Linear.None, true);//.onComplete.add(this.showFinishedLiveTutorial, this);
        this.groupLevel[this.currentLevel].add(this.levelPanel);

        this.levelGrade = this.game.add.sprite(-600,257,'imgGrade');
        this.add.tween(this.levelGrade).to({x:213, y: 257}, 500, Phaser.Easing.Linear.None, true);//.onComplete.add(this.showFinishedLiveTutorial, this);
        this.groupLevel[this.currentLevel].add(this.levelGrade);

        this.levelGradeNum = this.game.add.sprite(-600,270,'imgGradeNum');
        this.add.tween(this.levelGradeNum).to({x:213, y: 270}, 500, Phaser.Easing.Linear.None, true);//.onComplete.add(this.showFinishedLiveTutorial, this);
        this.groupLevel[this.currentLevel].add(this.levelGradeNum);

        this.groupNumeros = this.add.group();
        var imgX = -600;
        var auxX= 212;
        var auxY= 257;
		var quebra = 10;
        this.posicionamentoX = [];
        this.posicionamentoY = [];

        // desenhar os numeros na placa 
		
		if(this.levelCol==1){auxY= 257;imgX= -600;auxX= 212;quebra = 10;}
		if(this.levelCol==20){auxY= 309;imgX= -600+(52*9);auxX= 212+(52*9);quebra = 1;}
		if(this.levelCol==30){auxY= 359;imgX= -600+(52*9);auxX= 212+(52*9);quebra = 1;}

        var count = 0;
        for(var i=this.levelCol; i<=this.numerosLevel; i++)
        {
            if(count==quebra)
            {
                auxY +=52;
                if(this.levelCol==1){imgX= -600;}
				if(this.levelCol==20){imgX= -600;quebra=10;}
				if(this.levelCol==30){imgX= -600;quebra=10;}
                auxX= 212;
                count = 0;
            }

            this.arrayNumerosImg[i] = this.game.add.sprite(imgX,auxY,'numeros',i);
            this.arrayNumerosImg[i].name = i;
            this.arrayNumeros[i] = i;
            this.groupNumeros.add(this.arrayNumerosImg[i]);

            imgX +=52;
            
            this.posicionamentoX[i] = auxX;
            this.posicionamentoY[i] = auxY;

            auxX +=52;

            count++;
            
        }
        this.temp_array =  this.arrayNumeros.slice();
        this.add.tween(this.groupNumeros).to({x:812}, 700, Phaser.Easing.Linear.None, true).onComplete.add(this.sorteio, this);
        this.groupLevel[this.currentLevel].add(this.groupNumeros);     
		
		//this.gradeGuia();
        //var x = this.addSpriteMeu('numeros',100,500,1);
    },

    sorteio:function(){
        this.itensVazios = [];
        
        if(!this.tutorial)
        {
            for(var i=0; i<this.numerosSoretados; i++){
                var item = parseInt(this.getRandomUniqueItem(this.temp_array, 1));
                ////console.log(item);
                this.retirarArrayElemento(item); 
                this.itensVazios.push(item);
            }
        }else{
            this.itensVazios =[5,3,8];
        }
    
        this.callEfeito();
    },

    callEfeito:function(){
       console.log(this.itensVazios);
       
       for(var i=0; i<this.itensVazios.length; i++){
            var  x  = this.posicionamentoX[this.itensVazios[i]];
            var  y  = this.arrayNumerosImg[this.itensVazios[i]].y;
            var nome = this.arrayNumerosImg[this.itensVazios[i]].name;

            //console.log(this.posicionamentoX[this.itensVazios[i]].x +" <<->> "+this.arrayNumerosImg[this.itensVazios[i]].y);
            sprM = this.game.add.sprite(x,y,'numeros',0);
            this.groupLevel[this.currentLevel].add(sprM);

            this.arrayNumerosMarca[i] = this.game.add.sprite(x+17,y+18,'marca');
            this.arrayNumerosMarca[i].name = nome;
			this.groupLevel[this.currentLevel].add(this.arrayNumerosMarca[i]);

            this.spr = this.game.add.sprite(x,y,'numeros',nome);
			if(this.tutorial)
			{
				this.groupLevel[this.currentLevel].add(this.spr);
			}
			
            this.spr.name = nome;
            this.arrayNumerosImg[this.itensVazios[i]].destroy();
            this.efeitoNumeros(this.spr);
			


       } 
    },

    efeitoNumeros:function(spr){
        var xMedio = 430;
       

        this.fatorX = 0;
        this.fatory = 0;
		console.log(spr.x +" - "+ xMedio);
        if(spr.x > xMedio)
        {
            console.log("esquerda");
            this.fatorX = +15;
        }
        else
        {
            console.log("direita");
            this.fatorX = -15;
        }

        //console.log("Passo 1 ");
        this.fatorY = -17;
        
        var passo1X=[];
        var passo1Y=[];

        var xRef = spr.x;
        var yRef = spr.y;

        for(var i=0; i<=4; i++)
        {
            xRef+=this.fatorX;
            yRef+=this.fatorY;
            passo1X[i] = xRef;
            passo1Y[i] = yRef;
        }
        //console.log(spr.x +" <-> "+spr.y);
        //console.log(passo1X);
        //console.log(passo1Y);

        this.game.add.tween(spr)
        .to({
            y: [passo1Y[0],passo1Y[1], passo1Y[2], passo1Y[3],passo1Y[4]],
            x: [passo1X[0],passo1X[1], passo1X[2], passo1X[3],passo1X[4]]
        }, 500)
        .interpolation(Phaser.Math.bezierInterpolation)
        .start().onComplete.add(function() {this.efeitoNumeros2(spr);}, this);  
    },

    efeitoNumeros2:function(spr){
        this.fatorY = +17;

        var passo2X=[];
        var passo2Y=[];

        var xRef = spr.x;
        var yRef = spr.y;

        for(var i=0; i<=4; i++)
        {
            xRef+=this.fatorX;
            yRef+=this.fatorY;
            passo2X[i] = xRef;
            passo2Y[i] = yRef;
        }

        //console.log("Passo 2 ");
        //console.log(spr.x +" -> "+spr.y);
        //console.log(passo2X);
        //console.log(passo2Y);

        this.game.add.tween(spr)
        .to({
            y: [passo2Y[0],passo2Y[1], passo2Y[2], passo2Y[3],passo2Y[4]],
            x: [passo2X[0],passo2X[1], passo2X[2], passo2X[3],passo2X[4]]
        }, 500)
        .interpolation(Phaser.Math.bezierInterpolation)
        .start().onComplete.add(function() {this.posicionamentoNumero(spr);}, this); 
    },

    posicionamentoNumero:function(spr){
        this.add.tween(spr).to({x:this.posX, y:this.posY}, 500, Phaser.Easing.Linear.None, true);//.onComplete.add(this.showFinishedLiveTutorial, this);
        this.movableNumbers.push(spr);
        this.movableNumbersX[spr.name] = this.posX;
        this.movableNumbersY[spr.name] = this.posY;
        this.validar[spr.name] = false;
        this.groupLevel[this.currentLevel].add(spr);
        
        this.posX += this.area;
        this.countNum++; 

        if(!this.tutorial){
            if(this.countNum==this.numerosSoretados)
            {
                 this.liberarNivel();
            }
        }
        else
        {
            if(this.countNum==this.numerosSoretados)
            {
                this.liberarNivel();
                this.createClick();

            }
        }
        
    },

    inputMovableNumbers:function(tipo){
        if(tipo==1)
        {
            for(var i = 0; i < this.movableNumbers.length; i++){ 
                this.groupLevel[this.currentLevel].add(this.movableNumbers[i]);
                this.movableNumbers[i].inputEnabled = true;
                this.movableNumbers[i].input.enableDrag(false, true);
                this.movableNumbers[i].events.onDragStart.add(this.onStartDragNumber, this);
                this.movableNumbers[i].events.onDragStop.add(this.onStopDragNumber, this);
            }
        }
        if(tipo==2)
        {
            for(var i = 0; i < this.movableNumbers.length; i++){ 
                this.groupLevel[this.currentLevel].add(this.movableNumbers[i]);
                this.movableNumbers[i].inputEnabled = false;
                if(!this.tutorial)
                {
                    this.movableNumbers[i].input.reset();
                }
                
            }
        }
    },

    onStartDragNumber: function(elem) {
        
        //console.log(elem);
        this.world.bringToTop(elem);
        this.initialDragPoint = new Phaser.Point(elem.x,elem.y);
        //console.log("inicial ponto x -> "+elem.x);
        //console.log("inicial ponto y -> "+elem.y);     
    },

    onStopDragNumber: function(elem, pointer) {
        //console.log(elem);
        this.game.physics.arcade.enable(elem); // habilitando a fisica no elemento 
        this.habilitarFisica(); // habilitar fisica nos elementos vazios 
        this.testOverLap(elem);// testando overlap 

        // para voltar ao seu lugar caso colocado em qualquer lugar do cenário 
        if(this.elemLugar!=elem.name)
        {
            var x =this.movableNumbersX[elem.name];
            var y =this.movableNumbersY[elem.name];

            //console.log("Possicionamento OnStop ");
            //console.log(elem.x+" -> "+elem.y);
            //console.log(x+" -> "+y);

            //console.log();
            this.add.tween(elem).to({x:x,y:y},100, Phaser.Easing.Linear.None, true,200).onComplete.add(function() {
               this.sound.play("hitErro");
            }, this); 
        }

        this.elemLugar=false;
    },

    habilitarFisica:function()
    {
        ////console.log(this.validar);

        for(var i = 0; i <this.numerosSoretados; i++)
        {
            var nome = this.arrayNumerosMarca[i].name;
            if(!this.validar[nome])
            {
                //console.log(" fisica --> "+ nome);
                this.game.physics.enable(this.arrayNumerosMarca[i], Phaser.Physics.ARCADE);
            }
            else
            {
                //console.log(" não fisica --> "+ nome);
            }
        }
    },

    testOverLap:function(elem)
    {
        for(var i = 0; i <this.arrayNumerosMarca.length; i++){

            var nome = this.arrayNumerosMarca[i].name;
            //console.log(" comparacao --> "+elem.name +" == "+ nome);
    
            var x1 = this.arrayNumerosMarca[i].x-17;  
            var y1 = this.arrayNumerosMarca[i].y-18;
           

            if ((!this.validar[nome]) && (this.game.physics.arcade.overlap (elem,this.arrayNumerosMarca[i])) ) {
                //console.log("---- overlap ---");
                //console.log(elem.name);
                if(elem.name==nome)
                {
                    //console.log("no lugar");
                    if(this.numAcertos!=0)
                    {
                        //console.log(elem.name);
                        
                        this.validar[elem.name] = true;
                        this.elemLugar = elem.name;
                        this.numAcertos--;
                        elem.x=x1;
                        elem.y=y1;
                        elem.inputEnabled = false;
                        elem.input.reset();
                        this.sound.play("hitAcerto");
                        //console.log("certo "+this.validar[elem.name]);
                        
                        this.verifyCompleted();


                    }
                    return; 
                }
                else
                {
                    if(!this.validar[elem.name])
                    {
                        //console.log("errado");

                        var x =this.movableNumbersX[elem.name];
                        var y =this.movableNumbersY[elem.name];

                        this.add.tween(elem).to({x:x,y:y},100, Phaser.Easing.Linear.None, true,200).onComplete.add(function() {
                            
                            this.sound.play("hitErro");
                            
                            if(this.numErros==0)
                            {
                                this.elemLugar = elem.name;
                                elem.inputEnabled = false;
                                elem.input.reset();
                                this.inputMovableNumbers(2);
                                this.wrongAnswer();
                            }
                            if(this.numErros>0)
                            {
                                this.numErros--;
                            }
                            
                        
                        }, this);
                    }
                    return; 
                    
                }

                //console.log("---- fim overlap ---");
            } 


        }
    },

    verifyCompleted: function() {
        if(this.numAcertos <= 0) {       
            this.createDelayTime(100, function() {
                this.changePolyHappy();
                this.changeJuninhoHappy();
                this.changeBumbaHappy();
                this.rightAnswer();
            });
            
        } else {
          
            //this.stopSfx();
            //console.log("need more " + this.numAcertos);
        }
    },

    resetLevel:function(nivelJogo){
        this.numerosLevel = 0;
        this.numerosSoretados = 0; 
        this.arrayNumeros = [];
        this.arrayNumerosImg = [];
        this.arrayNumerosSorteados=[];
        this.arrayNumerosMarca = [];
        this.movableNumbers = [];
        this.countNum = 0;
        this.validar = [];
        this.numAcertos = 0;
        this.elemLugar = false;
        this.levelCol = 0;
        this.movableNumbersX = [];
        this.movableNumbersY = [];
        this.resetRandomLetter();

        if(nivelJogo!=0)
        {
            //console.log("nivel "+nivelJogo);
            this.createDelayTime(500, function() {
                 this.add.tween(this.groupLevel[nivelJogo]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
                 
                 if(this.groupLevel[this.nivel] != null) {
                    this.groupLevel[this.nivel].removeAll(true);
                 }
            }); 
        }
        
        this.nivel =0;
    },

    liberarNivel:function(){
        //console.log("***liberarNivel***");
        //console.log(this.countNum);
        //if(this.countNum==this.numerosSoretados)
        //{
            var delay = 0;

            if(this.currentLevel==1 && !this.errou)
            {
                delay = 700;
            }
            else
            {
                delay = 500;
            }
            this.createDelayTime(delay, function() {
              //console.log(this.validar);
              if(!this.tutorial){this.inputMovableNumbers(1);}
              else{

                this.inputMovableNumbers(2);

              }
              
            
            });
        //}
    },

    createClick:function(){
        //this.createDelayTime(1000, function() {
            this.arrow = this.add.sprite(500-210,310, "arrow");
            this.arrow.anchor.set(0.5,0.5);
            
             // animação de click 
            this.click = this.add.sprite(this.arrow.x-35, this.arrow.y-35, "clickAnimation");
            this.click.animations.add('idle', null, 18, true);


            if(this.tutorial)
            {
                this.groupLevel[this.currentLevel].add(this.arrow);
                this.groupLevel[this.currentLevel].add(this.click);
            }
           
            this.createDelayTime(9000, function() { this.efeitoClick(1);}, this);     
    },

    animClick:function(proximo){   
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
            case 1:
                var  x  = this.movableNumbersX["3"]+40;
                var  y  = this.movableNumbersY["3"]+40;
                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.efeitoClick(2);}, this);
            break;

            case 2:
                var posx = this.arrayNumerosMarca[1].x-17;  
                var posy = this.arrayNumerosMarca[1].y-18;

                var  x  = posx+50;
                var  y  = posy+0;
                
                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true);
                this.add.tween(this.movableNumbers[1]).to({x:posx, y:posy}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.efeitoClick(3);}, this);
                
            break;

            case 3:
                var  x  = this.movableNumbersX["5"]+40;
                var  y  = this.movableNumbersY["5"]+40;
                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.efeitoClick(4);}, this);
            break;

            case 4:
                var posx = this.arrayNumerosMarca[0].x-17;  
                var posy = this.arrayNumerosMarca[0].y-18;

                var  x  = posx+50;
                var  y  = posy+0;
                
                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true);
                this.add.tween(this.movableNumbers[0]).to({x:posx, y:posy}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.efeitoClick(5);}, this);
            break;

            case 5:
                var  x  = this.movableNumbersX["8"]+40;
                var  y  = this.movableNumbersY["8"]+40;
                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.efeitoClick(6);}, this);
            break;

            case 6:
                var posx = this.arrayNumerosMarca[2].x-17;  
                var posy = this.arrayNumerosMarca[2].y-18;

                var  x  = posx+50;
                var  y  = posy+0;
                
                this.add.tween(this.arrow).to({x:x, y:y}, 1200, Phaser.Easing.Linear.None, true);
                this.add.tween(this.movableNumbers[2]).to({x:posx, y:posy}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){this.showFinishedLiveTutorial();}, this);
            break;

        }
    },
    //----- FIM AV1AV2D1OA01 ---- //





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
            this.tutorial = false;
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

        this.tutorialPlacar = this.add.sprite( 500, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.groupIntro.add(this.tutorialPlacar);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");

        this.tutorialPlacar.addChild(this.skipButton);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextoIntro, this);
    },

    showKim: function(delay) {
        var kim = this.add.sprite(this.world.centerX-320, 0, 'kim');

        var fIntro = Phaser.Animation.generateFrameNames("kim_", 0, 14, "", 3);
        var fLoop = Phaser.Animation.generateFrameNames("kim_", 15, 84, "", 3);

        kim.animations.add('intro', fIntro, 18, false);
        kim.animations.add('loop', fLoop, 18, true);

        kim.animations.play('intro').onComplete.add(function() {

            kim.animations.play('loop');
        }, this);

        this.groupIntro.add(kim);

        this.createDelayTime( delay || this.TEMPO_INTRO, function() {
            this.add.tween(kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });

        return kim;
    },

    // intro-fixa
    showTextoIntro: function() {
        console.log("showTextoIntro");
        this.tutorialText = this.drawText(560, 30, this.texto['initialText'], 22, "left");
        this.tutorialText.alpha = 0;
        this.groupIntro.add(this.tutorialText);

        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);

        this.tutorialText2 = this.drawText(500, 30, this.texto['initialText2'], 22, "center");
        this.tutorialText2.alpha = 0;
        this.groupIntro.add(this.tutorialText2);

        this.showKim(8000);

        this.soundIntro = this.sound.play("soundIntro");
        //this.tutorial = true;
        this.createDelayTime(8000, function() {
            this.add.tween(this.tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                //if(this.tutorial){
                    //this.tutorial = false;
                    this.showLiveTutorial();
                //nivelJogo}
            },this);
        });
    },

    
    // resumo-fixa
    showResumo: function() {

        this.groupIntro = this.add.group();

        this.tutorialPlacar = this.add.sprite( 500, -300, 'placarResumo');
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

        this.placar = this.add.sprite( 500, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        this.add.tween(this.placar).to({y: -175}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
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

        console.log("*** gotoNextLevel ***");    
        if(this.currentLevel==3 && this.subLevel==1)
        {
            //console.log("*** gotoNextLevel if 1 ***");  
            this.currentLevel=3;
            this.subLevel=2;
            this.saveCorrect(50,false);
        }
        else
        {
            //console.log("*** gotoNextLevel else ***");  
            this.corrects++;
            this.saveCorrect();
            this.currentLevel++;
        }

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
    hideAndShowLevel: function() {
        console.log("*** hideAndShowLevel***");
        console.log(this.showCallToAction);
        this.hideLevel(function() {

            if(this.currentLevel <= 3 && this.corrects <= 2) {
                if(!this.showCallToAction)
                {
                    this.add.tween(this.placar).to({y: -175}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                }
                else
                {
                    this.showNextLevel();
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
    /* -INICIO-   FUNCOES ESPEFICIAS JOGO ATUAL */
    limparNomes: function() {

        for(var i = 0; i < this.nameShadows.length; i++) {
            this.nameShadows[i].destroy();            
            this.nameTexts[i].destroy();            
        }

        this.nameShadows = [];
        this.nameTexts = [];
        this.groupName = this.add.group();
    },

    showName: function(name) {

        var Ypos = 10;

        this.limparNomes();

        for(var i = 0; i < name.length; i++) {

            var px = 500 - name.length*25 + i*this.LETTER_SPACING;

            //px = (name[i] == "_")? px + 10 : px;
            var py = (name[i] == "_") ? this.UNDERLINE_SPACING : 0;

            this.addLetter(px,py, name[i]);
        }

        //this.nameShadow.x = this.world.centerX - this.nameShadow.width*0.5+4;
        //this.nameText.x = this.world.centerX - this.nameText.width*0.5;
    },
    addLetter: function(x,y, letter) {


        var shadow = this.add.bitmapText(x+4,y+4, "JandaManateeSolid", letter, 75);
        shadow.tint = 0x010101;

        var name = this.add.bitmapText(x,y, "JandaManateeSolid", letter, 75);

        shadow.x = x+4-shadow.width*0.5;
        name.x = x-name.width*0.5;

        this.nameShadows.push(shadow);
        this.nameTexts.push(name);

        this.groupName.add(shadow);
        this.groupName.add(name);

        return [name,shadow];
    },

    removeButtonAction: function() {
        this.correctItem.input.useHandCursor = false;
        this.game.canvas.style.cursor = "default";
        this.correctItem.input.reset();
        
        this.correctItem.inputEnabled = false;
        this.correctItem.onInputOver.removeAll();
        this.correctItem.onInputOut.removeAll();
        this.correctItem.onInputUp.removeAll();

        console.log(this.correctItem);
        for(var i = 1; i < this.spliceLetter.length; i++) {
            //this.spliceLetter.push(this.correctItem._frameName);
        }
    }, 

    showCorrectName: function(gotoNext) {

        var itens = [];

        this.removeButtonAction();

        console.log(this.correctItem);
        var _extra = (this.correctItem._frameName == "medalha")? 35 : 0;

        var t = this.add.tween(this.correctItem)
                    .to({x:50 + this.corrects*200, y: 250}, 1300, Phaser.Easing.Linear.None)
                    .to({y: 290+_extra}, 200, Phaser.Easing.Quadratic.In);
        t.start();
        
        if(gotoNext) {
            this.createDelayTime( 2000, this.gotoNextLevel);
        }
    },

    clickEffect: function(target) {
        if(target.letter != null) {
            target.letter.alpha = 0.7;
        }
    },

    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished

        this.add.sprite( -400, -128, 'background');
        this.background_anim = this.add.sprite(66, 18, 'capsulas');
        this.animBackground(this.background_anim);

        this.poly = this.add.sprite( 18, 398, 'poly',1);
        this.poly.animations.add('poly');
        this.poly.animations.play('poly', 15, true);

        this.juninho = this.add.sprite( 805, 347, 'juninho',1);
        this.juninho.animations.add('juninho');
        this.juninho.animations.play('juninho', 15, true);

        this.bumba = this.add.sprite( 848, 407, 'bumba',1);
        this.bumba.animations.add('bumba');
        this.bumba.animations.play('bumba', 15, true);
    },

    animBackground:function(elem) {
        this.add.tween(this.background_anim).to({x: elem.x + 10, y: elem.y + 3}, 1000, Phaser.Easing.Quadratic.InOut, true, 0, Infinity, true);
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
            this.add.tween(this.tutorialText2).to({alpha: 0},500, Phaser.Easing.Linear.None, true).onComplete.add(
                function(){
                     this.add.tween(this.tutorialPlacar).to({y: -300}, 500, Phaser.Easing.Linear.None, true, 1500).onComplete.add(this.initGame, this);   
                }
                , this);
        });
    },

    // resumo inicial
    showTextResumo: function() {
        //this.world.centerX
        var tutorialText = this.drawText(500, 30, this.texto['imgResumo'], 22, "left");
        tutorialText.alpha = 0;
        
        this.groupIntro.add(tutorialText);

        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);

        this.soundResumo = this.sound.play("soundResumo");

        // tempo para mostrar o tutorial das letras
        this.createDelayTime( this.TEMPO_RESUMO, function() {
            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
        });
    },

    showNextLevel: function() {
        this.animBackground(this.background_anim);
        this.openLevel();
        
        console.log("*** showNextLevel ***");
        console.log(this.showCallToAction);
        switch(this.currentLevel) {
            case 1:
                
                if(this.showCallToAction) {
                    this.initLevel1();
                } else {
                    this.showQuestion(1);
                    this.sound.play("soundP1").onStop.add(this.initLevel1, this);
                }
            break;
            case 2:
                if(this.showCallToAction) {
                    this.initLevel2();
                } else {
                    this.showQuestion(1);
                    this.sound.play("soundP1").onStop.add(this.initLevel2, this);
                }
            break;
            case 3:
                
                if(this.showCallToAction) {
                this.initLevel3();
                } else {
                    this.showQuestion(1);
                    this.sound.play("soundP1").onStop.add(this.initLevel3, this);
                }
            break;
        }
        this.showCallToAction = false;
    },

    showQuestion: function(num) {
        //this.world.centerX

        this.imageQuestion = this.drawText(500, 30, this.questionList[num]);

        this.imageQuestion.alpha = 0;


        if(this.showCallToAction) {
            return;
        }
        
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },


    createTutorial: function() {

        console.log("tutorial");
        
        this.groupLevel[this.currentLevel] = this.add.group();
        this.tutorial = true;
        this.numerosLevel = 10;  // quantidade de numeros  por nivel 
        this.numerosSoretados = 3; // quanticadade de numeros soreteados por numeros 
        this.numAcertos = 3; // numero de acertos no nível
        this.numErros = 1;
        this.levelCol = 1; // que inicia a sequencia
        this.createLevel();      
    },


    initLevel1: function() {
        console.log(" nivel 1");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.numerosLevel = 10;  // quantidade de numeros  por nivel 
        this.numerosSoretados = 3; // quanticadade de numeros soreteados por numeros 
        this.numAcertos = 3; // numero de acertos no nível
        this.numErros = 1;
        this.levelCol = 1; // que inicia a sequencia
        this.createLevel();      
    },

    initLevel2: function() {
        console.log(" nivel 2");
        this.groupLevel[this.currentLevel] = this.add.group();
        this.numerosLevel = 30;  // quantidade de numeros  por nivel 
        this.numerosSoretados = 4; // quanticadade de numeros soreteados por numeros 
        this.numAcertos = 4; // numero de acertos no nível
        this.numErros = 1;
        this.levelCol = 20; // que inicia a sequencia
        this.createLevel();
    },

    initLevel3: function() {

        console.log(" nivel 3");
        if(this.subLevel==1)
        {
            console.log(" nivel 3 -- sub 1");

            this.groupLevel[this.currentLevel] = this.add.group();
            this.numerosLevel = 40;  // quantidade de numeros  por nivel 
            this.numerosSoretados = 5; // quanticadade de numeros soreteados por numeros 
            this.numAcertos = 5; // numero de acertos no nível
            this.numErros = 2;
            this.levelCol = 20; // que inicia a sequencia
            this.createLevel();

        }

        if(this.subLevel==2)
        {
            console.log(" nivel 3 -- sub 2");

            this.groupLevel[this.currentLevel] = this.add.group();
            this.numerosLevel = 50;  // quantidade de numeros  por nivel 
            this.numerosSoretados = 5; // quanticadade de numeros soreteados por numeros 
            this.numAcertos = 5; // numero de acertos no nível
            this.numErros = 2;
            this.levelCol = 30; // que inicia a sequencia
            this.createLevel();

        }
    },

    rightAnswer: function() { 
        console.log("rightAnswer - 10 ");
        this.showCallToAction = false;
        this.inputMovableNumbers(2);
        this.qtdErros = 0;
        
        this.addPoints();
        var nivel=this.currentLevel;
        this.resetLevel(nivel);
        this.createDelayTime(500, function() {this.gotoNextLevel();}); // para o próximo nível
    },
    
    showDica:function()
    {
        if(this.dica){this.somDica = this.sound.play("soundDica");}
    },

    wrongAnswer: function() { 
        console.log("wrongAnswer - 11 ");
        this.showCallToAction = true;
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
                this.createDelayTime(1000, function() {  
                    this.dica = true;  
                    this.showDica();
                });
                
                this.createDelayTime(1000, function() {    
                    this.dica = false;
                    this.createDelayTime(500, function() {this.hideAndShowLevel(true);}); // para o próximo nível
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
