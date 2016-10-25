var jsonQuery = require('json-query');

function Vibes(id) {
  var self = this;
  var reader;
  var containerID = id;
  var container;
  var data;
  var inputFile;
  var outputWindow;
  var inputVibe;
  var playBtn;
  var stopBtn;
  var playing;
  var stopped;
  var AudioContext;
  var audioCtx;
  var tune = [];
  var playIndex;
  //var oscillator;


  function _initialize() {
    AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    container = document.getElementById(containerID);

    inputFile = document.createElement('INPUT');
    inputFile.setAttribute('type', 'file');
    inputFile.addEventListener('change', self.handleFileSelect, false);
    container.appendChild(inputFile);

    outputWindow = document.createElement('DIV');
    outputWindow.id = 'outputWindow';
    container.appendChild(outputWindow);

    playBtn = document.createElement('button');
    playBtn.innerHTML = '&#x25b6;';
    playBtn.style.display = 'none';
    playBtn.className = 'btn play';
    playBtn.addEventListener('click', self.clickPlay, false);
    container.appendChild(playBtn);

    stopBtn = document.createElement('button');
    stopBtn.innerHTML = '&#x25fc;';
    stopBtn.style.display = 'none';
    stopBtn.className = 'btn stop';
    stopBtn.addEventListener('click', self.clickStop, false);
    container.appendChild(stopBtn);

    inputVibe = document.createElement('INPUT');
    inputVibe.setAttribute('type', 'text');
    inputVibe.style.display = 'none';
    inputVibe.className = 'txt vibe';
    container.appendChild(inputVibe);

  }

  self.handleFileSelect = function(evt) {
    if(!evt || !evt.target.files[0]) {
      return;
    }
    reader = new FileReader();
    reader.onload = function(evt) {
      try {
        data = JSON.parse(evt.target.result);
      } catch(ex) {
        console.log('Invalid JSON file.');
      }

      if(data) {
        _parsePebbleTune(data);
        _processVibe(data);
      }
    };
    reader.readAsText(evt.target.files[0]);
  };

  self.clickPlay = function() {
    if(!playing) {
      playing = true;
      playIndex = 0;
      self.playVibe();
    }
  };

  self.clickStop = function() {
    playing = false;
  };

  /* self.playOscillator = function(duration_ms, offset_ms) {
    oscillator = audioCtx.createOscillator();
    oscillator.connect(audioCtx.destination);
    oscillator.frequency.value = 1000;
    oscillator.start(audioCtx.currentTime + offset_ms / 1000);
    oscillator.stop(audioCtx.currentTime + duration_ms / 1000);
    //oscillator.disconnect(audioCtx.destination);
    //oscillator = null;
  };*/

  self.playVibe = function() {



var oscillator = audioCtx.createOscillator();
oscillator.frequency.value = 440;
var start = audioCtx.currentTime + 0.00;
var end = audioCtx.currentTime + 5;
var gain = audioCtx.createGain();

gain.connect(audioCtx.destination);
oscillator.connect(gain);

/*gain.gain.setValueAtTime(0.05, audioCtx.currentTime + 0.00);
gain.gain.setValueAtTime(0.00, audioCtx.currentTime + 0.25);
gain.gain.setValueAtTime(0.10, audioCtx.currentTime + 0.50);
gain.gain.setValueAtTime(0.00, audioCtx.currentTime + 0.75);
gain.gain.setValueAtTime(0.20, audioCtx.currentTime + 1.00);
gain.gain.setValueAtTime(0.00, audioCtx.currentTime + 1.25);
gain.gain.setValueAtTime(0.40, audioCtx.currentTime + 1.50);
gain.gain.setValueAtTime(0.00, audioCtx.currentTime + 1.75);
gain.gain.setValueAtTime(0.80, audioCtx.currentTime + 2.00);*/

var totalDuration = 0;
    tune.forEach(function(note, index) {

      if(index%2) {
        console.log('sleep: ' + note.duration);
        gain.gain.setValueAtTime(1, audioCtx.currentTime + note.duration);

      } else {
        console.log('play: ' + note.duration);
        gain.gain.setValueAtTime(0, audioCtx.currentTime + note.duration);

      }
      totalDuration += note.duration;
      console.log(start, end);
    });



oscillator.start(start);
oscillator.stop(end);
    /*
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();
    //gainNode.gain.value = 1;
    oscillator.frequency.value = 440;
    oscillator.connect(audioCtx.destination);
    oscillator.connect(gainNode);

    var start = audioCtx.currentTime;
    var end = audioCtx.currentTime + 5;

    tune.forEach(function(note, index) {
      if(!playing) {
        console.log('not playing');
        return;
      }

      if(index%2) {
        console.log('sleep: ' + note.duration);
        start = end;
        end = start + note.duration;
        //oscillator.frequency.setValueAtTime(500, end);
        gainNode.gain.setValueAtTime(1, end);
        console.log(audioCtx.currentTime + ': - gainNode.gain.setValueAtTime(1, ' + end + ');');
      } else {
        console.log('play: ' + note.duration);
        start = audioCtx.currentTime;
        end = start + note.duration;
        console.log(audioCtx.currentTime + ': - gainNode.gain.setValueAtTime(0, ' + end + ');');
        gainNode.gain.setValueAtTime(0, end);
      }

      console.log(start, end);
    });

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 2);
    //oscillator.disconnect(audioCtx.destination);
    //oscillator = null;
*/
    /*

    var start = 0;
    var end = 0;
    var oscillator;

    tune.forEach(function(note, index) {
      note = (note / 1000);
      console.log('index: ' + index);
      if(!playing) {
        console.log('not playing');
        return;
      }

      if(index%2) {
        console.log('sleep: ' + note);
        start = end + 1 + note;
        end = start + note;

      } else {
        console.log('note: ' + note);
        start = audioCtx.currentTime;
        end = start + note;
      }

      console.log(start, end);
      oscillator = audioCtx.createOscillator();
      oscillator.frequency.value = 1000;
      oscillator.connect(audioCtx.destination);
      oscillator.start(start);
      //sleep(note);
      oscillator.stop(end);
      //oscillator.disconnect(audioCtx.destination);
      //oscillator = null;

    });


*/
/*
    var note = tune[playIndex];
    if (playIndex%2 === 0) {
      console.log('note: ' + note);
      console.log('time1: ' + audioCtx.currentTime);
      console.log('time2: ' + audioCtx.currentTime + note);
      self.playOscillator(note);
    } else {
      console.log('sleep: ' + note);
    }

    playIndex++;
    if( playIndex < tune.length ) {
      console.log('play next');
      window.setTimeout(self.playVibe, note*10); //delay
      return;
    }
*/
    /*
    tune.forEach(function(note, index) {
      console.log('index: ' + index);
      if(!playing) {
        console.log('not playing');
        return;
      }

      if(index%2) {
        console.log('sleep: ' + note);
        sleep(note);
      } else {
        console.log('note: ' + note);
        var oscillator = audioCtx.createOscillator();
        oscillator.frequency.value = 1000;
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        sleep(note);
        oscillator.stop();
        oscillator.disconnect(audioCtx.destination);
        oscillator = null;
      }

    });
    */
    playing = false;

    /* if(playing && data.repeat_delay_ms && data.repeat_delay_ms > 0) {
      window.setTimeout(self.playVibe, data.repeat_delay_ms);
    } else {
      playing = false;
    } */
  };

  function _parsePebbleTune(data) {
    data.pattern.forEach(function(note) {
      var noteData = jsonQuery('notes[id=' + note + ']', {data: data});
      tune.push({id: noteData.value.id, duration: noteData.value.vibe_duration_ms / 1000});
    });
    inputVibe.style.display = 'inherit';
    inputVibe.value = JSON.stringify(tune);
  }

  function _processVibe(data) {
    while (outputWindow.firstChild) {
     outputWindow.removeChild(outputWindow.firstChild);
    }
    _prettyPrintJSON(JSON.stringify(data, undefined, 2));
  }

  function _prettyPrintJSON(jsonString) {
    var pre = document.createElement('pre');
    pre.innerHTML = _syntaxHighlightJsonString(jsonString);
    outputWindow.appendChild(pre);

    playBtn.style.display = 'inline-block';
    stopBtn.style.display = 'inline-block';
  }

  function _syntaxHighlightJsonString(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

  _initialize();
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

module.exports = Vibes;
