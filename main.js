// Typing animation setup
const text = "✨ Happy diwali celebrations ✨";
const animatedText = document.getElementById('animatedText');
let charIndex = 0;

function typeText() {
  if (charIndex < text.length) {
    animatedText.textContent += text.charAt(charIndex);
    charIndex++;
    setTimeout(typeText, 150);
  } else {
    animatedText.style.borderRight = 'none';
  }
}

// Initialize audio with user interaction handling
const audioManager = new AudioManager();
let audioInitialized = false;

function initAudioWithUserInteraction() {
  if (!audioInitialized) {
    console.log('Initializing audio...');
    audioManager.init().then(() => {
      audioInitialized = true;
      console.log('Audio initialized successfully');
    }).catch(error => {
      console.error('Failed to initialize audio:', error);
    });
  }
}

// Add multiple event listeners for user interaction
['click', 'touchstart', 'keydown'].forEach(eventType => {
  document.addEventListener(eventType, initAudioWithUserInteraction, { once: true });
});

// Canvas setup
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Manage fireworks
let fireworks = [];

function createFirework() {
  const x = Math.random() * canvas.width;
  const y = canvas.height;
  fireworks.push(new Firework(x, y, audioManager));
}

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((firework, index) => {
    firework.update();
    firework.draw(ctx);
    
    if (firework.exploded && firework.particles.length === 0) {
      fireworks.splice(index, 1);
    }
  });

  if (Math.random() < 0.05) {
    createFirework();
  }

  requestAnimationFrame(animate);
}

// Rising particles effect
function createParticle() {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.left = Math.random() * 100 + 'vw';
  particle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
  document.querySelector('.particles').appendChild(particle);

  particle.addEventListener('animationend', () => {
    particle.remove();
  });
}

// Controls setup with improved error handling
const soundToggle = document.querySelector('.sound-toggle');
const volumeUp = document.querySelector('.volume-up');
const volumeDown = document.querySelector('.volume-down');

soundToggle.addEventListener('click', () => {
  const isEnabled = audioManager.toggleSound();
  soundToggle.textContent = `Sound: ${isEnabled ? 'ON 🔊' : 'OFF 🔈'}`;
  if (isEnabled && !audioInitialized) {
    initAudioWithUserInteraction();
  }
});

volumeUp.addEventListener('click', () => {
  audioManager.setVolume(Math.min(1, audioManager.volume + 0.1));
});

volumeDown.addEventListener('click', () => {
  audioManager.setVolume(Math.max(0, audioManager.volume - 0.1));
});

// Initialize
setTimeout(typeText, 500);
setInterval(createParticle, 100);
animate();

// Create initial fireworks
for (let i = 0; i < 5; i++) {
  createFirework();
}