export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, `bullet`);
    //
    scene.add.existing(this);
    scene.physics.add.existing(this);
    //
    // this.setScale(0.25);
    //this.setBounce(1,Phaser.Math.FloatBetween(0.4,0.8));
    //this.setCollideWorldBounds(true);
    //
    // this.createAnimations();
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
    this.speed = 1.2;
    this.born = 0;
    this.direction = 0;
    this.xSpeed = 0;
    this.ySpeed = 0;
    // offset = afstand middelpunt tot geweer
    this.offset = Math.sqrt(Math.pow(28, 2) + Math.pow(14, 2));
    // hoek tussen geweer en x-as omzetten naar radialen
    this.cornerGunXaxis = (64.5 * Math.PI) / 180;
  }

  fire(player, targetX, targetY, rotation) {
    //schieten

    // nieuwe x-positie = speler-positie + offset * cos of sin rotatie - hoek tussen x-as en geweer (64,5 graden)
    const newPlayerX =
      player.x + this.offset * Math.cos(rotation - this.cornerGunXaxis);
    const newPlayerY =
      player.y + this.offset * Math.sin(rotation - this.cornerGunXaxis);
    const newTargetX =
      targetX + this.offset * Math.cos(rotation - this.cornerGunXaxis);
    const newTargetY =
      targetY + this.offset * Math.sin(rotation - this.cornerGunXaxis);

    this.setPosition(newPlayerX, newPlayerY);

    this.direction = Math.atan((newTargetX - this.x) / (newTargetY - this.y));
    //console.log(this.direction);

    if (targetY >= player.y) {
      this.xSpeed = this.speed * Math.sin(this.direction);
      this.ySpeed = this.speed * Math.cos(this.direction);
    } else {
      this.xSpeed = - this.speed * Math.sin(this.direction);
      this.ySpeed = - this.speed * Math.cos(this.direction);
    }

    this.rotation = rotation;
    this.born = 0;
  }

  update(time, delta) {
    this.x += this.xSpeed * delta;
    this.y += this.ySpeed * delta;
    this.born += delta;
    if (this.born > 765) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}
