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

//player object
let player = {
	canJump: false,	
	walk: true,
	sprint: false,
	health: 100
}

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
	
	render();
	controls.lock();
	requestAnimationFrame(cycle);
}
requestAnimationFrame(cycle);