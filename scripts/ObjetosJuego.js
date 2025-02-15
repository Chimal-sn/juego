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
    color: "red",
  };
    Enemy = null;
    enemies = [];
    bullets = [];
    enemyBullets = [];
    powerUps = [];
    boss = null;
    bossLevel = level;
    nextBossScore = 100000;
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
      startX: canvas.width / 2 - 50,
      startY: 50,
      x: canvas.width / 2 - 50,
      y: 50,
      width: 210,
      height: 192,
      health: 50 * bossLevel,
      speed: 2 + bossLevel * 0.5,
      shootTimer: 100,
      direction: 1,
      patternTime: 0,
      angle: 0,
      pulseTime: 0,
      phaseTimer: 0,
      minionsSpawned: false,
      // Inicialización de las propiedades de animación
      frameIndex: 0,        // Índice del frame actual
      frameTimer: 0,        // Temporizador para los frames
      frameSpeed: 10,       // Velocidad de cambio de frame (cuantos ciclos antes de cambiar)
      frameCount: 9,       // Total de frames en la animación
      frameWidth: 630,       // Ancho de un frame en el sprite
      frameHeight: 576       // Alto de un frame en el sprite
    };
  }

  class Enemy {
    constructor(x, y, width, height, speed, health, type, color) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.health = health;
      this.type = type;
      this.color = color;
      this.frameIndex = 0; // Índice del frame para animaciones
      this.frameTimer = 0; // Temporizador para los frames
      this.frameSpeed = 6; // Velocidad de cambio de frame (cuantos ciclos antes de cambiar)
      this.frameCount = 14; // Total de frames en la animación
      this.frameWidth = 320; // Ancho de un frame en el sprite
      this.frameHeight = 320; // Alto de un frame en el sprite
    }
    
    update() {
      this.y += this.speed; // Movimiento básico (puede ser sobrescrito)
    }
  }

  class NormalEnemy extends Enemy {
    constructor(x, y) {
      super(x, y, 40, 40, 3, 1, "normal", "#FF6600");
    }
  }

  
  class ShooterEnemy extends Enemy {
    constructor(x, y) {
      super(x, y, 40, 40, 2, 2, "shooter", "#FF3333");
      this.shootTimer = Math.floor(Math.random() * 100) + 50;
    }
  
    update() {
      super.update();
      this.shootTimer--;
      if (this.shootTimer <= 0) {
        enemyBullets.push({ x: this.x + this.width / 2 - 5, y: this.y + this.height, width: 10, height: 20 });
        this.shootTimer = Math.floor(Math.random() * 100) + 50;
      }
    }
  }




  class TeleportEnemy extends Enemy {
    constructor(x, y) {
      super(x, y, 60, 60, 3, 1, "teleport", "#8800FF");
      this.teleportTimer = Math.floor(Math.random() * 200) + 100;
    }
  
    update() {
      this.teleportTimer--;
      if (this.teleportTimer <= 0) {
        let offsetX = (Math.random() - 0.5) * 200; // Desplazamiento aleatorio en X (-100 a 100)
        let offsetY = (Math.random() - 0.5) * 200; // Desplazamiento aleatorio en Y (-100 a 100)

        // Nueva posición basada en la posición del jugador
        this.x = Math.max(0, Math.min(canvas.width - this.width, player.x + offsetX));
        this.y = Math.max(0, Math.min(canvas.height - this.height, player.y + offsetY));

        this.teleportTimer = Math.floor(Math.random() * 200) + 100; // Reiniciar temporizador
      }

    }
  }
  

