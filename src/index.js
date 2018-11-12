import _ from 'underscore'
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'

import './stylesheet.less'

const scene  = new Scene()
const camera = new PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
)

const renderer = new WebGLRenderer()

renderer.setSize( window.innerWidth, window.innerHeight )

document.body.appendChild( renderer.domElement )

const geometry = new BoxGeometry( 1, 1, 1 )
const material = new MeshBasicMaterial( { color: "tomato" } )

const cube     = new Mesh( geometry, material )

scene.add( cube )

camera.position.z = 5

// Start rendering, it doesnt do anyting otherwise : )

function animate() {
  requestAnimationFrame( animate )

  // Animatiawns!

  cube.rotation.x += (_.random(0, 10) * 0.01)
  cube.rotation.y += (_.random(0, 20) * 0.01)


  renderer.render( scene, camera )
}
animate()

