import Phaser from "phaser";
import ClientScene from "./ClientScene";
import RespawnPopup from "./RespawnPopup";
import GameOverPopup from "./GameOverPopup";
import StartMenu from "./StartMenu";
import BrowseRooms from "./BrowseRooms";
import Credits from "./Credits";

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
  dom: {
    createContainer: true, // Allows the creation of DOM elements within the Phaser Canvas
  },

  scene: [
    StartMenu,
    ClientScene,
    RespawnPopup,
    GameOverPopup,
    BrowseRooms,
    Credits,
  ],
};

new Phaser.Game(config);
