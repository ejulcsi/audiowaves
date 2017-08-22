var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var audio = document.querySelector('audio');
var analyser = audioContext.createAnalyser();
var gainNode = audioContext.createGain();
var source = audioContext.createMediaElementSource(audio);
source.connect(analyser);
source.connect(gainNode);
gainNode.connect(analyser);
analyser.connect(audioContext.destination);


var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var button = document.querySelector("button");
var playing = false;

ctx.clearRect(0, 0, canvas.width, canvas.height);

button.addEventListener('click', function() {
  if (playing) {
    audio.pause();
  } else {
    audio.play();
    playing = true;
  }
});


window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

analyser.fftSize = 512;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
analyser.getByteFrequencyData(dataArray);


function groupData() {
  var groups = [];
  var levels = 13;
  var level = [];
  for (var j = 1; j < levels + 1; j++) {
    for (var i = 0; i < bufferLength; i++) {
      if (i < j * bufferLength / levels) {
        level.push(dataArray[i]);
      }
    }
    var sum = level.reduce(function(a,b) {
      return a + b;
    });
    var avg = sum / level.length;
    groups.push(avg);
  }

  return groups;
}


function draw() {
  drawVisual = requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var grouped = groupData();
  var barWidth = canvas.width / grouped.length;
  var barHeight;
  var x = 0;
  var style = 'hsla(100, 40%, 40%, 1)';
  ctx.fillStyle = style;
  ctx.fill();

  for(var i = 0; i < grouped.length; i++) {
    barHeight = grouped[i];

    // drawBars(i, x, barHeight, barWidth);
	  // drawVawes(i, barHeight);
    var start = {x: 0, y: canvas.height / grouped.length * i};
    var amplitude = barHeight / 2;
    style = 'hsla(' + (Math.round(120 + i * 10)) + ', 40%, 40%, 0.6)';
    var freq = barHeight / 4000;

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(start.x, start.y);

    for(var j = 0; j < canvas.width; j++){
      y = (Math.cos(j * freq) * amplitude / 2) + (amplitude / 2);
      ctx.lineTo(j, y + start.y);
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.fillStyle = style;
    ctx.fill();
    ctx.closePath();
  }
};


function drawBars(i, x, barHeight, barWidth) {

	ctx.fillStyle = 'hsl(' + (Math.round(600 - i * 5)) + ',40%,30%)';
	ctx.fillRect(x,canvas.height-barHeight/2,barWidth,barHeight/2);

	x += barWidth;
}


function drawVawes(i, barHeight) {
  var start = {x: 0, y: canvas.height / grouped.length * i};
  var amplitude = barHeight / 2;
  style = 'hsla(' + (Math.round(120 + i * 10)) + ', 40%, 40%, 0.6)';
  var freq = barHeight / 4000;

  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(start.x, start.y);

  for(var j = 0; j < canvas.width; j++){
    y = (Math.cos(j * freq) * amplitude / 2) + (amplitude / 2);
    ctx.lineTo(j, y + start.y);
  }

  ctx.lineTo(canvas.width, canvas.height);
  ctx.fillStyle = style;
  ctx.fill();
  ctx.closePath();
}
draw();


/* folytonos mozgas */
