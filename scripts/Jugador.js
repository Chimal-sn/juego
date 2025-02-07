// gamePlayer.js
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