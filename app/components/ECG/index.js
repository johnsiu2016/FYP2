/**
 *
 * Ecg
 *
 */

import React from 'react';

import Dimensions from 'react-dimensions';
import color from '../../utils/color.js';
import {waveformItemTemplate, requestDataInterval} from '../../utils/utililtyFunctions';

class ECG extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static defaultProps = waveformItemTemplate();

  constructor(props) {
    super(props);

    this.ecgDataBuffer = [];
    this.ecgData = null;
    this.dataIndex = 0;

    this.canvas = null;
    this.w = 0;
    this.h = 0;
    this.py = 0;
    this.px = 0;

    this.intervalId = null;
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
    let self = this;
    self.requestDataClearInterval();
    self.clearUpSocket();
  }

  componentDidUpdate() {
    let self = this;
    self.initial();
    if (self.props.gridOn) self.drawGrid();
    else self.clearGrid();
    self.restartAnimation();
    self.requestDataClearInterval();
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
    let speed = self.props.speed;
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

      py = self.convertToGraphCoord(self.ecgData[self.dataIndex], self.h);

      self.dataIndex = self.dataIndex + 1;
      if (self.dataIndex >= self.ecgData.length) {
        self.dataIndex = 0;
        self.ecgData = self.ecgDataBuffer.shift();
        if (self.ecgData) {
          self.pxSyncWithHR = 1 / 6 * self.props.containerWidth / self.ecgData.length;
          self.speed = self.ecgData.length / 60 || 2;
        }
      }

      return py;

    } else {
      if (self.ecgDataBuffer.length > 2) {
        self.ecgData = self.ecgDataBuffer.shift();
        self.pxSyncWithHR = 1 / 6 * self.props.containerWidth / self.ecgData.length;
        self.speed = self.ecgData.length / 60 || 2;
      }
      return self.h / 2
    }
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
      console.log(`${self.props.waveform} ${self.ecgDataBuffer.length}`)
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

  convertToGraphCoord = (num, height) => {
    return (height / 2) * -(num * this.props.scale) + height / 2;
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
    self.intervalId = requestDataInterval(self.props.waveform, 1000, self.waveformDataCallback);
  };

  requestDataClearInterval = () => {
    let self = this;
    clearInterval(self.intervalId);
  };
}

export default Dimensions()(ECG) // Enhanced component
