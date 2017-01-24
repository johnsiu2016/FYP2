/**
*
* VitalSign
*
*/

import React from 'react';
// import styled from 'styled-components';

import Dimensions from 'react-dimensions'
import color from '../../utils/color.js';
import fakeDefaultVitalSignData from '../../utils/fakeDefaultVitalSignData.js';
import HRWrapper from './HRWrapper';
import ABPWrapper from './ABPWrapper';

class VitalSign extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    global.dispatchEvent(new Event('resize'));

    let self = this;

    self.props.socket && self.props.socket.on(self.props.i, (data) => {
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

  componentWillUnmount() {

  }

  componentDidUpdate() {
    global.dispatchEvent(new Event('resize'));

    let self = this;

    self.props.socket && self.props.socket.on(self.props.i, (data) => {
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
        <HRWrapper color={strokeStyle[color]}>
            <div style={{flex: '0.4'}}>
              <div style={{fontSize: '2em'}}>
                {vitalSign}
              </div>
              <div style={{alignSelf: 'center'}}>
                <div style={{
                  fontSize: `${scaleContainerHeight * 0.2}px`,
                  lineHeight: `${scaleContainerHeight * 0.2}px`,
                  textAlign: 'center'
                }}
                     ref={(HRTop) => {
                       this.HRTop = HRTop
                     }}>
                  {fakeDefaultVitalSignData[vitalSign].top}
                </div>
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
              </div>
            </div>

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
        <ABPWrapper color={strokeStyle[color]}>
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
}

export default Dimensions()(VitalSign) // Enhanced component
