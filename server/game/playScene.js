const path = require("path");
const Phaser = require("phaser");
const io = require("../socket").io(); //returns io object

const PlayerManager = require("./PlayerManager");
const ProjectileManager = require("./ProjectileManager");
const Map = require("./Maps");

module.exports = class PlayScene extends Phaser.Scene {
  constructor() {
    super();
    this.score = { red: 0, blue: 0 };
  }
  preload() {
    this.load.tilemapTiledJSON(
      "mappy",
      path.join(__dirname, "..", "..", "public", "Village.json")
    );
  }

  create() {
    this.PlayerManager = new PlayerManager(this);
    this.ProjectileManager = new ProjectileManager(this);
    this.Map = new Map(this);
    this.Map.createMap();
    this.flag = this.add.rectangle(1024, 928, 32, 32, 0xffffff);
    this.physics.add.existing(this.flag);

    this.physics.add.collider(
      this.PlayerManager.playersGroup,
      this.Map.collidesPlayer
    );

    this.physics.add.collider(
      this.ProjectileManager.projectiles,
      this.Map.collidesBullets,
      (bullet) => {
        this.ProjectileManager.projectileList[bullet.id] = null;
        bullet.destroy();
      }
    );
    this.physics.add.collider(
      this.PlayerManager.playersGroup,
      this.ProjectileManager.projectiles,
      (player, bullet) => {
        this.ProjectileManager.projectileList[bullet.id] = null;
        bullet.destroy();
        player.setPosition(player.team.x, player.team.y);
      },
      (player, bullet) => {
        return player.id !== bullet.owner;
      }
    );
    this.physics.add.collider(
      this.Map.blueTeam,
      this.PlayerManager.playersGroup,
      () => {
        if (this.flag.playerId) {
          this.score.red++;
          let player = this.PlayerManager.playerList[this.flag.playerId];
          player.holdingFlag = false;
          this.flag.x = 1024;
          this.flag.y = 928;
          // player.overFlag = false;
          this.flag.playerId = null;
        }
      }
      // (map, player) => {
      //   return player.holdingFlag;
      // }
    );
    this.physics.add.collider(this.Map.blueTeam, this.flag, () => {
      this.score.blue++;
      console.log("SCORE blue", this.score.blue);
      this.flag.setPosition(1024, 928);
    });

    io.on("connect", (socket) => {
      console.log("Connected!", socket.id);
      /* Create new player object */

      this.PlayerManager.addNewPlayer(socket);

      socket.on("CLIENT_READY", () => {
        socket.emit("INITIALIZE_GAME", {
          id: socket.id,
          playerList: this.PlayerManager.getPlayerState(),
        });
      });

      socket.on("disconnect", () => {
        console.log(socket.id, "disconnected");
        this.PlayerManager.removePlayer(socket);
      });

      socket.on("PLAYER_ROTATED", (angle) => {
        this.PlayerManager.getPlayer(socket).setRotation(angle);
      });

      socket.on("PLAYER_MOVED", (moveState) => {
        this.PlayerManager.getPlayer(socket).setVelocity(moveState);
      });

      socket.on("PLAYER_ACTION", (actionState) => {
        if (this.PlayerManager.playerList[socket.id]) {
          const player = this.PlayerManager.playerList[socket.id];

          if (actionState.pointer) {
            const vec = this.physics.velocityFromRotation(player.rotation, 300);
            console.log(player.x, player.y, "playerposition");
            this.ProjectileManager.addNewProjectile(
              player.x,
              player.y,
              vec,
              player.id,
              player.rotation
            );
          } else if (actionState.space) {
            console.log("spacePressed once");
            this.physics.add.overlap(player, this.flag, (player, flag) => {
              flag.playerId = socket.id;
              if (!player.overFlag && !player.holdingFlag) {
                player.holdingFlag = true;
                player.overFlag = true;
                console.log(player.holdingFlag);
              } else if (player.holdingFlag) {
                flag.x = player.x;
                flag.y = player.y;
                // } else if (!player.holdingFlag) {
                //   flag.x = 1024;
                //   flag.y = 928;
                //   player.overFlag = false;
              }
            });
          }
        }
      });
    });
  }

  update() {
    io.emit("update", {
      playerList: this.PlayerManager.getPlayerState(),
      bulletList: this.ProjectileManager.getProjectiles(),
      flag: { x: this.flag.x, y: this.flag.y },
    });
  }
};
