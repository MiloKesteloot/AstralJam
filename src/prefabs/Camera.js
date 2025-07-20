class Camera {
    constructor(scene, camera, xOffset = 0) {
        this.scene = scene;
        this.camera = camera;
        this.xOffset = xOffset;
        this.camera.setBackgroundColor("#51A9B5");
        this.follow = null;
        this.scale = undefined;

        // This is for the scrolling water
        this.waterX = 0;
        this.waterMoveSpeed = 0.1;
    }

    update() {
        // this.scale = 
        
        // This code callibrates the proper scale for the screen size
        let desiredHeight = 983.2000122070312; // My monitor height
        let desiredScale = 3.1; // My monitor scale
        let theirHeight = this.camera.height; // User monitor height
        let theirScale = (desiredScale / desiredHeight) * theirHeight; // Solve for user scale

        this.scale = theirScale;

        // This code centers the center of the screen on 0, 0 and follows whatever the variable this.follow is set to
        this.camera.scrollX = -this.camera.width / 2;
        this.camera.scrollY = -this.camera.height / 2;
        if (this.follow != null) {
            this.camera.scrollX += this.follow.x;
            if (this.camera.scrollX < this.camera.width / 2 / this.scale - this.camera.width/2 + this.scale) {
                this.camera.scrollX = this.camera.width / 2 / this.scale - this.camera.width/2 + this.scale;
            }
            this.camera.scrollY += 20*16/2; // this.follow.y;
        }
        this.camera.setZoom(this.scale);

        // Background paralax with camera
        if (this.scene.backgroundLayer !== undefined) {
            console.log(this.camera.scrollX)
            this.scene.backgroundLayer.x = (this.camera.scrollX+this.camera.width/2)/1.1 - this.camera.width/3/this.scale - 80*this.scale + this.xOffset;
        }
        if (this.scene.planetsLayer !== undefined) {
            this.scene.planetsLayer.x = (this.camera.scrollX+this.camera.width/2)/1.3 - this.camera.width/3/this.scale + this.xOffset;
        }
        if (this.scene.cliffsLayer !== undefined) {
            this.scene.cliffsLayer.x = (this.camera.scrollX+this.camera.width/2)/2 - this.camera.width/3/this.scale + this.xOffset;
        }

        // Move water animation
        this.waterX -= this.waterMoveSpeed;
        while (this.waterX <= -16) this.waterX += 16;
        
        if (this.scene.waterLayer !== undefined) {
            this.scene.waterLayer.x = Math.ceil(this.waterX) + this.xOffset;
        }
    }

    setFollow(object) {
        this.follow = object;
    }
}