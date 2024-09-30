const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load knight sprite sheets for idle and running animations
const knightIdle = new Image();
knightIdle.src = 'https://cdn.discordapp.com/attachments/1283040679026757809/1289736098209202186/knight_m_idle_anim_f0-sheet.png?ex=66fbe217&is=66fa9097&hm=269d36a10c3427ba7f3e2043c562217ad7b3c31aae91164e93d2bf3ee230eab2&'; // Your idle sprite sheet

const knightRun = new Image();
knightRun.src = 'https://cdn.discordapp.com/attachments/1283040679026757809/1289736098448412682/knight_m_run_anim_f0-sheet.png?ex=66fbe218&is=66fa9098&hm=ed489a285577e435e3b8fde70acaf5e25ce010df5c174f3d34758baeee5750d0&'; // Replace with your running sprite sheet

const tileSize = 64;
const mapWidth = canvas.width;
const mapHeight = canvas.height;

// Animation properties
const knight = {
  x: tileSize * 3,  // Starting position on the x-axis
  y: tileSize * 3,  // Starting position on the y-axis
  speed: 5,         // Movement speed
  frameX: 0,        // Current frame in the sprite sheet (for the X-axis)
  frameY: 0,        // Current row in the sprite sheet (not needed if one row)
  frameWidth: 64,   // Width of a single frame in the sprite sheet
  frameHeight: 64,  // Height of a single frame in the sprite sheet
  totalFramesIdle: 4,  // Total number of frames in the idle sprite sheet
  totalFramesRun: 6,   // Assuming 6 frames for running (adjust this as needed)
  currentAnimation: 'idle', // The current animation type ('idle' or 'run')
  frameDelay: 8,     // Delay before switching to the next frame
  frameCounter: 0    // Counter to control the animation speed
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

// Draw the knight with animation
function drawKnight() {
  let spriteSheet;
  let totalFrames;

  // Determine which sprite sheet to use and the total number of frames
  if (knight.currentAnimation === 'run') {
    spriteSheet = knightRun;
    totalFrames = knight.totalFramesRun;
  } else {
    spriteSheet = knightIdle;
    totalFrames = knight.totalFramesIdle;
  }

  // Update frame for animation
  knight.frameCounter++;
  if (knight.frameCounter >= knight.frameDelay) {
    knight.frameX = (knight.frameX + 1) % totalFrames;
    knight.frameCounter = 0; // Reset the counter
  }

  // Draw the current frame of the knight
  ctx.drawImage(
    spriteSheet,                    // Source image (sprite sheet)
    knight.frameX * knight.frameWidth, // X coordinate of the current frame on the sprite sheet
    knight.frameY * knight.frameHeight, // Y coordinate (assuming one row, keep it 0)
    knight.frameWidth,              // Width of the frame on the sprite sheet
    knight.frameHeight,             // Height of the frame on the sprite sheet
    knight.x, knight.y,             // Position to draw the knight on the canvas
    tileSize, tileSize              // Size to draw the frame (scaled to tile size)
  );
}

// Update knight position and switch animations
function updateKnight() {
  let isMoving = false;

  if (keys['ArrowUp']) {
    knight.y -= knight.speed;
    isMoving = true;
  }
  if (keys['ArrowDown']) {
    knight.y += knight.speed;
    isMoving = true;
  }
  if (keys['ArrowLeft']) {
    knight.x -= knight.speed;
    isMoving = true;
  }
  if (keys['ArrowRight']) {
    knight.x += knight.speed;
    isMoving = true;
  }

  // Change animation based on movement
  if (isMoving) {
    knight.currentAnimation = 'run';
  } else {
    knight.currentAnimation = 'idle';
  }

  // Prevent knight from moving off-screen
  knight.x = Math.max(0, Math.min(knight.x, mapWidth - tileSize));
  knight.y = Math.max(0, Math.min(knight.y, mapHeight - tileSize));
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
  drawDungeon();                                    // Draw the dungeon tiles
  updateKnight();                                   // Update knight position and animation state
  drawKnight();                                     // Draw the knight with animation
  requestAnimationFrame(gameLoop);                  // Keep the game running
}

// Start the game loop after both sprite sheets are loaded
knightIdle.onload = function() {
  knightRun.onload = function() {
    gameLoop();  // Start the game once both animations are ready
  };
};
