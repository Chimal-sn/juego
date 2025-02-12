// gameAnimations.js
function updateEnemyAnimation(enemy) {
  enemy.angle = (enemy.angle || 0) + 0.05;
  enemy.pulseTime = (enemy.pulseTime || 0) + 0.1;
}

function drawAnimatedEnemy(enemy) {
  ctx.save();
  ctx.translate(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
  ctx.rotate(enemy.angle || 0);
  let scale = 1 + 0.1 * Math.sin(enemy.pulseTime || 0);
  ctx.scale(scale, scale);
  ctx.beginPath();
  const spikes = 5;
  const outerRadius = enemy.width/2;
  const innerRadius = outerRadius * 0.5;
  let rot = Math.PI / 2 * 3;
  let step = Math.PI / spikes;
  ctx.moveTo(0, -outerRadius);
  for (let i = 0; i < spikes; i++){
    let x = Math.cos(rot) * outerRadius;
    let y = Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;
    x = Math.cos(rot) * innerRadius;
    y = Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(0, -outerRadius);
  ctx.closePath();
  ctx.fillStyle = enemy.color || "#FF6600";
  ctx.fill();
  ctx.restore();
}

const spritePrimerBoss = new Image();
spritePrimerBoss.src = "./sprites/primer_boss.png"; 


function drawAnimatedBoss(boss) {
  ctx.save();
  ctx.translate(boss.x + boss.width / 2, boss.y + boss.height / 2);


  // Actualizar el frame de la animación cada ciertos ciclos
  boss.frameTimer++;
  if (boss.frameTimer >= boss.frameSpeed) {
    boss.frameIndex = (boss.frameIndex + 1) % boss.frameCount;  // Cambiar de frame
    boss.frameTimer = 0;  // Resetear el temporizador
  }


  // Calcular la posición del frame actual en el sprite sheet
  let spriteX = boss.frameIndex * boss.frameWidth;
  let spriteY = 0; // Asumimos que la animación está en la primera fila

  // Dibujar el frame actual del sprite
  ctx.drawImage(
    spritePrimerBoss,  // Imagen del sprite sheet
    spriteX, spriteY,  // Posición del frame en el sprite sheet
    boss.frameWidth, boss.frameHeight, // Tamaño del frame
    -boss.width / 2, -boss.height / 2, // Posición en pantalla
    boss.width, boss.height // Tamaño final del boss
  );

  ctx.restore();
}





function updateExplosions() {
  for (let i = explosions.length - 1; i >= 0; i--) {
    const exp = explosions[i];

    // Expansión más suave
    exp.radius += (exp.maxRadius - exp.radius) * 0.1;
    exp.alpha *= 0.95;

    exp.particles.forEach(p => {
      p.life -= 0.04;
      p.speed *= 0.98; 
      p.angle += (Math.random() - 0.5) * 0.1;
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

    // Destello inicial
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = `rgba(255, 255, 100, ${exp.alpha * 0.8})`;
    ctx.beginPath();
    ctx.arc(exp.x, exp.y, exp.radius * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    // Explosión principal
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
    ctx.fill();

    // Dibujar partículas
    exp.particles.forEach(p => {
      if (p.life > 0) {
        let r = 255;
        let g = Math.max(100, 255 * p.life);
        let b = 0;
        if (p.life < 0.5) { r = g = b = Math.random() * 50; } // Se vuelve humo

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.life})`;
        ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  });
}
