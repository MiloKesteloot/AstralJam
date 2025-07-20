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
    }

    physicsUpdate() {

    }

    visualUpdate() {
        if (this.closed && Play.instance.currentGate > this.index-1) {
            this.closed = false;
            this.setTexture("Gate" + this.index + "Open");
        }

        if (this.special && !UI.instance.showBook && Play.instance.currentGate > this.index-1) {
            this.timer += this.speed;
            if (this.timer < 5) {
                this.setTexture("FinalPGuy" + Math.floor(this.timer));
            } else {
                // cat shit here???
            }
        }
    }
}
