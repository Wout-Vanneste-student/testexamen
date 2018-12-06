import './../../../assets/emoticons.png';
import './../../../assets/emoticons.json';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: `preload`
    });
  }
  init() {
    this.preloader = this.add.graphics();
  }
  create() {}

  update() {}
}
