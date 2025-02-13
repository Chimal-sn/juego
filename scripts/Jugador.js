// Definiciones de constantes para las balas
const BULLET_SPEED = 5;
const BULLET_WIDTH = 25;
const BULLET_HEIGHT = 25;

const spriteDisparo_jugador = new Image();
spriteDisparo_jugador.src = "./sprites/Disparo_Jugador.png"; // Imagen cuando está quieto



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
    if (spriteDisparo_jugador.complete) { 
      ctx.drawImage(spriteDisparo_jugador, this.x, this.y, this.width, this.height);
    } else {
      // Si la imagen no ha cargado aún, usar un placeholder
      ctx.fillStyle = "red"; // Un color llamativo para debugging
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}


const spriteEscudo = new Image();
spriteEscudo.src = "./sprites/escudo.png"; // Imagen del escudo
// Cargar las imágenes para cada dirección
const spriteSheet = new Image();
spriteSheet.src = "./sprites/PosicionInicial_Jugador.png"; // Imagen cuando está quieto

const spriteRight = new Image();
spriteRight.src = "./sprites/Derecha_Jugador.png"; // Imagen cuando se mueve a la derecha

const spriteLeft = new Image();
spriteLeft.src = "./sprites/izquierda_Jugador.png"; // Imagen cuando se mueve a la izquierda

// Función para dibujar al jugador
function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);

  // Dibuja el sprite dependiendo de la dirección y ajusta su tamaño
  if (player.isMovingRight) {
      ctx.drawImage(spriteRight, -player.width / 2, -player.height / 2, player.width, player.height);
  } else if (player.isMovingLeft) {
      ctx.drawImage(spriteLeft, -player.width / 2, -player.height / 2, player.width, player.height);
  } else {
      ctx.drawImage(spriteSheet, -player.width / 2, -player.height / 2, player.width, player.height);
  }

  // Dibuja el escudo si está activo
  if (powerShieldActive) {
    if (powerShieldTimer <= 5 * 30) {
      if (Math.floor(powerShieldTimer / 10) % 2 === 0) { // Parpadeo alternando cada 10 frames
        ctx.drawImage(spriteEscudo, -player.width / 2, -player.height / 2, player.width, player.height);
      }
    } else {
      ctx.drawImage(spriteEscudo, -player.width / 2, -player.height / 2, player.width, player.height);
    }
  }
  
  ctx.restore();
}






// Función para disparar balas
function fireBullet() {
  // Calcula la posición inicial de la bala centrada en el jugador
  const bulletX = player.x - BULLET_WIDTH / 2;  // Centra la bala en X
  const bulletY = player.y - player.height / 2; // Sale desde la parte superior del jugador

  // Si se activa el multishot, dispara tres balas con ligeras diferencias en la dirección
  if (powerMultishotActive) {
    bullets.push(new Bullet(bulletX, bulletY));      // Bala central
    bullets.push(new Bullet(bulletX - 10, bulletY, -2)); // Bala inclinada a la izquierda
    bullets.push(new Bullet(bulletX + 10, bulletY, 2));  // Bala inclinada a la derecha
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







