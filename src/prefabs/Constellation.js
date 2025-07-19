class Constellation {
    constructor(scene, starPositions, lines) {
        this.scene = scene;
        // this.scene.add.existing(this);
        this.starPositions = starPositions;
        this.lines = lines;
        this.stars = []
        for (let star of starPositions) {
            this.stars.push(new Star(scene, star[0], star[1]));
        }

        // Creating graphics for testing
        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(10);
    }

    physicsUpdate() {
        this.stars.forEach(star => star.physicsUpdate());
    }

    visualUpdate() {
        this.stars.forEach(star => star.visualUpdate());
    }
}
