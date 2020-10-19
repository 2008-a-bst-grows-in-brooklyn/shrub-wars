import Phaser from "phaser";

import socket from "./socket";

export default class TestScene extends Phaser.Scene {
  constructor() {
    super({ key: "TestScene" });
    this.playerList = {};
    this.bulletList = {};
    this.playerId;
    this.score = { red: 0, blue: 0 };
    this.gameOver = false;
  }

  preload() {
    this.load.image("village", "Village.png");
    this.load.image("shrub", "bush.png");
  }

  create(roomData) {
    this.ammoText = this.add
      .text(256, 480, 0)
      .setScrollFactor(0, 0)
      .setDepth(1)
      .setOrigin(0.5, 0.5)
      .setStyle({
        color: "#000000",
        fontFamily: "Comic Sans MS",
      });

    this.bullets = this.add.group();
    this.add.image(0, 0, "village").setOrigin(0);
    this.flag = this.add.image(1024, 928, "shrub").setDepth(1);
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
          this.playerId = id;
          this.cameras.main.startFollow(player);
          this.scoreboard = this.add
            .text(180, 5, `RED: ${this.score.red} | BLUE: ${this.score.blue}`)
            .setScrollFactor(0, 0)
            .setStyle({ color: "#000000", fontFamily: "Comic Sans MS" });
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
          let serverPlayer = data.playerList[id];
          let clientPlayer = this.playerList[id];

          //update rendered location and rotation
          clientPlayer.setPosition(serverPlayer.x, serverPlayer.y);
          clientPlayer.rotation = serverPlayer.rotation;

          //isRespawning is a float from 1 to 0 representing respawn progress
          if (!serverPlayer.isRespawning) {
            clientPlayer.setAlpha(1);
            if (serverPlayer.teamName === "red") {
              clientPlayer.setFillStyle(0xff0000);
            } else {
              clientPlayer.setFillStyle(0x0000ff);
            }
            //what happens when a player dies
          } else {
            clientPlayer.setFillStyle(0x000000, serverPlayer.isRespawning);
          }

          //functions specific to the controlling player
          if (id === this.playerId) {
            this.ammoText.setText(serverPlayer.ammo + " shots remaining");
            if (serverPlayer.ammo === 0) {
              this.ammoText.setText("Reloading...");
            }

            if (serverPlayer.isRespawning && !clientPlayer.isRespawning) {
              this.scene.wake("RespawnPopup");
            } else if (
              !serverPlayer.isRespawning &&
              clientPlayer.isRespawning
            ) {
              this.scene.sleep("RespawnPopup");
            }
          }

          clientPlayer.isRespawning = serverPlayer.isRespawning;
        }
        //score
        this.score = data.score;
        this.scoreboard.setText(
          `RED: ${this.score.red} | BLUE: ${this.score.blue}`
        );
        this.gameOver = data.gameOver;
        if (this.gameOver === true) {
          console.log('We are in')
          this.scene.wake("GameOverPopup")
        } else {
          this.scene.sleep("GameOverPopup");
        }
        
        //updates bullets -- TODO: rework how bullets are saved.
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
        this.playerList[id].destroy();
        delete this.playerList[id];
      });
    });

    //Finally, tell the server which room to join. Server will respond with "initialize room"
    socket.emit("JOIN_ROOM", roomData.roomId);

    this.scene.launch("RespawnPopup");
    this.scene.sleep("RespawnPopup");
    this.scene.launch("GameOverPopup");
    this.scene.sleep("GameOverPopup");
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
