import * as THREE from './three.module.js';
import { OrbitControls } from './controls.js';
import { TeapotBufferGeometry } from './teapotGeometry.js';

const canvas = document.getElementById('canvas');
const windowScalar = 1.25;
const sceneImages = [
    "./img/px.png", "./img/nx.png",
    "./img/py.png", "./img/ny.png",
    "./img/pz.png", "./img/nz.png"
];
let canvasWidth = window.innerWidth / windowScalar;
let canvasHeight = window.innerHeight / windowScalar;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasWidth, canvasHeight);
renderer.gammaInput = true;
renderer.gammaOutput = true;
canvas.appendChild(renderer.domElement);

let camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100000);
camera.position.set(0, 500, 2000);

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
cameraControls.addEventListener('change', () => renderer.render(scene, camera));

window.addEventListener('resize', () => {
    let canvasWidth = window.innerWidth / windowScalar;
    let canvasHeight = window.innerHeight / windowScalar;
    renderer.setSize(canvasWidth, canvasHeight);
    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();
    render();
}, false);

function render() {
    requestAnimationFrame( render );
    renderer.render(scene, camera);
}