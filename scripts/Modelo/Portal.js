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
  