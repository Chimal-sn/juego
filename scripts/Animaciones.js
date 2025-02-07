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
  
  function updateBossAnimation(boss) {
    boss.angle = (boss.angle || 0) + 0.03;
    boss.pulseTime = (boss.pulseTime || 0) + 0.1;
    if (!boss.phaseTimer) boss.phaseTimer = 0;
    boss.phaseTimer++;
    if (boss.phaseTimer > 300 && !boss.minionsSpawned) {
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