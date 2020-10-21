import Phaser from "phaser";

export default class Credit extends Phaser.Scene {
  constructor() {
    super({ key: "Credits" });
  }
  preload() {
    this.load.image("village", "Village.png");
  }
  create() {
    this.add.image(0, 0, "village");

    this.add
      .text(8, 0, "↩", {
        fontSize: 32,
        color: "#000000",
      })
      .setScrollFactor(0, 0)
      .setDepth(2)
      .setOrigin(0, 0);
    this.add
      .circle(2, 0, 16, 0xff6a00)
      .setDepth(1)
      .setScrollFactor(0, 0)
      .setOrigin(0, 0)
      .setInteractive()
      .on("pointerdown", () => {
        //HANDLE LEAVING ROOM
        console.log("leaving room!");
        this.scene.stop("Credits");
        this.scene.start("StartMenu");
      });

    this.add
      .text(256, 150, "Creators: \n Adrian, \n Cory,\n  David, \n Kirby", {
        fontFamily: "Luminari, fantasy",
        color: "#000000",
        backgroundColor: "#FFB233",
      })
      .setOrigin(0.5);
    this.add
      .text(
        256,
        300,
        "Map Tilesets and Sprites: PIPOYA \n URL: https://itch.io/profile/pipoya",
        {
          fontFamily: "Luminari, fantasy",
          color: "#000000",
          backgroundColor: "#FFB233",
        }
      )
      .setOrigin(0.5);
  }
}
