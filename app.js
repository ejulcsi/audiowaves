var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var audio = document.querySelector('audio');
var analyser = audioContext.createAnalyser();
var gainNode = audioContext.createGain();
var source = audioContext.createMediaElementSource(audio);
source.connect(analyser);
source.connect(gainNode);
gainNode.connect(analyser);
analyser.connect(audioContext.destination);
analyser.fftSize = 512;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
analyser.getByteFrequencyData(dataArray);

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.clearRect(0, 0, canvas.width, canvas.height);

var volumeButton = document.querySelector("[data-button-volume]");
var playing = false;


volumeButton.addEventListener('click', function() {
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


function groupData() {
  var groups = [];
  var levels = 11;
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

  var grouped = groupData();
  var barHeight;
  var style = 'hsla(100, 40%, 40%, 0.6)';

  ctx.fillStyle = 'hsla(152, 40%, 30%, 0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for(var i = 0; i < grouped.length; i++) {
    barHeight = grouped[i];

    var start = {x: 0, y: canvas.height / grouped.length * i};
    var amplitude = barHeight / 2;
    var freq = barHeight / 4000;

    style = 'hsla(' + (Math.round(152 + i * 7)) + ', 40%, 36%, 0.6)';

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(start.x, start.y);

    for(var j = 0; j < canvas.width; j++){
      var y = (Math.cos(j * freq) * amplitude / 2) + (amplitude / 2);
      ctx.lineTo(j, y + start.y);
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.fillStyle = style;
    ctx.fill();

    ctx.closePath();
  }
};


draw();

