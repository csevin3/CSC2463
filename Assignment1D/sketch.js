function setup() {
  createCanvas(200,200);
}

function draw() {
  background('blue');

  stroke('white');
  strokeWeight(3);
  fill('green');
  circle(100,100,120);

  fill('red');
  beginShape();
  vertex(100,40);
  vertex(80,80);
  vertex(40,80);
  vertex(70,100);
  vertex(60,140);
  vertex(100,120);
  vertex(140,140);
  vertex(130,100);
  vertex(160,80);
  vertex(120,80);
  vertex(100,40);
  endShape();
}