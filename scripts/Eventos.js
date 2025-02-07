let randomEvents = {
    meteorShower: { active: false, phase: 'inactive', intensity: 0 },
    gravityShift: { active: false, direction: 1 },
    timeDilation: { active: false, factor: 1 },
    powerSurge: { active: false, charge: 0 },
    enemyEvolution: { active: false, duration: 0 },
    solarFlare: { active: false, progress: 0 }
};

function activateRandomEvent(bossActive = false) {
    if (Math.random() < 0.008 && !bossActive) {
        const eventPool = [
            {
                name: 'meteorShower',
                weight: 3,
                duration: 8000
            },
            {
                name: 'gravityShift',
                weight: 2,
                duration: 10000
            },
            {
                name: 'timeDilation',
                weight: 2,
                duration: 7000
            },
            {
                name: 'powerSurge',
                weight: 1,
                duration: 5000
            },
            {
                name: 'enemyEvolution',
                weight: 2,
                duration: 6000
            },
            {
                name: 'solarFlare',
                weight: 1,
                duration: 4000
            }
        ];

        const totalWeight = eventPool.reduce((sum, e) => sum + e.weight, 0);
        let randomValue = Math.random() * totalWeight;

        for (const event of eventPool) {
            if (randomValue < event.weight) {
                if (!randomEvents[event.name].active) {
                    startEvent(event.name, event.duration);
                    break;
                }
            }
            randomValue -= event.weight;
        }
    }
}

function startEvent(eventName, duration) {
    randomEvents[eventName].active = true;
    randomEvents[eventName].startTime = Date.now();
    
    // Efectos iniciales
    switch(eventName) {
        case 'meteorShower':
            spawnMeteors(5);
            break;
            
        case 'gravityShift':
            randomEvents.gravityShift.direction = Math.random() < 0.5 ? -1 : 1;
            break;
            
        case 'timeDilation':
            gameSpeed = 0.5;
            break;
            
        case 'powerSurge':
            player.baseSpeed *= 1.5;
            break;
            
        case 'enemyEvolution':
            enemies.forEach(enemy => {
                enemy.speed *= 0.7;
                enemy.health++;
            });
            break;
            
        case 'solarFlare':
            canvas.style.filter = 'brightness(150%)';
            break;
    }

    // Temporizador para finalizar evento
    setTimeout(() => {
        endEvent(eventName);
    }, duration);
}

function endEvent(eventName) {
    randomEvents[eventName].active = false;
    
    // Resetear efectos
    switch(eventName) {
        case 'meteorShower':
            break;
            
        case 'gravityShift':
            break;
            
        case 'timeDilation':
            gameSpeed = 1;
            break;
            
        case 'powerSurge':
            player.baseSpeed /= 1.5;
            break;
            
        case 'enemyEvolution':
            enemies.forEach(enemy => {
                enemy.speed /= 0.7;
                if (enemy.health > 1) enemy.health--;
            });
            break;
            
        case 'solarFlare':
            canvas.style.filter = 'none';
            spawnRadialExplosion(canvas.width/2, canvas.height/2);
            break;
    }
}

// Sistema de actualización continua de eventos
function updateEvents() {
    // Meteor shower
    if (randomEvents.meteorShower.active) {
        const elapsed = Date.now() - randomEvents.meteorShower.startTime;
        const intensity = Math.min(1, elapsed / 2000);
        
        if (Math.random() < intensity * 0.1) {
            spawnMeteors(1 + Math.floor(intensity * 3));
        }
    }

    // Gravity shift
    if (randomEvents.gravityShift.active) {
        const gravityForce = 0.3 * randomEvents.gravityShift.direction;
        player.vy += gravityForce;
        enemies.forEach(enemy => enemy.vy += gravityForce * 0.5);
    }

    // Time dilation
    if (randomEvents.timeDilation.active) {
        const wave = Math.sin(Date.now() * 0.002);
        gameSpeed = 0.5 + wave * 0.2;
    }

    // Power surge
    if (randomEvents.powerSurge.active) {
        player.projectileCooldown = Math.max(5, player.projectileCooldown - 1);
        if (Math.random() < 0.1) {
            spawnRandomPowerUp();
        }
    }

    // Solar flare
    if (randomEvents.solarFlare.active) {
        const progress = (Date.now() - randomEvents.solarFlare.startTime) / 4000;
        const intensity = Math.min(1, progress * 2);
        canvas.style.filter = `brightness(${100 + intensity * 100}%)`;
        
        if (progress > 0.5) {
            enemies.forEach(enemy => {
                enemy.health--;
                enemy.vx += (Math.random() - 0.5) * 10;
                enemy.vy += (Math.random() - 0.5) * 10;
            });
        }
    }
}

function spawnMeteors(count) {
    for (let i = 0; i < count; i++) {
        const size = Math.random() * 30 + 20;
        meteors.push({
            x: Math.random() * canvas.width,
            y: -size,
            width: size,
            height: size,
            vx: (Math.random() - 0.5) * 3,
            vy: Math.random() * 2 + 3,
            damage: size * 0.5
        });
    }
}

function spawnRadialExplosion(x, y) {
    for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 / 20) * i;
        enemyBullets.push({
            x: x,
            y: y,
            width: 15,
            height: 15,
            vx: Math.cos(angle) * 8,
            vy: Math.sin(angle) * 8,
            lifespan: 60
        });
    }
}
