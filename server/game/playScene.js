const path = require("path");
const Phaser = require("phaser");
const io = require("../socket").io(); //returns io object

const PlayerManager = require("./PlayerManager");
const ProjectileManager = require("./ProjectileManager");

module.exports = class PlayScene extends Phaser.Scene {
  constructor() {
    super();
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

    let mappy = this.add.tilemap("mappy");
    let terrarian = mappy.addTilesetImage("Base", "");
    let grassLayer = mappy.createStaticLayer("Grass", [terrarian], 0, 0);
    grassLayer.setDepth(-1);
    let top = mappy.createStaticLayer("Collides", [terrarian], 0, 0);
    let houseTop = mappy.createStaticLayer("HouseTop", [terrarian], 0, 0);
    let trees = mappy.createStaticLayer("Trees", [terrarian], 0, 0);

    this.physics.add.collider(this.PlayerManager.playersGroup, top);
    this.physics.add.collider(this.PlayerManager.playersGroup, trees);
    this.physics.add.collider(
      this.ProjectileManager.projectiles,
      top,
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
        player.setPosition(256, 256);
      },
      (player, bullet) => {
        return player.id !== bullet.owner;
      }
    );

    top.setCollisionByProperty({ collides: true });
    trees.setCollisionByProperty({ collides: true });

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
            const vec = this.physics.velocityFromRotation(player.rotation, 60);
            this.ProjectileManager.addNewProjectile(
              player.x,
              player.y,
              vec,
              player.id,
              player.rotation
            );
          }
        }
      });
    });
  }

  update() {
    io.emit("update", {
      playerList: this.PlayerManager.getPlayerState(),
      bulletList: this.ProjectileManager.getProjectiles(),
    });
  }
};
