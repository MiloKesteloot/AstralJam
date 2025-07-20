class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        let wid = this.cameras.main.width;
        let hei = this.cameras.main.height;

        // loading bar
        // see: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/loader/
        let loadingBar = this.add.graphics();
        this.load.on('progress', (value) => {
            loadingBar.clear();
            loadingBar.fillStyle(0xFFFFFF, 1);
            loadingBar.fillRect(0, hei/2, wid * value, 5);
        });
        this.load.on('complete', () => {
            loadingBar.destroy();
        });

        // Load assets
        this.load.image('button-start', 'assets/sprites/startButton.png');
        this.load.image('button-credits', 'assets/sprites/creditsButton.png');

        // this.load.path = 'assets/sprites/';
        this.load.image('kroq', 'assets/sprites/baseKroq.png');
        this.load.image('bird', 'assets/sprites/bird.png');
        this.load.image('star', 'assets/sprites/star.png');
        this.load.image('starHover', 'assets/sprites/starHover.png');
        this.load.image('starBright', 'assets/sprites/starBright.png');
        this.load.image('starFinish', 'assets/sprites/starFinish.png');
        this.load.image('spaceBG', 'assets/sprites/spaceBG.png');
        this.load.image('Arrow', 'assets/sprites/Arrow.png');

        this.load.image('pressB', 'assets/sprites/pressB.png');
        this.load.image('pressE', 'assets/sprites/pressE.png');

        for (let i = 1; i < 6; i++) {
            this.load.image('Journal' + i, 'assets/sprites/Journal' + i + '.png');;
        }

        for (let i = 1; i < 5; i++) {
            this.load.image('Gate' + i + "Closed", 'assets/sprites/gate/Gate' + i + 'Closed.png');
            this.load.image('Gate' + i + "Open", 'assets/sprites/gate/Gate' + i + 'Open.png');
            this.load.image('FinalPGuy' + i, 'assets/sprites/gate/FinalPGuy' + i + '.png');
        }


        this.load.image('viewport', 'assets/sprites/viewport.png');
        this.load.image('heart', 'assets/sprites/heart.png');
        this.load.image('heartBroken', 'assets/sprites/heartBroken.png');
        this.load.image('x', 'assets/sprites/x.png');

        this.load.image('title-text', 'assets/sprites/title.png');

        // Load spritesheets
        this.load.spritesheet('kroq-idle-sheet', 'assets/sprites/baseKroqIdle-Sheet.png', {
            frameWidth: 13,
            frameHeight: 15,
            startFrame: 0,
            endFrame: 2
        })
        this.load.spritesheet('kroq-run-sheet', 'assets/sprites/baseKroqRunning-Sheet.png', {
            frameWidth: 13,
            frameHeight: 15,
            startFrame: 0,
            endFrame: 2
        })
        this.load.spritesheet('kroq-jump-sheet', 'assets/sprites/baseKroqJumping-Sheet.png', {
            frameWidth: 13,
            frameHeight: 15,
            startFrame: 0,
            endFrame: 3
        })
        this.load.spritesheet('kroq-fall-sheet', 'assets/sprites/baseKroqFalling-Sheet.png', {
            frameWidth: 13,
            frameHeight: 15,
            startFrame: 0,
            endFrame: 2
        })
        this.load.spritesheet('bird-flap-sheet', 'assets/sprites/bird-Sheet.png', {
            frameWidth: 16,
            frameHeight: 18,
            startFrame: 0,
            endFrame: 3
        })
        
        this.load.image('p1', 'assets/sprites/smallParticle.png');
        this.load.image('p2', 'assets/sprites/mediumParticle.png');
        this.load.image('p3', 'assets/sprites/largeParticle.png');
        this.load.image('p1g', 'assets/sprites/smallParticleGold.png');
        this.load.image('p2g', 'assets/sprites/mediumParticleGold.png');

        this.load.image('tilesetImage', 'assets/sprites/tilemap.png')
        // this.load.path = 'assets/tilemap/';
        this.load.tilemapTiledJSON('tilemapJSON', 'assets/tilemap/astralGardens.tmj');

        this.load.audio('starPickup', 'assets/sfx/starPickup.mp3');
        this.load.audio('kroqJump', 'assets/sfx/jump.mp3');
        this.load.audio('birdFlap', 'assets/sfx/birdFlap.mp3');
        this.load.audio('jazzy', 'assets/sfx/jazzy.wav');
        this.load.audio('outro-song', 'assets/sfx/outro-song.wav');


        // This loads the font because otherwise it doesn't show correctly
        this.add.text(10000, 0, '.', {
            fontFamily: 'pressstart',
            fontSize: '1px',
            color: '#000000'
        });
    }

    // Helper function to generate frame arrays
    genFrameArrays(sheet, twoWays) {
        const totalFrames = this.textures.get(sheet).frameTotal - 1;
        const frames = [];
        for (let i = 0; i < totalFrames; i++) {
            frames.push(i);
        }
        if (twoWays) {
            for (let i = totalFrames - 2; i >= 0; i--) {
                frames.push(i);
            }
        }
        return frames;
    }

    create() {
        // Create animations
        this.anims.create({
            key: 'kroq-idle-anim',
            frames: this.anims.generateFrameNumbers('kroq-idle-sheet', { 
                frames: this.genFrameArrays("kroq-idle-sheet", true)
            }),
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: 'kroq-run-anim',
            frames: this.anims.generateFrameNumbers('kroq-run-sheet', { 
                frames: this.genFrameArrays("kroq-run-sheet", true)
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'kroq-jump-anim',
            frames: this.anims.generateFrameNumbers('kroq-jump-sheet', { 
                frames: this.genFrameArrays("kroq-jump-sheet", false)
            }),
            frameRate: 4,
            repeat: 0,
        });
        this.anims.create({
            key: 'kroq-fall-anim',
            frames: this.anims.generateFrameNumbers('kroq-fall-sheet', { 
                frames: this.genFrameArrays("kroq-fall-sheet", false)
            }),
            frameRate: 4,
            repeat: 0,
        });
        this.anims.create({
            key: 'bird-flap-anim',
            frames: this.anims.generateFrameNumbers('bird-flap-sheet', { 
                frames: this.genFrameArrays("bird-flap-sheet", true)
            }),
            frameRate: 4,
            repeat: -1,
        });

        this.scene.start('playScene');

        if (!this.game.backgroundMusic) {
            this.game.backgroundMusic = this.sound.add('jazzy', {loop: true, volume: 0.5});
            this.game.backgroundMusic.play();
        }
    }
}