const player = require("./Player")

//Game Resetting
module.exports = class gameOver {
    constructor(scene) {
        this.scene = scene;
        this.gameResetTimer;
        this.scene.PlayerManager.playerList;
    }

    gameOver() {
        if (!this.gameResetTimer) {
            this.gameResetTimer = this.scene.time.delayedCall(10000, () => {
            this.gameReset();
            });
        }
    }

    gameReset() {
    this.gameResetTimer = undefined;
    this.scene.score = { 
        red: 0, blue: 0}
    console.log(this.scene.PlayerManager.playerList)
    for (const player in this.scene.PlayerManager.playerList) {
        player.respawn();
    }
    }

    get isResetting() {
        if (this.gameResetTimer) {
            return this.gameResetTimer.getProgress();
        }
    }
}