import {
  Camera,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Scene,
  WebGLRenderer,
} from 'three';

import ShaderScene from './shader';

export default class Render {
  constructor({
    domElement = document.body,
    width = window.innerWidth,
    height = window.innerHeight,
    scale = 4,
  } = {}) {
    this.scale = scale;

    // Create the renderer
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(width, height);
    domElement.appendChild(this.renderer.domElement);

    // Create camera
    this.camera = new Camera();
    this.camera.position.z = 1;

    // Create scene
    this.scene = new Scene();

    this.shader = new ShaderScene({
      width: width / this.scale,
      height: height / this.scale,
    });

    this.material = new MeshBasicMaterial({
      map: null,
    });
    const mesh = new Mesh(new PlaneGeometry(2.0, 2.0), this.material);
    this.scene.add(mesh);
  }

  render() {
    const texture = this.shader.render(this.renderer);
    this.material.map = texture;
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  }

  onResize(width, height) {
    this.renderer.setSize(width, height);
    this.shader.onResize(width / this.scale, height / this.scale);
  }
}
