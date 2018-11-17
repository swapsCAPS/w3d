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
  DirectionalLight,
  PointLight,
  SpotLight,
  PointLightHelper,
  SpotLightHelper,
  CubeTextureLoader,
  TextureLoader,
  RepeatWrapping,
  Vector3,
} from 'three'
import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'

import './stylesheet.less'

import * as envMapImg from './assets/env-map.jpg'


const ASPECT_RATIO = window.innerWidth / window.innerHeight
const NEAR         = 0.1
const FAR          = 10000
const VIEW_ANGLE   = 75

const renderer = new WebGLRenderer( { antialias: true } )

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

const cube  = new Mesh(
  new BoxGeometry( 50, 50, 50 ),
  new MeshLambertMaterial( { color: 0x555555 } )
)
cube.position.set(0, 0, 120)
cube.receiveShadow = true
cube.castShadow = true

const aLight = new AmbientLight( 0xFFFFFF, 0.5)
aLight.position.set( 0, 0, 1000 )

const dLight = new DirectionalLight( 0xFFFFFF, 0.5)
dLight.position.set( 0, 0, 1000 )
dLight.castShadow = true

const spLight1 = new SpotLight( 0x4FFFFFF, 0.2, 1000, 0.5, 0.1, 0.5 )
const spLight2 = new SpotLight( 0x4FFFFFF, 0.2, 1000, 0.5, 0.1, 0.5 )

spLight1.position.set( 150, 150, 300 )
spLight1.lookAt(cube.position)
spLight1.castShadow = true

spLight2.position.set( -150, 150, 300 )
spLight2.lookAt(cube.position)
spLight2.castShadow = true

const spLightHelper1 = new SpotLightHelper( spLight1 )
const spLightHelper2 = new SpotLightHelper( spLight2 )

const scene = new Scene()
scene.add( aLight )
// scene.add( dLight )
scene.add( spLight1 )
scene.add( spLight2 )
// scene.add( spLightHelper1 )
// scene.add( spLightHelper2 )
scene.add( floor )
scene.add( cube )

const camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR, FAR)
camera.up = new Vector3( 0, 0, 1 )
camera.position.set(150, 250, 200)
camera.lookAt(cube.position)
window.onkeydown = ({keyCode}) => {
  console.log('keyCode', keyCode)
  switch(keyCode) {
    case 87:
      camera.position.y += 2
      break
    case 83:
      camera.position.y -= 2
      break
    case 65:
      camera.position.x -= 2
      break
    case 68:
      camera.position.x += 2
      break
    case 33:
      camera.position.z += 2
      break
    case 34:
      camera.position.z -= 2
      break

  }
  camera.lookAt(cube.position)
}

const scaleFrom = { x: 1,   y: 1,   z: 1 }
const scaleTo   = { x: 1.8, y: 1.8, z: 1.8 }
const scale     = { x: 1,   y: 1,   z: 1 }
const breathIn  = new TWEEN.Tween( scale ).easing(TWEEN.Easing.Quadratic.Out).to( scaleTo, 3500 )
const breathOut = new TWEEN.Tween( scale ).easing(TWEEN.Easing.Quadratic.Out).to( scaleFrom, 2000 )
const breathHandler = () => {
  cube.scale.x = scale.x
  cube.scale.y = scale.y
  cube.scale.z = scale.z
}
breathIn.onUpdate(breathHandler)
breathOut.onUpdate(breathHandler)
breathIn.chain(breathOut)
breathOut.chain(breathIn)
breathIn.start()

function animate() {
  requestAnimationFrame( animate )
  TWEEN.update()


  renderer.render( scene, camera )
}
animate()

