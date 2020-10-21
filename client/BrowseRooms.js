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
      .rectangle(256, yPosition, 330, 30, 0xdddddd)
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
      .text(256, yPosition, `Join Room ${roomId}`, { color: "#000000" })
      .setOrigin(0.5)
      .setDepth(2);

    group.addMultiple([box, text]);

    //this.add.rectangle(256, 20).setOrigin(0, 0);
  }

  preload() {
    this.load.image("village", "Village.png");
  }
  create() {
    this.add.image(0, 0, "village").setDepth(-1);
    this.add.rectangle(256, 256, 418, 468, 0x444444, 0.8);

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
      .setOrigin(0, 0)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("StartMenu");
      });

    //fetchrooms once on load
    this.getRooms();
  }
}
