import _ from 'underscore'
import {
  AmbientLight,
  AnimationMixer,
  AnimationObjectGroup,
  BasicShadowMap,
  BoxGeometry,
  Clock,
  CubeTextureLoader,
  DirectionalLight,
  Fog,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  PointLightHelper,
  RepeatWrapping,
  Scene,
  SpotLight,
  SpotLightHelper,
  TextureLoader,
  Vector3,
  WebGLRenderer,
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
let fogFar       = 950

const renderer   = new WebGLRenderer( { antialias: true } )
const scene      = new Scene()
const gltfLoader = new GLTFLoader()
const mixer      = new AnimationMixer( scene )
const clock      = new Clock()
scene.fog = new Fog(0x555555, NEAR, fogFar)

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

let   aLightIntensity = 0.5
const aLight = new AmbientLight( 0xFFFFFF, aLightIntensity)
aLight.position.set( 0, 0, 100 )

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

scene.add( dLight )
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

      aLight.intensity += 0.2
      console.log('aLight.intensity', aLight.intensity)
      break
    case 34:
      aLight.intensity -= 0.2
      console.log('aLight.intensity', aLight.intensity)
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

      node.material = new MeshLambertMaterial({
        color:             0xe6e6e6,
        side: THREE.DoubleSide,
      })
      node.castShadow    = true
      node.receiveShadow = true
    }
  })
  scene.add( smallScene )

  big.position.set( 0, 0, 50 )
  big.traverse((node) => {
    if (node instanceof Mesh) {
      node.material = new MeshLambertMaterial({
        color:             0xe6e6e6,
        side: THREE.DoubleSide,
      })
      node.castShadow    = true
      node.receiveShadow = true
    }
  })
  scene.add( big )

  const icoScene = ico.scene
  icoScene.position.set(0, 0, 50)
  icoScene.castShadow    = false
  icoScene.receiveShadow = false

  icoScene.traverse((node) => {
    if (node instanceof Mesh) {
      node.material = new MeshLambertMaterial({
        color:             'white',
        emissive:          '#2cbee7',
        emissiveIntensity: 2.5,
      })
    }
  })

  const pLight = new THREE.PointLight( 0x2cbee7, 0.0001, 0.0001 )
  pLight.castShadow = true
  const pLightHelper1 = new PointLightHelper( pLight )

  scene.add( icoScene )
  scene.add( pLight )
  // scene.add( pLightHelper1 )


  const animationGroup = new AnimationObjectGroup(icoScene, pLight, pLightHelper1)
  console.log('animationGroup', animationGroup)
  console.log('ico', ico)
  mixer.clipAction( ico.animations[0], animationGroup ).setDuration(2).play()
  mixer.clipAction( ico.animations[0], pLight ).setDuration(2).play()
  mixer.clipAction( small.animations[0], smallScene ).setDuration(4).play()

  scene.add( aLight )

  function animate() {
    requestAnimationFrame( animate )
    render()
  }
  animate()

  function render() {
    mixer.update( clock.getDelta() )
    TWEEN.update()

    pLight.position.z += 50

    camera.lookAt(new Vector3(0, 0, 37))
    renderer.render( scene, camera )
  }
})

