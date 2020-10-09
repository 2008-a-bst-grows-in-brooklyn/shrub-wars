const Phaser = require("phaser");
const PlayScene = require("./playScene");

// prepare the config for Phaser
const config = {
  type: Phaser.HEADLESS,
  width: 512,
  height: 512,
  banner: false,
  audio: false,
  scene: [PlayScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
};

// start the game
const newGame = new Phaser.Game(config);

module.exports = newGame;
