import Phaser from "phaser";

export default class Credit extends Phaser.Scene {
  constructor() {
    super({ key: "Credits" });
  }
  preload() {
    this.load.image("village", "Village.png");
    this.load.image("GhostOne", "GhostOne.png");
    this.load.image("GhostOneRight", "GhostOneRight.png");
    this.load.image("GhostOneLeft", "GhostOneLeft.png");
    this.load.image("GhostTwo", "GhostTwo.png");
    this.load.image("GhostTwoUp", "GhostTwoUp.png");
    this.load.image("GhostTwoLeft", "GhostTwoLeft.png");
    this.load.image("InvertedRed", "InvertedRed.png");
    this.load.image("red", "red.png");
    this.load.image("BlueUp", "BlueUp.png");
    this.load.image("BlueDown", "BlueDown.png");
    this.load.image("back_arrow", "back_arrow.png");
  }
  create() {
    this.add.image(0, 0, "village");
    this.add.image(120, 50, "GhostOneRight");
    this.add.image(200, 50, "InvertedRed");
    this.add.image(390, 160, "GhostTwo");
    this.add.image(390, 205, "BlueDown");
    this.add.image(415, 420, "GhostOneLeft");
    this.add.image(360, 420, "red");
    this.add.image(145, 330, "GhostTwoUp");
    this.add.image(148, 275, "BlueUp");
    this.add.image(190, 465, "GhostOne");
    this.add.image(450, 20, "GhostTwoLeft");

    this.add
      .image(0, 0, "back_arrow")
      .setScrollFactor(0, 0)
      .setDepth(2)
      .setOrigin(0, 0);
    this.add
      .circle(0, 0, 16, 0xffb233)
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
      .text(256, 95, " Created By: ", {
        fontFamily: "Luminari, fantasy",
        fontSize: 32,
        color: "#FF9A00",
        backgroundColor: "#000000",
      })
      .setOrigin(0.5);

    this.add
      .text(256, 145, " Adrian Javorski ", {
        fontFamily: "Luminari, fantasy",
        fontSize: 18,
        color: "#000000",
        backgroundColor: "#FFB233",
      })
      .setOrigin(0.5);

    this.add
      .text(256, 185, " Corey Mertz ", {
        fontFamily: "Luminari, fantasy",
        fontSize: 18,
        color: "#000000",
        backgroundColor: "#FFB233",
      })
      .setOrigin(0.5);

    this.add
      .text(256, 225, " David Moon ", {
        fontFamily: "Luminari, fantasy",
        fontSize: 18,
        color: "#000000",
        backgroundColor: "#FFB233",
      })
      .setOrigin(0.5);

    this.add
      .text(256, 265, " Kirby Chen ", {
        fontFamily: "Luminari, fantasy",
        fontSize: 18,
        color: "#000000",
        backgroundColor: "#FFB233",
      })
      .setOrigin(0.5);

    this.add
      .text(256, 305, " Map Tilesets and Sprites Created By: PIPOYA ", {
        fontFamily: "Luminari, fantasy",
        fontSize: 18,
        color: "#FF9A00",
        backgroundColor: "#000000",
      })
      .setOrigin(0.5);

    this.add
      .text(256, 345, " https://itch.io/profile/pipoya ", {
        fontFamily: "Luminari, fantasy",
        fontSize: 18,
        color: "#000000",
        backgroundColor: "#FFB233",
      })
      .setOrigin(0.5);

    this.add
      .text(256, 385, " Music Created By: Example ", {
        fontFamily: "Luminari, fantasy",
        fontSize: 18,
        color: "#FF9A00",
        backgroundColor: "#000000",
      })
      .setOrigin(0.5);

    this.add
      .text(256, 425, " https://www.example.com ", {
        fontFamily: "Luminari, fantasy",
        fontSize: 18,
        color: "#000000",
        backgroundColor: "#FFB233",
      })
      .setOrigin(0.5);
  }
}
