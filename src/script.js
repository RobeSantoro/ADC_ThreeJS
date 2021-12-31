import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

// Sizes
 const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>
{
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Base camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
 
// Environment
const envMap = new THREE.CubeTextureLoader()
  .setPath('./assets/textures/cube/')
  .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])

//scene.background = envMap

// Add GLTF Object
const loader = new GLTFLoader()

loader.load(
  './assets/LogoMergedClean.gltf',
  (gltf) => {

    // Add environment map to the objects
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.material.envMap = envMap
        child.material.envMapIntensity = 1
        child.material.needsUpdate = true
      }
    })
        
    // Add model to the scene    
    scene.add(gltf.scene)
  },
  undefined,
  (error) => {
    console.error(error)
  }
)


// Add Lights
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(5, 7, 10)
scene.add(light)
const ambientLight = new THREE.AmbientLight(0x172d68, 1)
scene.add(ambientLight)

// Renderer 
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setClearColor(0x172d68, 0)

// FOG
scene.fog = new THREE.Fog(0x172d68, 0.1, 50)


// Animate
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - lastElapsedTime
  lastElapsedTime = elapsedTime

  //FPS
  //console.log(Math.round(1/deltaTime));
 
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)
  

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()