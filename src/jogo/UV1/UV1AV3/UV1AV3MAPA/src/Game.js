
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

        var b1 = this.createButton(450,306, "", 150, 150, this.clickButton1, -22, 170,"over1", this.canPlayUD(1));
        //b1.addChild(this.createLockedButton(65,20, this.canPlayUD(1)));

        var b2 = this.createButton(170, 285, "", 110, 104, this.clickButton2, -128,116,"over2", this.canPlayUD(2));
        //b2.addChild(this.createLockedButton(50,80, this.canPlayUD(2)));

        var b3 = this.createButton(137,  180, "", 100, 85, this.clickButton3, -137,77,"over3", this.canPlayUD(3));
        //b3.addChild(this.createLockedButton(10,70, this.canPlayUD(3)));

        var b4 = this.createButton(260, 92, "", 100, 100, this.clickButton4, -129, -73,"over4", this.canPlayUD(4));
        //b4.addChild(this.createLockedButton(-100,30, this.canPlayUD(4)));

        var b5 = this.createButton(460, 70, "", 80, 100, this.clickButton5, -40, 106,"over5", this.canPlayUD(5));
        //b5.addChild(this.createLockedButton(-30,15, this.canPlayUD(5)));


        var b6 = this.createButton(655,67, "", 70, 110, this.clickButton6, 65,55,"over6", this.canPlayUD(6));
        //b6.addChild(this.createLockedButton(90,30, this.canPlayUD(6)));

        var b7 = this.createButton(770,190, "", 95,75, this.clickButton7, 60,80,"over7", this.canPlayUD(7));
        //b7.addChild(this.createLockedButton( 5,10, this.canPlayUD(7)));

        var b8 = this.createButton(712,271, "", 110, 110, this.clickButton8, 75, 140,"over8", this.canPlayUD(8));
        //b8.addChild(this.createLockedButton(-50,135, this.canPlayUD(8)));

        this.createLogo();

        this.bVoltar = this.createButton(20,15,"btVoltarUv", 108, 118, this.clickButtonBack, 30,-30,null, true);

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
            this.add.tween(elem.imgOver).to({alpha:1}, 300, Phaser.Easing.Linear.None, true);
            /*if(elem.unlocked & elem.children[0].anim != null) {
                elem.children[0].anim.scale.set(0.35,0.35);
                elem.children[0].loadTexture("botaoOver");
            }*/
        }
    },
    onButtonOut: function(elem) {
        if(elem != this.bVoltar){
            this.add.tween(elem.imgOver).to({alpha:0}, 300, Phaser.Easing.Linear.None, true);
            /*if(elem.unlocked & elem.children[0].anim != null) {
                elem.children[0].anim.scale.set(0.2,0.2);
                elem.children[0].loadTexture("botaoOpen");
            }*/
        }
    },

    getCookie: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
        }
        return "";
    },

    createButton: function(x,y, name, width, height, callback,ox,oy,oimg, unlocked) {

        var button = this.add.button(x,y,name, (unlocked)?callback: null, this, 0,0,0);
        button.anchor.set(0,0);
        button.width = width;
        button.height = height;
        button.unlocked = unlocked;
        if(!unlocked) {
            button.alpha = 0.7;
        }

        button.input.useHandCursor = true;

        button.imgOver = this.add.sprite( x+ox, y+oy, oimg );
        button.imgOver.alpha = 0;
        //button.addChild(button.imgOver);
        button.events.onInputOver.add(this.onButtonOver, this);
        button.events.onInputOut.add(this.onButtonOut, this);

        return button;
    },
    createLogo:function(){
      this.add.sprite(0, 0, 'logo');
      this.add.text(457, 0, 'BRASIL AFORA', { fontSize: '12px', fill: '#fff' });
    },

    createScene: function() {
        this.add.sprite(0,0,"background");

        this.bumba = this.add.sprite(445, 302, 'bumba');
        this.bumba.animations.add('idle', null, 15, true);
        this.bumba.play('idle');

        this.guri = this.add.sprite(180, 275, 'guri');
        this.guri.animations.add('idle', null, 15, true);
        this.guri.play('idle');

        this.bug = this.add.sprite(147, 135, 'bug');
        this.bug.animations.add('idle', null, 15, true);
        this.bug.play('idle');

        this.cavalo = this.add.sprite(250, 92, 'cavalo');
        this.cavalo.animations.add('idle', null, 15, true);
        this.cavalo.play('idle');

        this.menino = this.add.sprite(460, 65, 'menino');
        this.menino.animations.add('idle', null, 15, true);
        this.menino.play('idle');

        this.peterpan = this.add.sprite(675, 67, 'peterpan');
        this.peterpan.animations.add('idle', null, 15, true);
        this.peterpan.play('idle');

        this.indios = this.add.sprite(770, 190, 'indios');
        this.indios.animations.add('idle', null, 15, true);
        this.indios.play('idle');

        this.bacia = this.add.sprite(712, 271, 'bacia');
        this.bacia.animations.add('idle', null, 15, true);
        this.bacia.play('idle');
    },


	update: function () {



	}
};
