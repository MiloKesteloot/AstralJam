class Gate extends Entity {
    constructor(scene, x, y, index) {

        let sprite = "Gate" + index + "Closed";
        let special = false;
        if (index === 5) {
            sprite = "FinalPGuy1";
            special = true;
        }

        super(scene, x, y, sprite, 10, 10);

        this.index = index;
        this.closed = true;

        this.special = special;
        this.timer = 1;
        this.speed = 0.01;

        this.fadedToBlack = false;
        this.turnedOffMusic = false;
    }

    physicsUpdate() {

    }

    visualUpdate() {
        if (this.closed && Play.instance.currentGate > this.index-1) {
            this.closed = false;
            this.setTexture("Gate" + this.index + "Open");
        }

        if (this.special && !UI.instance.showBook && Play.instance.currentGate > this.index-1) {
            if (!this.turnedOffMusic) {
                this.scene.tweens.add({
                    targets: this.scene.game.backgroundMusic,
                    volume: 0,
                    duration: 200,
                    onComplete: () => { this.scene.game.backgroundMusic.stop(); }
                });
                this.turnedOffMusic = true;
            }

            this.scene.game.endMusic = this.scene.sound.add('outro-song', {loop: false, volume: 0.25});
            this.scene.game.endMusic.play();

            this.timer += this.speed;
            if (this.timer < 5) {
                this.setTexture("FinalPGuy" + Math.floor(this.timer));
            } else if (!this.fadedToBlack) {
                UI.instance.fadeToBlack();
                this.fadedToBlack = true;
            }
        }
    }
}
