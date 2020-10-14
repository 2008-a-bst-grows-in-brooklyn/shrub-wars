const path = require("path");
const Phaser = require("phaser");
const io = require("../socket").io(); //returns io object

const PlayerManager = require("./PlayerManager");
const ProjectileManager = require("./ProjectileManager");
const Map = require("./Maps");

/*
OnPlayer Collides with Projectile:
  Set a property on the player to "dead === true"
  Methods on player instances to "die" and "respawn"

Have input-processors on the server-side ignore inputs when the player is dead

Communicate to all clients the current dead/alive state of each player

Player "respawns" after a certain period of time

Clientside:
  Player sees a special notification if they're dead
  All players see a visual difference on a dead player (opacity)
*/

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

    //Player collides with a projectile
    this.physics.add.collider(
      this.PlayerManager.playersGroup,
      this.ProjectileManager.projectiles,
      (player, bullet) => {
        this.ProjectileManager.projectileList[bullet.id] = null;
        bullet.destroy();
        player.die();
      },
      (player, bullet) => {
        return player.id !== bullet.owner;
      }
    );
    // this.physics.add.overlap(
    //   this.Map.blueTeam,
    //   this.PlayerManager.playersGroup,
    //   () => {
    //     if (this.flag.playerId) {
    //       this.score.red++;
    //       let player = this.PlayerManager.playerList[this.flag.playerId];
    //       this.flagCollider.destroy();
    //       this.flag.x = 1024;
    //       this.flag.y = 928;
    //       player.holdingFlag = false;
    //       player.overFlag = false;
    //       this.flag.playerId = null;
    //     }
    //   }
    //   // (map, player) => {
    //   //   return player.holdingFlag;
    //   // }
    // );
    // this.physics.add.collider(this.Map.blueTeam, this.flag, () => {
    //   this.score.blue++;
    //   console.log("SCORE blue", this.score.blue);
    //   this.flag.setPosition(1024, 928);
    // });

    // this.physics.add.overlap(
    //   this.PlayerManager.playersGroup,
    //   this.flag,
    //   (player, flag) => {
    //     player.selected = this.flag;
    //   }
    // );

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
        const player = this.PlayerManager.getPlayer(socket);
        if (player && !player.isRespawning) {
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
            // this.flagCollider = this.physics.add.overlap(
            //   player,
            //   this.flag,
            //   (player, flag) => {
            //     flag.playerId = socketId;
            //     if (!player.overFlag) {
            //       player.holdingFlag = true;
            //       player.overFlag = true;
            //     } else if (player.holdingFlag) {
            //       flag.x = player.x;
            //       flag.y = player.y;
            //     }
            //   }
            // );
          }
        }
      });
    });
  }

  update() {
    for (const player in this.PlayerManager.playersGroup) {
      player.selected = false;
    }
    io.emit("update", {
      playerList: this.PlayerManager.getPlayerState(),
      bulletList: this.ProjectileManager.getProjectiles(),
      flag: { x: this.flag.x, y: this.flag.y },
    });
  }
};
