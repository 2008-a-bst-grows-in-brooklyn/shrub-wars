const socketio = require("socket.io");
let io;

exports.io = () => {
  return io;
};

exports.init = (server) => {
  console.log("init");
  io = socketio(server);
};
