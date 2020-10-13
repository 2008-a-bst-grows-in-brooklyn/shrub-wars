const Player = require("./Player");

module.exports = class PlayerManager {
  constructor(scene) {
    this.scene = scene;
    this.playerList = {};
    this.playersGroup = scene.add.group();
    this.teamList = {
      red: { name: "red", x: 180, y: 860 },
      blue: { name: "blue", x: 1880, y: 860 },
    };
    this.currentTeam = this.teamList.red;
  }

  getPlayerState() {
    let outPlayerList = {};
    for (let id in this.playerList) {
      let player = this.playerList[id];
      outPlayerList[id] = {
        x: player.x,
        y: player.y,
        rotation: player.rotation,
        teamName: player.team.name,
      };
    }
    return outPlayerList;
  }

  getPlayer(socket) {
    return this.playerList[socket.id];
  }

  /* left: 180 x 860 y
  right: 1880 x 860 y  */

  addNewPlayer(socket) {
    const newPlayer = new Player(
      this.scene,
      socket,
      this.currentTeam.x,
      this.currentTeam.y,
      this.currentTeam //team object, including name and spawn coords
    );
    this.playerList[socket.id] = newPlayer;
    this.playersGroup.add(newPlayer);

    //temporary: alternate teams
    if (this.currentTeam.name === "red") {
      this.currentTeam = this.teamList.blue;
    } else {
      this.currentTeam = this.teamList.red;
    }

    socket.broadcast.emit("PLAYER_JOINED", {
      id: newPlayer.id,
      x: newPlayer.x,
      y: newPlayer.y,
      teamName: newPlayer.team.name,
    });
  }

  removePlayer(socket) {
    this.playerList[socket.id].destroy();
    delete this.playerList[socket.id];
    socket.broadcast.emit("PLAYER_LEFT", socket.id);
  }
};
