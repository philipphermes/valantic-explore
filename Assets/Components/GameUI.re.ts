import * as RE from 'rogue-engine';
import { AudioContext } from 'three';

export default class GameUI extends RE.Component {
  private uiContainer: HTMLElement;
  private loadingUI: HTMLElement;
  private startGameUI: HTMLElement;
  private useTouch: boolean = false;

  start() {
    window.localStorage.setItem("play", "false");

    AudioContext["getContext"]().suspend();

    this.uiContainer = document.getElementById("rogue-ui") as HTMLElement;

    const myCss = document.createElement("style");

    this.uiContainer.appendChild(myCss);
    this.uiContainer.style.fontFamily = "Arial";

    this.createLoadingUI();

    this.uiContainer.onclick = () => {
      RE.Input.mouse.lock();
      this.openFullscreen();
    }
  }

  update() {
    if (
        this.loadingUI.isConnected &&
        !this.startGameUI
    ) {
      this.loadingUI.style.display = "none";
      this.createStartGameUI();
    }
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

  private createLoadingUI() {
    if (this.loadingUI) {
      if (this.loadingUI.style.display === "none")
        this.loadingUI.style.display = "";

      return this.loadingUI
    }

    this.loadingUI = document.createElement("div");
    this.loadingUI.style.margin = "auto";
    this.loadingUI.style.textAlign = "center";
    this.loadingUI.style.cursor = "pointer";
    this.loadingUI.style.color = "white";
    this.loadingUI.style.position = "relative";
    this.loadingUI.style.width = "fit-content";
    this.loadingUI.style.top = "50%";
    this.loadingUI.style.fontSize = "20px";
    this.loadingUI.textContent = "Loading...";

    this.uiContainer.appendChild(this.loadingUI);

    return this.loadingUI;
  }

  private createStartGameUI() {
    if (this.startGameUI) {
      if (this.startGameUI.style.display === "none")
        this.startGameUI.style.display = "flex";

      return this.startGameUI
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
      this.useTouch = true;
      RE.Input.mouse.enabled = false;
      this.openFullscreen();
      this.startGame();
    };

    playBtn.onclick = () => {
      this.startGameUI.style.display = "none";
      this.startGame();
    };

    this.startGameUI.appendChild(gameTitle);
    this.startGameUI.appendChild(playBtn);

    this.uiContainer.appendChild(this.startGameUI);

    return this.startGameUI;
  }

  private startGame() {
    if (this.useTouch) {
      return;
    }

    window.localStorage.setItem("play", "true");

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