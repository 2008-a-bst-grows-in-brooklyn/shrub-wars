const Projectile = require("./Projectile");
module.exports = class ProjectileManager {
  constructor(scene) {
    this.scene = scene;
    this.projectiles = scene.add.group();
    this.projectileList = {};
    this.projectileId = 0;
  }
  addNewProjectile(x, y, vec, playerId, rotation) {
    const newProjectile = new Projectile(
      this.scene,
      this.projectileId,
      x,
      y,
      vec,
      playerId
    );
    newProjectile.rotation = rotation;
    this.projectiles.add(newProjectile);
    this.scene.physics.add.existing(newProjectile);
    newProjectile.body.setVelocity(-vec.x, -vec.y);
    this.projectileList[this.projectileId++] = newProjectile;
  }
  getProjectiles() {
    let modifiedBulletList = {};
    for (const id in this.projectileList) {
      let bullet = this.projectileList[id];
      if (bullet === null) {
        modifiedBulletList[id] = bullet;
      } else {
        modifiedBulletList[id] = {
          playerId: bullet.owner,
          x: bullet.x,
          y: bullet.y,
          rotation: bullet.rotation,
        };
      }
    }
    return modifiedBulletList;
  }
};
