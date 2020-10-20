import Phaser from "phaser";
import socket from "./socket";

export default class StartMenu extends Phaser.Scene {
  constructor() {
    super({ key: "StartMenu" });
  }
  preload() {
    this.load.html("joinRoom", "./joinRoom.html");
  }
  create() {
    this.add
      .rectangle(0, 256, 320, 180, 0x444444, 0.8)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("pointer downed");
        socket.emit("CREATE_GAME"); // Starts a room instance
        socket.once("GET_ROOMID", (id) => {
          this.scene.start("ClientScene", { roomId: id });
        });
      });
    this.add.text(10, 128, "Create Game");
    this.add
      .rectangle(512, 256, 320, 180, 0xff4444, 0.8)
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
    this.add.text(412, 128, "Join Game");

    this.add
      .text(256, 256, `Choose an option!`, {
        fontFamily: "Comic Sans MS",
      })
      .setOrigin(0.5);
  }
}
