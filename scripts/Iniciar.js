const SpriteFondo = new Image();
SpriteFondo.src = "./sprites/Fondo/fondo.png";



const Spriteplaneta1 = new Image();
Spriteplaneta1.src =  "./sprites/Fondo/planeta1.png";


const Spriteplaneta2 = new Image();
Spriteplaneta2.src = "./sprites/Fondo/planeta2.png";


function PonerFondo() {
  // Dibuja la imagen en la posición (0,0) con 700 de ancho y 400 de alto
  ctx.drawImage(
    Spriteplaneta1,  // Imagen fuente
    0, 0,         // Coordenadas de inicio en la imagen fuente (sx, sy)
    1080, 1200,     // Tamaño de la región en la imagen fuente (sWidth, sHeight)
    0, 100,         // Coordenadas de destino en el canvas (dx, dy)
    180 * (1.6), // Ancho al que queremos escalar en el canvas (dWidth)
    200 * (1.6)// Alto al que queremos escalar en el canvas (dHeight)
  );


  ctx.drawImage(
    Spriteplaneta2,  // Imagen fuente
    0, 0,         // Coordenadas de inicio en la imagen fuente (
    1120, 960,
    950, 380,
    70 * (3),
    60 * (3)
  )
}


function updateEstrellas() {
  estrellas = estrellas.filter(Estrella => Estrella.y < canvas.height);

  const EstrellasEnPantalla = 400;

  if (estrellas.length < EstrellasEnPantalla){
    spawnEstrella();
  }

  estrellas.forEach(Estrella => Estrella.update());
  estrellas.forEach(Estrella => Estrella.draw(ctx));

}

function spawnEstrella() {
  let x = Math.random() * canvas.width;
  let y = 0;  // Las estrellas empiezan desde la parte superior

  // Asignamos una velocidad aleatoria y un tamaño aleatorio
  let speed = Math.random() * 0.5 + 0.1;  // Velocidad entre 0.1 y 0.6
  let size = Math.random() * 10 ;       // Tamaño entre 1 y 3 píxeles
  
  let estrella = new Estrella(x, y, speed, size);
  estrellas.push(estrella);
}






