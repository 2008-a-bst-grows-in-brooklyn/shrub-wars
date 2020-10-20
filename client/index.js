import Phaser from "phaser";
import ClientScene from "./ClientScene";
import RespawnPopup from "./RespawnPopup";
import GameOverPopup from "./GameOverPopup";
import StartMenu from "./StartMenu";

const config = {
  type: Phaser.AUTO,
  width: 512,
  height: 512,
  scale: {
    mode: Phaser.Scale.ENVELOP,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "game",
  },
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [StartMenu, ClientScene, RespawnPopup, GameOverPopup],
};

new Phaser.Game(config);
