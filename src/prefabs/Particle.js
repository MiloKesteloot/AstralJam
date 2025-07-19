class Particle extends Entity {
    constructor(scene, x, y, sprite, vx, vy, gravity, life) {

        // Get width and height of sprite

        let texture = scene.textures.get(sprite);
        let w = texture.getSourceImage().width;
        let h = texture.getSourceImage().height;

        super(scene, x, y, sprite, w, h);

        // Set up settings for particle

        this.vx = vx;
        this.vy = vy;

        this.gravity = gravity;

        this.life = life;

        this.graphics.fillStyle(0xff0000, 1);
    }

    // This function handles all of a particle's movement
    physicsUpdate() {

        // Movement logic for particles

        if (--this.life <= 0) {
            this.delete();
            return;
        }

        this.vy += this.gravity;

        this.rx += this.vx;
        this.ry += this.vy;

        this.x = Math.floor(this.rx);
        this.y = Math.floor(this.ry);
    }
}
