import _ from 'underscore'
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AmbientLight,
  CubeTextureLoader,
  TextureLoader,
  RepeatWrapping,
} from 'three'

import './stylesheet.less'

import * as envMapImg from './assets/env-map.jpg'

const scene  = new Scene()
const camera = new PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
)

const renderer = new WebGLRenderer()

renderer.setSize( window.innerWidth, window.innerHeight )

document.body.appendChild( renderer.domElement )

const geometry = new BoxGeometry( 1, 1, 1 )

const envMapLoader = new CubeTextureLoader()
const textureCube = envMapLoader.load([
  envMapImg,
  envMapImg,
  envMapImg,
  envMapImg,
  envMapImg,
  envMapImg,
])

const material = new MeshStandardMaterial({
  color: "",
  opacity: 0.5,
  roughness: 1.0,
  metalness: 0.0,
  emmisive: "tomato",
  envMap: textureCube,
})

const texture = new TextureLoader().load(envMapImg)
texture.wrapS = RepeatWrapping
texture.wrapT = RepeatWrapping

const newMaterial = new MeshBasicMaterial({
  map: texture
})

const light = new AmbientLight( 0x404040 ); // soft white light
const cube     = new Mesh( geometry, newMaterial )

scene.add( cube )
scene.add( light );

camera.position.z = 5

// Start rendering, it doesnt do anyting otherwise : )

function animate() {
  requestAnimationFrame( animate )

  // Animatiawns!

  cube.rotation.x += (_.random(1, 5) * 0.00125) // random() === cube.drunk
  cube.rotation.y += (_.random(1, 5) * 0.00125)


  renderer.render( scene, camera )
}
animate()

