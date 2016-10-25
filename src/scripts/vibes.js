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
  var oscillator;
  var gain;

  function _initialize() {
    AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    oscillator = audioCtx.createOscillator();
    oscillator.frequency.value = 1200;
    gain = audioCtx.createGain();
    gain.connect(audioCtx.destination);
    gain.gain.value = 0;
    oscillator.connect(gain);
    oscillator.start(0);

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

  self.playVibe = function() {
    if(!playing) {
      playIndex = 0;
      gain.gain.value = 0;
      return;
    }

    var note = tune[playIndex];
    gain.gain.value = note.strength;

    playIndex++;
    if( playIndex < tune.length ) {
      window.setTimeout(self.playVibe, note.duration); //delay
      return;
    }

    gain.gain.value = 0;

    if(playing && data.repeat_delay_ms && data.repeat_delay_ms > 0) {
      playIndex = 0;
      window.setTimeout(self.playVibe, data.repeat_delay_ms);
    } else {
      playing = false;
    }
  };

  function _parsePebbleTune(data) {
    data.pattern.forEach(function(note) {
      var noteData = jsonQuery('notes[id=' + note + ']', {data: data});
      tune.push({id: noteData.value.id, duration: noteData.value.vibe_duration_ms, strength: noteData.value.strength});
    });
    //inputVibe.style.display = 'inherit';
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

module.exports = Vibes;
