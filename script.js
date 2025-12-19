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
const SECRET_MESSAGE = `adiye Paramu, 💝

Many more happy returns of the day, dee thangapulla! ❤️
My prayer is that you'll be happy throughout your life... 

This day is your special day — enjoy it to the fullest and be extremely happy, okay my silly one? 😄🎉
Since you came into my life, everything has become so much happier and newer! ✨

I'll always pray for your happiness... I'll be with you for life-long. 💕
Thank you... I love you dee pondati, I miss you dee ...

I've been wanting to hug you tight and tell you all this... but I couldn't yet 😢❤️
Just a little more time... , then everything will be alright, right? 😌💫

I love you sooo much dee... The love I have for you is so special, deee, 
and it will always remain that way forever. 💝🔥✨

Again, many more happy birthday dee! 🎂💗
May everything you love come true... happy birthday dee thango! 💝

I love you dee .. 💖💖💖`;

// Storage keys
const BYPASS_KEY = 'birthday_surprise_bypass_v7';
const OPENED_KEY = 'birthday_surprise_opened_v7';

// ============================================
// ELEMENT REFERENCES
// ============================================
let loaderCard, countdownCard, finalCard, cakeButton;
let mainMessage, reopenBtn, saveBtn, floatingLayer;
let cornerBtn, loginModal, loginSubmit, loginCancel;
let loginUser, loginPass, loginFeedback, photoFallback, finalPhoto;

// ============================================
// DOM READY - INITIALIZE EVERYTHING
// ============================================
window.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  
  // Show loader for 1.5 seconds, then show countdown
  setTimeout(() => {
    showCountdownScreen();
    startFloatingEffects();
    checkInitialState();
  }, 1500);
  
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
  
  // Final screen elements
  mainMessage = document.getElementById('mainMessage');
  reopenBtn = document.getElementById('reopenBtn');
  saveBtn = document.getElementById('saveBtn');
  floatingLayer = document.getElementById('floatingLayer');
  photoFallback = document.getElementById('photoFallback');
  finalPhoto = document.getElementById('finalPhoto');
  
  // Login elements
  cornerBtn = document.getElementById('cornerBtn');
  loginModal = document.getElementById('loginModal');
  loginSubmit = document.getElementById('loginSubmit');
  loginCancel = document.getElementById('loginCancel');
  loginUser = document.getElementById('loginUser');
  loginPass = document.getElementById('loginPass');
  loginFeedback = document.getElementById('loginFeedback');
  
  // Check if photo exists
  checkPhotoExists();
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
  
  return true;
}

function onCountdownEnd() {
  unlockCake();
  
  // Play a celebration sound if available
  playHeartSound();
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
}

function unlockCake() {
  if (!cakeButton) return;
  
  cakeButton.classList.remove('locked');
  cakeButton.classList.add('unlocked');
  cakeButton.setAttribute('title', '🎂 Tap to open your surprise!');
  cakeButton.style.cursor = 'pointer';
  
  // Add click listener
  cakeButton.addEventListener('click', onCakeClick);
  
  // Animation
  cakeButton.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.1)' },
    { transform: 'scale(1)' }
  ], {
    duration: 500,
    easing: 'ease-out'
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
}

function onCakeClick() {
  const now = new Date();
  
  // Check if it's time or bypass is active
  if (now < targetDate && !isBypassAllowedOnThisDevice()) {
    // Show "not yet" animation
    cakeButton.animate([
      { transform: 'translateY(0)' },
      { transform: 'translateY(-10px)' },
      { transform: 'translateY(0)' }
    ], {
      duration: 400,
      easing: 'ease-in-out'
    });
    
    // Calculate remaining time
    const diff = targetDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    
    // Show time remaining
    const originalEmoji = cakeButton.querySelector('.cake-emoji').textContent;
    cakeButton.querySelector('.cake-emoji').textContent = `⏳ ${days}d ${hours}h`;
    
    setTimeout(() => {
      if (cakeButton.querySelector('.cake-emoji')) {
        cakeButton.querySelector('.cake-emoji').textContent = originalEmoji;
      }
    }, 2000);
    
    return;
  }
  
  // Play sound
  playHeartSound();
  
  // Celebration animation
  cakeButton.animate([
    { transform: 'scale(1)', opacity: 1 },
    { transform: 'scale(1.2)', opacity: 0.8 },
    { transform: 'scale(0.5)', opacity: 0 }
  ], {
    duration: 800,
    easing: 'ease-in-out'
  });
  
  // Show final message after animation
  setTimeout(() => {
    revealMessage();
  }, 600);
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
    
    // Typewriter effect
    typewriterEffect(mainMessage, SECRET_MESSAGE);
  }
  
  // Mark as opened in localStorage
  try {
    localStorage.setItem(OPENED_KEY, '1');
  } catch (e) {
    console.log('LocalStorage not available');
  }
  
  // Create celebration confetti
  createConfetti();
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
}

function typewriterEffect(element, text, speed = 30) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
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
    
    showLoginFeedback('✅ Unlocked! You can now access the surprise!', 'success');
    
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
    }, 1000);
    
  } else {
    // Failed login
    showLoginFeedback('Incorrect username or password', 'error');
    
    // Shake animation
    loginModal.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(0)' }
    ], {
      duration: 300,
      easing: 'ease-in-out'
    });
  }
}

function showLoginFeedback(message, type) {
  if (!loginFeedback) return;
  
  loginFeedback.textContent = message;
  loginFeedback.style.color = type === 'success' ? '#2c7a44' : '#a33f6c';
  loginFeedback.style.fontWeight = '600';
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
  
  const shapes = ['💖', '✨', '🌟', '💫', '❤️', '💝', '🥰', '💕'];
  
  // Create 20 floating shapes
  for (let i = 0; i < 20; i++) {
    const shape = document.createElement('div');
    shape.className = 'float-shape';
    shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    
    // Random position
    shape.style.left = (Math.random() * 100) + '%';
    shape.style.top = (Math.random() * 100) + '%';
    
    // Random size
    const size = 16 + Math.random() * 24;
    shape.style.fontSize = size + 'px';
    
    // Random color tint
    const hue = 330 + Math.random() * 30;
    shape.style.filter = `hue-rotate(${hue - 330}deg)`;
    
    floatingLayer.appendChild(shape);
    
    // Floating animation
    const duration = 4000 + Math.random() * 8000;
    const distance = 20 + Math.random() * 40;
    
    shape.animate([
      { transform: 'translateY(0px) rotate(0deg)' },
      { transform: `translateY(${distance}px) rotate(${180 + Math.random() * 180}deg)` },
      { transform: 'translateY(0px) rotate(360deg)' }
    ], {
      duration: duration,
      iterations: Infinity,
      easing: 'ease-in-out'
    });
  }
}

function createConfetti() {
  if (!floatingLayer) return;
  
  const confettiShapes = ['💖', '✨', '🌟', '🎉', '🎊', '🥳', '🎂', '💝'];
  
  // Create 50 pieces of confetti
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'float-shape';
    confetti.textContent = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
    
    // Random starting position at top
    confetti.style.left = (Math.random() * 100) + '%';
    confetti.style.top = '-50px';
    confetti.style.fontSize = (14 + Math.random() * 20) + 'px';
    confetti.style.opacity = '0.9';
    confetti.style.zIndex = '9999';
    
    floatingLayer.appendChild(confetti);
    
    // Falling animation
    const duration = 1000 + Math.random() * 2000;
    const endX = (Math.random() - 0.5) * 200;
    
    confetti.animate([
      { 
        transform: 'translateY(0px) rotate(0deg)',
        opacity: 1 
      },
      { 
        transform: `translateY(100vh) translateX(${endX}px) rotate(${360 + Math.random() * 360}deg)`,
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
}

function playHeartSound() {
  try {
    const heartSound = document.getElementById('heartSound');
    if (heartSound) {
      heartSound.currentTime = 0;
      heartSound.play().catch(e => console.log('Audio play failed:', e));
    }
  } catch (e) {
    // Sound not critical, continue silently
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
      const blob = new Blob([SECRET_MESSAGE], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Special_Message_For_Paramu.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Show confirmation
      const originalText = saveBtn.innerHTML;
      saveBtn.innerHTML = '<span class="btn-icon">✅</span> Saved!';
      setTimeout(() => {
        saveBtn.innerHTML = originalText;
      }, 2000);
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
  });
}

// ============================================
// INITIAL CHECK FOR PHOTO
// ============================================

// Check photo on load
window.addEventListener('load', checkPhotoExists);