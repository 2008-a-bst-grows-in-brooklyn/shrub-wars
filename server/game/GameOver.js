const player = require("./Player")

//Game Resetting
module.exports = class gameOver {
    constructor(scene) {
        this.scene = scene;
        this.gameResetTimer;
    }

    gameOver() {
        for (const player in this.scene.PlayerManager.playerList) {
            this.scene.PlayerManager.playerList[player].gameOver = true
        }
        if (!this.gameResetTimer) {
            this.gameResetTimer = this.scene.time.delayedCall(10000, () => {
            this.gameReset()
            });
        }
    }

    gameReset() {
    this.gameResetTimer = undefined;
    this.scene.score = { 
        red: 0, blue: 0}
    this.scene.flag.reset()
    for (const player in this.scene.PlayerManager.playerList) {
        this.scene.PlayerManager.playerList[player].respawn()
    }
    }

    get isResetting() {
        if (this.gameResetTimer) {
            return this.gameResetTimer.getProgress();
        }
    }
}