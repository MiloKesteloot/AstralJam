class Credits extends Phaser.Scene {
    constructor() {
        super('creditsScene');
    }

    create() {
        // Put 0, 0 at center of screen
        this.cameras.main.scrollX = -this.cameras.main.width / 2;
        this.cameras.main.scrollY = -this.cameras.main.height / 2;

        // Graphcis for background color
        this.tintGraphics = this.add.graphics();

        // Show credits text
        this.add.text(0, 0, 'CREDITS\n\nMilo Kesteloot\nSofia Aminifard\nSound: Pixabay\nFonts: dafont.com\n\nESC to return', {
            fontFamily: 'pressstart',
            fontSize: '32px',
            color: '#000000'
        }).setOrigin(0.5, 0.5).setDepth(2)

        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.ESCKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    }

    update(_, dt) {
    
        // Key input handeling
        if (Phaser.Input.Keyboard.JustDown(this.keys.ESCKey)) {
            this.scene.start('menuScene');
            return;
        }

        // This code callibrates the proper scale for the screen size and centers the camera
        const camera = this.cameras.main;
        camera.scrollX = -camera.width / 2;
        camera.scrollY = -camera.height / 2;
        let desiredHeight = 983.2000122070312; // My monitor height
        let desiredScale = 1; // My monitor scale
        let theirHeight = camera.height; // User monitor height
        let theirScale = (desiredScale / desiredHeight) * theirHeight; // Solve for user scale
        camera.setZoom(theirScale);

        this.tintGraphics.clear();
        this.tintGraphics.fillStyle(0X51A9B5);
        this.tintGraphics.fillRect(-this.sys.game.canvas.width/2, -this.sys.game.canvas.height/2, this.sys.game.canvas.width, this.sys.game.canvas.height);
    }
}
