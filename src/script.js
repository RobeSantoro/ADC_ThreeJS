import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'

// Sizes
 const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

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
controls.dampingFactor = 0.25
controls.autoRotate = true
controls.autoRotateSpeed = 2

//************************************ 
// Create a Geometry Buffer and Points 
//************************************ 

const group = new THREE.Group();
scene.add(group);

// The geometry of the points 
const sparklesGeometry = new THREE.BufferGeometry()
// The material of the points 
const sparklesMaterial = new THREE.PointsMaterial({
  size: .1,
  alphaTest: 0.2,
  map: new THREE.TextureLoader().load('./assets/textures/particle.png'),
  vertexColors: true // Let Three.js knows that each point has a different color
});

// Create a Points object 
const points = new THREE.Points(sparklesGeometry, sparklesMaterial)

// Add the points into the scene 
group.add(points)


//******************************
// Create the AddPoint function
//******************************

// Vector to sample a random point 
const tempPosition = new THREE.Vector3();
// Define the colors we want 
const palette = [new THREE.Color("#FEDD23"), new THREE.Color("#F24361"), new THREE.Color("#99248F"), new THREE.Color("#662D91")];

// Used to store each particle coordinates & color 
const vertices = []
const colors = []

function addPoint() {
  // Sample a new point 
  sampler.sample(tempPosition);
  // Push the point coordinates 
  vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
  // Update the position attribute with the new coordinates 
  sparklesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3)  );
  
  // Get a random color from the palette 
  const color = palette[Math.floor(Math.random() * palette.length)];
  // Push the picked color 
  colors.push(color.r, color.g, color.b);
  // Update the color attribute with the new colors 
  sparklesGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
}

//******************* 
// Logo Mesh Sampling 
//******************* 

let logo = null
let sampler = null

// Add GLTF Object
new GLTFLoader().load(
  './assets/LogoMergedClean.glb', ( gltf ) => {

    // Get the buffered geometry of rhe faces
    logo = gltf.scene.children[0].children[1]

    logo.material = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0x505050,
      transparent: true,
      opacity: 0.05,      
      depthWrite: false      
    })

    // Create a surface sampler from the loaded model 
    sampler = new MeshSurfaceSampler(logo).build()

    // Start the rendering loop 
    renderer.setAnimationLoop(tick()) // Not sure what this does
    
    scene.add(gltf.scene)

  },
  undefined,
  (xhr) => { console.log((xhr.loaded / xhr.total * 100) + '% loaded') },
  (error) => { console.log(error) }
)




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
renderer.setClearColor(0x101010, 0)

// Stats
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

// Animate
const clock = new THREE.Clock()
let lastElapsedTime = 0
let FPS = 0

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - lastElapsedTime
  lastElapsedTime = elapsedTime

  //FPS
  FPS = Math.round(1/deltaTime)

  if (vertices.length < 10000) {
    addPoint()
    addPoint()    
  }

  // Update stats
  stats.update()
 
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)  

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()


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
