import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
import { TeapotBufferGeometry } from './TeapotBufferGeometry.js';

var camera, scene, renderer;
var cameraControls;
var effectController;
var teapotSize = 400;
var ambientLight, light;
var tess = - 1;
var bBottom;
var bLid;
var bBody;
var bFitLid;
var bNonBlinn;
var shading;
var reflectiveMaterial;
var teapot, textureCube;

init();
render();

function init() {
    var container = document.createElement('div');
    document.getElementById('canvas').appendChild(container);
    var canvasWidth = window.innerWidth / 1.5;
    var canvasHeight = window.innerHeight / 1.5;
    // CAMERA
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 80000);
    camera.position.set(- 600, 550, 1300);
    // LIGHTS
    ambientLight = new THREE.AmbientLight(0x333333);	// 0.2
    light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    // direction is set in GUI
    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    container.appendChild(renderer.domElement);
    // EVENTS
    window.addEventListener('resize', onWindowResize, false);
    // CONTROLS
    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.addEventListener('change', render);

    // REFLECTION MAP
    var path = "./img/";
    var urls = [
        path + "px.png", path + "nx.png",
        path + "py.png", path + "ny.png",
        path + "pz.png", path + "nz.png"
    ];
    textureCube = new THREE.CubeTextureLoader().load(urls);
    // MATERIALS
    var materialColor = new THREE.Color();
    materialColor.setRGB(1.0, 1.0, 1.0);
    reflectiveMaterial = new THREE.MeshPhongMaterial({ color: materialColor, envMap: textureCube, side: THREE.DoubleSide });
    // scene itself
    scene = new THREE.Scene();
    scene.background = textureCube;
    scene.add(ambientLight);
    scene.add(light);

    effectController = {
        shininess: 40.0,
        ka: 0.17,
        kd: 0.51,
        ks: 0.2,
        metallic: true,
        hue: 0.121,
        saturation: 0.73,
        lightness: 0.66,
        lhue: 0.04,
        lsaturation: 0.01,	// non-zero so that fractions will be shown
        llightness: 1.0,
        // bizarrely, if you initialize these with negative numbers, the sliders
        // will not show any decimal places.
        lx: 0.32,
        ly: 0.39,
        lz: 0.7,
        newTess: 15,
        bottom: true,
        lid: true,
        body: true,
        fitLid: false,
        nonblinn: false,
        newShading: "glossy"
    };
}
// EVENT HANDLERS
function onWindowResize() {
    var canvasWidth = window.innerWidth / 1.25;
    var canvasHeight = window.innerHeight / 1.25;
    renderer.setSize(canvasWidth, canvasHeight);
    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();
    render();
}

function render() {
    if (effectController.newTess !== tess ||
        effectController.bottom !== bBottom ||
        effectController.lid !== bLid ||
        effectController.body !== bBody ||
        effectController.fitLid !== bFitLid ||
        effectController.nonblinn !== bNonBlinn ||
        effectController.newShading !== shading) {
        tess = effectController.newTess;
        bBottom = effectController.bottom;
        bLid = effectController.lid;
        bBody = effectController.body;
        bFitLid = effectController.fitLid;
        bNonBlinn = effectController.nonblinn;
        shading = effectController.newShading;
        createNewTeapot();
    }
    // skybox is rendered separately, so that it is always behind the teapot.
    scene.background = textureCube;
    renderer.render(scene, camera);
}
// Whenever the teapot changes, the scene is rebuilt from scratch (not much to it).
function createNewTeapot() {
    if (teapot !== undefined) {
        teapot.geometry.dispose();
        scene.remove(teapot);
    }
    var teapotGeometry = new TeapotBufferGeometry(teapotSize,
        tess,
        effectController.bottom,
        effectController.lid,
        effectController.body,
        effectController.fitLid,
        !effectController.nonblinn);

    teapot = new THREE.Mesh(teapotGeometry, reflectiveMaterial);
    scene.add(teapot);
}