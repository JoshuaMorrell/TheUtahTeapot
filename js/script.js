/**
 * @author Joshua Morrell / https://github.com/JoshuaMorrell
 * @author Tyrus Draper
 * @author Ryan Daly
 * @author Britton Gaul
 **/

 // three.js imports
import * as THREE from './threejs/three.module.js';
import { OrbitControls } from './threejs/controls.js';
import { TeapotBufferGeometry } from './threejs/teapotGeometry.js';

// navigation event listeners for clicking on header tabs
let tabs = Array.prototype.slice.call(document.getElementsByTagName('li'));
let pages = Array.prototype.slice.call(document.getElementsByClassName('page'));
for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', tabClick(tabs, pages, i), false);
}
function tabClick(t, p, index) {
    return () => {
        for (let i = 0; i < t.length; i++) {
            t[i].className = '';
            p[i].style.display = 'none';
        }
        t[index].className = 'is-active';
        p[index].style.display = 'block';
    };
}

// basic canvas setup for the teapot scene
const canvas = document.getElementById('canvas');
let rotation = 1;
let isExploring = false;

// canvas is 75% of full screen
const scaleWindow = 0.75; 

// images for the scene background
const sceneImages = [
    "./img/px.png", 
    "./img/nx.png",
    "./img/py.png", 
    "./img/ny.png",
    "./img/pz.png", 
    "./img/nz.png"
]; 

// calculate canvas size
let canvasWidth = window.innerWidth * scaleWindow;
let canvasHeight = window.innerHeight * scaleWindow;

// create a renderer and add to canvas
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasWidth, canvasHeight);
renderer.gammaInput = true;
renderer.gammaOutput = true;
canvas.appendChild(renderer.domElement);

// camera facing a side view of the teapot
let camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 10000);
camera.position.set(0, 500, 3000);

// load background images into cubemap, apply lighting
let background = new THREE.CubeTextureLoader().load(sceneImages);
let teapotColor = new THREE.Color().setRGB(1.0, 1.0, 1.0);
let reflectionTexture = new THREE.MeshPhongMaterial({ color: teapotColor, envMap: background, side: THREE.DoubleSide });
let ambientLight = new THREE.AmbientLight(0x333333);
let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
let teapotGeometry = new TeapotBufferGeometry(400, 15, true, true, true, false, true);
let teapot = new THREE.Mesh(teapotGeometry, reflectionTexture);

// create the label above the teapot
const labelCanvas = makeLabel();
const texture = new THREE.CanvasTexture(labelCanvas);
texture.minFilter = THREE.LinearFilter;
texture.wrapS = THREE.ClampToEdgeWrapping;
texture.wrapT = THREE.ClampToEdgeWrapping;
const labelMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
});
const label = new THREE.Object3D();
const sprite = new THREE.Sprite(labelMaterial);
sprite.scale.x = labelCanvas.width;
sprite.scale.y = labelCanvas.height;
label.add(sprite);
label.position.x = 0;
label.position.y = 600;

// create the scene on which the teapot is rendered
let scene = new THREE.Scene();
scene.add(ambientLight);
scene.add(light);
scene.add(teapot);
scene.add(label);
scene.background = background;
render();

// add camera controls with some constraints
let cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.minDistance = 1000;
cameraControls.maxDistance = 5000;
cameraControls.addEventListener('change', () => renderer.render(scene, camera));

// update canvas size when window is resized
window.addEventListener('resize', () => {
    let canvasWidth = window.innerWidth * scaleWindow;
    let canvasHeight = window.innerHeight * scaleWindow;
    renderer.setSize(canvasWidth, canvasHeight);
    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera)
}, false);

// toggle the teapot spinning when explore btn is clicked
document.getElementById('explore').addEventListener('click', () => {
    if(isExploring === false){
        isExploring = true;
        document.getElementById('explore').innerHTML = 'Rotate';
        document.getElementById('explanation').style.display = 'block';
    }
    else{
        isExploring = false;
        document.getElementById('explore').innerHTML = 'Explore';
        document.getElementById('explanation').style.display = 'none';
    }
}, false);

// an animation loop for the teapot scene
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

function makeLabel() {
    const width = 1240;
    const height = 240;

    const labelCanvas = document.createElement('canvas').getContext('2d');
    labelCanvas.font = '200px bold sans-serif';
    const textWidth = labelCanvas.measureText('The Utah Teapot').width;

    labelCanvas.canvas.width = width;
    labelCanvas.canvas.height = height;

    labelCanvas.font = '200px bold sans-serif';
    labelCanvas.textBaseline = 'middle';
    labelCanvas.textAlign = 'center';
    labelCanvas.fillStyle = 'rgba(0, 0, 0, 0.25)';

    labelCanvas.fillRect(0, 0, width, height);
    labelCanvas.translate(width / 2, height / 2);
    labelCanvas.scale(1200 / textWidth, 1);
    labelCanvas.fillStyle = 'white';
    labelCanvas.fillText('The Utah Teapot', 0, 0);

    return labelCanvas.canvas;
  }