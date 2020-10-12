const path = require("path");
const Phaser = require("phaser");
const io = require("../socket").io(); //returns io object

const PlayerManager = require("./PlayerManager");

module.exports = class PlayScene extends Phaser.Scene {
  constructor() {
    super();
    //this.PlayerManager.playerList = {};
    this.bulletList = {};
    this.bulletId = 0;
  }
  // playerList contains player objects; player.bulletList[id] = new bullet
  preload() {
    this.load.tilemapTiledJSON(
      "mappy",
      path.join(__dirname, "..", "..", "public", "Village.json")
    );
  }

  create() {
    this.PlayerManager = new PlayerManager(this);
    this.bullets = this.add.group();

    let mappy = this.add.tilemap("mappy");
    let terrarian = mappy.addTilesetImage("Base", "");
    let grassLayer = mappy.createStaticLayer("Grass", [terrarian], 0, 0);
    grassLayer.setDepth(-1);
    let top = mappy.createStaticLayer("Collides", [terrarian], 0, 0);
    let houseTop = mappy.createStaticLayer("HouseTop", [terrarian], 0, 0);
    let trees = mappy.createStaticLayer("Trees", [terrarian], 0, 0);

    this.physics.add.collider(this.PlayerManager.playersGroup, top);
    this.physics.add.collider(this.PlayerManager.playersGroup, trees);
    this.physics.add.collider(this.bullets, top, (bullet) => {
      this.bulletList[bullet.id] = null;
      bullet.destroy();
    });
    this.physics.add.collider(
      this.PlayerManager.playersGroup,
      this.bullets,
      (player, bullet) => {
        this.bulletList[bullet.id] = null;
        bullet.destroy();
        player.setPosition(256, 256);
      },
      (player, bullet) => {
        return player.id !== bullet.playerId;
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
            const bullet = this.add.rectangle(
              player.x,
              player.y,
              16,
              16,
              0xdddddd
            );
            bullet["id"] = this.bulletId++; // Global bullet ID
            bullet["playerId"] = socket.id; // For collisions
            this.bullets.add(bullet);
            bullet.rotation = player.rotation;
            this.physics.add.existing(bullet);
            bullet.body.setVelocity(-vec.x, -vec.y);
            this.bulletList[bullet.id] = bullet;
          }
        }
      });
    });
  }

  update() {
    let modifiedBulletList = {};
    for (const id in this.bulletList) {
      let bullet = this.bulletList[id];
      if (bullet === null) {
        modifiedBulletList[id] = bullet;
      } else {
        modifiedBulletList[id] = {
          playerId: bullet.playerId,
          x: bullet.x,
          y: bullet.y,
          rotation: bullet.rotation,
        };
      }
    }

    io.emit("update", {
      playerList: this.PlayerManager.getPlayerState(),
      bulletList: modifiedBulletList,
    });
  }
};
