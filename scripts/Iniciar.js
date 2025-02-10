// gameStars.js
const starCountBack = 100, starCountFront = 50;
let starsBack = [], starsFront = [];

/*

function resizeCanvas() {
  const canvas = document.getElementById("gameCanvas");
  canvas.width = window.innerWidth * 0.5;  // 90% del ancho de la ventana
  canvas.height = window.innerHeight * 1; // 90% del alto de la ventana
}

*/
function initStars() {
  starsBack = [];
  starsFront = [];
  for (let i = 0; i < starCountBack; i++) {
    starsBack.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1 + 0.5,
      speed: Math.random() * 0.3 + 0.1
    });
  }
  for (let i = 0; i < starCountFront; i++) {
    starsFront.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.7 + 0.3
    });
  }
}

function updateStars() {
  starsBack.forEach(star => {
    star.y += star.speed;
    if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
  });
  starsFront.forEach(star => {
    star.y += star.speed;
    if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
  });
}

function drawStars() {
  ctx.save();
  ctx.fillStyle = "#333";
  starsBack.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#fff";
  starsFront.forEach(star => {
    if (Math.random() < 0.95) { // Parpadeo aleatorio
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.restore();
}

initStars();