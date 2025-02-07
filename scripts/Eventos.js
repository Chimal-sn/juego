// gameRandomEvents.js
let randomEvents = {
    meteorShower: false,
    enemySwarm: false,
    timeWarp: false
  };
  
  function activateRandomEvent() {
    if (Math.random() < 0.008 && !boss) {
      const events = Object.keys(randomEvents);
      const selectedEvent = events[Math.floor(Math.random() * events.length)];
      randomEvents[selectedEvent] = true;
      setTimeout(() => { randomEvents[selectedEvent] = false; }, 5000);
    }
  }