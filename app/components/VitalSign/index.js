/**
 *
 * VitalSign
 *
 */

import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';

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
  flex: 0.3;
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
  flex: 0.7;
  text-align: center;
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
  flex: 0.55;
  font-size: ${(props) => props.scaleContainerHeight * 0.3}px;
  align-self: center;
`;
const BPMeanWrapper = styled.div`
  flex: 0.3;
  font-size: ${(props) => props.scaleContainerHeight * 0.3}px;
  align-self: center;
`;

import {Field, reduxForm} from 'redux-form/immutable';

const StyledForm = styled.form`
  height: 100%;
`;

const StyledInput = styled.input`
  background: none;
  border: 0;
  display: block;
  width: 100%;
  height: 100%;
  text-align: center;
  
  &:focus {
    outline: none;
  }
  
  &::-webkit-inner-spin-button, 
  &::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
  }
`;

const StyledInputSystolic = styled(StyledInput)`
  width: 45%;
  display: inline-block;
`;

const StyledInputDiastolic = styled(StyledInput)`
  width: 45%;
  display: inline-block;
`;

const StyledInputMean = styled(StyledInput)`
  width: 70%;
  display: inline-block;
`;

const renderField = ({input, type}) => (<StyledInput {...input} type={type}/>);
const renderFieldDiastolic = ({input, type}) => (<StyledInputDiastolic {...input} type={type}/>);
const renderFieldSystolic = ({input, type}) => (<StyledInputSystolic {...input} type={type}/>);
const renderFieldMean = ({input, type}) => (<StyledInputMean {...input} type={type}/>);

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
    console.log(`componentDidMount ${this.props.vitalSign}`);
    let self = this;
    if (self.props.displayMode === "Simulation mode") self.initialSimulationMode();
    else self.initialSocket();
    if (this.props.initialValues && this.props.vitalSign === "HR") window._HR = this.props.initialValues.get("data");
    global.dispatchEvent(new Event('resize'));
  }

  componentWillUnmount() {
    console.log(`componentWillUnmount ${this.props.vitalSign}`);
    let self = this;
    self.requestVitalSignDataClearInterval();
    self.clearUpSocket();
  }

  componentDidUpdate() {
    console.log(`componentDidUpdate ${this.props.vitalSign}`);
    let self = this;
    self.requestVitalSignDataClearInterval();
    self.clearUpSocket();
    if (self.props.displayMode === "Simulation mode") self.initialSimulationMode();
    else self.initialSocket();
  }

  render() {
    console.log(`render ${this.props.vitalSign}`);
    let {containerHeight, w, strokeStyle, vitalSign, displayMode} = this.props;
    const {handleSubmit} = this.props; // redux form
    let scaleRatio = w / 12;
    let scaleContainerHeight = containerHeight * scaleRatio;
    let element = null;

    if (displayMode === "Simulation mode") {
      switch (vitalSign) {
        case "HR":
        case "SpO2":
        case "RP":
          element = (
            <StyledForm onSubmit={handleSubmit(this.handleHRSubmit)}>
              <HRWrapper color={color[strokeStyle]}>
                <HRTextAndUpperLowerLimitWrapper>
                  <HRText>
                    {vitalSign}
                  </HRText>
                  <HRUpperAndLowerLimitWrapper>
                    <HRUpperLimit scaleContainerHeight={scaleContainerHeight}>
                      <Field name="top" type="number"
                             component={renderField}/>
                    </HRUpperLimit>
                    <HRLowerLimit scaleContainerHeight={scaleContainerHeight}>
                      <Field name="bottom" type="number"
                             component={renderField}/>
                    </HRLowerLimit>
                  </HRUpperAndLowerLimitWrapper>
                </HRTextAndUpperLowerLimitWrapper>
                <HRDataWrapper scaleContainerHeight={scaleContainerHeight}
                               innerRef={(HRData) => {
                                 this.HRData = HRData
                               }}
                               onClick={this.onClickHRData}>
                  <Field name="data" type="number"
                         component={renderField}/>
                </HRDataWrapper>
              </HRWrapper>
              <button type="submit" hidden={true}/>
            </StyledForm>
          );
          break;
        case "ABP":
        case "PAP":
        case "NBP":
          element = (
            <StyledForm onSubmit={handleSubmit(this.handleHRSubmit)}>
              <BPWrapper color={color[strokeStyle]}>
                <BPTextWrapper>
                  <BPText>
                    {vitalSign}
                  </BPText>
                </BPTextWrapper>
                <BPSystolicAndDiastolicWrapper scaleContainerHeight={scaleContainerHeight}>
                  <Field name="systolic" type="number"
                         component={renderFieldSystolic}/>
                  {"/"}
                  <Field name="diastolic" type="number"
                         component={renderFieldDiastolic}/>
                </BPSystolicAndDiastolicWrapper>
                <BPMeanWrapper scaleContainerHeight={scaleContainerHeight}>
                  {"("}
                  <Field name="mean" type="number"
                         component={renderFieldMean}/>
                  {")"}
                </BPMeanWrapper>
              </BPWrapper>
              <button type="submit" hidden={true}/>
            </StyledForm>
          );
          break;
      }
    } else {
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
                             }}>
                {fakeDefaultVitalSignData[vitalSign].data}
              </HRDataWrapper>
            </HRWrapper>
          );
          break;
        case "ABP":
        case "PAP":
        case "NBP":
          element = (<BPWrapper color={color[strokeStyle]}>
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

  onClickHRData = () => {
    this.props.handleVitalSignEditingChange();
  };

  handleHRSubmit = (values) => {
    const top = values.get("top");
    const bottom = values.get("bottom");
    const data = values.get("data");
    let errorFlag = false;

    switch (this.props.vitalSign) {
      case "HR":
        if (top < 0) {
          this.props.change("top", 0);
          alert("The value should not be negative");
          errorFlag = true;
        }
        if (bottom < 0) {
          this.props.change("bottom", 0);
          alert("The value should not be negative");
          errorFlag = true;
        }
        if (data < 20) {
          this.props.change("data", 20);
          alert("The value should not be less than 20");
          errorFlag = true;
        }
        if (data > 240) {
          this.props.change("data", 240);
          alert("The value should not be greater than 240");
          errorFlag = true;
        }
        break;
      case "SpO2":
        if (top < 0) {
          this.props.change("top", 0);
          alert("The value should not be negative");
          errorFlag = true;
        }
        if (bottom < 0) {
          this.props.change("bottom", 0);
          alert("The value should not be negative");
          errorFlag = true;
        }
        if (data < 0) {
          this.props.change("data", 0);
          alert("The value should not be negative");
          errorFlag = true;
        }
        if (top > 100) {
          this.props.change("top", 100);
          alert("The value should not be greater than 100");
          errorFlag = true;
        }
        break;
      case "RP":
        if (top < 0) {
          this.props.change("top", 0);
          alert("The value should not be negative");
          errorFlag = true;
        }
        if (bottom < 0) {
          this.props.change("bottom", 0);
          alert("The value should not be negative");
          errorFlag = true;
        }
        if (data < 0) {
          this.props.change("data", 0);
          alert("The value should not be negative");
          errorFlag = true;
        }
        break;
    }
    console.log(values.toObject());
    console.log(this.props.vitalSign);
    if (errorFlag === false) {
      this.props.handleVitalSignFormStorageChange(values, this.props.vitalSign);
    }
  };

  onScroll = (event) => {
    console.log("Scroll test");
  }
}

let InitializeFromStateForm = compose(connect((state, props) => ({form: props.i})),
  reduxForm({destroyOnUnmount: true}))(Dimensions()(VitalSign));

export default InitializeFromStateForm
