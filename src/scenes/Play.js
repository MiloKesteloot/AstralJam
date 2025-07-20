class Play extends Phaser.Scene {

    constructor() {
        super('playScene');

        Play.instance = this;

        this.baseConstellations = {};

        this.baseConstellations["house"] =
            new Constellation(this,
                "house",
                1,
                [
                    [-40, -40], [40, -40], [40, 40], [-40, 40], [0, -80]
                ],
                [
                    [0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3], [0, 4], [1, 4]
                ])


        this.baseConstellations["pyramid"] =
            new Constellation(this,
                "pyramid",
                10,
                [
                    [-2, -0.866], [0, -0.866], [2, -0.866], [-1, 0], [1, 0], [0, 0.866]
                ],
                [
                    [0, 1], [0,3], [1, 3], [1,4], [1, 2], [2, 4], [3, 5], [3, 4], [4, 5]
                ])
    }

    init() {
        
    }

    create() {

        // Set up variables for consistent timing
        this.timeCounter = 0;
        this.updateRate = 1/120;


        // Set up key inputs
        this.keys = this.input.keyboard.createCursorKeys();
        this.keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keys.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keys.ESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.keys.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keys.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keys.T = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);

        // Create camera
        this.camera = new Camera(this, this.cameras.main);

        // Create all elements
        this.entities = [];

        const map = this.add.tilemap('tilemapJSON');
        const tileset = map.addTilesetImage('tilemap', 'tilesetImage');
        // this.cloudLayer = map.createLayer('Clouds', tileset); layers.push(this.cloudLayer);
        map.createLayer('bg', tileset);
        map.createLayer('foreground', tileset);
        this.groundMap = map.createLayer('ground', tileset);
        map.createLayer('plants', tileset);

        const kroqSpawn = map.findObject('spawns', (object) => object.name === 'spawn');
        this.kroq = new Kroq(this, kroqSpawn.x, kroqSpawn.y);
        this.entities.push(this.kroq);

        // const starSpawns = map.filterObjects('Objects', (object) => object.name === 'star');
        // for (let starSpawn of starSpawns) {
        //     this.entities.push(new Star(this, starSpawn.x, starSpawn.y));
        // }

        // this.waterLayer.setDepth(20);

        this.tilemap = map;

        this.camera.setFollow(this.kroq);

        this.scene.launch('uiScene');
        this.scene.bringToTop('uiScene');

        // this.kroq.move(0, 10);
    }

    physicsUpdate() {
        // Update all entities positions
        this.entities.forEach(entity => entity.physicsUpdate());

        UI.instance.physicsUpdate();
    }

    visualUpdate() {
        // Put all entities where they should be on screen
        this.entities.forEach(entity => entity.visualUpdate());
        this.camera.update();
    }

    update(_, dt) {

        // Handle scene key inputs
        if (Phaser.Input.Keyboard.JustDown(this.keys.R)) {
            this.scene.stop('uiScene')
            this.scene.start('playScene');
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
            if (UI.instance.blackStage === 0 || UI.instance.skipOutro()) {
                this.scene.stop('uiScene')
                this.scene.start('menuScene');
                return;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.T)) {
            this.scene.stop('uiScene')
            this.scene.start('constellationsScene');
            return;
        }

        // Set up timing for consistent time
        dt /= 1000;
        this.timeCounter += dt;
        let loopSaftey = 30;

        // This while loop loops every frame to make sure that the game runs the same speed for all players
        while (this.timeCounter >= this.updateRate) {
            this.timeCounter -= this.updateRate;
            this.physicsUpdate()

            loopSaftey--;
            if (loopSaftey <= 0) {
                console.warn("The time-keeping loop has exceeded the maximum loop allowance of 30. Time-skipping to present.");
                this.timeCounter %= this.updateRate;
                break;
            }
        }
        this.visualUpdate();
    }

    // Convert the speed running clock to readable format
    ticksToTime(time) {
        let seconds = time * this.updateRate;
        let minutes = seconds / 60;
        let hours = minutes / 60;
        seconds %= 60;
        minutes = Math.floor(minutes);
        // hours = Math.floor(hours);
        return minutes + ":" + seconds.toFixed(3);
    }
}