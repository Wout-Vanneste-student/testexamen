import './../../../assets/img/bullet.png';
import './../../../assets/img/aimCursor.png';

import './../../../assets/img/zombiespritesheet.png';
import './../../../assets/img/zombieattack.png';

import './../../../assets/img/playerwalking.png';

import './../../../assets/img/playeridle.png';

import './../../../assets/img/background.jpg';
import './../../../assets/img/vignette.png';
import './../../../assets/img/ammopack.png';
import './../../../assets/img/hppack.png';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: `preload`
    });
  }
  preload() {
    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    );

    this.preloader = this.add.graphics();
    this.loadingText = this.add
      .text(this.sys.game.config.width / 2, 300, `Loading: 0%`, {
        fontSize: `42px`,
        fontFamily: 'VT323',
        fill: `#00ff00`
      })
      .setOrigin(0.5, 0.5);
    this.loadingBar = this.add.image(150, 350, 'loadingBar');
    this.loadingBar.setVisible(false);

    this.load.on(`progress`, this.onProgress, this);
    this.load.on(`complete`, this.onComplete, this);

    this.load.spritesheet('playerwalking', './assets/img/playerwalking.png', {
      frameWidth: 258,
      frameHeight: 220,
      endFrame: 20
    });

    this.load.spritesheet('playeridle', './assets/img/playeridle.png', {
      frameWidth: 253,
      frameHeight: 216,
      endFrame: 20
    });

    this.load.spritesheet('zombie', './assets/img/zombiespritesheet.png', {
      frameWidth: 288,
      frameHeight: 311,
      endFrame: 17
    });
    this.load.spritesheet('zombieattack', './assets/img/zombieattack.png', {
      frameWidth: 318,
      frameHeight: 294,
      endFrame: 17
    });

    this.load.image(`bullet`, `./assets/img/bullet.png`);
    this.load.image(`aimCursor`, `./assets/img/aimCursor.png`);
    this.load.image(`background`, `./assets/img/background.jpg`);
    this.load.image(`vignette`, `./assets/img/vignette.png`);
    this.load.image(`ammopack`, `./assets/img/ammopack.png`);
    this.load.image(`hppack`, `./assets/img/hppack.png`);
  }

  onProgress(value) {
    this.preloader.clear();
    this.preloader.fillStyle(0xff0000, 1);

    this.loadingText.setText(`Loading: ${Math.round(value * 100)}%`);
    this.loadingBar.setOrigin(0, 0);
    this.loadingBar.setVisible(true);
    this.loadingBar.scaleX = Math.round(value * 4);
  }

  removeLoadingDelay() {
    this.time.addEvent({
      delay: 300,
      callback: this.destroyLoading,
      callbackScope: this,
      loop: false
    });
  }

  destroyLoading() {
    this.loadingText.destroy();
    this.loadingBar.destroy();
    this.cameras.main.flash();
    this.startText = this.add
      .text(this.sys.game.config.width / 2, 500, `Press space to begin`, {
        fontSize: `50px`,
        fontFamily: 'VT323',
        fill: `#00ff00`
      })
      .setOrigin(0.5, 0.5);
    this.infoText = this.add
      .text(
        this.sys.game.config.width / 2,
        600,
        `Press i to see how it works`,
        {
          fontSize: `40px`,
          fontFamily: 'VT323',
          fill: `#00ff00`
        }
      )
      .setOrigin(0.5, 0.5);
    this.titelText = this.add
      .text(this.sys.game.config.width / 2, 100, `PEW PEW ZOMBIE`, {
        fontSize: `75px`,
        fontFamily: 'VT323',
        fill: `#00ff00`
      })
      .setOrigin(0.5, 0.5);

    this.hand = this.add
      .image(this.sys.game.config.width / 2, 325, 'hand')
      .setOrigin(0.5, 0.5)
      .setScale(0.4, 0.4);
  }

  onComplete() {
    this.removeLoadingDelay();

    this.createControls();
  }

  createControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.info = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    WebFont.load({
      google: {
        families: ['VT323']
      }
    });
  }

  update() {
    if (this.info) {
      if (this.info.isDown === true) {
        this.scene.start(`info`);
      }
    }
    if (this.cursors.space.isDown) {
      this.scene.start(`game`);
    }
  }
}
