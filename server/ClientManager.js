const RoomManager = require("./RoomManager");

class ClientManager {
  constructor(server) {
    this.clientList = {};
  }

  addClient(socket) {
    this.clientList[socket.id] = socket;

    socket.on("CREATE_GAME", () => {
      const id = RoomManager.createGame();
      socket.emit("GET_ROOMID", id); // Sends the new room id to the host client
    });

    socket.on("JOIN_ROOM", (roomId) => {
      // console.log(roomId);

      const scene = RoomManager.getGameScene(roomId);
      // If scene is false, roomId is invalid
      if (scene) {
        socket.join(roomId); //register the socket in the socketio room
        //call the "player joined" method to initiate the Phaser scene sequence
        scene.clientJoin(socket);
      }
    });
    socket.on("FIND_ROOM", (roomId) => {
      const scene = RoomManager.getGameScene(roomId);
      if (scene) {
        socket.emit("ROOM_FOUND"); // Send a OK status to client to continue to the room
      }
    });
  }
}

const clientManager = new ClientManager();

module.exports = clientManager;
