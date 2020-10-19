module.exports = class Player extends Phaser.GameObjects.Rectangle {
  constructor(scene, socket, x = 256, y = 256, team) {
    super(scene, x, y, 32, 32);

    this.scene = scene;
    this.id = socket.id;
    this.team = team;
    this.ammo = 6;
    this.holdingFlag = false;

    this.respawnTimer;
    this.shotDelayTimer;
    this.reloadingTimer;

    scene.physics.add.existing(this);
  }

  setRotation(angle) {
    if (!this.isRespawning) {
      this.rotation = angle;
    }
  }

  setVelocity(moveState) {
    if (!this.isRespawning) {
      if (this.holdingFlag) {
        if (moveState.up) {
          this.body.setVelocityY(-50);
        } else if (moveState.down) {
          this.body.setVelocityY(50);
        } else {
          this.body.setVelocityY(0);
        }

        if (moveState.right) {
          this.body.setVelocityX(50);
        } else if (moveState.left) {
          this.body.setVelocityX(-50);
        } else {
          this.body.setVelocityX(0);
        }

        this.body.velocity.normalize().scale(100);
      } else {
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
      }
    } else {
      this.body.setVelocityX(0);
      this.body.setVelocityY(0);
    }
  }

  //Respawning
  die() {
    if (!this.isRespawning) {
      if (this.holdingFlag) {
        this.scene.flag.reset();
      }
      this.respawnTimer = this.scene.time.delayedCall(5000, () => {
        this.respawn();
      });
    }
  }

  respawn() {
    this.respawnTimer = undefined;
    this.setPosition(this.team.x, this.team.y);
    this.ammo = 6;
  }

  get isRespawning() {
    if (this.respawnTimer) {
      return 1 - this.respawnTimer.getProgress(); // goes from 1 to 0
    }
  }

  //Shooting
  shotFired() {
    if (!this.chambering) {
      this.shotDelayTimer = this.scene.time.delayedCall(650, () => {
        this.isChambered();
      });
      this.ammo--;
      if (this.ammo === 0) {
        this.emptyMagazine();
      }
    }
  }

  isChambered() {
    this.shotDelayTimer = undefined;
  }

  get chambering() {
    if (this.shotDelayTimer) {
      return this.shotDelayTimer.getProgress();
    }
  }

  //Reloading
  emptyMagazine() {
    if (!this.reloading) {
      this.reloadingTimer = this.scene.time.delayedCall(3500, () => {
        console.log("calling on fullMagazine");
        this.fullMagazine();
      });
    }
  }

  fullMagazine() {
    this.reloadingTimer = undefined;
    this.ammo = 6;
  }

  get reloading() {
    if (this.reloadingTimer) {
      return this.reloadingTimer.getProgress();
    } /*else {
      return 0;
    }*/
  }

//Game Resetting
  /*gameOver() {
    if (!this.gameResetTimer) {
      this.gameResetTimer = this.scene.time.delayedCall(10000, () => {
        this.gameReset();
      });
    }
  }

  gameReset() {
    this.gameResetTimer = undefined;
  }

  get isResetting() {
    if (this.gameResetTimer) {
      return 1 - this.gameResetTimer.getProgress(); // goes from 1 to 0
    }
  }*/
};
