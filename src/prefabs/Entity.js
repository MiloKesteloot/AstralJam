class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name, w, h) {
        super(scene, Math.floor(x), Math.floor(y), name);
        this.scene = scene;
        this.scene.add.existing(this);

        // Setting params for custom calculations
        this.spawnX = x;
        this.spawnY = y;
        
        this.rx = x;
        this.ry = y;

        this.w = w;
        this.h = h;

        this.vx = 0;
        this.vy = 0;

        // Creating graphics for testing
        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(10);
    }

    // Function to set entity back to where it started
    reset() {
        this.rx = this.spawnX;
        this.ry = this.spawnY;

        this.vx = 0;
        this.vy = 0;
    }

    physicsUpdate() {}
    
    // Function to place an entities sprite to it's location
    visualUpdate() {
        this.x = Math.round(this.rx);
        this.y = Math.round(this.ry);
        
        if (this.vx > 0) {
            this.setScale(1, 1);
        }
        if (this.vx < 0) {
            this.setScale(-1, 1);
        }
    }

    // Function to move an entity to a specific location without moving through walls
    move(vx, vy) {
        if (vx === 0 && vy === 0) return;

        let amm = Math.max(Math.abs(vx), Math.abs(vy));
        const extra = amm % 1;
        amm = Math.floor(amm);

        vx = Math.sign(vx);
        vy = Math.sign(vy);

        for (let i = 0; i < amm; i++) {
            if (!this.inTile()) {
                this.rx += vx;
                this.ry += vy;
            } else {
                break;
            }
        }

        if (!this.inTile()) {
            this.rx += vx * extra;
            this.ry += vy * extra;
        }

        this.pushOut(vx, vy);
    }

    // This function checks if the entity is in a wall, and if it is, it pushes it fully out
    pushOut(vx, vy) {
        if (vx === 0 && vy === 0) {
            console.error("pushOut(): both vx and vy were zero!");
            return;
        }
        if (this.inTile()) {
            if (vx !== 0) {
                this.rx = Math.floor(this.rx);
            } else {
                this.ry = Math.floor(this.ry);
            }

            while (this.inTile()) {
                this.rx -= vx;
                this.ry -= vy;
            }
        }
    }

    // This function checks if the tile at the specified location relative to the entity is a solid or not
    checkTile(vx, ax, vy, ay) { // true if you are in a wall
        let x;
        if (vx !== 0) {
            let ox = vx > 0 ? -1 : 0;
            x = vx * (this.w / 2 + ax - 1) + ox + this.rx;
        } else {
            x = ax + this.rx;
        }
        let y;
        if (vy !== 0) {
            let oy = vy > 0 ? -1 : 0;
            y = vy * (this.h / 2 + ay - 1) + oy + this.ry;
        } else {
            y = ay + this.ry;
        }

        if (this.scene.currentGate !== -1 && x > this.scene.gates[this.scene.currentGate].x) {
            return true;
        }
        
        const cx1 = Math.floor(Math.floor(x)/16);
        const cy1 = Math.floor(Math.floor(y)/16);
        const cx2 = Math.floor(Math.ceil(x)/16);
        const cy2 = Math.floor(Math.ceil(y)/16);

        let tile11 = this.scene.tilemap.getTileAt(cx1, cy1, true, this.scene.groundMap);
        let tile21 = this.scene.tilemap.getTileAt(cx2, cy1, true, this.scene.groundMap);
        let tile12 = this.scene.tilemap.getTileAt(cx1, cy2, true, this.scene.groundMap);
        let tile22 = this.scene.tilemap.getTileAt(cx2, cy2, true, this.scene.groundMap);

        return tile11 === null || tile11.index !== -1 ||
               tile21 === null || tile21.index !== -1 ||
               tile12 === null || tile12.index !== -1 ||
               tile22 === null || tile22.index !== -1;
    }
    // Below functions without comments are self explanitory through their names
    inTile() {
        return this.inGround() || this.inRoof() || this.inLeft() || this.inRight();
    }
    onDirection(x, y) {
        if (x !== 0) {
            return this.checkTile(x, 2, 0, -this.h/2) || this.checkTile(x, 2, 0, this.h/2-1);
        } else {
            return this.checkTile(0, -this.w/2, y, 2) || this.checkTile(0, this.w/2-1, y, 2);
        }
    }
    inDirection(x, y) {
        if (x !== 0) {
            return this.checkTile(x, 1, 0, -this.h/2) || this.checkTile(x, 1, 0, this.h/2-1);
        } else {
            return this.checkTile(0, -this.w/2, y, 1) || this.checkTile(0, this.w/2-1, y, 1);
        }
    }
    onGround() {
        return this.onDirection(0, 1);
    }
    inGround() {
        return this.inDirection(0, 1);
    }
    onRoof() {
        return this.onDirection(0, -1);
    }
    inRoof() {
        return this.inDirection(0, -1);
    }
    onLeft() {
        return this.onDirection(-1, 0);
    }
    inLeft() {
        return this.inDirection(-1, 0);
    }
    onRight() {
        return this.onDirection(1, 0);
    }
    inRight() {
        return this.inDirection(1, 0);
    }

    keyLeft() {return this.scene.keys.left.isDown || this.scene.keys.A.isDown; }
    keyRight() { return this.scene.keys.right.isDown || this.scene.keys.D.isDown; }
    keyUp() { return this.scene.keys.up.isDown || this.scene.keys.W.isDown || this.scene.keys.SPACE.isDown; }
    keyDown() { return this.scene.keys.down.isDown || this.scene.keys.S.isDown; }

    keyLeftClick() {
        if (this.keyLeft()) {
            if (this.leftWasDown === false) {
                this.leftWasDown = true;
                return true;
            }
        } else {
            this.leftWasDown = false;
        }
    }

    keyRightClick() {
        if (this.keyRight()) {
            if (this.rightWasDown === false) {
                this.rightWasDown = true;
                return true;
            }
        } else {
            this.rightWasDown = false;
        }
    }

    keyUpClick() {
        if (this.keyUp()) {
            if (this.upWasDown === false) {
                this.upWasDown = true;
                return true;
            }
        } else {
            this.upWasDown = false;
        }
    }

    keyDownClick() {
        if (this.keyDown()) {
            if (this.downWasDown === false) {
                this.downWasDown = true;
                return true;
            }
        } else {
            this.downWasDown = false;
        }
    }

    // This function deletes the entity.
    delete() {
        const index = this.scene.entities.indexOf(this);
        if (index !== -1) {
            this.scene.entities.splice(index, 1);
        }
        this.destroy();
    }

    // This function gets a list of entities that this entity is colliding with
    getColliding() {
        const colliding = [];
        this.scene.entities.forEach(entity => {
            if (entity !== this && Entity.collides(this, entity)) {
                colliding.push(entity);
            }
        });
        return colliding;
    }

    // This function checks if two entities are colliding
    static collides(e1, e2) {
        const halfWidth1 = e1.w / 2;
        const halfHeight1 = e1.h / 2;
        const halfWidth2 = e2.w / 2;
        const halfHeight2 = e2.h / 2;
        
        const left1 = e1.rx - halfWidth1;
        const right1 = e1.rx + halfWidth1;
        const top1 = e1.ry - halfHeight1;
        const bottom1 = e1.ry + halfHeight1;
        
        const left2 = e2.rx - halfWidth2;
        const right2 = e2.rx + halfWidth2;
        const top2 = e2.ry - halfHeight2;
        const bottom2 = e2.ry + halfHeight2;
        
        return !(right1 <= left2 || left1 >= right2 || bottom1 <= top2 || top1 >= bottom2);
    }

    // This function takes inputs and tries to move an entity smoothly in the desired direction with the desired parameters
    static pushyMovement(d, v, moveSpeed, maxMoveSpeed, slowDownSpeed) {
        slowDownSpeed = slowDownSpeed ?? moveSpeed;
        if (d === 0 && v === 0) {
            // Do nothing
        } else if (d === Math.sign(v) || v === 0) {
            v += d * moveSpeed;
            if (v > maxMoveSpeed) v = maxMoveSpeed;
            if (v <-maxMoveSpeed) v =-maxMoveSpeed;
        } else if ((d === 0 && v !== 0) || (d < 0 && v > 0) || (d > 0 && v < 0)) {
            if (v > 0) {
                v -= slowDownSpeed;
                if (v < 0) v = 0;
            }
            if (v < 0) {
                v += slowDownSpeed;
                if (v > 0) v = 0;
            }
        }
        return v;
    }

    // Helper function for random numbers
    static randomBetween(min, max) {
        return Math.random() * (max-min) + min;
    }
}
