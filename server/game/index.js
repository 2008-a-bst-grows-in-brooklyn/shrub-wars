const Phaser = require("phaser");
const ServerScene = require("./ServerScene");

// prepare the config for Phaser
const config = {
  type: Phaser.HEADLESS,
  width: 512,
  height: 512,
  banner: false,
  audio: false,
  scene: ServerScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
};

// start the game
//const newGame = new Phaser.Game(config);

//module.exports = newGame;

class Game extends Phaser.Game {
  constructor() {
    super(config);
  }
}

module.exports = Game;
