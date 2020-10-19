const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 1337;
require("@geckos.io/phaser-on-nodejs");

const ClientManager = require("./ClientManager");
const RoomManager = require("./RoomManager");

app.use(express.static(path.join(__dirname, "..", "public")));

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

require("./socket").init(server);
const io = require("./socket").io();

//Temporary
RoomManager.createGame(io);
RoomManager.createGame(io);

io.on("connect", (socket) => {
  console.log("Client", socket.id, "has connected");
  ClientManager.addClient(socket);
});
