/**
 *
 * Ecg
 *
 */

import React from 'react';

import Dimensions from 'react-dimensions';
import color from '../../utils/color.js';
import {waveformItemTemplate} from '../../utils/utililtyFunctions';

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
  }

  componentDidMount() {
    let self = this;
    if (self.props.gridOn) self.drawGrid();
    self.startAnimation();
    self.initialSocket();
    global.dispatchEvent(new Event('resize'));
  }

  componentWillUnmount() {
    let self = this;
    self.clearUpSocket();
  }

  componentDidUpdate() {
    let self = this;
    if (self.props.gridOn) self.drawGrid();
    else self.clearGrid();
    self.restartAnimation();
    self.clearUpSocket();
    self.initialSocket();
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

    function animate() {
      self.py = self.getDataPoint();
      self.px += speed;

      ctx.clearRect(self.px, 0, scanBarWidth, self.h);
      ctx.beginPath();
      ctx.moveTo(opx, opy);
      ctx.lineTo(self.px, self.py);
      ctx.stroke();

      opx = self.px;
      opy = self.py;

      if (opx > self.w) {
        self.px = opx = -speed;
      }

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
      }

      return py;

    } else {
      if (self.ecgDataBuffer.length > 0) {
        self.ecgData = self.ecgDataBuffer.shift();
      }
      return self.h / 2
    }
  };

  initialSocket = () => {
    let self = this;
    if (self.props.socket) {
      self.props.socket.on(self.props.i, self.socketDataCallback);
    }
  };

  clearUpSocket = () => {
    let self = this;
    if (self.props.socket) {
      self.props.socket.off(self.props.i, self.socketDataCallback);
    }
  };

  socketDataCallback = (data) => {
    let self = this;
    if (self.ecgDataBuffer.length < 20) {
      self.ecgDataBuffer.push(data);
    }
    // console.log(`${self.props.waveform} buffer: ${self.ecgDataBuffer.length}`);
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

    const majorGridPixelSize = (ctx.canvas.width / 30);
    const minorGridPixelSize = (majorGridPixelSize / 5);

    self.renderGrid(ctx, majorGridPixelSize, "#757575", 0.6, true);
    self.renderGrid(ctx, minorGridPixelSize, "#546E7A", 0.3);
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
  }
}

export default Dimensions()(ECG) // Enhanced component
