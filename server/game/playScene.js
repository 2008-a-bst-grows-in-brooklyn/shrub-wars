const path = require("path");
const Phaser = require("phaser");
const io = require("../socket").io(); //returns io object

const PlayerManager = require("./PlayerManager");
const ProjectileManager = require("./ProjectileManager");
const Flag = require("./Flag");

const Map = require("./Maps");

module.exports = class PlayScene extends Phaser.Scene {
  constructor() {
    super();
    this.score = { red: 0, blue: 0 };
    this.gameOver = false;
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
    this.flag = new Flag(this);

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
        return player.team.name !== bullet.teamName;
      }
    );

    this.physics.add.collider(
      this.Map.redTeam,
      this.PlayerManager.playersGroup,
      () => {
        this.flag.reset();
        this.score.red++;
        console.log(this.gameOver);
        if (this.score.red === 1) {
          this.gameOver = !this.gameOver;
          console.log(this.gameOver);
        }
      },
      (player, goal) => player.holdingFlag
    );
    this.physics.add.collider(
      this.Map.blueTeam,
      this.PlayerManager.playersGroup,
      () => {
        this.flag.reset();
        this.score.blue++;
        if (this.score.blue === 1) {
          this.won = !this.won;
        }
      },
      (player, goal) => player.holdingFlag
    );

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
        if (
          player &&
          !player.isRespawning &&
          !player.chambering &&
          !player.reloading &&
          !player.holdingFlag
        ) {
          if (actionState.pointer) {
            const vec = this.physics.velocityFromRotation(player.rotation, 300);
            this.ProjectileManager.addNewProjectile(
              player.x,
              player.y,
              vec,
              player.team.name,
              player.rotation
            );
            player.shotFired();
          } else if (actionState.space) {
            this.physics.overlap(player, this.flag, (player, flag) => {
              flag.setPlayer(player);
            });
          }
        }
      });
    });
  }

  update() {
    this.flag.updatePosition();

    io.emit("update", {
      playerList: this.PlayerManager.getPlayerState(),
      bulletList: this.ProjectileManager.getProjectiles(),
      flag: { x: this.flag.x, y: this.flag.y },
      score: this.score,
      gameOver: this.gameOver,
    });
  }
};
