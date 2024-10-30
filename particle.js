class Particle {
    constructor(x, y, speedX, speedY, color) {
      this.x = x;
      this.y = y;
      this.speedX = speedX;
      this.speedY = speedY;
      this.color = color;
      this.size = Math.random() * 2 + 1;
      this.opacity = 1;
      this.gravity = 0.1;
    }
  
    update() {
      this.speedY += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity -= 0.02;
    }
  
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color.slice(0, -1)}, ${this.opacity})`;
      ctx.fill();
      ctx.closePath();
    }
  }