import React from 'react';

import ResizeDimension from 'components/ResizeDimensions';
import color from '../../utils/color.js';
import {waveformItemTemplate} from '../../containers/PatientMonitor/reducer';
import {requestWaveformDataInterval} from '../../utils/simulationService';
import audio from '../../utils/audio';
import {getCommonName} from '../../utils/preferences';

import {Card} from 'material-ui/Card';
import BuildFontIcon from 'components/BuildFontIcon';
import CloseFontIcon from 'components/CloseFontIcon';
import CustomFontIcon from 'components/CustomFontIcon';

import styled from 'styled-components';

const ECGToolbarWrapper = styled.div`
  height: 15%;
  width: 100%;
`;
const ECGText = styled.span`
  font-size: 2em;
  color: ${(props) => props.color};
  position: absolute;
  left: 0px;
`;
const ECGWrapperForPowerOnElement = styled.div`
  height: 85%;
  width: 100%;
`;

class ECG extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static defaultProps = waveformItemTemplate();

  constructor(props) {
    super(props);

    this.ecgDataBuffer = [];
    this.ecgData = null;
    this.dataIndex = 0;
    this.pxSyncWithHR = 2;
    this.speed = 1;
    this.frequency = 60;

    this.canvas = null;
    this.w = 0;
    this.h = 0;
    this.py = 0;
    this.px = 0;

    this.intervalId = null;
    this.beepFlag = false;
    this.animation = null;
  }

  componentDidMount() {
    let self = this;
    self.initialBackgroundCanvas();
    self.drawBackgroundGrid();
    self.drawBackgroundScale();
    self.startAnimation();
    if (self.props.displayMode === "Simulation mode") self.initialSimulationMode();
    else self.initialSocket();

    global.dispatchEvent(new Event('resize'));
  }

  componentWillUnmount() {
    // console.log(`componentWillUnmount ${this.props.waveform} ${this.dataIndex}`);
    let self = this;
    self.requestWaveformDataClearInterval();
    self.clearUpSocket();
    self.clearBackgroundCanvas();
    self.animation.cancel(); // animation need to clear, although canvas destroyed, the animation is still running
  }

  componentDidUpdate() {
    // console.log(`componentDidUpdate ${this.props.waveform} ${this.props.displayMode}`);
    let self = this;
    self.requestWaveformDataClearInterval();
    self.clearUpSocket();
    self.clearBackgroundCanvas();
    self.initialBackgroundCanvas();
    self.drawBackgroundGrid();
    self.drawBackgroundScale();
    self.restartAnimation();
    if (self.props.displayMode === "Simulation mode") self.initialSimulationMode();
    else self.initialSocket();
  }

  render() {
    let {
      containerWidth,
      containerHeight,
      strokeStyle,
      waveform,
      powerOn,
      waveformItemId,
      handleWaveformToolbarGridOnButtonToggle,
      handleWaveformDrawerToggle,
      removeWaveformItem
    } = this.props;

    return powerOn ?
      (<div style={{height: '100%', width: '100%'}}>
        <ECGToolbarWrapper>
          <ECGText color={color[strokeStyle]}>{getCommonName(waveform)}</ECGText>
        </ECGToolbarWrapper>
        <ECGWrapperForPowerOnElement>
          <canvas width={containerWidth}
                  height={containerHeight * 0.85}
                  style={{position: 'absolute', zIndex: 1}}
                  ref={(c) => this.backgroundCanvas = c}>
          </canvas>
          <canvas width={containerWidth}
                  height={containerHeight * 0.85}
                  style={{position: 'absolute', zIndex: 2}}
                  ref={(c) => this.canvas = c}>
          </canvas>
        </ECGWrapperForPowerOnElement>
      </div>)
      :
      (<div style={{height: '100%', width: '100%'}}>
        <ECGToolbarWrapper>
          <ECGText color={color[strokeStyle]}>{getCommonName(waveform)}</ECGText>
          <CustomFontIcon iconString="grid_on"
                          onClick={handleWaveformToolbarGridOnButtonToggle.bind(this, waveformItemId)}/>
          <BuildFontIcon onTouchTap={handleWaveformDrawerToggle.bind(this, waveformItemId)}/>
          <CloseFontIcon onClick={removeWaveformItem.bind(this, waveformItemId)}/>
        </ECGToolbarWrapper>
        <Card style={{height: '85%', width: '100%', position: 'absolute', zIndex: -1}}>
          <canvas width={containerWidth}
                  height={containerHeight * 0.85}
                  style={{position: 'absolute', zIndex: 1}}
                  ref={(c) => this.backgroundCanvas = c}>
          </canvas>
          <canvas width={containerWidth}
                  height={containerHeight * 0.85}
                  style={{position: 'absolute', zIndex: 2}}
                  ref={(c) => this.canvas = c}>
          </canvas>
        </Card>
      </div>);
  }

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

    let speedCount = self.speed;

    function animate() {
      while (speedCount > 0) {
        self.py = self.getDataPoint();
        self.px += self.pxSyncWithHR;

        ctx.clearRect(self.px, 0, scanBarWidth, self.h);
        ctx.beginPath();
        ctx.moveTo(opx, opy);
        ctx.lineTo(self.px, self.py);
        ctx.stroke();

        opx = self.px;
        opy = self.py;

        if (opx > self.w) {
          self.px = opx = -(self.pxSyncWithHR);
        }
        speedCount = speedCount - 1;
      }
      speedCount = self.speed;
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

  initialSimulationMode = () => {
    let self = this;
    self.intervalId = requestWaveformDataInterval(self.props.waveform, 1000, self.waveformDataCallback);
  };

  requestWaveformDataClearInterval = () => {
    let self = this;
    clearInterval(self.intervalId);
  };

  initialSocket = () => {
    let self = this;
    if (self.props.socket) {
      self.props.socket.on(self.props.waveform, self.waveformDataCallback);
    }
  };

  clearUpSocket = () => {
    let self = this;
    if (self.props.socket) {
      self.props.socket.off(self.props.waveform, self.waveformDataCallback);
    }
  };

  waveformDataCallback = (data) => {
    let self = this;
    if (!data) return;
    if (self.props.displayMode === "Real-time mode" && self.ecgDataBuffer.length <= 3) {
      self.ecgDataBuffer.push(data.normalizedWaveform);
      self.frequency = data.frequency;
    } else if (self.props.displayMode === "Simulation mode" && self.ecgDataBuffer.length <= 1) {
      self.ecgDataBuffer.push(data);
      self.frequency = data.length;
    }
  };

  getECGData = () => {
    let self = this;

    if (self.ecgDataBuffer.length > 0) {
      self.ecgData = self.ecgDataBuffer.shift();
      // clear bar move speed: currently 1 second
      // potential problem: if the data length of different waveform is not the same, the clear bar will be different
      self.pxSyncWithHR = 1 / 6 * self.props.containerWidth / self.frequency;
      // consume speed
      self.speed = self.frequency / 60;
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
        self.getECGData();
      }

      return py;

    } else { // initial or no ecgData
      if (self.props.displayMode === "Simulation mode") {
        self.getECGData();
      } else if (self.props.displayMode === "Real-time mode") {
        if (self.ecgDataBuffer.length > 2) { // real time buffer
          self.getECGData();
        }
      }

      return self.h / 2;
    }
  };

  emitSound = () => {
    let self = this;
    if (self.props.waveform === "MDC_ECG_LEAD_II") {
      if (!this.beepFlag && self.ecgData[self.dataIndex] < 0.2 && self.ecgData[self.dataIndex] < self.ecgData[self.dataIndex - 1]) {
        audio.beep();
        this.beepFlag = true;
      }
      if (this.beepFlag && self.ecgData[self.dataIndex] > 0.2 && self.ecgData[self.dataIndex] > self.ecgData[self.dataIndex - 1]) {
        this.beepFlag = false;
      }
    }
  };

  initialBackgroundCanvas = () => {
    let self = this;
    let ctx = self.backgroundCanvas.getContext('2d');

    self.majorGridPixelSize = (ctx.canvas.width / 30);
    self.minorGridPixelSize = (self.majorGridPixelSize / 5);
  };

  clearBackgroundCanvas = () => {
    let self = this;
    let ctx = self.backgroundCanvas.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  drawBackgroundGrid = () => {
    let self = this;
    if (!self.props.gridOn) return;

    let ctx = self.backgroundCanvas.getContext('2d');
    self.renderBackgroundGrid(ctx, self.majorGridPixelSize, "#757575", 0.6, true);
    self.renderBackgroundGrid(ctx, self.minorGridPixelSize, "#546E7A", 0.3);
  };

  // Render Major Grid
  renderBackgroundGrid = (ctx, majorGridPixelSize, color, lineWidth, major) => {
    let ECGWidth = ctx.canvas.width;
    let ECGHeight = ctx.canvas.height;
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

  drawBackgroundScale = () => {
    let self = this;
    let {scaleLine} = this.props;
    if (!scaleLine.get('scaleLineOn')) return;

    let ctx = self.backgroundCanvas.getContext('2d');
    let ECGWidth = ctx.canvas.width;
    let ECGHeight = ctx.canvas.height;
    let topLevel = scaleLine.get('topLevel');
    let bottomLevel = scaleLine.get('bottomLevel');
    let middleLevel = Math.round((topLevel + bottomLevel) / 2);

    ctx.font = "25px Comic Sans MS";
    ctx.fillStyle = color[self.props.strokeStyle];
    ctx.textAlign = "right";
    ctx.fillText(topLevel.toString(), 110, 20);
    ctx.fillText(middleLevel.toString(), 110, 10 + ECGHeight / 2);
    ctx.fillText(bottomLevel.toString(), 110, ECGHeight);

    ctx.lineWidth = self.props.lineWidth * 0.25;
    ctx.strokeStyle = color[self.props.strokeStyle];
    ctx.beginPath();
    ctx.moveTo(125, 0); // initialBackgroundCanvas drawing point in x-axis
    ctx.lineTo(ECGWidth, 0);
    ctx.closePath();
    ctx.stroke();

    ctx.lineWidth = self.props.lineWidth * 0.1;
    ctx.strokeStyle = color[self.props.strokeStyle];
    ctx.beginPath();
    ctx.moveTo(125, ECGHeight / 2);
    ctx.lineTo(ECGWidth, ECGHeight / 2);
    ctx.closePath();
    ctx.stroke();

    ctx.lineWidth = self.props.lineWidth * 0.25;
    ctx.strokeStyle = color[self.props.strokeStyle];
    ctx.beginPath();
    ctx.moveTo(125, ECGHeight);
    ctx.lineTo(ECGWidth, ECGHeight);
    ctx.closePath();
    ctx.stroke();

  };
}

export default ResizeDimension()(ECG) // Enhanced component
