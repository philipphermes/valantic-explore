import * as RE from 'rogue-engine';
import * as THREE from 'three'

export default class VideoPlayer extends RE.Component {
  @RE.props.text() videoUrl: string;
  @RE.props.num(0, 1) volume: number = 0.25;

  start() {
    const video = document.createElement( 'video' );
    video.src = this.videoUrl
    video.classList.add('videoPlayer')
    video.loop = true
    video.volume = this.volume
    video.setAttribute('type', "video/mp4")
    document.body.appendChild(video)

    const texture = new THREE.VideoTexture(video);

    texture.needsUpdate;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;

    const material =  new THREE.MeshBasicMaterial({ map: texture })

    video.load();

    /* @ts-ignore */
    this.object3d.material = material
  }
}

RE.registerComponent(VideoPlayer);