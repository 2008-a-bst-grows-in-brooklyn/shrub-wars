const Game = require("./game");
const ClientManager = require("./ClientManager");

class RoomManager {
  constructor() {
    this.roomId = 0;
    this.roomList = {};
  }

  createGame(io) {
    const id = this.generateId();
    const game = new Game();

    this.roomList[id] = game;
    game.roomId = id;
    game.io = io;
  }

  getGame(roomId) {
    return this.roomList[roomId];
  }

  getGameScene(roomId) {
    return this.getGame(roomId).scene.scenes[0];
  }

  generateId() {
    return this.roomId++;
  }
}

const roomManager = new RoomManager();

module.exports = roomManager;
