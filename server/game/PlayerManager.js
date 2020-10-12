const Player = require("./Player");

module.exports = class PlayerManager {
  constructor(scene) {
    this.scene = scene;
    this.playerList = {};
    this.playersGroup = scene.add.group();
  }

  getPlayerState() {
    let outPlayerList = {};
    for (let id in this.playerList) {
      let player = this.playerList[id];
      outPlayerList[id] = {
        x: player.x,
        y: player.y,
        rotation: player.rotation,
      };
    }
    return outPlayerList;
  }

  getPlayer(socket) {
    return this.playerList[socket.id];
  }

  addNewPlayer(socket) {
    const newPlayer = new Player(this.scene, socket);
    this.playerList[socket.id] = newPlayer;
    this.playersGroup.add(newPlayer);
    socket.broadcast.emit("PLAYER_JOINED", {
      id: newPlayer.id,
      x: newPlayer.x,
      y: newPlayer.y,
    });
  }

  removePlayer(socket) {
    this.playerList[socket.id].destroy();
    delete this.playerList[socket.id];
    socket.broadcast.emit("PLAYER_LEFT", socket.id);
  }
};
