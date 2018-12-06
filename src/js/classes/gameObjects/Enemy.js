export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, `zombie`);
    //
    scene.add.existing(this);
    scene.physics.add.existing(this);
    //
    this.setScale(0.25);
    this.setCollideWorldBounds(true);
    //
    this.createAnimations();
    Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'zombie');
    this.speed = 0.05;
    this.born = 0;
    this.direction = 0;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.health = 1;
  }

  createAnimations() {
    this.scene.anims.create({
      key: `zombiemove`,
      frames: this.scene.anims.generateFrameNumbers(`zombie`, {
        start: 0,
        end: 15
      }),
      frameRate: 16,
      repeat: - 1
    });

    this.scene.anims.create({
      key: `zombieattack`,
      frames: this.scene.anims.generateFrameNumbers(`zombieattack`, {
        start: 0,
        end: 8
      }),
      frameRate: 9,
      repeat: 0
    });
  }

  walk(enemyX, enemyY, rotation) {
    this.setPosition(enemyX, enemyY);

    //this.direction = Math.atan((target.x - this.x) / (target.y - this.y));

    // if (target.x !== enemyX) {
    //   this.xSpeed = this.speed * Math.sin(this.direction);
    // } else {
    //   this.xSpeed = - this.speed * Math.sin(this.direction);
    // }
    // if (target.y !== enemyY) {
    //   this.ySpeed = this.speed * Math.cos(this.direction);
    // } else {
    //   this.ySpeed = - this.speed * Math.cos(this.direction);
    // }

    this.rotation = rotation;
    this.born = 0;
  }
  update(time, delta) {
    this.x += this.xSpeed * delta;
    this.y += this.ySpeed * delta;
    this.born += delta;
    if (this.born > 100) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}
