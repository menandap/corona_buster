import Phaser from 'phaser';

export default class FallingObject extends Phaser.Physics.Arcade.Sprite {
  
  constructor(scene, x, y, texture, config) {
    // Call the parent class constructor
    super(scene, x, y, texture);

    // Add any custom properties, if needed
    this.config = config; // Example for using the config parameter
    this.scene = scene;
    this.speed = config.speed || 100; // Default speed if not provided
    this.rotationVal = config.rotationVal || 0.05; // Default rotation value if not provided

    // Add the object to the scene
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  spawn(positionX) {
    this.setPosition(positionX, -10);
    this.setActive(true);
    this.setVisible(true);
  }

  die() {
    this.destroy();
  }

  update(time) {
    this.setVelocityY(this.speed);
    this.rotation += this.rotationVal;

    const gameHeight = this.scene.scale.height;
    if (this.y > gameHeight + 5) {
      this.die();
    }
  }
}
