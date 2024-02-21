class Bug {
  constructor(x, y) {
    this.sprite = createSprite(x, y, 32, 32);
    this.sprite.spriteSheet = 'assets/spider.png';
    let animations = {
      squish: { row: 3, frames: 1 },
      move: { row: 0, frames: 4 }
    };
    this.sprite.anis.frameDelay = 4;
    this.sprite.addAnis(animations);
    this.sprite.changeAni('move');
    this.lastDirectionChangeTime = 0;

    this.clicked = false;
  }

  update(bugs) {
    if (!this.clicked) {
      if (this.sprite.position.x < 0 || this.sprite.position.x > width) {
        this.sprite.velocity.x *= -1;
      }
      if (this.sprite.position.y < 0 || this.sprite.position.y > height) {
        this.sprite.velocity.y *= -1;
      }
  
      if (millis() - this.lastDirectionChangeTime > directionChangeDelay) {
        this.sprite.velocity.x = random(-1, 1);
        this.sprite.velocity.y = random(-1, 1);
        this.lastDirectionChangeTime = millis();
      }
      this.sprite.rotation = atan2(this.sprite.velocity.y, this.sprite.velocity.x) + PI / 2;
      this.sprite.update();
    }
  }
  
  handleClick() {
    if (mouseX >= this.sprite.position.x - 16 && mouseX <= this.sprite.position.x + 16 &&
        mouseY >= this.sprite.position.y - 16 && mouseY <= this.sprite.position.y + 16) {
      this.clicked = !this.clicked;
      if (this.clicked) {
        this.sprite.changeAni('squish');
        this.sprite.velocity.x = 0;
        this.sprite.velocity.y = 0;
        squishedBugsCounter++;
      }
    }
  }
}

let bugs = [];
let numBugs = 30;
let timeRemaining = 30;
let gameOver = false;
let directionChangeDelay = 1000;
let squishImage;
let squishedBugsCounter = 0;

function preload() {
  squishImage = loadImage('assets/squish.png');
}

function setup() {
  createCanvas(400, 400);

  for (let i = 0; i < numBugs; i++) {
    bugs.push(new Bug(random(width), random(height)));
  }
}

function draw() {
  background(220);

  if (gameOver) {
    gameDone();
  }

  for (let i = 0; i < bugs.length; i++) {
    bugs[i].update(bugs);
  }

  textSize(16);
  text("Time: " + ceil(timeRemaining), width - 100, 20);
  text("Squished Bugs: " + squishedBugsCounter, width - 150, 40);

  timeRemaining -= deltaTime / 1000;
  if (timeRemaining < 0)
    gameOver = true;
}

function gameDone() {
  text("Time's Up!", 100, 100);
  noLoop();
}

function mouseClicked() {
  for (let i = 0; i < bugs.length; i++) {
    bugs[i].handleClick();
  }
}