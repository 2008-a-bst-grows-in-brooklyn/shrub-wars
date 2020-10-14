module.exports = class Player extends Phaser.GameObjects.Rectangle {
  constructor(scene, socket, x = 256, y = 256, team) {
    super(scene, x, y, 32, 32);

    this.scene = scene;
    this.id = socket.id;
    this.team = team;
    this.alive = true;

    scene.physics.add.existing(this);
  }

  setRotation(angle) {
    if (this.alive) {
      this.rotation = angle;
    }
  }

  setVelocity(moveState) {
    if (this.alive) {
      if (moveState.up) {
        this.body.setVelocityY(-100);
      } else if (moveState.down) {
        this.body.setVelocityY(100);
      } else {
        this.body.setVelocityY(0);
      }

      if (moveState.right) {
        this.body.setVelocityX(100);
      } else if (moveState.left) {
        this.body.setVelocityX(-100);
      } else {
        this.body.setVelocityX(0);
      }

      this.body.velocity.normalize().scale(200);
    } else {
      this.body.setVelocityX(0);
      this.body.setVelocityY(0);
    }
  }

  die() {
    this.alive = false;
    this.scene.time.delayedCall(5000, () => {
      this.respawn();
    });
  }

  respawn() {
    this.alive = true;
    this.setPosition(this.team.x, this.team.y);
  }
};
