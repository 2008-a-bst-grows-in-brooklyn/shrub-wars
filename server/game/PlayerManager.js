const Player = require("./Player");

module.exports = class PlayerManager {
  constructor(scene) {
    this.scene = scene;
    this.roomId = scene.game.roomId;

    this.playerList = {};
    this.playersGroup = scene.add.group();
    this.teamList = {
      red: { name: "red", x: 436, y: 860 },
      blue: { name: "blue", x: 2146, y: 860 },
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
        isRespawning: player.isRespawning,
        ammo: player.ammo,
      };
    }
    return outPlayerList;
  }

  getPlayer(socket) {
    return this.playerList[socket.id];
  }

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

    socket.to(this.roomId).emit("PLAYER_JOINED", {
      id: newPlayer.id,
      x: newPlayer.x,
      y: newPlayer.y,
      teamName: newPlayer.team.name,
    });
  }

  removePlayer(socket) {
    console.log(socket.id, "disconnected from game");
    const player = this.getPlayer(socket);

    //handle flag behavior when the holding player disconnects
    if (player.holdingFlag) {
      this.scene.flag.reset();
    }

    this.playerList[socket.id].destroy();
    delete this.playerList[socket.id];
    socket.to(this.roomId).emit("PLAYER_LEFT", socket.id);
  }

  get playerCount() {
    return Object.keys(this.playerList).length;
  }
};
