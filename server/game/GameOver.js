//Game Resetting
module.exports = class gameOver {
    constructor(scene) {
        this.scene = scene;
        this.gameResetTimer;
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
    
    }

    get isResetting() {
        if (this.gameResetTimer) {
            return this.gameResetTimer.getProgress();
        }
    }
}