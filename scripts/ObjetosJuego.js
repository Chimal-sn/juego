// gameObjects.js
function initGameVariables(level) {
  player = {
    x: canvas.width / 2,        // Centrado horizontalmente
    y: canvas.height - 80,      // Ajuste vertical
    width: 60,                  // Ancho del sprite
    height: 60,                 // Alto del sprite
    baseSpeed: 4 + upgradeData.speed,
    vx: 0,
    vy: 0,
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