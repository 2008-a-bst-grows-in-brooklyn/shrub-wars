import Phaser from "phaser";

export default class LogoSplashScreen extends Phaser.Scene {
  constructor() {
    super({ key: "SplashScreen" });
  }
  preload() {
    this.load.image("village", "Village.png");
    this.load.image("pumpkin", "bush.png");
    this.load.image("GhostOne", "GhostOne.png");
    this.load.image("GhostOneRight", "GhostOneRight.png");
    this.load.image("GhostOneLeft", "GhostOneLeft.png");
    this.load.image("GhostTwo", "GhostTwo.png");
    this.load.image("GhostTwoUp", "GhostTwoUp.png");
    this.load.image("GhostTwoLeft", "GhostTwoLeft.png");
    this.load.image("InvertedRed", "InvertedRed.png");
    this.load.image("red", "red.png");
    this.load.image("BlueUp", "BlueUp.png");
    this.load.image("BlueDown", "BlueDown.png");
    this.load.image("logo", "logo.png");
    this.load.audio("MenuMusic", "audio/Spook3.mp3");
  }
  create() {
    this.add.image(0, 0, "village");
    this.add.image(120, 50, "GhostOneRight");
    this.add.image(200, 50, "InvertedRed");
    this.add.image(390, 160, "GhostTwo");
    this.add.image(390, 205, "BlueDown");
    this.add.image(415, 420, "GhostOneLeft");
    this.add.image(360, 420, "red");
    this.add.image(145, 330, "GhostTwoUp");
    this.add.image(148, 275, "BlueUp");
    this.add.image(190, 465, "GhostOne");
    this.add.image(450, 20, "GhostTwoLeft");
    this.menuMusic = this.sound.add("MenuMusic", {
      volume: 0.02,
      loop: true,
    });

    // title
    this.add.image(256, 112, "logo").setOrigin(0.5);
    this.add
      .text(256, 315, "< Press to Continue >", {
        fontFamily: "Luminari, fantasy",
        fontSize: 18,
        color: "#000000",
        backgroundColor: "#FFB233",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("pointer downed");
        this.menuMusic.play();
        this.scene.start("StartMenu", { music: this.menuMusic });
      });
  }
}
