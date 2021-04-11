import {
  Camera, Mesh, NearestFilter, PlaneGeometry, RawShaderMaterial, Scene,
  Vector2, WebGLRenderTarget,
} from 'three';

import baseVertShader from '@/shaders/base.vert.glsl';
import baseFragShader from '@/shaders/base.frag.glsl';

export default class ShaderScene {
  constructor({
    vertexShader = baseVertShader,
    fragmentShader = baseFragShader,
    width = window.innerWidth,
    height = window.innerHeight,
    uniforms = {
    },
  } = {}) {
    this.inTarget = new WebGLRenderTarget(width, height, {
      magFilter: NearestFilter,
      minFilter: NearestFilter,
    });
    this.outTarget = new WebGLRenderTarget(width, height, {
      magFilter: NearestFilter,
      minFilter: NearestFilter,
    });

    this.uniforms = uniforms;
    this.uniforms.tx = { type: 'sampler2D', value: null };
    this.uniforms.resolution = { type: 'v2', value: new Vector2(width, height) };

    this.camera = new Camera();
    this.camera.position.z = 1;

    this.scene = new Scene();

    const material = new RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
    });

    const mesh = new Mesh(new PlaneGeometry(2, 2), material);
    this.scene.add(mesh);
  }

  render(renderer) {
    this.uniforms.tx.value = this.inTarget.texture;
    renderer.setRenderTarget(this.outTarget);
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(null);

    // Resize phase 2
    // Only resize inTarget after rendering
    if (this.outTarget.width !== this.inTarget.width
      || this.outTarget.height !== this.inTarget.height) {
      this.inTarget.setSize(
        this.outTarget.width,
        this.outTarget.height,
      );
    }

    // Swap targets
    const tempTarget = this.outTarget;
    this.outTarget = this.inTarget;
    this.inTarget = tempTarget;

    return tempTarget.texture;
  }

  onResize(width, height) {
    // Only resize the outTarget to not lose data from the inTarget.
    this.outTarget.setSize(width, height);
    this.uniforms.resolution.value.x = width;
    this.uniforms.resolution.value.y = height;
  }
}
