/**
 *
 * Ecg
 *
 */

import React from 'react';

import Dimensions from 'react-dimensions';
import color from '../../utils/color.js';
import {waveformItemTemplate, requestWaveformDataInterval} from '../../utils/utililtyFunctions';
import audio from '../../utils/audio';

class ECG extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static defaultProps = waveformItemTemplate();

  constructor(props) {
    super(props);
    console.log("constructor")
    this.ecgDataBuffer = [];
    this.ecgData = null;
    this.dataIndex = 0;

    this.canvas = null;
    this.w = 0;
    this.h = 0;
    this.py = 0;
    this.px = 0;

    this.intervalId = null;
    this.bufferLength = 0;
    this.beepFlag = false;
    this.animation = null;
  }

  componentDidMount() {
    let self = this;
    self.initial();
    if (self.props.gridOn) self.drawGrid();
    self.startAnimation();
    if (self.props.displayMode === "Simulation mode") self.initialSimulationMode();
    else self.initialSocket();
    global.dispatchEvent(new Event('resize'));
  }

  componentWillUnmount() {
    console.log(`componentWillUnmount ${this.props.waveform} ${this.dataIndex}`);
    let self = this;
    self.requestWaveformDataClearInterval();
    self.clearUpSocket();
    self.animation.cancel(); // animation need to clear, although canvas destroyed, the animation is still running
  }

  componentDidUpdate() {
    console.log(`componentDidUpdate ${this.props.waveform} ${this.props.displayMode}`);
    let self = this;
    self.initial();
    if (self.props.gridOn) self.drawGrid();
    else self.clearGrid();
    self.restartAnimation();
    self.requestWaveformDataClearInterval();
    self.clearUpSocket();
    if (self.props.displayMode === "Simulation mode") self.initialSimulationMode();
    else self.initialSocket();
  }

  render() {
    let {containerWidth, containerHeight} = this.props;
    return (
      <div>
        <canvas width={containerWidth}
                height={containerHeight}
                style={{position: 'absolute', zIndex: 1}}
                ref={(c) => this.backgroundCanvas = c}>
        </canvas>
        <canvas width={containerWidth}
                height={containerHeight}
                style={{position: 'absolute', zIndex: 2}}
                ref={(c) => this.canvas = c}>
        </canvas>
      </div>
    );
  }

  draw = () => {
    let self = this;

    let ecg = this.canvas;
    let ctx = ecg.getContext('2d');
    let scanBarWidth = 20;
    let animationID = 0;

    self.w = ecg.width;
    self.h = ecg.height;

    let opx = self.px;
    let opy = self.py || self.h / 2;

    ctx.strokeStyle = color[self.props.strokeStyle];
    ctx.lineWidth = self.props.lineWidth;

    let speedCount = self.speed || 1;
    function animate() {
      while (speedCount > 0) {
        self.py = self.getDataPoint();
        self.px += self.pxSyncWithHR || 2;

        ctx.clearRect(self.px, 0, scanBarWidth, self.h);
        ctx.beginPath();
        ctx.moveTo(opx, opy);
        ctx.lineTo(self.px, self.py);
        ctx.stroke();

        opx = self.px;
        opy = self.py;

        if (opx > self.w) {
          self.px = opx = -(self.pxSyncWithHR || 2);
        }
        speedCount = speedCount - 1;
      }
      speedCount = self.speed || 1;
      animationID = requestAnimationFrame(animate);
    }

    return {
      start: () => {
        animationID = requestAnimationFrame(animate);
      },
      cancel: () => {
        cancelAnimationFrame(animationID);
      }
    }
  };

  getDataPoint = () => {
    let self = this;
    let py;
    if (self.ecgData) {
      py = self.ecgData[self.dataIndex] * self.h;
      self.emitSound();
      self.dataIndex = self.dataIndex + 1;
      if (self.dataIndex >= self.ecgData.length) {
        self.dataIndex = 0;
        self.ecgData = null;
        if (self.ecgDataBuffer.length > 0) {
          self.getData();
        }
      }
      return py;

    } else { // initial
      if (self.props.displayMode === "Simulation mode") {
        self.bufferLength = 0;
      } else if (self.props.displayMode === "Real-time mode") {
        self.bufferLength = 2;
      }
      if (self.ecgDataBuffer.length > self.bufferLength) {
        self.getData();
      }
      return self.h / 2;
    }
  };

  getData = () => {
    const self = this;
    self.ecgData = self.ecgDataBuffer.shift();
    self.calculateSpeed();
  };

  emitSound = () => {
    const self = this;
    if (self.props.waveform === "ECG - II") {
      if (!this.beepFlag && self.ecgData[self.dataIndex] < 0.2 && self.ecgData[self.dataIndex] < self.ecgData[self.dataIndex - 1]) {
        audio.beep();
        this.beepFlag = true;
      }
      if (this.beepFlag && self.ecgData[self.dataIndex] > 0.2 && self.ecgData[self.dataIndex] > self.ecgData[self.dataIndex - 1]) {
        this.beepFlag = false;
      }
    }
  };

  calculateSpeed = () => {
    const self = this;
    self.pxSyncWithHR = 1 / 6 * self.props.containerWidth / self.ecgData.length; // potential problem: if the data length of different waveform is not the same, the clear bar will be different
    self.speed = self.ecgData.length / 60 || 2;
  };

  initialSocket = () => {
    let self = this;
    if (self.props.socket) {
      self.props.socket.on(self.props.i, self.waveformDataCallback);
    }
  };

  clearUpSocket = () => {
    let self = this;
    if (self.props.socket) {
      self.props.socket.off(self.props.i, self.waveformDataCallback);
    }
  };

  waveformDataCallback = (data) => {
    let self = this;
    if (self.ecgDataBuffer.length < 10) {
      self.ecgDataBuffer.push(data);
    }
  };

  startAnimation = () => {
    let self = this;
    self.animation = self.draw();
    self.animation.start();
  };

  restartAnimation = () => {
    let self = this;
    if (self.animation) {
      self.animation.cancel();
      self.animation = self.draw();
      self.animation.start();
    }
  };

  drawGrid = () => {
    let self = this;
    let ctx = self.backgroundCanvas.getContext('2d');

    self.renderGrid(ctx, self.majorGridPixelSize, "#757575", 0.6, true);
    self.renderGrid(ctx, self.minorGridPixelSize, "#546E7A", 0.3);
  };

// Render Major Grid
  renderGrid = (ctx, majorGridPixelSize, color, lineWidth, major) => {
    const ECGWidth = ctx.canvas.width;
    const ECGHeight = ctx.canvas.height;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;

    // horizontal grid lines
    for (let i = 0; i <= ECGHeight; i = i + majorGridPixelSize) {
      if (major && i === 0) continue;
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(ECGWidth, i);
      ctx.closePath();
      ctx.stroke();
    }

    // vertical grid lines
    for (let j = 0; j <= ECGWidth; j = j + majorGridPixelSize) {
      if (major && j === 0) continue;
      ctx.beginPath();
      ctx.moveTo(j, 0);
      ctx.lineTo(j, ECGHeight);
      ctx.closePath();
      ctx.stroke();
    }
  };

  clearGrid = () => {
    let self = this;
    let ctx = self.backgroundCanvas.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  initial = () => {
    let self = this;
    let ctx = self.backgroundCanvas.getContext('2d');

    self.majorGridPixelSize = (ctx.canvas.width / 30);
    self.minorGridPixelSize = (self.majorGridPixelSize / 5);
  };

  initialSimulationMode = () => {
    let self = this;
    self.intervalId = requestWaveformDataInterval(self.props.waveform, 1000, self.waveformDataCallback);

  };

  requestWaveformDataClearInterval = () => {
    let self = this;
    clearInterval(self.intervalId);
  };
}

export default Dimensions()(ECG) // Enhanced component
