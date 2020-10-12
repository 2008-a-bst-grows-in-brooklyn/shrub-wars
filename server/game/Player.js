module.exports = class Player {
  constructor(scene, socket, x = 256, y = 256) {
    this.scene = scene;
    this.gameObject = scene.add.rectangle(x, y, 32, 32);
    this.id = socket.id;

    scene.physics.add.existing(this.gameObject);
  }
};
