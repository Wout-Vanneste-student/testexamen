export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, `player`);
    //
    scene.add.existing(this);
    scene.physics.add.existing(this);
    //
    this.setScale(0.25);
    this.setCollideWorldBounds(true);
    this.setOrigin(0.5, 0.5);

    this.createAnimations();
  }

  createAnimations() {
    this.scene.anims.create({
      key: `playerwalking`,
      frames: this.scene.anims.generateFrameNumbers(`playerwalking`, {
        start: 0,
        end: 19
      }),
      frameRate: 20,
      repeat: - 1
    });

    this.scene.anims.create({
      key: 'playeridle',
      frames: this.scene.anims.generateFrameNumbers(`playeridle`, {
        start: 0,
        end: 19
      }),
      frameRate: 20,
      repeat: - 1
    });
  }
}
