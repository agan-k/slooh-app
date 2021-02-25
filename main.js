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
         para.innerText = `
         Use designated computer keys to play. (A, W, S, E, F...), or click 
         on the piano keyboard.
         `
         monitor.appendChild(para);
         setTimeout(function () {
            para.remove();
         }, 2550)
         setTimeout(function () {
            if (monitor.firstChild) return;
            heading.innerText = 'slooh';
            monitor.appendChild(heading);
         }, 2550)
         } else {
         heading.innerText = 'slooh';
         monitor.appendChild(heading);
         playPiano(e);
   }
}

// +++++++++++++++++++
function playPiano(e) {
   if (e.repeat) return; // stop event 'keydown' from continuous fireing
   if (document.querySelector('.blink')) return evaluateGuess(e); //user triggers second ('a guess') event after blinkAll() is called and thus calls evaluateGuess(e)
   getPianoSound(e);
   pressPianoKey(e);
   if (!document.querySelector('.piano.et-mode')) return; // if e-trainer mode not active, exit function
   let range = setRange(); 
   playRandomPitch(range); 
   blinkAll();
}

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

// ++++++++++++++++++++++++
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
   let range; //range represents the pool from which test note is picked. (the pool can be chromatic, diatonic etc.)
   let button = document.getElementById('diatonic-toggle');
      if (getComputedStyle(button).color == 'rgb(200, 200, 200)') {
         range = 15;
      } else if (getComputedStyle(button).color == 'rgb(0, 128, 0)') {
         range = 9;
      }
   return range;
}
// +++++++++++++++++++++++++++++
function playRandomPitch(range) {
   
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
//////////////////////////
function loadNewKeyOf() {

   // 1. initiate new 'newTonality' array where the new tonality will be stored
   let newTonality = [];
   // 2. make list and store all the pointers (src attribute values) into an array and iterate trough them
   let srcPointersList = [
      {src: 'samples/01E2.mp3', name: 'E' },
      {src: 'samples/02F2.mp3', name: 'F' },
      {src: 'samples/03Gb2.mp3', name: 'G&#9837;' },
      {src: 'samples/04G2.mp3', name: 'G' },
      {src: 'samples/05Ab2.mp3', name: 'A&#9837;' },
      {src: 'samples/06A2.mp3', name: 'A' },
      {src: 'samples/07Bb2.mp3', name: 'B&#9837;' },
      {src: 'samples/08B2.mp3', name: 'B' },
      {src: 'samples/09C3.mp3', name: 'C' },
      {src: 'samples/10Db3.mp3', name: 'D&#9837;' },
      {src: 'samples/11D3.mp3', name: 'D' },
      {src: 'samples/12Eb3.mp3', name: 'E&#9837;' },
      {src: 'samples/13E3.mp3', name: '' },
      {src: 'samples/14F3.mp3', name: '' },
      {src: 'samples/15Gb3.mp3', name: '' },
      {src: 'samples/16G3.mp3', name: '' },
      {src: 'samples/17Ab3.mp3', name: '' },
      {src: 'samples/18A3.mp3', name: '' },
      {src: 'samples/19Bb3.mp3', name: '' },
      {src: 'samples/20B3.mp3', name: '' },
      {src: 'samples/21C4.mp3', name: '' },
      {src: 'samples/22Db4.mp3', name: '' },
      {src: 'samples/23D4.mp3', name: '' },
      {src: 'samples/24Eb4.mp3', name: '' },
      {src: 'samples/25E4.mp3', name: '' },
      {src: 'samples/26F4.mp3', name: '' },
   ] 
   // 3. get index of new tonality - indexOf()
   let current_keyOf = 'E&#9837;'//temporary hypotethical
   let startIndex_of_src = srcPointersList.findIndex(item => item.name == current_keyOf)
   // console.log(test)
   // 4. isolate attributes (src) and push them into ->
   let newList = srcPointersList.slice(startIndex_of_src, startIndex_of_src + 15);
   // 5. newTonality.push() all samples (attribute src='string') from that index to the length of current key (15 notes)
   newList.map(item => newTonality.push(item.src));
   console.log(newTonality)
   
   // 6. construct nested for loop and set new attributes
   let samples = document.querySelectorAll('audio');
   console.log(samples)

   for (let i = 0; i < samples.length; i++) {
      for (let j = 0; j < newTonality.length; j++) {
         samples[i].setAttribute('src', `${newTonality[0]}`)
      }
      
   }
   console.log(samples)
   
}
/////////////////////////


// +++++++++++++++++++++++
let keyOfIndex = 0;
let keyOfArr = ['C', 'D&#9837;','D', 'E&#9837;', 'E', 'F', 'G&#9837;', 'G', 'A&#9837;', 'A', 'B&#9837;', 'B'];
function transposeKeyOf() {
   if (getComputedStyle(document.
      getElementById('diatonic-toggle')).color == 'rgb(200, 200, 200)') return;
   
   // load samples


   // trainer display corresponding tonalities   
   keyOfIndex += 1;
   if (keyOfIndex == keyOfArr.length) keyOfIndex = 0;
   let current_keyOf = document.getElementById('key-of').innerHTML = keyOfArr[keyOfIndex];
   
   let trans_button = document.getElementById('transpose-toggle');
   if (keyOfIndex !== 0) {
      trans_button.style.color = 'rgb(235, 218, 132)';
   } else if (keyOfIndex == 0) {
      trans_button.style.background = 'rgb(239, 239, 239)';
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
      key_of.innerHTML = 'C';
      cKey.style.background = 'rgb(235, 218, 132)';
      
   } else {
      button.style.color = 'rgb(200, 200, 200)';
      key_of.innerHTML = '';
      cKey.style.background = 'rgb(243, 242, 237)';
   }
}
// +++++++++++++++++++++
function toggleOnOff() {
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
// ++++++++++++++++++++++++
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

window.addEventListener('click', function () { // for unwanted clicks outside of piano keyboard
   pianoKeys.forEach(item => item.focus());
})

const pianoKeys = document.querySelectorAll('.key');

pianoKeys.forEach(item => item.addEventListener('click', playPiano));
pianoKeys.forEach(item => item.focus());
pianoKeys.forEach(item => item.addEventListener('keydown', validateInput));


