
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

        this.createScene();

        this.currentUnidade = 1;

        console.log("MAX maxAventuras", BasicGame.maxAventuras);
        //BasicGame.maxUnidades = 2;

        this.unlocked = true;

        this.unidade = this.add.sprite( this.world.centerX, this.world.centerY, "unidade" + this.currentUnidade );

        this.unidade.anchor.set(0.5,0.5);

        if(BasicGame.maxAventuras >= this.currentUnidade) {
            this.unidade.inputEnabled = true;
            this.unidade.input.useHandCursor = true;
            this.unidade.events.onInputUp.add(this.goToAdventure, this);
        } else {
            this.unidade.inputEnabled = false;
            this.unidade.alpha = 0.5;
        }

        this.buttonLeft = this.add.button(70, this.world.centerY, "buttonLeft", this.onClickLeft, this, 0,0,0,0);
        this.buttonLeft.anchor.set(0.5,0.5);
        this.buttonLeft.inputEnabled = true;
        this.buttonLeft.input.useHandCursor = true;

        this.buttonRight = this.add.button(this.game.width-70, this.world.centerY, "buttonRight", this.onClickRight, this, 0,0,0,0);
        this.buttonRight.anchor.set(0.5,0.5);
        this.buttonRight.inputEnabled = true;
        this.buttonRight.input.useHandCursor = true;

        this.verifyButtons(); 
	},

    verifyButtons: function() {

        console.log(this.currentUnidade);
        
        this.buttonLeft.inputEnabled = (this.currentUnidade != 1);
        this.buttonLeft.alpha = (this.currentUnidade == 1) ? 0 : 1;
        this.buttonLeft.input.useHandCursor = (this.currentUnidade != 1);
        
        this.buttonRight.inputEnabled = (this.currentUnidade != BasicGame.maxAventuras);
        this.buttonRight.alpha = (this.currentUnidade == BasicGame.maxAventuras) ? 0 : 1;
        this.buttonRight.input.useHandCursor = (this.currentUnidade != BasicGame.maxAventuras);
    },

    goToAdventure: function() {
        location.href = "../../UV1/UV1AV" + this.currentUnidade + "/UV1AV" + this.currentUnidade + "MAPA/";
    },

    onClickLeft: function() {
        this.currentUnidade--;

        var right = this.add.sprite(-this.world.centerX, this.world.centerY, "unidade" + this.currentUnidade);
        right.anchor.set(0.5,0.5);
        console.log(BasicGame.maxAventuras, this.currentUnidade);
        if(BasicGame.maxAventuras >= this.currentUnidade) {
            right.inputEnabled = true;
            right.input.useHandCursor = true;
            right.events.onInputUp.add(this.goToAdventure, this);
        } else {
            right.inputEnabled = false;
            right.alpha = 0.5;
        }

        this.add.tween(this.unidade).to({x: this.game.width+this.world.centerX}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(right).to({x: this.world.centerX}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {

            this.unidade.destroy();
            this.unidade = right;

        }, this);

        this.verifyButtons();
        
    },

    onClickRight: function() {
        this.currentUnidade++;

        var right = this.add.sprite(this.game.width+this.world.centerX, this.world.centerY, "unidade" + this.currentUnidade);
        right.anchor.set(0.5,0.5);
        console.log(BasicGame.maxAventuras, this.currentUnidade);
        if(BasicGame.maxAventuras >= this.currentUnidade) {
            right.inputEnabled = true;
            right.input.useHandCursor = true;
            right.events.onInputUp.add(this.goToAdventure, this);
        } else {
            right.inputEnabled = false;
            right.alpha = 0.5;
        }

        this.add.tween(this.unidade).to({x: -this.world.centerX}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(right).to({x: this.world.centerX}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function() {

            this.unidade.destroy();
            this.unidade = right;

        }, this);

        this.verifyButtons();
    },

    

    onButtonOver: function(elem) {
        if(elem.unlocked) {
            this.add.tween(elem.scale).to({x:1.1,y:1.1}, 300, Phaser.Easing.Linear.None, true);
            this.add.tween(elem).to({alpha:0.9}, 300, Phaser.Easing.Linear.None, true);
        }
    },
    onButtonOut: function(elem) {
        if(elem.unlocked) {
            this.add.tween(elem.scale).to({x:1,y:1}, 200, Phaser.Easing.Linear.None, true);
            this.add.tween(elem).to({alpha:1}, 200, Phaser.Easing.Linear.None, true);
        }
    },


    createScene: function() {
        this.add.sprite(-150,-105,"background");
    },  


	update: function () {

        this.unidade.x = this.world.centerX + (this.game.width - this.input.x)/50;
        this.unidade.y = this.world.centerY + (this.game.height- this.input.y)/50;

	}
};
