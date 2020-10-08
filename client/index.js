import Phaser from "phaser";
import TestScene from "./testscene";

const config = {
  type: Phaser.AUTO,
  width: 512,
  height: 512,
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
