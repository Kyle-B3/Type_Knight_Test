const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load knight sprite (replace with your own sprite URL if needed)
const knightSprite = new Image();
knightSprite.src = 'https://https://opengameart.org/content/a-2d-knight/knight.png'; // Add the link to your knight sprite image here

const tileSize = 64;
const mapWidth = canvas.width;
const mapHeight = canvas.height;

// Initial knight position
let knight = {
  x: tileSize * 3, // Start in third tile horizontally
  y: tileSize * 3, // Start in third tile vertically
  speed: 5, // Movement speed
};

// Keyboard input tracking
let keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Dungeon background (placeholder for now)
function drawDungeon() {
  for (let row = 0; row < mapHeight / tileSize; row++) {
    for (let col = 0; col < mapWidth / tileSize; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? '#888' : '#666'; // Checkerboard pattern
      ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
    }
  }
}

// Draw knight
function drawKnight() {
  ctx.drawImage(knightSprite, knight.x, knight.y, tileSize, tileSize);
}

// Update knight position based on input
function updateKnight() {
  if (keys['ArrowUp']) knight.y -= knight.speed;
  if (keys['ArrowDown']) knight.y += knight.speed;
  if (keys['ArrowLeft']) knight.x -= knight.speed;
  if (keys['ArrowRight']) knight.x += knight.speed;

  // Prevent knight from moving off-screen
  knight.x = Math.max(0, Math.min(knight.x, mapWidth - tileSize));
  knight.y = Math.max(0, Math.min(knight.y, mapHeight - tileSize));
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawDungeon(); // Draw the dungeon tiles
  updateKnight(); // Update the knight's position
  drawKnight(); // Draw the knight
  requestAnimationFrame(gameLoop); // Keep the game running
}

knightSprite.onload = function() {
  gameLoop(); // Start the game loop once the knight sprite is loaded
};
