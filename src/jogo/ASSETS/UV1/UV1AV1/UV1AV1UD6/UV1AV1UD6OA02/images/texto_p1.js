(function(window) {
mc_rodada1_texto = function() {
	this.initialize();
}
mc_rodada1_texto._SpriteSheet = new SpriteSheet({images: ["texto_p1.png"], frames: [[0,0,501,124,0,65.6,-5.65]]});
var mc_rodada1_texto_p = mc_rodada1_texto.prototype = new BitmapAnimation();
mc_rodada1_texto_p.BitmapAnimation_initialize = mc_rodada1_texto_p.initialize;
mc_rodada1_texto_p.initialize = function() {
	this.BitmapAnimation_initialize(mc_rodada1_texto._SpriteSheet);
	this.paused = false;
}
window.mc_rodada1_texto = mc_rodada1_texto;
}(window));

