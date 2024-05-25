const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');
const resumeButton = document.getElementById('resumeButton');

canvas.width = 400;
canvas.height = 400;

const box = 20;
let score = 0;
let snake = [];
let food;
let d;
let game;
let gamePaused = true;
let gameOver = false;

startButton.addEventListener('click', startGame);
resumeButton.addEventListener('click', toggleGame);
document.addEventListener('keydown', direction);

function startGame() {
    score = 0;
    scoreElement.textContent = score;
    snake = [{ x: 9 * box, y: 10 * box }];
    d = undefined;
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };
    gameOver = false;
    gamePaused = false;
    startButton.disabled = true;
    resumeButton.disabled = false;
    clearInterval(game);  // Ensure no existing game intervals are running
    game = setInterval(draw, 100);
}

function toggleGame() {
    if (gamePaused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

function resumeGame() {
    if (gamePaused && !gameOver) {
        gamePaused = false;
        clearInterval(game);  // Ensure no existing game intervals are running
        game = setInterval(draw, 100);
        resumeButton.textContent = "Pause Game";
    }
}

function pauseGame() {
    if (!gamePaused && !gameOver) {
        gamePaused = true;
        clearInterval(game);
        resumeButton.textContent = "Resume Game";
    }
}

function direction(event) {
    if (event.keyCode === 37 && d !== 'RIGHT') {
        d = 'LEFT';
    } else if (event.keyCode === 38 && d !== 'DOWN') {
        d = 'UP';
    } else if (event.keyCode === 39 && d !== 'LEFT') {
        d = 'RIGHT';
    } else if (event.keyCode === 40 && d !== 'UP') {
        d = 'DOWN';
    }
}

function collision(newHead, snake) {
    for (let i = 0; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    if (gamePaused) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'green' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = 'red';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreElement.textContent = score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (
        snakeX < 0 || 
        snakeY < 0 || 
        snakeX >= canvas.width || 
        snakeY >= canvas.height || 
        collision(newHead, snake)
    ) {
        clearInterval(game);
        gameOver = true;
        alert('Game Over');
        startButton.disabled = false;
        resumeButton.disabled = true;
    } else {
        snake.unshift(newHead);
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !gameOver) {
        toggleGame();
    }
});
