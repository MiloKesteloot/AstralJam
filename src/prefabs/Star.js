class Star extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "star", 10, 10);
        // Settings for star
        this.t = 0;
        this.bobSpeed = 0.025;
    }

    physicsUpdate() {
        this.t += 1;
    }

    visualUpdate() {
        this.x = Math.round(this.rx);
        // Bob animation
        this.y = Math.round(this.ry + Math.sin(this.t * this.bobSpeed));
    }
}
