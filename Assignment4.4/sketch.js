let bugs = [];
let numBugs = 30;
let timeRemaining = 30;
let gameOver = false;
let directionChangeDelay = 1000;
let squishImage;
let squishedBugsCounter = 0;
// let sounds = new Tone.Players ({
//  'Squish' : 'assets/Squish.mp3',
//  'Miss' : 'assets/Miss.mp3',
//  'BGM' : 'assets/BGM.wav'
// })
let port;
let joyX = 0, joyY = 0, sw = 0;
let connectButton;
let circleX, circleY;
let speed = 3;
let circleRadius = 25;


//sounds.toDestination();

function preload() {
  squishImage = loadImage('assets/squish.png');
}

function setup() {
  createCanvas(400, 400);

  for (let i = 0; i < numBugs; i++) {
    bugs.push(new Bug(random(width), random(height)));
  }
  
  //sounds.player("BGM").start();

  port = createSerial();
  createCanvas(400, 400);
  circleX = width / 2;
  circleY = height / 2;

  connectButton = createButton("Connect");
  connectButton.mouseClicked(connect);

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


    let str = port.readUntil("\n");
    let values = str.split(",");
    if (values.length > 2) {
    joyX = values[0];
    joyY = values[1];
    sw = Number(values[2]);

    if (joyX > 0) {
      circleX += speed;
    } else if (joyX < 0) {
      circleX -= speed;
    }

    if (joyY > 0) {
      circleY += speed;
    } else if (joyY < 0) {
      circleY -= speed;
    }
  }

  if (sw == 1) {
    fill("purple");
    for (let i = 0; i < bugs.length; i++) {
      let d = dist(circleX, circleY, bugs[i].sprite.position.x, bugs[i].sprite.position.y);
      if (d < circleRadius) {
        bugs[i].handleClick(circleX, circleY);
      }
    }
  }
  else {
    fill(255);
  }
  circle(circleX, circleY, circleRadius);
}

function connect() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
  } else {
    port.close();
  }
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

class Bug {
  constructor(x, y) {
    this.sprite = createSprite(x, y, 32, 32);
    this.sprite.spriteSheet = 'assets/spider.png';
    let animations = {
      squish : 'assets/squish.png',
      move: { row: 0, frames: 6 }
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
  
  handleClick(cx, cy) {
    let d = dist(cx, cy, this.sprite.position.x, this.sprite.position.y);
    if (d < 16) {
      this.clicked = !this.clicked;
      if (this.clicked) {
        this.sprite.changeAni('squish');
        this.sprite.velocity.x = 0;
        this.sprite.velocity.y = 0;
        squishedBugsCounter++;
        //sounds.player("Squish").start();
        port.write('S');
      }
    }
    if (!this.clicked) {
      //sounds.player("Miss").start();
    }
  }
}