class Menu extends Phaser.Scene {

    constructor() {
        super('menuScene');

        Menu.instance = this;
    }

    init() {}

    create() {
        
        // Load background map
        const layers = [];
        const map = this.add.tilemap('tilemapJSON');
        const tileset = map.addTilesetImage('overworld', 'tilesetImage');
        this.cloudLayer = map.createLayer('Clouds', tileset); layers.push(this.cloudLayer);
        this.backgroundLayer = map.createLayer('Background', tileset); layers.push(this.backgroundLayer);
        this.groundMap = map.createLayer('DemoGround', tileset); layers.push(this.groundMap);
        layers.push(map.createLayer('DecoGround', tileset));
        this.waterLayer = map.createLayer('Water', tileset); layers.push(this.waterLayer);
        this.waterLayer.setDepth(20);

        this.layers = layers;
        this.map = map;

        // Create camera
        this.camera = new Camera(this, this.cameras.main);
        this.camera.xOffset = -this.camera.camera.width / 2 / this.camera.scale;

        // Move camera to correct location
        this.layers.forEach(layer => {
            layer.y = -map.height * 16 + this.camera.camera.height / 2 / this.camera.scale + 16 * 3;

            layer.x -= this.camera.camera.width / 2 / this.camera.scale;
        });

        

        // Create title text
        let title = this.add.sprite(0, -50, "title-text").setDepth(40);

        // Create buttons and set what they do on click
        let startButton = this.add.sprite(0, 11, "button-start").setInteractive().setDepth(40);
        let creditsButton = this.add.sprite(0, 30, "button-credits").setInteractive().setDepth(40);

        const scene = this;

        startButton.on('pointerdown', function(pointer) {
            scene.scene.start('constellationsScene'); //playScene
        });

        creditsButton.on('pointerdown', function(pointer) {
            scene.scene.start('creditsScene');
        });


        // Graphcis for background color tint
        this.tintGraphics = this.add.graphics().setDepth(30);


    }

    update(_, dt) {
        this.layers.forEach(layer => {
            layer.y = -this.map.height * 16 + this.camera.camera.height / 2 / this.camera.scale + 16 * 3;

            layer.x = -this.camera.camera.width / 2 / this.camera.scale - 16;
        });

        this.camera.xOffset = -this.camera.camera.width / 2 / this.camera.scale;
        this.camera.update();

        this.tintGraphics.clear();
        this.tintGraphics.fillStyle(0X51A9B5, 0.3);
        this.tintGraphics.fillRect(-this.sys.game.canvas.width/2, -this.sys.game.canvas.height/2, this.sys.game.canvas.width, this.sys.game.canvas.height);
    }
}