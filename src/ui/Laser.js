import Phaser from 'phaser';

export default class Laser extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'laser');
    }

    fire(x, y) {
        // Fire the laser from the player's current position
        this.setPosition(x, y - 20);  // Start slightly above the player
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityY(-300);  // Move the laser upwards
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Kill the laser if it moves off the screen
        if (this.y <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}
