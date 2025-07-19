class Bird extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "bird", 16, 18);

        this.setDepth(10);

        // Settings for bird
        this.flySpeed = 0.05;
        this.maxFlySpeed = 1;
        this.flyUpSpeed = 0.04;
        this.maxFlyUpSpeed = 1.2;
        this.fallSpeed = 0.01;
        this.maxFallSpeed = 0.4;
        this.maxStamina = 40;
        this.stamina = this.maxStamina;
        this.particleTimer = 0;
        this.flapTimer = 0; // TODO match with bird animation
        this.endBird = false;

        // If bird has rider
        this.passenger = null;

        this.anims.play('bird-flap-anim');
    }

    reset() {
        super.reset();
        this.stamina = this.maxStamina;
        this.passenger = null;
        this.particleTimer = 0;
        this.flapTimer = 0;

        this.anims.play('bird-flap-anim');
        this.anims.timeScale = 1;

        // TODO make birds fly back to where they start instead of teleporting
    }

    mounted(passenger) {
        this.passenger = passenger;
        if (!this.endBird) {
            this.anims.timeScale = 3;
        }
    }

    physicsUpdate() {
        if (this.passenger !== null && (this.stamina > 0 || this.passenger.vy < 0)) {
            if (this.flapTimer-- <= 0) {
                this.flapTimer = 50;
                this.scene.sound.add("birdFlap").setVolume(0.3).play();
            }
            if (this.particleTimer-- <= 0) {
                this.particleTimer = Entity.randomBetween(9, 12);
                const particleSprites = ['p1'];
                const px = this.rx + Entity.randomBetween(-this.w/2, this.w/2);
                const ps = particleSprites[Math.floor(Math.random()*particleSprites.length)]
                const pvy = Entity.randomBetween(1, 3);
                // for (let i = 0; i < Math.random()*5+7; i++) {
                //     this.scene.entities.push(new Particle(this.scene, px, this.ry + this.w/2 - 4 - i, ps, 0, pvy, 0, Entity.randomBetween(30, 60)));
                // }
            }
        } else if (this.passenger !== null) {
            this.anims.timeScale = 1;
        }
    }
}
