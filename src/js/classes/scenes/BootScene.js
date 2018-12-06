import './../../../assets/img/loadingBar.jpg';
import './../../../assets/img/hand.png';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: `boot`
    });
    //console.log(`In de Bootscene`);
  }
  preload() {
    //console.log(`preload van de bootscene`);
    this.load.image(`loadingBar`, `./assets/img/loadingBar.jpg`);
    this.load.image(`hand`, `./assets/img/hand.png`);
    //Maybe load a preloader graphic...
  }
  create() {
    //console.log(`create van de bootscene`);
    this.scene.start(`preload`);
  }
  update() {}
}
