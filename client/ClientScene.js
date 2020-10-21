import Phaser from "phaser";
const phaserControls = Phaser.Input.Keyboard.KeyCodes;
import socket from "./socket";
import createAnimations from "./createAnimations";

export default class ClientScene extends Phaser.Scene {
  constructor() {
    super({ key: "ClientScene" });
    this.playerList = {};
    this.bulletList = {};
    this.playerId;
    this.score = { red: 0, blue: 0 };
    this.gameOver = false;
  }

  preload() {
    this.load.image("village", "Village.png");
    this.load.image("shrub", "bush.png");
    this.load.image("blue", "blue.png");
    this.load.image("red", "red.png");
    this.load.spritesheet("team1", "team1.png", { frameWidth: 32 });
    this.load.spritesheet("team2", "team2.png", { frameWidth: 32 });
  }

  create(roomData) {
    createAnimations(this);

    //initialize texts

    this.ammoText = this.add
      .text(256, 480, 0)
      .setScrollFactor(0, 0)
      .setDepth(1)
      .setOrigin(0.5, 0.5)
      .setStyle({
        color: "#000000",
        fontFamily: "Luminari, fantasy",
      });
    this.roomText = this.add
      .text(345, 5, `Room Code: ${roomData.roomId}`)
      .setScrollFactor(0, 0)
      .setDepth(1)
      .setStyle({
        color: "#000000",
        fontFamily: "Luminari, fantasy",
      });
    this.scoreboard = this.add
      .text(180, 5, `RED: ${this.score.red} | BLUE: ${this.score.blue}`)
      .setScrollFactor(0, 0)
      .setStyle({ color: "#000000", fontFamily: "Luminari, fantasy" })
      .setDepth(1);

    this.bullets = this.add.group();
    this.add.image(0, 0, "village").setOrigin(0);
    this.flag = this.add.image(1280, 928, "shrub").setDepth(1);
    this.controls = this.input.keyboard.addKeys({
      up: phaserControls.W,
      down: phaserControls.S,
      left: phaserControls.A,
      right: phaserControls.D,
      up1: phaserControls.I,
      down1: phaserControls.K,
      left1: phaserControls.J,
      right1: phaserControls.L,
      space: phaserControls.SPACE,
    });

    this.pointer = this.input.on("pointerdown", () => {
      socket.emit("PLAYER_ACTION", {
        pointer: true,
      });
    });

    //First, declare the initialize game listener
    socket.once("INITIALIZE_GAME", (data) => {
      console.log(data);
      for (const id in data.playerList) {
        let newPlayer = data.playerList[id];

        let team;
        if (newPlayer.teamName === "red") {
          team = "team1";
        } else {
          team = "team2";
        }
        console.log(team);
        let player = this.add.sprite(newPlayer.x, newPlayer.y, team);

        player.id = id;
        this.playerList[id] = player;

        //initialize player
        if (id === data.id) {
          this.playerId = id;
          this.cameras.main.startFollow(player);
        }
      }

      for (const id in data.bulletList) {
        let newBullet = data.bulletList[id];
        let bullet = this.add.image(
          newBullet.x,
          newBullet.y,
          newBullet.teamName
        );
        bullet.id = id;
        this.bulletList[id] = bullet;
      }

      //only start listening for gamestate updates after completing initialization
      const updateCallback = (data) => {
        for (const id in data.playerList) {
          let serverPlayer = data.playerList[id];
          let clientPlayer = this.playerList[id];

          //update rendered location and rotation
          clientPlayer.setPosition(serverPlayer.x, serverPlayer.y);

          let team;

          if (serverPlayer.teamName === "red") {
            team = 1;
          } else {
            team = 2;
          }

          const rot = serverPlayer.rotation;
          if (
            (rot < Math.PI / 4 && rot > 0) ||
            (rot > -Math.PI / 4 && rot < 0)
          ) {
            clientPlayer.anims.play(`left${team}`, true);
          } else if (rot >= Math.PI / 4 && rot < (Math.PI * 3) / 4) {
            clientPlayer.anims.play(`back${team}`, true);
          } else if (rot > (Math.PI * 3) / 4 || rot < (-Math.PI * 3) / 4) {
            clientPlayer.anims.play(`right${team}`, true);
          } else {
            clientPlayer.anims.play(`forward${team}`, true);
          }

          //isRespawning is a float from 1 to 0 representing respawn progress
          if (!serverPlayer.isRespawning) {
            clientPlayer.clearTint();
            clientPlayer.setAlpha(1);
            //what happens when a player dies
          } else {
            clientPlayer.setTint(0x000000);
            clientPlayer.setAlpha(serverPlayer.isRespawning);
          }

          //functions specific to the controlling player
          if (id === this.playerId) {
            this.ammoText.setText(serverPlayer.ammo + " Fire Balls Left!");
            if (serverPlayer.ammo === 0) {
              this.ammoText.setText("Recharging Fire Balls...");
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
        if (this.gameOver) {
          this.scene.wake("GameOverPopup");
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
            console.log(serverBullet.teamName);
            let bullet = this.add.image(
              serverBullet.x,
              serverBullet.y,
              serverBullet.teamName
            );
            bullet.id = id;
            this.bulletList[id] = bullet;
          }
        }
        this.flag.setPosition(data.flag.x, data.flag.y);
      };

      const joinCallback = (newPlayer) => {
        let team;
        if (newPlayer.teamName === "red") {
          team = "team1";
        } else {
          team = "team2";
        }
        let player = this.add.sprite(newPlayer.x, newPlayer.y, team);
        player.id = newPlayer.id;
        this.playerList[newPlayer.id] = player;
        console.log(player);
      };

      const leaveCallback = (id) => {
        this.playerList[id].destroy();
        delete this.playerList[id];
      };

      socket.on("update", updateCallback);
      socket.on("PLAYER_JOINED", joinCallback);
      socket.on("PLAYER_LEFT", leaveCallback);

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

          socket.off("update", updateCallback);
          socket.off("PLAYER_JOINED", joinCallback);
          socket.off("PLAYER_LEFT", leaveCallback);

          socket.emit("LEAVE_ROOM");
          this.scene.stop("ClientScene");
          this.scene.start("StartMenu");
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
