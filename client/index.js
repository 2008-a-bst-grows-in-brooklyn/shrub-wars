import Phaser from "phaser";
import TestScene from "./testscene";

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 1024,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "game",
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [TestScene],
};

new Phaser.Game(config);
