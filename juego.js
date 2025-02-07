
    
    /********************
     * VARIABLES GLOBALES
     ********************/
    /********************
     * VARIABLES GLOBALES
     ********************/
    let currentLevel = 1, maxLevel = 3;
    let gameStarted = false;
    let narrativeData = {
      1: { title: "Nivel 1: La Invasión Comienza", text: "Las fuerzas enemigas se aproximan. ¡Despega y defiéndete!" },
      2: { title: "Nivel 2: Contraataque Aéreo", text: "Nuevos enemigos y tácticas te retan. ¡Mejora y dispara!" },
      3: { title: "Nivel 3: Batalla Final", text: "El jefe supremo y sus secuaces te esperan. ¡Demuestra tu destreza!" }
    };
    // Upgrades y poderes
    let upgradeData = { speed: 0, fire: 0, shield: 0, life: 0, slow: 0 };
    let powerShootActive = false, powerShootTimer = 0;
    let powerShieldActive = false, powerShieldTimer = 0;
    let powerSpeedActive = false, powerSpeedTimer = 0;
    let powerMultishotActive = false, powerMultishotTimer = 0;
    let powerBombActive = false, powerBombTimer = 0;
    let powerSlowActive = false, powerSlowTimer = 0;
    // Combo multiplier (aumenta con aciertos consecutivos)
    let comboMultiplier = 1, comboTimer = 0;
    // Efecto de sacudida (screen shake)
    let shake = 0;
    
    // Variables de juego
    let player, enemies, bullets, enemyBullets, powerUps, boss;
    let bossLevel, nextBossScore, bossCooldownTimer;
    let score, paused, gameOver;
    
    // Para controles suaves (aceleración)
    const keys = {};
    
    // NUEVO: Variables para sistema de disparo cargado
    let chargeShotLevel = 0, MAX_CHARGE = 100; 
    
    /********************
     * AUDIO (Necesitas archivos de sonido)
     ********************/
    const shootSound = new Audio('shoot.mp3');
    const explosionSound = new Audio('explosion.mp3');
    const chargeSound = new Audio('charge.mp3'); // NUEVO: sonido de carga
    const bgMusic = new Audio('bgmusic.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    
    /********************
     * DOM & CANVAS
     ********************/
    const menuDiv = document.getElementById("menu");
    const narrativeDiv = document.getElementById("narrativeScreen");
    const narrativeTitle = document.getElementById("narrativeTitle");
    const narrativeText = document.getElementById("narrativeText");
    const instructionDiv = document.getElementById("instructionScreen");
    const upgradeDiv = document.getElementById("upgradeScreen");
    const levelCompleteDiv = document.getElementById("levelComplete");
    const gameContainer = document.getElementById("gameContainer");
    const pauseBtn = document.getElementById("pauseBtn");
    const statsDiv = document.getElementById("stats");
    const highscoreSpan = document.getElementById("highscore");
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    
    // Controles móviles
    const mobileControls = document.getElementById("mobileControls");
    const btnLeft = document.getElementById("btnLeft");
    const btnRight = document.getElementById("btnRight");
    const btnUp = document.getElementById("btnUp");
    const btnDown = document.getElementById("btnDown");
    const btnFire = document.getElementById("btnFire");
    const btnBomb = document.getElementById("btnBomb");
    const comboBar = document.getElementById("comboBar"); // NUEVO: Barra de combo
    /********************
     * FONDO CON PARALLAX (dos capas)
     ********************/
    const starCountBack = 100, starCountFront = 50;
    let starsBack = [], starsFront = [];
    function initStars() {
      starsBack = [];
      starsFront = [];
      for (let i = 0; i < starCountBack; i++) {
        starsBack.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1 + 0.5,
          speed: Math.random() * 0.3 + 0.1
        });
      }
      for (let i = 0; i < starCountFront; i++) {
        starsFront.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 0.7 + 0.3
        });
      }
    }
    function updateStars() {
      starsBack.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
      });
      starsFront.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
      });
    }
    function drawStars() {
      ctx.save();
      // Dibujar capa trasera
      ctx.fillStyle = "#333";
      starsBack.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      // Dibujar capa delantera
      ctx.fillStyle = "#fff";
      starsFront.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }
    initStars();
    
    /********************
     * EFECTOS: EXPLOSIONES Y SCREEN SHAKE
     ********************/
    let explosions = [];
    function spawnExplosion(x, y) {
      // NUEVO: Sistema de partículas en explosiones
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
        
        // NUEVO: Actualizar partículas
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
        // Explosión principal
        ctx.save();
        ctx.globalAlpha = exp.alpha;
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // NUEVO: Dibujar partículas
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
    
    /********************
     * INICIALIZACIÓN DEL JUEGO
     ********************/
    function initGameVariables(level) {
      // El jugador ahora se mueve suavemente con velocidad y aceleración
      player = {
        x: canvas.width/2 - 20,
        y: canvas.height - 70,
        width: 40,
        height: 40,
        baseSpeed: 4 + upgradeData.speed,
        vx: 0, vy: 0,
        lives: 3 + upgradeData.life,
        color: "red"
      };
      enemies = [];
      bullets = [];
      enemyBullets = [];
      powerUps = [];
      boss = null;
      bossLevel = level;
      nextBossScore = 1000;
      bossCooldownTimer = 0;
      powerShootActive = false; powerShootTimer = 0;
      powerShieldActive = false; powerShieldTimer = 0;
      powerSpeedActive = false; powerSpeedTimer = 0;
      powerMultishotActive = false; powerMultishotTimer = 0;
      powerBombActive = false; powerBombTimer = 0;
      powerSlowActive = false; powerSlowTimer = 0;
      comboMultiplier = 1; comboTimer = 0;
      score = 0;
      gameOver = false;
      paused = false;
      initStars();
      bgMusic.play();
    }
    
    /********************
     * MENÚ, NARRATIVA, INSTRUCCIONES Y MEJORAS
     ********************/
    function showNarrative(level) {
      currentLevel = level;
      narrativeTitle.innerText = narrativeData[level].title;
      narrativeText.innerText = narrativeData[level].text;
      menuDiv.style.display = "none";
      narrativeDiv.style.display = "flex";
    }
    function showInstructions() {
      menuDiv.style.display = "none";
      instructionDiv.style.display = "flex";
    }
    function returnToMenu() {
      gameStarted = false;
      menuDiv.style.display = "flex";
      narrativeDiv.style.display = "none";
      instructionDiv.style.display = "none";
      upgradeDiv.style.display = "none";
      gameContainer.style.display = "none";
      levelCompleteDiv.style.display = "none";
    }
    function startGame() {
      narrativeDiv.style.display = "none";
      instructionDiv.style.display = "none";
      gameContainer.style.display = "flex";
      levelCompleteDiv.style.display = "none";
      initGameVariables(currentLevel);
      gameStarted = true;
      updateGame();
    }
    function showUpgradeScreen() { upgradeDiv.style.display = "flex"; }
    function applyUpgrade(type) {
      if (type === "speed") { upgradeData.speed += 2; }
      else if (type === "fire") { upgradeData.fire += 1; }
      else if (type === "shield") { upgradeData.shield += 1; }
      else if (type === "life") { upgradeData.life += 1; }
      else if (type === "slow") { upgradeData.slow += 1; }
      alert("Mejora aplicada: " + type);
    }
    function continueGame() {
      upgradeDiv.style.display = "none";
      if (currentLevel < maxLevel) { currentLevel++; showNarrative(currentLevel); }
      else { alert("¡Felicidades! Has completado la campaña."); returnToMenu(); }
    }
    function shareScore() {
      let tweetText = encodeURIComponent("¡Acabo de conseguir " + score + " puntos en Osa Juego de Aviones 2 Mejorado! ¿Puedes superarlo?");
      let url = "https://twitter.com/intent/tweet?text=" + tweetText;
      window.open(url, "_blank");
    }
    
    /********************
     * CONTROLES: Teclado y Controles Táctiles
     ********************/
    document.addEventListener("keydown", (event) => { keys[event.key.toLowerCase()] = true; });
    document.addEventListener("keyup", (event) => { keys[event.key.toLowerCase()] = false; });
    pauseBtn.addEventListener("click", () => {
      paused = !paused;
      pauseBtn.innerText = paused ? "Reanudar" : "Pausar";
      if (!paused && gameStarted) updateGame();
    });
    // Controles móviles (si se detecta dispositivo táctil, se muestra el overlay)
    function initMobileControls() {
      if ('ontouchstart' in window || navigator.maxTouchPoints) {
        mobileControls.style.display = "block";
        btnLeft.addEventListener("touchstart", () => keys["arrowleft"] = true);
        btnLeft.addEventListener("touchend", () => keys["arrowleft"] = false);
        btnRight.addEventListener("touchstart", () => keys["arrowright"] = true);
        btnRight.addEventListener("touchend", () => keys["arrowright"] = false);
        btnUp.addEventListener("touchstart", () => keys["arrowup"] = true);
        btnUp.addEventListener("touchend", () => keys["arrowup"] = false);
        btnDown.addEventListener("touchstart", () => keys["arrowdown"] = true);
        btnDown.addEventListener("touchend", () => keys["arrowdown"] = false);
        btnFire.addEventListener("touchstart", () => fireBullet());
        btnBomb.addEventListener("touchstart", () => activateBomb());
      }
    }
    initMobileControls();
    
    /********************
     * DIBUJO Y ANIMACIONES
     ********************/
    function drawPlayer() {
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.fillStyle = player.color;
      ctx.beginPath();
      ctx.moveTo(player.width/2, 0);
      ctx.lineTo(0, player.height);
      ctx.lineTo(player.width, player.height);
      ctx.closePath();
      ctx.fill();
      if (powerShieldActive) {
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 4;
        ctx.strokeRect(-4, -4, player.width+8, player.height+8);
      }
      ctx.restore();
    }
    // Enemigos animados: rotación y efecto pulsante
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
    // Jefes animados con fases y posibilidad de invocar minions
    function updateBossAnimation(boss) {
      boss.angle = (boss.angle || 0) + 0.03;
      boss.pulseTime = (boss.pulseTime || 0) + 0.1;
      if (!boss.phaseTimer) boss.phaseTimer = 0;
      boss.phaseTimer++;
      if (boss.phaseTimer > 300 && !boss.minionsSpawned) {
        // Invoca minions (enemigos "dive" o kamikaze)
        for (let i = 0; i < 3; i++) {
          enemies.push({
            x: boss.x + Math.random()*boss.width - 20,
            y: boss.y + boss.height,
            width: 30, height: 30,
            health: 1,
            type: "dive",
            speed: 5,
            shootTimer: 0,
            angle: 0,
            pulseTime: 0,
            color: "#00FFAA"
          });
        }
        boss.minionsSpawned = true;
      }
      if (boss.phaseTimer > 600) { boss.phaseTimer = 0; boss.minionsSpawned = false; }
    }
    function drawAnimatedBoss(boss) {
      ctx.save();
      ctx.translate(boss.x + boss.width/2, boss.y + boss.height/2);
      ctx.rotate(boss.angle || 0);
      let scale = 1 + 0.05 * Math.sin(boss.pulseTime || 0);
      ctx.scale(scale, scale);
      ctx.beginPath();
      const sides = 8;
      const outerRadius = boss.width/2;
      const innerRadius = outerRadius * 0.7;
      let angle = Math.PI / 2;
      let step = Math.PI / sides;
      ctx.moveTo(outerRadius * Math.cos(angle), outerRadius * Math.sin(angle));
      for (let i = 0; i < sides; i++){
        angle += step;
        ctx.lineTo(innerRadius * Math.cos(angle), innerRadius * Math.sin(angle));
        angle += step;
        ctx.lineTo(outerRadius * Math.cos(angle), outerRadius * Math.sin(angle));
      }
      ctx.closePath();
      let grad = ctx.createLinearGradient(-boss.width/2, -boss.height/2, boss.width/2, boss.height/2);
      grad.addColorStop(0, "#800");
      grad.addColorStop(1, "#f00");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Boss Lv " + bossLevel + ": " + boss.health, 0, 5);
      ctx.restore();
    }
    
    /********************
     * ACTUALIZACIONES DEL JUEGO
     ********************/
    // Movimiento del jugador con aceleración y fricción
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
    
    // Actualización de enemigos según su tipo
    function updateEnemies() {
      if (!boss) {
        enemies.forEach(enemy => {
          if (enemy.type === "normal" || enemy.type === "shooter") {
            enemy.y += enemy.speed;
            if (enemy.type === "shooter") {
              enemy.shootTimer--;
              if (enemy.shootTimer <= 0) {
                enemyBullets.push({ x: enemy.x + enemy.width/2 - 5, y: enemy.y + enemy.height, width: 10, height: 20 });
                enemy.shootTimer = Math.floor(Math.random()*100)+50;
              }
            }
          } else if (enemy.type === "dive" || enemy.type === "kamikaze") {
            enemy.y += enemy.speed;
            enemy.x += Math.sin(enemy.y/20) * 4;
          }
        });
        enemies = enemies.filter(enemy => enemy.y < canvas.height);
        if (Math.random() < 0.05) {
          let rand = Math.random();
          let type = (rand < 0.45) ? "normal" : ((rand < 0.75) ? "shooter" : "dive");
          let health = (type === "normal" || type === "dive") ? 1 : 2;
          let speed = (type === "dive") ? 5 : (Math.random()*2 + 4);
          let shootTimer = (type === "shooter") ? Math.floor(Math.random()*100)+50 : 0;
          enemies.push({ 
            x: Math.random()*(canvas.width - 40), 
            y: 0, width: 40, height: 40, 
            health, type, speed, shootTimer,
            angle: 0, pulseTime: 0,
            color: (type==="dive") ? "#00FFAA" : "#FF6600"
          });
        }
      }
    }
    
    // Actualización de balas
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
    
    // Actualización de power-ups
    function updatePowerUps() {
      powerUps.forEach(pw => { pw.y += 4; });
      powerUps = powerUps.filter(pw => pw.y < canvas.height);
      if (Math.random() < 0.005) {
        const types = ["shoot", "shield", "speed", "multishot", "bomb", "slow"];
        let type = types[Math.floor(Math.random()*types.length)];
        powerUps.push({ x: Math.random()*(canvas.width-30), y: 0, width: 30, height: 30, type });
      }
    }
    
    // Actualización del jefe
    function updateBoss() {
      if (boss) {
        boss.patternTime += 0.05;
        let amplitudeX = 50 + bossLevel * 10;
        let amplitudeY = 30 + bossLevel * 5;
        boss.x = boss.startX + amplitudeX * Math.sin(boss.patternTime);
        boss.y = boss.startY + amplitudeY * Math.cos(boss.patternTime);
        boss.shootTimer--;
        if (boss.shootTimer <= 0) {
          enemyBullets.push({ x: boss.x + boss.width/2 - 5, y: boss.y + boss.height, width: 10, height: 20 });
          boss.shootTimer = Math.floor(Math.random()*100)+50;
        }
      }
    }
    
    // Detección de colisiones
    function checkCollisionRect(a, b) {
      return a.x < b.x + b.width &&
             a.x + a.width > b.x &&
             a.y < b.y + b.height &&
             a.y + a.height > b.y;
    }
    function checkCollisions() {
      // Jugador vs enemigos
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
      // Balas del jugador vs enemigos
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
            comboTimer = 120; // Reinicia el temporizador de combo
          }
        });
      });
      // Balas enemigas vs jugador
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
      // Jugador vs power-ups
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
      // Balas del jugador vs jefe
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
    
    // Actualiza efectos de poderes y temporizadores
    function updatePowerUpEffects() {
      if (powerShootActive) { powerShootTimer--; if (powerShootTimer <= 0) powerShootActive = false; }
      if (powerShieldActive) { powerShieldTimer--; if (powerShieldTimer <= 0) powerShieldActive = false; }
      if (powerSpeedActive) { powerSpeedTimer--; if (powerSpeedTimer <= 0) { powerSpeedActive = false; player.baseSpeed = 4 + upgradeData.speed; } }
      if (powerMultishotActive) { powerMultishotTimer--; if (powerMultishotTimer <= 0) powerMultishotActive = false; }
      if (powerBombActive) { powerBombTimer--; if (powerBombTimer <= 0) powerBombActive = false; }
      if (powerSlowActive) { powerSlowTimer--; if (powerSlowTimer <= 0) powerSlowActive = false; }
      if (comboTimer > 0) { comboTimer--; } else { comboMultiplier = 1; }
    }
    
    // Actualiza el HUD
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
    
    // Spawnea un jefe con comportamiento dinámico y fases
    function spawnBoss() {
      boss = {
        startX: canvas.width/2 - 50,
        startY: 50,
        x: canvas.width/2 - 50,
        y: 50,
        width: 100,
        height: 100,
        health: 50 * bossLevel,
        speed: 2 + bossLevel * 0.5,
        shootTimer: 100,
        direction: 1,
        patternTime: 0,
        angle: 0,
        pulseTime: 0,
        phaseTimer: 0,
        minionsSpawned: false
      };
    }
    
    /********************
     * FUNCIONES DE ACCIÓN: Disparo y Bomba
     ********************/
    function fireBullet() {
      if (powerShootActive || powerMultishotActive) {
        if (powerMultishotActive) {
          bullets.push({ x: player.x + player.width/2 - 5, y: player.y, width: 10, height: 20 });
          bullets.push({ x: player.x + player.width/2 - 5, y: player.y, width: 10, height: 20, dx: -2 });
          bullets.push({ x: player.x + player.width/2 - 5, y: player.y, width: 10, height: 20, dx: 2 });
        } else {
          bullets.push({ x: player.x + player.width/2 - 5, y: player.y, width: 10, height: 20 });
        }
        shootSound.currentTime = 0;
        shootSound.play();
      }
    }
    function activateBomb() {
      if (powerBombActive) {
        enemies.forEach(enemy => {
          spawnExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
          score += 20 * comboMultiplier;
        });
        enemies = [];
        powerBombActive = false;
        alert("¡Bomba activada!");
      }
    }
    
    /********************
     * BUCLE PRINCIPAL DEL JUEGO
     ********************/
    function updateGame() {
      if (gameOver) {
        alert("Game Over! Score: " + Math.floor(score));
        let high = localStorage.getItem("highscore") || 0;
        if (score > high) localStorage.setItem("highscore", Math.floor(score));
        returnToMenu();
        return;
      }
      if (paused) return;
      
      // Aplicar efecto de sacudida (screen shake)
      let shakeOffsetX = (shake > 0) ? Math.random() * shake - shake/2 : 0;
      let shakeOffsetY = (shake > 0) ? Math.random() * shake - shake/2 : 0;
      if (shake > 0) { shake -= 0.5; }
      
      ctx.save();
      ctx.translate(shakeOffsetX, shakeOffsetY);
      ctx.clearRect(-shakeOffsetX, -shakeOffsetY, canvas.width, canvas.height);
      drawStars();
      updateStars();
      
      // Actualiza movimiento del jugador
      updatePlayerMovement();
      
      // Actualiza y dibuja jefe si está activo
      if (boss) {
        updateBoss();
        updateBossAnimation(boss);
        drawAnimatedBoss(boss);
      } else {
        if (bossCooldownTimer > 0) { bossCooldownTimer--; }
        else if (score >= nextBossScore) { spawnBoss(); }
        updateEnemies();
        enemies.forEach(enemy => {
          updateEnemyAnimation(enemy);
          drawAnimatedEnemy(enemy);
        });
      }
      
      updateBullets();
      updateEnemyBullets();
      updatePowerUps();
      checkCollisions();
      updatePowerUpEffects();
      
      // Dibujar jugador
      drawPlayer();
      
      // Dibujar balas del jugador y enemigas
      bullets.forEach(bullet => {
        ctx.fillStyle = "blue";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });
      enemyBullets.forEach(bullet => {
        ctx.fillStyle = "purple";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });
      // Dibujar power-ups
      powerUps.forEach(pw => {
        if (pw.type === "shoot") ctx.fillStyle = "gold";
        else if (pw.type === "shield") ctx.fillStyle = "green";
        else if (pw.type === "speed") ctx.fillStyle = "blue";
        else if (pw.type === "multishot") ctx.fillStyle = "orange";
        else if (pw.type === "bomb") ctx.fillStyle = "magenta";
        else if (pw.type === "slow") ctx.fillStyle = "cyan";
        ctx.beginPath();
        ctx.arc(pw.x + pw.width/2, pw.y + pw.height/2, pw.width/2, 0, Math.PI*2);
        ctx.fill();
      });
      
      updateExplosions();
      drawExplosions();
      
      // Actualización del combo (se reinicia si no se encadenan disparos)
      if (comboTimer > 0) { /* sigue el combo */ } else { comboMultiplier = 1; }
      
      score += (powerSlowActive ? 0.5 : 1);
      updateScoreBoard();
      
      ctx.restore();
      requestAnimationFrame(updateGame);
    }
    // Agregar al inicio de variables globales
let randomEvents = {
    meteorShower: false,
    enemySwarm: false,
    timeWarp: false
  };
  
  // Función para activar eventos aleatorios
  function activateRandomEvent() {
    if (Math.random() < 0.008 && !boss) { // 0.8% de chance por frame
      const events = Object.keys(randomEvents);
      const selectedEvent = events[Math.floor(Math.random() * events.length)];
      randomEvents[selectedEvent] = true;
      setTimeout(() => { randomEvents[selectedEvent] = false; }, 5000); // Dura 5 segundos
    }
  }
  
  // En updateGame(), después de updateStars():
  activateRandomEvent();
    /********************
     * INICIAR JUEGO
     ********************/
    // Soporte para disparo con la barra
    document.addEventListener("keydown", (event) => {
      if (event.key === " " ) { fireBullet(); }
      if (event.key.toLowerCase() === "b") { activateBomb(); }
    });
    
    updateGame();
