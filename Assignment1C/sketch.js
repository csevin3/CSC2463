function setup() {
  createCanvas(200, 100);
  angleMode(DEGREES);
}

function draw() {
  background(0);
  fill('yellow');
  arc(50,50,80,80,225,150,);

  noStroke();
  fill('red');
  rect(110,41,80,50);
  arc(150,46,80,80,180,360);

  fill('white');
  circle(130,50,23);
  circle(170,50,23);

  fill('blue')
  circle(130,50,15);
  circle(170,50,15);
}