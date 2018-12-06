export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'gameover'
    });
  }
  init(score) {
    this.score = score.score;
  }
  preload() {
    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    );
    WebFont.load({
      google: {
        families: ['VT323']
      }
    });
  }
  create() {
    this.space = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.rect = new Phaser.Geom.Rectangle(0, 0, 700, 700);
    this.graphics = this.add.graphics({fillStyle: {color: 0x000000}});
    this.graphics.fillRectShape(this.rect);

    this.gameOverText = this.add
      .text(this.sys.game.config.width / 2, 100, `Game Over`, {
        fontSize: `75px`,
        fontFamily: 'VT323',
        fill: `#ff0000`
      })
      .setOrigin(0.5, 0.5);
    this.playerScoreText = this.add
      .text(
        this.sys.game.config.width / 2,
        200,
        `Your score was ${this.score}`,
        {
          fontSize: `40px`,
          fontFamily: 'VT323',
          fill: `#ffffff`
        }
      )
      .setOrigin(0.5, 0.5);
    this.restartText = this.add
      .text(this.sys.game.config.width / 2, 550, `Press space to restart`, {
        fontSize: `40px`,
        fontFamily: 'VT323',
        fill: `#00ff00`
      })
      .setOrigin(0.5, 0.5);

    saveScore(this.score).then(data => {
      if (data.result === `ok`) {
        console.log('score is goed doorgestuurd');
      } else {
        console.log('score is NIET goed doorgestuurd');
      }
    });
    getScores().then(data => {
      let hoogste = 0;
      data.forEach(data => {
        if (hoogste < data.score) {
          hoogste = data.score;
        }
      });
      if (this.score >= hoogste) {
        this.add
          .text(this.sys.game.config.width / 2, 250, `NEW HIGHSCORE!`, {
            fontSize: `45px`,
            fontFamily: 'VT323',
            fill: `#00ff00`
          })
          .setOrigin(0.5, 0.5);
      }
      // delay in poging snelheid van het opslaan in te rekenen
      //window.setTimeout(this.showScore(data), 3500);
      this.showScore(data);
    });
  }
  showScore(data) {
    const x = this.sys.game.config.width / 2;
    let y = 350;
    this.rectHighscores = new Phaser.Geom.Rectangle(150, 300, 400, 150);
    this.graphicsHighscores = this.add.graphics({
      fillStyle: {color: '#ffffff'}
    });
    this.graphicsHighscores.fillRectShape(this.rectHighscores);
    this.highScoresText = this.add
      .text(this.sys.game.config.width / 2, 300, `Highscores`, {
        fontSize: `35px`,
        fontFamily: 'VT323',
        fill: `#00ff00`
      })
      .setOrigin(0.5, 0.5);
    let top = 1;
    data.forEach(player => {
      this.add
        .text(x, y, `${top}. ${player.score}`, {
          fontSize: `25px`,
          fontFamily: 'VT323',
          color: `#ffffff`
        })
        .setOrigin(0.5, 0.5);
      y += 20;
      top += 1;
    });
  }
  update() {
    if (this.space.isDown) {
      this.scene.start(`game`);
    }
  }
}
