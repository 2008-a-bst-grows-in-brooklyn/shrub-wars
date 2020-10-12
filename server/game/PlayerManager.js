const Player = require("./Player");

module.exports = class PlayerManager {
  constructor(scene) {
    this.playerList = {};
    this.playersGroup = scene.add.group();
    this.scene = scene;
  }

  addNewPlayer(socket) {
    this.playerList[socket.id] = new Player(this.scene, socket);
    this.playersGroup.add(this.playerList[socket.id]);
  }

  //getPlayer(socket) {}
};
