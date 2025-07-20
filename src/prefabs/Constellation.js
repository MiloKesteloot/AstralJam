class Constellation {
    constructor(scene, name, scale, starPositions, lines) {
        this.scene = scene;
        this.name = name;
        this.starPositions = starPositions;
        this.lines = lines;
        this.stars = []
        for (let star of starPositions) {
            star[0] *= scale;
            star[1] *= scale;
        }
        this.finished = false;
    }

    clone() {
            return new Constellation(this.scene, this.name, 1,
            this.starPositions.map(pos => [...pos]),
            this.lines.map(line => [...line]));
    }

    modify(x, y, s) {
        for (let i = 0; i < this.starPositions.length; i++) {
            const starPosition = this.starPositions[i];
            starPosition[0] = starPosition[0]/s+x;
            starPosition[1] = starPosition[1]/s+y;
            const star = this.stars[i];
            if (star !== undefined) {
                star.rx = star.rx / s + x;
                star.ry = star.ry / s + y;
            }
        }
        return this;
    }

    showStars(scene) {
        for (let star of this.starPositions) {
            this.stars.push(new Star(scene, star[0], star[1]));
        }
        return this;
    }

    physicsUpdate() {
        this.stars.forEach(star => star.physicsUpdate());
    }

    visualUpdate() {
        this.stars.forEach(star => star.visualUpdate());
    }

    draw(graphics) {
        const s = this.starPositions;

        let color = 0x666666;
        if (this.finished) {
            color = 0x00ff00;
        }
        graphics.lineStyle(1, color, 1);
        const l = this.lines;
        for (let i = 0; i < l.length; i++) {
            const line = l[i];

            graphics.beginPath();
            graphics.moveTo(s[l[i][0]][0], s[l[i][0]][1]);
            graphics.lineTo(s[l[i][1]][0], s[l[i][1]][1]);
            graphics.strokePath();
        }
    }
}
