const path = require("path");
const Phaser = require("phaser");
const io = require("../socket").io(); //returns io object

module.exports = class PlayScene extends Phaser.Scene {
  constructor() {
    super();
    this.playerList = {};
    this.bulletList = {};
    this.bulletId = 0;
    // this.bulletList = {};
  }
  // playerList contains player objects; player.bulletList[id] = new bullet
  preload() {
    /* this.load.image(
      "grass",
      path.join(__dirname, "..", "..", "public", "POCMap.png")
    ); */

    this.load.tilemapTiledJSON(
      "mappy",
      path.join(__dirname, "..", "..", "public", "POC2.json")
    );
  }

  create() {
    this.bullets = this.add.group();
    this.players = this.add.group();

    /* TODO: Reimplement rotation and shooting */
    /* this.leftMouse = this.input.on("pointerdown", () => {
      const vec = this.physics.velocityFromRotation(this.rect.rotation, 60);
      this.projectile = this.add.rectangle(
        this.rect.x,
        this.rect.y,
        16,
        16,
        0xff0000
      );
      this.bullets.add(this.projectile);
      this.projectile.rotation = this.rect.rotation;
      this.physics.add.existing(this.projectile);
      this.projectile.body.setVelocity(-vec.x, -vec.y);
    }); */

    let mappy = this.add.tilemap("mappy");
    let terrarian = mappy.addTilesetImage("Base", "");
    let grassLayer = mappy.createStaticLayer("Grass", [terrarian], 0, 0);
    grassLayer.setDepth(-1);
    let top = mappy.createStaticLayer("Top", [terrarian], 0, 0);

    this.physics.add.collider(this.players, top);
    this.physics.add.collider(this.bullets, top, (bullet) => {
      this.bulletList[bullet.id] = null;
      bullet.destroy();
    });
    this.physics.add.collider(
      this.players,
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

    io.on("connect", (socket) => {
      console.log("Connected!", socket.id);
      /* Create new player object */
      let newPlayer = this.add.rectangle(512 / 2, 512 / 2, 32, 32);
      newPlayer.id = socket.id;
      newPlayer.socket = socket; //this doesn't do anything
      this.playerList[socket.id] = newPlayer;
      this.physics.add.existing(newPlayer);
      this.players.add(this.playerList[socket.id]);

      socket.on("CLIENT_READY", () => {
        socket.emit("INITIALIZE_GAME", {
          id: socket.id,
          playerList: this.playerList,
        });
      });

      socket.broadcast.emit("PLAYER_JOINED", {
        id: newPlayer.id,
        x: newPlayer.x,
        y: newPlayer.y,
      });

      socket.on("disconnect", () => {
        console.log(socket.id, "disconnected");
        this.playerList[socket.id].destroy();
        delete this.playerList[socket.id];
        socket.broadcast.emit("PLAYER_LEFT", socket.id);
      });
      socket.on("PLAYER_ROTATED", (angle) => {
        const player = this.playerList[socket.id];
        player.rotation = angle;
      });
      socket.on("PLAYER_MOVED", (moveState) => {
        //ignore commands from non-registered players
        if (this.playerList[socket.id]) {
          const player = this.playerList[socket.id];

          if (moveState.up) {
            player.body.setVelocityY(-100);
          } else if (moveState.down) {
            player.body.setVelocityY(100);
          } else {
            player.body.setVelocityY(0);
          }
          if (moveState.right) {
            player.body.setVelocityX(100);
          } else if (moveState.left) {
            player.body.setVelocityX(-100);
          } else {
            player.body.setVelocityX(0);
          }

          player.body.velocity.normalize().scale(200);
        }
      });
      socket.on("PLAYER_ACTION", (actionState) => {
        if (this.playerList[socket.id]) {
          const player = this.playerList[socket.id];

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
    /* this.rect.rotation = Phaser.Math.Angle.Between(
      this.input.x,
      this.input.y,
      512 / 2,
      512 / 2
    ); */
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
      playerList: this.playerList,
      bulletList: modifiedBulletList,
    });
  }

  // bulletLogger() {
  //   for (const id in this.bulletList) {
  //     let bullet = this.bulletList
  //   }
  // }
};
