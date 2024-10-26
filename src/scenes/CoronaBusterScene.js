import Phaser from 'phaser'
import FallingObject from "../ui/FallingObject";
import Laser from "../ui/Laser";

export default class CoronaBusterScene extends Phaser.Scene
{
	constructor()
	{
        super('corona-buster-scene');
	}

    init() {
        this.clouds = undefined;
        this.nav_left = false;
        this.nav_right = false;
        this.shoot = false;
        this.player = undefined;
        this.speed = 100;
        this.enemies = undefined;
        this.enemySpeed = 50;
        this.lasers = undefined;
        this.lastFired = 10;  // Cooldown management for firing lasers
    }
    
	preload()
    {
        // Load assets
        this.load.image('background', 'images/bg_layer1.png');
        this.load.image('cloud', 'images/cloud.png');
        this.load.image('left-btn', 'images/left-btn.png');
        this.load.image('right-btn', 'images/right-btn.png');
        this.load.image('shoot-btn', 'images/shoot-btn.png');
        this.load.spritesheet("player", "images/ship.png", {
            frameWidth: 66,
            frameHeight: 66,
        });
        this.load.image('enemy', 'images/enemy.png');
        this.load.spritesheet("laser", "images/laser-bolts.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
    }

    create()
    {
        // Set up background and clouds
        const gameWidth = this.scale.width * 0.5;
        const gameHeight = this.scale.height * 0.5;
        this.add.image(gameWidth, gameHeight, 'background');

        this.clouds = this.physics.add.group({
            key: 'cloud',
            repeat: 20
        });

        Phaser.Actions.RandomRectangle(this.clouds.getChildren(), this.physics.world.bounds);

        // Create player movement buttons
        this.createButton(); 

        // Create player
        this.player = this.createPlayer();

        // Set up enemies
        this.enemies = this.physics.add.group({
            classType: FallingObject,
            maxSize: 10,  
            runChildUpdate: true,
        });

        this.time.addEvent({
            delay: Phaser.Math.Between(1000, 5000), 
            callback: this.spawnEnemy,
            callbackScope: this,        
            loop: true,
        });

        // Set up lasers
        this.lasers = this.physics.add.group({
            classType: Laser,
            maxSize: 10,
            runChildUpdate: true,
        });
    }

    update(time)
    {
        // Move clouds down the screen
        this.clouds.children.iterate((child) => {
            child.setVelocityY(20);
            if (child.y > this.scale.height) {
                child.x = Phaser.Math.Between(10, 400);
                child.y = child.displayHeight * -1;
            }
        });

        // Handle player movement and shooting
        this.movePlayer(this.player, time);
   }

   createButton()
    {
        // Set up touch input buttons for player movement and shooting
        this.input.addPointer(3);

        let shoot = this.add.image(320, 550, 'shoot-btn')
            .setInteractive().setDepth(1).setAlpha(0.8);
        let nav_left = this.add.image(50, 550, 'left-btn').setInteractive().setDepth(0.5).setAlpha(0.8);
        let nav_right = this.add.image(nav_left.x + nav_left.displayWidth + 20, 550, 'right-btn').setInteractive().setDepth(0.5).setAlpha(0.8);

        nav_left.on('pointerdown', () => { this.nav_left = true }, this);
        nav_left.on('pointerout', () => { this.nav_left = false }, this);
        nav_right.on('pointerdown', () => { this.nav_right = true }, this);
        nav_right.on('pointerout', () => { this.nav_right = false }, this);
        shoot.on('pointerdown', () => { this.shoot = true }, this);
        shoot.on('pointerout', () => { this.shoot = false }, this);
    }

    movePlayer(player, time) {
      // Handle player movement and laser firing
      if (this.nav_left) {
          player.setVelocityX(-this.speed);
          player.anims.play("left", true);
          player.setFlipX(false); 
      } else if (this.nav_right) {
          player.setVelocityX(this.speed);
          player.anims.play("right", true);
          player.setFlipX(true); 
      } else {
          player.setVelocityX(0);
          player.anims.play("turn");
      }
  
      if (this.shoot && time > this.lastFired) {
          const laser = this.lasers.getFirstDead(false);
          if (laser) {
              laser.fire(player.x, player.y);  // Fire the laser
              this.lastFired = time + 150;  // Delay between shots
          }
      }
    }

    createPlayer(){
        // Create the player sprite and set up animations
        const player = this.physics.add.sprite(200, 450,'player');
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: "turn",
            frames: [{ key: "player", frame: 0 }],
        });
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("player", { start: 1, end: 2 }),
        });
        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("player", { start: 1, end: 2 }),
        });

        return player;
    }

    spawnEnemy() {
        // Spawn enemies at random positions
        const config = {
            speed: 30,
            rotation: 0.1
        };
        const enemy = this.enemies.get(0, 0, 'enemy', config);
        const positionX = Phaser.Math.Between(50, 350); 
        if (enemy) {
            enemy.spawn(positionX);  
        }
    }
}
