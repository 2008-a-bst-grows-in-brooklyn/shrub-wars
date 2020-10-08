import Phaser from "phaser";

export default class TestScene extends Phaser.Scene {
  constructor() {
    super({ key: "TestScene" });
  }

  preload() {
    this.load.image("grass", "POCMap.png");
    this.load.tilemapTiledJSON("mappy", "POCmappy.json");
  }

  create() {
    this.bullets = this.add.group();
    this.rect = this.add.rectangle(512 / 2, 512 / 2, 32, 32, 0xff0000);
    this.physics.add.existing(this.rect);

    this.spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.leftMouse = this.input.on("pointerdown", () => {
      const vec = this.physics.velocityFromRotation(this.rect.rotation, 60);
      this.projectile = this.add.rectangle(
        this.rect.x,
        this.rect.y,
        16,
        16,
        0xff0000
      );
      this.bullets.add(this.projectile);
      this.projectile.rotation = this.rect.rotation;
      this.physics.add.existing(this.projectile);
      this.projectile.body.setVelocity(-vec.x, -vec.y);
    });
    let mappy = this.add.tilemap("mappy");
    let terrarian = mappy.addTilesetImage("Tilly", "grass");
    let grassLayer = mappy.createStaticLayer("Grass", [terrarian], 0, 0);
    grassLayer.setDepth(-1);
    let top = mappy.createStaticLayer("Top", [terrarian], 0, 0);

    this.physics.add.collider(this.rect, top);
    this.physics.add.collider(this.bullets, top, (bullet) => {
      bullet.destroy();
    });
    top.setCollisionByProperty({ collides: true });
    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // top.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });

    this.controls = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.cameras.main.startFollow(this.rect);
  }

  update() {
    this.rect.rotation = Phaser.Math.Angle.Between(
      this.input.x,
      this.input.y,
      512 / 2,
      512 / 2
    );
    if (this.controls.up.isDown) {
      this.rect.body.setVelocityY(-100);
    } else if (this.controls.down.isDown) {
      this.rect.body.setVelocityY(100);
    } else {
      this.rect.body.setVelocityY(0);
    }
    if (this.controls.right.isDown) {
      this.rect.body.setVelocityX(100);
    } else if (this.controls.left.isDown) {
      this.rect.body.setVelocityX(-100);
    } else {
      this.rect.body.setVelocityX(0);
    }
  }
}
