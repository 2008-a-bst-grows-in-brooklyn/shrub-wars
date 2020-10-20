const Game = require("./game");
const ClientManager = require("./ClientManager");

class RoomManager {
  constructor() {
    this.roomId = 0;
    this.roomList = {};
  }

  createGame() {
    const id = this.generateId();
    const game = new Game();

    this.roomList[id] = game;
    game.roomId = id;
    game.io = this.io;
    return id;
  }

  getGame(roomId) {
    return this.roomList[roomId];
  }

  getGameScene(roomId) {
    if (this.getGame(roomId) === undefined) {
      return false; // If room with specified roomId does not exist return false
    }
    return this.getGame(roomId).scene.scenes[0]; // If room exists, return the correct scene
  }

  generateId() {
    /* Creates a random room code for the room when invoked */
    let resultId = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    for (let i = 0; i < 6; i++) {
      resultId += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return resultId;
  }
}

const roomManager = new RoomManager();

module.exports = roomManager;
