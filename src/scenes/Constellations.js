class Constellations extends Phaser.Scene {

    constructor() {
        super('constellationsScene');

        Constellations.instance = this;
    }

    init() {

    }

    lineExistsInPairs(lines, a, b) {
        for (let i = 0; i < lines.length; i++) {
            const l = lines[i];
            if ((l[0] === a && l[1] === b) || (l[0] === b && l[1] === a)) return true;
        }
        return false;
    }

    lineExistsInMerged(lines, a, b) {
        for (let i = 0; i < lines.length-1; i++) {
            const l = lines;
            if ((l[i] === a && l[i+1] === b) || (l[i] === b && l[i+1] === a)) return true;
        }
        return false;
    }

    create() {

        this.graphics = this.add.graphics();

        // Set up variables for consistent timing
        this.timeCounter = 0;
        this.updateRate = 1/120;

        // Set up key inputs
        this.keys = this.input.keyboard.createCursorKeys();
        this.keys.ESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.keys.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.pointer = this.input.activePointer;

        // Create camera
        this.camera = new Camera(this, this.cameras.main);

        // Create all elements
        this.stars = [];

        // this.camera.setFollow(this.kroq);

        // this.scene.launch('uiScene');
        // this.scene.bringToTop('uiScene');

        this.selectionList = [];

        this.constellation = new Constellation(this, [
                [-40, -40], [40, -40], [40, 40], [-40, 40], [0, -80]
            ],
            [
                [0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3], [0, 4], [1, 4]
            ])

        const constellations = this;

        for (let i = 0; i < this.constellation.stars.length; i++) {
            const star = this.constellation.stars[i];
            star.setInteractive();
            star.on('pointerdown', function(pointer) {
                constellations.starClicked(i);
            })
        }
    }

    starClicked(index) {
        const sl = this.selectionList;
        if (sl.length !== 0) {
            if (sl[sl.length-1] === index) return;
            if (this.lineExistsInMerged(sl, sl[sl.length-1], index)) return;
            if (!this.lineExistsInPairs(this.constellation.lines, sl[sl.length-1], index)) return;
        }
        sl.push(index);
    }

    physicsUpdate() {
        // Update all entities positions
        // this.entities.forEach(entity => entity.physicsUpdate());

        // UI.instance.physicsUpdate();

        this.constellation.physicsUpdate();
    }

    visualUpdate() {
        // Put all entities where they should be on screen
        // this.entities.forEach(entity => entity.visualUpdate());
        this.constellation.visualUpdate();
        this.camera.update();
        this.graphics.clear();

        const s = this.constellation.starPositions;

        this.graphics.lineStyle(1, 0x666666, 1);
        const l = this.constellation.lines;
        for (let i = 0; i < l.length; i++) {
            const line = l[i];

            this.graphics.beginPath();
            this.graphics.moveTo(s[l[i][0]][0], s[l[i][0]][1]);
            this.graphics.lineTo(s[l[i][1]][0], s[l[i][1]][1]);
            this.graphics.strokePath();
        }

        const sl = this.selectionList;
        if (sl.length > 0) {
            this.graphics.lineStyle(3, 0xffffff, 1);
            this.graphics.beginPath();
            this.graphics.moveTo(s[sl[0]][0], s[sl[0]][1]);
            for (let i = 1; i < sl.length; i++) {
                this.graphics.lineTo(s[sl[i]][0], s[sl[i]][1]);
            }
            let worldPoint = this.cameras.main.getWorldPoint(this.pointer.x, this.pointer.y);
            this.graphics.lineTo(worldPoint.x, worldPoint.y);
            this.graphics.strokePath();
        }
    }

    update(_, dt) {

        // Handle scene key inputs
        if (Phaser.Input.Keyboard.JustDown(this.keys.R)) {
            this.scene.stop('uiScene')
            this.scene.start('constellationsScene');
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
            if (UI.instance.blackStage === 0 || UI.instance.skipOutro()) {
                this.scene.stop('uiScene')
                this.scene.start('menuScene');
                return;
            }
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