// gameConfig.js
let currentLevel = 1, maxLevel = 3;
let gameStarted = false;
let narrativeData = {
  1: { title: "Nivel 1: La Invasión Comienza", text: "Las fuerzas enemigas se aproximan. ¡Despega y defiéndete!" },
  2: { title: "Nivel 2: Contraataque Aéreo", text: "Nuevos enemigos y tácticas te retan. ¡Mejora y dispara!" },
  3: { title: "Nivel 3: Batalla Final", text: "El jefe supremo y sus secuaces te esperan. ¡Demuestra tu destreza!" }
};

let upgradeData = { speed: 0, fire: 0, shield: 0, life: 0, slow: 0 };
let powerShootActive = false, powerShootTimer = 0;
let powerShieldActive = false, powerShieldTimer = 0;
let powerSpeedActive = false, powerSpeedTimer = 0;
let powerMultishotActive = false, powerMultishotTimer = 0;
let powerBombActive = false, powerBombTimer = 0;
let powerSlowActive = false, powerSlowTimer = 0;

let comboMultiplier = 1, comboTimer = 0;
let shake = 0;

let player, enemies, bullets, enemyBullets, powerUps, boss;
let bossLevel, nextBossScore, bossCooldownTimer;
let score, paused, gameOver;

const keys = {};

let chargeShotLevel = 0, MAX_CHARGE = 100;

const shootSound = new Audio('./audio/disparo_jugador.wav');
const explosionSound = new Audio('explosion.mp3');
const chargeSound = new Audio('charge.mp3');
const bgMusic = new Audio('bgmusic.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.3;

const menuDiv = document.getElementById("menu");
const narrativeDiv = document.getElementById("narrativeScreen");
const narrativeTitle = document.getElementById("narrativeTitle");
const narrativeText = document.getElementById("narrativeText");
const instructionDiv = document.getElementById("instructionScreen");
const upgradeDiv = document.getElementById("upgradeScreen");
const levelCompleteDiv = document.getElementById("levelComplete");
const gameContainer = document.getElementById("gameContainer");
const pauseBtn = document.getElementById("pauseBtn");
const statsDiv = document.getElementById("stats");
const highscoreSpan = document.getElementById("highscore");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const mobileControls = document.getElementById("mobileControls");
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");
const btnUp = document.getElementById("btnUp");
const btnDown = document.getElementById("btnDown");
const btnFire = document.getElementById("btnFire");
const btnBomb = document.getElementById("btnBomb");
const comboBar = document.getElementById("comboBar");