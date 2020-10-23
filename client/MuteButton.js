export default (scene, x, y, sound_key, mute_key) => {
  let key;
  const toggleMute = () => {
    scene.sound.mute = !scene.sound.mute;
    key === sound_key ? (key = mute_key) : (key = sound_key);
    soundIcon.setTexture(key);
  };

  scene.sound.mute ? (key = mute_key) : (key = sound_key);
  const soundIcon = scene.add
    .image(x, y, key)
    .setDepth(51)
    .setScale(0.8)
    .setAlpha(0.7)
    .setScrollFactor(0, 0);
  scene.add
    .circle(x, y, 16, 0xffb233)
    .setAlpha(0.7)
    .setDepth(50)
    .setScrollFactor(0, 0)
    .setInteractive()
    .on("pointerdown", toggleMute);
};
