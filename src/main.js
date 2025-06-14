// Jim Whitehead
// Created: 4/14/2024
// Phaser: 3.70.0
//
// Cubey
//
// An example of putting sprites on the screen using Phaser
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true,  // prevent pixel art from getting blurred when scaled
        roundPixels: true,
        antialias: false
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            },
            fps: 120
        }
    },
    width: 1500,
    height: 800,
    scene: [Load, Platformer, endScene, startScene]
}

var cursors;
const SCALE = 1.0;
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);
