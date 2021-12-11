import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper'

let camera, scene, renderer;

init();
render();

function init() {

  const container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
  camera.position.set(0, -1, 3);

  scene = new THREE.Scene();

  new RGBELoader().setPath('assets/').load('royal_esplanade_1k.hdr', function (texture) {

      texture.mapping = THREE.EquirectangularReflectionMapping;

      scene.background = texture;
      scene.environment = texture;

      render();

      // model

      // use of RoughnessMipmapper is optional
      const roughnessMipmapper = new RoughnessMipmapper(renderer);

      const loader = new GLTFLoader().setPath('assets/');
      loader.load('Logo.gltf', function (gltf) {

        gltf.scene.traverse(function (child) {

          if (child.isMesh) {

            roughnessMipmapper.generateMipmaps(child.material);

          }

        });

        scene.add(gltf.scene);

        roughnessMipmapper.dispose();

        render();

      });

    });

    
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set(0, 0, - 0.2);
  controls.update();

  window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();

}

//

function render() {

  renderer.render(scene, camera);
  console.log(camera.position);

}