// Game: Kroq - An Aseprite Adventure!
// Name: Milo Kesteloot, Sofia Aminifard
// Date: 03/03/2025
// Time: ~ 50 Hours

// Controlls: Use WASD or Arrow Keys to move Kroq to the flag at the end!
// Collect optional STARS for a fun challage!
// Use ESC to return to the menu.

// I talked to Nathan and he said that I was exempt from the "5 built-in Phaser features" rule as I implumented features like physics, particles, and camera follow manually. We use built in animations and tilemaps.

'use strict'

// General config
let config = {
    type: Phaser.AUTO,
    pixelArt: true,
    roundPixels: true,
    // Settings to make game fullscreen
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [ Load, Menu, UI, Play, Credits, Constellations ],
    base: '/Kroq/'
};

let game = new Phaser.Game(config);

let { width, height } = game.config;

// TODO
// * use at least 5 phaser elements
