let port;
let writer, reader;
let backgroundColor = 0;
let incomingBuffer = "";

function setup() {
  createCanvas(400, 400);

  if ("serial" in navigator) {
    let button = createButton("Connect");
    button.position(0, 0);
    button.mousePressed(connect);
  }
}

function draw() {
  background(backgroundColor);
}

function mouseClicked() {
  serialWrite("toggle");
}

async function connect() {
  port = await navigator.serial.requestPort();
  await port.open({ baudRate: 9600 });

  reader = port.readable.getReader();
  writer = port.writable.getWriter();

  readLoop();
}

async function readLoop() {
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      console.log("Reader closed, exiting read loop");
      reader.releaseLock();
      break;
    }

    if (value) {
      const stringValue = new TextDecoder().decode(value); 
      incomingBuffer += stringValue; 
      let eolIndex;
      while ((eolIndex = incomingBuffer.indexOf('\n')) >= 0) { 
        const line = incomingBuffer.substring(0, eolIndex).trim();
        if (line) {
          const potValue = parseInt(line);
          if (!isNaN(potValue)) {
            backgroundColor = map(potValue, 0, 1023, 0, 255);
          }
        }
        incomingBuffer = incomingBuffer.substring(eolIndex + 1); 
      }
    }
  }
}

function serialWrite(data) {
  if (writer) {
    writer.write(new TextEncoder().encode(data + "\n"));
  }
}

function map(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}