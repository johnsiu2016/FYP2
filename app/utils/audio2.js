import Tone from 'tone';
import audio from './audio';

Tone.Transport.bpm.value = window._HR || 30;

var loop = new Tone.Loop(function(){
  //triggered every eighth note.
  audio.beep();
}, "4n").start(0);
//Tone.Transport.start(`+${(1/60) * (60 * 0.45) / (window._HR || 30/ 60)}`);

export default Tone

