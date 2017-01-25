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

const ABPWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  color: ${(props) => props.color}
`;

const HRWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  color: ${(props) => props.color}
`;

const HRTextAndUpperLowerLimitWrapper = styled.div`
  flex: 0.4;
`;

const HRText = styled.div`
  font-size: 2em;
`;

const HRUpperAndLowerLimit = styled.div`
  align-self: 'center'
`;

const HRUpperLimit = styled.div`
  font-size: ${(props) => props.scaleContainerHeight * 0.2}px
  text-align: center
`;

const HRDataWrapper = styled.div`
  flex: 0.4;
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
              <HRUpperAndLowerLimit>
                <HRUpperLimit scaleContainerHeight={scaleContainerHeight} ref={(HRTop) => {this.HRTop = HRTop}}>
                  {fakeDefaultVitalSignData[vitalSign].top}
                </HRUpperLimit>
                <div style={{
                  fontSize: `${scaleContainerHeight * 0.2}px`,
                  lineHeight: `${scaleContainerHeight * 0.2}px`,
                  textAlign: 'center'
                }}
                     ref={(HRBottom) => {
                       this.HRBottom = HRBottom
                     }}>
                  {fakeDefaultVitalSignData[vitalSign].bottom}
                </div>
              </HRUpperAndLowerLimit>
            </HRTextAndUpperLowerLimitWrapper>

            <div style={{
              flex: '0.6',
              fontSize: `${scaleContainerHeight * 0.9}px`,
              lineHeight: `${scaleContainerHeight * 0.9}px`
            }}
                 ref={(HRData) => {
                   this.HRData = HRData
                 }}
            >
              {fakeDefaultVitalSignData[vitalSign].data}
            </div>
          </HRWrapper>
        );
        break;
      case "ABP":
      case "PAP":
      case "NBP":
        element = (
          <ABPWrapper color={color[strokeStyle]}>
            <div style={{flex: '0.15'}}>
              <div style={{fontSize: '2em'}}>
                {vitalSign}
              </div>
            </div>

            <div style={{
              flex: '0.6',
              fontSize: `${scaleContainerHeight * 0.4}px`,
              lineHeight: `${scaleContainerHeight * 0.4}px`,
              alignSelf: 'center'
            }}
                 ref={(BPSystolicAndDiastolic) => {
                   this.BPSystolicAndDiastolic = BPSystolicAndDiastolic
                 }}
            >
              {fakeDefaultVitalSignData[vitalSign].systolic}
              {"/"}
              {fakeDefaultVitalSignData[vitalSign].diastolic}
            </div>

            <div style={{
              flex: '0.25',
              fontSize: `${scaleContainerHeight * 0.4}px`,
              lineHeight: `${scaleContainerHeight * 0.4}px`,
              alignSelf: 'center'
            }}
                 ref={(BPMean) => {
                   this.BPMean = BPMean
                 }}
            >
              {"("}
              {fakeDefaultVitalSignData[vitalSign].mean}
              {")"}
            </div>
          </ABPWrapper>);
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
            this.BPMean.innerHTML = data.mean;
            break;
        }
      });
    }
  };
}

export default Dimensions()(VitalSign) // Enhanced component
