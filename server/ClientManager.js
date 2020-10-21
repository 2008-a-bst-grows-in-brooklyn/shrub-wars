const { removePlayerFromRoom } = require("./RoomManager");
const RoomManager = require("./RoomManager");

class ClientManager {
  constructor(server) {
    this.clientList = {};
  }

  addClient(socket) {
    this.clientList[socket.id] = socket;

    //Handle a socket disconnection
    socket.on("disconnect", () => {
      delete this.clientList[socket.id];
    });

    //Handle creating a new game
    socket.on("CREATE_GAME", () => {
      const id = RoomManager.createGame();
      socket.emit("GET_ROOMID", id); // Sends the new room id to the host client
    });

    //Handle requesting a specific room
    socket.on("FIND_ROOM", (roomId) => {
      const scene = RoomManager.getGameScene(roomId);
      if (scene) {
        socket.emit("ROOM_FOUND"); // Send a OK status to client to continue to the room
      } else {
        socket.emit("JOIN_ERROR", `Room ${roomId} was not found`);
      }
    });

    //When client signals that they're ready to receive room data,
    //signal to the game instance that a new player is joining
    socket.on("JOIN_ROOM", (roomId) => {
      const didConnect = RoomManager.addPlayerToRoom(socket, roomId);

      if (didConnect) {
        this.clientList[socket.id].room = roomId;

        //declare leave_room listener
        socket.once("LEAVE_ROOM", () => {
          const roomId = this.clientList[socket.id].Id;
          removePlayerFromRoom(socket, roomId);
          this.clientList[socket.id].room = undefined;
        });

        //otherwise, inform the client that something went wrong
        //TODO: do something with this information
      } else {
        socket.emit("JOIN_ERROR", `Failed to join Room ${roomId}`);
      }
    });

    socket.on("FETCH_ROOMS", () => {
      console.log("rooms fetched", RoomManager.publicRooms);
      socket.emit("ROOMS_FETCHED", RoomManager.publicRooms);
    });
  }

  getClient(socket) {
    return this.clientList[socket.id];
  }
}

const clientManager = new ClientManager();

module.exports = clientManager;
