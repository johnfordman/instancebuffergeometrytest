import ft from '../textures/nightsky_ft.png'
import bk from '../textures/nightsky_bk.png'
import up from '../textures/nightsky_up.png'
import dn from '../textures/nightsky_dn.png'
import rt from '../textures/nightsky_rt.png'
import lf from '../textures/nightsky_lf.png'

export default class Skybox {
  constructor(scene){
    this.scene = scene
    this.init()
  }	
  
  init() {
    const geometry = new THREE.CubeGeometry( 800, 800, 800 )
    const cubeMaterials = [
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( ft ), side: THREE.DoubleSide }), //front side
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( bk ), side: THREE.DoubleSide }), //back side
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( up ), side: THREE.DoubleSide }), //up side
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( dn ), side: THREE.DoubleSide }), //down side
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( rt ), side: THREE.DoubleSide }), //right side
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( lf ), side: THREE.DoubleSide }) //left side
    ]

    const cubeMaterial = new THREE.MeshFaceMaterial( cubeMaterials )
    const cube = new THREE.Mesh( geometry, cubeMaterial )
    this.scene.add( cube )
  }

}