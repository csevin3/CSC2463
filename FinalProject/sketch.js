let playerHP = 100;
let playerMP = 50;
let slimeHP = 80;
let gameLog = "";

// Declare variables for damage and heal ranges
let minPunchDamage = 5;
let maxPunchDamage = 10;
let minFireballDamage = 10;
let maxFireballDamage = 25;
let minHeal = 20;
let maxHeal = 30;

let gameLogArea;

let slimeSheet; // Variable to hold the spritesheet image
let frameWidth, frameHeight; // Width and height of each frame
let currentFrame = 0; // Current frame index
let frameCounter = 0; // Frame counter to control animation speed
let frameDelay = 10; // Number of frames to wait before advancing to the next frame

// Declare sound variables
let punchSound;
let fireballSound;
let healSound;
let chargeSound;
let wompSound;
let musicSound;

function preload() {
  // Load the spritesheet
  slimeSheet = loadImage('assets/slime.png');
  
  // Load the sound file
  punchSound = loadSound('assets/punch.mp3');
  fireballSound = loadSound('assets/fireball.mp3');
  healSound = loadSound('assets/heal.mp3');
  chargeSound = loadSound('assets/charge.mp3');
  wompSound = loadSound('assets/womp.mp3');
  musicSound = loadSound('assets/music.mp3');
}

function setup() {
  createCanvas(600, 600);
  frameWidth = slimeSheet.width; // Width of each frame is the same as the spritesheet width
  frameHeight = slimeSheet.height / 2; // Height of each frame is half the spritesheet height

  musicSound.loop();
  
  let PunchButton = createButton('Punch');
  PunchButton.position(50, 250);
  PunchButton.size(150,50);
  PunchButton.mousePressed(punch);

  let FireballButton = createButton('Fireball');
  FireballButton.position(50,325);
  FireballButton.size(150,50);
  FireballButton.mousePressed(fireball);

  let HealButton = createButton('Heal')
  HealButton.position(225,250);
  HealButton.size(150,50);
  HealButton.mousePressed(heal);

  let ChargeButton = createButton('Charge')
  ChargeButton.position(225,325);
  ChargeButton.size(150,50)
  ChargeButton.mousePressed(charge);
  
  // Create a textarea for game log
  gameLogArea = createElement('textarea');
  gameLogArea.position(50, 120);
  gameLogArea.size(200, 100);
  gameLogArea.attribute('readonly', '');
}

function draw() {
  background(255);
  
  // Increment frame counter
  frameCounter++;
  
  // Display the current frame at the top-left corner of the canvas
  let xPos = 300; // Adjust X position as needed
  let yPos = 100; // Adjust Y position as needed
  image(slimeSheet, xPos, yPos, frameWidth * 2, frameHeight * 2, 0, currentFrame * frameHeight, frameWidth, frameHeight);

  // Change frame if enough frames have passed
  if (frameCounter >= frameDelay) {
    currentFrame++;
    if (currentFrame >= 2) {
      currentFrame = 0; // Reset back to the first frame if we reach the end
    }
    frameCounter = 0; // Reset the frame counter
  }

  // Display player's health and mana points
  fill(0);
  textSize(16);
  textAlign(LEFT, CENTER);
  text(`Player HP: ${playerHP}/100`, 50, 50);
  text(`MP: ${playerMP}/50`, 50, 80);
  text(`Slime HP: ${slimeHP}/80`, 50, 110);
  
  // Update game log content
  gameLogArea.value(gameLog);

  gameLogArea.elt.scrollTop = gameLogArea.elt.scrollHeight;

  // Check if slime's health is 0 or below, display YOU WIN if true
  if (slimeHP <= 0) {
    fill(0, 255, 0); // Green color
    textSize(32);
    textAlign(CENTER, TOP);
    text("YOU WIN", width / 2, 10); // Display at the top with a margin of 10 pixels
    noLoop(); // Stop the draw loop to prevent further updates
  } else if (playerHP <= 0) {
    fill(255, 0, 0); // Red color
    textSize(32);
    textAlign(CENTER, TOP);
    text("GAME OVER", width / 2, 10); // Display at the top with a margin of 10 pixels
    noLoop(); // Stop the draw loop to prevent further updates
  }
}

function punch() {
  if (generateRandomHitChance()) {
    let damage = generateRandomDamage(minPunchDamage, maxPunchDamage);
    slimeHP -= damage;
    gameLog += "Player used punch! It did " + damage + " damage to slime!\n";
    punchSound.play(); // Play punch sound
  } else {
    gameLog += "Your Punch missed!\n";
    wompSound.play();
  }
  slimeTurn();
}

function fireball() {
  if (playerMP >= 10) {
    let damage = generateRandomDamage(minFireballDamage, maxFireballDamage);
    slimeHP -= damage;
    playerMP -= 10;
    gameLog += "Player used fireball! It did " + damage + " damage to slime!\n";
    fireballSound.play();
  } else {
    gameLog += "Your action failed! You do not have enough MP!\n";
    wompSound.play();
  }
  slimeTurn();
}

function heal() {
  if (playerMP >= 8) {
    let healing = generateRandomDamage(minHeal, maxHeal);
    playerMP -= 8;
    let healedAmount = Math.min(100 - playerHP, healing);
    playerHP += healedAmount;
    gameLog += "Player used heal and was healed for " + healedAmount + " health!\n";
    healSound.play();
  } else {
    gameLog += "Your action failed! You do not have enough MP!\n";
    wompSound.play();
  }
  slimeTurn();
}

function charge() {
  if (playerMP >= 10) {
    playerMP -= 10;
    minPunchDamage += 1;
    maxPunchDamage += 2;
    minFireballDamage += 1;
    maxFireballDamage += 2;
    minHeal += 1;
    maxHeal += 2;
    gameLog += "Player used Charge and now has increased damage and healing!\n";
    chargeSound.play();
  } else {
    gameLog += "Your action failed! You do not have enough MP!\n";
    wompSound.play();
  }
  slimeTurn();
}

function slimeTurn() {
  if (slimeHP <= 0) {
    gameLog += "You have defeated the slime! Congratulations!\n";
    return;
  }

  let slimeTotalDamage = 0;
  for (let i = 0; i < 2; i++) {
    if (generateRandomHitChance()) {
      let damage = generateRandomDamage(3, 7);
      slimeTotalDamage += damage;
      gameLog += "Slime hit you for " + damage + " damage!\n";
    } else {
      gameLog += "Slime's attack missed!\n";
    }
  }
  playerHP -= slimeTotalDamage;

  if (playerHP <= 0) {
    gameLog += "You have been defeated by the slime! Game over!\n";
    return;
  }
}

function generateRandomDamage(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomHitChance() {
  return Math.random() <= 0.5;
}
