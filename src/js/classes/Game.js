import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import GameScene from './scenes/GameScene.js';

class Game extends Phaser.Game {
  constructor() {
    super({
      type: Phaser.AUTO,
      width: 700,
      height: 700,
      title: `Proefexamen`,
      scene: [BootScene, PreloadScene, GameScene],
      physics: {
        default: `arcade`,
        arcade: {
          debug: false
        }
      }
    });
    //console.log(`Constructor Game class`);
  }
}
export default Game;
