const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load knight sprite sheets for idle and running animations
const knightIdle = new Image();
knightIdle.src = 'https://cdn.discordapp.com/attachments/1283040679026757809/1289736098209202186/knight_m_idle_anim_f0-sheet.png?ex=66fbe217&is=66fa9097&hm=269d36a10c3427ba7f3e2043c562217ad7b3c31aae91164e93d2bf3ee230eab2&'; // Your idle sprite sheet

const knightRun = new Image();
knightRun.src = 'https://cdn.discordapp.com/attachments/1283040679026757809/1289736098448412682/knight_m_run_anim_f0-sheet.png?ex=66fbe218&is=66fa9098&hm=ed489a285577e435e3b8fde70acaf5e25ce010df5c174f3d34758baeee5750d0&'; // Your run sprite sheet

const enemyIdle = new Image();
enemyIdle.src = 'https://cdn.discordapp.com/attachments/1283040679026757809/1290042935072653343/slug_anim_f0-sheet.png?ex=66fc571b&is=66fb059b&hm=9c97622653e87530a895445082f0d2f73813125d91f180db5f9ee5f09d29284b&'; // Replace with the enemy's idle sprite sheet

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
  frameWidth: 16,   // Width of a single frame in the sprite sheet
  frameHeight: 30,  // Height of a single frame in the sprite sheet
  totalFramesIdle: 4,  // Total number of frames in the idle sprite sheet
  totalFramesRun: 4,   // Total number of frames in the run sprite sheet
  currentAnimation: 'idle', // The current animation type ('idle' or 'run')
  frameDelay: 10,     // Delay before switching to the next frame
  frameCounter: 0,    // Counter to control the animation speed
  direction: 'right'  // Direction the knight is facing ('right' or 'left')
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
// Load the stone texture for the dungeon background
const stoneTexture = new Image();
stoneTexture.src = 'https://opengameart.org/sites/default/files/Stony%20Wall.png'; // Replace with the URL or path to your stone texture image

// Dungeon background (with scaled stone texture)
function drawDungeon() {
    if (stoneTexture.complete) {
      const tileSize = 128;  // Set the desired size for the stone tiles (in pixels)
  
      // Loop through the canvas, drawing the stone texture at the specified size
      for (let y = 0; y < canvas.height; y += tileSize) {
        for (let x = 0; x < canvas.width; x += tileSize) {
          ctx.drawImage(stoneTexture, x, y, tileSize, tileSize);  // Draw the stone texture, scaled to tileSize
        }
      }
    } else {
      // If the texture hasn't loaded yet, use a placeholder color
      ctx.fillStyle = '#444';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

// Draw the knight with animation, flipping it if necessary
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

  if (knight.direction === 'left') {
    ctx.save(); // Save the current canvas state

    // Flip the canvas horizontally
    ctx.scale(-1, 1);

    // Correct knight position for the flipped canvas
    ctx.translate(-knight.x * 2 - tileSize, 0);

    // Draw the flipped knight
    ctx.drawImage(
      spriteSheet,
      knight.frameX * knight.frameWidth, // X coordinate of the current frame on the sprite sheet
      knight.frameY * knight.frameHeight, // Y coordinate (assuming one row, keep it 0)
      knight.frameWidth,
      knight.frameHeight,
      knight.x, knight.y, // Position on the canvas
      tileSize, tileSize // Size to draw the frame (scaled to tile size)
    );
    ctx.restore(); // Restore the canvas state back to normal
  } else {
    // Draw the knight normally (facing right)
    ctx.drawImage(
      spriteSheet,
      knight.frameX * knight.frameWidth, // X coordinate of the current frame on the sprite sheet
      knight.frameY * knight.frameHeight, // Y coordinate (assuming one row, keep it 0)
      knight.frameWidth,
      knight.frameHeight,
      knight.x, knight.y, // Position on the canvas
      tileSize, tileSize // Size to draw the frame (scaled to tile size)
    );
  }
}



// Update knight position and switch animations and directions
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
    knight.direction = 'left';  // Change direction to left
    isMoving = true;
  }
  if (keys['ArrowRight']) {
    knight.x += knight.speed;
    knight.direction = 'right';  // Change direction to right
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

// Draw the enemy with idle animation
function drawEnemy() {
    enemy.frameCounter++;
    if (enemy.frameCounter >= enemy.frameDelay) {
      enemy.frameX = (enemy.frameX + 1) % enemy.totalFrames;
      enemy.frameCounter = 0;  // Reset the counter
    }
  
    ctx.drawImage(
      enemyIdle,
      enemy.frameX * enemy.frameWidth,
      0,  // Assuming single row of frames for the enemy
      enemy.frameWidth,
      enemy.frameHeight,
      enemy.x,
      enemy.y,
      tileSize,
      tileSize
    );
  }

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
  drawDungeon();                                    // Draw the dungeon tiles
  //drawEnemy();
  updateKnight();                                   // Update knight position and animation state
  drawKnight();                                     // Draw the knight with animation
  //drawEnemy();
 
  requestAnimationFrame(gameLoop);                  // Keep the game running
}

// Start the game loop after both sprite sheets are loaded
knightIdle.onload = function() {
  knightRun.onload = function() {
    gameLoop();  // Start the game once both animations are ready
  };
};
