/*
Errors:
	- The camera is based around a property represtenting an HTML body, rather than a player object, which makes it akward, since I'd have to make the body follow the camera
	but still have the body still interact with physics and move the camera - not impossible but hard, inefficient, and most likely not necessary
	- The player head mesh (what you actually) is a box and the body (interacts with physics) is a sphere. I want it to be a box, but I don't know how to make the body a box
	- Once physics works, gravity since the gravity function currently is based on nothing (it's commented, but you can uncomment and it works)
*/

//create render
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//cannon phyics
let world = new CANNON.World();
world.gravity.set(0, -20, 0);
world.broadphase = new CANNON.NaiveBroadphase();

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

//var for camera being used
activeCamera = 1;

//function for rendering
function render() {
	if (keys[50]) {
		renderer.render(scene, camera2);
		activeCamera = 2;
	}
	else {
		renderer.render(scene, camera);
		activeCamera = 1;
	}
}
render();

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

//pointerlock controls
let controls = new THREE.PointerLockControls(camera, document.body);
scene.add(controls.getObject());

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

//gravity
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
	
	//player visiblity in different cameras
	if (activeCamera === 1) {
		
	}

	//sprint
	if (keys[16]) {
		player.sprint = true;
		player.walk = false;
	}
	if (!keys[16]) {
		player.sprint = false;
		player.walk = true;
	}
	//movement - wasd
	if (keys[87] && player.walk) {
		controls.moveForward(.08);
	}
	if (keys[83] && player.walk) {
		controls.moveForward(-.1);
	}
	if (keys[65] && player.walk) {
		controls.moveRight(-.1)
	}
	if (keys[68] && player.walk) {
		controls.moveRight(.1)
	}
	if (keys[32] && player.canJump) {
		player.isJumping = true;
	}
	//whilst sprinting
	if (keys[87] && player.sprint && player.Vy === 0) {
		controls.moveForward(.19);
	}
	if (keys[65] && player.sprint) {
		controls.moveRight(-.1);
	}
	if (keys[68] && player.sprint) {
		controls.moveRight(.1);
	}
	if (keys[83] && player.sprint) {
		controls.moveForward(-.1);
	}
	
	lockPlayer();
	render();
	controls.lock();
	//gravity();
	requestAnimationFrame(cycle);
}
requestAnimationFrame(cycle);