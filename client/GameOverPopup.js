import Phaser from "phaser";

export default class GameOverPopup extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverPopup" });
  }

  create() {
    this.add.rectangle(256, 256, 320, 180, 0x444444, 0.8);

    this.add
      .text(256, 256 - 40, `Game Over!`, { fontSize: "32px"})
      .setOrigin(0.5)
      .setStyle({
        fontFamily: 'Comic Sans MS' 
      })
    this.add.text(256, 256, `Restarting`, {fontFamily: 'Comic Sans MS', fontSize: "22px"}).setOrigin(0.5);
    this.add.text(256, 256 + 40, `Shortly...`, {fontFamily: 'Comic Sans MS', fontSize: "18px"}).setOrigin(0.5);
  }
}
