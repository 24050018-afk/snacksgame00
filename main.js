const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const box = 20; 
let score = 0;

// Cấu hình tốc độ
let initialSpeed = 150; // Tốc độ khởi đầu (chậm: 150ms mỗi bước)
let currentSpeed = initialSpeed;
let minSpeed = 50;      // Tốc độ tối đa (nhanh nhất: 50ms mỗi bước)

let snake = [{ x: 10 * box, y: 10 * box }];
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let d;
let gameRunning = true;

document.addEventListener("keydown", direction);

function direction(event) {
    if (event.keyCode == 37 && d != "RIGHT") d = "LEFT";
    else if (event.keyCode == 38 && d != "DOWN") d = "UP";
    else if (event.keyCode == 39 && d != "LEFT") d = "RIGHT";
    else if (event.keyCode == 40 && d != "UP") d = "DOWN";
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

function draw() {
    if (!gameRunning) return;

    // Làm sạch canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ lưới mờ
    ctx.strokeStyle = "#161b22";
    for(let i=0; i<canvas.width; i+=box) {
        ctx.strokeRect(i, 0, box, canvas.height);
        ctx.strokeRect(0, i, canvas.width, box);
    }

    // Vẽ rắn phát sáng
    for (let i = 0; i < snake.length; i++) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00f2ff";
        ctx.fillStyle = (i == 0) ? "#00f2ff" : "#008c95";
        ctx.fillRect(snake[i].x + 2, snake[i].y + 2, box - 4, box - 4);
    }

    // Vẽ mồi phát sáng
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

    // Xử lý khi ăn mồi
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.innerHTML = score;
        
        // --- LOGIC TĂNG TỐC ---
        // Mỗi khi ăn 1 điểm, giảm 5ms độ trễ (nhanh dần lên)
        if (currentSpeed > minSpeed) {
            currentSpeed -= 5; 
        }

        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // Kiểm tra va chạm
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        gameRunning = false;
        alert("GAME OVER! Điểm của bạn: " + score);
        location.reload();
        return;
    }

    snake.unshift(newHead);

    // Thay vì setInterval, ta gọi lại hàm draw sau một khoảng thời gian currentSpeed
    setTimeout(draw, currentSpeed);
}

// Bắt đầu game lần đầu tiên
draw();