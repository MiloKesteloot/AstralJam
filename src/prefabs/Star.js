class Star extends Entity {
    constructor(scene, x, y, finished) {
        let sprite = "star";
        if (finished) {
            sprite = "starFinish";
        }
        super(scene, x, y, sprite, 10, 10);
        // Settings for star
        this.finished = finished;

        this.t = Math.floor(Math.random()*1000);
        this.bobSpeed = 0.025;

        this.bloom = scene.add.sprite(x, y, 'starBright');
        this.bloom.postFX.addBloom(0xffffff, 3, 3, 1, 1, 4);

        this.setInteractive();


        // Listen for pointer events
        this.on('pointerover', function () {
            this.setTexture('starHover');
        });

        this.on('pointerout', function () {
            let sprite = "star";
            if (this.finished) {
                sprite = "starFinish";
            }
            this.setTexture(sprite);
        });

        this.setDepth(3);
    }

    setFinished() {
        this.finished = true;

        this.setTexture('starFinish');
    }

    physicsUpdate() {
        this.t += 1;
    }

    visualUpdate() {
        this.x = Math.round(this.rx);
        // Bob animation
        this.y = Math.round(this.ry + Math.sin(this.t * this.bobSpeed));

        this.bloom.x = this.x;
        this.bloom.y = this.y;
    }
}
