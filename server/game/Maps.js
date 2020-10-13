module.exports = class Map {
  constructor(scene) {
    this.scene = scene;
    this.collidesPlayer = scene.add.group();
    this.collidesBullets = scene.add.group();
  }
  loadMap() {
    this.scene.load.tilemapTiledJSON(
      "mappy",
      path.join(__dirname, "..", "..", "public", "Village.json")
    );
  }

  createMap() {
    const mappy = this.scene.add.tilemap("mappy");
    const terrarian = mappy.addTilesetImage("Base", "");
    const grassLayer = mappy.createStaticLayer("Grass", [terrarian], 0, 0);
    grassLayer.setDepth(-1);
    const top = mappy.createStaticLayer("Collides", [terrarian], 0, 0);
    const houseTop = mappy.createStaticLayer("HouseTop", [terrarian], 0, 0);
    const trees = mappy.createStaticLayer("Trees", [terrarian], 0, 0);
    this.collidesPlayer.add(top);
    this.collidesPlayer.add(trees);
    this.collidesBullets.add(top);
    this.collidesBullets.add(trees);

    top.setCollisionByProperty({ collides: true });
    trees.setCollisionByProperty({ collides: true });
  }
};
