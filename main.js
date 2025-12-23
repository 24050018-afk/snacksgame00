const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const box = 20; 
let score = 0;
let currentSpeed = 150;
const minSpeed = 50;
let snake = [{ x: 8 * box, y: 8 * box }];
let food = {
    x: Math.floor(Math.random() * 16 + 1) * box,
    y: Math.floor(Math.random() * 16 + 1) * box
};
let d;
let gameRunning = true;

// Hàm điều khiển dùng chung cho cả bàn phím và nút bấm
function setDirection(newDir) {
    if (newDir == "LEFT" && d != "RIGHT") d = "LEFT";
    else if (newDir == "UP" && d != "DOWN") d = "UP";
    else if (newDir == "RIGHT" && d != "LEFT") d = "RIGHT";
    else if (newDir == "DOWN" && d != "UP") d = "DOWN";
}

// Lắng nghe bàn phím (cho PC)
document.addEventListener("keydown", (e) => {
    if(e.keyCode == 37) setDirection("LEFT");
    if(e.keyCode == 38) setDirection("UP");
    if(e.keyCode == 39) setDirection("RIGHT");
    if(e.keyCode == 40) setDirection("DOWN");
});

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

function draw() {
    if (!gameRunning) return;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ rắn neon
    snake.forEach((part, i) => {
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00f2ff";
        ctx.fillStyle = (i == 0) ? "#00f2ff" : "#008c95";
        ctx.fillRect(part.x + 2, part.y + 2, box - 4, box - 4);
    });

    // Vẽ mồi neon
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ff0044";
    ctx.fillStyle = "#ff0044";
    ctx.fillRect(food.x + 4, food.y + 4, box - 8, box - 8);
    ctx.shadowBlur = 0;

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.innerHTML = score;
        if (currentSpeed > minSpeed) currentSpeed -= 3;
        food = {
            x: Math.floor(Math.random() * (canvas.width/box - 1)) * box,
            y: Math.floor(Math.random() * (canvas.height/box - 1)) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        gameRunning = false;
        alert("GAME OVER! Điểm: " + score);
        location.reload();
        return;
    }

    snake.unshift(newHead);
    setTimeout(draw, currentSpeed);
}

draw();