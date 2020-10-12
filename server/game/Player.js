module.exports = class Player {
  //TODO: Find a way to implement this as an extension of a Phaser gameObject
  constructor(scene, socket, x = 256, y = 256) {
    this.scene = scene;
    this.gameObject = scene.add.rectangle(x, y, 32, 32);
    this.gameObject.id = socket.id;
    this.id = socket.id;

    scene.physics.add.existing(this.gameObject);
  }

  setRotation(angle) {
    this.gameObject.rotation = angle;
  }

  setVelocity(moveState) {
    if (moveState.up) {
      this.gameObject.body.setVelocityY(-100);
    } else if (moveState.down) {
      this.gameObject.body.setVelocityY(100);
    } else {
      this.gameObject.body.setVelocityY(0);
    }

    if (moveState.right) {
      this.gameObject.body.setVelocityX(100);
    } else if (moveState.left) {
      this.gameObject.body.setVelocityX(-100);
    } else {
      this.gameObject.body.setVelocityX(0);
    }

    this.gameObject.body.velocity.normalize().scale(200);
  }
};
