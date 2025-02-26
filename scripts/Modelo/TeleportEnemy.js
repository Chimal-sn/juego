
class TeleportEnemy extends Enemy {
    constructor(x, y) {
        super(x, y, 60, 60, 3, 1, "teleport", "#8800FF", 6, 14, 320, 320);
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