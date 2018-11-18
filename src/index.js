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
import { GLTFLoader } from 'three/examples/js/loaders/GLTFLoader'
import async from 'async'


import './stylesheet.less'

import * as envMapImg from './assets/env-map.jpg'

import * as cubeBig from './assets/gltfs/cube-big.gltf'
import * as cubeSmall from './assets/gltfs/cube-small.gltf'

const errorHandler = (error) => {
  console.error(error)
}


const ASPECT_RATIO = window.innerWidth / window.innerHeight
const NEAR         = 0.1
const FAR          = 10000
const VIEW_ANGLE   = 75

const renderer = new WebGLRenderer( { antialias: true } )
const scene = new Scene()

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
scene.add( floor )

const loader = new GLTFLoader()
async.parallel({
  cSmall: (cb) => {
    loader.load(cubeSmall, (gltf) => {
      cb(null, gltf.scene)
    }, undefined, cb)
  },

  cBig: (cb) => {
    loader.load(cubeBig, (gltf) => {
      cb(null, gltf.scene)
    }, undefined, cb)
  },

}, (error, { cSmall, cBig } = {}) => {
  cSmall.position.set( 0, 0, 50 )
  scene.add( cSmall )

  cBig.position.set( 0, 0, 50 )
  scene.add( cBig )

  const rotate = () => {
    cSmall.rotation.z += 0.005
    setTimeout(rotate, 10)
  }
  rotate()
})

const aLight = new AmbientLight( 0xFFFFFF, 0.5)
aLight.position.set( 0, 0, 1000 )

const dLight = new DirectionalLight( 0xFFFFFF, 0.5)
dLight.position.set( 0, 0, 1000 )
dLight.castShadow = true

const spLight1 = new SpotLight( 0x4FFFFFF, 0.2, 1000, 0.5, 0.1, 0.5 )
const spLight2 = new SpotLight( 0x4FFFFFF, 0.2, 1000, 0.5, 0.1, 0.5 )

spLight1.position.set( 150, 150, 300 )
spLight1.lookAt(floor.position)
spLight1.castShadow = true

spLight2.position.set( -150, 150, 300 )
spLight2.lookAt(floor.position)
spLight2.castShadow = true

const spLightHelper1 = new SpotLightHelper( spLight1 )
const spLightHelper2 = new SpotLightHelper( spLight2 )

scene.add( aLight )
// scene.add( dLight )
scene.add( spLight1 )
scene.add( spLight2 )
// scene.add( spLightHelper1 )
// scene.add( spLightHelper2 )

const camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR, FAR)
camera.up = new Vector3( 0, 0, 1 )
camera.position.set(66, 130, 112)
camera.lookAt(floor.position)
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
  console.log(camera.position)
}

const scaleFrom = { x: 1,   y: 1,   z: 1 }
const scaleTo   = { x: 1.8, y: 1.8, z: 1.8 }
const scale     = { x: 1,   y: 1,   z: 1 }
const breathIn  = new TWEEN.Tween( scale ).easing(TWEEN.Easing.Quadratic.Out).to( scaleTo, 3500 )
const breathOut = new TWEEN.Tween( scale ).easing(TWEEN.Easing.Quadratic.Out).to( scaleFrom, 2000 )
const breathHandler = () => {
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

