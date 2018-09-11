import utils from '../helpers/utils'
import vertShader from '../shaders/shader.vert'
import fragShader from '../shaders/shader.frag'
const THREE = require('three')
import EffectComposer from 'imports-loader?THREE=three!exports-loader?THREE.EffectComposer!three/examples/js/postprocessing/EffectComposer' // eslint-disable-line
import RenderPass from 'imports-loader?THREE=three!exports-loader?THREE.RenderPass!three/examples/js/postprocessing/RenderPass' // eslint-disable-line
import ShaderPass from 'imports-loader?THREE=three!exports-loader?THREE.ShaderPass!three/examples/js/postprocessing/ShaderPass' // eslint-disable-line
import CopyShader from 'imports-loader?THREE=three!exports-loader?THREE.CopyShader!three/examples/js/shaders/CopyShader' // eslint-disable-line
import LuminosityHighPassShader from 'imports-loader?THREE=three!exports-loader?THREE.LuminosityHighPassShader!three/examples/js/shaders/LuminosityHighPassShader' // eslint-disable-line
import UnrealBloomPass from 'imports-loader?THREE=three!exports-loader?THREE.UnrealBloomPass!three/examples/js/postprocessing/UnrealBloomPass' // eslint-disable-line
const OrbitControls = require('three-orbit-controls')(THREE)
import spark from '../textures/spark1.png'
import Skybox from './Skybox.js'

class Scene {

  constructor() {
    this.container = document.querySelector( '#main' )
    document.body.appendChild( this.container )
    this.init()
    this.initScene()
    this.initSkybox()
    this.initPostProcessing()
    this.initEvent()
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    this.onWindowResize()
    this.renderer.animate( this.render.bind(this) )
  }
  init() {
    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 )
    this.camera.position.z = 200

    // Mouse 
    this.mouse = new THREE.Vector2(0,0)
    this.direction_mouse    = new THREE.Vector3(0, 0, 0)
    this.cameraPosition_mouse = new THREE.Vector3(0, 0, 0)
    this.cameraEasing_mouse = 10

    // controls
    new OrbitControls(this.camera)
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer( { antialias: false } )
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setSize( window.innerWidth, window.innerHeight )
    this.container.appendChild( this.renderer.domElement )
  }
  initScene() {
    const bufferGeometry = new THREE.SphereBufferGeometry(1.3, 1.3, 1.3)
    // copying data from a simple box geometry, but you can specify a custom geometry if you want
    this.geometry = new THREE.InstancedBufferGeometry()
    this.geometry.attributes.position = bufferGeometry.attributes.position
    this.geometry.setIndex(bufferGeometry.index);
    this.offsets = []
    const colors = [new THREE.Color('#FFFFFF'),new THREE.Color('#0000FF'),new THREE.Color('#FF0000'), ]
    this.colors = []
    const vector = new THREE.Vector4()
    let id = 0
    const ids = []
    let x, y, z
    for ( let i = 0; i < 4500; i ++ ) {
      // offsets
      x = Math.random() * 800 - 400
      y = Math.random() * 800 - 400
      z = Math.random() * 800 - 400
      vector.set( x, y, z, 0 ).normalize()
      vector.multiplyScalar( 5 )
      this.offsets.push( x + vector.x, y + vector.y, z + vector.z )
      // this.colors.push(Math.random(), Math.random(), Math.random())
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      this.colors.push(randomColor.r, randomColor.g, randomColor.b, Math.random())
      id = i;
      ids.push(i)
    }
    const offsetAttribute = new THREE.InstancedBufferAttribute( new Float32Array( this.offsets ), 3 )
    const colorAttribute = new THREE.InstancedBufferAttribute( new Float32Array( this.colors ), 4 )
    const idAttribute = new THREE.InstancedBufferAttribute( new Float32Array( ids ), 3 )
    this.geometry.addAttribute( 'offset', offsetAttribute )
    this.geometry.addAttribute( 'color', colorAttribute )
    this.geometry.addAttribute( 'id', idAttribute )
    console.log(this.geometry);
    this.uniforms = {
      map: { value: new THREE.TextureLoader().load(spark) },
      u_time: { type: "f", value: 1.0 }
    }
    this.material = new THREE.RawShaderMaterial( {
      uniforms: this.uniforms,
      vertexShader: vertShader,
      fragmentShader: fragShader,
      side: THREE.DoubleSide,
      transparent: true
    } )
    this.mesh = new THREE.Mesh( this.geometry, this.material )
    this.scene.add( this.mesh )
  }

  initSkybox() {
    this.Skybox = new Skybox(this.scene)
  }

  initPostProcessing() {
    //POST PROCESSING
    //Create Effects Composer
    this.composer = new THREE.EffectComposer( this.renderer);
    this.composer.setSize(window.innerWidth, window.innerHeight);
    //Create Shader Passes
    this.renderScene = new RenderPass(this.scene, this.camera);
    this.copyShader = new ShaderPass(THREE.CopyShader);
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 7, .7, 0.01);
    //Add Shader Passes to Composer - order is important
    this.composer.addPass(this.renderScene);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.copyShader);
    //set last pass in composer chain to renderToScreen
    this.copyShader.renderToScreen = true;
  }

  initEvent () {
    document.addEventListener('mousemove',(e) => {
      this.mouse.x = (event.clientX / window.innerWidth- .5) * 2;
      this.mouse.y = -(event.clientY / window.innerHeight - .5) * 2;
  });
  }

  render() {
    this.material.uniforms.u_time.value += 0.025


    this.direction_mouse.subVectors(this.mouse, this.cameraPosition_mouse)
    this.direction_mouse.multiplyScalar(.06)
    this.cameraPosition_mouse.addVectors(this.cameraPosition_mouse, this.direction_mouse)
    this.camera.position.x =  this.cameraPosition_mouse.x  * this.cameraEasing_mouse * 20
    this.camera.position.y =  this.cameraPosition_mouse.y * this.cameraEasing_mouse * 20
   
    if (this.mesh) {
      //this.mesh.geometry.attributes.offset.needsUpdate = true
    }
    //this.renderer.render( this.scene, this.camera )
     this.composer.render()

  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize( window.innerWidth, window.innerHeight )
  }
}

export default Scene
