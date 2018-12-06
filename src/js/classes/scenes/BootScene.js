import './../../../assets/preloader.png';
export default class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: `boot`
    });
  }
  preload() {
    this.load.image(`loadingBar, ./assets/preloader.png`);
  }
  create() {
    this.scene.start(`preload`);
  }
  update() {}
}
