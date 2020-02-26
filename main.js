//create render
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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

let camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 20000);
camera.position.z = 5;
camera.position.y = 1.5

let clock = new THREE.Clock();

//function for rendering
function render() {
	renderer.render(scene, camera);
}
render();

//pointerlock controls
let controls = new THREE.PointerLockControls(camera, document.body);
scene.add(controls.getObject())

//create cube
var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh(geometry, material);
cube.position.y = .5;
scene.add(cube);

//create and rotate floor
var geometry = new THREE.PlaneGeometry( 1000, 1000, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 'tan' } );
var floor = new THREE.Mesh( geometry, material );
floor.rotateX( - Math.PI / 2 );
scene.add(floor);

//create light
let light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
light.position.set( 0.5, 1, 0.75 );
scene.add(light);

//player meshes
let headGeo = new THREE.BoxGeometry(.52, .47, .55);
let headMat = new THREE.MeshBasicMaterial({color: 'blue', wireframe: true});
let bodyGeo = new THREE.BoxGeometry(.4, .38, .4);
let bodyMat = new THREE.MeshBasicMaterial({color: 'blue', wireframe: true});
let armGeo = new THREE.BoxGeometry(.2, .5, .2);
let armMat = new THREE.MeshBasicMaterial({color: 'blue', wireframe: true});
let legGeo = new THREE.BoxGeometry(.25, .85, .3)
let legMat = new THREE.MeshBasicMaterial({color: 'blue', wireframe: true})

//player object
let player = {
	canJump: false,	
	walk: true,
	sprint: false,
	health: 100,
	head: new THREE.Mesh(headGeo, headMat),
	body: new THREE.Mesh(bodyGeo, bodyMat),
	lowerBody: new THREE.Mesh(bodyGeo, bodyMat),
	rUparm: new THREE.Mesh(armGeo, armMat),
	rForearm: new THREE.Mesh(armGeo, armMat),
	lUparm: new THREE.Mesh(armGeo, armMat),
	lForearm: new THREE.Mesh(armGeo, armMat),
	rLeg: new THREE.Mesh(legGeo, legMat),
	lLeg: new THREE.Mesh(legGeo, legMat),
}
player.head.position.x = 2;
player.head.position.y = 1.94;

player.body.position.x = 2;
player.body.position.y = 1.5;

player.lowerBody.position.x = 2;
player.lowerBody.position.y = 1.2

player.rUparm.position.x = 1.6;
player.rUparm.position.y = 1.4;
player.rUparm.rotateZ(2.5)

player.rForearm.position.x = 1.45;
player.rForearm.position.y = 1.2;
player.rForearm.rotateZ(2.5)

player.lUparm.position.x = 2.4;
player.lUparm.position.y = 1.4;
player.lUparm.rotateZ(-2.5)

player.lForearm.position.x = 2.55;
player.lForearm.position.y = 1.2;
player.lForearm.rotateZ(-2.5)

player.rLeg.position.x = 1.9
player.rLeg.position.y = .6

player.lLeg.position.x = 2.1
player.lLeg.position.y = .6

scene.add(player.head);
scene.add(player.body);
scene.add(player.lowerBody)
scene.add(player.rUparm);
scene.add(player.rForearm);
scene.add(player.lUparm);
scene.add(player.lForearm);
scene.add(player.rLeg)
scene.add(player.lLeg)

//animation loop
function cycle() {
	
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
	//whilst sprinting
	if (keys[87] && player.sprint) {
		controls.moveForward(.19);
	}
	if (keys[65] && player.sprint) {
		controls.moveForward(-.06);
	}
	if (keys[68] && player.sprint) {
		controls.moveForward(.06);
	}
	
	//lockPlayer();
	render();
	controls.lock();
	requestAnimationFrame(cycle);
}
requestAnimationFrame(cycle);

function lockPlayer() {
	player.head.position.x = camera.position.x
	player.head.position.y = camera.position.y
	player.head.position.z = camera.position.z
}