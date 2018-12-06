import './../../../assets/preloader.png';
export default class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: `boot`
    });
  }
  init() {
    this.load.spritesheet(`loadingBar, ./assets/preloader.png`);
  }
  create() {
    this.scene.start(`preload`);
  }
  update() {}
}
