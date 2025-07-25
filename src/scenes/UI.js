class UI extends Phaser.Scene {
    constructor() {
        super('uiScene');

        UI.instance = this;
    }

    init() {}

    create() {
        // Create all UI elements
        this.hearts = [
            this.makeHeart(0),
            this.makeHeart(1),
            this.makeHeart(2)
        ]
        // Store text element for star counter to modify later
        this.starText = this.makeStar();

        // This is used for the fading out animation
        this.blackTimer = 0;
        this.blackStage = 0;

        this.blackDelay = 120;
        this.blackFadeIn = 200;
        this.textPopin = 100;
        
        this.finalTime = 0;

        this.tintGraphics = this.add.graphics();

        this.kroq = Play.instance.kroq;
        this.healthUpdate = this.kroq.health;

        // let heart = this.add.sprite(0, 0, 'heart');
        // heart.scale = scale;
        // heart.x = this.cameras.main.width - heart.width*scale - (heart.width+1)*scale*i;
        // heart.y = heart.height*scale;

        if (this.showBook !== true) {
            this.showBook = false;
        }
        if (this.book === undefined) {
            this.bookPage = 1;
        }

        const t = this;

        this.book = this.add.sprite(0, 0, 'Journal' + this.bookPage);
        this.leftArrow = this.add.sprite(0, 0, 'Arrow');
        this.leftArrow.on('pointerdown', function(pointer) {
            t.bookPage--;
            t.book.setTexture('Journal' + (t.bookPage));
        })
        this.rightArrow = this.add.sprite(0, 0, 'Arrow');
        this.rightArrow.on('pointerdown', function(pointer) {
            t.bookPage++;
            t.book.setTexture('Journal' + (t.bookPage));
        })
    }

    skipOutro() {
        if (this.blackStage !== 3) {
            this.blackTimer = this.textPopin - 1;
            this.blackStage = 3;
            return false;
        }
        return true;
    }

    physicsUpdate() {

        while (this.kroq.health < this.healthUpdate) {
            this.healthUpdate--;
            if (this.healthUpdate >= 0) {
                this.hearts[this.healthUpdate].setTexture("heartBroken");
            }
        }

        this.blackTimer++;
        if (this.blackStage === 1) {
            if (this.blackTimer >= this.blackDelay) {
                this.blackTimer = 0;
                this.blackStage = 2;
            }
        } else if (this.blackStage === 2) {
            this.tintGraphics.clear();
            const r = this.blackTimer/this.blackFadeIn;
            this.tintGraphics.fillStyle(0X000000, r);
            if (this.blackTimer >= this.blackFadeIn) {
                this.blackTimer = 0;
                this.blackStage = 3;
                this.tintGraphics.fillStyle(0X000000);
            }
            
            this.tintGraphics.fillRect(0, 0, this.sys.game.canvas.width+1, this.sys.game.canvas.height+1);
        } else if (this.blackStage === 3) {
            this.tintGraphics.fillStyle(0X000000);
            this.tintGraphics.fillRect(0, 0, this.sys.game.canvas.width+1, this.sys.game.canvas.height+1);

            if (this.blackTimer === this.textPopin) {
                // Show credits text
                this.centerText = this.add.text(
                    this.sys.game.canvas.width/2, this.sys.game.canvas.height/2,
                    'YOU WIN!\n\nKroq - An Aseprite Adventure!\n\nTime: ' +
                    Play.instance.ticksToTime(this.finalTime) +
                    "\n\nStars: " + this.kroq.stars + "\n\n\n\nESC to return to menu",
                    {
                        fontFamily: 'pressstart',
                        fontSize: '32px',
                        color: '#51A9B5'
                    }
                ).setOrigin(0.5, 0.5).setDepth(2)
            }

            if (this.centerText !== undefined) {
                this.centerText.x = this.sys.game.canvas.width/2;
                this.centerText.y = this.sys.game.canvas.height/2;
            }
        }

        const scale = Play.instance.camera.scale;

        if (!this.showBook) {
            this.book.setVisible(false);
            this.book.disableInteractive();
        } else {
            this.book.setVisible(true);
            this.book.setInteractive();
        }

        this.book.scale = scale;
        this.book.x = this.cameras.main.width/2;
        this.book.y = this.cameras.main.height/2;

        if (!this.showBook || this.bookPage === 1) {
            this.leftArrow.setVisible(false);
            this.leftArrow.disableInteractive();
        } else {
            this.leftArrow.setVisible(true);
            this.leftArrow.setInteractive();
        }
        this.leftArrow.scale = scale;
        this.leftArrow.x = this.cameras.main.width/2 - 205*scale;
        this.leftArrow.y = this.cameras.main.height/2 + 98*scale;

        if (!this.showBook || this.bookPage === 5 || this.bookPage > Play.instance.currentGate - 1) { // ||
            this.rightArrow.setVisible(false);
            this.rightArrow.disableInteractive();
        } else {
            this.rightArrow.setVisible(true);
            this.rightArrow.setInteractive();
        }

        this.rightArrow.scale = -scale;
        this.rightArrow.x = this.cameras.main.width/2 + 205*scale;
        this.rightArrow.y = this.cameras.main.height/2 + 98*scale;
    }

    showBookF(page) {
        if (page === undefined) {
            page = this.bookPage;
        }
        this.bookPage = page;
        this.showBook = true;
    }

    hideBookF() {
        this.showBook = false;
    }

    fadeToBlack() {
        this.finalTime = Play.instance.kroq.gameTimer;
        this.blackStage = 1;
        this.blackTimer = 0;
    }

    // Puts a specific index heart on screen
    makeHeart(i) {
        let heart = this.add.sprite(0, 0, 'heart');
        let scale = Play.instance.camera.scale;
        heart.scale = scale;
        heart.x = this.cameras.main.width - heart.width*scale - (heart.width+1)*scale*i;
        heart.y = heart.height*scale;
        return heart;
    }

    // Puts the UI star counter text and icon on screen
    makeStar() {
        const scale = Play.instance.camera.scale;

        const star = this.add.sprite(0, 0, 'star');
        star.scale = scale;
        star.x = this.cameras.main.width - 93*scale;
        star.y = (star.height+4)*scale;

        const x = this.add.sprite(0, 0, 'x');
        x.scale = scale;
        x.x = this.cameras.main.width - 83*scale;
        x.y = (star.height+4)*scale;
        
        const text = this.add.text(star.x+15*scale, star.y+0*scale, '0', {
            fontFamily: 'pressstart',
            fontSize: '32px',
            color: '#000000'
        }).setOrigin(0, 0.5).setDepth(2)

        return text;
    }

    showNotification(sprite) {
        const scale = Play.instance.camera.scale;
        const notification = this.add.sprite(this.cameras.main.width/2, 3*scale, sprite);
        notification.setOrigin(0.5, 0);
        notification.scale = scale;

        window.requestAnimationFrame(() => {
            notification.destroy();
        });

        // const star = this.add.sprite(0, 0, 'star');
        // star.scale = scale;
        // star.x = this.cameras.main.width - 93*scale;
        // star.y = (star.height+4)*scale;
        //
        // const notification = this.add.sprite(this.cameras.main.width/2, this.cameras.main.height/2, sprite);
        // notification.scale = scale;
        // notification.setDepth(10);
        //
        // notification.setInteractive();
        // notification.on('pointerdown', () => {
        //     notification.destroy();
        // });
    }
}
