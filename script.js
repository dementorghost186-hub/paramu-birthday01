// ============================================
// CONFIGURATION - EDIT THESE VALUES
// ============================================

// 1. CHANGE THIS DATE to your girlfriend's birthday
// Format: YYYY-MM-DDTHH:MM:SS+05:30 (for Indian Standard Time)
const TARGET_ISO = '2025-12-20T00:00:00+05:30';
const targetDate = new Date(TARGET_ISO);

// 2. CHANGE THESE CREDENTIALS to something special
// Default: username = "paramu", password = "1qaz2wsx@@"
// You can change these to something meaningful
const DEFAULT_CREDENTIALS = { 
  user: 'paramu', 
  pass: '1qaz2wsx@@' 
};

// 3. SPECIAL MESSAGE - This appears after unlocking
// You can modify this message as you like
const SECRET_MESSAGE = `Adiye Paramu, 💝

Many more happy returns of the day, dee thangapulla! ❤️
My prayer is that you'll be happy throughout your life...

This day is your special day — enjoy it to the fullest and be extremely happy, okay my silly one? 😄🎉
Since you came into my life, everything has become so much happier and newer! ✨

I'll always pray for your happiness... I'll be with you for life-long. 💕
Thank you... I love you dee pondati, I miss you dee...

I've been wanting to hug you tight and tell you all this... but I couldn't yet 😢❤️
Just a little more time... then everything will be alright, right? 😌💫

I love you sooo much dee... The love I have for you is so special, deee,
and it will always remain that way forever. 💝🔥✨

Again, many more happy birthday dee! 🎂💗
May everything you love come true... happy birthday dee thango! 💝

I love you dee.. 💖💖💖`;

// Storage keys
const BYPASS_KEY = 'birthday_surprise_bypass_v8';
const OPENED_KEY = 'birthday_surprise_opened_v8';

// ============================================
// ELEMENT REFERENCES
// ============================================
let loaderCard, countdownCard, finalCard, cakeButton;
let mainMessage, reopenBtn, saveBtn, shareBtn, floatingLayer;
let cornerBtn, loginModal, loginSubmit, loginCancel;
let loginUser, loginPass, loginFeedback, photoFallback, finalPhoto;
let particlesContainer, celebrationOverlay, cakeSparkles;

// ============================================
// DOM READY - INITIALIZE EVERYTHING
// ============================================
window.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  
  // Create particles background
  createParticles();
  
  // Show loader with progress animation
  simulateProgress();
  
  // After loader, show countdown
  setTimeout(() => {
    showCountdownScreen();
    startFloatingEffects();
    startSparkleEffects();
    checkInitialState();
  }, 2000);
  
  setupLoginSystem();
  setupEventListeners();
});

// ============================================
// INITIALIZATION FUNCTIONS
// ============================================

function initializeElements() {
  // Main screens
  loaderCard = document.getElementById('loaderCard');
  countdownCard = document.getElementById('countdownCard');
  finalCard = document.getElementById('finalCard');
  
  // Cake and interactions
  cakeButton = document.getElementById('cakeButton');
  cakeSparkles = document.getElementById('cakeSparkles');
  
  // Final screen elements
  mainMessage = document.getElementById('mainMessage');
  reopenBtn = document.getElementById('reopenBtn');
  saveBtn = document.getElementById('saveBtn');
  shareBtn = document.getElementById('shareBtn');
  floatingLayer = document.getElementById('floatingLayer');
  photoFallback = document.getElementById('photoFallback');
  finalPhoto = document.getElementById('finalPhoto');
  celebrationOverlay = document.getElementById('celebrationOverlay');
  
  // Login elements
  cornerBtn = document.getElementById('cornerBtn');
  loginModal = document.getElementById('loginModal');
  loginSubmit = document.getElementById('loginSubmit');
  loginCancel = document.getElementById('loginCancel');
  loginUser = document.getElementById('loginUser');
  loginPass = document.getElementById('loginPass');
  loginFeedback = document.getElementById('loginFeedback');
  
  // Particles container
  particlesContainer = document.getElementById('particles');
  
  // Check if photo exists
  checkPhotoExists();
}

function simulateProgress() {
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    progressFill.style.width = '100%';
  }
}

function createParticles() {
  if (!particlesContainer) return;
  
  // Clear existing particles
  particlesContainer.innerHTML = '';
  
  // Create 50 particles
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random size
    const size = 2 + Math.random() * 4;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random color
    const hue = 320 + Math.random() * 40;
    particle.style.backgroundColor = `hsl(${hue}, 100%, 70%)`;
    
    // Random animation
    const duration = 3000 + Math.random() * 7000;
    const delay = Math.random() * 5000;
    particle.style.animationDuration = duration + 'ms';
    particle.style.animationDelay = delay + 'ms';
    
    particlesContainer.appendChild(particle);
  }
}

function startSparkleEffects() {
  if (!cakeSparkles) return;
  
  const sparkles = cakeSparkles.querySelectorAll('.sparkle');
  sparkles.forEach(sparkle => {
    // Randomize sparkle appearance
    const delay = Math.random() * 3;
    sparkle.style.animationDelay = delay + 's';
    
    // Random color
    const hue = 320 + Math.random() * 40;
    sparkle.style.backgroundColor = `hsl(${hue}, 100%, 90%)`;
  });
}

function checkPhotoExists() {
  if (!finalPhoto) return;
  
  // Check if image loads successfully
  finalPhoto.onerror = () => {
    finalPhoto.classList.add('hidden');
    if (photoFallback) photoFallback.classList.remove('hidden');
  };
  
  // Preload image
  const img = new Image();
  img.src = finalPhoto.src;
  img.onload = () => {
    finalPhoto.classList.remove('hidden');
    if (photoFallback) photoFallback.classList.add('hidden');
  };
  img.onerror = () => {
    finalPhoto.classList.add('hidden');
    if (photoFallback) photoFallback.classList.remove('hidden');
  };
}

function showCountdownScreen() {
  if (loaderCard) loaderCard.classList.add('hidden');
  if (countdownCard) countdownCard.classList.remove('hidden');
  
  // Add entrance animation
  countdownCard.style.animation = 'cardAppear 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  
  // Start countdown timer
  updateCountdown();
  const countdownInterval = setInterval(() => {
    if (!updateCountdown()) {
      clearInterval(countdownInterval);
      onCountdownEnd();
    }
  }, 1000);
}

function checkInitialState() {
  const now = new Date();
  const opened = localStorage.getItem(OPENED_KEY);
  
  // If already opened and time has passed, show message
  if (opened && now >= targetDate) {
    showFinalMessage();
    return;
  }
  
  // If bypass is active on this device
  if (isBypassAllowedOnThisDevice()) {
    unlockCakeEarly();
  } else if (now >= targetDate) {
    // If time has passed but not opened yet
    onCountdownEnd();
  }
}

// ============================================
// COUNTDOWN FUNCTIONS
// ============================================

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;
  
  if (diff <= 0) {
    document.getElementById('days').textContent = '0';
    document.getElementById('hours').textContent = '0';
    document.getElementById('minutes').textContent = '0';
    document.getElementById('seconds').textContent = '0';
    return false;
  }
  
  // Calculate time units
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  // Update display
  document.getElementById('days').textContent = days.toString().padStart(2, '0');
  document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
  document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
  document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
  
  // Add pulse animation to seconds
  const secondsElement = document.getElementById('seconds');
  if (secondsElement) {
    secondsElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
      secondsElement.style.transform = 'scale(1)';
    }, 300);
  }
  
  return true;
}

function onCountdownEnd() {
  unlockCake();
  
  // Play a celebration sound
  playHeartSound();
  
  // Show celebration overlay
  if (celebrationOverlay) {
    celebrationOverlay.style.display = 'flex';
    setTimeout(() => {
      celebrationOverlay.style.display = 'none';
    }, 2000);
    
    // Play celebration sound
    const celebrationSound = document.getElementById('celebrationSound');
    if (celebrationSound) {
      celebrationSound.currentTime = 0;
      celebrationSound.play().catch(e => console.log('Celebration sound play failed:', e));
    }
  }
}

// ============================================
// CAKE FUNCTIONS
// ============================================

function lockCake() {
  if (!cakeButton) return;
  
  cakeButton.classList.add('locked');
  cakeButton.classList.remove('unlocked');
  cakeButton.setAttribute('title', 'Locked - Wait for your birthday!');
  cakeButton.style.cursor = 'not-allowed';
  
  // Remove any existing click listener
  const newButton = cakeButton.cloneNode(true);
  cakeButton.parentNode.replaceChild(newButton, cakeButton);
  cakeButton = newButton;
  
  // Update sparkles
  startSparkleEffects();
}

function unlockCake() {
  if (!cakeButton) return;
  
  cakeButton.classList.remove('locked');
  cakeButton.classList.add('unlocked');
  cakeButton.setAttribute('title', '🎂 Tap to open your surprise!');
  cakeButton.style.cursor = 'pointer';
  
  // Add click listener
  cakeButton.addEventListener('click', onCakeClick);
  
  // Enhanced celebration animation
  cakeButton.animate([
    { transform: 'scale(1) rotate(0deg)', filter: 'brightness(1)' },
    { transform: 'scale(1.2) rotate(5deg)', filter: 'brightness(1.5)' },
    { transform: 'scale(0.9) rotate(-5deg)', filter: 'brightness(1.2)' },
    { transform: 'scale(1.1) rotate(0deg)', filter: 'brightness(1.3)' },
    { transform: 'scale(1) rotate(0deg)', filter: 'brightness(1)' }
  ], {
    duration: 800,
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  });
}

function unlockCakeEarly() {
  if (!cakeButton) return;
  
  cakeButton.classList.remove('locked');
  cakeButton.classList.add('unlocked');
  cakeButton.setAttribute('title', '🎂 Tap to open your surprise! (Early Access)');
  cakeButton.style.cursor = 'pointer';
  
  // Add click listener
  cakeButton.addEventListener('click', onCakeClick);
  
  // Special early unlock animation
  cakeButton.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.3)' },
    { transform: 'scale(1)' }
  ], {
    duration: 1000,
    easing: 'ease-out'
  });
}

function onCakeClick() {
  const now = new Date();
  
  // Check if it's time or bypass is active
  if (now < targetDate && !isBypassAllowedOnThisDevice()) {
    // Enhanced "not yet" animation
    cakeButton.animate([
      { transform: 'translateY(0) rotate(0deg)' },
      { transform: 'translateY(-15px) rotate(-5deg)' },
      { transform: 'translateY(5px) rotate(5deg)' },
      { transform: 'translateY(0) rotate(0deg)' }
    ], {
      duration: 600,
      easing: 'ease-in-out'
    });
    
    // Calculate remaining time
    const diff = targetDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    
    // Show time remaining with better formatting
    const originalEmoji = cakeButton.querySelector('.cake-emoji').textContent;
    const timeText = days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    cakeButton.querySelector('.cake-emoji').textContent = `⏳ ${timeText}`;
    
    setTimeout(() => {
      if (cakeButton.querySelector('.cake-emoji')) {
        cakeButton.querySelector('.cake-emoji').textContent = originalEmoji;
      }
    }, 2500);
    
    return;
  }
  
  // Play enhanced sound
  playHeartSound();
  
  // Celebration animation
  cakeButton.animate([
    { transform: 'scale(1) rotate(0deg)', opacity: 1 },
    { transform: 'scale(1.5) rotate(15deg)', opacity: 0.9 },
    { transform: 'scale(0.3) rotate(-45deg)', opacity: 0 }
  ], {
    duration: 1000,
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  });
  
  // Show final message after animation
  setTimeout(() => {
    revealMessage();
  }, 800);
}

// ============================================
// MESSAGE FUNCTIONS
// ============================================

function revealMessage() {
  // Hide countdown, show final card
  if (countdownCard) countdownCard.classList.add('hidden');
  if (finalCard) finalCard.classList.remove('hidden');
  
  // Set the message
  if (mainMessage) {
    mainMessage.textContent = SECRET_MESSAGE;
    
    // Enhanced typewriter effect
    typewriterEffect(mainMessage, SECRET_MESSAGE);
  }
  
  // Mark as opened in localStorage
  try {
    localStorage.setItem(OPENED_KEY, '1');
  } catch (e) {
    console.log('LocalStorage not available');
  }
  
  // Create enhanced celebration confetti
  createConfetti();
  
  // Play background music softly
  playBackgroundMusic();
}

function showFinalMessage() {
  if (countdownCard) countdownCard.classList.add('hidden');
  if (finalCard) finalCard.classList.remove('hidden');
  
  if (mainMessage) {
    mainMessage.textContent = SECRET_MESSAGE;
  }
  
  // Remove cake click listener since already opened
  if (cakeButton) {
    const newButton = cakeButton.cloneNode(true);
    cakeButton.parentNode.replaceChild(newButton, cakeButton);
    cakeButton = newButton;
  }
  
  createConfetti();
  playBackgroundMusic();
}

function typewriterEffect(element, text, speed = 25) {
  let i = 0;
  element.textContent = '';
  element.style.opacity = '1';
  
  function type() {
    if (i < text.length) {
      // Add current character
      element.textContent += text.charAt(i);
      
      // Add cursor effect
      const cursor = document.createElement('span');
      cursor.className = 'type-cursor';
      cursor.textContent = '|';
      element.appendChild(cursor);
      
      // Remove cursor and add next character
      setTimeout(() => {
        if (element.lastChild && element.lastChild.className === 'type-cursor') {
          element.removeChild(element.lastChild);
        }
        i++;
        type();
      }, speed);
    } else {
      // Final cursor blink
      const cursor = document.createElement('span');
      cursor.className = 'type-cursor blink';
      cursor.textContent = '|';
      element.appendChild(cursor);
      
      // Remove cursor after blinking
      setTimeout(() => {
        if (element.lastChild && element.lastChild.className === 'type-cursor blink') {
          element.removeChild(element.lastChild);
        }
      }, 1000);
    }
  }
  
  type();
}

// ============================================
// LOGIN SYSTEM
// ============================================

function setupLoginSystem() {
  if (!cornerBtn || !loginModal) return;
  
  // Open login modal
  cornerBtn.addEventListener('click', () => {
    loginFeedback.textContent = '';
    if (loginUser) loginUser.value = '';
    if (loginPass) loginPass.value = '';
    loginModal.classList.remove('hidden');
    if (loginUser) loginUser.focus();
    
    // Add modal entrance effect
    loginModal.style.animation = 'modalAppear 0.4s ease-out';
  });
  
  // Close modal
  if (loginCancel) {
    loginCancel.addEventListener('click', () => {
      loginModal.classList.add('hidden');
    });
  }
  
  // Submit login
  if (loginSubmit) {
    loginSubmit.addEventListener('click', attemptLogin);
  }
  
  // Enter key in password field
  if (loginPass) {
    loginPass.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') attemptLogin();
    });
  }
}

function attemptLogin() {
  const username = loginUser ? loginUser.value.trim() : '';
  const password = loginPass ? loginPass.value.trim() : '';
  
  // Validate input
  if (!username || !password) {
    showLoginFeedback('Please enter both username and password', 'error');
    return;
  }
  
  // Check credentials
  if (username === DEFAULT_CREDENTIALS.user && password === DEFAULT_CREDENTIALS.pass) {
    // Successful login
    try {
      localStorage.setItem(BYPASS_KEY, '1');
    } catch (e) {
      console.log('LocalStorage not available');
    }
    
    showLoginFeedback('✅ Successfully unlocked! The surprise is now accessible!', 'success');
    
    // Button celebration
    loginSubmit.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.1)' },
      { transform: 'scale(1)' }
    ], {
      duration: 300,
      easing: 'ease-out'
    });
    
    // Close modal and unlock cake
    setTimeout(() => {
      loginModal.classList.add('hidden');
      
      const now = new Date();
      if (now >= targetDate) {
        revealMessage();
      } else {
        unlockCakeEarly();
        showLoginFeedback('🎂 Cake unlocked! You can open it now!', 'success');
      }
    }, 1200);
    
  } else {
    // Failed login
    showLoginFeedback('Incorrect username or password', 'error');
    
    // Enhanced shake animation
    loginModal.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-15px)' },
      { transform: 'translateX(15px)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(0)' }
    ], {
      duration: 400,
      easing: 'ease-in-out'
    });
  }
}

function showLoginFeedback(message, type) {
  if (!loginFeedback) return;
  
  loginFeedback.textContent = message;
  loginFeedback.style.color = type === 'success' ? '#2c7a44' : '#a33f6c';
  loginFeedback.style.fontWeight = '700';
  loginFeedback.style.background = type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(211, 47, 47, 0.1)';
  loginFeedback.style.borderRadius = '12px';
  loginFeedback.style.padding = '12px';
  loginFeedback.style.border = type === 'success' ? '1px solid #4caf50' : '1px solid #d32f2f';
}

function isBypassAllowedOnThisDevice() {
  try {
    return !!localStorage.getItem(BYPASS_KEY);
  } catch (e) {
    return false;
  }
}

// ============================================
// VISUAL EFFECTS
// ============================================

function startFloatingEffects() {
  if (!floatingLayer) return;
  
  const shapes = ['💖', '✨', '🌟', '💫', '❤️', '💝', '🥰', '💕', '💞', '💓', '💗', '💘'];
  
  // Create 25 floating shapes
  for (let i = 0; i < 25; i++) {
    const shape = document.createElement('div');
    shape.className = 'float-shape';
    shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    
    // Random position
    shape.style.left = (Math.random() * 100) + '%';
    shape.style.top = (Math.random() * 100) + '%';
    
    // Random size
    const size = 18 + Math.random() * 30;
    shape.style.fontSize = size + 'px';
    
    // Random color tint
    const hue = 330 + Math.random() * 30;
    shape.style.filter = `hue-rotate(${hue - 330}deg) drop-shadow(0 5px 10px rgba(0, 0, 0, 0.1))`;
    
    // Random opacity
    shape.style.opacity = (0.4 + Math.random() * 0.4).toString();
    
    floatingLayer.appendChild(shape);
    
    // Floating animation
    const duration = 5000 + Math.random() * 10000;
    const distanceX = (Math.random() - 0.5) * 40;
    const distanceY = 30 + Math.random() * 50;
    
    shape.animate([
      { 
        transform: 'translateY(0px) translateX(0px) rotate(0deg)',
        opacity: shape.style.opacity 
      },
      { 
        transform: `translateY(${distanceY}px) translateX(${distanceX}px) rotate(${180 + Math.random() * 180}deg)`,
        opacity: parseFloat(shape.style.opacity) * 0.7
      },
      { 
        transform: 'translateY(0px) translateX(0px) rotate(360deg)',
        opacity: shape.style.opacity
      }
    ], {
      duration: duration,
      iterations: Infinity,
      easing: 'ease-in-out'
    });
  }
}

function createConfetti() {
  if (!floatingLayer) return;
  
  const confettiShapes = ['💖', '✨', '🌟', '🎉', '🎊', '🥳', '🎂', '💝', '❤️', '💕', '💞', '💓'];
  
  // Create 80 pieces of confetti
  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'float-shape';
    confetti.textContent = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
    
    // Random starting position at top
    confetti.style.left = (Math.random() * 100) + '%';
    confetti.style.top = '-50px';
    confetti.style.fontSize = (16 + Math.random() * 24) + 'px';
    confetti.style.opacity = '0.9';
    confetti.style.zIndex = '9999';
    
    // Random color
    const hue = 320 + Math.random() * 40;
    confetti.style.filter = `hue-rotate(${hue - 320}deg) drop-shadow(0 5px 10px rgba(0, 0, 0, 0.2))`;
    
    floatingLayer.appendChild(confetti);
    
    // Enhanced falling animation
    const duration = 1500 + Math.random() * 2000;
    const endX = (Math.random() - 0.5) * 300;
    const rotation = 360 + Math.random() * 720;
    
    confetti.animate([
      { 
        transform: 'translateY(0px) rotate(0deg)',
        opacity: 1 
      },
      { 
        transform: `translateY(100vh) translateX(${endX}px) rotate(${rotation}deg)`,
        opacity: 0 
      }
    ], {
      duration: duration,
      easing: 'cubic-bezier(0.3, 0.7, 0.4, 1)'
    });
    
    // Remove after animation
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, duration);
  }
  
  // Additional burst effect
  setTimeout(() => {
    createConfettiBurst();
  }, 300);
}

function createConfettiBurst() {
  if (!floatingLayer) return;
  
  const burstShapes = ['✨', '🌟', '💫'];
  
  // Create burst from center
  for (let i = 0; i < 30; i++) {
    const burst = document.createElement('div');
    burst.className = 'float-shape';
    burst.textContent = burstShapes[Math.floor(Math.random() * burstShapes.length)];
    
    burst.style.left = '50%';
    burst.style.top = '50%';
    burst.style.fontSize = (20 + Math.random() * 30) + 'px';
    burst.style.opacity = '1';
    burst.style.zIndex = '9999';
    burst.style.transform = 'translate(-50%, -50%)';
    
    floatingLayer.appendChild(burst);
    
    // Burst animation
    const angle = (Math.PI * 2 * i) / 30;
    const distance = 100 + Math.random() * 200;
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;
    
    burst.animate([
      { 
        transform: 'translate(-50%, -50%) scale(1)',
        opacity: 1 
      },
      { 
        transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(0.3)`,
        opacity: 0 
      }
    ], {
      duration: 1200 + Math.random() * 800,
      easing: 'cubic-bezier(0.2, 0.8, 0.4, 1)'
    });
    
    // Remove after animation
    setTimeout(() => {
      if (burst.parentNode) {
        burst.parentNode.removeChild(burst);
      }
    }, 2000);
  }
}

function playHeartSound() {
  try {
    const heartSound = document.getElementById('heartSound');
    if (heartSound) {
      heartSound.currentTime = 0;
      heartSound.volume = 0.7;
      heartSound.play().catch(e => console.log('Audio play failed:', e));
    }
  } catch (e) {
    // Sound not critical, continue silently
  }
}

function playBackgroundMusic() {
  try {
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
      bgMusic.currentTime = 0;
      bgMusic.volume = 0.3;
      bgMusic.play().catch(e => console.log('Background music play failed:', e));
    }
  } catch (e) {
    // Music not critical, continue silently
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Reopen button - clear storage and restart
  if (reopenBtn) {
    reopenBtn.addEventListener('click', () => {
      try {
        localStorage.removeItem(OPENED_KEY);
      } catch (e) {
        console.log('LocalStorage not available');
      }
      
      // Hide final card, show countdown
      if (finalCard) finalCard.classList.add('hidden');
      if (countdownCard) {
        countdownCard.classList.remove('hidden');
        onCountdownEnd();
      }
      
      createConfetti();
    });
  }
  
  // Save message button
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      // Create a downloadable text file
      const blob = new Blob([SECRET_MESSAGE], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Special_Message_For_Paramu.txt';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Show enhanced confirmation
      const originalText = saveBtn.innerHTML;
      saveBtn.innerHTML = '<span class="btn-icon"><i class="fas fa-check"></i></span> Saved Successfully!';
      saveBtn.style.background = 'linear-gradient(135deg, #4caf50, #2e7d32)';
      
      setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.style.background = '';
      }, 2000);
      
      // Create celebration effect
      createConfettiBurst();
    });
  }
  
  // Share button
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      // Create share text
      const shareText = "Check out this beautiful birthday surprise made with love! 🎂💖";
      const shareUrl = window.location.href;
      
      // Use Web Share API if available
      if (navigator.share) {
        navigator.share({
          title: 'Birthday Surprise for Paramu',
          text: shareText,
          url: shareUrl,
        })
        .catch((error) => console.log('Sharing failed:', error));
      } else {
        // Fallback: copy to clipboard
        const textToCopy = `${shareText}\n\n${shareUrl}`;
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            const originalText = shareBtn.innerHTML;
            shareBtn.innerHTML = '<span class="btn-icon"><i class="fas fa-check"></i></span> Copied to Clipboard!';
            shareBtn.style.background = 'linear-gradient(135deg, #2196f3, #0d47a1)';
            
            setTimeout(() => {
              shareBtn.innerHTML = originalText;
              shareBtn.style.background = '';
            }, 2000);
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Share this URL: ' + shareUrl);
          });
      }
    });
  }
  
  // Close modal when clicking outside
  if (loginModal) {
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        loginModal.classList.add('hidden');
      }
    });
  }
  
  // Window resize - adjust layout if needed
  window.addEventListener('resize', () => {
    // Reset floating effects on resize
    if (floatingLayer) {
      while (floatingLayer.firstChild) {
        floatingLayer.removeChild(floatingLayer.firstChild);
      }
      startFloatingEffects();
    }
    
    // Recreate particles
    if (particlesContainer) {
      createParticles();
    }
  });
  
  // Add CSS for typewriter cursor
  const style = document.createElement('style');
  style.textContent = `
    .type-cursor {
      color: var(--accent);
      font-weight: bold;
      animation: blink 0.7s infinite;
    }
    
    .type-cursor.blink {
      animation: blink 1s infinite;
    }
    
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// INITIAL CHECK FOR PHOTO
// ============================================

// Check photo on load
window.addEventListener('load', checkPhotoExists);

// Add some initial celebration if it's past the target date
window.addEventListener('load', () => {
  const now = new Date();
  if (now >= targetDate) {
    setTimeout(() => {
      createConfettiBurst();
    }, 1000);
  }
});