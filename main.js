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

// +++++++++++++++++++++++
function toggleTendency() {
   let cKey = document.querySelector(`.key[data-key='65']`);
   const piano = document.querySelector('.piano');
   piano.classList.toggle('tendency-notes');
   const button = document.getElementById('tendency')
   if (getComputedStyle(button).color == 'rgb(200, 200, 200)') {
      button.style.color = 'red';
      cKey.style.color = 'rgb(163, 231, 240)';
   } else {
      location.reload();
   }
}

// +++++++++++++++++++++++++++
let count = -1;
// ++++++++++++++++++++++++++++
function playTendencyNotes(e) {
   if (e.type == 'keydown' && e.keyCode.toString() !== '65') return;
   
   const chromatic_scale = document.querySelectorAll('audio');
      
   let refference_note;
   if (e.type == 'keydown') {
      refference_note = document.querySelector(`audio[data-key='${e.keyCode}']`)
   } else if (e.type == 'click') { 
      refference_note = document.querySelector(`audio[data-key='${e.target.getAttribute('data-key')}']`)
   }
   let tendency_list = [[1, 0], [3,2], [5,4], [6,7], [4, 0]];//tendency pairs represented in chromatic scale
   count += 1;
   if (count == tendency_list.length) count = 0;
   let tendency_pair = tendency_list[count]
      setTimeout(function() {
         chromatic_scale[tendency_pair[0]].play()
         chromatic_scale[tendency_pair[0]].currentTime = 0;
         setTimeout(function() {
            chromatic_scale[tendency_pair[1]].play()
            chromatic_scale[tendency_pair[1]].currentTime = 0;
         }, 700);
      }, 800);
}
// +++++++++++++++++++++++++
function inputTypeValue(e) {
   let event;
   if (e.type == 'keydown') {
      event = e.keyCode.toString();
   } else if (e.type == 'click') {
      event = e.target.getAttribute('data-key')
   }
   return event;
}
// ++++++++++++++++++++
function playPiano(e) {
   if (e.repeat) return; // stop event 'keydown' from continuous fireing
   //user triggers second ('a guess') event after blinkAll() is called and thus calls evaluateGuess(e)
   if (document.querySelector('.blink')) return evaluateGuess(e);
   // if trainer active but refference key NOT 'Do', exit (mute other piano keys).
   if (inputTypeValue(e) !== '65' &&
      document.querySelector('.piano.et-mode')) return;
   console.log(inputTypeValue(e))
   getPianoSound(e);
   pressPianoKey(e);
   //display current solfege
   let current_note_display = document.getElementById('current-note')
   displaySolfege(e, current_note_display);
   //go to tendency mode
   if (document.querySelector('.piano.tendency-notes')) return playTendencyNotes(e);
   // if e-trainer mode not active, exit function
   if (!document.querySelector('.piano.et-mode')) return;
   let range = setRange(); 
   playRandomPitch(range);
   blinkAll();
}

// ++++++++++++++++++++++++++++++++++
function displaySolfege(e, display) {
   let src;
   if (e.type == 'keydown') {
      src = document.querySelector(`.key[data-key='${e.keyCode}']`).getAttribute('id');
   } else if (e.type = 'click') {
      src = e.target.getAttribute('id');
   };
   display.innerHTML = src;
}

// ++++++++++++++++++++++++
function getPianoSound(e) {
   let pianoSound = document.
      querySelector(`audio[data-key="${inputTypeValue(e)}"]`);
   if (!pianoSound) return; // ignore comp keys without audio
   pianoSound.currentTime = 0;// don't wait for the entire audio sample to ring out
   pianoSound.play();   
}

// ++++++++++++++++++++++++
function pressPianoKey(e) {
   let pianoKey = document.querySelector(`.key[data-key="${inputTypeValue(e)}"]`)
   // hold piano keys down util release
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

// ++++++++++++++++++
function setRange() {
   let range; //range represents the pool from which test note is picked. (the pool can be chromatic, diatonic etc.)
   let button = document.getElementById('diatonic-toggle');
      if (getComputedStyle(button).color == 'rgb(200, 200, 200)') {
         range = 15;
      } else if (getComputedStyle(button).color == 'rgb(0, 128, 0)') {
         range = 8;//nine notes minus the root
      }
   return range;
}
// +++++++++++++++++++++++++++++
function playRandomPitch(range) {
   // random index to pick random note
   let random_index = Math.floor(Math.random() * Math.floor(range));
   if (random_index == 0) random_index = 1; //avoid unison
   
   // pool for chromatic scale (all the 15 notes, octave plus two)
   const chromatic_scale = document.querySelectorAll('audio');
   
   // ++ pool for diatonic scale (notes, octave minus the root and plus maj9th) ++
   let diatonic_scale = [];
   // iterate trough chromatic scale, 
   for (let i = 1; i < 9; i++) {//start on 2nd index (i=1) to skip the unison
      diatonic_scale.push(chromatic_scale[i]);
   }
   // let src = diatonic_scale.map(item => item.attributes[1].value);
   // console.log(src)
   // console.log(chromatic_scale)
   // let i = 0;
   // while (i < chromatic_scale.length) {
   //    console.log(chromatic_scale[i])
   //    i++
   // }
   // debugger
   if (range == 15) {
      _TEST_NOTE = chromatic_scale[random_index];
   } else if (range == 8) {
      _TEST_NOTE = diatonic_scale[random_index];
   }
   setTimeout(function () {
      _TEST_NOTE.play();
      // display CTA (question mark ?) in html element
      document.querySelector('#test-note').innerHTML = "?"
   }, 800) 
   console.log(_TEST_NOTE)
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
function constructScale(chromaticArr, scaleIndexArr) {
   let scale = [];
   for (let i = 0; i < scaleIndexArr.length; i++) {
      let index = scaleIndexArr[i];
      scale.push(chromaticArr[index]);
   }
   return scale;
}
// +++++++++++++++++++++++
// index of the starting key (C) in Transpose mode
let keyOfIndex = 0;
// list of tonalities (keyOf). the hex is for the flat (b) sign
let keyOfArr = ['C', 'D&#9837;', 'D', 'E&#9837;', 'E', 'F', 'G&#9837;', 'G', 'A&#9837;', 'A', 'B&#9837;', 'B'];
// let keyOfArr = ['C', '^m2', '^M2nd', '^m3rd', 'E', 'F', 'G&#9837;', 'G', 'A&#9837;', 'A', 'B&#9837;', 'B'];
// ++++++++++++++++++++++
function transposeKeyOf() {
   if (getComputedStyle(document.
      getElementById('toggle-on-off')).color == 'rgb(200, 200, 200)') return;//grey color (off) - exit
// trainer display corresponding tonalities   
   keyOfIndex += 1;// increase index to switch to the next tonality
   if (keyOfIndex == keyOfArr.length) keyOfIndex = 0;// circle back to the starting tonality (C)
   // display current tonality in the 'Trainer'
   let current_keyOf = document.getElementById('key-of').innerHTML = keyOfArr[keyOfIndex];
   //set 
   let trans_button = document.getElementById('transpose-toggle');
   if (keyOfIndex !== 0) {
      trans_button.style.color = 'rgb(235, 218, 132)';
   };

   // ++LOAD AUDIO SAMPLES FOR NEW TE TONALITY++
   // 1. initiate new 'oneOctaveSrc' array where src's for entire octave vill be stored
   let oneOctaveSrc = [];
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
   // 3. get index of starting note in new tonality
   let startingNoteIndex = srcPointersList.findIndex(item => item.name == current_keyOf)
   // 4. isolate attributes (src) and push them into ->
   let oneOctaveList = srcPointersList.slice(startingNoteIndex, startingNoteIndex + 15);
   // 5. oneOctaveSrc.push() all samples (attribute src='string') from that index to the length of current key (15 notes)
   oneOctaveList.map(item => oneOctaveSrc.push(item.src));
   // rearrange - move the ebony keys to the back of the newTonality array
   // this step is neccessary because in the '.piano' layout (index.html) '.keys ivory' && '.keys ebony'
   // are in separate div elements
   scale_index = [0, 2, 4, 5, 7, 9, 11, 12, 14]
   let newTonality = [];
      let ivory_keys = constructScale(oneOctaveSrc, scale_index);
      ivory_keys.map(item => newTonality.push(item));
   let ebony_keys = [];
   for (let i = 0; i < oneOctaveSrc.length; i++) {
      if (!ivory_keys.includes(oneOctaveSrc[i])) {
         ebony_keys.push(oneOctaveSrc[i])
      }
   }
      ebony_keys.map(item => newTonality.push(item))
      
   // 6. construct nested for loop and set new attributes
   let samples = document.querySelectorAll('audio');
   for (let i = 0; i < newTonality.length; i++) {
   samples[i].setAttribute('src', `${newTonality[i]}`)
   };
   
}

// +++++++++++++++++++++++
function toggleDiatonic() {
   let cKey = document.querySelector(`.key[data-key='65']`);
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
      location.reload();
   };
}
// +++++++++++++++++++++
function toggleOnOff() {
   let cKey = document.querySelector(`.key[data-key='65']`);
   let on = 'power-on';
   const piano = document.querySelector('.piano');
   piano.classList.toggle('et-mode');
   const button = document.getElementById('toggle-on-off');
   if (getComputedStyle(button).color == 'rgb(200, 200, 200)') {
      button.style.color = 'red';
      cKey.style.background = 'rgb(163, 231, 240)';
      blinkAll(on);
   } else {
      location.reload();
   }
}
// ++++++++++++++++++++++++
function evaluateGuess(e) {
   let test_note = _TEST_NOTE.getAttribute('data-key');
   let correct_answer;
   let wrong_answer;
   let guess;
   //remove highlight from piano keys
   const blinking_keys = document.querySelectorAll('.blink');
   const stop_blink = blinking_keys.forEach(item => item.classList.remove('blink'));
   // assign value to guess variable
   if (e.type == 'keydown') {
      guess = e.keyCode.toString();
      stop_blink;
   } else if (e.type == 'click') {
      guess = e.target.getAttribute("data-key");
      stop_blink; 
   }
   // +++display corresponding user input+++
   let display_guess = document.getElementById('test-note');
   // pass user input (guess)
   displaySolfege(e, display_guess )
   // compare user input with correct_note
   let display_correct = document.getElementById('correct-note')
   displaySolfege(e, display_correct)

   //+++color user input acordingly+++
   if (guess !== test_note) {
      document.getElementById('test-note').style.color = 'red';
   } else {
      document.getElementById('test-note').style.color = 'green';
   };

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
      para.innerText = `"${wrong_answer}"Correct note was "${correct_answer}"`
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


