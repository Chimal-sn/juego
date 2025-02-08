// gameLogic.js
function updatePlayerMovement() {
    const accel = 0.5;
    const friction = 0.9;
    if (keys["arrowleft"] || keys["a"]) { player.vx -= accel; }
    if (keys["arrowright"] || keys["d"]) { player.vx += accel; }
    if (keys["arrowup"] || keys["w"]) { player.vy -= accel; }
    if (keys["arrowdown"] || keys["s"]) { player.vy += accel; }
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
      // Filtrar enemigos fuera de la pantalla
      enemies = enemies.filter(enemy => enemy.y < canvas.height);
  
      // Límite máximo de enemigos en pantalla
      const maxEnemiesOnScreen = 5 + Math.floor(currentLevel * 1.5); // Aumenta con el nivel
  
      // Generar nuevos enemigos solo si no superamos el límite
      if (Math.random() < 0.05 && enemies.length < maxEnemiesOnScreen) {
        let rand = Math.random();
        let enemyTypes = ["normal", "shooter", "dive", "zigzag", "pursue", "teleport"];
        let type = enemyTypes[Math.floor(rand * enemyTypes.length)];
        let health = type === "shooter" || type === "pursue" ? 2 : 1;
        let speed = type === "dive" ? 5 : (Math.random() * 2 + 4 + currentLevel * 0.5);
        let shootTimer = type === "shooter" ? Math.floor(Math.random() * 100) + 50 : 0;
        let teleportTimer = type === "teleport" ? Math.floor(Math.random() * 200) + 100 : 0;
  
        enemies.push({
          x: Math.random() * (canvas.width - 40),
          y: 0,
          width: 40,
          height: 40,
          health,
          type,
          speed,
          shootTimer,
          teleportTimer,
          angle: 0,
          pulseTime: 0,
          vx: 0,
          vy: 0,
          color: type === "dive" ? "#00FFAA" : "#FF6600"
        });
      }
  
      // Actualizar comportamiento de los enemigos
      enemies.forEach(enemy => {
        switch (enemy.type) {
          case "normal":
            enemy.y += enemy.speed;
            break;
  
          case "shooter":
            enemy.y += enemy.speed;
            enemy.shootTimer--;
            if (enemy.shootTimer <= 0) {
              enemyBullets.push({ x: enemy.x + enemy.width / 2 - 5, y: enemy.y + enemy.height, width: 10, height: 20 });
              enemy.shootTimer = Math.floor(Math.random() * 100) + 50;
            }
            break;
  
          case "dive":
            enemy.y += enemy.speed;
            enemy.x += Math.sin(enemy.y / 20) * 4;
            break;
  
          case "zigzag":
            enemy.y += enemy.speed;
            enemy.x += Math.sin(enemy.y / 30) * 6;
            break;
  
          case "pursue":
            let angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
            enemy.vx = Math.cos(angle) * enemy.speed * 0.5;
            enemy.vy = Math.sin(angle) * enemy.speed * 0.5;
            enemy.x += enemy.vx;
            enemy.y += enemy.vy;
            break;
  
          case "teleport":
            enemy.teleportTimer--;
            if (enemy.teleportTimer <= 0) {
              enemy.x = Math.random() * (canvas.width - enemy.width);
              enemy.y = Math.random() * (canvas.height / 2);
              enemy.teleportTimer = Math.floor(Math.random() * 200) + 100;
            }
            break;
        }
      });
    }
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
  
      // Movimiento más complejo del jefe
      let amplitudeX = 50 + bossLevel * 10;
      let amplitudeY = 30 + bossLevel * 5;
      let waveFactor = Math.sin(boss.patternTime) * Math.cos(boss.patternTime * 2);
      boss.x = boss.startX + amplitudeX * waveFactor;
      boss.y = boss.startY + amplitudeY * Math.sin(boss.patternTime * 2);
  
      // Ataques en ráfagas
      boss.shootTimer--;
      if (boss.shootTimer <= 0) {
        let angleIncrement = Math.PI / 4; // Disparos en 8 direcciones
        for (let i = 0; i < 8; i++) {
          let angle = i * angleIncrement;
          enemyBullets.push({
            x: boss.x + boss.width / 2 - 5,
            y: boss.y + boss.height,
            width: 10,
            height: 20,
            vx: Math.cos(angle) * 4,
            vy: Math.sin(angle) * 4
          });
        }
        boss.shootTimer = Math.floor(Math.random() * 100) + 50;
      }
  
      // NUEVA FASE: Cuando la salud baja del 50%, el jefe cambia su comportamiento
      if (boss.health < boss.maxHealth * 0.5) {
        boss.speed *= 1.5; // Aumentar la velocidad del jefe
        boss.shootTimer = Math.floor(Math.random() * 50) + 30; // Disparos más frecuentes
  
        // Ataque especial: Invocar enemigos secundarios
        if (Math.random() < 0.01) {
          for (let i = 0; i < 3; i++) {
            enemies.push({
              x: boss.x + Math.random() * boss.width - 20,
              y: boss.y + boss.height,
              width: 30,
              height: 30,
              health: 1,
              type: "dive",
              speed: 5,
              shootTimer: 0,
              angle: 0,
              pulseTime: 0,
              color: "#00FFAA"
            });
          }
        }
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
      if (checkCollisionRect(player, enemy)) {
        if (powerShieldActive) {
          spawnExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
          enemies.splice(index, 1);
          score += 10;
          comboMultiplier += 0.1;
        } else {
          player.lives--;
          spawnExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
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
  
    enemyBullets.forEach((bullet, index) => {
      if (checkCollisionRect(bullet, player)) {
        if (powerShieldActive) {
          enemyBullets.splice(index, 1);
          score += 5;
        } else {
          player.lives--;
          enemyBullets.splice(index, 1);
          comboMultiplier = 1;
          if (player.lives <= 0) gameOver = true;
        }
      }
    });
  
    powerUps.forEach((pw, index) => {
      if (checkCollisionRect(player, pw)) {
        if (pw.type === "shoot") { powerShootActive = true; powerShootTimer = 600; }
        else if (pw.type === "shield") { powerShieldActive = true; powerShieldTimer = 600 + upgradeData.shield * 50; }
        else if (pw.type === "speed") { powerSpeedActive = true; powerSpeedTimer = 600; player.baseSpeed = 4 + upgradeData.speed + 2; }
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
  
  function updateScoreBoard() {
    let powerStatus = [];
    if (powerShootActive) powerStatus.push("Disparo (" + Math.ceil(powerShootTimer/60) + "s)");
    if (powerShieldActive) powerStatus.push("Escudo (" + Math.ceil(powerShieldTimer/60) + "s)");
    if (powerSpeedActive) powerStatus.push("Velocidad (" + Math.ceil(powerSpeedTimer/60) + "s)");
    if (powerMultishotActive) powerStatus.push("Multishot (" + Math.ceil(powerMultishotTimer/60) + "s)");
    if (powerBombActive) powerStatus.push("Bomba (" + Math.ceil(powerBombTimer/60) + "s)");
    if (powerSlowActive) powerStatus.push("SlowMo (" + Math.ceil(powerSlowTimer/60) + "s)");
    let bossStatus = boss ? "Lv " + bossLevel + " (" + boss.health + ")" : (bossCooldownTimer > 0 ? "En espera" : "Ninguno");
    statsDiv.innerHTML = `Score: ${Math.floor(score)}<br>Vidas: ${player.lives}<br>Combo: x${comboMultiplier.toFixed(1)}<br>Poderes: ${powerStatus.length ? powerStatus.join(", ") : "Ninguno"}<br>Boss: ${bossStatus}<br>Mejor Score: ${localStorage.getItem("highscore") || 0}`;
  }