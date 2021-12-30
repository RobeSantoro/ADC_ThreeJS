import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// Import Statistic module
import Stats from 'three/examples/jsm/libs/stats.module'
const stats = Stats()
document.body.appendChild(stats.dom)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
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

// Base camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Sampler
let vertices = null
let Points = null

// Add GLTF Object
const loader = new GLTFLoader()

loader.load(
  './assets/LogoMerged.gltf',

  // called when the resource is loaded
  (gltf) => {

    gltf.scene.traverse((child) => {

      if (child.name === 'LogoMergedRemesh') {

        child.material = new THREE.PointsMaterial({
          size: 0.1,
          vertexColors: THREE.VertexColors,
          sizeAttenuation: false
        })

        vertices = child.geometry.attributes.position.array
        Points = new THREE.Points(child.geometry, child.material)
        scene.add(Points)
      }

    })

  }
)

// Add lights
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(5, 7, 10)
scene.add(light)


// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;


// Animate 
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - lastElapsedTime
  lastElapsedTime = elapsedTime

  //FPS
  //console.log(Math.round(1/deltaTime));

  // 



  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Stats update
  stats.update()

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()