class Kroq extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "kroq-idle-sheet", 12, 14);

        this.setAnimation("idle")

        // Set up settings for player

        this.health = 3;
        this.stars = 0;

        this.maxCoyoteTime = 5;
        this.coyoteTime = this.maxCoyoteTime;

        this.gravity = 0.05;
        this.jumpForce = 1.2;
        this.jumpTimer = 0;
        this.canUseJump = true;
        this.maxJumpTime = 30;
        this.moveSpeed = 0.05;
        this.slowDownSpeed = 0.1;
        this.maxMoveSpeed = 1;
        this.onGroundTimer = 0;
        this.maxOnGroundTimer = 50;
        this.particleTimer = 0;

        this.mount = null;

        this.movementType = "control";

        this.graphics.fillStyle(0xff0000, 1);

        // Timer for speedrunning
        this.gameTimer = 0;

        this.checkpoint = null;
        // this.checkCheckpoints();
    }

    // This function finds the players current checkpoint
    checkCheckpoints() {
        if (this.checkpoint === null) {
            let leftCP = null;
            this.scene.checkpoints.forEach(cp => {
                if (leftCP === null || cp.x < leftCP.x) leftCP = cp;
            });
            this.checkpoint = leftCP;
        } else {
            this.scene.checkpoints.forEach(cp => {
                if (cp.x < this.rx + 14 && cp.x > this.checkpoint.x) {
                    this.checkpoint = cp;
                }
            });
        }
    }

    // This function handles all of Kroq's movement
    physicsUpdate() {

        // if (this.keyDownClick()) {
        //     this.move(0, 0.3333);
        // }
        // if (this.keyUpClick()) {
        //     this.move(0, -0.3333);
        // }
        // console.log(this.inGround(), this.ry);
        // return;

        if (this.gameTimer > 0) {
            this.gameTimer++;
        }
        
        // if (this.ry > 420) {
        //     this.health--;
        //     if (this.health <= 0) {
        //         this.scene.scene.stop('uiScene')
        //         this.scene.scene.start('menuScene');
        //         return;
        //     }
        //     this.setAnimation("idle");
        //     this.rx = this.checkpoint.x;
        //     this.ry = this.checkpoint.y;
        //     this.vx = 0;
        //     this.vy = 0;
        //     this.setScale(1, 1);
        // }

        if (this.movementType === "control") {
            this.movementTypeControl();
        } else if (this.movementType === "ridingBird") {
            this.movementTypeRidingBird();
        }

        if ((this.vx !== 0 || this.vy < 0) && this.gameTimer === 0) {
            this.gameTimer = 1;
        }

        // This stops players from having a weird glitch that puts them in the floor
        this.move(0, this.vy);
        this.move(this.vx, 0);


        if (this.onRoof() && this.vy < 0) {
            this.vy = 0;
            this.move(0, 1);
        }
        if (this.onGround() && this.vy > 0) {
            this.vy = 0;
            this.coyoteTime = this.maxCoyoteTime;
        }

        // this.checkCheckpoints();

        // this.graphics.fillPoint(this.x, this.y);
    }

    // This function is the state machine case for when he is walking on the ground
    movementTypeControl() {

        if (this.onGround()) {
            this.ry = Math.ceil(this.ry);
        }

        let dx = (this.keyLeft() ? -1 : 0) + (this.keyRight() ? 1 : 0);

        let movementMultiplyer = 1;
        if (!this.onGround()) movementMultiplyer = 0.5;

        this.vx = Entity.pushyMovement(dx, this.vx, this.moveSpeed*movementMultiplyer, this.maxMoveSpeed, this.slowDownSpeed*movementMultiplyer);

        if (this.onRoof() && this.vy < 0) {
            this.vy = 0;
            this.jumpTimer = this.maxJumpTime;
            this.move(0, 1);
        }
        if (!this.keyUp()) {
            this.canUseJump = true;
        }
        if (!this.keyUp() && this.onGround()) {
            this.jumpTimer = 0;
        }
        if (this.keyUp() && (((this.onGround() || this.coyoteTime > 0) && this.canUseJump) || (this.jumpTimer < this.maxJumpTime))) { // TODO make him not double jump when he hits a wall
            if (this.onGround() || this.coyoteTime > 0) {
                this.jumpTimer = 0;
                this.scene.sound.add("kroqJump").setVolume(0.1).play();
            }
            this.canUseJump = false;
            this.vy = -this.jumpForce;
            this.coyoteTime = 0;
        } else if (!this.onGround()) {
            this.vy += this.gravity;
            this.jumpTimer = this.maxJumpTime;
            if (this.coyoteTime > 0) this.coyoteTime--;
        }
        if (!this.onGround()) {
            this.jumpTimer++;
        }

        if (this.onGround() && this.vx !== 0 && this.particleTimer-- <= 0 && Math.sign(dx) === Math.sign(this.vx)) {
            this.particleTimer = Entity.randomBetween(20, 30);
            const particleSprites = ['p1', 'p2', 'p3'];
            this.scene.entities.push(new Particle(this.scene, this.rx + -Math.sign(this.vx)*5, this.ry + this.w/2 - 1, particleSprites[Math.floor(Math.random()*particleSprites.length)], -Math.sign(this.vx)*0.1, -Entity.randomBetween(0.2,0.5), 0.02, Entity.randomBetween(20, 30)));
        }

        if (this.onGround() && dx !== 0  && (Math.sign(dx) !== Math.sign(this.vx))) {
            this.particleTimer = 25;
            const particleSprites = ['p1', 'p2', 'p3'];
            this.scene.entities.push(new Particle(this.scene, this.rx + -Math.sign(dx)*5, this.ry + this.w/2 - 1, particleSprites[Math.floor(Math.random()*particleSprites.length)], -Math.sign(dx)*0.2, -Entity.randomBetween(0.2,0.4), 0.02, Entity.randomBetween(20, 30)));
        }
        
        this.getColliding().forEach(entity => {
            if (entity instanceof Bird && this.vy > 0) {
                this.mountBird(entity);
                return;
            }
        })
        if (this.mount === null) {
            if (this.onGround()) {
                if (this.vx === 0 && dx === 0) {
                    this.setAnimation("idle");
                } else {
                    this.setAnimation("run");
                }
            } else {
                if (this.vy < 0) {
                    this.setAnimation("jump");
                } else {
                    this.setAnimation("fall");
                }
            }
        }
    }

    // This function puts Kroq on a bird
    mountBird(bird) {
        this.mount = bird;
        this.movementType = "ridingBird";
        
        this.mount.rx = this.rx;
        this.mount.ry = this.ry + 9; // TODO kroq isn't lining up with bird for some reason

        this.mount.setScale(this.scaleX, 1)
        this.mount.mounted(this);

        this.onGroundTimer = this.maxOnGroundTimer;

        this.setAnimation("idle", false)

        if (bird.endBird) {
            UI.instance.fadeToBlack();
        }
    }

    // Animation helper function. Options are: idle, run, jump, fall
    setAnimation(anim, playing = true) {
        const sheetName = "kroq-" + anim + "-sheet"
        const animName = "kroq-" + anim + "-anim";
        if (this.anims.getName() !== animName) {
            this.setTexture(sheetName);
            this.play(animName);
        }
        if (!playing && this.anims.isPlaying) {
            this.stop(animName);
        } else if (playing && !this.anims.isPlaying) {
            this.play(animName);
        }
    }

    // This function is the state machine case for when he is riding on a bird
    movementTypeRidingBird() {

        if (!this.mount.endBird) {
            let dx = (this.keyLeft() ? -1 : 0) + (this.keyRight() ? 1 : 0);
            this.vx = Entity.pushyMovement(dx, this.vx, this.mount.flySpeed, this.mount.maxFlySpeed);

            if (this.mount.stamina > 0) {
                this.vy = Entity.pushyMovement(-1, this.vy, this.mount.flyUpSpeed, this.mount.maxFlyUpSpeed, this.mount.flyUpSpeed*3);
                if (this.mount.y <= this.mount.spawnY) this.mount.stamina--;
            } else {
                this.vy = Entity.pushyMovement(1, this.vy, this.mount.fallSpeed, this.mount.maxFallSpeed);
            }
        } else {
            this.vx = Entity.pushyMovement(1, this.vx, 0.05, 1);
            this.vy = Entity.pushyMovement(-1, this.vy, 0.01, 1000, this.mount.flyUpSpeed*3);
        }

        if (this.onRoof() && this.mount.stamina <= 0) {
            this.vy = 0;
            this.move(0, 1);
        }

        this.mount.rx = this.rx + 2 + this.vx;
        this.mount.ry = this.ry + 9 + this.vy; // TODO kroq isn't lining up with bird for some reason

        if (this.onGround() && this.mount.stamina === 0 && this.vy >= 0) {
            if (this.onGroundTimer) {
                this.mount.reset();
                this.mount = null;
                this.movementType = "control";
            } else {
                this.onGroundTimer = true;
            }
        }

    }
    
    // This function sets the direction of the mount (if it exists) to Kroq's direction
    visualUpdate() {
        super.visualUpdate();
        if (this.movementType === "ridingBird") {
            this.mount.visualUpdate();
            if (this.vx > 0) {
                this.mount.setScale(1, 1);
            }
            if (this.vx < 0) {
                this.mount.setScale(-1, 1);
            }
        }
    }
}

// TODO - kroq sometimes goes into ground >:(
