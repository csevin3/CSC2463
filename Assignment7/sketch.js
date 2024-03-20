let env, osc1, osc2;
let carHornImg;

function preload() {
  carHornImg = loadImage('assets/carhorn.jpg');
}

function setup() {
  createCanvas(400, 400);
  
  env = new Tone.AmplitudeEnvelope({
    attack: 0.1,
    decay: 0.2,
    sustain: 0.5,
    release: 0.5
  }).toDestination();

  osc1 = new Tone.Oscillator({
    frequency: 200,
    type: 'sawtooth'
  }).connect(env);

  osc2 = new Tone.Oscillator({
    frequency: 500,
    type: 'square'
  }).connect(env);

  osc1.start();
  osc2.start();
}

function draw() {
  background(220);
  
  image(carHornImg, width / 2 - carHornImg.width / 2, height / 2 - carHornImg.height / 2);
}

function mousePressed() {
  // Trigger car horn sound
  env.triggerAttackRelease(1);
}
