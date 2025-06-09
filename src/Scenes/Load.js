class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "monochrome_tilemap.png");
        this.load.image("tilemap_tiles2", "monochrome_tilemap_transparent_packed.png");
        this.load.image("tilemap_tiles3", "colored.png");
        //this.load.image("tilemap_tiles4", "colored-transparent_packed.png");
        this.load.spritesheet("tilemap_tiles4", "colored-transparent_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        
        this.load.audio("MainTheme", "prism.mp3");
        this.load.audio("HeartSoundEffect", "arcade-ui-1-229498.mp3");
        this.load.audio("DashSlash", "dashCut.mp3");
        this.load.audio("ReadyDash", "90s-game-ui-3-185096.mp3");
        this.load.audio("DashSlash2", "Wooshing.mp3");
        this.load.audio("HurtSound", "bloop-3-186532.mp3");
        this.load.audio("Death", "DeathSound.mp3");
        this.load.audio("EndingSong", "chill-soundtrack-30204.mp3");
        this.load.audio("PlayerDeath", "death2-340040.mp3");

        this.load.tilemapTiledJSON("MainProjectMap", "FinalProjectTiledMap.tmj"); 

        this.load.multiatlas("kenny-particles", "kenny-particles.json");

    }

    //character animations

    create() {

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('tilemap_tiles4', {
                start: 363,
                end: 362
            }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'tilemap_tiles4', frame: 361 }],
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: [{ key: 'tilemap_tiles4', frame: 365 }],
            frameRate: 1,
            repeat: 0
        });

        //this.scene.start("platformer");
        this.scene.start("startScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}