//create render
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//create scene, clock, camera
let scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);

let camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
camera.position.z = 5;
camera.position.y = 1

let clock = new THREE.Clock();

//function for rendering
function render() {
	renderer.render(scene, camera);
	
}
render();

//fp controls
let controls = new THREE.PointerLockControls(camera, document.body);
controls.isLocked = true;
scene.add(controls.getObject())

//create cube
var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//floor


//animation loop
function cycle() {
	requestAnimationFrame(cycle);
	render();
	
	
}
requestAnimationFrame(cycle);