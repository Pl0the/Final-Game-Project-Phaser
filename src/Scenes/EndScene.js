class endScene extends Phaser.Scene {
    constructor() {
        super("endScene");
    }

    create() {
        this.sound.stopAll();
        my.text.endtext = this.add.text(250, 200, "Game Over, You Win! Click to Play Again!", {           
        fontSize: '40px', 
        fill: '#FFFF00',
        align: "center",
        style: "Aria",
        depth: 100,
        wordWrap: { width: 1200, useAdvancedWrap: true }
    
        }).setDepth(100); 

        my.text.endtext.setInteractive({ useHandCursor: true });
        my.text.endtext.on('pointerdown', () => this.init_game()); 
        this.sound.play("EndingSong");
        this.map = this.add.tilemap("MainProjectMap");

        this.tileset3 = this.map.addTilesetImage("1BitMap", "tilemap_tiles3", 16, 16);
        this.background = this.map.createLayer("Background", this.tileset3, 0, 0);

        this.background.setScale(2);

        this.input.on('pointerdown', () => {
            this.scene.start('platformer');
        });

    }
}