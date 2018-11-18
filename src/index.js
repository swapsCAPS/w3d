import _ from 'underscore'
import {
  BoxGeometry,
  BasicShadowMap,
  PCFSoftShadowMap,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshLambertMaterial,
  Clock,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  Object3D,
  Group,
  PointLight,
  SpotLight,
  PointLightHelper,
  SpotLightHelper,
  AnimationMixer,
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

import * as cubeBig   from './assets/big-cube.gltf'
import * as cubeSmall from './assets/small-cube.gltf'
import * as icoSphere   from './assets/icosphere.gltf'

const errorHandler = (error) => {
  console.error(error)
}


const ASPECT_RATIO = window.innerWidth / window.innerHeight
const NEAR         = 0.1
const FAR          = 10000
const VIEW_ANGLE   = 35

const renderer   = new WebGLRenderer( { antialias: true } )
const scene      = new Scene()
const gltfLoader = new GLTFLoader()
const mixer      = new AnimationMixer( scene )
const clock      = new Clock()

renderer.setClearColor(0x4f4f4f)
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.shadowMap.enabled = true
renderer.shadowMap.type    = PCFSoftShadowMap

// NOTE: from the docs: always configure WebGLRenderer as follows when using glTF
renderer.gammaOutput = true
renderer.gammaFactor = 2.2

// NOTE: Configured in copy-webpack-plugin
gltfLoader.setResourcePath('/bin/')

document.body.appendChild( renderer.domElement )

const floor = new Mesh(
  new THREE.PlaneGeometry( 600, 600, 600, 600 ),
  new MeshLambertMaterial( { color: 0xfcfcfc, side: THREE.DoubleSide } )
)
floor.position.set( 0, 0, 0 )
floor.receiveShadow = true
scene.add( floor )

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
// scene.add( spLight1 )
// scene.add( spLight2 )
// scene.add( spLightHelper1 )
// scene.add( spLightHelper2 )

const camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR, FAR)
camera.up = new Vector3( 0, 0, 1 )
camera.position.set(66, 218, 118)
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

async.parallel({
  small: (cb) => {
    gltfLoader.load(cubeSmall, (gltf) => {
      cb(null, gltf)
    }, undefined, cb)
  },

  big: (cb) => {
    gltfLoader.load(cubeBig, (gltf) => {
      cb(null, gltf.scene)
    }, undefined, cb)
  },

  ico: (cb) => {
    gltfLoader.load(icoSphere, (gltf) => {
      cb(null, gltf)
    }, undefined, cb)
  },

}, (error, { small, big, ico } = {}) => {
  if (error) return console.error(error)

  const smallScene = small.scene
  console.log('small', small)
  smallScene.position.set( 0, 0, 50 )
  smallScene.traverse((node) => {
    if (node instanceof Mesh) {
      node.castShadow = true
      node.receiveShadow = true
    }
  })
  scene.add( smallScene )

  big.position.set( 0, 0, 50 )
  big.traverse((node) => {
    if (node instanceof Mesh) {
      node.castShadow = true
      node.receiveShadow = true
    }
  })
  scene.add( big )

  const icoGroup = new Group()

  const icoScene = ico.scene
  icoScene.position.set(0, 0, 50)
  icoScene.castShadow    = false
  icoScene.receiveShadow = false
  const pLight = new THREE.PointLight( 0x2cbee7, 1, 1000 )
  pLight.castShadow = true
  pLight.position.set( 0, 0, 50 )
  const pLightHelper1 = new PointLightHelper( pLight )
  icoGroup.add(icoScene)
  icoGroup.add(pLight)
  icoGroup.add(pLightHelper1)

  console.log('ico', ico)
  mixer.clipAction( ico.animations[0], icoGroup ).setDuration(2).play()
  mixer.clipAction( small.animations[0], smallScene ).setDuration(4).play()
  scene.add( icoGroup )

  function animate() {
    requestAnimationFrame( animate )
    render()
  }
  animate()

  function render() {
    mixer.update( clock.getDelta() )
    TWEEN.update()

    camera.lookAt(new Vector3(0, 0, 37))
    renderer.render( scene, camera )
  }
})

