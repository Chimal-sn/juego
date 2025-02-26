
function drawAnimatedEnemy(enemy) {
  ctx.save();
  ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);

  switch (enemy.type) {
    case "normal":
      drawBasicEnemy(enemy);
      break;
      
    case "shooter":
      drawShooterEnemy(enemy);
      break;

    case "teleport":
      drawTeleportEnemy(enemy);
      break;
  }

  ctx.restore();
}


const spriteBasicEnemy = new Image();
spriteBasicEnemy.src = "./sprites/Enemigos/Enemigo_basicoM.png";

const spriteBasicEnemyI = new Image();
spriteBasicEnemyI.src = "./sprites/Enemigos/Enemigo_basicoI.png";

function drawBasicEnemy(enemy) {
  ctx.save();

    
  

  enemy.frameTimer++;
  if(enemy.frameTimer >= enemy.frameSpeed){
    enemy.frameIndex = (enemy.frameIndex + 1) % enemy.frameCount;
    enemy.frameTimer = 0;
  }

  let spriteX = enemy.frameIndex * enemy.frameWidth;
  let spriteY = 0;

  if (enemy.start) {
    ctx.drawImage(
      spriteBasicEnemyI,
      spriteX, spriteY,
      enemy.frameWidth, enemy.frameHeight,
      -enemy.width / 2, -enemy.height / 2,
      enemy.width, enemy.height)
    }else{
    ctx.drawImage(
      spriteBasicEnemy,
      spriteX, spriteY,
      enemy.frameWidth, enemy.frameHeight,
      -enemy.width / 2, -enemy.height / 2,
      enemy.width, enemy.height
    );
  }
  ctx.restore();
}

function drawShooterEnemy(enemy) {
  ctx.fillStyle = enemy.color || "#FF3333";
  ctx.fillRect(-enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
  
  // Dibujar un "cañón" en la parte superior
  ctx.fillStyle = "#000";
  ctx.fillRect(-5, -enemy.height / 2 - 10, 10, 15);
}




const spriteTeleportEnemy = new Image();
spriteTeleportEnemy.src = "./sprites/Enemigos/TeleportEnemy.png";


function drawTeleportEnemy(enemy) {
  ctx.save();

  // Verifica si el portal está activado
  if (enemy.portal) {
    enemy.portal.drawPortal(ctx);  // Llama a drawPortal solo si el portal existe
  } 
  

  if (!enemy.istp) {
    enemy.frameTimer++;
    if (enemy.frameTimer >= enemy.frameSpeed) {
      enemy.frameIndex = (enemy.frameIndex + 1) % enemy.frameCount;  // Cambiar de frame
      enemy.frameTimer = 0;  // Resetear el temporizador
    }

    // Calcular la posición del frame actual en el sprite sheet
    let spriteX = enemy.frameIndex * enemy.frameWidth;
    let spriteY = 0; // Asumimos que la animación está en la primera fila

    // Dibujar el frame actual del sprite
    ctx.drawImage(
      spriteTeleportEnemy,  // Imagen del sprite sheet
      spriteX, spriteY,  // Posición del frame en el sprite sheet
      enemy.frameWidth, enemy.frameHeight, // Tamaño del frame
      -enemy.width / 2, -enemy.height / 2, // Posición en pantalla
      enemy.width, enemy.height // Tamaño final del boss
    );
  }else{
    
  }

  ctx.restore();
}







const spritePrimerBoss = new Image();
spritePrimerBoss.src = "./sprites/primer_boss.png"; 


function drawAnimatedBoss(boss) {
  ctx.save();
  ctx.translate(boss.x + boss.width / 2, boss.y + boss.height / 3);
  


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
