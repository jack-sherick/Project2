import {FirstPersonControls} from "./jsm/controls/FirstPersonControls.js"

//create scene
let scene = new THREE.Scene();
scene.background = new THREE.Color( 0xbfd1e5 );

//create camera
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

//controls
let controls = new FirstPersonControls(camera, render.domElement);

//create clock
let clock = new THREE.Clock();

//create world
var worldWidth = 256, worldDepth = 256,
worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

//create render
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//center camera
camera.position.x = 100;
camera.position.y = 10;
camera.position.z = 10;
camera.lookAt(new THREE.Vector3(0, 0, 0));

//lighting
var ambientLight = new THREE.AmbientLight(0x383838);
scene.add(ambientLight);

//animation cycle
let animate = function () {
	requestAnimationFrame(animate);

	

	renderer.render(scene, camera);
};

animate();