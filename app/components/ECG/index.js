/**
 *
 * Ecg
 *
 */

import React from 'react';

import Dimensions from 'react-dimensions';
import color from '../../utils/color.js';

class ECG extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static defaultProps = {
    waveform: 'ECG-II',
    strokeStyle: 'green',
    lineWidth: 3,
    scale: 0.8,
    speed: 3,
    showBuffer: true
  };

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
    self.restartAnimation();
    self.clearUpSocket();
    self.initialSocket();
  }

  render() {
    let {containerWidth, containerHeight} = this.props;
    return (
      <canvas width={containerWidth}
              height={containerHeight}
              ref={(c) => this.canvas = c}>
      </canvas>
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
  }
}

export default Dimensions()(ECG) // Enhanced component
