import _ from 'underscore'
import {
  BoxGeometry,
  BasicShadowMap,
  PCFSoftShadowMap,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AmbientLight,
  PointLight,
  CubeTextureLoader,
  TextureLoader,
  RepeatWrapping,
} from 'three'
import * as THREE from 'three'

import './stylesheet.less'

import * as envMapImg from './assets/env-map.jpg'

const ASPECT_RATIO = window.innerWidth / window.innerHeight
const NEAR = 0.1
const FAR  = 10000

const scene  = new Scene()
const camera = new PerspectiveCamera(75, ASPECT_RATIO, NEAR, FAR)

const renderer = new WebGLRenderer( { antialias: false } )

renderer.setClearColor(0x4f4f4f)
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.shadowMap.enabled = true
renderer.shadowMap.type    = PCFSoftShadowMap

document.body.appendChild( renderer.domElement )

const floor = new Mesh(
  new THREE.PlaneGeometry( 600, 600, 600, 600 ),
  new MeshLambertMaterial( { color: 0xfcfcfc, side: THREE.DoubleSide } )
)
floor.position.set( 0, 0, 0 )
floor.receiveShadow = true
floor.rotation.x -= Math.PI / 2

const cube  = new Mesh(
  new BoxGeometry( 50, 50, 50 ),
  new MeshLambertMaterial( { color: 0x555555 } )
)
cube.position.set(20, 60, 20)
cube.receiveShadow = true
cube.castShadow = true

const light1 = new AmbientLight( 0xFFFFFF, 0.5 )
light1.position.set( 150, 150, 150 )
const light2 = new PointLight( 0x4FFFFFF, 0.5 )
light2.position.set( 150, 200, 150 )
light2.lookAt(cube.position)
light2.castShadow = true

scene.add( light1 )
scene.add( light2 )
scene.add( floor )
scene.add( cube )

camera.position.set(150, 250, 200)
camera.lookAt(cube.position)

// Start rendering, it doesnt do anyting otherwise : )

function animate() {
  requestAnimationFrame( animate )

  // Animatiawns!

  cube.rotation.x += 0.01 // (_.random(1, 5) * 0.00125) // random() === cube.drunk
  cube.rotation.y += 0.01 // (_.random(1, 5) * 0.00125)


  renderer.render( scene, camera )
}
animate()

