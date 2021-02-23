function getPianoSound(e) {
   let pianoSound;
   if (e.type == 'keydown') {
      pianoSound = document.
         querySelector(`audio[data-key="${e.keyCode}"]`);
   } else if (e.type == 'click') {
      pianoSound = document.
         querySelector(`audio[data-key="${e.target.getAttribute("data-key")}"]`);
   }
   if (!pianoSound) return; // ignore comp keys without audio
   pianoSound.currentTime = 0;// don't wait for the entire audio sample to ring out
   pianoSound.play();
}

function pressPianoKey(e) {
   let pianoKey;
   if (e.type == 'keydown') {
      pianoKey = document.querySelector(`.key[data-key="${e.keyCode}"]`);
   } else if (e.type == 'click') {
      pianoKey = e.target;
   }
   pianoKey.classList.add('finger-down');
   if (e.type == 'keydown') {
      let pressedKeys = document.querySelectorAll('.key')
      pressedKeys.forEach(item => item.addEventListener('keyup', function (e) {
         if (pianoKey.getAttribute('data-key') == e.keyCode)
         pianoKey.classList.remove('finger-down');
      }));
   } else if (e.type == 'click') {
      setTimeout(function () {
         pianoKey.classList.remove('finger-down')
      }, 100);
   }
   document.querySelector('#current-note').innerHTML = `${pianoKey.getAttribute('id')}`
}
// ++++++++++++++++++
function setRange() {
   let range;
   let button = document.getElementById('diatonic-toggle');
      if (getComputedStyle(button).color == 'rgb(200, 200, 200)') {
         range = 15;
      } else if (getComputedStyle(button).color == 'rgb(0, 128, 0)') {
         range = 9;
      }
   return range;
}
// +++++++++++++++++++++++++++++
function playRandomPitch(range) { // range is picked in accordance to level difficulty. Choices of different Node lists could unlock different levels. (diatonic, chromatic, number of octaves etc.)
   
   const random_index = Math.floor(Math.random() * Math.floor(range));
   const chromatic_scale = document.querySelectorAll('audio');

   const diat_keys = document.querySelectorAll('.keys.ivory .key');
   let diatonic_data_keys = Array.from(diat_keys).map(item => item.getAttribute('data-key'))
   let diatonic_scale = [];

   for (let i = 0; i < chromatic_scale.length; i++) {
      for (let j = 0; j < diatonic_data_keys.length; j++) {
         if (chromatic_scale[i].getAttribute('data-key') == diatonic_data_keys[j]) {
            diatonic_scale.push(chromatic_scale[i]);
         }
      }
   }
  
   if (range == 15) {
      _TEST_NOTE = chromatic_scale[random_index];
      
   } else if (range == 9) {
      _TEST_NOTE = diatonic_scale[random_index];

   }
   setTimeout(function () {
      _TEST_NOTE.play();
      document.querySelector('#test-note').innerHTML = "?"
   }, 800) 
}
// ++++++++++++++++++
function blinkAll(on) {

   const blinking_keys = document.querySelectorAll('.key');
   if (on == 'power-on') {
      let powerOnBlink = setInterval(() => {
         blinking_keys.forEach(item => item.classList.add('blink'))
         setTimeout(function () {
            blinking_keys.forEach(item => item.classList.remove('blink'))
         }, 50);
      }, 150);
      
      setTimeout(function () {
         clearInterval(powerOnBlink)
      }, 400)
     
   } else {
      setTimeout(function() {
         blinking_keys.forEach(item => item.classList.add('blink'))
      }, 800)
   }
}
// +++++++++++++++++++++++
function toggleDiatonic() {
   let cKey = document.getElementById('C');
   if (getComputedStyle(document.
      getElementById('toggle-on-off')).color == 'rgb(200, 200, 200)') return;
   let key_of = document.getElementById('key-of');
   let button = document.getElementById('diatonic-toggle');
   if (getComputedStyle(button).color == 'rgb(200, 200, 200)') {
      button.style.color = 'green';
      key_of.innerText = 'C'//in the future versions assign this to a separate toggle function
      cKey.style.background = 'rgb(235, 218, 132)';
      
   } else {
      button.style.color = 'rgb(200, 200, 200)';
      key_of.innerText = '';
      cKey.style.background = 'rgb(243, 242, 237)';
   }
}
// +++
function toggleOnOff() {
   let pad1 = document.getElementById('current-note');
   let pad2 = document.getElementById('test-note');
   let pad3 = document.getElementById('correct-note');
   let on = 'power-on';
   const piano = document.querySelector('.piano');
   piano.classList.toggle('et-mode');
   const button = document.getElementById('toggle-on-off');
   if (getComputedStyle(button).color == 'rgb(200, 200, 200)') {
      button.style.color = 'red';
      blinkAll(on);
   } else {
      location.reload();
   }
}
// +++
function evaluateGuess(e) {
   const blinking_keys = document.querySelectorAll('.blink');
   const stop_blink = blinking_keys.forEach(item => item.classList.remove('blink'));
   let test_note = _TEST_NOTE.getAttribute('data-key');
   let correct_answer;
   let wrong_answer;
   let guess;
   // assign value to guess variable
   if (e.type == 'keydown') {
      guess = e.keyCode.toString();
      stop_blink;
   } else if (e.type == 'click') {
      guess = e.target.getAttribute("data-key");
      stop_blink; 
   }
   let test = document.getElementById('test-note');
   test.innerHTML = document.querySelector(`.key[data-key="${guess}"]`).getAttribute('id');
   document.getElementById('correct-note').innerHTML = document.querySelector(`.key[data-key="${test_note}"]`).getAttribute('id');
   if (guess !== test_note) {
      document.getElementById('test-note').style.color = 'red';
   } else {
      document.getElementById('test-note').style.color = 'green';
      
   }
   // these values of 'answers' only to be displayed for comparing user's input.
   correct_answer = document.
      querySelector(`.key[data-key="${test_note}"]`).getAttribute('id');
   wrong_answer = document.
      querySelector(`.key[data-key="${guess}"]`).getAttribute('id');
   
   // RESULT OUTPUT
   let para = document.createElement("P");
   let monitor = document.getElementById('monitor');
   if (monitor.hasChildNodes()) {
      while (monitor.firstChild) {
         monitor.removeChild(monitor.firstChild)
      }
   }
   if (guess == test_note) {
      para.innerText = `Yes, it was "${correct_answer}". Nice work!`
      monitor.appendChild(para);
   } else if (guess !== test_note) {
      para.innerText = `"${wrong_answer}"!? Nah, it was "${correct_answer}"`
      monitor.appendChild(para);
   };
}

function playPiano(e) {
   if (e.repeat) return; // stop event 'keydown' from continuous fireing
   let range = setRange();// passed arg 'range' reflects size of the pool out of which random note was picked 
   if (document.querySelector('.blink')) return evaluateGuess(e); //user triggers second ('a guess') event after blinkAll() is called and thus calls evaluateGuess(e)
   getPianoSound(e);
   pressPianoKey(e);
   if (!document.querySelector('.piano.et-mode')) return; // if Ear Train mode not active, exit function
   // setRange();
   // console.log(range)
   // debugger
   playRandomPitch(range); 
   blinkAll();
}

function validateInput(e) {
   let heading = document.createElement("H1");
   let para = document.createElement("P");
   let monitor = document.getElementById('monitor');
   if (monitor.hasChildNodes()) {
      while (monitor.firstChild) {
         monitor.removeChild(monitor.firstChild)
      }
   }
   
   let audio_elements = document.querySelectorAll('audio[data-key]');
   let valid_keydown_input = [];
   audio_elements.forEach(element =>
      valid_keydown_input.push(element.getAttribute('data-key'))
      ) 
      
      if (valid_keydown_input.includes(e.keyCode.toString()) == false) {
         para.innerText = 'Stick with the right keys, eh!'
         monitor.appendChild(para);
         setTimeout(function () {
            para.remove();
         }, 1200)
         setTimeout(function () {
            if (monitor.firstChild) return;
            heading.innerText = 'slooh';
            monitor.appendChild(heading);
         }, 1200)
         
         
      } else {
         heading.innerText = 'slooh';
         monitor.appendChild(heading);
         playPiano(e);
   }
}

window.addEventListener('click', function () { // for unwanted clicks outside of piano keyboard
   pianoKeys.forEach(item => item.focus());
})

const pianoKeys = document.querySelectorAll('.key');

pianoKeys.forEach(item => item.addEventListener('click', playPiano));
pianoKeys.forEach(item => item.focus());
pianoKeys.forEach(item => item.addEventListener('keydown', validateInput));


