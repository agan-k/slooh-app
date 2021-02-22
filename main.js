function getPianoSound(e) {
   // let pianoSound;
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
}

function playRandomPitch(range) { // range is picked in accordance to level difficulty. Choices of different Node lists could unlock different levels. (diatonic, chromatic, number of octaves etc.)
   const random_index = Math.floor(Math.random() * Math.floor(range));
   const all_pitches = document.querySelectorAll('audio');
   _TEST_NOTE = all_pitches[random_index];
   setTimeout(function () {
      _TEST_NOTE.play();
   }, 800) 
}

function blinkAll() {
   const blinking_keys = document.querySelectorAll('.key');
   setTimeout(function() {
      blinking_keys.forEach(item => item.classList.add('blink'))
   }, 800)
}

function toggleEarTrainMode() {
   
   let root = '65'; // root of the current (tonal) key
   let muted_keys = Array.from(pianoKeys).filter(item => {
      if (item.getAttribute('id') !== root ) {
         return item;
      }
   })
   const piano = document.querySelector('.piano');
   piano.classList.toggle('et-mode');
   const button = document.getElementById('et-mode-toggle');
   if (button.innerHTML === 'start') {
      button.innerHTML = 'exit';
   } else {
      location.reload();
   }
}

// /////////////////////////////////////////////////////////////
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
   // these values of 'answers' only to be displayed for comparing user's input.
   correct_answer = document.
      querySelector(`.key[data-key="${test_note}"]`).getAttribute('id');
   wrong_answer = document.
      querySelector(`.key[data-key="${guess}"]`).getAttribute('id');
   
   // RESULT OUTPUT
   if (guess == test_note) {
      alert(`Yes, it was "${correct_answer}". Nice work!`)
   } else if (guess !== test_note) {
      alert(`"${wrong_answer}"!? Nah, it was "${correct_answer}"`)
   };
}

function playPiano(e) {
   if (e.repeat) return; // stop event 'keydown' from continuous fireing
   let range = 15;// passed arg 'range' reflects size of the pool out of which random note was picked 
   if (document.querySelector('.blink')) return evaluateGuess(e); //user triggers second ('a guess') event after blinkAll() is called and thus calls evaluateGuess(e)
   getPianoSound(e);
   pressPianoKey(e);
   if (!document.querySelector('.piano.et-mode')) return; // if Ear Train mode not active, exit function
   playRandomPitch(range); 
   blinkAll();
}

function validateInput(e) {
   let audio_elements = document.querySelectorAll('audio[data-key]');
   let valid_keydown_input = [];
   audio_elements.forEach(element =>
      valid_keydown_input.push(element.getAttribute('data-key'))
   )
   if (valid_keydown_input.includes(e.keyCode.toString()) == false) {
      document.getElementById('monitor').innerHTML = "Use assigned keys to play the Piano Keyboard"
      // alert('invalid input at validateInput()')
   } else {
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


