// gameControls.js
document.addEventListener("keydown", (event) => { keys[event.key.toLowerCase()] = true; });
document.addEventListener("keyup", (event) => { keys[event.key.toLowerCase()] = false; });

pauseBtn.addEventListener("click", () => {
  paused = !paused;
  pauseBtn.innerText = paused ? "Reanudar" : "Pausar";
  if (!paused && gameStarted) updateGame();
});

function initMobileControls() {
  if ('ontouchstart' in window || navigator.maxTouchPoints) {
    mobileControls.style.display = "block";
    btnLeft.addEventListener("touchstart", () => keys["arrowleft"] = true);
    btnLeft.addEventListener("touchend", () => keys["arrowleft"] = false);
    btnRight.addEventListener("touchstart", () => keys["arrowright"] = true);
    btnRight.addEventListener("touchend", () => keys["arrowright"] = false);
    btnUp.addEventListener("touchstart", () => keys["arrowup"] = true);
    btnUp.addEventListener("touchend", () => keys["arrowup"] = false);
    btnDown.addEventListener("touchstart", () => keys["arrowdown"] = true);
    btnDown.addEventListener("touchend", () => keys["arrowdown"] = false);
    btnFire.addEventListener("touchstart", () => fireBullet());
    btnBomb.addEventListener("touchstart", () => activateBomb());
  }
}

initMobileControls();