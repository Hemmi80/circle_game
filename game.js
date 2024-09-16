// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Update score display
const scoreBoard = document.getElementById('scoreBoard');

// Player circle object
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    speed: 3,
    dx: 0,
    dy: 0,
    alive: true,
};

// Food circle object
let food = {
    x: getRandomInt(20, canvas.width - 20),
    y: getRandomInt(20, canvas.height - 20),
    radius: 8,
};

// Enemy array
let enemies = [];

// Score variable
let score = 0;

// Spawn an enemy every 3 seconds
setInterval(spawnEnemy, 3000);

// Draw the player circle
function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#3498db';
    ctx.shadowColor = '#2980b9';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0; // Reset shadowBlur
}

// Draw the food circle
function drawFood() {
    ctx.beginPath();
    ctx.arc(food.x, food.y, food.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#e74c3c';
    ctx.shadowColor = '#c0392b';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
}

// Draw enemies
function drawEnemies() {
    enemies.forEach((enemy) => {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f1c40f';
        ctx.shadowColor = '#f39c12';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.closePath();
        ctx.shadowBlur = 0;
    });
}

// Clear the canvas
function clearCanvas() {
    // Draw a semi-transparent rectangle to create a motion blur effect
    ctx.fillStyle = 'rgba(44, 62, 80, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Update the player's position
function updatePlayerPosition() {
    player.x += player.dx;
    player.y += player.dy;

    // Prevent the player from moving off the canvas
    if (player.x - player.radius < 0) player.x = player.radius;
    if (player.x + player.radius > canvas.width) player.x = canvas.width - player.radius;
    if (player.y - player.radius < 0) player.y = player.radius;
    if (player.y + player.radius > canvas.height) player.y = canvas.height - player.radius;
}

// Update enemies' positions
function updateEnemies() {
    enemies.forEach((enemy) => {
        enemy.x += enemy.dx;
        enemy.y += enemy.dy;

        // Remove enemy if it moves off-screen
        if (
            enemy.x + enemy.radius < 0 ||
            enemy.x - enemy.radius > canvas.width ||
            enemy.y + enemy.radius < 0 ||
            enemy.y - enemy.radius > canvas.height
        ) {
            enemies.splice(enemies.indexOf(enemy), 1);
        }
    });
}

// Detect collision between player and food
function detectCollision() {
    const distance = Math.hypot(player.x - food.x, player.y - food.y);
    if (distance < player.radius + food.radius) {
        // Collision detected
        player.radius += 1.5; // Increase the player's radius
        score += 1; // Increase the score
        updateScore();

        // Play sound effect (optional)
        // playSound('eat.mp3');

        // Relocate the food to a new random position
        food.x = getRandomInt(20, canvas.width - 20);
        food.y = getRandomInt(20, canvas.height - 20);
    }
}

// Detect collision between player and enemies
function detectEnemyCollision() {
    enemies.forEach((enemy) => {
        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (distance < player.radius + enemy.radius) {
            // Collision with enemy detected
            player.alive = false;
            // Play sound effect (optional)
            // playSound('gameover.mp3');
        }
    });
}

// Spawn a new enemy
function spawnEnemy() {
    const enemy = {
        x: getRandomInt(20, canvas.width - 20),
        y: getRandomInt(20, canvas.height - 20),
        radius: 12,
        speed: 2,
        dx: 0,
        dy: 0,
    };

    // Random direction
    const angle = Math.random() * Math.PI * 2;
    enemy.dx = Math.cos(angle) * enemy.speed;
    enemy.dy = Math.sin(angle) * enemy.speed;

    enemies.push(enemy);
}

// Handle keydown events
function keyDownHandler(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        player.dx = -player.speed;
    } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        player.dy = -player.speed;
    } else if (e.key === 'ArrowDown' || e.key === 'Down') {
        player.dy = player.speed;
    }
}

// Handle keyup events
function keyUpHandler(e) {
    if (
        e.key === 'ArrowRight' || e.key === 'Right' ||
        e.key === 'ArrowLeft' || e.key === 'Left'
    ) {
        player.dx = 0;
    } else if (
        e.key === 'ArrowUp' || e.key === 'Up' ||
        e.key === 'ArrowDown' || e.key === 'Down'
    ) {
        player.dy = 0;
    }
}

// Update score display
function updateScore() {
    scoreBoard.textContent = 'Score: ' + score;
}

// Utility function to get a random integer between min and max
function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
}

// Main game loop
function gameLoop() {
    if (player.alive) {
        clearCanvas();
        updatePlayerPosition();
        updateEnemies();
        detectCollision();
        detectEnemyCollision();
        drawPlayer();
        drawFood();
        drawEnemies();
        requestAnimationFrame(gameLoop);
    } else {
        gameOver();
    }
}

// Game Over function
function gameOver() {
    // Display Game Over screen
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#e74c3c';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText('Final Score: ' + score, canvas.width / 2, canvas.height / 2 + 20);
}

// Event listeners for key presses
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

// Start the game
gameLoop();
