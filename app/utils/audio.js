const AudioContext = (
  window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  window.oAudioContext ||
  window.msAudioContext
);

const hasWebAudioAPI = AudioContext && location.protocol.indexOf('http') !== -1;
const audio = {};
audio.hasWebAudioAPI = hasWebAudioAPI;
(() => {
  if (!hasWebAudioAPI) {
    return;
  }
  const url = './machine-heart-beep.wav';
  const context = new AudioContext();
  const req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.responseType = 'arraybuffer';
  req.onload = () => {
    context.decodeAudioData(req.response, (buf) => {
        const getSource = () => {
          const source = context.createBufferSource();
          source.buffer = buf;
          source.connect(context.destination);
          return source;
        };

        audio.beep = () => { // beep
          getSource().start(0);
        };
      },
      (error) => {
        if (window.console && window.console.error) {
          window.console.error(`audio: ${url} connection error`, error);
          hasWebAudioAPI.data = false;
        }
      });
  };

  req.send();
})();

export default audio

