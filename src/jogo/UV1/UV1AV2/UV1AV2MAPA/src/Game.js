
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

        this.tweenTime = 500;

        this.createScene();

        var b1 = this.createButton(42, -48,"nivel1", this.clickButton1, -10,-70,"over1", this.canPlayUD(1));
        b1.addChild(this.createLockedButton(-10,120, this.canPlayUD(1)));

        this.createLogo();
        var b2 = this.createButton(407,-28,"nivel2", this.clickButton2, 30,-100,"over2", this.canPlayUD(2));
        b2.addChild(this.createLockedButton(40,40, this.canPlayUD(2)));

        var b3 = this.createButton(732,  6,"nivel3", this.clickButton3, 10,-140,"over3", this.canPlayUD(3));
        b3.addChild(this.createLockedButton(10,130, this.canPlayUD(3)));

        var b4 = this.createButton(408,157,"nivel4", this.clickButton4, -210,-150,"over4", this.canPlayUD(4));
        b4.addChild(this.createLockedButton(-10,130, this.canPlayUD(4)));

        var b5 = this.createButton(100,190,"nivel5", this.clickButton5, 40,-150,"over5", this.canPlayUD(5));
        b5.addChild(this.createLockedButton( 30,160, this.canPlayUD(5)));


        var b6 = this.createButton(217,440,"nivel6", this.clickButton6, -50,-190,"over6", this.canPlayUD(6));
        b6.addChild(this.createLockedButton(-30,60, this.canPlayUD(6)));

        var b7 = this.createButton(472,401,"nivel7", this.clickButton7, -240,-140,"over7", this.canPlayUD(7));
        b7.addChild(this.createLockedButton( 25,80, this.canPlayUD(7)));

        var b8 = this.createButton(728,301,"nivel8", this.clickButton8, -130,-170,"over8", this.canPlayUD(8));
        b8.addChild(this.createLockedButton(-10,135, this.canPlayUD(8)));

        this.bVoltar = this.createButton(20,this.game.height-130,"btVoltarUv", this.clickButtonBack, 30,-30,null, true);

        this.createLogo();

        this.add.sprite(10,266, 'backgroundFront');
	},

    canPlayUD: function(UD) {
        //return UD <= BasicGame.maxUnidade;
        return BasicGame.unidades[ UD-1 ];
    },

    createLockedButton: function(x,y, isOpen) {
        var spr = this.add.sprite(x,y,(isOpen)?"botaoOpen":"botaoLocked");
        spr.anchor.set(0.5,1);
        var anim;

        if(isOpen) {
            anim = this.createAnimation(0, -15,"raio",0.2,0.2);
            spr.addChild(anim);
            spr.anim = anim;
            anim.anchor.set(0.5,1);
        } else {
            anim = this.add.sprite(0, -20,"iconeLocked");
            anim.anchor.set(0.5,1);
            this.add.tween(anim).to({y:-30}, 900, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);
            spr.addChild(anim);
        }

        return spr;
    },

    clickButton1: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../../UV"+BasicGame.UV+"AV"+BasicGame.AV+"/UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD1/UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD1MAPA/";
        }, this);
    },
    clickButton2: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../../UV"+BasicGame.UV+"AV"+BasicGame.AV+"/UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD2/UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD2MAPA/";
        }, this);
    },
    clickButton3: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../../UV"+BasicGame.UV+"AV"+BasicGame.AV+"/UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD3/UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD3MAPA/";
        }, this);
    },
    clickButton4: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../../UV"+BasicGame.UV+"AV"+BasicGame.AV+"/UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD4/UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD4MAPA/";
        }, this);
    },
    clickButton5: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../../UV"+BasicGame.UV+"AV"+BasicGame.AV+"/UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD5/UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD5MAPA/";
        }, this);
    },
    clickButton6: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../../UV"+BasicGame.UV+"AV"+BasicGame.AV+"/UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD6/UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD6MAPA/";
        }, this);
    },
    clickButton7: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../../UV"+BasicGame.UV+"AV"+BasicGame.AV+"/UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD7/UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD7MAPA/";
        }, this);
    },
    clickButton8: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../../UV"+BasicGame.UV+"AV"+BasicGame.AV+"/UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD8/UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD8MAPA/";
        }, this);
    },
    clickButtonBack: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            location.href = "../../UV"+BasicGame.UV+"MAPA/";
        }, this);
    },

    createAnimation: function( x, y, name, scaleX, scaleY) {
        var spr = this.add.sprite(x,y, name);
        spr.animations.add('idle', null, 18, true);
        spr.animations.play('idle');
        spr.scale.set( scaleX, scaleY);

        return spr;
    },

    onButtonOver: function(elem) {
        if(elem != this.bVoltar){
            this.add.tween(elem.imgOver).to({alpha: 1}, 300, Phaser.Easing.Linear.None, true);
            if(elem.unlocked && elem.children[0] != null && elem.children[0].anim != null) {
                elem.children[0].anim.scale.set(0.35,0.35);
                elem.children[0].loadTexture("botaoOver");
            }
        }
    },
    onButtonOut: function(elem) {
        if(elem != this.bVoltar){
            this.add.tween(elem.imgOver).to({alpha:0}, 300, Phaser.Easing.Linear.None, true);
            if(elem.unlocked && elem.children[0] != null && elem.children[0].anim != null) {
                elem.children[0].anim.scale.set(0.2,0.2);
                elem.children[0].loadTexture("botaoOpen");
            }
        }
    },

    createButton: function(x,y,name, callback, ox, oy, oimg, unlocked) {

        var button = this.add.button(x,y,name, (unlocked)?callback: null, this, 0,0,0);
        button.animations.add("idle", null, 15, true);
        button.animations.play("idle");

        button.anchor.set(0.5,0.5);
        button.x += button.width*0.5;
        button.y += button.height*0.5;
        button.unlocked = unlocked;
        if(!unlocked) {
            button.alpha = 0.7;
        }

        button.input.useHandCursor = true;

        button.imgOver = this.add.sprite( parseInt(x+ox+button.width*0.5), parseInt(y+oy+button.height*0.5), oimg );
        button.imgOver.alpha = 0;

        // console.log(button.imgOver.x, button.imgOver.y, button.imgOver.scale);
        // button.addChild(button.imgOver);

        button.events.onInputOver.add(this.onButtonOver, this);
        button.events.onInputOut.add(this.onButtonOut, this);

        return button;
    },

    createLogo:function(){
      this.add.sprite(0, 0, 'logo');
      this.add.text(460, 0, 'ÁRVORE DA VIDA', { fontSize: '12px', fill: '#fff' });
    },

    createScene: function() {
        this.add.sprite(-130,-270,"background");
    },


	update: function () {



	}
};
