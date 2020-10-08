import Phaser from "phaser";

export default class TestScene extends Phaser.Scene {
  constructor() {
    super({ key: "TestScene" });
  }

  preload() {
    this.load.image("terrain", "./Tilly.png");
    this.load.tilemapTiledJSON("mappy", "./mappy3.json");
  }

  create() {
    this.rect = this.add.rectangle(1024 / 2, 768 / 2, 128, 128, 0xff0000);
    this.physics.add.existing(this.rect);

    this.spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.gen = () => {
      let genRect = this.add.rectangle(1024 / 2, 768 / 2, 128, 128, 0xff0000);
      this.physics.add.existing(genRect);
      genRect.body.setVelocity(100);
    };
    let mappy = this.add.tilemap("mappy");
    let terrarian = mappy.addTilesetImage("Tily3", "terrain");
    let botLayer = mappy.createStaticLayer("Tile Layer 1", [terrarian], 0, 0);
  }

  update() {
    this.rect.rotation = Phaser.Math.Angle.Between(
      this.input.x,
      this.input.y,
      1024 / 2,
      768 / 2
    );

    if (this.spaceBar.isDown) {
      this.gen();
    }
  }
}
