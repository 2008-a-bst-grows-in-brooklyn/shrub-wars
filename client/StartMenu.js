import Phaser from "phaser";

export default class StartMenu extends Phaser.Scene {
  constructor() {
    super({ key: "StartMenu" });
  }

  create() {
    this.add
      .rectangle(0, 256, 320, 180, 0x444444, 0.8)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("pointer downed");
        //switch client-side scene (currently 'testscene')
        this.scene.start("TestScene", { roomId: 0 });
      });
    this.add
      .rectangle(512, 256, 320, 180, 0xff4444, 0.8)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("pointer downed");
        //switch client-side scene (currently 'testscene')
        this.scene.start("TestScene", { roomId: 1 });
      });

    this.add
      .text(256, 256, `Click Here To Join Game`, {
        fontFamily: "Comic Sans MS",
      })
      .setOrigin(0.5);
  }
}
