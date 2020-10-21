import Phaser from "phaser";

export default class StartMenu extends Phaser.Scene {
  constructor() {
    super({ key: "HUD" });
    this.playerList = {};
    this.directionList = {};
  }
  create() {
      this.getDirection(player) {
        if (this.directionList[player.id]) { 
            this.directionList[player.id].angle = Phaser.Math.Angle.Between(player.x, player.y, 512 / 2, 512 / 2)
            
        }
      }
  }
  update() {}
}
