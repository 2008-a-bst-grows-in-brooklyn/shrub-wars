import Phaser from "phaser";
import socket from "./socket";

export default class StartMenu extends Phaser.Scene {
  constructor() {
    super({ key: "StartMenu" });
  }
  preload() {
    this.load.html("joinRoom", "./joinRoom.html");
    this.load.image("village", "Village.png");
  }
  create() {
    this.add.image(0, 0, "village");
    // title
    this.add
      .text(256, 100, "Boo Bash", {
        fontFamily: "Luminari, fantasy",
        fontSize: 32,
        color: "#FF9A00",
      })
      .setOrigin(0.5);
    //Create Game button
    this.add
      .text(256, 290, "< Create Game >", {
        fontFamily: "Luminari, fantasy",
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

    //Join game Button
    this.add
      .text(256, 360, "< Join Game >", {
        fontFamily: "Luminari, fantasy",
        color: "#000000",
        backgroundColor: "#FFB233",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("pointer downed");

        /* Form and Form Listener  */
        const form = this.add.dom(256, 256, "div").createFromCache("joinRoom"); // Dom element for the form
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

    // Browse Game button
    this.add
      .text(256, 325, "< Browse Games >", {
        fontFamily: "Luminari, fantasy",
        color: "#000000",
        backgroundColor: "#FFB233",
      })
      .setOrigin(0.5);

    // Credit Button
    this.add
      .text(256, 395, "< Credits >", {
        fontFamily: "Luminari, fantasy",
        color: "#000000",
        backgroundColor: "#FFB233",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("pointer downed");
        this.scene.start("Credits");
      });
  }
}
