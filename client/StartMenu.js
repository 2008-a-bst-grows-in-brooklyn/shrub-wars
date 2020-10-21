import Phaser from "phaser";
import socket from "./socket";

export default class StartMenu extends Phaser.Scene {
  constructor() {
    super({ key: "StartMenu" });
  }
  preload() {
    this.load.html("joinRoom", "./joinRoom.html");
    this.load.image("village", "Village.png");
    this.load.image("pumpkin", "bush.png");
    this.load.image("GhostOne", "GhostOne.png")
    this.load.image("GhostOneRight", "GhostOneRight.png");
    this.load.image("GhostOneLeft", "GhostOneLeft.png");
    this.load.image("GhostTwo", "GhostTwo.png");
    this.load.image("GhostTwoUp", "GhostTwoUp.png");
    this.load.image("GhostTwoLeft", "GhostTwoLeft.png");
    this.load.image("InvertedRed", "InvertedRed.png");
    this.load.image("red", "red.png");
    this.load.image("BlueUp", "BlueUp.png");
    this.load.image("BlueDown", "BlueDown.png");
  }
  create() {
    this.add.image(0, 0, "village");
    this.add.image(167, 95, "pumpkin")
    .setDepth(1)
    this.add.image(345, 95, "pumpkin")
    .setDepth(1)
    this.add.image(120, 50, "GhostOneRight")
    this.add.image(200, 50, "InvertedRed")
    this.add.image(390, 160, "GhostTwo")
    this.add.image(390, 205, "BlueDown")
    this.add.image(415, 420, "GhostOneLeft")
    this.add.image(360, 420, "red")
    this.add.image(145, 330, "GhostTwoUp")
    this.add.image(148, 275, "BlueUp")
    this.add.image(190, 465, "GhostOne")
    this.add.image(450, 20, "GhostTwoLeft")
    // title
    this.add
      .text(256, 95, "     Boo Bash     ", {
        fontFamily: "Luminari, fantasy",
        fontSize: 32,
        color: "#FF9A00",
        backgroundColor: "#000000"
      })
      .setOrigin(0.5);
    //Create Game button
    this.add
      .text(256, 315, "< Create Game >", {
        fontFamily: "Luminari, fantasy",
        fontSize: 18,
        color: "#000000",
        backgroundColor: "#FFB233",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("pointer downed");
        socket.emit("CREATE_GAME"); // Starts a room instance
        socket.once("GET_ROOMID", (id) => {
          this.scene.start("ClientScene", { roomId: id });
        });
      });
    // Browse Game button
    this.add
      .text(256, 350, "< Browse Games >", {
      fontFamily: "Luminari, fantasy",
      fontSize: 18,
      color: "#000000",
      backgroundColor: "#FFB233",
    })
    .setOrigin(0.5);


    //Join game Button
    this.add
      .text(256, 385, "< Join Game >", {
        fontFamily: "Luminari, fantasy",
        fontSize: 18,
        color: "#000000",
        backgroundColor: "#FFB233",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("pointer downed");

        /* Form and Form Listener  */
        const form = this.add.dom(293, 280, "div").createFromCache("joinRoom"); // Dom element for the form
        form.addListener("click"); // Listener for submit
        form.on("click", (event) => {
          if (event.target.name === "submit") {
            const roomId = form.getChildByName("room").value; // Grabs the value from the text input
            if (roomId !== "") {
              socket.emit("FIND_ROOM", roomId); // Look for room and checking if room exists
              socket.once("ROOM_FOUND", () => {
                this.scene.start("ClientScene", { roomId }); // Starts game scene if room is found
              });
            } else {
              console.log("ERROR: No room specified"); // Text input was left empty
            }
          }
        });
      });

    // Credit Button
    this.add
      .text(256, 415, "< Credits >", {
        fontFamily: "Luminari, fantasy",
        fontSize: 18,
        color: "#000000",
        backgroundColor: "#FFB233",
      })
      .setOrigin(0.5);
  }
}
