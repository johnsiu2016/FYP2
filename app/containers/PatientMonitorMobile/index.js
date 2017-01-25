/*
 *
 * PatientMonitorMobile
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import ReactGrid, {WidthProvider} from 'react-grid-layout';
const ReactGridLayout = WidthProvider(ReactGrid);

import {grey900, grey800, grey700, red500, grey50} from 'material-ui/styles/colors';

import {Grid, Row, Col} from 'react-bootstrap';

import {Card} from 'material-ui/Card';

import ECG from 'components/Ecg';

import FontIcon from 'material-ui/FontIcon';

import FloatingActionButton from 'material-ui/FloatingActionButton';

import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import Slider from 'material-ui/Slider';

import SelectField from 'material-ui/SelectField';

import Drawer from 'material-ui/Drawer';

import VitalSign from 'components/VitalSign';

import IconButton from 'material-ui/IconButton';

import color from '../../utils/color';
import {createStructuredSelector} from 'reselect';
import {
  changeLayout1,
  resetLayout1,
  addItem1,
  removeItem1,

  changeLayout2,
  resetLayout2,
  addItem2,
  removeItem2,

  handleLeftDrawerToggle,
  handleLeftDrawerClose,
  handleWaveformChange,
  handleColorChange,
  handleScaleChange,
  handleSpeedChange,

  handleRightDrawerToggle,
  handleRightDrawerClose,
  handleVitalSignChange,
  handleVitalSignColorChange,

  handlePowerButtonToggle
} from './actions';

import {
  selectLayout1,
  selectItems1,
  selectLayout2,
  selectItems2,
  selectLeftDrawer,
  selectRightDrawer,
  selectPowerOn,
  selectSocket
} from './selectors';

import {
  selectIP,
  selectPort,
  selectProtocol,
  selectPatientMonitor
} from 'containers/Settings/selectors';

export class PatientMonitorMobile extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    window.addEventListener("keyup", this.props.onPowerOnModeKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.props.onPowerOnModeKeyUp);
  }

  // waveform
  createCustomElement1 = (el) => {
    let {handleLeftDrawerToggle, onRemoveItem1, items1} = this.props;

    let removeStyle = {
      position: 'absolute',
      top: 0,
      right: '0px',
      cursor: 'pointer'
    };

    let i = el.get('i');
    let item1 = items1.get(i);
    let waveform = item1.get('waveform');
    let strokeStyle = item1.get('strokeStyle');
    let lineWidth = item1.get('lineWidth');
    let scale = item1.get('scale');
    let speed = item1.get('speed');

    if (el.get('y') === null) {
      el = el.set('y', Infinity);
    }

    return (
      <div key={i} data-grid={el.toObject()}>
        <div style={{height: '15%'}}>
          <span style={{
            fontSize: '2em',
            color: color[strokeStyle],
            position: 'absolute',
            left: '0px'
          }}>
            {waveform}
          </span>

          <FontIcon className="material-icons" style={{position: 'absolute', top: 0, right: '30px', cursor: 'pointer'}}
                    onTouchTap={handleLeftDrawerToggle.bind(this, i)}>
            build
          </FontIcon>

          <FontIcon style={removeStyle}
                    className="material-icons"
                    onClick={onRemoveItem1.bind(this, i)}>
            close
          </FontIcon>

        </div>
        <Card containerStyle={{height: '100%', width: '100%'}} style={{height: '85%', width: '100%'}}>
          <ECG
            socket={this.props.socket}
            i={i}
            waveform={waveform}
            strokeStyle={strokeStyle}
            lineWidth={lineWidth}
            scale={scale}
            speed={speed}
            showBuffer={true}/>
        </Card>
      </div>
    )
  };

  createPlayElement1 = (el) => {
    let {items1} = this.props;

    let i = el.get('i');
    let item1 = items1.get(i);
    let waveform = item1.get('waveform');
    let strokeStyle = item1.get('strokeStyle');
    let lineWidth = item1.get('lineWidth');
    let scale = item1.get('scale');
    let speed = item1.get('speed');

    if (el.get('y') === null) {
      el = el.set('y', Infinity);
    }

    return (
      <div key={i} data-grid={el.toObject()}>
        <div style={{height: '15%'}}>
          <span style={{
            fontSize: '2em',
            color: color[strokeStyle],
            position: 'absolute',
            left: '0px'
          }}
          >
            {waveform}
          </span>
        </div>
        <div style={{height: '85%', width: '100%'}}>
          <ECG
            socket={this.props.socket}
            i={i}
            waveform={waveform}
            strokeStyle={strokeStyle}
            lineWidth={lineWidth}
            scale={scale}
            speed={speed}
            showBuffer={false}/>
        </div>
      </div>
    )
  };

  // vital sign
  createCustomElement2 = (el) => {
    let {onRemoveItem2, handleRightDrawerToggle, items2} = this.props;

    let removeStyle = {
      position: 'absolute',
      right: '2px',
      top: 0,
      cursor: 'pointer'
    };

    let i = el.get('i');
    let item2 = items2.get(i);
    let vitalSign = item2.get('vitalSign');
    let strokeStyle = item2.get('strokeStyle');

    let w = el.get('w');

    return (
      <div key={i} data-grid={el.toObject()}>
        <div style={{height: '15%'}}>
          <FontIcon className="material-icons" style={{position: 'absolute', top: 0, right: '30px', cursor: 'pointer'}}
                    onTouchTap={handleRightDrawerToggle.bind(this, i)}>
            build
          </FontIcon>

          <FontIcon className="material-icons"
                    style={removeStyle}
                    onClick={onRemoveItem2.bind(this, i)}>
            close
          </FontIcon>
        </div>
        <Card containerStyle={{width: '100%', height: '100%'}} style={{width: '100%', height: '85%'}}>
          <VitalSign
            socket={this.props.socket}
            i={i}
            vitalSign={vitalSign}
            strokeStyle={strokeStyle}
            w={w}/>
        </Card>
      </div>
    )
  };

  createPlayElement2 = (el) => {
    let {items2} = this.props;

    let i = el.get('i');
    let item2 = items2.get(i);
    let vitalSign = item2.get('vitalSign');
    let strokeStyle = item2.get('strokeStyle');

    let w = el.get('w');

    return (
      <div key={i} data-grid={el.toObject()}>
        <div style={{height: '15%'}}>
        </div>
        <div style={{width: '100%', height: '85%'}}>
          <VitalSign
            socket={this.props.socket}
            i={i}
            vitalSign={vitalSign}
            strokeStyle={strokeStyle}
            w={w}/>
        </div>
      </div>
    )
  };

  render() {
    let {
      onLayoutChange1,
      onAddItem1,
      onResetLayout1,
      handleWaveformChange,
      handleColorChange,
      handleScaleChange,
      handleSpeedChange,
      handleLeftDrawerClose,
      onLayoutChange2,
      onResetLayout2,
      onAddItem2,
      handleRightDrawerClose,
      handleVitalSignChange,
      handleVitalSignColorChange,
      handlePowerButtonToggle
    } = this.props;

    let {
      layout1,
      items1,
      layout2,
      items2,
      leftDrawer,
      rightDrawer,
      powerOn
    } = this.props;

    let i1 = leftDrawer.get('i');
    let open1 = leftDrawer.get('open');
    let item1 = items1.get(i1);
    let waveformValue1 = item1 ? item1.get('waveform') : "ECG - II";
    let colorValue1 = item1 ? item1.get('strokeStyle') : "green";
    let scaleValue1 = item1 ? item1.get('scale') : 0.8;
    let speedValue1 = item1 ? item1.get('speed') : 3;

    let i2 = rightDrawer.get('i');
    let open2 = rightDrawer.get('open');
    let item2 = items2.get(i2);
    let vitalSign2 = item2 ? item2.get('vitalSign') : "HR";
    let colorValue2 = item2 ? item2.get('strokeStyle') : "green";

    let customMode = (
      <Grid fluid={true}>
        <Row>
          <Col lg={9} style={{height: '95vh', background: grey900, overflow: 'auto'}}
               className="patientMonitorMobile">
            <ReactGridLayout
              cols={12}
              rowHeight={200}
              onLayoutChange={onLayoutChange1}
              onResizeStop={() => this.forceUpdate()}>

              {layout1.map(this.createCustomElement1)}

            </ReactGridLayout>

            <div style={{
              display: 'flex',
              flexFlow: 'row wrap',
              justifyContent: 'flex-end'
            }}
            >
              <FloatingActionButton
                style={{marginLeft: '20px'}}
                onClick={onResetLayout1}>
                <FontIcon className="material-icons">
                  restore
                </FontIcon>
              </FloatingActionButton>
              <FloatingActionButton
                style={{marginLeft: '20px'}}
                onClick={onAddItem1}>
                <FontIcon className="material-icons">
                  add
                </FontIcon>
              </FloatingActionButton>
            </div>
          </Col >

          <Col lg={3} style={{height: '95vh', background: grey800, overflow: 'auto'}}
               className="patientMonitorMobile">
            <ReactGridLayout
              cols={12}
              rowHeight={200}
              onLayoutChange={onLayoutChange2}
              onResizeStop={() => this.forceUpdate()}>

              {layout2.map(this.createCustomElement2)}

            </ReactGridLayout>

            <div style={{
              display: 'flex',
              flexFlow: 'row wrap',
              justifyContent: 'flex-end'
            }}
            >
              <FloatingActionButton
                style={{marginLeft: '20px'}}
                onClick={onResetLayout2}>
                <FontIcon className="material-icons">
                  restore
                </FontIcon>
              </FloatingActionButton>
              <FloatingActionButton
                style={{marginLeft: '20px'}}
                onClick={onAddItem2}>
                <FontIcon className="material-icons">
                  add
                </FontIcon>
              </FloatingActionButton>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={12} style={{height: '5vh', minHeight: 48, background: grey700}}>
            <IconButton
              style={{
                float: 'right'
              }}
              onClick={handlePowerButtonToggle}
              tooltip="Power"
              tooltipPosition="top-center"
              touch={true}
            >
              <FontIcon className="material-icons" color={powerOn ? red500 : grey50}>
                power_settings_new
              </FontIcon>
            </IconButton>
          </Col>
        </Row>

        <Drawer
          width={300}
          open={open1}
          openSecondary={true}
        >
          <List>
            <Subheader>WaveForm Type and Color</Subheader>
            <ListItem>
              <div>WaveForm</div>
              <SelectField
                floatingLabelText="WaveForm Type"
                value={waveformValue1}
                onChange={handleWaveformChange}
              >
                <MenuItem value="ECG - II" primaryText="ECG - II"/>
                <MenuItem value="PPG" primaryText="PPG"/>
                <MenuItem value="RBBB" primaryText="RBBB"/>
                <MenuItem value="Bigeminy" primaryText="Bigeminy"/>
              </SelectField>
            </ListItem>
            <ListItem>
              <div>Color</div>
              <SelectField
                floatingLabelText="Color Display"
                value={colorValue1}
                onChange={handleColorChange}
              >
                <MenuItem value="green" primaryText="Green"/>
                <MenuItem value="red" primaryText="Red"/>
                <MenuItem value="yellow" primaryText="Yellow"/>
                <MenuItem value="blue" primaryText="Blue"/>
                <MenuItem value="white" primaryText="White"/>
                <MenuItem value="purple" primaryText="Purple"/>
              </SelectField>
            </ListItem>
          </List>
          <Divider />
          <List>
            <Subheader>Scale and Speed</Subheader>
            <div>
              <ListItem>
                <div>Scale</div>
                <Slider
                  min={0}
                  max={2}
                  step={0.05}
                  defaultValue={scaleValue1}
                  value={scaleValue1}
                  onChange={handleScaleChange}
                />
                <div style={{'textAlign': 'center'}}>
                  {scaleValue1}
                </div>
              </ListItem>

              <ListItem>
                <div>Speed</div>
                <Slider
                  min={0}
                  max={10}
                  step={0.5}
                  defaultValue={speedValue1}
                  value={speedValue1}
                  onChange={handleSpeedChange}
                />
                <div style={{'textAlign': 'center'}}>
                  {speedValue1}
                </div>
              </ListItem>
            </div>
          </List>
          <Divider />
          <MenuItem onTouchTap={handleLeftDrawerClose}>Save</MenuItem>
        </Drawer>

        <Drawer
          width={300}
          open={open2}
        >
          <List>
            <Subheader>Vital Sign Type and Color</Subheader>
            <ListItem>
              <div>Vital Sign</div>
              <SelectField
                floatingLabelText="Vital Sign Type"
                value={vitalSign2}
                onChange={handleVitalSignChange}
              >
                <MenuItem value="HR" primaryText="HR"/>
                <MenuItem value="ABP" primaryText="ABP"/>
                <MenuItem value="PAP" primaryText="PAP"/>
                <MenuItem value="SpO2" primaryText="SpO2"/>
                <MenuItem value="RP" primaryText="RP"/>
                <MenuItem value="NBP" primaryText="NBP"/>
              </SelectField>
            </ListItem>
            <ListItem>
              <div>Color</div>
              <SelectField
                floatingLabelText="Color Display"
                value={colorValue2}
                onChange={handleVitalSignColorChange}
              >
                <MenuItem value="green" primaryText="Green"/>
                <MenuItem value="red" primaryText="Red"/>
                <MenuItem value="yellow" primaryText="Yellow"/>
                <MenuItem value="blue" primaryText="Blue"/>
                <MenuItem value="white" primaryText="White"/>
                <MenuItem value="purple" primaryText="Purple"/>
              </SelectField>
            </ListItem>
          </List>
          <MenuItem onTouchTap={handleRightDrawerClose}>Save</MenuItem>
        </Drawer>
      </Grid>
    );

    let powerOnMode = (
      <Grid fluid={true}>
        <Row>
          <Col lg={9} style={{height: '95vh', background: grey900, overflow: 'auto'}}
               className="patientMonitorMobile">

            <ReactGridLayout
              cols={12}
              rowHeight={200}
              isDraggable={false}
              isResizable={false}>

              {layout1.map(this.createPlayElement1)}

            </ReactGridLayout>
          </Col >

          <Col lg={3} style={{height: '95vh', background: grey900, overflow: 'auto'}}
               className="patientMonitorMobile">
            <ReactGridLayout
              cols={12}
              rowHeight={200}
              isDraggable={false}
              isResizable={false}>

              {layout2.map(this.createPlayElement2)}

            </ReactGridLayout>
          </Col>
        </Row>
        <Row>
          <Col lg={12} style={{height: '5vh', minHeight: 48, background: grey700}}>
            <IconButton
              style={{
                float: 'right'
              }}
              onClick={handlePowerButtonToggle}
              tooltip="Power"
              tooltipPosition="top-center"
              touch={true}
            >
              <FontIcon className="material-icons" color={powerOn ? red500 : grey50}>
                power_settings_new
              </FontIcon>
            </IconButton>
          </Col>
        </Row>
      </Grid>
    );
    return powerOn ? powerOnMode : customMode;
  }
}

const mapStateToProps = createStructuredSelector({
  layout1: selectLayout1(),
  items1: selectItems1(),
  layout2: selectLayout2(),
  items2: selectItems2(),
  leftDrawer: selectLeftDrawer(),
  rightDrawer: selectRightDrawer(),
  powerOn: selectPowerOn(),
  socket: selectSocket(),

  ip: selectIP(),
  port: selectPort(),
  protocol: selectProtocol(),
  patientMonitor: selectPatientMonitor()
});

function mapDispatchToProps(dispatch) {
  return {
    onLayoutChange1: (layout1) => dispatch(changeLayout1(layout1)),
    onResetLayout1: () => dispatch(resetLayout1()),
    onAddItem1: () => dispatch(addItem1()),
    onRemoveItem1: (i) => dispatch(removeItem1(i)),

    onLayoutChange2: (layout2) => dispatch(changeLayout2(layout2)),
    onResetLayout2: () => dispatch(resetLayout2()),
    onAddItem2: () => dispatch(addItem2()),
    onRemoveItem2: (i) => dispatch(removeItem2(i)),

    onPowerOnModeKeyUp: (e) => e.keyCode === 27 ? dispatch(handlePowerButtonToggle()) : null,

    handleLeftDrawerToggle: (i) => dispatch(handleLeftDrawerToggle(i)),
    handleLeftDrawerClose: () => dispatch(handleLeftDrawerClose()),
    handleWaveformChange: (event, index, value) => dispatch(handleWaveformChange(value)),
    handleColorChange: (event, index, value) => dispatch(handleColorChange(value)),
    handleScaleChange: (event, value) => dispatch(handleScaleChange(value)),
    handleSpeedChange: (event, value) => dispatch(handleSpeedChange(value)),

    handleRightDrawerToggle: (i) => dispatch(handleRightDrawerToggle(i)),
    handleRightDrawerClose: () => dispatch(handleRightDrawerClose()),
    handleVitalSignChange: (event, index, value) => dispatch(handleVitalSignChange(value)),
    handleVitalSignColorChange: (event, index, value) => dispatch(handleVitalSignColorChange(value)),

    handlePowerButtonToggle: () => dispatch(handlePowerButtonToggle())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientMonitorMobile);
