function playRandomPitch(range, test) { // range is picked in accordance to level difficulty. Choices of different Node lists could unlock different levels. (diatonic, chromatic, number of octaves etc.)
   const random_index = Math.floor(
      Math.random() * Math.floor(range));
   const all_pitches = document.querySelectorAll('audio');
   _TEST_NOTE = all_pitches[random_index];
   setTimeout(function() {
      _TEST_NOTE.play();
   }, 1000) 
}

function evaluateGuess(e) {

   const blinking_keys = document.querySelectorAll('.blink');
   const stop_blink = blinking_keys.forEach(item => item.classList.remove('blink'));
   let test_note = _TEST_NOTE.getAttribute('data-key');
   let correct_answer;
   let wrong_answer;
   let guess;



   // let valid_input = [65, 87, 83, 69, 68, 70, 84, 71, 89, 72, 85, 74, 75, 79, 76];
   let valid_input_keydown = ['65', '87', '83', '69', '68', '70', '84', '71', '89', '72', '85', '74', '75', '79', '76'];
   let valid_input_click;
      if (e.path[1].classList.contains('key')) {
         valid_input_click = true
      } else {
         false
      }

   // input comes in from when playPiano() calls evaluateGuess(e)
   if (e) stop_blink;

   //check for validity of input and assign value to guess variable
   if (e.type == 'keydown' && valid_input_keydown.includes(e.keyCode.toString()) == true) {
      guess = e.keyCode.toString();
   } else if (e.type == 'click' && valid_input_click) {
      guess = e.path[1].attributes[0].value;
   } else {
      return alert('Invalid input at guess.init')
   }
   ////////////////////////////////////////////////////////////////////
   
   //pass  this value of 'answers' only to be displayed for comparing user's input.
   correct_answer = document.
      querySelector(`.key[data-key="${test_note}"]`).getAttribute('id');
   wrong_answer = document.
      querySelector(`.key[data-key="${guess}"]`).getAttribute('id');
   ///////////////////////////////////////////////////////////////////////////

   //this block evaluates the guess
   if (guess == test_note) {
      alert(`Yes, it was "${correct_answer}". Nice work!`)
   } else if (guess !== test_note) {
      alert(`"${wrong_answer}"!? Nah, it was "${correct_answer}"`)
   };
   /////////////////////////////////////////////////////////////////////////////
};

function playPiano(e) {
   let playedSound;
   let pianoKey;
   let range = 15;// passed arg 'range' reflects size of the pool out of which random note was picked 
   if (e.repeat) return; //stops event 'keydown' from continuously fireing
   if (document.querySelector('.blink')) return evaluateGuess(e);
   if (e.type == 'keydown') {
      playedSound = document.querySelector(`audio[data-key="${e.keyCode}"]`);
      pianoKey = document.querySelector(`.key[data-key="${e.keyCode}"]`);
   } else if (e.type = 'click') {
      playedSound = document.querySelector(`audio[data-key="${e.path[0].attributes[0].value}"]`)
      pianoKey = document.querySelector(`.key[data-key="${e.path[0].attributes[0].value}"]`)
   };
   if (!playedSound) return; //exits function if computer keys without assigned sound pressed
   pianoKey.classList.add('finger-down');// Transition style for pressed piano key
   playedSound.currentTime = 0; // rewinds before entire audio sample (ca 4s) rings out
   playedSound.play();
   if (!document.querySelector('.piano.et-mode')) return; // if Ear Train mode not active, exit function
   playRandomPitch(range); 
   blinkAll();
}

function blinkAll() {
   const blinking_keys = document.querySelectorAll('.key');
   setTimeout(function() {
      blinking_keys.forEach(item => item.classList.add('blink'))
   }, 1700)
}

function toggleEarTrainMode() {
   const piano = document.querySelector('.piano');
   piano.classList.toggle('et-mode');
   const button = document.getElementById('et-mode-toggle');
   if (button.innerHTML === 'start') {
      button.innerHTML = 'exit';
   } else {
      location.reload();
   }
}

function fingerUp(e) {
   if (e.propertyName !== 'transform') return;
   this.classList.remove('finger-down');
}

const pianoKeys = document.querySelectorAll('.key');
pianoKeys.forEach(pianoKey => pianoKey.addEventListener('transitionend', fingerUp));

window.addEventListener('keydown', playPiano);
window.addEventListener('click', playPiano);








