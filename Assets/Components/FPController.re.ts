import * as RE from 'rogue-engine';
import * as THREE from 'three'

export default class FPController extends RE.Component {
  //Movement Settings
  @RE.props.num(0, 20) speed = 10;
  @RE.props.num(0, 1) sensitivity = 0.1;

  //Player
  @RE.props.object3d() frontCollider;
  @RE.props.object3d() backCollider;
  @RE.props.object3d() rightCollider;
  @RE.props.object3d() leftCollider;

  @RE.props.object3d() camera;

  //Map
  @RE.props.object3d() map;

  player: any
  playerColliderBB: THREE.Box3[] = []
  objectsToCollide: THREE.Box3[] = []

  start(): void {
    this.player = this.object3d //Player

    //Hide Player Collider Material
    this.frontCollider.material.visible = false;
    this.backCollider.material.visible = false;
    this.rightCollider.material.visible = false;
    this.leftCollider.material.visible = false;

    //Create BBs for Map Objects
    const mapChilds = this.map.children
    mapChilds.forEach(child => {
      const box3 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
      box3.setFromObject(child)

      this.objectsToCollide.push(box3)
    })

    //Set player BBs
    this.setPlayerBB()

    //Lock mouse
    RE.Input.mouse.lock();
  }

  awake() {
  }

  update() {
    const deltaTime = RE.Runtime.deltaTime;

    //Collision
    this.setPlayerBB()

    let collided = {
      front: false,
      back: false,
      right: false,
      left: false,
    }

    this.objectsToCollide.forEach(objBB => {
      if (objBB.intersectsBox(this.playerColliderBB[0])) {
        collided.front = true
      }

      if (objBB.intersectsBox(this.playerColliderBB[1])) {
        collided.back = true
      }

      if (objBB.intersectsBox(this.playerColliderBB[2])) {
        collided.right = true
      }

      if (objBB.intersectsBox(this.playerColliderBB[3])) {
        collided.left = true
      }
    })

    //Movement
    const movementY = this.player.getWorldDirection(new THREE.Vector3()).normalize();
    const movementX = new THREE.Vector3(0, 1, 0).cross(movementY).normalize();

    let speedMult = 1

    if (RE.Input.keyboard.getKeyPressed("ShiftLeft")) {
      speedMult = 2
    }

    if (!collided.front && RE.Input.keyboard.getKeyPressed("KeyW")) {
      this.player.position.add(movementY.multiplyScalar(-this.speed * speedMult * deltaTime));
    }

    if (!collided.back && RE.Input.keyboard.getKeyPressed("KeyS")) {
      this.player.position.add(movementY.multiplyScalar(this.speed * deltaTime));
    }

    if (!collided.left && RE.Input.keyboard.getKeyPressed("KeyA")) {
      this.player.position.add(movementX.multiplyScalar(-this.speed * deltaTime));
    }

    if (!collided.right && RE.Input.keyboard.getKeyPressed("KeyD")) {
      this.player.position.add(movementX.multiplyScalar(this.speed * deltaTime));
    }

    //Mouse
    const mouseX = RE.Input.mouse.movementX * this.sensitivity * RE.Runtime.deltaTime
    const mouseY = RE.Input.mouse.movementY * this.sensitivity * RE.Runtime.deltaTime

    this.player.rotation.y -= mouseX
    this.camera.rotation.x -= mouseY
  }

  //PlayerBB
  setPlayerBB(): void {
    //Front
    if (this.playerColliderBB[0] === undefined) {
      const playerFrontBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
      playerFrontBB.setFromObject(this.frontCollider)

      this.playerColliderBB.push(playerFrontBB)
    } else {
      this.playerColliderBB[0].copy(this.frontCollider.geometry.boundingBox).applyMatrix4(this.frontCollider.matrixWorld)
    }

    //Back
    if (this.playerColliderBB[1] === undefined) {
      const playerBackBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
      playerBackBB.setFromObject(this.backCollider)

      this.playerColliderBB.push(playerBackBB)
    } else {
      this.playerColliderBB[1].copy(this.backCollider.geometry.boundingBox).applyMatrix4(this.backCollider.matrixWorld)
    }

    //Right
    if (this.playerColliderBB[2] === undefined) {
      const playerRightBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
      playerRightBB.setFromObject(this.rightCollider)

      this.playerColliderBB.push(playerRightBB)
    } else {
      this.playerColliderBB[2].copy(this.rightCollider.geometry.boundingBox).applyMatrix4(this.rightCollider.matrixWorld)
    }

    //Left
    if (this.playerColliderBB[3] === undefined) {
      const playerLeftBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
      playerLeftBB.setFromObject(this.leftCollider)

      this.playerColliderBB.push(playerLeftBB)
    } else {
      this.playerColliderBB[3].copy(this.leftCollider.geometry.boundingBox).applyMatrix4(this.leftCollider.matrixWorld)
    }
  }
}

RE.registerComponent(FPController);