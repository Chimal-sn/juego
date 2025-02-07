// gameMain.js
function updateGame() {
    if (gameOver) {
      alert("Game Over! Score: " + Math.floor(score));
      let high = localStorage.getItem("highscore") || 0;
      if (score > high) localStorage.setItem("highscore", Math.floor(score));
      returnToMenu();
      return;
    }
    if (paused) return;
    
    let shakeOffsetX = (shake > 0) ? Math.random() * shake - shake/2 : 0;
    let shakeOffsetY = (shake > 0) ? Math.random() * shake - shake/2 : 0;
    if (shake > 0) { shake -= 0.5; }
    
    ctx.save();
    ctx.translate(shakeOffsetX, shakeOffsetY);
    ctx.clearRect(-shakeOffsetX, -shakeOffsetY, canvas.width, canvas.height);
    drawStars();
    updateStars();
    
    updatePlayerMovement();
    
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
    
    drawPlayer();
    
    bullets.forEach(bullet => {
      ctx.fillStyle = "blue";
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
    enemyBullets.forEach(bullet => {
      ctx.fillStyle = "purple";
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
    
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
    
    if (comboTimer > 0) { /* sigue el combo */ } else { comboMultiplier = 1; }
    
    score += (powerSlowActive ? 0.5 : 1);
    updateScoreBoard();
    
    ctx.restore();
    requestAnimationFrame(updateGame);
  }
  
  document.addEventListener("keydown", (event) => {
    if (event.key === " " ) { fireBullet(); }
    if (event.key.toLowerCase() === "b") { activateBomb(); }
  });
  
  updateGame();