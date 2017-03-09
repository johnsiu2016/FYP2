const audio = {};
const url = './audio/machine-heart-beep.wav';
const context = new AudioContext();
const gainNode = context.createGain();
gainNode.gain.value = 1;
const req = new XMLHttpRequest();
req.open('GET', url, true);
req.responseType = 'arraybuffer';
req.onload = () => {
  context.decodeAudioData(req.response, (buf) => {
      const getSource = () => {
        const source = context.createBufferSource();
        source.buffer = buf;
        source.connect(gainNode);
        gainNode.connect(context.destination);
        return source;
      };

      audio.beep = () => { // beep
        getSource().start(0);
      };
    },
    (error) => {
      if (window.console && window.console.error) {
        window.console.error(`audio: ${url} connection error`, error);
      }
    });
};

req.send();

audio.gainNode = gainNode;

export default audio

