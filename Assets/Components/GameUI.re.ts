import * as RE from 'rogue-engine';
import { AudioContext } from 'three';

export default class GameUI extends RE.Component {
  private uiContainer: HTMLElement;
  private startGameUI: HTMLElement;

  public touchControls: HTMLElement
  public touchCamera: HTMLElement
  public allowPlayerMove: boolean = false
  public isTouch = false

  start() {
    AudioContext["getContext"]().suspend();

    this.uiContainer = document.getElementById("rogue-ui") as HTMLElement;

    const myCss = document.createElement("style");

    this.uiContainer.appendChild(myCss);
    this.uiContainer.style.fontFamily = "Arial";

    this.uiContainer.onclick = () => {
      this.openFullscreen();
    }
    this.createStartGameUI();
    this.createPhoneUI()
  }

  private openFullscreen() {
    if (RE.isDev()) return;

    const elem = document.getElementById("rogue-app");

    if (!elem) return;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem["mozRequestFullScreen"]) { /* Firefox */
      elem["mozRequestFullScreen"]();
    } else if (elem["webkitRequestFullscreen"]) { /* Chrome, Safari & Opera */
      elem["webkitRequestFullscreen"]();
    } else if (elem["msRequestFullscreen"]) { /* IE/Edge */
      elem["msRequestFullscreen"]();
    }
  }

  private createPhoneUI() {
    //Movement
    this.touchControls = document.createElement("div");
    this.touchControls.style.position = 'fixed'
    this.touchControls.style.left = "20px"
    this.touchControls.style.bottom = "20px"
    this.touchControls.style.width = "100px"
    this.touchControls.style.height = "100px"
    this.touchControls.style.display = "none"
    this.touchControls.style.gridTemplateColumns = "repeat(3, 1fr)"
    this.touchControls.style.gridTemplateRows = " repeat(3, 1fr)"
    this.touchControls.id = "touchControlls"

    const upButton = document.createElement('button')
    upButton.style.gridArea = "1 / 2 / 2 / 3"
    upButton.id = "touchUp"

    const downButton = document.createElement('button')
    downButton.style.gridArea = "3 / 2 / 4 / 3"
    downButton.id = "touchDown"

    const leftButton = document.createElement('button')
    leftButton.style.gridArea = "2 / 1 / 3 / 2"
    leftButton.id = "touchLeft"

    const rightButton = document.createElement('button')
    rightButton.style.gridArea = "2 / 3 / 3 / 4"
    rightButton.id = "touchRight"

    this.touchControls.appendChild(upButton)
    this.touchControls.appendChild(downButton)
    this.touchControls.appendChild(leftButton)
    this.touchControls.appendChild(rightButton)

    this.uiContainer.appendChild(this.touchControls)

    //Camera
    this.touchCamera = document.createElement("div");
    this.touchCamera.style.position = 'fixed'
    this.touchCamera.style.right = "20px"
    this.touchCamera.style.bottom = "20px"
    this.touchCamera.style.width = "100px"
    this.touchCamera.style.height = "100px"
    this.touchCamera.style.display = "none"
    this.touchCamera.style.gridTemplateColumns = "repeat(3, 1fr)"
    this.touchCamera.style.gridTemplateRows = " repeat(3, 1fr)"
    this.touchCamera.id = "touchCamera"

    const upButtonCamera = document.createElement('button')
    upButtonCamera.style.gridArea = "1 / 2 / 2 / 3"
    upButtonCamera.id = "cameraUp"

    const downButtonCamera = document.createElement('button')
    downButtonCamera.style.gridArea = "3 / 2 / 4 / 3"
    downButtonCamera.id = "cameraDown"

    const leftButtonCamera = document.createElement('button')
    leftButtonCamera.style.gridArea = "2 / 1 / 3 / 2"
    leftButtonCamera.id = "cameraLeft"

    const rightButtonCamera = document.createElement('button')
    rightButtonCamera.style.gridArea = "2 / 3 / 3 / 4"
    rightButtonCamera.id = "cameraRight"

    this.touchCamera.appendChild(upButtonCamera)
    this.touchCamera.appendChild(downButtonCamera)
    this.touchCamera.appendChild(leftButtonCamera)
    this.touchCamera.appendChild(rightButtonCamera)

    this.uiContainer.appendChild(this.touchCamera)
  }

  private createStartGameUI(): void {
    if (this.startGameUI) {
      if (this.startGameUI.style.display === "none")
        this.startGameUI.style.display = "flex";

      return
    }

    this.startGameUI = document.createElement("div");
    this.startGameUI.style.margin = "auto";
    this.startGameUI.style.textAlign = "center";
    this.startGameUI.style.height = "100%";
    this.startGameUI.style.width = "100%"
    this.startGameUI.style.backdropFilter = "blur(10px)";
    this.startGameUI.style.display = "flex";
    this.startGameUI.style.flexDirection = "column";
    this.startGameUI.style.justifyContent = "center";

    const gameTitle = document.createElement("h1");
    gameTitle.textContent = "Valantic City";
    gameTitle.style.color = "#FF4B4B";

    const playBtn = document.createElement("h2");
    playBtn.style.cursor = "pointer";
    playBtn.style.color = "#F99E49";
    playBtn.style.position = "relative";
    playBtn.textContent = "Start exploring!";

    playBtn.addEventListener('mouseenter', () => {
      playBtn.style.color = "#FF744F"
    })

    playBtn.addEventListener('mouseleave', () => {
      playBtn.style.color = "#F99E49"
    })

    playBtn.ontouchend = () => {
      this.startGameUI.style.display = "none";
      RE.Input.mouse.enabled = false;
      this.isTouch = true
      this.openFullscreen();
      this.startGame();
    };

    playBtn.onclick = () => {
      this.startGameUI.style.display = "none";
      this.startGame();
    };

    const wrapper = document.createElement('div')

    const touchToggle = document.createElement('input')
    touchToggle.setAttribute('type', 'checkbox')
    touchToggle.id = "touchToggle"

    const toggleTouch = (): void => {
      if (this.touchControls.style.display === 'none') {
        this.touchControls.style.display = "grid"
      } else {
        this.touchControls.style.display = "none"
      }

      if (this.touchCamera.style.display === 'none') {
        this.touchCamera.style.display = "grid"
      } else {
        this.touchCamera.style.display = "none"
      }
    }

    touchToggle.onchange = toggleTouch
    touchToggle.ontouchstart = toggleTouch

    const label = document.createElement('label')
    label.setAttribute('for', 'touchToggle')
    label.innerHTML = "Touch"

    wrapper.appendChild(touchToggle)
    wrapper.appendChild(label)

    this.startGameUI.appendChild(gameTitle);
    this.startGameUI.appendChild(playBtn);
    this.startGameUI.appendChild(wrapper)

    this.uiContainer.appendChild(this.startGameUI);
  }

  private startGame() {
    //Allow player to move
    this.allowPlayerMove = true

    //Hide mouse
    RE.Input.mouse.lock();

    //Play videos
    const videoElements = document.getElementsByClassName('videoPlayer');
    for (let key in videoElements) {
      try {
        /* @ts-ignore */
        videoElements[key].play()
      } catch (e) {
        //Do nothing :D
      }
    }
  }
}

RE.registerComponent(GameUI);