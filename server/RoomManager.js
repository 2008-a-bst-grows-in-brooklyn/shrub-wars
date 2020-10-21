const Game = require("./game");
const ClientManager = require("./ClientManager");

class RoomManager {
  constructor() {
    this.roomId = 0;
    this.roomList = {};
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

  createGame() {
    const id = this.generateId();
    const game = new Game();

    this.roomList[id] = game;
    game.roomId = id;
    game.io = this.io;
    game.public = true;
    return id;
  }

  getGame(roomId) {
    return this.roomList[roomId];
  }

  getGameScene(roomId) {
    if (this.getGame(roomId)) {
      return this.getGame(roomId).scene.scenes[0]; // If room exists, return the correct scene
    } else {
      return false; // If room with specified roomId does not exist return false
    }
  }

  addPlayerToRoom(socket, roomId) {
    const scene = this.getGameScene(roomId);
    if (this.getGameScene(roomId)) {
      socket.join(roomId);
      scene.clientJoin(socket);
      return true; //
    } else {
      return false;
    }
  }

  removePlayerFromRoom(socket) {
    socket.leave(roomId);
  }

  get publicRooms() {
    const publicRooms = [];

    for (const code in this.roomList) {
      if (this.roomList[code].public === "true") {
        publicRooms.push(code);
      }
    }

    return publicRooms;
  }
}

const roomManager = new RoomManager();

module.exports = roomManager;
