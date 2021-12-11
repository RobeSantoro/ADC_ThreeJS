import './style.css'
import * as THREE from 'three'

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

const params = {
  envMap: 'EXR',
  roughness: 0.0,
  metalness: 0.0,
  exposure: 1.0,
  debug: false,
};

let container, stats;
let camera, scene, renderer, controls;
let exrCubeRenderTarget;
let exrBackground;

init();
animate();

function init() {

  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 0, 120);

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();


  THREE.DefaultLoadingManager.onLoad = function () {

    pmremGenerator.dispose();

  };

  new EXRLoader()
    .setDataType(THREE.UnsignedByteType)
    .load('assets/stone_alley_1k.exr', function (texture) {

      exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
      exrBackground = exrCubeRenderTarget.texture;

      texture.dispose();

    });

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;

  stats = new Stats();
  container.appendChild(stats.dom);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 50;
  controls.maxDistance = 300;

  window.addEventListener('resize', onWindowResize);

  const gui = new GUI();

  gui.add(params, 'roughness', 0, 1, 0.01);
  gui.add(params, 'metalness', 0, 1, 0.01);
  gui.add(params, 'exposure', 0, 2, 0.01);
  gui.add(params, 'debug', false);
  gui.open();

}

function onWindowResize() {

  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

}

function animate() {

  requestAnimationFrame(animate);

  stats.begin();
  render();
  stats.end();

}

function render() {


  //let newEnvMap = torusMesh.material.envMap;
  let background = scene.background;

  //newEnvMap = exrCubeRenderTarget ? exrCubeRenderTarget.texture : null;
  background = exrBackground;

  scene.background = background;
  renderer.toneMappingExposure = params.exposure;

  renderer.render(scene, camera);

}