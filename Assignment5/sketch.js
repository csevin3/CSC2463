let sounds = new Tone.Players ({
  'Fire' : "assets/fireinthehole.mp3",
  'Bass' : "assets/bass.mp3",
  'Boom' : "assets/boom.mp3",
  'Huh' : "assets/huh.mp3"
});

//Initialize variables for buttons and slider functions
let button1, button2, button3, button4;
let delAmt = new Tone.FeedbackDelay ("8n",0.5);
let distAmt = new Tone.Distortion (0.5);
sounds.toDestination();

let delaySlider, fbSlider, distSlicer;

sounds.connect (delAmt);
delAmt.connect(distAmt);
distAmt.toDestination();

function setup() {
  createCanvas(400, 400);

  //Create buttons for user to play sounds
  button1 = createButton('Bass');
  button1.position(85,150);
  button1.mousePressed(() =>sounds.player("Bass").start());

  button2 = createButton('Fire In The Hole');
  button2.position(85,75);
  button2.mousePressed(() =>sounds.player("Fire").start());

  button3 = createButton('Boom');
  button3.position(250,75);
  button3.mousePressed(() =>sounds.player("Boom").start());

  button4 = createButton('Huh');
  button4.position(250,150);
  button4.mousePressed(() =>sounds.player("Huh").start());



  delaySlider = createSlider (0.,0.9,0, 0.05);
  delaySlider.position (120,200);
  delaySlider.mouseMoved(() => {
    delay.delayTime.value = delaySlider.value();
  })

  fbSlider = createSlider (0,0.9,0,0.05);
  fbSlider.position(120,250);
  fbSlider.mouseMoved(() => delAmt.feedback.value = fbSlider.value());

  distSlider = createSlider(0,0.9,0,0.5);
  distSlider.position(120,300);
  distSlider.mouseMoved(() => distAmt.distortion = distSlider.value());

}

//Draw background and add text to describe what each slider does
function draw() {
  background(50,200,200);
  text ("Add delay with slider", 130, 300);
  text ("Add distortion with slider", 130, 200);
  text("Add Feedback with slider", 130, 250 );
}