import Phaser from "phaser";

export default class RespawnPopup extends Phaser.Scene {
  constructor() {
    super({ key: "RespawnPopup" });
  }

  create() {
    this.add.rectangle(256, 256, 320, 180, 0x444444, 0.8);

    this.add
      .text(256, 256 - 40, `You Have Died`, { fontSize: "28px" })
      .setOrigin(0.5);
    this.add.text(256, 256, `:(`).setOrigin(0.5);
    this.add.text(256, 256 + 40, `Respawning...`).setOrigin(0.5);
  }
}
