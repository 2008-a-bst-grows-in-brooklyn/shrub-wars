const path = require("path");
const Phaser = require("phaser");

const PlayerManager = require("./PlayerManager");
const ProjectileManager = require("./ProjectileManager");
const Flag = require("./Flag");
const GameOver = require("./GameOver");

const Map = require("./Maps");

module.exports = class ServerScene extends Phaser.Scene {
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
    console.log("Game Created with Room ID: ", this.game.roomId);
    this.PlayerManager = new PlayerManager(this);
    this.ProjectileManager = new ProjectileManager(this);
    this.Map = new Map(this);
    this.Map.createMap();
    this.flag = new Flag(this);
    this.GameOver = new GameOver(this);

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
      this.ProjectileManager.projectiles,
      this.Map.base,
      (bullet) => {
        this.ProjectileManager.projectileList[bullet.id] = null;
        bullet.destroy;
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
        if (this.score.red === 10) {
          this.GameOver.gameOver();
        }
      },
      (player) => player.holdingFlag
    );
    this.physics.add.collider(
      this.Map.blueTeam,
      this.PlayerManager.playersGroup,
      () => {
        this.flag.reset();
        this.score.blue++;
        if (this.score.blue === 10) {
          this.GameOver.gameOver();
        }
      },
      (player) => player.holdingFlag
    );
  }

  //custom method to handle players joining
  clientJoin(socket) {
    console.log("Client", socket.id, "joined room", this.game.roomId);

    /* Create new player object */
    this.PlayerManager.addNewPlayer(socket);

    const dcCallback = () => {
      this.PlayerManager.removePlayer(socket);
    };

    socket.on("disconnect", dcCallback);

    socket.once("LEAVE_ROOM", () => {
      this.PlayerManager.removePlayer(socket);

      //hackish work-around to turn off game listeners
      /* const listeners = ["PLAYER_ROTATED", "PLAYER_MOVED", "PLAYER_ACTION"];
      listeners.forEach((listener) => {
        socket.off(listener);
      }); */

      socket.off("disconnect", dcCallback);
      socket.off("PLAYER_ROTATED", rotateCallback);
      socket.off("PLAYER_MOVED", moveCallback);
      socket.off("PLAYER_ACTION", actionCallback);
    });

    const rotateCallback = (angle) => {
      this.PlayerManager.getPlayer(socket).setRotation(angle);
    };
    const moveCallback = (moveState) => {
      this.PlayerManager.getPlayer(socket).setVelocity(moveState);
    };

    const actionCallback = (actionState) => {
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
    };

    socket.on("PLAYER_ROTATED", rotateCallback);
    socket.on("PLAYER_MOVED", moveCallback);
    socket.on("PLAYER_ACTION", actionCallback);

    socket.emit("INITIALIZE_GAME", {
      id: socket.id,
      playerList: this.PlayerManager.getPlayerState(),
    });
  }

  update() {
    this.flag.updatePosition();

    //this should emit only to the socket-room
    this.game.io.in(this.game.roomId).emit("update", {
      playerList: this.PlayerManager.getPlayerState(),
      bulletList: this.ProjectileManager.getProjectiles(),
      flag: { x: this.flag.x, y: this.flag.y },
      score: this.score,
      gameOver: this.GameOver.isResetting,
    });
  }
};
