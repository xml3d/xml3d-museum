 (function() {
 
	var Museum = function() {
		this.startTime = Date.now();
		this.animations = [];
		this.animations.push({ step: 0, maxStep: 40, duration: 28600, element: "natalie_animation" });
		this.animations.push({ step: 0, maxStep: 7.1, duration: 5000, element: "natalie_sitting_animation" });
		this.animations.push({ step: 0, maxStep: 37, duration: 15000, element: "male-weight" });
		this.animations.push({ step: 0, maxStep: 37, duration: 15000, element: "watchmen_animation" });
		
	}, m = Museum.prototype;
 
	m.init = function() {
		var that = this;
		console.log("Starting Museum application");
		for(var i=0; i < this.animations.length; i++) {
			this.animations[i].param = document.getElementById(this.animations[i].element);;
		}
		var myxml3d = document.getElementById("myDiv");
		var stats = new Stats();
		stats.domElement.style.position='absolute';
		stats.domElement.style.left='0px';
		stats.domElement.style.top='0px';
		this.stats = stats;

		myxml3d.parentElement.appendChild(stats.domElement);
		myxml3d.addEventListener("framedrawn", function(e) {
			that.update();
		}, true);
		
		initCameraControlls();
	}

	m.update = function() {
		var elapsed = Date.now() - this.startTime;
        var delta = Date.now() - this.lastTime;
        this.lastTime = Date.now();
		this.stats.update();
		
		updateController();
        updateKeyMovement(delta);
		
		var animationCount = this.animations.length;
		for(var i=0; i < animationCount; i++) {
			var anim = this.animations[i];
			var fac = (elapsed % anim.duration) / anim.duration;
			anim.step = fac * anim.maxStep;
			anim.param && (anim.param.value[0] = anim.step) && (anim.param._configured.notify());
		}
	}
	
	m.restartNatalie = function() {
		this.startTime = Date.now();
	}

	m.stopNatalie = function() {
	}
	
	$(document).load(function(){
		window.museum = new Museum();
		museum.init();
	});
 })();
 
 function replaceImage(evt) {
    var shaderName = evt.currentTarget.shader.substring(1);
    var url = evt.data.url.replace(/^http:\/\//, '');

    var newsrc = "http://www.xml3d.org/tools/image?token=nd7n10sn127u&url=" + url;
     
    var shader = document.getElementById(shaderName);
    
    for (var i=0; i < shader.childNodes.length; i++) {
        var node = shader.childNodes[i];
        if (node.name == "diffuseTexture") {
            node.childNodes[1].setAttribute("src", newsrc);
            break;
        }
    }
};
