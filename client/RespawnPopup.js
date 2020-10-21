import Phaser from "phaser";

export default class RespawnPopup extends Phaser.Scene {
  constructor() {
    super({ key: "RespawnPopup" });
  }

  create() {
    this.add.rectangle(256, 256, 320, 180, 0x444444, 0.8);

    this.add
      .text(256, 256 - 40, `You Have Died`, { fontSize: "28px"})
      .setOrigin(0.5)
      .setStyle({
        fontFamily: 'Luminari, fantasy' 
      })
    this.add.text(256, 256, `:(`, {fontFamily: 'Luminari, fantasy'}).setOrigin(0.5);
    this.add.text(256, 256 + 40, `Respawning...`, {fontFamily: 'Luminari, fantasy'}).setOrigin(0.5);
  }
}
