/**
 *
 * VitalSign
 *
 */

import React from 'react';

import Dimensions from 'react-dimensions'
import styled from 'styled-components';

import color from '../../utils/color.js';
import fakeDefaultVitalSignData from '../../utils/fakeDefaultVitalSignData.js';

import {vitalSignItemTemplate, requestVitalSignDataInterval} from '../../utils/utililtyFunctions';

const HRWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  color: ${(props) => props.color};
`;
const HRTextAndUpperLowerLimitWrapper = styled.div`
  flex: 0.4;
`;
const HRText = styled.div`
  font-size: 2em;
`;
const HRUpperAndLowerLimitWrapper = styled.div`
  align-self: 'center';
`;
const HRUpperLimit = styled.div`
  font-size: ${(props) => props.scaleContainerHeight * 0.2}px;
  text-align: center;
`;
const HRLowerLimit = styled.div`
  font-size: ${(props) => props.scaleContainerHeight * 0.2}px;
  text-align: center;
`;
const HRDataWrapper = styled.div`
  flex: 0.6;
  font-size: ${(props) => props.scaleContainerHeight * 0.9}px;
`;

const BPWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  color: ${(props) => props.color};
`;
const BPTextWrapper = styled.div`
  flex: 0.15;
`;
const BPText = styled.div`
  font-size: 2em;
`;
const BPSystolicAndDiastolicWrapper = styled.div`
  flex: 0.6;
  font-size: ${(props) => props.scaleContainerHeight * 0.4}px;
  align-self: center;
`;
const BPMeanWrapper = styled.div`
  flex: 0.25;
  font-size: ${(props) => props.scaleContainerHeight * 0.4}px;
  align-self: center;
`;
const InputWrapper = styled.input`
  background: none;
  border: 0;
  display: block;
  width: 100%;
  height: 100%;
  
  &:focus {
    outline: none;
  }
`;

class VitalSign extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static defaultProps = vitalSignItemTemplate();

  constructor(props) {
    super(props);

    this.intervalId = null;

    this.state = {
      inputDisabled: true,
      inputValue: 60
    };
  }

  componentDidMount() {
    let self = this;
    if (self.props.displayMode === "Simulation mode") self.initialSimulationMode();
    else self.initialSocket();
    global.dispatchEvent(new Event('resize'));
  }

  componentWillUnmount() {
    let self = this;
    self.requestVitalSignDataClearInterval();
    self.clearUpSocket();
  }

  componentDidUpdate() {
    let self = this;
    self.requestVitalSignDataClearInterval();
    self.clearUpSocket();
    if (self.props.displayMode === "Simulation mode") self.initialSimulationMode();
    else self.initialSocket();
  }

  render() {
    let {containerHeight, w, strokeStyle, vitalSign} = this.props;
    let scaleRatio = w / 12;
    let scaleContainerHeight = containerHeight * scaleRatio;
    let element = null;

    switch (vitalSign) {
      case "HR":
      case "SpO2":
      case "RP":
        element = (
          <HRWrapper color={color[strokeStyle]}>
            <HRTextAndUpperLowerLimitWrapper>
              <HRText>
                {vitalSign}
              </HRText>
              <HRUpperAndLowerLimitWrapper>
                <HRUpperLimit scaleContainerHeight={scaleContainerHeight}
                              innerRef={(HRTop) => {
                                this.HRTop = HRTop
                              }}>
                  {fakeDefaultVitalSignData[vitalSign].top}
                </HRUpperLimit>
                <HRLowerLimit scaleContainerHeight={scaleContainerHeight}
                              innerRef={(HRBottom) => {
                                this.HRBottom = HRBottom
                              }}>
                  {fakeDefaultVitalSignData[vitalSign].bottom}
                </HRLowerLimit>
              </HRUpperAndLowerLimitWrapper>
            </HRTextAndUpperLowerLimitWrapper>
            <HRDataWrapper scaleContainerHeight={scaleContainerHeight}
                           innerRef={(HRData) => {
                             this.HRData = HRData
                           }}
                           onDoubleClick={this.onDoubleClickHRData}>
              <InputWrapper
                type="number"
                disabled={this.state.inputDisabled}
                value={this.state.inputValue}
                onChange={this.onChangeHRData}
                onKeyPress={this.onKeyPressHRData}
                onWheel={this.onScroll}
                min={20}
                max={240}/>
            </HRDataWrapper>
          </HRWrapper>
        );
        break;
      case "ABP":
      case "PAP":
      case "NBP":
        element = (
          <BPWrapper color={color[strokeStyle]}>
            <BPTextWrapper>
              <BPText>
                {vitalSign}
              </BPText>
            </BPTextWrapper>
            <BPSystolicAndDiastolicWrapper scaleContainerHeight={scaleContainerHeight}
                                           innerRef={(BPSystolicAndDiastolic) => {
                                             this.BPSystolicAndDiastolic = BPSystolicAndDiastolic
                                           }}>
              {fakeDefaultVitalSignData[vitalSign].systolic}
              {"/"}
              {fakeDefaultVitalSignData[vitalSign].diastolic}
            </BPSystolicAndDiastolicWrapper>
            <BPMeanWrapper scaleContainerHeight={scaleContainerHeight}
                           innerRef={(BPMean) => {
                             this.BPMean = BPMean
                           }}>
              {"("}
              {fakeDefaultVitalSignData[vitalSign].mean}
              {")"}
            </BPMeanWrapper>
          </BPWrapper>);
        break;
    }

    return element;
  }

  initialSocket = () => {
    let self = this;
    if (self.props.socket) {
      self.props.socket.on(self.props.i, self.vitalSignDataCallback);
    }
  };

  clearUpSocket = () => {
    let self = this;
    if (self.props.socket) {
      self.props.socket.off(self.props.i, self.vitalSignDataCallback);
    }
  };

  vitalSignDataCallback = (data) => {
    // console.log(`test ${JSON.stringify(data)}}`);
    switch (this.props.vitalSign) {
      case "HR":
        window._HR = data.data;
      case "SpO2":
      case "RP":
        this.HRTop.innerHTML = data.top;
        this.HRBottom.innerHTML = data.bottom;
        this.HRData.innerHTML = data.data;
        break;

      case "ABP":
      case "PAP":
      case "NBP":
        this.BPSystolicAndDiastolic.innerHTML = `${data.systolic}/${data.diastolic}`;
        this.BPMean.innerHTML = `(${data.mean})`;
        break;
    }
  };

  initialSimulationMode = () => {
    let self = this;
    // self.intervalId = requestVitalSignDataInterval(self.props.vitalSign, 3000, self.vitalSignDataCallback);
  };

  requestVitalSignDataClearInterval = () => {
    let self = this;
    clearInterval(self.intervalId);
  };

  onDoubleClickHRData = () => {
    this.setState({
      inputDisabled: false
    });
    this.props.handleVitalSignEditingChange();
  };

  onKeyPressHRData = (event) => {
    console.log("onKeyPress");
    if (event.key === 'Enter') {
      this.setState({
        inputDisabled: true
      });
      window._HR = this.state.inputValue;
    }
  };

  onChangeHRData = (event) => {
    console.log("onChange")
    this.setState({
      inputValue: event.target.value
    });
  };

  onScroll = (event) => {
    console.log("Scroll test");
  }
}

export default Dimensions()(VitalSign) // Enhanced component
