var sound = document.getElementById('sound')
var music = document.getElementById('music')
document.addEventListener("WeixinJSBridgeReady", function() {
    sound.play();
    music.className = 'music rotataMove'
    music.addEventListener("touchend",function(){
		if (sound.paused){
			music.className = 'music rotataMove'
			sound.play();
		}
		else{
			music.className = 'music'
			sound.pause();
		}
	});
}, false);
