let savedEnemyKills = 0;
let savedCollected = 0;
let savedJumpCollected = 0;
let savedDashVelocity = 300;

class Platformer extends Phaser.Scene {
    constructor() {
        super("platformer");
    }

    init() {
        // variables and settings

        this.Collected = savedCollected;
        this.JumpCollected = savedJumpCollected;

        this.enemyMoveTimer = 0;
        this.enemyMoveCooldown = 1000;
        this.enemiesKilled = savedEnemyKills;

        this.health = 1;
        this.maxHealth = 3;

        this.damageCooldown = 250;
        this.damageTimer = 0;

        this.muted = false;

        this.DRAG = 1500;
        this.physics.world.gravity.y = 1750;
        this.PARTICLE_VELOCITY = 50;
        this.ACCELERATION = 1500

        this.DASH_VELOCITY = savedDashVelocity;
        this.dashCooldown = 10;
        this.isDashing = false;

        this.MAX_MOVE_SPEED = 250; 
        this.SCALE = 1;

        this.physics.world.TILE_BIAS = 30 * this.SCALE;

    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');

    }

    create() {


        //sounds

        if (this.music) {
            this.music.stop();
        }
        
        this.music = this.sound.add('MainTheme', {
            volume: 0.25,
            loop: true
        });

        this.music.stop();

        this.ReadyDashEffect = this.sound.add("ReadyDash", {
            volume: 0.2,
            loop: false
        });

        this.music.play();

        this.Deathsound = this.sound.add("Death", {
            volume: 0.5,
            loop: false
        })

        //UI elements

        this.heartUI = [];

        let heartX = game.config.width / 1.475;
        let heartY = game.config.height / 1.4;

        for (let i = 0; i < this.maxHealth; i++) {
            
            let heart = this.add.image(heartX + i * 32, heartY, "tilemap_tiles4", 529)
                .setScale(2)
                .setScrollFactor(0)
                .setDepth(100);
            this.heartUI.push(heart);
        }

        this.updateHealthUI();

        this.ScoreUI = [];

        let ScoreX = game.config.width - 1085;
        let ScoreY = game.config.height - 570;

        for (let i = 0; i < 2; i++){
            let ScoreDigit = this.add.image(ScoreX + i * 38, ScoreY, "tilemap_tiles4", 868)
                .setScale(4)
                .setScrollFactor(0)
                .setDepth(100);
            this.ScoreUI.push(ScoreDigit);
        }

        this.updateScore();

        this.muteButton = this.add.image(
            game.config.width / 1.37,
            game.config.height - 570,
            "tilemap_tiles4",
            822
        ).setScrollFactor(0).setScale(2).setDepth(100);

        this.dashIcon = this.add.image(
            game.config.width - 1085,
            game.config.height / 1.4,
            "tilemap_tiles4",
            375
        ).setScrollFactor(0).setScale(2.5).setDepth(100);



        //loading layers etc

        this.physics.world.drawDebug = false;

        this.map = this.add.tilemap("MainProjectMap");

        this.tileset = this.map.addTilesetImage("1BitPlatformerMap", "tilemap_tiles");
        this.tileset2 = this.map.addTilesetImage("1-Bit Platformer Map Transparent", "tilemap_tiles2");
        this.tileset3 = this.map.addTilesetImage("1BitMap", "tilemap_tiles3", 16, 16);
        this.tileset4 = this.map.addTilesetImage("Colored Transparent", "tilemap_tiles4", 16, 16);


        this.background = this.map.createLayer("Background", this.tileset3, 0, 0);
        this.danger = this.map.createLayer("Spikes-n-Hazards", this.tileset3, 0, 0);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms",  [this.tileset, this.tileset2, this.tileset3, this.tileset4], 0, 0);

       
        this.background.setScale(this.SCALE).setScrollFactor(0.9);

        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        //VFX area

        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['star_01.png', 'star_07.png'],
            scale: {start: 0.03, end: 0.1},
            lifespan: 450,
            random: true,
            alpha: {start: 1, end: 0.5}, 
        });

        my.vfx.walking.stop();

        my.vfx.jump = this.add.particles(0, 0, 'kenny-particles', {
            frame: ['star_03.png', 'star_02.png'],
            scale: {start: 0.03, end: 0.1},
           lifespan: 400,
            duration: 200,
            alpha: { start: 1, end: 0 },
        });

        my.vfx.jump.stop();

        //objects/enemies and collision

        this.enemies = this.map.createFromObjects("objects", {
            name: "sidetosideEnemy",
            key: "tilemap_tiles4",
            frame: 31,
        });

        this.hearts = this.map.createFromObjects("objects", {
            name: "heart",
            key: "tilemap_tiles4", 
            frame: 529
        });

        this.anims.create({
            key: 'heartAnim',
            frames: [
                {key: 'tilemap_tiles4', frame: 529},
                {key: 'tilemap_tiles4', frame: 532}
            ],
            frameRate: 2,
            repeat: -1
        });

        this.hearts.forEach(heart => {
            heart.anims.play('heartAnim');
        });
        


        this.endLevel = this.map.createFromObjects("objects", {
            name: "Door",
            key: "tilemap_tiles4",
            frame: 544
        });

        this.physics.world.enable(this.hearts, Phaser.Physics.Arcade.STATIC_BODY);

        this.physics.world.enable(this.endLevel, Phaser.Physics.Arcade.STATIC_BODY);

        this.heartGroup = this.add.group(this.hearts);
        this.endlevelgroup = this.add.group(this.endLevel);
        

        this.enemyGroup = this.physics.add.group();

        this.enemies.forEach(enemy => {
            this.enemyGroup.add(enemy);
            
            enemy.body.setCollideWorldBounds(true);
            enemy.body.setVelocityX(50);
            enemy.direction = 1;   
            enemy.setScale(2); 
            
        });

        this.enemyList = this.enemyGroup.getChildren();

        this.physics.add.collider(this.enemyGroup, this.groundLayer);

        //Spikes collsion and group

        this.STSSpikes = this.map.createFromObjects("objects", {
            name: "MovingSpike1",
            key: "tilemap_tiles4",
            frame: 1065
        })

        this.STSSpikesGroup = this.physics.add.group();

        this.STSSpikes.forEach(spike => {
            this.STSSpikesGroup.add(spike);
            spike.body.setImmovable(true);
            spike.body.setAllowGravity(false);

            this.tweens.add({
                targets: spike,
                x: spike.x + 150,
                yoyo: true,
                repeat: -1,
                duration: 900,
                ease: 'Sine.easeInOut'
            });
        })

        this.UDSpikes = this.map.createFromObjects("objects", {
            name: "MovingSpike2",
            key: "tilemap_tiles4",
            frame: 1065
        });

        this.UDSpikesGroup = this.physics.add.group();

        this.UDSpikes.forEach(spike => {
            this.UDSpikesGroup.add(spike);

            this.physics.world.enable(spike);
            spike.body.setImmovable(true);
            spike.body.setAllowGravity(false);

            this.tweens.add({
                targets: spike,
                y: spike.y - 120,
                yoyo: true,
                repeat: -1,
                duration: 1000,
                ease: 'Sine.easeInOut'
            });
        });


        //player collisions and player

        my.sprite.player = this.physics.add
            .sprite(game.config.width/15, game.config.height/3, "tilemap_tiles4", 361)
            .setScale(1.5);
        my.sprite.player.setCollideWorldBounds(true);

        this.physics.add.collider(my.sprite.player, this.groundLayer);

        this.physics.add.overlap(
            my.sprite.player,
            this.heartGroup,
            (player, heart) => {
                if (this.health < 3) {
                    heart.destroy();
                    this.sound.play("HeartSoundEffect");
                    this.Collected += 25;
                    this.JumpCollected -= 25;
                    this.health += 1;
                    this.updateHealthUI();

                }
            }
        );
        

        this.physics.add.overlap(
            my.sprite.player,
            this.endlevelgroup,
            (player, end) => {
                end.destroy();
                savedEnemyKills = this.enemiesKilled;
                savedCollected = this.Collected;
                savedJumpCollected = this.JumpCollected;
                savedDashVelocity = this.DASH_VELOCITY;
                
                this.sound.play("HeartSoundEffect");
                this.scene.start("endScene")
            }
        );

        this.danger.setCollisionByProperty({ danger: true });

        this.physics.add.collider(
            my.sprite.player,
            this.danger,
            (player, tile) => {
                if (this.damageTimer <= 0) {
                    
                    this.health -= 0.5;
                    this.sound.play("HurtSound");

                    if (this.health <= 0) {
                        this.health = 0;
                        savedEnemyKills = 0;
                        savedCollected = 0;
                        savedJumpCollected = 0;
                        savedDashVelocity = 300;
                        this.sound.play("PlayerDeath");
                        this.scene.restart();
                    }

                    this.updateHealthUI();

                    this.damageTimer = this.damageCooldown;
                }
            }
        );

        this.physics.add.collider(
            my.sprite.player, 
            this.enemyGroup, 
            (player, enemy) => {

            if (this.isDashing) {
                this.Deathsound.play();
                enemy.destroy();           
                this.dashCooldown = 50;        
                this.ReadyDashEffect.play();
                this.Collected += 10;
                this.JumpCollected -= 10;
                this.DASH_VELOCITY += 25;
                this.enemiesKilled += 1;
                this.updateScore();

            } else if (this.damageTimer <= 0) {
                this.health -= 0.5;
                this.sound.play("HurtSound");

                if (this.health <= 0) {
                    this.health = 0;
                    savedEnemyKills = 0;
                    savedCollected = 0;
                    savedJumpCollected = 0;
                    savedDashVelocity = 300;
                    this.sound.play("PlayerDeath");
                    this.scene.restart();

                }

                this.updateHealthUI();
                this.damageTimer = this.damageCooldown;
            }
        });

        this.physics.add.collider(
            my.sprite.player,
            this.STSSpikesGroup,
            (player, spike) => {
                if (this.damageTimer <= 0) {
                    this.health -= 0.5;
                    this.sound.play("HurtSound");

                    if (this.health <= 0) {
                        this.health = 0;
                        savedEnemyKills = 0;
                        savedCollected = 0;
                        savedJumpCollected = 0;
                        savedDashVelocity = 300;
                        this.sound.play("PlayerDeath");
                        this.scene.restart();
                    }

                    this.updateHealthUI();
                    this.damageTimer = this.damageCooldown;
                }
            }
        );

        this.physics.add.collider(
            my.sprite.player,
            this.UDSpikesGroup,
            (player, spike) => {
                if (this.damageTimer <= 0) {
                    this.health -= 0.5;
                    this.sound.play("HurtSound");

                    if (this.health <= 0) {
                        this.health = 0;
                        savedEnemyKills = 0;
                        savedCollected = 0;
                        savedJumpCollected = 0;
                        savedDashVelocity = 300;
                        this.sound.play("PlayerDeath");
                        this.scene.restart();
                    }

                    this.updateHealthUI();
                    this.damageTimer = this.damageCooldown;
                }
            }
        );

        //keyboard and camera

        cursors = this.input.keyboard.createCursorKeys();
    

        this.rKey = this.input.keyboard.addKey('R');
        this.input.keyboard.on('keydown-Q', () => {
            this.physics.world.drawDebug = !this.physics.world.drawDebug;
            this.physics.world.debugGraphic.clear();
        }, this);

        
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(0, 0);
        this.cameras.main.setFollowOffset(-50, 0);
        this.cameras.main.setZoom(2);
        this.cameras.main.roundPixels = true;

        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.SPACE,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            dash: Phaser.Input.Keyboard.KeyCodes.W,
            mute: Phaser.Input.Keyboard.KeyCodes.M
        });



        this.animatedTiles.init(this.map);
    }

    update() {


        //dash settings and cooldowns
        this.MAX_MOVE_SPEED = 250 + this.Collected
        this.JUMP_VELOCITY = -500 + this.JumpCollected; 

        if (this.isDashing != true){
            if (my.sprite.player.body.velocity.x > this.MAX_MOVE_SPEED) {
                my.sprite.player.body.velocity.x = this.MAX_MOVE_SPEED;
            }
            if (my.sprite.player.body.velocity.x < -this.MAX_MOVE_SPEED) {
                my.sprite.player.body.velocity.x = -this.MAX_MOVE_SPEED;
            }

        }

        this.dashCooldown -= 10;

        if(this.dashCooldown == 0){
            this.ReadyDashEffect.play();
        }

        if(this.dashCooldown <= 2050){
            this.isDashing = false;
        }

        if (this.damageTimer > 0) {
            this.damageTimer -= 10
        }

        this.enemyMoveTimer += 10;

        //mute and other settings/functions

        if(Phaser.Input.Keyboard.JustDown(this.cursors.mute)) {
            
            if (this.muted == false) {
                this.music.stop();
                this.muted = true;
            } else {
                this.music.play();
                this.muted = false;
                
            }
            this.muteButtonUpdate();
        }   

        //movement

        if (this.enemyMoveTimer >= this.enemyMoveCooldown) {
            for (let i = 0; i < this.enemyList.length; i++) {
                let enemy = this.enemyList[i];
                if (enemy.active) {
                    enemy.direction *= -1;
                    enemy.body.setVelocityX(50 * enemy.direction);

                }
            }
            this.enemyMoveTimer = 0;
        }
        if (this.cursors.left.isDown) {
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }
            

        } else if (this.cursors.right.isDown) {
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2+5, false);

            my.vfx.walking.setParticleSpeed(-this.PARTICLE_VELOCITY, 0);

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else {
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
        }

        //actual dashes

        if (Phaser.Input.Keyboard.JustDown(this.cursors.dash) && this.dashCooldown <= 0) {
            let direction = 0;
            if (this.cursors.left.isDown) {
                direction = -1;
            }
            else if (this.cursors.right.isDown) {
                direction = 1;
            }

            if (my.sprite.player.body.blocked.down) {
                if (direction !== 0) {
                        this.isDashing = true;
                        my.sprite.player.setVelocityX(direction * this.DASH_VELOCITY);
                        this.sound.play("DashSlash");
                        this.sound.play("DashSlash2");
                        this.dashCooldown = 2250;
                }
            } else {
                this.isDashing = true;
                my.sprite.player.setVelocityY(-this.DASH_VELOCITY + -200);
                this.sound.play("DashSlash");
                this.sound.play("DashSlash2");
                this.dashCooldown = 2250;

            }
            this.DashUIUpdate();

        }

        this.DashUIUpdate();
            

        //jumping 

        if (!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if (my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            
            my.vfx.jump.startFollow(my.sprite.player, my.sprite.player.displayWidth/2 - 10, my.sprite.player.displayHeight/2, false);
            my.vfx.jump.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.jump.start();
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

    }

    //extra update functions
    
    updateHealthUI() {
        for (let i = 0; i < this.maxHealth; i++) {
            if (i < this.health - 0.5) {
                this.heartUI[i].setFrame(532);

            } else if (i < this.health) {
                this.heartUI[i].setFrame(531);
                this.Collected -= 25;
                this.JumpCollected += 25;
            } else {
                this.heartUI[i].setFrame(530);
            }
        }
    }

    DashUIUpdate(){
        if (this.dashCooldown <= 0){
            this.dashIcon.setFrame(375);
        } else {
            this.dashIcon.setFrame(0);
        }
    }

    muteButtonUpdate() {
        if (this.muted) {
            this.muteButton.setFrame(821);
        } else {
            this.muteButton.setFrame(822);
        }
    }

    updateScore() {
        let i = this.enemiesKilled
        
        if (i < 0){
            i = 0;
        }
        if (i > 99){
            i = 99;
        }

        let tensPlace = 0;
        let onesPlace = 0;

        while ((tensPlace + 1) * 10 <= i) {
            tensPlace++;
        }

        onesPlace = i - (tensPlace * 10);
        
        this.ScoreUI[0].setFrame(868 + tensPlace);
        this.ScoreUI[1].setFrame(868 + onesPlace);
    }

}