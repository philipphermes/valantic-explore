import * as RE from 'rogue-engine';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import * as THREE from 'three'

export default class PostProcessing extends RE.Component {
  @RE.props.num(0, 1) bloom_strength = 0.25
  @RE.props.num(0, 0.1) bloom_radius = 0.025
  @RE.props.num(0, 0.1) bloom_threshhold = 0.025
  @RE.props.checkbox() smaa = false

  start() {
    const scene = RE.Runtime.scene
    const camera = RE.Runtime.camera
    const renderer = RE.Runtime.renderer

    const renderScene = new RenderPass(scene, camera )
    const composer = new EffectComposer(renderer)
    composer.addPass(renderScene)

    //Bloom
    const bloom = new UnrealBloomPass(
        new THREE.Vector2(RE.Runtime.width, RE.Runtime.height),
        this.bloom_strength,
        this.bloom_radius,
        this.bloom_threshhold
    )
    composer.addPass(bloom)

    //SMAA
    if (this.smaa) {
      const smaa = new SMAAPass(RE.Runtime.width, RE.Runtime.height)
      composer.addPass(smaa)
    }

    //Replace render function
    RE.Runtime.renderFunc  = () => {
      composer.render()
    }
  }
}

RE.registerComponent(PostProcessing);