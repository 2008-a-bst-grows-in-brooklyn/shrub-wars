module.exports = class Flag extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 1024, 928, "");
    this.player = undefined;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setSize(32, 32);
  }

  setPlayer(player) {
    if (!this.player) {
      this.player = player;
      this.player.holdingFlag = true;
    }
  }

  reset() {
    if (this.player) {
    this.player.holdingFlag = false;
    this.player = undefined;
    }
    this.setPosition(1024, 928);
  }

  updatePosition() {
    if (this.player) {
      this.setPosition(this.player.x, this.player.y);
      this.body.updateFromGameObject();
    }
  }
};
