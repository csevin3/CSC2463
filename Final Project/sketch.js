let playerHP = 100;
let playerMP = 50;
let goblinHP = 80;
let gameLog = "";

// Declare variables for damage and heal ranges
let minBasicDamage = 5;
let maxBasicDamage = 10;
let minFireballDamage = 10;
let maxFireballDamage = 25;
let minHeal = 20;
let maxHeal = 30;

let gameLogArea;

function setup() {
  createCanvas(400, 400);
  
  let AttackButton = createButton('Basic Attack');
  AttackButton.position(50, 250);
  AttackButton.size(150,50);
  AttackButton.mousePressed(basicAttack);

  let FireballButton = createButton('Fireball');
  FireballButton.position(50,325);
  FireballButton.size(150,50);
  FireballButton.mousePressed(fireball);

  let HealButton = createButton('Heal')
  HealButton.position(225,250);
  HealButton.size(150,50);
  HealButton.mousePressed(heal);

  let EmpowerButton = createButton('Empower')
  EmpowerButton.position(225,325);
  EmpowerButton.size(150,50)
  EmpowerButton.mousePressed(empower);
  
  // Create a textarea for game log
  gameLogArea = createElement('textarea');
  gameLogArea.position(0, 120);
  gameLogArea.size(200, 120);
  gameLogArea.attribute('readonly', '');
}

function draw() {
  background(255);

  // Display player's health and mana points
  fill(0);
  textSize(16);
  textAlign(LEFT, CENTER);
  text(`Player HP: ${playerHP}/100`, 50, 50);
  text(`MP: ${playerMP}/50`, 50, 80);
  text(`Goblin HP: ${goblinHP}/80`, 50, 110);
  
  // Update game log content
  gameLogArea.value(gameLog);

  gameLogArea.elt.scrollTop = gameLogArea.elt.scrollHeight;
}

function basicAttack() {
  if (generateRandomHitChance()) {
    let damage = generateRandomDamage(5, 10);
    goblinHP -= damage;
    gameLog += "Player used basic attack! It did " + damage + " damage to goblin!\n";
  } else {
    gameLog += "Your Basic Attack missed!\n";
  }
  goblinTurn();
}

function fireball() {
  if (playerMP >= 6) {
    let damage = generateRandomDamage(10, 25);
    goblinHP -= damage;
    playerMP -= 6;
    gameLog += "Player used fireball! It did " + damage + " damage to goblin!\n";
  } else {
    gameLog += "Your action failed! You do not have enough MP!\n";
  }
  goblinTurn();
}

function heal() {
  if (playerMP >= 8) {
    let healing = generateRandomDamage(20, 30);
    playerMP -= 8;
    let healedAmount = Math.min(100 - playerHP, healing);
    playerHP += healedAmount;
    gameLog += "Player used heal and was healed for " + healedAmount + " health!\n";
  } else {
    gameLog += "Your action failed! You do not have enough MP!\n";
  }
  goblinTurn();
}

function empower() {
  if (playerMP >= 10) {
    playerMP -= 10;
    minBasicDamage += 1;
    maxBasicDamage += 2;
    minFireballDamage += 1;
    maxFireballDamage += 2;
    minHeal += 1;
    maxHeal += 2;
    gameLog += "Player used Empower and now has increased damage and healing!\n";
  } else {
    gameLog += "Your action failed! You do not have enough MP!\n";
  }
  goblinTurn();
}

function goblinTurn() {
  if (goblinHP <= 0) {
    gameLog += "You have defeated the goblin! Congratulations!\n";
    return;
  }

  let goblinTotalDamage = 0;
  for (let i = 0; i < 2; i++) {
    if (generateRandomHitChance()) {
      let damage = generateRandomDamage(3, 7);
      goblinTotalDamage += damage;
      gameLog += "Goblin hit you for " + damage + " damage!\n";
    } else {
      gameLog += "Goblin's attack missed!\n";
    }
  }
  playerHP -= goblinTotalDamage;

  if (playerHP <= 0) {
    gameLog += "You have been defeated by the goblin! Game over!\n";
    return;
  }
}

function generateRandomDamage(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomHitChance() {
  return Math.random() <= 0.5;
}