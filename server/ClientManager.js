const RoomManager = require("./RoomManager");

class ClientManager {
  constructor(server) {
    this.clientList = {};
  }

  addClient(socket) {
    this.clientList[socket.id] = socket;

    socket.on("JOIN_ROOM", (roomId) => {
      socket.join(roomId); //register the socket in the socketio room
      //put them through the join sequence in the correct Phaser

      const scene = RoomManager.getGameScene(roomId);

      //call the "player joined" method to initiate the Phaser scene sequence
      scene.clientJoin(socket);
    });
  }
}

const clientManager = new ClientManager();

module.exports = clientManager;
