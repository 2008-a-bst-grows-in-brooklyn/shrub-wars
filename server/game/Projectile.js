module.exports = class Projectile extends Phaser.GameObjects.Rectangle {
  constructor(scene, id, x, y, vec, teamName) {
    super(scene, x, y, 16, 16);
    this.vector = vec;
    this.scene = scene;
    this.id = id;
    this.teamName = teamName;
  }
};
