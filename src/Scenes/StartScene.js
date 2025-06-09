class startScene extends Phaser.Scene {
    constructor() {
        super("startScene");
    }

    create() {

        this.my = my;

        my.text.starttext = this.add.text(200, 200, "Hello Welcome, Click to play! Press L for Lore, K to return.\nControls:A-Left, D-Right, W- Double jump/dash, Space- Jump.", { fontSize: '32px', fill: '#FFFF00' }).setDepth(100);
        my.text.starttext.setInteractive({ useHandCursor: true });
        my.text.starttext.on('pointerdown', () => this.init_game()); 
        my.text.loreText = this.add.text(150, 200, "The Bugs (your character) are trying to eradicate the others (humans) that they encounter that have invaded their world.The humans seek shelter as their world was destroyed and so they are fighting to survive by any means necessary The bugs however want to protect their world and so they kill and eat the humans. Eating the humans absorbs much of their strength and allows them to kill more and more. The game starts as humans raid the green bug factions homeland, killing your character's pregnant wife and 37 children inside her. You go into a rage and attack anything you see, that includes the other bug factions roaming around trying to fight the humans. The green and blue factions are friendly and trade often. However the yellow faction is full of political extremists who don't follow many ethical guidelines that the coalition stated about not torturing the humans. They also kill lots of other bugs that get in their way. They also have their own religion separate from the main coalition who believes that the humans were actually sent to save the bugs and allow them to take over the universe. Your character is known as a Slith a highly skilled warrior that can move at incredible speed for a brief period of time killing anything in their path. They were trained to guard the emperor from attacks from unfriendly factions but many have been created since the human invasion. The Slith are known for eradicating the red bugs in the great water war of Atmosphere 14003. The current year is Atmosphere 41473 as every year an atmospheric event in the sky happens that the bugs mark as an Atmosphere.  The current emperor is Green and rules over all the Slith however have always been blue and so it has been controversial for green bugs to be taught the ways of the Slith", { 
            fontSize: '20px', 
            fill: '#FFFF00',
            align: "center",
            wordWrap: { width: 1200, useAdvancedWrap: true }
        
        }).setDepth(100);
        this.my.text.loreText.visible = false;
        this.map = this.add.tilemap("MainProjectMap");

        this.tileset3 = this.map.addTilesetImage("1BitMap", "tilemap_tiles3", 16, 16);
        this.background = this.map.createLayer("Background", this.tileset3, 0, 0);
        this.input.on('pointerdown', () => {
            this.scene.start('platformer'); // CHANGE TO platformer
        });
        cursors = this.input.keyboard.createCursorKeys();
        this.cursors = this.input.keyboard.addKeys({
            lore: Phaser.Input.Keyboard.KeyCodes.L,
            endLoreScreen: Phaser.Input.Keyboard.KeyCodes.K
        });
        this.background.setScale(2);

    }
    update() {

        if(Phaser.Input.Keyboard.JustDown(this.cursors.lore)) {
            console.log("L key has been pressed.");
            my.text.starttext.visible = false;
            my.text.loreText.visible = true;
        }
        if(Phaser.Input.Keyboard.JustDown(this.cursors.endLoreScreen)) {
            console.log("K key has been pressed.");
            my.text.loreText.visible = false;
            my.text.starttext.visible = true;

        }
    }
}