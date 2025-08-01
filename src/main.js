import './style.css'
import { config } from './config.default.js'

// Planet data
const planets = {
  frostbite: {
    name: 'Frostbite',
    distance: 77.3, // millions of km
    travelTime: 3, // days
    description: 'A frozen world of eternal winter'
  },
  home: {
    name: 'Home',
    distance: 0,
    travelTime: 0,
    description: 'Your cozy space station'
  },
  crystal: {
    name: 'Twitter',
    distance: 38.2,
    travelTime: 4,
    description: 'A social media planet for sharing thoughts'
  },
  volcano: {
    name: 'Telegram',
    distance: 78.3,
    travelTime: 7,
    description: 'A messaging planet for communication'
  },
  nebula: {
    name: 'Nebula',
    distance: 628.7,
    travelTime: 13,
    description: 'Crypto market explorer - DexScreener'
  },
  matrix: {
    name: 'Matrix',
    distance: 999.9,
    travelTime: 20,
    description: 'A mysterious digital realm'
  }
};

// Spaceship state
let currentPlanet = 'home';
let isTraveling = false;
let speed = 0;
let distance = 0;
let currentScreen = 'home'; // 'home', 'spaceship', or 'desert-game'

// AI Agent state
let isAgentActive = false;
let isGeneratingResponse = false;

// Desert Game state
let gameState = 'dialog'; // 'dialog', 'playing', 'game-over'
let gameTimer = 20;
let gameScore = 0;
let gameInterval = null;
let enemySpawnInterval = null;

// OpenAI configuration
const OPENAI_API_KEY = config.OPENAI_API_KEY;

// DOM elements
const planetElements = document.querySelectorAll('.planet');
const currentPlanetSpan = document.getElementById('current-planet');
const speedSpan = document.getElementById('speed');
const distanceSpan = document.getElementById('distance');
const warpEffect = document.querySelector('.warp-effect');

// AI Agent elements
const helpButton = document.getElementById('help-button');
const agentContainer = document.getElementById('agent-container');
const agentImage = document.getElementById('agent-image');
const agentVideo = document.getElementById('agent-video');
const terminalMessages = document.getElementById('terminal-messages');
const terminalInput = document.getElementById('terminal-input');
const sendButton = document.getElementById('send-message');
const closeTerminal = document.getElementById('close-terminal');

// Radio elements
const radioContainer = document.getElementById('radio-container');
const radioImage = document.getElementById('radio-image');
const radioToggle = document.getElementById('radio-toggle');
const spacesongAudio = document.getElementById('spacesong-audio');

// Home screen elements
const homeScreen = document.getElementById('home-screen');
const spaceshipCockpit = document.getElementById('spaceship-cockpit');
const returnButton = document.getElementById('return-button');
const pollyAgent = document.getElementById('polly-agent');
const pollyImage = document.getElementById('polly-image');
const speechBubble = document.getElementById('speech-bubble');
const bubbleContent = document.getElementById('bubble-content');
const homeChatInput = document.getElementById('home-chat-input');
const homeSendButton = document.getElementById('home-send-button');

// Desert Game elements
const desertGameScreen = document.getElementById('desert-game-screen');
const jeeterCharacter = document.getElementById('jeeter-character');
const gameDialog = document.getElementById('game-dialog');
const apologizeBtn = document.getElementById('apologize-btn');
const defendBtn = document.getElementById('defend-btn');
const gameOverlay = document.getElementById('game-overlay');
const gameTimerElement = document.getElementById('game-timer');
const gameScoreElement = document.getElementById('game-score');
const gameArea = document.getElementById('game-area');
const desertReturnButton = document.getElementById('desert-return-button');

// Debug DOM elements
console.log('Home screen element:', homeScreen);
console.log('Spaceship cockpit element:', spaceshipCockpit);
console.log('Planet elements found:', planetElements.length);
console.log('Desert game screen element:', desertGameScreen);

// Initialization
function init() {
  console.log('Initializing Pengu Pilot...');
  updateDisplay();
  setupEventListeners();
  startStarsAnimation();
  setupAgentEventListeners();
  setupHomeEventListeners();
  setupDesertGameEventListeners();
  
  // Start in Home screen
  console.log('Starting in Home screen');
  showHomeScreen();
}

// Setup event listeners
function setupEventListeners() {
  planetElements.forEach(planet => {
    planet.addEventListener('click', () => {
      console.log('Planet clicked:', planet.dataset.planet);
      if (!isTraveling) {
        const targetPlanet = planet.dataset.planet;
        console.log('Target planet:', targetPlanet, 'Current planet:', currentPlanet);
        if (targetPlanet === 'home') {
          console.log('Going to Home screen');
          showHomeScreen();
        } else if (targetPlanet === 'frostbite') {
          console.log('Starting desert game');
          showDesertGame();
        } else if (targetPlanet === 'crystal') {
          console.log('Opening Twitter screen');
          showTwitterScreen();
        } else if (targetPlanet === 'volcano') {
          console.log('Opening Telegram screen');
          showTelegramScreen();
        } else if (targetPlanet === 'matrix') {
          console.log('Opening Matrix screen');
          showMatrixScreen();
        } else if (targetPlanet === 'nebula') {
          console.log('Opening DexScreener');
          window.open('https://dexscreener.com/', '_blank');
        } else {
          console.log('Traveling to planet:', targetPlanet);
          travelToPlanet(targetPlanet);
        }
      }
    });

    // Hover effects
    planet.addEventListener('mouseenter', () => {
      if (!isTraveling) {
        planet.style.transform = 'scale(1.2)';
      }
    });

    planet.addEventListener('mouseleave', () => {
      if (!isTraveling) {
        planet.style.transform = 'scale(1)';
      }
    });
  });
}

// Setup Home screen event listeners
function setupHomeEventListeners() {
  returnButton.addEventListener('click', showSpaceship);
  homeSendButton.addEventListener('click', sendHomeMessage);
  
  homeChatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendHomeMessage();
    }
  });
}

// Setup Desert Game event listeners
function setupDesertGameEventListeners() {
  apologizeBtn.addEventListener('click', () => {
    console.log('Player apologized');
    endDesertGame('apologize');
  });
  
  defendBtn.addEventListener('click', () => {
    console.log('Player defended');
    startShootingGame();
  });
  
  desertReturnButton.addEventListener('click', () => {
    console.log('Returning from desert game');
    showSpaceship();
  });
  
  // Setup Matrix riddle functionality
  const submitRiddleBtn = document.getElementById('submit-riddle');
  const riddleAnswer = document.getElementById('riddle-answer');
  const riddleResult = document.getElementById('riddle-result');
  
  if (submitRiddleBtn && riddleAnswer) {
    submitRiddleBtn.addEventListener('click', () => {
      const answer = riddleAnswer.value.trim().toLowerCase();
      if (answer === 'fire') {
        riddleResult.innerHTML = '<div class="success">✅ Correct! You have unlocked the secret of the Matrix.</div>';
        riddleResult.style.display = 'block';
      } else {
        riddleResult.innerHTML = '<div class="error">❌ Incorrect. Try again...</div>';
        riddleResult.style.display = 'block';
      }
    });
    
    riddleAnswer.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        submitRiddleBtn.click();
      }
    });
  }
}

// Show Home screen
function showHomeScreen() {
  console.log('showHomeScreen called');
  currentScreen = 'home';
  homeScreen.classList.add('active');
  spaceshipCockpit.style.display = 'none';
  desertGameScreen.classList.remove('active');
  currentPlanet = 'home';
  updateDisplay();
  
  console.log('Home screen should be visible now');
  
  // Show welcome message
  setTimeout(() => {
    showPollyMessage("Welcome home! How can I help you today?");
  }, 500);
}

// Show Spaceship
function showSpaceship() {
  currentScreen = 'spaceship';
  homeScreen.classList.remove('active');
  desertGameScreen.classList.remove('active');
  spaceshipCockpit.style.display = 'block';
  updateDisplay();
  
  // Trigger spaceship entered event
  document.dispatchEvent(new CustomEvent('spaceship-entered'));
}

// Show Desert Game
function showDesertGame() {
  console.log('showDesertGame called');
  currentScreen = 'desert-game';
  homeScreen.classList.remove('active');
  spaceshipCockpit.style.display = 'none';
  desertGameScreen.classList.add('active');
  currentPlanet = 'frostbite';
  updateDisplay();
  
  // Reset game state
  gameState = 'dialog';
  gameTimer = 20;
  gameScore = 0;
  gameDialog.style.display = 'block';
  gameOverlay.classList.remove('active');
  
  // Show Jeeter character
  jeeterCharacter.style.display = 'block';
  
  console.log('Desert game should be visible now');
}

// Show Twitter Screen
function showTwitterScreen() {
  console.log('showTwitterScreen called');
  // Open Twitter link directly
  window.open('https://x.com/pengupilots', '_blank');
}

// Show Telegram Screen
function showTelegramScreen() {
  console.log('showTelegramScreen called');
  // Open Telegram link directly
  window.open('https://t.me/pengupilot', '_blank');
}

// Show Matrix Screen
function showMatrixScreen() {
  console.log('showMatrixScreen called');
  currentScreen = 'matrix';
  
  // Hide all other screens
  homeScreen.classList.remove('active');
  spaceshipCockpit.style.display = 'none';
  desertGameScreen.classList.remove('active');
  
  // Hide all social screens first
  const socialScreens = document.querySelectorAll('.social-screen, .matrix-screen, .roadmap-screen');
  socialScreens.forEach(screen => {
    if (screen) {
      screen.classList.remove('active');
    }
  });
  
  // Show Matrix screen
  const matrixScreen = document.getElementById('matrix-screen');
  if (matrixScreen) {
    matrixScreen.classList.add('active');
    console.log('Matrix screen activated');
  } else {
    console.error('Matrix screen not found!');
  }
  
  currentPlanet = 'matrix';
  updateDisplay();
  console.log('Matrix screen should be visible now');
}

// Show Roadmap Screen
function showRoadmapScreen() {
  console.log('showRoadmapScreen called');
  
  // Hide all other screens
  homeScreen.classList.remove('active');
  spaceshipCockpit.style.display = 'none';
  desertGameScreen.classList.remove('active');
  
  // Hide all special screens
  const matrixScreen = document.getElementById('matrix-screen');
  if (matrixScreen) matrixScreen.classList.remove('active');
  
  // Show Roadmap screen
  const roadmapScreen = document.getElementById('roadmap-screen');
  if (roadmapScreen) {
    roadmapScreen.classList.add('active');
    console.log('Roadmap screen activated successfully');
  } else {
    console.error('Roadmap screen element not found!');
    return;
  }
  
  currentScreen = 'roadmap';
  currentPlanet = 'nebula';
  updateDisplay();
  console.log('Roadmap screen should be visible now');
}

// Start shooting game
function startShootingGame() {
  console.log('Starting shooting game');
  gameState = 'playing';
  gameDialog.style.display = 'none';
  gameOverlay.classList.add('active');
  
  // Hide Jeeter character
  jeeterCharacter.style.display = 'none';
  
  // Start timer
  gameTimer = 20;
  updateGameUI();
  
  gameInterval = setInterval(() => {
    gameTimer--;
    updateGameUI();
    
    if (gameTimer <= 0) {
      endDesertGame('timeout');
    }
  }, 1000);
  
  // Start spawning enemies
  enemySpawnInterval = setInterval(() => {
    spawnEnemy();
  }, 2000);
  
  // Spawn first enemy after 1 second
  setTimeout(() => {
    spawnEnemy();
  }, 1000);
}

// Spawn enemy
function spawnEnemy() {
  const enemy = document.createElement('img');
  enemy.src = '/jeeter.png';
  enemy.className = 'jeeter-enemy';
  enemy.style.left = Math.random() * (window.innerWidth - 80) + 'px';
  enemy.style.top = Math.random() * (window.innerHeight - 80) + 'px';
  
  enemy.addEventListener('click', () => {
    // Play shot sound
    playShotSound();
    
    enemy.classList.add('clicked');
    gameScore++;
    updateGameUI();
    
    setTimeout(() => {
      enemy.remove();
    }, 500);
  });
  
  gameArea.appendChild(enemy);
  
  // Remove enemy after 5 seconds if not clicked
  setTimeout(() => {
    if (enemy.parentNode) {
      enemy.remove();
      if (gameScore === 0) {
        endDesertGame('fail');
      }
    }
  }, 5000);
}

// Play shot sound
function playShotSound() {
  const audio = new Audio('/music/shot.mp3');
  audio.volume = 0.5;
  audio.play().catch(e => console.log('Audio play failed:', e));
}

// Setup radio functionality
function setupRadio() {
  let isPlaying = false;
  
  radioImage.addEventListener('click', () => {
    if (isPlaying) {
      // Stop music
      spacesongAudio.pause();
      spacesongAudio.currentTime = 0;
      radioImage.classList.remove('playing');
      isPlaying = false;
      console.log('🎵 Radio stopped');
    } else {
      // Play music
      spacesongAudio.volume = 0.3;
      spacesongAudio.play().then(() => {
        radioImage.classList.add('playing');
        isPlaying = true;
        console.log('🎵 Radio playing');
      }).catch(e => {
        console.log('Radio play failed:', e);
      });
    }
  });
  
  // Auto-play when entering spaceship
  document.addEventListener('spaceship-entered', () => {
    if (!isPlaying) {
      radioImage.click();
    }
  });
}

// Update game UI
function updateGameUI() {
  gameTimerElement.textContent = gameTimer;
  gameScoreElement.textContent = `Eliminados: ${gameScore}`;
}

// End desert game
function endDesertGame(result) {
  console.log('Ending desert game with result:', result);
  
  // Clear intervals
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }
  if (enemySpawnInterval) {
    clearInterval(enemySpawnInterval);
    enemySpawnInterval = null;
  }
  
  // Clear game area
  gameArea.innerHTML = '';
  
  // Show Jeeter character again
  jeeterCharacter.style.display = 'block';
  
  // Show result message
  let message = '';
  switch (result) {
    case 'apologize':
      message = 'Jeeter accepts your apology. You can continue your journey.';
      break;
    case 'timeout':
      message = 'Time\'s up! You survived the attack.';
      break;
    case 'fail':
      message = 'You lost! You couldn\'t eliminate enough enemies.';
      break;
  }
  
  // Show result dialog
  gameDialog.querySelector('h3').textContent = 'Result';
  gameDialog.querySelector('p').textContent = message;
  gameDialog.querySelector('.dialog-options').innerHTML = '<button class="dialog-option" id="return-to-ship-btn">🚀 Return to Ship</button>';
  gameDialog.style.display = 'block';
  gameOverlay.classList.remove('active');
  
  // Add event listener to the new button
  const returnToShipBtn = document.getElementById('return-to-ship-btn');
  if (returnToShipBtn) {
    returnToShipBtn.addEventListener('click', showSpaceship);
  }
}

// Show Polly message in speech bubble
function showPollyMessage(message) {
  bubbleContent.textContent = message;
  speechBubble.style.display = 'block';
  
  // Hide message after 5 seconds
  setTimeout(() => {
    speechBubble.style.display = 'none';
  }, 5000);
}

// Send message to Polly in Home
async function sendHomeMessage() {
  const message = homeChatInput.value.trim();
  if (!message) return;
  
  // Clear input
  homeChatInput.value = '';
  
  // Show user message in bubble
  showPollyMessage(`You: ${message}`);
  
  // Simulate Polly response (you can integrate with OpenAI here)
  setTimeout(() => {
    showPollyMessage("Thanks for chatting with me! I'm here to help.");
  }, 1000);
}

// Setup AI Agent event listeners
function setupAgentEventListeners() {
  helpButton.addEventListener('click', toggleAgent);
  closeTerminal.addEventListener('click', toggleAgent);
  sendButton.addEventListener('click', sendMessage);
  
  terminalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Setup radio
  setupRadio();
}

// Toggle AI Agent
function toggleAgent() {
  isAgentActive = !isAgentActive;
  
  if (isAgentActive) {
    agentContainer.classList.add('active');
    helpButton.style.display = 'none';
  } else {
    agentContainer.classList.remove('active');
    helpButton.style.display = 'block';
    stopAgentVideo();
  }
}

// Send message to AI
async function sendMessage() {
  const message = terminalInput.value.trim();
  if (!message || isGeneratingResponse) return;
  
  // Add user message
  addMessage(message, 'user');
  terminalInput.value = '';
  
  // Show typing indicator
  isGeneratingResponse = true;
  sendButton.disabled = true;
  
  // Start agent video
  startAgentVideo();
  
  try {
    const response = await callOpenAI(message);
    addMessage(response, 'agent');
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    addMessage('Sorry, I encountered an error. Please try again.', 'agent');
  } finally {
    isGeneratingResponse = false;
    sendButton.disabled = false;
    stopAgentVideo();
  }
}

// Call OpenAI API
async function callOpenAI(message) {
  if (!OPENAI_API_KEY) {
    return "I'm sorry, but the AI assistant is not configured. Please set up your OpenAI API key in the environment variables.";
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant helping a spaceship pilot navigate through the solar system. 
            You are helpful, friendly, and knowledgeable about space travel, planets, and space exploration. 
            Keep responses concise and engaging. The pilot is currently at planet: ${planets[currentPlanet].name}.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "I'm sorry, but I encountered an error connecting to the AI service. Please try again later.";
  }
}

// Add message to terminal
function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;
  
  const textSpan = document.createElement('span');
  textSpan.className = 'message-text';
  textSpan.textContent = text;
  
  messageDiv.appendChild(textSpan);
  terminalMessages.appendChild(messageDiv);
  
  // Scroll to bottom
  terminalMessages.scrollTop = terminalMessages.scrollHeight;
}

// Start agent video
function startAgentVideo() {
  agentImage.classList.add('hidden');
  agentVideo.classList.add('active');
  agentVideo.play();
}

// Stop agent video
function stopAgentVideo() {
  agentVideo.pause();
  agentVideo.currentTime = 0;
  agentVideo.classList.remove('active');
  agentImage.classList.remove('hidden');
}

// Travel to planet function
async function travelToPlanet(targetPlanet) {
  if (isTraveling) return;
  
  isTraveling = true;
  const targetPlanetData = planets[targetPlanet];
  const currentPlanetData = planets[currentPlanet];
  
  // Calculate travel distance
  const travelDistance = Math.abs(targetPlanetData.distance - currentPlanetData.distance);
  
  // Start warp effect
  startWarpEffect();
  
  // Simulate travel
  await simulateTravel(travelDistance, targetPlanetData.travelTime);
  
  // Update current planet
  currentPlanet = targetPlanet;
  
  // Arrival effect
  await arrivalEffect();
  
  isTraveling = false;
  updateDisplay();
}

// Simulate travel
async function simulateTravel(distance, travelTime) {
  const duration = travelTime * 1000; // Convert to milliseconds
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const updateTravel = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Update speed and distance
      speed = Math.floor(50000 + (progress * 150000)); // 50k - 200k km/h
      distance = Math.floor(progress * distance);
      
      updateDisplay();
      
      if (progress < 1) {
        requestAnimationFrame(updateTravel);
      } else {
        resolve();
      }
    };
    
    updateTravel();
  });
}

// Warp effect
function startWarpEffect() {
  warpEffect.classList.add('active');
  
  setTimeout(() => {
    warpEffect.classList.remove('active');
  }, 2000);
}

// Arrival effect
async function arrivalEffect() {
  // Flash effect
  const flash = document.createElement('div');
  flash.style.position = 'absolute';
  flash.style.top = '0';
  flash.style.left = '0';
  flash.style.width = '100%';
  flash.style.height = '100%';
  flash.style.background = 'rgba(0, 255, 0, 0.3)';
  flash.style.zIndex = '25';
  flash.style.pointerEvents = 'none';
  flash.style.transition = 'opacity 0.5s ease';
  
  document.querySelector('.spaceship-cockpit').appendChild(flash);
  
  setTimeout(() => {
    flash.style.opacity = '0';
    setTimeout(() => {
      flash.remove();
    }, 500);
  }, 100);
  
  // Arrival sound (simulated)
  console.log('🚀 Arrived at ' + planets[currentPlanet].name);
}

// Update display
function updateDisplay() {
  currentPlanetSpan.textContent = planets[currentPlanet].name;
  speedSpan.textContent = speed.toLocaleString();
  distanceSpan.textContent = distance.toLocaleString();
  
  // Update visual selection
  planetElements.forEach(planet => {
    planet.classList.remove('selected');
    if (planet.dataset.planet === currentPlanet) {
      planet.classList.add('selected');
    }
  });
}

// Stars animation
function startStarsAnimation() {
  const stars = document.querySelector('.stars');
  if (stars) {
    stars.style.animation = 'stars-move 20s linear infinite';
  }
}

// Sound effects (simulated)
function playSound(type) {
  // In a real implementation, sounds would be played here
  console.log('🔊 Sound:', type);
}

// Initialize application
document.addEventListener('DOMContentLoaded', init);

// Additional effects
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isTraveling) {
    // Cancel travel (for development)
    console.log('🚫 Travel cancelled');
  }
});

// Debug information
console.log('🚀 Pengu Pilot started');
console.log('📡 Navigation system active');
console.log('🌍 Available planets:', Object.keys(planets).join(', '));
console.log('🤖 AI Agent ready');
console.log('🏠 Home screen ready');
console.log('🎮 Desert game ready');
