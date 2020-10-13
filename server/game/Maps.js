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
    let mappy = this.scene.add.tilemap("mappy");
    let terrarian = mappy.addTilesetImage("Base", "");
    let grassLayer = mappy.createStaticLayer("Grass", [terrarian], 0, 0);
    grassLayer.setDepth(-1);
    let top = mappy.createStaticLayer("Collides", [terrarian], 0, 0);
    let houseTop = mappy.createStaticLayer("HouseTop", [terrarian], 0, 0);
    let trees = mappy.createStaticLayer("Trees", [terrarian], 0, 0);
    this.collidesPlayer.add(top);
    this.collidesPlayer.add(tree);
    this.collidesBullets.add(top);
    this.collidesBullets.add(tree);

    top.setCollisionByProperty({ collides: true });
    trees.setCollisionByProperty({ collides: true });
  }
};
