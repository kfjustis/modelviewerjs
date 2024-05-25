import initPage from './init';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

initPage();

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const clock = new THREE.Clock();
let mixer;

/* all our JavaScript code goes here */
var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x5a5f69);

var camera = new THREE.PerspectiveCamera(70, WIDTH/HEIGHT);
camera.position.z = 50;
scene.add(camera);

// Set orbit controls.
const controls = new OrbitControls( camera, renderer.domElement);
controls.update();

var boxGeometry = new THREE.BoxGeometry(10, 10, 10);
var basicMaterial = new THREE.MeshBasicMaterial({color: 0x0095DD});
var cube = new THREE.Mesh(boxGeometry, basicMaterial);
scene.add(cube);
cube.rotation.set(0.4, 0.2, 0);

// Drop handler also loads new models.
document.body.addEventListener("drop", function(event){
    event.preventDefault();
    var files = event.dataTransfer.files;
    if (files.length < 1) {
        return;
    }
    // Always grab just the first file for simplicity.
    var file = event.dataTransfer.files[0];

    if (!file.name.endsWith(".fbx")) {
        return;
    }

    loadModel(file);
});

function loadModel(file) {
    console.log("loading model... " + file.name);

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
        const loader = new FBXLoader();
        loader.load(e.target.result, function(obj) {
            // Load and play animation, if any.
            if (obj.animations[0]) {
                mixer = new THREE.AnimationMixer(obj);
                console.log(obj);
                const action = mixer.clipAction(obj.animations[0]);
                action.play();
            }

            obj.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = false;
                    child.receiveShadow = false;
                }
            });
            scene.add(obj);
        });
    }
}

function render() {
    requestAnimationFrame(render);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    renderer.render(scene, camera);
}
render();