const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = Math.min(400, window.innerWidth - 20);
canvas.height = Math.min(600, window.innerHeight - 150);

let player, enemies, score, bestScore;
let running = false;
let speed = 2;

bestScore = localStorage.getItem("bestScore") || 0;
document.getElementById("best").innerText = "Best: " + bestScore;

player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  size: 16,
  speed: 5
};

enemies = [];
score = 0;

function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 20),
    y: -20,
    size: 12 + Math.random() * 10,
    speed: speed + Math.random() * 2
  });
}

function resetGame() {
  enemies = [];
  score = 0;
  speed = 2;
  player.x = canvas.width / 2;
  player.y = canvas.height - 50;
}

function update() {
  if (!running) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "#0af";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Enemies
  ctx.fillStyle = "#f33";
  enemies.forEach((e, i) => {
    e.y += e.speed;
    ctx.fillRect(e.x, e.y, e.size, e.size);

    // Collision
    if (
      player.x < e.x + e.size &&
      player.x + player.size > e.x &&
      player.y < e.y + e.size &&
      player.y + player.size > e.y
    ) {
      gameOver();
    }

    if (e.y > canvas.height) {
      enemies.splice(i, 1);
      score++;
      document.getElementById("score").innerText = "Score: " + score;

      if (score % 10 === 0) speed += 0.5;
    }
  });

  if (Math.random() < 0.03) spawnEnemy();

  requestAnimationFrame(update);
}

function gameOver() {
  running = false;
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
    document.getElementById("best").innerText = "Best: " + bestScore;
  }
  alert("Game Over! Score: " + score);
}

document.getElementById("startBtn").onclick = () => {
  resetGame();
  running = true;
  update();
};

// Keyboard
document.addEventListener("keydown", e => {
  if (!running) return;
  if (e.key === "ArrowLeft" || e.key === "a") player.x -= player.speed;
  if (e.key === "ArrowRight" || e.key === "d") player.x += player.speed;
  if (e.key === "ArrowUp" || e.key === "w") player.y -= player.speed;
  if (e.key === "ArrowDown" || e.key === "s") player.y += player.speed;
});

// Touch (mobile)
canvas.addEventListener("touchmove", e => {
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  player.x = touch.clientX - rect.left - player.size / 2;
  player.y = touch.clientY - rect.top - player.size / 2;
});
