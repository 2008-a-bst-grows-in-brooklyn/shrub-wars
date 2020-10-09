const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 1337;
require("@geckos.io/phaser-on-nodejs");

app.use(express.static(path.join(__dirname, "..", "public")));

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const io = require("./socket").init(server);
const game = require("./game");
