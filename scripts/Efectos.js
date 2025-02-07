// gameEffects.js
let explosions = [];

function spawnExplosion(x, y) {
  explosions.push({
    x, y, 
    radius: 0, 
    maxRadius: 30, 
    alpha: 1,
    particles: Array(20).fill().map(() => ({
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 5 + 2,
      life: 1
    }))
  });
  shake = 10;
  explosionSound.currentTime = 0;
  explosionSound.play();
}

function updateExplosions() {
  for (let i = explosions.length - 1; i >= 0; i--) {
    const exp = explosions[i];
    exp.radius += 1.5;
    exp.alpha -= 0.02;
    
    exp.particles.forEach(p => {
      p.life -= 0.03;
      p.x = exp.x + Math.cos(p.angle) * p.speed * (1 - p.life);
      p.y = exp.y + Math.sin(p.angle) * p.speed * (1 - p.life);
    });
    
    if (exp.alpha <= 0) explosions.splice(i, 1);
  }
}

function drawExplosions() {
  explosions.forEach(exp => {
    ctx.save();
    ctx.globalAlpha = exp.alpha;
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
    ctx.fill();
    
    exp.particles.forEach(p => {
      if (p.life > 0) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, ${Math.random()*100 + 155}, 0, ${p.life})`;
        ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.restore();
  });
}