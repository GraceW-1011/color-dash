const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 400, y: 300, size: 40, color: "#00f", speed: 5 };
let obstacles = [];
let powerUps = [];
let score = 0;
let powerUpActive = false;
let powerUpTimer = 0;
const keys = {};
const colors = ["#e63946", "#f1faee", "#a8dadc", "#457b9d", "#2a9d8f"];

function spawnObstacle() {
  let size = Math.random() * 30 + 20;
  let x = Math.random() * canvas.width;
  let y = -size;
  let color = colors[Math.floor(Math.random() * colors.length)];
  let speed = Math.random() * 2 + 2;
  obstacles.push({ x, y, size, color, speed });
}

function spawnPowerUp() {
  let size = 20;
  let x = Math.random() * (canvas.width - size);
  let y = -size;
  powerUps.push({ x, y, size, color: "#ff0", speed: 2 });
}

document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

function update() {
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].y += obstacles[i].speed;
    if (
      player.x < obstacles[i].x + obstacles[i].size &&
      player.x + player.size > obstacles[i].x &&
      player.y < obstacles[i].y + obstacles[i].size &&
      player.y + player.size > obstacles[i].y
    ) {
      if (!powerUpActive) {
        score = 0;
        obstacles = [];
        powerUps = [];
        break;
      }
    }
    if (obstacles[i].y > canvas.height) {
      obstacles.splice(i, 1);
      score++;
    }
  }

  for (let i = powerUps.length - 1; i >= 0; i--) {
    powerUps[i].y += powerUps[i].speed;
    if (
      player.x < powerUps[i].x + powerUps[i].size &&
      player.x + player.size > powerUps[i].x &&
      player.y < powerUps[i].y + powerUps[i].size &&
      player.y + player.size > powerUps[i].y
    ) {
      powerUpActive = true;
      powerUpTimer = 300;
      powerUps.splice(i, 1);
    } else if (powerUps[i].y > canvas.height) {
      powerUps.splice(i, 1);
    }
  }

  if (powerUpActive) {
    powerUpTimer--;
    player.color = "#0f0";
    if (powerUpTimer <= 0) {
      powerUpActive = false;
      player.color = "#00f";
    }
  }
}

function draw() {
  let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#ff9a9e");
  gradient.addColorStop(1, "#fad0c4");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);

  for (let obs of obstacles) {
    ctx.fillStyle = obs.color;
    ctx.beginPath();
    ctx.arc(obs.x, obs.y, obs.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let pu of powerUps) {
    ctx.fillStyle = pu.color;
    ctx.fillRect(pu.x, pu.y, pu.size, pu.size);
  }

  ctx.fillStyle = "#333";
  ctx.font = "24px Verdana";
  ctx.fillText("Score: " + score, 10, 30);

  if (powerUpActive) {
    ctx.fillStyle = "#0f0";
    ctx.fillText("Invincible!", canvas.width - 150, 30);
  }
}

function gameLoop() {
  update();
  draw();
  if (Math.random() < 0.05) spawnObstacle();
  if (Math.random() < 0.01) spawnPowerUp();
  requestAnimationFrame(gameLoop);
}

gameLoop();
