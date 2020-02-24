let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let worldWidth = 256, worldDepth = 256,
	worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

let camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);

let clock = new THREE.Clock();

let controls = new FirstPersonControls(camera, renderer.domElement);
controls.movementSpeed = 1000;
controls.lookSpeed = 0.1;