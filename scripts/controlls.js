function constraintCallback(moveable, r,g,b, enters){
	if(r > 0) return;
	var headline = "";
	var text = "";
	switch(b){
		case 50:
			headline = "";
			text = "The 'Classics to Renaissance' exhibition shows some work of well-known renaissance painters as well as antique crockery and sculptures.";
			document.getElementById("exhibition_title").innerHTML = "Classics to Renaissance";
		break;
		case 100:
			headline = "";
			text = "The 'Pop Art - A Movement of Modern Art' exhibition shows some work of well-known modern art painters and a also a modern art sculpture.";
			document.getElementById("exhibition_title").innerHTML = "Pop Art   -   A Movement of Modern Art";
		break;
		case 190:
			headline = "Aphrodite Statue";
			text = "It is believed, that this statue pictures the greek goddess aphrodite. Nonetheless, this is one of the rare embodiments which pictures the goddess with clothing.";
		break;
		case 250:
			headline = "Antique Mesopotamian Crockery";
			text = "Those bowls, two smaller and a larger one, are fine examples of the typical mesopotamian crockery work around the time of first babylonian dynasty, 18th to 17th century BC.";
		break;
		case 245:
			headline = "Twelve-year-old Jesus among the Scribes";
			text = "Albrecht Dürer created this oil painting in the year 1506 in Venice. Like many paintings and other works of art of the renaissance era this painting shows a biblical theme.";
		break;
		case 240:
			headline = "Grande Ludovisi";
			text = "So-called 'Grande Ludovisi' sarcophagus, with battle scene between Roman soldiers and Germans. The main character is probably Hostilian, Emperor Decius' son (d. 251 CE). This Roman artwork is made of Proconnesus marble and  was created ca. AD 251/252.";
		break;
		case 235:
			headline = "Banquet of the officers and sub-alterns of the Haarlem Calivermen Civic Guard.";
			text = "The painting of the dutch painter Cornelis Corneliszoon van Haarlem was finished in 1599.";
		break;
		case 230:
			headline = "The Holy Georg and the Dragon";
			text = "'The Holy Georg and the Dragon' is an picure of the italian painter Paolo Uccello. The picture was created ca. 1470 AD and is a perfect example of the gothic influence on the painters of the early renaissance.";
		break;
		case 225:
			headline = "Antique Roman Crockery";
			text = "This antique crockery, a vase and two bowls, are typical for the roman empire of the time of Caesar. Those objects were found in south france near Nice.";
		break;
		case 220:
			headline = "The Calumny of Apelles";
			text = "The Calumny of Apelles is a tempera painting by italian renaissaance painter Sandrp Botticvelli. Based on the description of a painting by Apelles, the work was completed in approximately 1494.";
		break;
		case 215:
			headline = "Radiant Baby";
			text = "This painting of the american artist and social activist Keight Haring was also used as his sumbol. It is a typiccal work of Keith Haring using those famous bold lines and typical shape of the human body.";
		break;
		case 210:
			headline = "New Money"
			text = "'New Money' is a lithograph by american artist Robert Dowd. It is one of his final works, as it was finished in 1994, just two years before he died. The Work was also part of a re-examination of Pop Art in the late 1980s and early 1990s."
		break;
		case 205:
			headline = "Colored Collision Map of this scene";
			text = "This map is the base for the Collision detection and the exchangement of the descriptions. Each shade of blue stands for a discription, which appears in the html as soon as one enters a blue colored area. Red color marks areas which are forbidden to move to. Green marks the objects that are present, but should not hinder movement.";
		break;
		case 200:
			headline = "The Capoeira dancer";
			text = "Model from <a href='http://www.mpi-inf.mpg.de/resources/perfcap/'>Performance Capture from Sparse Multi-view Video</a> paper. <p/> The data were provided courtesy of the research group 3D Video and Vision-based Graphics of the Max-Planck-Center for Visual Computing and Communication (MPI Informatik / Stanford)";
		break;
		case 195:
			headline = "Three Flags";
			text = "'Three Flags' is a 1958 painting by American artist Jasper Johns. The three flags exist in a tiered relationship to one another, with three canvases of decreasing size stacked on top of each other, each progressively approximately 25% smaller than the one below, creating a three dimensional work.";
		break;
		default: return; break;
	}
	document.getElementById("description_headline").innerHTML = headline;
	document.getElementById("description_text").innerHTML = text;
};

/**
 * DemoConstraint
 * @constructor
 * @param {number} sceneWidth width of the scene to which the map applies
 * @param {number} sceneDepth depth of the scene to which the map applies
 * @param {Array.<number>} normal normal of the plane to the which the map applies
 * @param {String} collisionMap URL of the CollisionMap
 * @implements {Constraint}
 */
var DemoConstraint = function(obj, collisionMap, callback){
	var boundingBox = obj.getBoundingBox();
	var min = boundingBox.min;
	var max = boundingBox.max;
	this.minX = min.x;
	this.maxX = max.x;
	this.minY = min.y;
	this.maxY = max.y;
	this.minZ = min.z;
	this.maxZ = max.z;
	this.sceneWidth = Math.abs(this.maxX) + Math.abs(this.minX);
	this.sceneDepth = Math.abs(this.maxY) + Math.abs(this.minY);
	
	this.oldColor = [255,255,255];

	if(callback && typeof(callback) == "function")
		this.callback = callback;
	else
		this.callback = undefined;

	//draw the map to a canvas to be able to get pixel data
	/**
	 * Canvas, the image painted on this canvas in order to be able to address single pixels
	 * @private
	 * @type {Canvas}
	 */
	this.canvas = document.createElement("canvas");

	/**
	 * Context of the canvas
	 * @private
	 * @type {Context}
	 */
	this.context = this.canvas.getContext("2d");

	/**
	 * Collisionmap
	 * @private
	 * @type {Image}
	 */
	this.img = new Image();
	var that = this;
	this.img.onload = function(){
		//this = that.img
		that.canvas.width =  this.width;
		that.canvas.height = this.height;
		that.context.drawImage(this, 0, 0);
	};
	this.img.src = collisionMap;
};
var cp = DemoConstraint.prototype;

/** @inheritDoc */
cp.constrainRotation = function(rotation, moveable){
	//TODO: implement something useful
	//console.log("constrain rotation");
	return true;
};

/** @inheritDoc */
cp.constrainTranslation = function(translation, moveable){
	//console.log("constrain translation: " + translation[0]+", " + translation[1]+", " + translation[2]);
	//alot of hacks only for the demo... z-up scene
	var currentPos = moveable.getPosition();
	//console.log("current pos: " + currentPos[0] +", "+currentPos[1]);
	//0,0 is not the upper left corner of the image, thus we need a offset
	var checkPosX = currentPos[0] + translation[0] - this.minX;
	var checkPosY = currentPos[1] + translation[1] - this.minY;
	//console.log("checkPosX: " + checkPosX + " - checkPosY: " + checkPosY);
	//it is rotated, we have to invert y axis
	var checkAtX = checkPosX / this.sceneWidth * this.img.width;
	var checkAtY = this.img.height - (checkPosY / this.sceneDepth * this.img.height);
	if(!checkAtX) checkAtX = 0;
	if(!checkAtY) checkAtY = 0;
	var data = this.context.getImageData(checkAtX,checkAtY,1,1).data;
	var r = data[0], g = data[1], b = data[2];

	//console.log("check this pixel: "+checkAtX+","+checkAtY +" - rgb: "+r+" "+g+" "+b);
	//if the color changed, call some callback
	var ret = !(r > 200 && g < 200 && b < 200);

	//we should not change in case of collision
	if( ret && ( this.oldColor[0] != r || this.oldColor[1] != g  || this.oldColor[2] != b) ){
		this.callback(moveable,r,g,b);
		this.oldColor = [r,g,b];
	}
	return ret;
};

//TODO: do this in some nice javascript fun stuff, so that they are not global anymore but accessible
//just some global variables
var poi = [];
var poiMoveToTime = 3000; //ms
//var poiParallelFactor = 1/3;
var currentPoi = 0;
var allowPoi = true; //needed to check if the shoulderbuttons are released before triggering the next movement
var oldMousePosition = {x:0,y:0};
var mouseButtonIsDown = false;
var slowthis = 1;
var moveSensivityPad = 0.9*slowthis;
var rotationSensivityPad = 0.01*slowthis;
var rotationSensivityMouse = 0.00125*slowthis;
var angleUp = 0;
var freeFlightActive = false;
var pressedKeys = {};


function toggleParallel(){
	XML3D._parallel = !XML3D._parallel;
	if(XML3D._parallel){
		//poiMoveToTime *= poiParallelFactor;
		document.getElementById("parallel_info").innerHTML = "Currently running<br/>parallel using River Trail.";
	}
	else{
		//poiMoveToTime /= poiParallelFactor;
		document.getElementById("parallel_info").innerHTML = "Currently running<br/>sequential.";
	}
};

function initCameraControlls(){

	if(XML3D._parallel){
		//poiMoveToTime = poiMoveToTime*poiParallelFactor;
		document.getElementById("parallel_info").innerHTML = "Currently running<br/>parallel.";
	}else{
		//poiMoveToTime = poiMoveToTime*poiParallelFactor;
		document.getElementById("parallel_info").innerHTML = "Currently running<br/>sequential.";
	}

	initPointsOfInterest();
	initMoveable();
	initEvents();
};

function initPointsOfInterest(){
	//startPos:
	//poi.push({pos:[-80, -12, 22], ori:[0.6, -0.37, -0.37, 0.6]});
	poi.push({pos:[64, 21, 22], ori:[-0.35, -0.61, -0.61, -0.35]});

	//picture 1: 12-year old jesus
	poi.push({pos:[53, 25, 22], ori:[-0.7, 0.0, 0.0, -0.7]});
	//show case in middle of the room
	poi.push({pos:[53, 14, 17], ori:[-0.23, -0.66, -0.66, -0.23]});
	//picture relief
	poi.push({pos:[0, 12, 22], ori:[-0.7, 0.0, 0.0, -0.7]});
	//picture 2: Banquet of the officers
	poi.push({pos:[-53, 25, 22], ori:[-0.7, 0.0, 0.0, -0.7]});
	//statue
	//poi.push({pos:[-49, -12, 23], ori:[0.63, -0.32, -0.32, 0.63]});
	poi.push({pos:[-13, 11, 23], ori:[-0.37, -0.59, -0.61, -0.36]});
	//picture 4: the calumny of apelles
	poi.push({pos:[-53, -25.75, 22], ori:[0.0, -0.7, -0.7, 0.0]});
	//show case at wall
	poi.push({pos:[-13, -25, 17], ori:[0.23, -0.66, -0.66, 0.23]});
	//picture 2: holy georg and the dragon
	poi.push({pos:[54, -24, 22], ori:[0.0, -0.7, -0.7, 0.0]});

	//pictures of the 2nd room:
	//picture 5: radiant baby
	poi.push({pos:[176, 14, 22], ori:[-0.5,0.5,0.5,-0.5]});
	//picture 1_6x9: - new money
	poi.push({pos:[176, -39, 21], ori:[-0.5,0.5,0.5,-0.5]});
	//picture 6: collision map / tomato juice box
	poi.push({pos:[170, -91, 22], ori:[-0.5,0.5,0.5,-0.5]});
	//picture 7: three flags
	poi.push({pos:[126, -67, 22], ori:[-0.5,-0.5,-0.5,-0.5]});
	//capoera dancer
	poi.push({pos:[124, -22, 17], ori:[0.64, -0.3, -0.3, 0.64]});
};

function setConstraints(epsilon, z){
	var constraint = new XMOT.ConstraintCollection();
	var constraint1 = new XMOT.ProhibitAxisMovementConstraint(false,false,true, epsilon, z);
	var constraint2 = new DemoConstraint(document.getElementById("the-floor"), "floor_collision.png", constraintCallback);
	constraint.addConstraint(constraint1);
	constraint.addConstraint(constraint2);
	moveable.setConstraint(constraint);
}

function initMoveable(){
	var factory = new XMOT.ClientMotionFactory();

	//moveable
	var cam = document.getElementById("node-camera_player");
	moveable = factory.createMoveable(cam, new XMOT.SimpleConstraint(true));
	moveable.setPosition(poi[0].pos);
	moveable.setOrientation(poi[0].ori);

	setConstraints(3, 20);
};

// --------- gamepad controll -------------
function updateController() {
	if(!window.Gamepad)return;
	var pads = Gamepad.getStates();
	for ( var i = 0; i < pads.length; ++i) {
		var pad = pads[i];
		//console.log("pads: " + pads);
		if (pad) {
			if(pad.rightShoulder1){ //lower shoulder buttons
				nextPoi();
			}
			if(pad.leftShoulder1){
				beforePoi();
			}
			if(pad.rightShoulder0){ //upper shoulder buttons
				moveUpAndDown(-0.75*slowthis);
			}
			if(pad.leftShoulder0){
				moveUpAndDown(0.75*slowthis);
			}
			if(pad.start){
				reset();
			}
			if(pad.select){
				toggleFreeFlightMode();
			}
			//back and for
			var y = (pad.leftStickY < -0.15 || pad.leftStickY > 0.15) ? pad.leftStickY : 0;
			if(y != 0) moveBackAndForward(y*moveSensivityPad);
			//left and right - transalte
			var x = (pad.leftStickX < -0.15 || pad.leftStickX > 0.15) ? pad.leftStickX : 0;
			if(x != 0) moveLeftAndRight(x*moveSensivityPad);
			//up and down
			var rotUpDown = (pad.rightStickY < -0.15 || pad.rightStickY > 0.15) ? pad.rightStickY : 0;
			if(rotUpDown != 0) cameraUpAndDown(-rotationSensivityPad*rotUpDown);
			//left and right - rotate
			var rotLeftRight = (pad.rightStickX < -0.15 || pad.rightStickX > 0.15) ? pad.rightStickX : 0;
			if(rotLeftRight != 0) cameraLeftAndRight(-rotationSensivityPad*rotLeftRight);
		}
	}
}

function moveBackAndForward(x){
	var vecX = [0, 0, 1];
	var result = vec3.create();
	quat4.multiplyVec3(moveable.getOrientation(),vecX, result);
	moveable.translate(vec3.scale(vec3.normalize(result), x));
};

function moveLeftAndRight(y){
	var vecY = [1, 0, 0]; // global x is local z of the camera
	var result = vec3.create();
	quat4.multiplyVec3(moveable.getOrientation(),vecY, result);
	moveable.translate(vec3.scale(vec3.normalize(result), y));
};
function moveUpAndDown(z){
	var vecY = [0, 1, 0]; // global x is local z of the camera
	var result = vec3.create();
	quat4.multiplyVec3(moveable.getOrientation(),vecY, result);
	moveable.translate(vec3.scale(vec3.normalize(result), z));
}

function nextPoi(){
	if(!allowPoi || moveable.movementInProgress()) return;
	//rotate up/down befor any other movement, this prevends from rolling
	moveable.rotate( XMOT.axisAngleToQuaternion( [1,0,0], -angleUp) );
	angleUp = 0;
	allowPoi = false;
	currentPoi = currentPoi == poi.length-1 ? 0 : currentPoi+1;
	var movetopoi = poi[currentPoi];
	//console.log("right " + currentPoi + " quat: " + movetopoi.ori);
	moveable.moveTo(movetopoi.pos, movetopoi.ori, poiMoveToTime, {queueing: false, callback: moveToCallback});
};

function beforePoi(){
	if(!allowPoi || moveable.movementInProgress()) return;
	//rotate up/down befor any other movement, this prevends from rolling
	moveable.rotate( XMOT.axisAngleToQuaternion( [1,0,0], -angleUp) );
	angleUp = 0;
	allowPoi = false;
	currentPoi = currentPoi == 0 ? poi.length-1 : currentPoi-1;
	var movetopoi = poi[currentPoi];
	//console.log("left " + currentPoi  + " quat: " + movetopoi.ori);
	moveable.moveTo(movetopoi.pos, movetopoi.ori, poiMoveToTime, {queueing: false, callback: moveToCallback});
};

function cameraUpAndDown(a){
	angleUp += a*Math.PI;
	moveable.rotate( XMOT.axisAngleToQuaternion( [1,0,0], a*Math.PI) );
};

function cameraLeftAndRight(a){
	//rotate up/down befor rotating sidewards, this prevends from rolling
	moveable.rotate( XMOT.axisAngleToQuaternion( [1,0,0], -angleUp) );
	moveable.rotate( XMOT.axisAngleToQuaternion( [0,1,0], a*Math.PI) );
	//and rotate up/down again
	moveable.rotate( XMOT.axisAngleToQuaternion( [1,0,0], angleUp) );
};

function reset(){
	var start = poi[0];
	moveable.setPosition(start.pos);
	moveable.setOrientation(start.ori);
	angleUp = 0;
	currentPoi = 0;
};

function toggleFreeFlightMode(){
	freeFlightActive = !freeFlightActive;
	if(freeFlightActive){
		setConstraints(35,37);
		//document.getElementById("freeflight_info").innerHTML = "Freeflight Mode.";
	}
	else{
		document.getElementById("freeflight_info").innerHTML = "";
		setConstraints(3,20);
		reset();
	}
}


function moveToCallback(){
	allowPoi=true;
}

// ----------- keyboard controlls ------------
function initEvents(){
	//console.log("initKeyboardEvents");
	var elem = document.getElementById("myDiv");
	//registered on window, since registring on div did not work, events never triggered
	window.addEventListener("keydown", keypressEventHandler, false);
    window.addEventListener("keyup", keyupEventHandler, false);
	window.addEventListener("mousemove", mouseMovementHandler, false);
	window.addEventListener("mousedown", mouseDownHandler, false);
	window.addEventListener("mouseup", mouseUpHandler, false);
};

function keypressEventHandler(e){
	e = window.event || e;
	var kc = e.keyCode;
    if(!pressedKeys[kc]){
        var flag = moveWithKey(kc);
        if(flag){
            pressedKeys[kc] = true;
        }
        else{
            switch(kc){
                case 69 : nextPoi(); break; // q
                case 81 : beforePoi(); break; // e
                case 82 : reset(); break; //r
                case 70 : toggleFreeFlightMode(); break; //f
                default: flag = false; break;
            }
        }
        if(flag) e.preventDefault();
    }

};

function keyupEventHandler(e){
    if(!allowPoi) return;
    e = window.event || e;
    var kc = e.keyCode;
    delete pressedKeys[kc];
}

function moveWithKey(kc, factor){
    factor = factor || 0;
    switch(kc){
        case 83 : moveBackAndForward(factor * 0.5*slowthis); break; // s
        case 87 : moveBackAndForward(factor * -0.5*slowthis); break; // w
        case 65 : moveLeftAndRight(factor * -0.5*slowthis); break; // a
        case 68 : moveLeftAndRight(factor * 0.5*slowthis); break; // d
        case 33 : moveUpAndDown(factor * 0.5*slowthis); break; //page up
        case 34 : moveUpAndDown(factor * -0.5*slowthis); break; //page down
        case 38 : cameraUpAndDown(factor * 0.01*slowthis); break; // up Arrow
        case 40 : cameraUpAndDown(factor * -0.01*slowthis); break; // down Arrow
        case 37 : cameraLeftAndRight(factor * 0.01*slowthis); break; // left Arrow
        case 39 : cameraLeftAndRight(factor * -0.01*slowthis); break; // right Arrow
        default : return false; break;
    }
    return true;
}

function updateKeyMovement(delta){
    for(var kc in pressedKeys){
        moveWithKey(kc * 1, delta / 20);
    }
};

function mouseMovementHandler(e){
	//e.preventDefault();
	if(!mouseButtonIsDown || !allowPoi) return;
	var currentX = e.pageX;
	var currentY = e.pageY;
	var x = currentX - oldMousePosition.x;
	var y = currentY - oldMousePosition.y;
	oldMousePosition.x = currentX;
	oldMousePosition.y = currentY;
	//console.log("Current: x: " + currentX + " y: " + currentY + " - move x: " + x + " y: " + y);
	if(x != 0)
		cameraLeftAndRight(-rotationSensivityMouse*x);
	if(y != 0)
		cameraUpAndDown(-rotationSensivityMouse*y);
};

function mouseUpHandler(e){
	//e.preventDefault();
	if(e.button == 2){
		mouseButtonIsDown = false;
	}
};

function mouseDownHandler(e){
	//e.preventDefault();
	if(e.button == 2){
		mouseButtonIsDown = true;
		oldMousePosition.x = e.pageX;
		oldMousePosition.y = e.pageY;
	}
};

function outputCurrentPosition(){
	if(!moveable) return;
	var q = moveable.getOrientation();
	var tmp = XMOT.quaternionToAxisAngle(q);
	console.log("quat: " + q + " pos: " + moveable.getPosition() + " - axis: " + tmp.axis + " angle: " + tmp.angle);
};
