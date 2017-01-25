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

class VitalSign extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    let self = this;
    self.initialSocket();
    global.dispatchEvent(new Event('resize'));
  }

  componentWillUnmount() {

  }

  componentDidUpdate() {
    let self = this;
    self.initialSocket();
    global.dispatchEvent(new Event('resize'));
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
                <HRUpperLimit scaleContainerHeight={scaleContainerHeight} innerRef={(HRTop) => {
                  this.HRTop = HRTop
                }}>
                  {fakeDefaultVitalSignData[vitalSign].top}
                </HRUpperLimit>
                <HRLowerLimit scaleContainerHeight={scaleContainerHeight} innerRef={(HRBottom) => {
                  this.HRBottom = HRBottom
                }}>
                  {fakeDefaultVitalSignData[vitalSign].bottom}
                </HRLowerLimit>
              </HRUpperAndLowerLimitWrapper>
            </HRTextAndUpperLowerLimitWrapper>
            <HRDataWrapper scaleContainerHeight={scaleContainerHeight} innerRef={(HRData) => {
              this.HRData = HRData
            }}>
              {fakeDefaultVitalSignData[vitalSign].data}
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
            <BPMeanWrapper scaleContainerHeight={scaleContainerHeight} innerRef={(BPMean) => {
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
      self.props.socket.on(self.props.i, (data) => {
        switch (this.props.vitalSign) {
          case "HR":
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
      });
    }
  };
}

export default Dimensions()(VitalSign) // Enhanced component
