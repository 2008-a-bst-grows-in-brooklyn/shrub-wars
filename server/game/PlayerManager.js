const Player = require("./Player");

module.exports = class PlayerManager {
  constructor(scene) {
    this.scene = scene;
    this.playerList = {};
    this.playersGroup = scene.add.group();
    this.currentTeam = true
  }

  getPlayerState() {
    let outPlayerList = {};
    for (let id in this.playerList) {
      let player = this.playerList[id];
      outPlayerList[id] = {
        x: player.x,
        y: player.y,
        rotation: player.rotation,
        team: player.team,
      };
    }
    return outPlayerList;
  }

  getPlayer(socket) {
    return this.playerList[socket.id];
  }

  addNewPlayer(socket) {
    const newPlayer = new Player(this.scene, socket, undefined, undefined, this.currentTeam);
    this.playerList[socket.id] = newPlayer;
    this.playersGroup.add(newPlayer);
    this.currentTeam = !this.currentTeam
    socket.broadcast.emit("PLAYER_JOINED", {
      id: newPlayer.id,
      x: newPlayer.x,
      y: newPlayer.y,
      team: newPlayer.team
    });
  }

  removePlayer(socket) {
    this.playerList[socket.id].destroy();
    delete this.playerList[socket.id];
    socket.broadcast.emit("PLAYER_LEFT", socket.id);
  }
};
