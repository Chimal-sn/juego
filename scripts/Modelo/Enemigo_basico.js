class NormalEnemy extends Enemy {
    constructor(x, y) {
      super(x, y, 60, 60, 3, 1, "normal", "#FF6600",3.5,11,384,384 );
      this.start = true;
      this.timestart = 35;

    }


    update(){
      this.timestart--;

      if (this.timestart == 0) {
        this.start = false;
        this.frameSpeed = 6;
        this.frameCount = 33;
      }
      
      this.y += this.speed;


    }
}