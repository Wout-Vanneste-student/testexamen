import './../../../assets/emoticons.png';
import './../../../assets/emoticons.json';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: `preload`
    });
  }
  preload() {
    this.preloader = this.add.graphics();
    this.load.image(`loadingBar, ./assets/preloader.png`);
  }

  create() {}

  update() {}
}
