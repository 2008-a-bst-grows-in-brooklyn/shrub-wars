import Phaser from "phaser";
import io from "socket.io-client";

const socket = io();
socket.on("connect", () => {
  console.log("Connected!");
});

export default class TestScene extends Phaser.Scene {
  constructor() {
    super({ key: "TestScene" });
    this.playerList = {};
    this.bulletList = {};
  }

  preload() {
    // this.load.image("grass", "Base.png");
    // this.load.tilemapTiledJSON("mappy", "POC2.json");
    this.load.image("village", "Village.png");
  }

  create() {
    this.bullets = this.add.group();
    this.add.image(0, 0, "village").setOrigin(0);
    this.flag = this.add.rectangle(1024, 928, 32, 32, 0xffffff);
    this.controls = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up1: Phaser.Input.Keyboard.KeyCodes.I,
      down1: Phaser.Input.Keyboard.KeyCodes.K,
      left1: Phaser.Input.Keyboard.KeyCodes.J,
      right1: Phaser.Input.Keyboard.KeyCodes.L,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    this.pointer = this.input.on("pointerdown", () => {
      socket.emit("PLAYER_ACTION", {
        pointer: true,
      });
    });

    //First, declare the initialize game listener
    socket.on("INITIALIZE_GAME", (data) => {
      for (const id in data.playerList) {
        let newPlayer = data.playerList[id];
        console.log("newPlayer = ", newPlayer);
        let color;
        if (newPlayer.teamName === "red") {
          color = 0xff0000;
        } else {
          color = 0x0000ff;
        }
        let player = this.add.rectangle(
          newPlayer.x,
          newPlayer.y,
          32,
          32,
          color
        );
        player.id = id;
        this.playerList[id] = player;

        if (id === data.id) {
          this.id = id;
          this.cameras.main.startFollow(player);
        }
      }

      for (const id in data.bulletList) {
        let newBullet = data.bulletList[id];
        let bullet = this.add.rectangle(
          newBullet.x,
          newBullet.y,
          16,
          16,
          0xdddddd
        );
        bullet.id = id;
        this.bulletList[id] = bullet;
      }

      //only start listening for gamestate updates after completing initialization
      socket.on("update", (data) => {
        for (const id in data.playerList) {
          let player = data.playerList[id];
          this.playerList[id].setPosition(player.x, player.y);
          this.playerList[id].rotation = player.rotation;
        }
        for (const id in data.bulletList) {
          let serverBullet = data.bulletList[id];
          if (this.bulletList[id] || serverBullet === null) {
            if (serverBullet === null) {
              if (this.bulletList[id]) {
                this.bulletList[id].destroy();
                delete this.bulletList[id];
              }
            } else {
              this.bulletList[id].setPosition(serverBullet.x, serverBullet.y);
              this.bulletList[id].rotation = serverBullet.rotation;
            }
          } else {
            let bullet = this.add.rectangle(
              serverBullet.x,
              serverBullet.y,
              16,
              16,
              0xdddddd
            );
            bullet.id = id;
            this.bulletList[id] = bullet;
          }
        }
        this.flag.setPosition(data.flag.x, data.flag.y);
      });

      socket.on("PLAYER_JOINED", (newPlayer) => {
        console.log(newPlayer, "joined");
        let color;
        if (newPlayer.teamName === "red") {
          color = 0xff0000;
        } else {
          color = 0x0000ff;
        }
        let player = this.add.rectangle(
          newPlayer.x,
          newPlayer.y,
          32,
          32,
          color
        );
        player.id = newPlayer.id;
        this.playerList[newPlayer.id] = player;
      });
      // Create bullet
      socket.on("PLAYER_LEFT", (id) => {
        console.log("Player Left");
        this.playerList[id].destroy();
        delete this.playerList[id];
      });
    });
    //Finally, tell the server that the client is ready to receive the "INITIALIZE_GAME" signal
    socket.emit("CLIENT_READY");
  }

  update() {
    socket.emit(
      "PLAYER_ROTATED",
      Phaser.Math.Angle.Between(this.input.x, this.input.y, 512 / 2, 512 / 2)
    );
    socket.emit("PLAYER_ACTION", {
      space: this.controls.space.isDown,
    });
    socket.emit("PLAYER_MOVED", {
      up: this.controls.up.isDown || this.controls.up1.isDown,
      down: this.controls.down.isDown || this.controls.down1.isDown,
      left: this.controls.left.isDown || this.controls.left1.isDown,
      right: this.controls.right.isDown || this.controls.right1.isDown,
    });
  }
}
