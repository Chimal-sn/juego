class Estrella {
    constructor(x, y, width = 5, height = 5, speed = 2, color = "#ffffff") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
    }

    update() {
        this.y += this.speed; // La estrella se mueve hacia abajo
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}