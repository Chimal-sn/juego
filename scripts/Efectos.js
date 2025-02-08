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
    exp.radius += 1.2; // Reducir la velocidad de expansión
    exp.alpha -= 0.015; // Desvanecer más lentamente

    exp.particles.forEach(p => {
      p.life -= 0.02; // Partículas duran más tiempo
      p.speed *= 0.98; // Ralentizar las partículas
      p.x = exp.x + Math.cos(p.angle) * p.speed * (1 - p.life);
      p.y = exp.y + Math.sin(p.angle) * p.speed * (1 - p.life);
    });

    if (exp.alpha <= 0) explosions.splice(i, 1);
  }
}

function drawExplosions() {
  explosions.forEach(exp => {
    ctx.save();
    ctx.globalAlpha = exp.alpha * 0.5; // Reducir aún más la opacidad global
    ctx.fillStyle = "#FF4500"; // Un naranja más oscuro
    ctx.beginPath();
    ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
    ctx.fill();

    exp.particles.forEach(p => {
      if (p.life > 0) {
        let r = 150; // Rojo más oscuro
        let g = Math.max(30, 100 * p.life); // Verde más oscuro
        let b = 0;
        if (p.life < 0.5) { 
          r = g = b = Math.random() * 30; // Humo gris oscuro
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.life * 0.6})`; // Partículas menos brillantes
        ctx.arc(p.x, p.y, 1.5 * p.life, 0, Math.PI * 2); // Reducir el tamaño de las partículas
        ctx.fill();
      }
    });
    ctx.restore();
  });
}