import Phaser from 'phaser';

export default class TestScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TestScene' });
  }

  preload() {
    this.load.image('grass', 'POCMap.png');
    this.load.tilemapTiledJSON('mappy', 'POCmappy.json');
  }

  create() {
    this.rect = this.add.rectangle(1024 / 2, 768 / 2, 128, 128, 0xff0000);
    this.physics.add.existing(this.rect);

    this.spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.leftMouse = this.input.on('pointerdown', () => {
      this.projectile = this.add.rectangle(1024 / 2, 768 / 2, 10, 10, 0xff0000);
      this.projectile.rotation = this.rect.rotation;
      this.physics.add.existing(this.projectile);
      this.projectile.body.setVelocity(50, -50);
      console.log(this.projectile.rotation);
    });
    this.shoot = () => {
      this.projectile.rotation = rotation;
    };
    this.gen = () => {
      let genRect = this.add.rectangle(1024 / 2, 768 / 2, 128, 128, 0xff0000);
      this.physics.add.existing(genRect);
      genRect.body.setVelocity(100);
    };
    let mappy = this.add.tilemap('mappy');
    let terrarian = mappy.addTilesetImage('Tilly', 'grass');
    let grassLayer = mappy.createStaticLayer('Tile Layer 1', [terrarian], 0, 0);
  }

  update() {
    this.rect.rotation = Phaser.Math.Angle.Between(
      this.input.x,
      this.input.y,
      1024 / 2,
      768 / 2
    );
    if (this.leftMouse.isDown) {
      console.log('click');
    }
    if (this.spaceBar.isDown) {
      this.gen();
    }
  }
}
