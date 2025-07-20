class Play extends Phaser.Scene {

    constructor() {
        super('playScene');

        Play.instance = this;

        this.currentGate = 0;

        this.baseConstellations = {};

        this.constellationGroups = [
            ["littleD"],
            ["orion"],
            ["pyramid"],
            ["house"],
            ["telescope"]
        ]

        this.baseConstellations["test"] =
            new Constellation(this,
                "test",
                1,
                [
                    [10, 10], [-10, -10]
                ],
                [
                    [0, 1]
                ])

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
                -70,
                [
                    [-1, -0.866], [0, -0.866], [1, -0.866], [-0.5, 0], [0.5, 0], [0, 0.866]
                ],
                [
                    [0, 1], [0,3], [1, 3], [1,4], [1, 2], [2, 4], [3, 5], [3, 4], [4, 5]
                ])

        this.baseConstellations["littleD"] =
            new Constellation(this,
                "littleD",
                70,
                [
                    [-2.5, -1.7], [-1.8, -0.8], [-0.7, -0.2], [0.6, 0.1], [2.3, 0], [2, 1.2], [0.6, 1]
                ],
                [
                    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]
                ])

        this.baseConstellations["telescope"] =
            new Constellation(this,
                "telescope",
                70,
                [
                    [-2.2, 0.5], [-1.8, 0], [-1.3, -0.1], [-0.4, -0.3], [0.5, -0.8], [1.5, -1.2], [2.1, -0.8], [2.2, -0.1], [1.6, -0.5], [1.6, 0.3], [0, 0.4], [-0.8, 0.5], [-1.6, 0.7]
                ],
                [
                    [0, 1], [0, 12], [1, 2], [1, 11], [1, 12], [2, 3], [2, 11], [2, 12], [3, 4], [3, 10], [3, 11], [4, 5], [4, 9], [4, 10], [5, 6], [5, 8], [6, 7], [7, 8], [9, 10], [10, 11], [11, 12]
                ])

        this.baseConstellations["orion"] =
            new Constellation(this,
                "orion",
                70,
                [
                    [1, 1.7], [-0.8, 1.7], [-0.3, 0.1], [-0.8, -1.9], [0.5, -2.4], [0.9, -1.5], [0.5, -0.1], [0.1, 0]
                ],
                [
                    [0, 1], [0, 6], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 2]
                ])

        // Save player position for when scene is loaded
        this.px = -1;
        this.py = -1;
    }

    init() {
        
    }

    create() {

        this.cameras.main.roundPixels = true;

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
        this.keys.E = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keys.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);

        // Create camera
        this.camera = new Camera(this, this.cameras.main);

        // Create all elements
        this.entities = [];

        const map = this.add.tilemap('tilemapJSON');
        const tileset = map.addTilesetImage('tilemap', 'tilesetImage');
        // this.cloudLayer = map.createLayer('Clouds', tileset); layers.push(this.cloudLayer);
        this.backgroundLayer = map.createLayer('bg', tileset);
        this.planetsLayer = map.createLayer('planets', tileset);
        this.cliffsLayer = map.createLayer('cliffs', tileset);
        this.groundMap = map.createLayer('ground', tileset);
        map.createLayer('bgPlants', tileset);
        map.createLayer('plants', tileset);
        map.createLayer('foreground', tileset);
        // map.createLayer('mist', tileset);

        this.gates = [];
        const gateSpawns = map.filterObjects('spawns', (object) => object.name.startsWith("gate"));
        for (let gate of gateSpawns) {
            const num = gate.name.match(/\d+/)[0];   // Returns "4" as a string
            const result = Number(num);
            const g = new Gate(this, gate.x, gate.y, result);
            this.entities.push(g);
            this.gates.push(g);
        }

        if (this.px === -1 && this.py === -1) {
            const kroqSpawn = map.findObject('spawns', (object) => object.name === 'spawn');
            this.kroq = new Kroq(this, kroqSpawn.x, kroqSpawn.y);
            this.entities.push(this.kroq);
        } else {
            this.kroq = new Kroq(this, this.px, this.py);
            this.entities.push(this.kroq);
        }

        // this.waterLayer.setDepth(20);

        this.tilemap = map;

        this.camera.setFollow(this.kroq);

        this.UI = this.scene.launch('uiScene');
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

        UI.instance.showNotification("pressE");

        // if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
        //     if (UI.instance.blackStage === 0 || UI.instance.skipOutro()) {
        //         this.scene.stop('uiScene')
        //         this.scene.start('menuScene');
        //         return;
        //     }
        // }

        if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
            UI.instance.hideBookF();
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.B) && this.currentGate > 0) {
            UI.instance.showBookF();
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.E)) {
            this.px = this.kroq.x;
            this.py = this.kroq.y;
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