
// Función para actualizar el movimiento del jugador
function updatePlayerMovement() {
    const accel = 0.5;
    const friction = 0.9;

    // Control de las teclas de movimiento
    if (keys["arrowleft"] || keys["a"]) {
        player.vx -= accel;
        player.isMovingLeft = true; // El jugador se mueve a la izquierda
        player.isMovingRight = false; // No se mueve a la derecha
    }
    if (keys["arrowright"] || keys["d"]) {
        player.vx += accel;
        player.isMovingRight = true; // El jugador se mueve a la derecha
        player.isMovingLeft = false; // No se mueve a la izquierda
    }

    // Si no se presiona ninguna tecla, el jugador no se está moviendo
    if (!keys["arrowleft"] && !keys["a"] && !keys["arrowright"] && !keys["d"]) {
        player.isMovingLeft = false;
        player.isMovingRight = false;
    }

    if (keys["arrowup"] || keys["w"]) { player.vy -= accel; }
    if (keys["arrowdown"] || keys["s"]) { player.vy += accel; }

    // Fricción y límites de velocidad
    player.vx *= friction;
    player.vy *= friction;

    let maxSpeed = player.baseSpeed;
    if (powerSpeedActive) maxSpeed = 8 + upgradeData.speed;
    if (player.vx > maxSpeed) player.vx = maxSpeed;
    if (player.vx < -maxSpeed) player.vx = -maxSpeed;
    if (player.vy > maxSpeed) player.vy = maxSpeed;
    if (player.vy < -maxSpeed) player.vy = -maxSpeed;

    player.x += player.vx;
    player.y += player.vy;

    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y > canvas.height - player.height) player.y = canvas.height - player.height;
}


  
  function updateEnemies() {
    if (!boss) {
      enemies = enemies.filter(enemy => enemy.y < canvas.height); // Filtrar enemigos fuera de la pantalla
      
      const maxEnemiesOnScreen = 5 //+ Math.floor(currentLevel * 1.5);
      
      if (Math.random() < 0.05 && enemies.length < maxEnemiesOnScreen) {
        spawnEnemy();
      }
      
      enemies.forEach(enemy => enemy.update());
    }
  }

  function spawnEnemy() {
    let enemyTypes = [NormalEnemy /* ShooterEnemy */, TeleportEnemy]; // Agregar más tipos aquí
    let enemyClass = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    let x = Math.random() * (canvas.width - 40);
    let y = 0;
    
    let enemy = new enemyClass(x, y);
    enemies.push(enemy);
  }
  

  
  function updateBullets() {
    bullets.forEach(bullet => {
      bullet.y -= (powerSlowActive ? 4 : 8);
      if (bullet.dx) { bullet.x += bullet.dx; }
    });
    bullets = bullets.filter(bullet => bullet.y + bullet.height > 0 && bullet.x >= 0 && bullet.x <= canvas.width);
  }
  
  function updateEnemyBullets() {
    enemyBullets.forEach(bullet => bullet.y += 6);
    enemyBullets = enemyBullets.filter(bullet => bullet.y < canvas.height);
  }
  
  function updatePowerUps() {
    powerUps.forEach(pw => { pw.y += 4; });
    powerUps = powerUps.filter(pw => pw.y < canvas.height);
    if (Math.random() < 0.005) {
      const types = ["shoot", "shield", "speed", "multishot", "bomb", "slow"];
      let type = types[Math.floor(Math.random()*types.length)];
      powerUps.push({ x: Math.random()*(canvas.width-30), y: 0, width: 30, height: 30, type });
    }
  }
  
  function updateBoss() {
    if (boss) {
        boss.patternTime += 0.05;
        // Ataque simple (una bala hacia el frente)
        boss.shootTimer--;
        if (boss.shootTimer <= 0) {
            enemyBullets.push({
                x: boss.x + boss.width / 2 - 5, // Centrar la bala
                y: boss.y + boss.height,
                width: 10,
                height: 20,
                vx: 0,  // No se mueve en X
                vy: 4   // Se mueve solo hacia abajo
            });
            boss.shootTimer = Math.floor(Math.random() * 100) + 50; // Tiempo entre disparos
        }
    }
  }

  

  function checkCollisionRect(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }
  
  function checkCollisions() {
    enemies.forEach((enemy, index) => {
      if (!enemy.istp && checkCollisionRect(player, enemy)) {  // Solo colisiona si istp es falso
          if (powerShieldActive) {
              spawnExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
              enemies.splice(index, 1);
              score += 10;
              comboMultiplier += 0.1;
          } else {
              player.lives--;
              spawnExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
              enemies.splice(index, 1);
              comboMultiplier = 1;
              if (player.lives <= 0) gameOver = true;
          }
      }
    });
  
    bullets.forEach((bullet, bIndex) => {
      enemies.forEach((enemy, eIndex) => {
        if (checkCollisionRect(bullet, enemy)) {
          enemy.health--;
          if (enemy.health <= 0) {
            spawnExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
            if (Math.random() < 0.3) {
              const types = ["shoot", "shield", "speed", "multishot", "bomb", "slow"];
              let type = types[Math.floor(Math.random()*types.length)];
              powerUps.push({ x: enemy.x, y: enemy.y, width: 30, height: 30, type });
            }
            enemies.splice(eIndex, 1);
            score += 20 * comboMultiplier;
            comboMultiplier += 0.1;
          } else {
            score += 5 * comboMultiplier;
          }
          bullets.splice(bIndex, 1);
          comboTimer = 120;
        }
      });
    });
  
    // Función para verificar colisión con balas del jefe
enemyBullets.forEach((bullet, index) => {
  if (checkCollisionRect(bullet, player)) {
    // Si el jugador tiene escudo, solo eliminar la bala
    if (powerShieldActive) {
      enemyBullets.splice(index, 1);  // Elimina la bala del jefe
      score += 5;
    } else {
      // Verificar si el jugador ya ha sido golpeado por una bala en este ciclo
      if (!bullet.Golpeado) {
        bullet.Golpeado = true;  // Marcar que el jugador ha sido golpeado por una bala
        player.lives--;  // Resta una vida solo si no ha sido golpeado aún
        console.log("Restando vida. Vidas después: ", player.lives);
      }
      
      enemyBullets.splice(index, 1);  // Elimina la bala del jefe
      comboMultiplier = 1;
      if (player.lives <= 0) {
        gameOver = true;
      }
    }
  }
});
    
  
    powerUps.forEach((pw, index) => {
      if (checkCollisionRect(player, pw)) {
        if (pw.type === "shoot") { powerShootActive = true; powerShootTimer = 600; }
        else if (pw.type === "shield") { powerShieldActive = true; powerShieldTimer = 600 + upgradeData.shield * 50; }
        else if (pw.type === "speed") { powerSpeedActive = true; powerSpeedTimer = 600; player.baseSpeed = 4 + upgradeData.speed + 20; }
        else if (pw.type === "multishot") { powerMultishotActive = true; powerMultishotTimer = 600; }
        else if (pw.type === "bomb") { powerBombActive = true; powerBombTimer = 600; }
        else if (pw.type === "slow") { powerSlowActive = true; powerSlowTimer = 600; }
        powerUps.splice(index, 1);
      }
    });
  
    if (boss) {
      bullets.forEach((bullet, bIndex) => {
        if (checkCollisionRect(bullet, boss)) {
          boss.health--;
          bullets.splice(bIndex, 1);
          if (boss.health <= 0) {
            spawnExplosion(boss.x + boss.width/2, boss.y + boss.height/2);
            boss = null;
            bossCooldownTimer = 300;
            score += 100 * comboMultiplier;
            setTimeout(() => { showUpgradeScreen(); }, 500);
          }
        }
      });
      if (checkCollisionRect(player, boss)) {
        if (!powerShieldActive) {
          player.lives--;
          if (player.lives <= 0) gameOver = true;
        }
      }
    }
  }
  
  function updatePowerUpEffects() {
    if (powerShootActive) { powerShootTimer--; if (powerShootTimer <= 0) powerShootActive = false; }
    if (powerShieldActive) { powerShieldTimer--; if (powerShieldTimer <= 0) powerShieldActive = false; }
    if (powerSpeedActive) { powerSpeedTimer--; if (powerSpeedTimer <= 0) { powerSpeedActive = false; player.baseSpeed = 4 + upgradeData.speed; } }
    if (powerMultishotActive) { powerMultishotTimer--; if (powerMultishotTimer <= 0) powerMultishotActive = false; }
    if (powerBombActive) { powerBombTimer--; if (powerBombTimer <= 0) powerBombActive = false; }
    if (powerSlowActive) { powerSlowTimer--; if (powerSlowTimer <= 0) powerSlowActive = false; }
    if (comboTimer > 0) { comboTimer--; } else { comboMultiplier = 1; }
  }


  function resetHitByBullet() {
    player.hitByBullet = false;  // Resetea el estado de la colisión para la siguiente actualización
  } 

  