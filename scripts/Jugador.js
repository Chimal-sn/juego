// Definiciones de constantes para las balas
const BULLET_SPEED = 5;
const BULLET_WIDTH = 10;
const BULLET_HEIGHT = 20;

// Clase para las balas
class Bullet {
  constructor(x, y, dx = 0, dy = -BULLET_SPEED) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.width = BULLET_WIDTH;
    this.height = BULLET_HEIGHT;
  }
  
  // Actualiza la posición de la bala
  update() {
    this.x += this.dx;
    this.y += this.dy;
  }
  
  // Dibuja la bala en el canvas
  draw(ctx) {
    ctx.fillStyle = "white"; // Puedes ajustar el color o hacerlo dinámico
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Cargar las imágenes para cada dirección
const spriteSheet = new Image();
spriteSheet.src = "./sprites/PosicionInicial_Jugador.png"; // Imagen cuando está quieto

const spriteRight = new Image();
spriteRight.src = "./sprites/Derecha_Jugador.png"; // Imagen cuando se mueve a la derecha

const spriteLeft = new Image();
spriteLeft.src = "./sprites/izquierda_Jugador.png"; // Imagen cuando se mueve a la izquierda

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);

  // Dibuja el sprite dependiendo de la dirección
  if (player.isMovingRight) {
      ctx.drawImage(spriteRight, -spriteRight.width / 2, -spriteRight.height / 2);
  } else if (player.isMovingLeft) {
      ctx.drawImage(spriteLeft, -spriteLeft.width / 2, -spriteLeft.height / 2);
  } else {
      // Si no se mueve, dibuja el sprite original
      ctx.drawImage(spriteSheet, -spriteSheet.width / 2, -spriteSheet.height / 2);
  }

  ctx.restore();
}



/*
function drawPlayer() {
  if (!spriteSheet.complete || spriteSheet.naturalWidth === 0) {
      console.warn("El sprite aún no ha cargado, no se dibuja.");
      return;
  }

  ctx.save();
  ctx.translate(player.x, player.y);

  // Dibuja la imagen centrada
  ctx.drawImage(spriteSheet, -player.width / 2, -player.height / 2, player.width, player.height);

  // Dibuja el escudo si está activo
  if (powerShieldActive) {
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 4;
      ctx.strokeRect(-player.width / 2 - 4, -player.height / 2 - 4, player.width + 8, player.height + 8);
  }

  ctx.restore();
}
*/


// Función para disparar balas
function fireBullet() {
  // Calcula la posición inicial de la bala (centrada en el jugador)
  const bulletX = player.x + player.width / 2 - BULLET_WIDTH / 2;
  const bulletY = player.y;
  
  // Si se activa el multishot, dispara tres balas con ligeras diferencias en la dirección
  if (powerMultishotActive) {
    bullets.push(new Bullet(bulletX, bulletY));      // Bala central
    bullets.push(new Bullet(bulletX, bulletY, -2));    // Bala inclinada a la izquierda
    bullets.push(new Bullet(bulletX, bulletY, 2));     // Bala inclinada a la derecha
  } else if (powerShootActive) {
    // Dispara una sola bala
    bullets.push(new Bullet(bulletX, bulletY));
  }
  
  // Reinicia y reproduce el sonido del disparo
  shootSound.currentTime = 0;
  shootSound.play();
}

// Función para activar la bomba
function activateBomb() {
  if (powerBombActive) {
    // Para cada enemigo, genera una explosión y suma puntos
    enemies.forEach(enemy => {
      spawnExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
      score += 20 * comboMultiplier;
    });
    
    // Elimina todos los enemigos
    enemies = [];
    powerBombActive = false;
    
    // En lugar de usar alert, muestra una notificación en pantalla
    showNotification("¡Bomba activada!");
  }
}

// Función de ejemplo para mostrar notificaciones en pantalla
function showNotification(message) {
  // Aquí podrías manipular el DOM o el canvas para mostrar mensajes en el juego.
  console.log(message); // Por ahora lo mostramos en la consola.
}
