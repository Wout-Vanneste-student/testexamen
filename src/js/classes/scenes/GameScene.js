export default class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: `game`
    });
  }
  init() {
    this.gameOver = false;
    this.enemyTime = 3000;
    this.ammoTime = 1000;
    this.hpTime = 1000;
    this.space = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }
  preload() {
    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    );
  }
  create() {
    WebFont.load({
      google: {
        families: ['VT323']
      }
    });
    this.minimap = this.cameras
      .add(
        this.cameras.main.worldView.x + 550,
        this.cameras.main.worldView.y + 25,
        125,
        125
      )
      .setZoom(0.1)
      .setName('mini');
    this.physics.world.setBounds(- 5, - 5, 1500, 1500);

    // voeg een achtergrond toe in het midden
    this.add.image(750, 750, 'background');

    this.vignette = this.add.image(750, 750, 'vignette');

    this.createPlayer();

    this.player.setCollideWorldBounds(true);

    this.playerBullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true
    });

    this.monsters = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true
    });
    this.enemySpeed();

    // gebruik een custom cursor
    this.input.setDefaultCursor('url(assets/img/aimCursor.png), pointer');

    this.createControls();
    this.createScore();
    this.createAmmo();
    this.createHp();
    this.ammoSpawn();
    this.hpSpawn();

    this.input.on('pointerdown', () => {
      const bullet = this.playerBullets
        .get()
        .setActive(true)
        .setVisible(true);

      if (bullet) {
        if (this.ammo > 0) {
          bullet.fire(
            this.player,
            this.input.mousePointer.x + this.cameras.main.worldView.x + 10,
            this.input.mousePointer.y + this.cameras.main.worldView.y + 10,
            Math.atan2(
              this.input.mousePointer.y +
                this.cameras.main.worldView.y +
                10 -
                this.player.y,
              this.input.mousePointer.x +
                this.cameras.main.worldView.x +
                10 -
                this.player.x
            ) + 89.6
          );
          this.ammo --;
          this.ammoText = `Ammo: ${this.ammo}`;
          this.ammoTextField.setText(this.ammoText);
        }
        if (this.ammo === 0) {
          this.ammoText = `No ammo left`;
          this.ammoTextField.setText(this.ammoText);
        }
      }
    });

    this.ammopacks = this.physics.add.group();
    this.hppacks = this.physics.add.group();

    this.physics.add.overlap(
      this.player,
      this.ammopacks,
      this.collectAmmo,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.hppacks,
      this.collectHp,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.monsters,
      this.enemyHit,
      null,
      this
    );

    this.physics.add.collider(
      this.playerBullets,
      this.monsters,
      this.bulletHit,
      null,
      this
    );

    this.physics.add.collider(this.player, null, this);

    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
  }

  bulletHit(bullet, enemy) {
    enemy.health -= 1;
    if (enemy.health <= 0) {
      this.score += 10;
      this.scoreTextField.setText(`Score: ${this.score}`);
      this.refresh();
      enemy.destroy();
    }
    bullet.destroy();
  }

  collectAmmo(player, ammopack) {
    ammopack.disableBody(true, true);
    this.ammo += 10;
    this.ammoText = `Ammo: ${this.ammo}`;
    this.ammoTextField.setText(this.ammoText);
  }
  collectHp(player, hppack) {
    if (this.hp < 100) {
      hppack.disableBody(true, true);
      this.hp += 10;
    }
    this.hpText = `HP: ${this.hp}`;
    this.hpTextField.setText(this.hpText);
    if (this.hp > 55) {
      this.textColor = 0x00ff00;
      this.hpTextField.setTint(this.textColor);
    } else if (this.hp < 55 && this.hp > 35) {
      this.textColor = 0xff9900;
      this.hpTextField.setTint(this.textColor);
    } else if (this.hp < 35) {
      this.textColor = 0xff0000;
      this.hpTextField.setTint(this.textColor);
    }
  }

  enemyHit(player, enemy) {
    this.cameras.main.flash(500);
    this.minimap.flash(500);
    if (this.hp > 10) {
      enemy.destroy();
      this.hp -= 10;
      this.hpText = `HP: ${this.hp}`;
      this.hpTextField.setText(this.hpText);
      if (this.hp > 55) {
        this.textColor = 0x00ff00;
        this.hpTextField.setTint(this.textColor);
      } else if (this.hp < 55 && this.hp > 35) {
        this.textColor = 0xff9900;
        this.hpTextField.setTint(this.textColor);
      } else if (this.hp < 35) {
        this.textColor = 0xff0000;
        this.hpTextField.setTint(this.textColor);
      }
    } else {
      this.gameOver = true;
      this.enemySpeed.paused = true;
    }
  }

  createControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  spawnAmmo() {
    const ammopack = this.ammopacks.create(
      Phaser.Math.Between(50, 1450),
      Phaser.Math.Between(50, 1450),
      `ammopack`
    );
    this.refresh();
  }

  spawnHp() {
    const hppack = this.hppacks.create(
      Phaser.Math.Between(50, 1450),
      Phaser.Math.Between(50, 1450),
      `hppack`
    );
    this.refresh();
  }

  enemySpeed() {
    this.time.addEvent({
      delay: this.enemyTime,
      callback: this.onEvent,
      callbackScope: this,
      loop: false
    });
  }

  refresh() {
    this.vignette.destroy();
    this.scoreTextField.destroy();
    this.ammoTextField.destroy();
    this.hpTextField.destroy();

    this.vignette = this.add.image(
      this.cameras.main.worldView.x + 350,
      this.cameras.main.worldView.y + 350,
      'vignette'
    );

    this.scoreTextField = this.add.text(
      this.cameras.main.worldView.x + 50,
      this.cameras.main.worldView.y + 50,
      `Score: ${this.score}`,
      {
        fontSize: `42px`,
        fontFamily: 'VT323',
        fill: `#fff`
      }
    );

    this.ammoTextField = this.add.text(
      this.cameras.main.worldView.x + 50,
      this.cameras.main.worldView.y + 620,
      this.ammoText,
      {
        fontSize: `42px`,
        fontFamily: 'VT323',
        fill: `#ff0000`
      }
    );

    this.hpTextField = this.add.text(
      this.cameras.main.worldView.x + 350,
      this.cameras.main.worldView.y + 620,
      this.hpText,
      {
        fontSize: `42px`,
        fontFamily: 'VT323'
      }
    );

    this.hpTextField.setTint(this.textColor);
  }

  onEvent() {
    this.vignette.destroy();
    this.scoreTextField.destroy();
    this.ammoTextField.destroy();
    this.hpTextField.destroy();

    if (this.enemyTime > 500) {
      this.enemyTime -= 100;
    } else {
      this.enemyTime = 500;
      this.enemy.health = 2;
    }
    if (this.monsters.getChildren().length < 100) {
      this.spawnEnemy();
    }

    this.vignette = this.add.image(
      this.cameras.main.worldView.x + 350,
      this.cameras.main.worldView.y + 350,
      'vignette'
    );

    this.scoreTextField = this.add.text(
      this.cameras.main.worldView.x + 50,
      this.cameras.main.worldView.y + 50,
      `Score: ${this.score}`,
      {
        fontSize: `42px`,
        fontFamily: 'VT323',
        fill: `#fff`
      }
    );

    this.ammoTextField = this.add.text(
      this.cameras.main.worldView.x + 50,
      this.cameras.main.worldView.y + 620,
      this.ammoText,
      {
        fontSize: `42px`,
        fontFamily: 'VT323',
        fill: `#ff0000`
      }
    );
    this.hpTextField = this.add.text(
      this.cameras.main.worldView.x + 350,
      this.cameras.main.worldView.y + 620,
      this.hpText,
      {
        fontSize: `42px`,
        fontFamily: 'VT323'
      }
    );
    this.hpTextField.setTint(this.textColor);

    this.enemySpeed();
  }

  ammoSpawn() {
    this.time.addEvent({
      delay: this.ammoTime,
      callback: this.ammoEvent,
      callbackScope: this,
      loop: false
    });
  }

  ammoEvent() {
    this.spawnAmmo();

    this.ammoTime = Phaser.Math.Between(1000, 4000);

    this.ammoSpawn();
  }

  hpSpawn() {
    this.time.addEvent({
      delay: this.hpTime,
      callback: this.hpEvent,
      callbackScope: this,
      loop: false
    });
  }

  hpEvent() {
    if (
      (this.hppacks.getChildren().length < 15 && this.hp < 100) ||
      this.hp < 50
    ) {
      this.spawnHp();
    }

    this.hpTime = Phaser.Math.Between(1000, 5000);

    this.hpSpawn();
  }

  spawnEnemy() {
    switch (Math.round(Math.random() * (8.4 - 1) + 1)) {
    case 1:
      this.enemy = new Enemy(this, 32.5, 27.5);
      this.enemy.x = 32.5;
      this.enemy.y = 27.5;
      this.enemy.setActive(true).setVisible(true);
      this.monsters.add(this.enemy);
      this.enemy.body.setSize(140, 140, 0, 0);
      this.enemy.body.immovable = true;
      break;
    case 2:
      this.enemy = new Enemy(this, 750, 27.5);
      this.enemy.x = 750;
      this.enemy.y = 27.5;
      this.enemy.setActive(true).setVisible(true);
      this.monsters.add(this.enemy);
      this.enemy.body.setSize(140, 140, 0, 0);
      this.enemy.body.immovable = true;
      break;
    case 3:
      this.enemy = new Enemy(this, 1470, 27.5);
      this.enemy.x = 1470;
      this.enemy.y = 27.5;
      this.enemy.setActive(true).setVisible(true);
      this.monsters.add(this.enemy);
      this.enemy.body.setSize(140, 140, 0, 0);
      this.enemy.body.immovable = true;
      break;
    case 4:
      this.enemy = new Enemy(this, 32.5, 750);
      this.enemy.x = 32.5;
      this.enemy.y = 750;
      this.enemy.setActive(true).setVisible(true);
      this.monsters.add(this.enemy);
      this.enemy.body.setSize(140, 140, 0, 0);
      this.enemy.body.immovable = true;
      break;
    case 5:
      this.enemy = new Enemy(this, 1470, 750);
      this.enemy.x = 1470;
      this.enemy.y = 750;
      this.enemy.setActive(true).setVisible(true);
      this.monsters.add(this.enemy);
      this.enemy.body.setSize(140, 140, 0, 0);
      this.enemy.body.immovable = true;
      break;
    case 6:
      this.enemy = new Enemy(this, 32.5, 1470);
      this.enemy.x = 32.5;
      this.enemy.y = 1470;
      this.enemy.setActive(true).setVisible(true);
      this.monsters.add(this.enemy);
      this.enemy.body.setSize(140, 140, 0, 0);
      this.enemy.body.immovable = true;
      break;
    case 7:
      this.enemy = new Enemy(this, 750, 1470);
      this.enemy.x = 750;
      this.enemy.y = 1470;
      this.enemy.setActive(true).setVisible(true);
      this.monsters.add(this.enemy);
      this.enemy.body.setSize(140, 140, 0, 0);
      this.enemy.body.immovable = true;
      break;
    case 8:
      this.enemy = new Enemy(this, 1470, 1470);
      this.enemy.x = 1470;
      this.enemy.y = 1470;
      this.enemy.setActive(true).setVisible(true);
      this.monsters.add(this.enemy);
      this.enemy.body.setSize(140, 140, 0, 0);
      this.enemy.body.immovable = true;
      break;
    default:
    }
  }

  createPlayer() {
    this.player = new Player(this, 750, 750);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(220, 220, 0, 0);
    this.player.body.immovable = true;
    this.playerSpeed = 2;
  }

  createScore() {
    this.scoreTextField = this.add.text(450, 450, `Score: 0`, {
      fontSize: `42px`,
      fontFamily: 'VT323',
      fill: `#fff`
    });
    this.score = 0;
  }

  createAmmo() {
    this.ammo = 5;
    this.ammoText = `Ammo: ${this.ammo}`;
    this.ammoTextField = this.add.text(450, 950, this.ammoText, {
      fontSize: `42px`,
      fontFamily: 'VT323',
      fill: `#ff0000`
    });
  }

  createHp() {
    this.hp = 100;
    this.hpText = `HP: ${this.hp}`;
    this.hpTextField = this.add.text(450, 950, this.hpText, {
      fontSize: `42px`,
      fontFamily: 'VT323'
    });
    this.textColor = 0x00ff00;
    this.hpTextField.setTint(this.textColor);
  }

  update() {
    this.cameras.main.startFollow(this.player);
    this.minimap.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, 1500, 1500);
    this.minimap.setBounds(0, 0, 1500, 1500);

    if (!this.gameOver) {
      this.minimap.ignore(this.vignette);
      this.minimap.ignore(this.scoreTextField);
      this.minimap.ignore(this.ammoTextField);
      this.minimap.ignore(this.hpTextField);

      this.vignette.x = this.cameras.main.worldView.x + 350;
      this.vignette.y = this.cameras.main.worldView.y + 350;
      this.scoreTextField.x = this.cameras.main.worldView.x + 50;
      this.scoreTextField.y = this.cameras.main.worldView.y + 50;
      this.ammoTextField.x = this.cameras.main.worldView.x + 50;
      this.ammoTextField.y = this.cameras.main.worldView.y + 620;
      this.hpTextField.x = this.cameras.main.worldView.x + 350;
      this.hpTextField.y = this.cameras.main.worldView.y + 620;

      //zorgt dat enemies naar de speler kijken
      this.monstersArray = this.monsters.getChildren();
      if (this.playerBullets !== null) {
        this.bullets = this.playerBullets.getChildren();
        this.bullets.forEach(bullet => {
          if (
            bullet.x > 1900 ||
            bullet.x < 0 ||
            bullet.y < 0 ||
            bullet.y > 1900
          ) {
            bullet.destroy();
          }
        });
      }
      this.monstersArray.forEach(enemy => {
        enemy.walk(
          enemy.x,
          enemy.y,
          Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x)
        );

        // zorgt dat enemies altijd richting speler gaan, hier met een bepaalde snelheid
        this.physics.moveToObject(enemy, this.player, 40);

        if (
          Phaser.Math.Distance.Between(
            enemy.x,
            enemy.y,
            this.player.x,
            this.player.y
          ) < 100
        ) {
          enemy.anims.play(`zombieattack`, true);
        } else {
          enemy.anims.play(`zombiemove`, true);
        }
      });

      // houd rekening met de camera om de muispositie te berekenen
      this.CorrectedMousePositionX =
        this.input.mousePointer.x + this.cameras.main.worldView.x + 10;
      this.CorrectedMousePositionY =
        this.input.mousePointer.y + this.cameras.main.worldView.y + 10;

      // zorgt dat de speler altijd naar de muis gericht staat
      this.player.rotation = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        this.CorrectedMousePositionX,
        this.CorrectedMousePositionY
      );

      // verander de snelheid bij een pijl indrukken
      if (
        this.cursors.left.isDown ||
        this.cursors.right.isDown ||
        this.cursors.up.isDown ||
        this.cursors.down.isDown ||
        this.keyA.isDown ||
        this.keyD.isDown ||
        this.keyW.isDown ||
        this.keyQ.isDown ||
        this.keyZ.isDown ||
        this.keyS.isDown
      ) {
        if (this.cursors.left.isDown || this.keyA.isDown || this.keyQ.isDown) {
          this.player.x -= this.playerSpeed;
        }
        if (this.cursors.right.isDown || this.keyD.isDown) {
          this.player.x += this.playerSpeed;
        }
        if (this.cursors.up.isDown || this.keyW.isDown || this.keyZ.isDown) {
          this.player.y -= this.playerSpeed;
        }
        if (this.cursors.down.isDown || this.keyS.isDown) {
          this.player.y += this.playerSpeed;
        }
        this.player.anims.play(`playerwalking`, true);
      } else {
        this.player.anims.play(`playeridle`, true);
      }
    } else {
      this.scene.start(`gameover`, {score: this.score});

      this.bullets.forEach(bullet => {
        bullet.setActive(false).setVisible(false);
        this.playerBullets.remove(bullet);
      });
      this.player.anims.stop();
    }
  }
}
