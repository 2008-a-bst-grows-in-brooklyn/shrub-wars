import Phaser from "phaser";
import socket from "./socket";

export default class BrowseRooms extends Phaser.Scene {
  constructor() {
    super({ key: "BrowseRooms" });

    this.listGroup;
  }

  getRooms() {
    socket.once("ROOMS_FETCHED", (publicRooms) => {
      console.log(publicRooms, "rooms fetched");

      if (this.listGroup) {
        this.listGroup.destroy(true);
      }

      this.listGroup = this.add.group();

      publicRooms.forEach((roomId, index) => {
        this.createRoomRow(roomId, index, this.listGroup);
      });
    });
    socket.emit("FETCH_ROOMS");
  }

  createRoomRow(roomId, index, group) {
    const yPosition = 40 + 40 * index;
    console.log(roomId, index);

    const box = this.add
      .rectangle(256, yPosition, 330, 30, 0xffb233)
      .setOrigin(0.5)
      .setDepth(1)
      .setInteractive()
      .on("pointerdown", () => {
        socket.emit("FIND_ROOM", roomId); // Look for room and checking if room exists
        socket.once("ROOM_FOUND", () => {
          this.scene.start("ClientScene", { roomId }); // Starts game scene if room is found
        });
      });
    const text = this.add
      .text(256, yPosition, `Join Room ${roomId}`, {
        fontFamily: "Luminari, fantasy",
        fontSize: 18,
        color: "#000000"
      })
      .setOrigin(0.5)
      .setDepth(2);

    group.addMultiple([box, text]);

    //this.add.rectangle(256, 20).setOrigin(0, 0);
  }

  preload() {
    this.load.image("village", "Village.png");
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
    this.add.rectangle(256, 256, 358, 488, 0x444444, 0.8)

    this.add
      .text(0, 5, "↩", {
        fontSize: 32,
        color: "#000000",
      })
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
        this.scene.stop("BrowseRooms");
        this.scene.start("StartMenu");
      });
    //fetchrooms once on load
    this.getRooms();
  }
}
