import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import InfoScene from './scenes/InfoScene.js';

class Game extends Phaser.Game {
  constructor() {
    super({
      type: Phaser.AUTO,
      width: 700,
      height: 700,
      title: `COD game top-down shooter`,
      scene: [BootScene, PreloadScene, GameScene, GameOverScene, InfoScene],
      physics: {
        default: `arcade`,
        arcade: {
          debug: false
        }
      },
      extend: {
        playerBullets: null
      }
    });
    //console.log(`Constructor Game class`);
  }
}
export default Game;
