import * as THREE from '/js/three.module.js';
import { OrbitControls } from '/js/controls.js';
import { TeapotBufferGeometry } from '/data/teapotGeometry.js';

const canvas = document.getElementById('canvas');
const scaleWindow = 1.25;
const sceneImages = [
    "./img/px.png", "./img/nx.png",
    "./img/py.png", "./img/ny.png",
    "./img/pz.png", "./img/nz.png"
];
let canvasWidth = window.innerWidth / scaleWindow;
let canvasHeight = window.innerHeight / scaleWindow;
let rotation = 1;
let isExploring = false;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasWidth, canvasHeight);
renderer.gammaInput = true;
renderer.gammaOutput = true;
canvas.appendChild(renderer.domElement);

let camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100000);
camera.position.set(0, 500, 3000);

let background = new THREE.CubeTextureLoader().load(sceneImages);
let teapotColor = new THREE.Color().setRGB(1.0, 1.0, 1.0);
let reflectionTexture = new THREE.MeshPhongMaterial({ color: teapotColor, envMap: background, side: THREE.DoubleSide });
let ambientLight = new THREE.AmbientLight(0x333333);
let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
let teapotGeometry = new TeapotBufferGeometry(400, 15, true, true, true, false, true);
let teapot = new THREE.Mesh(teapotGeometry, reflectionTexture);

let scene = new THREE.Scene();
scene.add(ambientLight);
scene.add(light);
scene.add(teapot);
scene.background = background;
render();

let cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.minDistance = 1000;
cameraControls.maxDistance = 5000;
cameraControls.addEventListener('change', () => renderer.render(scene, camera));

window.addEventListener('resize', () => {
    let canvasWidth = window.innerWidth / scaleWindow;
    let canvasHeight = window.innerHeight / scaleWindow;
    renderer.setSize(canvasWidth, canvasHeight);
    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera)
}, false);

document.getElementById('explore').addEventListener('click', () => {
    if(isExploring === false){
        isExploring = true;
        document.getElementById('explore').innerHTML = 'Rotate';
    }
    else{
        isExploring = false;
        document.getElementById('explore').innerHTML = 'Explore';
    }
}, false);

function render() {
    requestAnimationFrame( render );
    if(isExploring === false){
        rotation += 0.001;
        camera.position.x = Math.sin(rotation) * 3000;
        camera.position.z = Math.cos(rotation) * 3000;
        camera.lookAt( scene.position );
    }
    renderer.render( scene, camera );
}