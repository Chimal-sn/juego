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
        this.teleportTimer = Math.floor(Math.random() * 200) + 200;
        this.portal = null; // Mantén el portal como parte del enemigo
        this.istp = false;
        this.timetp = ((this.teleportTimer) + (22 * 3));
        this.reversa = -1;
          
    }

    update() {
        this.teleportTimer--;
        this.timetp--;
        this.reversa--;

        // Activar el portal antes del teletransporte
        if (!this.portal && this.teleportTimer == ((22 * 3)* 2)) {
          this.portal = new Portal(0, 0)
        }
        
        if (this.teleportTimer == (22 * 3)-1) {
          this.istp = true;
          if (this.portal) {
            this.portal.reversa = true;
            
          }
        }
        

        if (this.teleportTimer == 0) {

            // Teletransportar al enemigo
            this.portal = null;

              
            let NuevaPosicionx = Math.max(0, Math.min(canvas.width - this.width, player.x ));
            let NuevaPosiciony = Math.max(0, Math.min(canvas.height - this.height, player.y ));

            this.x = NuevaPosicionx;
            this.y = NuevaPosiciony;
            this.portal = new Portal(0,0)
        }

        if (this.timetp == 0) {
            // Reiniciar el temporizador de teletransporte
          console.log("Teleportado",this.x, this.y);
          this.teleportTimer = Math.floor(Math.random() * 200) + 200;
          this.timetp = this.teleportTimer + (22 * 3);
          this.portal.reversa = true;
          this.istp = false;
          this.reversa = (22 * 3) - 4;
        }

        if (this.reversa == 0) {
          this.portal = null;
        }


    }
  }     



  class Portal {
    constructor(x, y, frameSpeed = 3) {
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.sprite = new Image();
        this.sprite.onload = () => { this.loaded = true; }; // Asegura que la imagen se haya cargado
        this.sprite.src = "./sprites/Enemigos/Portal.png";
  
        this.frameIndex = 0;
        this.frameTimer = 0;
        this.frameSpeed = frameSpeed;
        this.totalFrames = 22;
        this.frameWidth = 320;
        this.frameHeight = 320;
        this.active = true;
        this.loaded = false;
        this.reversa = false;
      
    }
  
    drawPortal(ctx) {
        if (!this.active || !this.loaded) return; // Esperar a que la imagen esté lista



      if (!this.reversa){
        this.frameTimer++;
        if (this.frameTimer >= this.frameSpeed) {
            this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
            this.frameTimer = 0;
        }
      }else{
        // Mismo delay en reversa
        this.frameTimer++;
        if (this.frameTimer >= this.frameSpeed) {
          this.frameIndex = (this.frameIndex - 1 + this.totalFrames) % this.totalFrames;
          this.frameTimer = 0;
        }
      }

      let spriteX = this.frameIndex * this.frameWidth;
      let spriteY = 0;
      
      ctx.drawImage(
        this.sprite,  
        spriteX, spriteY,
        this.frameWidth, this.frameHeight,
        this.x - this.width / 2, this.y - this.height / 2,  // Con this.x = 0, this.y = 0, se dibuja en (-width/2, -height/2)
        this.width, this.height
      );
      
    }
  }
  


  

