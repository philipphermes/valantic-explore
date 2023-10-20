import * as RE from 'rogue-engine';
import * as THREE from 'three'

export default class VideoPlayer extends RE.Component {
  @RE.props.text() videoUrl: string;

  start() {
    const video = document.createElement( 'video' );
    video.src = this.videoUrl
    video.classList.add('videoPlayer')
    video.loop = true
    document.body.appendChild(video)

    const texture = new THREE.VideoTexture(video);

    texture.needsUpdate;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    texture.crossOrigin = 'anonymous';

    const material =  new THREE.MeshBasicMaterial({ map: texture })

    video.load();

    this.object3d.material = material
  }
}

RE.registerComponent(VideoPlayer);