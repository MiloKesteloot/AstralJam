class Gate extends Entity {
    constructor(scene, x, y, index) {

        let sprite = "Gate" + index + "Closed";

        if (index === 5) {
            sprite = "FinalPGuy1";
        }

        console.log(sprite)

        super(scene, x, y, sprite, 10, 10);
    }

    physicsUpdate() {

    }

    visualUpdate() {

    }
}
