export default function createAnimations(scene) {
  const frameRate = 10;

  //team 1 anims
  scene.anims.create({
    key: "forward1",
    frames: scene.anims.generateFrameNumbers("team1", { start: 0, end: 2 }),
    frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: "left1",
    frames: scene.anims.generateFrameNumbers("team1", { start: 3, end: 5 }),
    frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: "right1",
    frames: scene.anims.generateFrameNumbers("team1", { start: 6, end: 8 }),
    frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: "back1",
    frames: scene.anims.generateFrameNumbers("team1", { start: 9, end: 11 }),
    frameRate,
    repeat: -1,
  });

  //team2 anims
  scene.anims.create({
    key: "forward2",
    frames: scene.anims.generateFrameNumbers("team2", { start: 0, end: 2 }),
    frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: "left2",
    frames: scene.anims.generateFrameNumbers("team2", { start: 3, end: 5 }),
    frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: "right2",
    frames: scene.anims.generateFrameNumbers("team2", { start: 6, end: 8 }),
    frameRate,
    repeat: -1,
  });
  scene.anims.create({
    key: "back2",
    frames: scene.anims.generateFrameNumbers("team2", { start: 9, end: 11 }),
    frameRate,
    repeat: -1,
  });
}
