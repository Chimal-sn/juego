// gameUI.js
function showNarrative(level) {
    currentLevel = level;
    narrativeTitle.innerText = narrativeData[level].title;
    narrativeText.innerText = narrativeData[level].text;
    menuDiv.style.display = "none";
    narrativeDiv.style.display = "flex";
  }
  
  function showInstructions() {
    menuDiv.style.display = "none";
    instructionDiv.style.display = "flex";
  }
  
  function returnToMenu() {
    gameStarted = false;
    menuDiv.style.display = "flex";
    narrativeDiv.style.display = "none";
    instructionDiv.style.display = "none";
    upgradeDiv.style.display = "none";
    gameContainer.style.display = "none";
    levelCompleteDiv.style.display = "none";
  }
  
  function startGame() {
    narrativeDiv.style.display = "none";
    instructionDiv.style.display = "none";
    gameContainer.style.display = "flex";
    levelCompleteDiv.style.display = "none";
    initGameVariables(currentLevel);
    gameStarted = true;
    updateGame();
  }
  
  function showUpgradeScreen() { upgradeDiv.style.display = "flex"; }
  
  function applyUpgrade(type) {
    if (type === "speed") { upgradeData.speed += 2; }
    else if (type === "fire") { upgradeData.fire += 1; }
    else if (type === "shield") { upgradeData.shield += 1; }
    else if (type === "life") { upgradeData.life += 1; }
    else if (type === "slow") { upgradeData.slow += 1; }
    alert("Mejora aplicada: " + type);
  }
  
  function continueGame() {
    upgradeDiv.style.display = "none";
    if (currentLevel < maxLevel) { currentLevel++; showNarrative(currentLevel); }
    else { alert("¡Felicidades! Has completado la campaña."); returnToMenu(); }
  }
  
  function shareScore() {
    let tweetText = encodeURIComponent("¡Acabo de conseguir " + score + " puntos en Osa Juego de Aviones 2 Mejorado! ¿Puedes superarlo?");
    let url = "https://twitter.com/intent/tweet?text=" + tweetText;
    window.open(url, "_blank");
  }

  function updateScoreBoard() {
    const scoreBoard = document.getElementById("stats");
  
    // Construir el contenido del scoreboard
    let powerStatus = [];
    if (powerShootActive) powerStatus.push("Disparo (" + Math.ceil(powerShootTimer / 60) + "s)");
    if (powerShieldActive) powerStatus.push("Escudo (" + Math.ceil(powerShieldTimer / 60) + "s)");
    if (powerSpeedActive) powerStatus.push("Velocidad (" + Math.ceil(powerSpeedTimer / 60) + "s)");
    if (powerMultishotActive) powerStatus.push("Multishot (" + Math.ceil(powerMultishotTimer / 60) + "s)");
    if (powerBombActive) powerStatus.push("Bomba (" + Math.ceil(powerBombTimer / 60) + "s)");
    if (powerSlowActive) powerStatus.push("SlowMo (" + Math.ceil(powerSlowTimer / 60) + "s)");
  
    let bossStatus = boss
      ? "Lv " + bossLevel + " (" + boss.health + ")"
      : bossCooldownTimer > 0
      ? "En espera"
      : "Ninguno";
  
    // Actualizar el contenido del scoreboard
    scoreBoard.innerHTML = `
      <p><strong>Score:</strong> ${Math.floor(score)}</p>
      <p><strong>Vidas:</strong> ${player.lives}</p>
      <p><strong>Combo:</strong> x${comboMultiplier.toFixed(1)}</p>
      <p><strong>Poderes:</strong> ${powerStatus.length ? powerStatus.join(", ") : "Ninguno"}</p>
      <p><strong>Boss:</strong> ${bossStatus}</p>
      <p><strong>Mejor Score:</strong> ${localStorage.getItem("highscore") || 0}</p>
    `;
  }
  