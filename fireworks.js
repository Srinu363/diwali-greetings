class Firework {
    constructor(x, y, audioManager) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 2 + 1;
      this.speedY = -Math.random() * 3 - 3;
      this.speedX = Math.random() * 6 - 3;
      this.gravity = 0.1;
      this.color = this.getRandomIndianColor();
      this.opacity = 1;
      this.particles = [];
      this.exploded = false;
      this.audioManager = audioManager;
    }
  
    getRandomIndianColor() {
      const colors = [
        'hsl(47, 100%, 50%)',    // Golden
        'hsl(16, 100%, 50%)',    // Orange
        'hsl(0, 100%, 50%)',     // Red
        'hsl(120, 100%, 40%)',   // Green
        'hsl(273, 100%, 50%)'    // Purple
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  
    update() {
      if (!this.exploded) {
        this.speedY += this.gravity;
        this.y += this.speedY;
        this.x += this.speedX;
  
        if (this.speedY >= 0) {
          this.explode();
        }
      } else {
        this.particles.forEach((particle, index) => {
          particle.update();
          if (particle.opacity <= 0) {
            this.particles.splice(index, 1);
          }
        });
      }
    }
  
    explode() {
      this.audioManager.playRandomFireworkSound();
  
      const patterns = [
        this.createCirclePattern(),
        this.createHeartPattern(),
        this.createSpiralPattern()
      ];
      
      const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
      this.particles.push(...selectedPattern);
      
      this.exploded = true;
    }
  
    createCirclePattern() {
      const particles = [];
      const particleCount = 50;
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 / particleCount) * i;
        const speed = Math.random() * 5 + 2;
        particles.push(new Particle(
          this.x,
          this.y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          this.color
        ));
      }
      return particles;
    }
  
    createHeartPattern() {
      const particles = [];
      const particleCount = 50;
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 / particleCount) * i;
        const heartX = 16 * Math.pow(Math.sin(angle), 3);
        const heartY = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);
        const speed = 2;
        particles.push(new Particle(
          this.x,
          this.y,
          heartX * speed * 0.1,
          -heartY * speed * 0.1,
          this.color
        ));
      }
      return particles;
    }
  
    createSpiralPattern() {
      const particles = [];
      const particleCount = 50;
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 8 * i / particleCount);
        const radius = 5 * i / particleCount;
        const speed = 3;
        particles.push(new Particle(
          this.x,
          this.y,
          Math.cos(angle) * radius * speed,
          Math.sin(angle) * radius * speed,
          this.color
        ));
      }
      return particles;
    }
  
    draw(ctx) {
      if (!this.exploded) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      } else {
        this.particles.forEach(particle => particle.draw(ctx));
      }
    }
  }