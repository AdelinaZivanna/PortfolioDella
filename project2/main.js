const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake, direction, food, score, speed, gameLoopId, paused;
let highScore = localStorage.getItem("highScore") || 0;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

document.getElementById("score").innerText = "Score: 0 | High: " + highScore;

// Suara
const eatSound = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
const gameOverSound = new Audio("https://www.fesliyanstudios.com/play-mp3/6671");

// START GAME
function startGame(selectedSpeed) {
  document.getElementById("levelSelect").style.display = "none";
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  food = spawnFood();
  score = 0;
  speed = selectedSpeed;
  paused = false;
  updateScore();
  restartLoop();
}

document.addEventListener("keydown", setDirection);

function setDirection(e) {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === " ") paused = !paused; // spasi = pause
}

function drawEmoji(text, x, y) {
  ctx.font = "20px serif";
  ctx.fillText(text, x + 2, y + 18);
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  };
}

function updateScore() {
  document.getElementById("score").innerText =
    "Score: " + score + " | High: " + Math.max(score, highScore);
}

function draw() {
  if (paused) return; // kalau pause, skip draw

  ctx.clearRect(0, 0, 400, 400);

  // Food
  drawEmoji("🍎", food.x, food.y);

  // Snake
  snake.forEach((s, i) => {
    drawEmoji(i === 0 ? "🐍" : "🟩", s.x, s.y);
  });

  // Gerakan kepala
  let headX = snake[0].x;
  let headY = snake[0].y;
  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;
  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;

  // Collision
  if (
    headX < 0 || headX >= 400 || headY < 0 || headY >= 400 ||
    snake.some(seg => seg.x === headX && seg.y === headY)
  ) {
    gameOverSound.play();
    clearInterval(gameLoopId);
    if (score > highScore) {
      localStorage.setItem("highScore", score);
      highScore = score;
    }
    updateLeaderboard(score);
    document.getElementById("finalScore").innerText = "Skormu: " + score;
    showLeaderboard();
    document.getElementById("gameOverPopup").style.display = "flex";
    return;
  }

  let newHead = { x: headX, y: headY };

  if (headX === food.x && headY === food.y) {
    eatSound.play();
    score++;
    updateScore();
    food = spawnFood();
    // snake "blink" pas makan
    canvas.style.borderColor = "yellow";
    setTimeout(() => (canvas.style.borderColor = "lime"), 200);
    // nambah speed tiap 5 poin
    if (speed > 50 && score % 5 === 0) {
      speed -= 10;
      restartLoop();
    }
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

function tryAgain() {
  document.getElementById("gameOverPopup").style.display = "none";
  document.getElementById("levelSelect").style.display = "block";
}

function cancelGame() {
  document.getElementById("gameOverPopup").innerHTML = `
    <div class="popup">
      <h2>Game Berakhir 😴 </h2>
      <p>Follow @adellazivannea on Instagram</p>
    </div>`;
}

// Leaderboard
function updateLeaderboard(score) {
  leaderboard.push(score);
  leaderboard.sort((a, b) => b - a);
  leaderboard = leaderboard.slice(0, 3);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}
function showLeaderboard() {
  const ul = document.getElementById("leaderboard");
  ul.innerHTML = "";
  leaderboard.forEach((s, i) => {
    ul.innerHTML += `<li>${i + 1}. ${s}</li>`;
  });
}

function restartLoop() {
  clearInterval(gameLoopId);
  gameLoopId = setInterval(draw, speed);
}
