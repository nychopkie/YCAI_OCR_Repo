// Game state
let player1HP = 100;
let player2HP = 100;
let gameOver = false;
let timeLeft = 60;
let timerInterval = null;

// Player positions (can be any decimal value for smooth movement)
let player1X = 50;
let player1Y = 200;
let player2X = 800;
let player2Y = 200;

// Player directions (for dash)
let player1Direction = { x: 1, y: 0 }; // facing right initially
let player2Direction = { x: -1, y: 0 }; // facing left initially

// Movement speed
const moveSpeed = 5;
const dashDistance = 100;

// Cooldown state
let player1SkillReady = true;
let player2SkillReady = true;
let player1DashReady = true;
let player2DashReady = true;
const cooldownTime = 10000; // 10 seconds
const dashCooldown = 2000; // 2 seconds

// Keys pressed
const keysPressed = {};

// Walls positions
const walls = [
    { x: 150, y: 50, width: 20, height: 150 },
    { x: 350, y: 100, width: 100, height: 20 },
    { x: 550, y: 50, width: 20, height: 150 },
    { x: 250, y: 250, width: 100, height: 20 },
    { x: 400, y: 280, width: 20, height: 100 }
];

// Player size for collision detection
const playerSize = 40;

// Get elements
const player1HealthBar = document.getElementById('player1-health');
const player2HealthBar = document.getElementById('player2-health');
const player1HPText = document.getElementById('player1-hp');
const player2HPText = document.getElementById('player2-hp');
const player1Element = document.getElementById('player1');
const player2Element = document.getElementById('player2');
const gameMessage = document.getElementById('game-message');
const restartBtn = document.getElementById('restart-btn');
const gameArea = document.getElementById('game-area');
const p1CooldownText = document.getElementById('p1-cooldown');
const p2CooldownText = document.getElementById('p2-cooldown');
const timerDisplay = document.getElementById('timer-display');
const timerText = document.getElementById('timer');

// Update health display
function updateHealth() {
    // Update Player 1
    player1HealthBar.style.width = player1HP + '%';
    player1HPText.textContent = player1HP + ' HP';
    
    // Update Player 2
    player2HealthBar.style.width = player2HP + '%';
    player2HPText.textContent = player2HP + ' HP';
}

// Start timer
function startTimer() {
    timeLeft = 60;
    timerText.textContent = timeLeft;
    timerDisplay.classList.remove('warning');
    
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.textContent = timeLeft;
        
        // Warning at 10 seconds
        if (timeLeft <= 10) {
            timerDisplay.classList.add('warning');
        }
        
        // Time's up!
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeUp();
        }
    }, 1000);
}

// Handle time up
function timeUp() {
    gameOver = true;
    
    if (player1HP > player2HP) {
        gameMessage.textContent = '⏰ Time Up! 🏆 Player 1 Wins! 🏆';
    } else if (player2HP > player1HP) {
        gameMessage.textContent = '⏰ Time Up! 🏆 Player 2 Wins! 🏆';
    } else {
        gameMessage.textContent = '⏰ Time Up! 🤝 It\'s a Tie! 🤝';
    }
    
    restartBtn.style.display = 'block';
}

// Check distance between players
function getDistance() {
    const dx = player2X - player1X;
    const dy = player2Y - player1Y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Check collision with walls
function checkWallCollision(x, y) {
    for (const wall of walls) {
        // Check if player overlaps with wall
        if (x < wall.x + wall.width &&
            x + playerSize > wall.x &&
            y < wall.y + wall.height &&
            y + playerSize > wall.y) {
            return true;
        }
    }
    return false;
}

// Player 1 punches Player 2
function player1Punch() {
    if (gameOver) return;
    
    // Check if close enough to hit
    if (getDistance() < 150) {
        // Add punch animation
        player1Element.classList.add('punch');
        setTimeout(() => {
            player1Element.classList.remove('punch');
        }, 200);
        
        // Reduce Player 2 health
        player2HP -= 10;
        if (player2HP < 0) player2HP = 0;
        
        updateHealth();
        checkWinner();
    }
}

// Player 2 punches Player 1
function player2Punch() {
    if (gameOver) return;
    
    // Check if close enough to hit
    if (getDistance() < 150) {
        // Add punch animation
        player2Element.classList.add('punch');
        setTimeout(() => {
            player2Element.classList.remove('punch');
        }, 200);
        
        // Reduce Player 1 health
        player1HP -= 10;
        if (player1HP < 0) player1HP = 0;
        
        updateHealth();
        checkWinner();
    }
}

// Player 1 special skill
function player1Special() {
    if (gameOver || !player1SkillReady) return;
    
    // Check if close enough to hit
    if (getDistance() < 150) {
        // Add special animation
        player1Element.classList.add('special');
        setTimeout(() => {
            player1Element.classList.remove('special');
        }, 400);
        
        // Reduce Player 2 health by 20
        player2HP -= 20;
        if (player2HP < 0) player2HP = 0;
        
        updateHealth();
        checkWinner();
        
        // Start cooldown
        player1SkillReady = false;
        startCooldown(1);
    }
}

// Player 2 special skill
function player2Special() {
    if (gameOver || !player2SkillReady) return;
    
    // Check if close enough to hit
    if (getDistance() < 150) {
        // Add special animation
        player2Element.classList.add('special');
        setTimeout(() => {
            player2Element.classList.remove('special');
        }, 400);
        
        // Reduce Player 1 health by 20
        player1HP -= 20;
        if (player1HP < 0) player1HP = 0;
        
        updateHealth();
        checkWinner();
        
        // Start cooldown
        player2SkillReady = false;
        startCooldown(2);
    }
}

// Player 1 dash
function player1Dash() {
    if (gameOver || !player1DashReady) return;
    
    // Create trail effect
    createDashTrail(player1X, player1Y, '🧑');
    
    // Calculate new position
    let newX = player1X + player1Direction.x * dashDistance;
    let newY = player1Y + player1Direction.y * dashDistance;
    
    // Keep within bounds
    newX = Math.max(0, Math.min(700, newX));
    newY = Math.max(0, Math.min(460, newY));
    
    // Check wall collision, if collision, don't dash through
    if (!checkWallCollision(newX, newY)) {
        player1X = newX;
        player1Y = newY;
    }
    
    // Flash effect
    player1Element.classList.add('dashing');
    setTimeout(() => {
        player1Element.classList.remove('dashing');
    }, 200);
    
    // Start cooldown
    player1DashReady = false;
    setTimeout(() => {
        player1DashReady = true;
    }, dashCooldown);
}

// Player 2 dash
function player2Dash() {
    if (gameOver || !player2DashReady) return;
    
    // Create trail effect
    createDashTrail(player2X, player2Y, '🧑');
    
    // Calculate new position
    let newX = player2X + player2Direction.x * dashDistance;
    let newY = player2Y + player2Direction.y * dashDistance;
    
    // Keep within bounds
    newX = Math.max(0, Math.min(850, newX));
    newY = Math.max(0, Math.min(460, newY));
    
    // Check wall collision, if collision, don't dash through
    if (!checkWallCollision(newX, newY)) {
        player2X = newX;
        player2Y = newY;
    }
    
    // Flash effect
    player2Element.classList.add('dashing');
    setTimeout(() => {
        player2Element.classList.remove('dashing');
    }, 200);
    
    // Start cooldown
    player2DashReady = false;
    setTimeout(() => {
        player2DashReady = true;
    }, dashCooldown);
}

// Create dash trail visual effect
function createDashTrail(x, y, emoji) {
    const trail = document.createElement('div');
    trail.className = 'dash-trail';
    trail.textContent = emoji;
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    gameArea.appendChild(trail);
    
    setTimeout(() => {
        trail.remove();
    }, 300);
}

// Start cooldown timer
function startCooldown(player) {
    const cooldownElement = player === 1 ? p1CooldownText : p2CooldownText;
    let timeLeft = 10;
    
    cooldownElement.classList.add('waiting');
    cooldownElement.textContent = `Cooldown: ${timeLeft}s`;
    
    const interval = setInterval(() => {
        timeLeft--;
        cooldownElement.textContent = `Cooldown: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(interval);
            cooldownElement.classList.remove('waiting');
            cooldownElement.textContent = 'Skill Ready!';
            if (player === 1) {
                player1SkillReady = true;
            } else {
                player2SkillReady = true;
            }
        }
    }, 1000);
}

// Move players with direction tracking
function movePlayer1() {
    let moved = false;
    let moveX = 0;
    let moveY = 0;
    
    if (keysPressed['w'] || keysPressed['W']) {
        moveY -= moveSpeed;
        moved = true;
    }
    if (keysPressed['s'] || keysPressed['S']) {
        moveY += moveSpeed;
        moved = true;
    }
    if (keysPressed['a'] || keysPressed['A']) {
        moveX -= moveSpeed;
        moved = true;
    }
    if (keysPressed['d'] || keysPressed['D']) {
        moveX += moveSpeed;
        moved = true;
    }
    
    // Calculate new position
    let newX = player1X + moveX;
    let newY = player1Y + moveY;
    
    // Keep within bounds
    newX = Math.max(0, Math.min(700, newX));
    newY = Math.max(0, Math.min(350, newY));
    
    // Check wall collision - try to slide along walls
    if (checkWallCollision(newX, newY)) {
        // Try moving only in X direction
        if (!checkWallCollision(newX, player1Y)) {
            newY = player1Y;
        }
        // Try moving only in Y direction
        else if (!checkWallCollision(player1X, newY)) {
            newX = player1X;
        }
        // Can't move at all
        else {
            newX = player1X;
            newY = player1Y;
        }
    }
    
    player1X = newX;
    player1Y = newY;
    
    // Update direction if moving
    if (moved && moveX !== 0 && moveY !== 0) {
        const length = Math.sqrt(moveX * moveX + moveY * moveY);
        if (length > 0) {
            player1Direction = { x: moveX / length, y: moveY / length };
        }
    } else if (moved) {
        if (moveX !== 0) player1Direction = { x: moveX > 0 ? 1 : -1, y: 0 };
        if (moveY !== 0) player1Direction = { x: 0, y: moveY > 0 ? 1 : -1 };
    }
    
    player1Element.style.left = player1X + 'px';
    player1Element.style.top = player1Y + 'px';
}

function movePlayer2() {
    let moved = false;
    let moveX = 0;
    let moveY = 0;
    
    if (keysPressed['ArrowUp']) {
        moveY -= moveSpeed;
        moved = true;
    }
    if (keysPressed['ArrowDown']) {
        moveY += moveSpeed;
        moved = true;
    }
    if (keysPressed['ArrowLeft']) {
        moveX -= moveSpeed;
        moved = true;
    }
    if (keysPressed['ArrowRight']) {
        moveX += moveSpeed;
        moved = true;
    }
    
    // Calculate new position
    let newX = player2X + moveX;
    let newY = player2Y + moveY;
    
    // Keep within bounds
    newX = Math.max(0, Math.min(700, newX));
    newY = Math.max(0, Math.min(460, newY));
    
    // Check wall collision - try to slide along walls
    if (checkWallCollision(newX, newY)) {
        // Try moving only in X direction
        if (!checkWallCollision(newX, player2Y)) {
            newY = player2Y;
        }
        // Try moving only in Y direction
        else if (!checkWallCollision(player2X, newY)) {
            newX = player2X;
        }
        // Can't move at all
        else {
            newX = player2X;
            newY = player2Y;
        }
    }
    
    player2X = newX;
    player2Y = newY;
    
    // Update direction if moving
    if (moved && moveX !== 0 && moveY !== 0) {
        const length = Math.sqrt(moveX * moveX + moveY * moveY);
        if (length > 0) {
            player2Direction = { x: moveX / length, y: moveY / length };
        }
    } else if (moved) {
        if (moveX !== 0) player2Direction = { x: moveX > 0 ? 1 : -1, y: 0 };
        if (moveY !== 0) player2Direction = { x: 0, y: moveY > 0 ? 1 : -1 };
    }
    
    player2Element.style.left = player2X + 'px';
    player2Element.style.top = player2Y + 'px';
}

// Game loop for continuous movement
function gameLoop() {
    if (!gameOver) {
        movePlayer1();
        movePlayer2();
    }
    requestAnimationFrame(gameLoop);
}

// Check if there's a winner
function checkWinner() {
    if (player1HP <= 0) {
        gameOver = true;
        if (timerInterval) clearInterval(timerInterval);
        gameMessage.textContent = '🏆 Player 2 Wins! 🏆';
        restartBtn.style.display = 'block';
    } else if (player2HP <= 0) {
        gameOver = true;
        if (timerInterval) clearInterval(timerInterval);
        gameMessage.textContent = '🏆 Player 1 Wins! 🏆';
        restartBtn.style.display = 'block';
    }
}

// Restart game
function restartGame() {
    player1HP = 100;
    player2HP = 100;
    gameOver = false;
    gameMessage.textContent = '';
    restartBtn.style.display = 'none';
    
    // Reset timer
    if (timerInterval) clearInterval(timerInterval);
    startTimer();
    
    // Reset positions
    player1X = 50;
    player1Y = 200;
    player2X = 800;
    player2Y = 200;
    player1Element.style.left = player1X + 'px';
    player1Element.style.top = player1Y + 'px';
    player2Element.style.left = player2X + 'px';
    player2Element.style.top = player2Y + 'px';
    
    // Reset cooldowns
    player1SkillReady = true;
    player2SkillReady = true;
    player1DashReady = true;
    player2DashReady = true;
    player1Direction = { x: 1, y: 0 };
    player2Direction = { x: -1, y: 0 };
    p1CooldownText.classList.remove('waiting');
    p2CooldownText.classList.remove('waiting');
    p1CooldownText.textContent = 'Skill Ready!';
    p2CooldownText.textContent = 'Skill Ready!';
    
    updateHealth();
}

// Keyboard controls
document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
    
    // Player 1: Q for dash
    if (event.key === 'q' || event.key === 'Q') {
        event.preventDefault();
        player1Dash();
    }
    
    // Player 1: Space bar for punch
    if (event.code === 'Space') {
        event.preventDefault();
        player1Punch();
    }
    
    // Player 1: F for special skill
    if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        player1Special();
    }
    
    // Player 2: Shift for dash
    if (event.key === 'Shift') {
        event.preventDefault();
        player2Dash();
    }
    
    // Player 2: Enter key for punch
    if (event.code === 'Enter') {
        event.preventDefault();
        player2Punch();
    }
    
    // Player 2: Control for special skill
    if (event.key === 'Control') {
        event.preventDefault();
        player2Special();
    }
});

document.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
});

// Restart button
restartBtn.addEventListener('click', restartGame);

// Initialize game
updateHealth();
startTimer();
gameLoop();
