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

    getConnectingInPairs(lines, a) {
        let pairs = [];
        for (let i = 0; i < lines.length; i++) {
            const l = lines[i];
            if (l[0] === a) pairs.push([a, l[1]]);
            if (l[1] === a) pairs.push([l[0], a]);
        }
        return pairs;
    }

    create() {

        this.add.sprite(0, 0, 'spaceBG');

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
        this.selectedConstellation = null;

        this.constellations = [];


        let spawnPoints = [
            [[0, 0]],
            [[-50, 50], [50, -50]],
            [[0, -60], [-60, 40], [60, 40]]
        ]

        const constellationsToShow = Play.instance.constellationGroups[Play.instance.currentGate];
        const spawns = spawnPoints[constellationsToShow.length - 1];

        for (let i = 0; i < constellationsToShow.length; i++) {
            const constToShow = constellationsToShow[i];
            this.constellations.push(
                Play.instance.baseConstellations[constToShow].clone().modify(...(spawns[i]), 2).showStars(this)
            )
        }

        const constellations = this;

        for (let c = 0; c < this.constellations.length; c++) {
            const constellation = this.constellations[c];
            for (let i = 0; i < constellation.stars.length; i++) {
                const star = constellation.stars[i];
                star.setInteractive();
                star.on('pointerdown', function(pointer) {
                    constellations.starClicked(c, i);
                })
            }
        }

        this.add.sprite(0, 0, 'viewport');
    }

    starClicked(constellation, index) {
        if (this.selectedConstellation !== null && this.selectedConstellation !== constellation) return;
        this.selectedConstellation = constellation;

        const sl = this.selectionList;
        if (sl.length !== 0) {
            if (sl[sl.length-1] === index) return;
            if (this.lineExistsInMerged(sl, sl[sl.length-1], index)) return;
            if (!this.lineExistsInPairs(this.constellations[constellation].lines, sl[sl.length - 1], index)) {
                return
            }
        }
        sl.push(index);
        const connecting = this.getConnectingInPairs(this.constellations[constellation].lines, index);
        for (let i = 0; i < connecting.length; i++) {
            const pair = connecting[i];
            if (!this.lineExistsInMerged(sl, pair[0], pair[1])) return;
        }
        for (let i = 0; i < this.constellations[constellation].lines.length; i++) {
            const pair = this.constellations[constellation].lines[i];
            if (!this.lineExistsInMerged(this.selectionList, pair[0], pair[1])) {
                this.selectionList = [];
                this.selectedConstellation = null;
                return;
            }
        }
        this.constellations[this.selectedConstellation].setFinished();
        this.selectionList = [];
        this.selectedConstellation = null;

        const showingGateGroup = Play.instance.currentGate;

        const constellationsToShow = Play.instance.constellationGroups[showingGateGroup];

        for (let i = 0; i < constellationsToShow.length; i++) {
            const constToShow = Play.instance.baseConstellations[constellationsToShow[i]];
            if (!constToShow.getFinished()) return;
        }

        let newLevel = false;
        if (Play.instance.currentGate === showingGateGroup) {
            Play.instance.currentGate++;
            newLevel = true;
        }
        this.scene.stop('uiScene')
        this.scene.start('playScene');
        if (newLevel) {
            UI.instance.showBookF(Play.instance.currentGate);
        }
    }

    physicsUpdate() {
        // Update all entities positions
        // this.entities.forEach(entity => entity.physicsUpdate());

        // UI.instance.physicsUpdate();

        this.constellations.forEach(constellation => {
            constellation.physicsUpdate();
        });
    }

    visualUpdate() {
        // Put all entities where they should be on screen
        // this.entities.forEach(entity => entity.visualUpdate());
        this.constellations.forEach(constellation => {
            constellation.visualUpdate();
        });
        this.camera.update();
        this.graphics.clear();

        for (let i = 0; i < this.constellations.length; i++) {
            this.constellations[i].draw(this.graphics);
        }


        if (this.selectedConstellation !== null) {
            const s = this.constellations[this.selectedConstellation].starPositions;
            const sl = this.selectionList;
            if (sl.length > 0) {
                this.graphics.lineStyle(3, 0xf5e79b, 1);
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
    }

    update(_, dt) {

        // Handle scene key inputs
        if (Phaser.Input.Keyboard.JustDown(this.keys.ESC) || Phaser.Input.Keyboard.JustDown(this.keys.R)) {
            if (this.selectedConstellation !== null) {
                this.selectedConstellation = null;
                this.selectionList = [];
            } else {
                this.scene.stop('uiScene')
                this.scene.start('playScene');
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