import utils from '../helpers/utils'
import vertShader from '../shaders/shader.vert'
import fragShader from '../shaders/shader.frag'
import { EffectComposer, GlitchPass, RenderPass } from 'postprocessing'
const THREE = require('three')
const OrbitControls = require('three-orbit-controls')(THREE)

class Scene {

  constructor() {
    this.container = document.querySelector( '#main' )
    document.body.appendChild( this.container )
    this.init()
    this.initScene()
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    this.onWindowResize()
    this.renderer.animate( this.render.bind(this) )
  }
  init() {
    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 )
    this.camera.position.z = 10
    // controls
    new OrbitControls(this.camera)
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer( { antialias: false } )
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setSize( window.innerWidth, window.innerHeight )
    this.container.appendChild( this.renderer.domElement )
  }
  initScene() {
    const bufferGeometry = new THREE.BoxBufferGeometry(.4, .4, .4)
    // copying data from a simple box geometry, but you can specify a custom geometry if you want
    this.geometry = new THREE.InstancedBufferGeometry()
    this.geometry.attributes.position = bufferGeometry.attributes.position
    this.offsets = []
    const vector = new THREE.Vector4()
    let id = 0
    const ids = []
    let x, y, z
    for ( let i = 0; i < 1500; i ++ ) {
      // offsets
      x = Math.random() * 800 - 400
      y = Math.random() * 800 - 400
      z = Math.random() * 800 - 400
      vector.set( x, y, z, 0 ).normalize()
      vector.multiplyScalar( 5 )
      this.offsets.push( x + vector.x, y + vector.y, z + vector.z )
      id = i;
      ids.push(i)
    }
    const offsetAttribute = new THREE.InstancedBufferAttribute( new Float32Array( this.offsets ), 3 )
    const idAttribute = new THREE.InstancedBufferAttribute( new Float32Array( ids ), 3 )
    this.geometry.addAttribute( 'offset', offsetAttribute )
    this.geometry.addAttribute( 'id', idAttribute )
    console.log(this.geometry);
    this.uniforms = {
      u_time: { type: "f", value: 1.0 }
    }
    this.material = new THREE.RawShaderMaterial( {
      uniforms: this.uniforms,
      vertexShader: vertShader,
      fragmentShader: fragShader,
      side: THREE.DoubleSide,
    } )
    this.mesh = new THREE.Mesh( this.geometry, this.material )
    this.scene.add( this.mesh )
  }

  render() {
    this.material.uniforms.u_time.value += 0.025
    if (this.mesh) {
      this.mesh.geometry.attributes.offset.needsUpdate = true
      this.mesh.geometry.attributes.position.needsUpdate = true
    }
    this.renderer.render( this.scene, this.camera )
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize( window.innerWidth, window.innerHeight )
  }
}

export default Scene
