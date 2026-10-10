/**
 * Romantic Interactive Canvas Particle Engine
 * Floating hearts, sparkling stardust, and mouse trails
 */

class RomanticParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.interactiveHearts = [];
    this.maxParticles = 65;
    this.mouse = { x: null, y: null, active: false };
    
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Spawn initial particle field
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle());
    }

    // Mouse / Touch interaction for glowing heart burst
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      if (Math.random() < 0.25) {
        this.addInteractiveHeart(e.clientX, e.clientY);
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
        if (Math.random() < 0.3) {
          this.addInteractiveHeart(e.touches[0].clientX, e.touches[0].clientY);
        }
      }
    }, { passive: true });

    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle() {
    const isHeart = Math.random() < 0.45;
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height + this.canvas.height * 0.1,
      size: isHeart ? Math.random() * 14 + 10 : Math.random() * 3 + 1,
      speedY: Math.random() * 0.6 + 0.3,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      fadeSpeed: (Math.random() * 0.005) + 0.002,
      fadeDir: Math.random() > 0.5 ? 1 : -1,
      isHeart: isHeart,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      color: isHeart 
        ? (Math.random() > 0.4 ? 'rgba(255, 77, 121, ' : 'rgba(212, 175, 55, ')
        : 'rgba(255, 230, 160, '
    };
  }

  addInteractiveHeart(x, y) {
    if (this.interactiveHearts.length > 30) return;
    this.interactiveHearts.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      size: Math.random() * 12 + 8,
      speedY: -(Math.random() * 1.5 + 1),
      speedX: (Math.random() - 0.5) * 1.2,
      opacity: 1,
      fadeSpeed: 0.02,
      color: Math.random() > 0.3 ? 'rgba(255, 105, 180, ' : 'rgba(255, 215, 0, '
    });
  }

  drawHeart(ctx, x, y, size, color, opacity, rotation = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    
    // Top left curve
    ctx.bezierCurveTo(
      -size / 2, -topCurveHeight, 
      -size, size / 3, 
      0, size
    );
    // Top right curve
    ctx.bezierCurveTo(
      size, size / 3, 
      size / 2, -topCurveHeight, 
      0, topCurveHeight
    );
    
    ctx.fillStyle = `${color}${opacity})`;
    ctx.shadowBlur = 12;
    ctx.shadowColor = color.includes('255, 77') ? 'rgba(255, 77, 121, 0.8)' : 'rgba(212, 175, 55, 0.8)';
    ctx.fill();
    ctx.restore();
  }

  drawSparkle(ctx, x, y, size, color, opacity) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `${color}${opacity})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(255, 240, 180, 0.9)';
    ctx.fill();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Background floating particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Update position
      p.y -= p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      // Pulse opacity
      p.opacity += p.fadeSpeed * p.fadeDir;
      if (p.opacity > 0.8) {
        p.fadeDir = -1;
      } else if (p.opacity < 0.15) {
        p.fadeDir = 1;
      }

      // Reset when particle goes above screen
      if (p.y < -30 || p.x < -30 || p.x > this.canvas.width + 30) {
        this.particles[i] = this.createParticle();
        this.particles[i].y = this.canvas.height + 20;
      }

      // Render
      if (p.isHeart) {
        this.drawHeart(this.ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
      } else {
        this.drawSparkle(this.ctx, p.x, p.y, p.size, p.color, p.opacity);
      }
    }

    // Interactive cursor hearts
    for (let i = this.interactiveHearts.length - 1; i >= 0; i--) {
      const h = this.interactiveHearts[i];
      h.y += h.speedY;
      h.x += h.speedX;
      h.opacity -= h.fadeSpeed;

      if (h.opacity <= 0) {
        this.interactiveHearts.splice(i, 1);
      } else {
        this.drawHeart(this.ctx, h.x, h.y, h.size, h.color, h.opacity);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.RomanticParticles = RomanticParticles;
