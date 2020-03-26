/*
Errors and Issues:
	- The camera is based around a property represtenting an HTML body, rather than a player object, which makes it akward, since I'd have to make the body follow the camera
	but still have the body still interact with physics and move the camera appropaitely - not impossible but hard, inefficient, and most likely not necessary - DEPRECATED
	- The pointer doesn't lock properly - FIXED
	- The camera acts like OrbitControls for no reason, and the pointer doesn't lock like requested - IN PROGRESS
	- The player head mesh (what you actually) is a box and the body (interacts with physics) is a sphere. I want it to be a box, but I don't know how to make the body a box
	- Once physics works, gravity, since the current gravity function currently is based on nothing (it's commented, but you can uncomment and it works)
	- Frame is tied to refresh rate causing wacky speeds for high refresh rate monitors - FIXED
	- Player is visible in the first person camera
	- Player is faster whilst moving diaganolly
	- The PointerLock library seems to have mouse movement tied to framerate, so high refresh monitors will have a high sens
*/

//create render
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

//cannon world
let world = new CANNON.World();
world.gravity.set(0, -20, 0);
world.broadphase = new CANNON.NaiveBroadphase();
world.quatNormalizeSkip = 0;
world.quatNormalizeFast = false;

//add keyboard input
const keys = [];
document.onkeydown = event => {
  keys[event.keyCode] = true;
  //console.log(event.keyCode);
};
document.onkeyup = event => {
  keys[event.keyCode] = false;
};

//create scene, clock, camera
let scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);

let camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 20000);
camera.position.z = 5.43;
camera.position.y = 2;

let camera2 = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 20000);
camera2.position.y = 2;	

let clock = new THREE.Clock();

let controls,time = Date.now();

//physics object
let physicsMaterial = new CANNON.Material("material");
let phyiscsContactMaterial = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, 0, .3);

//create cube
var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh(geometry, material);
cube.position.y = .5;
scene.add(cube);

//create and rotate cannon floor
let groundShape = new CANNON.Plane();
let groundBody = new CANNON.Body({mass: 0});
groundBody.addShape(groundShape);
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
world.add(groundBody);

//THREE floor
geometry = new THREE.PlaneGeometry(300, 300, 50, 50);
geometry.rotateX(-Math.PI / 2);

material = new THREE.MeshBasicMaterial({color: "tan"});
mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

//create light
let light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
light.position.set(0.5, 1, 0.75);
scene.add(light);

//player meshes
let headGeo = new THREE.BoxGeometry(.49, .47, .4);
let headMat = new THREE.MeshBasicMaterial({color: 'blue', wireframe: true});
let bodyGeo = new THREE.BoxGeometry(.45, .38, .4);
let bodyMat = new THREE.MeshBasicMaterial({color: 'blue', wireframe: true});
let armGeo = new THREE.BoxGeometry(.2, .5, .2);
let armMat = new THREE.MeshBasicMaterial({color: 'blue', wireframe: true});
let legGeo = new THREE.BoxGeometry(.2, .425, .3)
let legMat = new THREE.MeshBasicMaterial({color: 'blue', wireframe: true});

let headShape = new CANNON.Sphere({radius: 4});
let bodyShape = new CANNON.Vec3(.45, .38, .4);
let lowerBodyShape = new CANNON.Vec3(.45, .38, .4);
let rArmShape = new CANNON.Vec3(.2, .5, .2);
let lArmShape = new CANNON.Vec3(.2, .5, .2);
let rForearmShape = new CANNON.Vec3(.2, .5, .2);
let lForearmShape = new CANNON.Vec3(.2, .5, .2);
let rLegShape = new CANNON.Vec3(.2, .425, .3)
let lLegShape = new CANNON.Vec3(.2, .425, .3);
let rLowerLegShape = new CANNON.Vec3(.2, .425, .3);
let lLowerLegShape = new CANNON.Vec3(.2, .425, .3);

let headBody = new CANNON.Body({mass: .1});
headBody.addShape(headShape);
world.add(headBody);

let bodyBody = new CANNON.Body({mass: .1});
let lowerBodyBody = new CANNON.Body({mass: .1});
let rArmBody = new CANNON.Body({mass: .1});
let lArmBody = new CANNON.Body({mass: .1});
let rForearmBody = new CANNON.Body({mass: .1});
let lForearmBody = new CANNON.Body({mass: .1});
let rLegBody = new CANNON.Body({mass: .1});
let lLegBody = new CANNON.Body({mass: .1});
let rLowerLegBody = new CANNON.Body({mass: .1});
let lLowerLegBody = new CANNON.Body({mass: .1});

//lock pointer
let blocker = document.getElementById( 'blocker' );
let instructions = document.getElementById( 'instructions' );
let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

let element = document.body;

let pointerlockchange = function ( event ) {

if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

    controls.enabled = true;

    blocker.style.display = 'none';

} else {

    controls.enabled = false;

    blocker.style.display = '-webkit-box';
    blocker.style.display = '-moz-box';
    blocker.style.display = 'box';

    instructions.style.display = '';

}

}

    var pointerlockerror = function ( event ) {
   instructions.style.display = ''; 
}

	// Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

    instructions.addEventListener( 'click', function ( event ) {
    instructions.style.display = 'none';

    // Ask the browser to lock the pointer
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    if ( /Firefox/i.test( navigator.userAgent ) ) {

		var fullscreenchange = function ( event ) {

    if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

    	document.removeEventListener( 'fullscreenchange', fullscreenchange );
        document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

        element.requestPointerLock();
	}
}

    document.addEventListener( 'fullscreenchange', fullscreenchange, false );
     document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

     element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

       element.requestFullscreen();

} else {

    element.requestPointerLock();

}
}, false );

} else {

    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

//pointerlock controls
controls = new PointerLockControls(camera, headBody);
scene.add(controls.getObject());

controls.enabled = true;

document.body.appendChild(renderer.domElement);

//function for rendering
function render() {
	controls.update( Date.now() - time );
	renderer.render(scene, camera);
	time = Date.now();
}
render();

//player object
let player = {
	canJump: true,
	isJumping: false,	
	walk: true,
	sprint: false,
	health: 100,
	Vy: 0,
	head: new THREE.Mesh(headGeo, headMat),
	body: new THREE.Mesh(bodyGeo, bodyMat),
	lowerBody: new THREE.Mesh(bodyGeo, bodyMat),
	rUparm: new THREE.Mesh(armGeo, armMat),
	rForearm: new THREE.Mesh(armGeo, armMat),
	lUparm: new THREE.Mesh(armGeo, armMat),
	lForearm: new THREE.Mesh(armGeo, armMat),
	rLeg: new THREE.Mesh(legGeo, legMat),
	rLowerLeg: new THREE.Mesh(legGeo, legMat),
	lLeg: new THREE.Mesh(legGeo, legMat),
	lLowerLeg: new THREE.Mesh(legGeo, legMat)
}

//create the player
player.rUparm.rotateZ(2.5)
player.lUparm.rotateZ(-2.5)
player.rForearm.rotateZ(2.5)
player.lForearm.rotateZ(-2.5)

scene.add(player.head);
scene.add(player.body);
scene.add(player.lowerBody)
scene.add(player.rUparm);
scene.add(player.rForearm);
scene.add(player.lUparm);
scene.add(player.lForearm);
scene.add(player.rLeg);
scene.add(player.rLowerLeg)
scene.add(player.lLeg);
scene.add(player.lLowerLeg);

//ties the player model to the movement of the camera
function lockPlayer() {

	//position
	player.head.position.x = camera.position.x;
	player.head.position.y = camera.position.y;
	player.head.position.z = camera.position.z;

	headBody.position.x = camera.position.x;
	headBody.position.y = camera.position.y;
	headBody.position.z = camera.position.z;

	player.body.position.x = camera.position.x;
	player.body.position.y = player.head.position.y-.47;
	player.body.position.z = camera.position.z;

	player.lowerBody.position.x = camera.position.x;
	player.lowerBody.position.y = player.body.position.y-.3;
	player.lowerBody.position.z = camera.position.z;

	player.rUparm.position.x = (.5 * Math.cos(euler.y)) + player.body.position.x;
	player.rUparm.position.y = player.body.position.y-.1;
	player.rUparm.position.z = (.3 * Math.sin(euler.y)) + camera.position.z;

	player.rForearm.position.x = (.15 * Math.cos(euler.y)) + player.rUparm.position.x;
	player.rForearm.position.y = player.rUparm.position.y-.2;
	player.rForearm.position.z = (.3 * Math.sin(euler.y)) + camera.position.z

	player.lUparm.position.x = (-.5 * Math.cos(euler.y)) + player.body.position.x;
	player.lUparm.position.y = player.body.position.y-.1;
	player.lUparm.position.z = (-.3 * Math.sin(euler.y)) + camera.position.z;

	player.lForearm.position.x = (-.15 * Math.cos(euler.y)) + player.lUparm.position.x;
	player.lForearm.position.y = player.lUparm.position.y-.2;
	player.lForearm.position.z = (-.3 * Math.sin(euler.y)) + camera.position.z

	player.rLeg.position.x = (.11 * Math.cos(euler.y)) + player.lowerBody.position.x;
	player.rLeg.position.y = player.lowerBody.position.y-.35;
	player.rLeg.position.z = (.1 * Math.sin(euler.y)) + player.lowerBody.position.z;

	player.rLowerLeg.position.x = (.11 * Math.cos(euler.y)) + player.lowerBody.position.x;
	player.rLowerLeg.position.y = player.rLeg.position.y-.3;
	player.rLowerLeg.position.z = (.1 * Math.sin(euler.y)) + player.lowerBody.position.z;

	player.lLeg.position.x = (-.11 * Math.cos(euler.y)) + player.lowerBody.position.x;
	player.lLeg.position.y = player.lowerBody.position.y-.35;
	player.lLeg.position.z = (-.11 * Math.sin(euler.y)) + player.lowerBody.position.z;

	player.lLowerLeg.position.x = (-.11 * Math.cos(euler.y)) + player.lowerBody.position.x;
	player.lLowerLeg.position.y = player.lLeg.position.y-.3;
	player.lLowerLeg.position.z = (-.11 * Math.sin(euler.y)) + player.lowerBody.position.z;

	//rotation
	player.head.rotation.x = -euler.x
	player.head.rotation.y = -euler.y
	player.head.rotation.z = -euler.z

	player.body.rotation.y = -euler.y
	player.body.rotation.z = -euler.z

	player.lowerBody.rotation.y = -euler.y
	player.lowerBody.rotation.z = -euler.z

	player.rLeg.rotation.y = -euler.y
	player.rLeg.rotation.z = -euler.z

	player.rLowerLeg.rotation.y = -euler.y
	player.rLowerLeg.rotation.z = -euler.z

	player.lLeg.rotation.y = -euler.y
	player.lLeg.rotation.z = -euler.z

	player.lLowerLeg.rotation.y = -euler.y
	player.lLowerLeg.rotation.z = -euler.z

	player.rForearm.rotation.y = -euler.y
	player.rForearm.rotation.z = -2.5

	player.lForearm.rotation.y = -euler.y
	player.lForearm.rotation.z = 2.5

	player.rUparm.rotation.y = -euler.y
	player.rUparm.rotation.z = -2.5

	player.lUparm.rotation.y = -euler.y
	player.lUparm.rotation.z = 2.5
}

//gravity - doesnt interact with physics, to be deprecated
function gravity() {
	if (camera.position.y >= groundVar && !player.isJumping) {
		player.Vy -= .02;
		player.canJump = false;
	}
	if (camera.position.y <= groundVar) {
		player.canJump = true;
		player.Vy = 0;
		camera.position.y = groundVar;
	}
	if (player.isJumping) {
		player.canJump = false;
		player.Vy += .02;
	}
	if (camera.position.y >= groundVar+.9) {
		player.isJumping = false;
	}
	camera.position.y += player.Vy;
}

//variables
let groundVar = 2;

//animation loop
function cycle() {
	
	
	lockPlayer();
	render();
	//controls.lock();
	//gravity();	
}

setInterval(cycle, 1000/144);