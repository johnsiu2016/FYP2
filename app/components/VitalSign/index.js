import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';

import ResizeDimension from 'components/ResizeDimensions';
import styled from 'styled-components';

import {vitalSignItemTemplate} from '../../containers/PatientMonitor/reducer';

import color from '../../utils/color.js';
import {Field, reduxForm} from 'redux-form/immutable';

import {getCommonName} from '../../utils/preferences';

import {Card} from 'material-ui/Card';
import BuildFontIcon from 'components/BuildFontIcon';
import CloseFontIcon from 'components/CloseFontIcon';

// Div style for other component in vital sign
const VitalSignToolbar = styled.div`
  height: 15%;
  width: 100%;
`;
const PowerOnVitalSign = styled.div`
  height: 85%;
  width: 100%;
`;

// Div style for HR
const HR = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  color: ${(props) => props.color};
`;
const HRTextAndLimit = styled.div`
  flex: 0.25;
  font-size: ${(props) => props.scaleContainerHeight * 0.2}px;
`;
const HRText = styled.div`
  font-size: 1.1em;
`;
const HRLimit = styled.div`
  font-size: 0.8em;
`;
const HRData = styled.div`
  flex: 0.75;
  font-size: ${(props) => props.scaleContainerHeight * 0.75}px;
`;

// Div style for BP
const BP = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  color: ${(props) => props.color};
`;
const BPTextAndLimit = styled.div`
  flex: 0.3;
  font-size: ${(props) => props.scaleContainerHeight * 0.2}px;
`;
const BPText = styled.div`
  font-size: 1.1em;
`;
const BPLimit = styled.div`
  font-size: 0.4em;
`;
const BPLimitText = styled.div`
  text-align: center;
`;
const BPData = styled.div`
  flex: 0.7;
  font-size: ${(props) => props.scaleContainerHeight * 0.2}px;
  align-self: center;
`;
const BPSysAndDia = styled.div`
  font-size: 1.2em
  text-align: center;
`;
const BPMean = styled.div`
  font-size: 0.9em
  text-align: center;
`;

// Form style
const ControlForm = styled.form`
  height: 100%;
`;
const ControlInput = styled.input`
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
const ABPControlInput = styled(ControlInput)`
  width: 45%;
  display: inline-block;
`;
const renderControlInput = ({input, type}) => (<ControlInput {...input} type={type}/>);
const renderABPControlInput = ({input, type}) => (<ABPControlInput {...input} type={type}/>);
const renderABPControlMeanInput = ({input, type}) => (<ABPControlInput {...input} disabled={true} type={type}/>);

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
    // console.log(`componentDidMount ${this.props.vitalSign}`);
    let self = this;
    if (self.props.displayMode === "Real-time mode") self.initialSocket();
    this.props.handleVitalSignFormStorageChange(this.props.initialValues, this.props.vitalSign);
    global.dispatchEvent(new Event('resize'));
  }

  componentWillUnmount() {
    // console.log(`componentWillUnmount ${this.props.vitalSign}`);
    let self = this;
    self.clearUpSocket();
  }

  componentDidUpdate() {
    // console.log(`componentDidUpdate ${this.props.vitalSign}`);
    let self = this;
    self.clearUpSocket();
    if (self.props.displayMode === "Real-time mode") self.initialSocket();
  }

  render() {
    // console.log(`render ${this.props.vitalSign}`);
    let {
      containerHeight,
      w,
      strokeStyle,
      vitalSign,
      powerOn,
      handleVitalSignDrawerToggle,
      removeVitalSignItem
    } = this.props;
    const {handleSubmit} = this.props; // redux form
    let scaleRatio = w / 12;
    let scaleContainerHeight = containerHeight * scaleRatio;
    let element = null;

    switch (vitalSign) {
      case "MDC_ECG_HEART_RATE":
      case "MDC_PULS_OXIM_SAT_O2":
      case "MDC_PULS_OXIM_PULS_RATE":
      case "MDC_CO2_RESP_RATE":
      case "MDC_AWAY_CO2_ET":
      case "MDC_TTHOR_RESP_RATE":
        element = (
          <ControlForm onSubmit={handleSubmit(this.handleHRSubmit)}>
            <HR color={color[strokeStyle]}>
              <HRTextAndLimit scaleContainerHeight={scaleContainerHeight}>
                <HRText>
                  {getCommonName(vitalSign)}
                </HRText>
                <HRLimit>
                  <Field name="top" type="number"
                         component={renderControlInput}/>
                  <Field name="bottom" type="number"
                         component={renderControlInput}/>
                </HRLimit>
              </HRTextAndLimit>
              <HRData scaleContainerHeight={scaleContainerHeight}
                      innerRef={(HRData) => {
                        this.HRData = HRData;
                      }}
              >
                <Field name="data" type="number"
                       component={renderControlInput}/>
              </HRData>
            </HR>
            <button type="submit" hidden={true}/>
          </ControlForm>
        );
        break;
      case "MDC_PRESS_BLD_ART_ABP_NUMERIC":
      case "PAP":
      case "NBP":
        element = (
          <ControlForm onSubmit={handleSubmit(this.handleABPSubmit)}>
            <BP color={color[strokeStyle]}>
              <BPTextAndLimit scaleContainerHeight={scaleContainerHeight}>
                <BPText>
                  {getCommonName(vitalSign)}
                </BPText>
                <BPLimit>
                  <BPLimitText>
                    {"Sys."}
                  </BPLimitText>
                  <Field name="sysTop" type="number"
                         component={renderABPControlInput}/>
                  <Field name="sysBottom" type="number"
                         component={renderABPControlInput}/>
                  <BPLimitText>
                    {"Dia."}
                  </BPLimitText>
                  <Field name="diaTop" type="number"
                         component={renderABPControlInput}/>
                  <Field name="diaBottom" type="number"
                         component={renderABPControlInput}/>
                </BPLimit>
              </BPTextAndLimit>
              <BPData scaleContainerHeight={scaleContainerHeight}
                      innerRef={(BPData) => {
                        this.BPData = BPData;
                      }}>
                <BPSysAndDia>
                  <Field name="systolic" type="number"
                         component={renderABPControlInput}/>
                  {"/"}
                  <Field name="diastolic" type="number"
                         component={renderABPControlInput}/>
                </BPSysAndDia>
                <BPMean>
                  {"("}
                  <Field name="mean" type="number"
                         component={renderABPControlMeanInput}/>
                  {")"}
                </BPMean>
              </BPData>
            </BP>
            <button type="submit" hidden={true}/>
          </ControlForm>
        );
        break;
    }

    return powerOn ? (
      <div style={{height: '100%', width: '100%'}}>
        <VitalSignToolbar/>
        <PowerOnVitalSign>
          {element}
        </PowerOnVitalSign>
      </div>
    ) : (
      <div style={{height: '100%', width: '100%'}}>
        <VitalSignToolbar>
          <BuildFontIcon onTouchTap={handleVitalSignDrawerToggle}/>
          <CloseFontIcon onClick={removeVitalSignItem}/>
        </VitalSignToolbar>
        <Card containerStyle={{width: '100%', height: '100%'}} style={{width: '100%', height: '85%'}}>
          {element}
        </Card>
      </div>);
  }

  initialSocket = () => {
    let self = this;
    if (self.props.socket) {
      self.props.socket.on(self.props.vitalSign, self.vitalSignDataCallback);
    }
  };

  clearUpSocket = () => {
    let self = this;
    if (self.props.socket) {
      self.props.socket.off(self.props.vitalSign, self.vitalSignDataCallback);
    }
  };

  vitalSignDataCallback = (data) => {
    // console.log(`test ${JSON.stringify(data)}}`);

    switch (this.props.vitalSign) {
      case "MDC_ECG_HEART_RATE":
      case 'MDC_PULS_OXIM_PULS_RATE':
      case "MDC_PULS_OXIM_SAT_O2":
      case 'MDC_AWAY_CO2_ET':
      case 'MDC_CO2_RESP_RATE':
      case 'MDC_TTHOR_RESP_RATE':
      case "RP":
        if (data.data) {
          this.HRData.childNodes[0].value = data.data;
        }
        break;

      case "MDC_PRESS_BLD_ART_ABP_NUMERIC":
      case "PAP":
      case "NBP":
        if (data.systolic) {
          this.BPData.childNodes[0].querySelectorAll('[name="systolic"]')[0].value = data.systolic;
          this.BPData.childNodes[0].querySelectorAll('[name="diastolic"]')[0].value = data.diastolic;
          this.BPData.childNodes[1].querySelectorAll('[name="mean"]')[0].value = data.mean;
        }
        break;
    }

  };

  handleHRSubmit = (values) => {
    let top = Number(values.get("top"));
    let bottom = Number(values.get("bottom"));
    let data = Number(values.get("data"));

    if (top < 0) {
      this.props.change("top", 0);
      values = values.set("top", 0);
      //alert("The value should not be negative");
    }
    if (bottom < 0) {
      this.props.change("bottom", 0);
      values = values.set("bottom", 0);
      //alert("The value should not be negative");
    }
    if (data < 0) {
      this.props.change("data", 0);
      values = values.set("data", 0);
      //alert("The value should not be negative");
    }

    switch (this.props.vitalSign) {
      case "MDC_ECG_HEART_RATE":
        if (data > 300) {
          this.props.change("data", 300);
          values = values.set("data", 300);
          //alert("The value is too large");
        }
        break;
      case "MDC_PULS_OXIM_SAT_O2":
        if (top > 100) {
          this.props.change("top", 100);
          values = values.set("top", 100);
          //alert("The value should not be greater than 100");
        }
        break;
      case "RP":
        break;
    }
    this.props.handleVitalSignFormStorageChange(values, this.props.vitalSign);
  };

  handleABPSubmit = (values) => {
    let systolic = Number(values.get("systolic"));
    let diastolic = Number(values.get("diastolic"));
    let sysTop = Number(values.get("sysTop"));
    let sysBottom = Number(values.get("sysBottom"));
    let diaTop = Number(values.get("diaTop"));
    let diaBottom = Number(values.get("diaBottom"));

    if (systolic < 0) {
      this.props.change("systolic", 0);
      values = values.set("systolic", 0);
      //alert("The value should not be negative");
    }
    if (diastolic < 0) {
      this.props.change("diastolic", 0);
      values = values.set("diastolic", 0);
      //alert("The value should not be negative");
    }
    if (sysTop < 0) {
      this.props.change("sysTop", 0);
      values = values.set("sysTop", 0);
      //alert("The value should not be negative");
    }
    if (sysBottom < 0) {
      this.props.change("sysBottom", 0);
      values = values.set("sysBottom", 0);
      //alert("The value should not be negative");
    }
    if (diaTop < 0) {
      this.props.change("diaTop", 0);
      values = values.set("diaTop", 0);
      //alert("The value should not be negative");
    }
    if (diaBottom < 0) {
      this.props.change("diaBottom", 0);
      values = values.set("diaBottom", 0);
      //alert("The value should not be negative");
    }

    switch (this.props.vitalSign) {
      case "MDC_PRESS_BLD_ART_ABP_NUMERIC":
        if (systolic > 150) {
          this.props.change("systolic", 150);
          values = values.set("systolic", 150);
          //alert("The value should not be greater than or equal to 150");
        }
        if (diastolic > systolic) {
          this.props.change("diastolic", systolic);
          values = values.set("diastolic", systolic);
          //alert("Diastolic should not be greater than systolic");
        }
        break;
      case "MDC_PULS_OXIM_SAT_O2":
        break;
      case "RP":
        break;
    }
    let mean = Math.round((Number(values.get("systolic")) + Number(values.get("diastolic")) * 2) / 3);
    this.props.change("mean", mean);
    this.props.handleVitalSignFormStorageChange(values, this.props.vitalSign);
  };
}

let InitializeFromStateForm = compose(connect((state, props) => ({form: props.vitalSignItemId})),
  reduxForm({destroyOnUnmount: true}))(ResizeDimension()(VitalSign));

export default InitializeFromStateForm
