/*
 *
 * PatientMonitorMobile
 *
 */

// basic import
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

// third part import
import {Grid, Row, Col} from 'react-bootstrap';
import ReactGrid, {WidthProvider} from 'react-grid-layout';
const ReactGridLayout = WidthProvider(ReactGrid);

import styled from 'styled-components';

import {grey900, grey800, grey700} from 'material-ui/styles/colors';
import {Card} from 'material-ui/Card';

import {createStructuredSelector} from 'reselect';

// my custom import
import color from '../../utils/color';
import {
  changeWaveformLayout,
  resetWaveformLayout,
  addWaveformItem,
  removeWaveformItem,

  changeVitalSignLayout,
  resetVitalSignLayout,
  addVitalSignItem,
  removeVitalSignItem,

  handleWaveformDrawerToggle,
  handleWaveformDrawerClose,
  handleWaveformChange,
  handleWaveformColorChange,
  handleWaveformScaleChange,

  handleVitalSignDrawerToggle,
  handleVitalSignDrawerClose,
  handleVitalSignChange,
  handleVitalSignColorChange,

  handlePowerButtonToggle,

  handleWaveformToolbarGridOnButtonToggle,
  handleDisplayModeChange
} from './actions';

import {
  makeSelectWaveformLayout,
  makeSelectWaveformItems,
  makeSelectVitalSignLayout,
  makeSelectVitalSignItems,
  makeSelectWaveformDrawer,
  makeSelectVitalSignDrawer,
  makeSelectPowerOn,
  makeSelectSocket,
  makeSelectDisplayMode
} from './selectors';

import {
  selectIP,
  selectPort,
  selectProtocol,
  selectPatientMonitor
} from 'containers/Settings/selectors';

import ECG from 'components/ECG';
import VitalSign from 'components/VitalSign';
import BuildFontIcon from 'components/BuildFontIcon';
import CloseFontIcon from 'components/CloseFontIcon';
import CustomFontIcon from 'components/CustomFontIcon';
import RestoreFloatingButton from 'components/RestoreFloatingButton';
import AddFloatingButton from 'components/AddFloatingButton';
import PowerOnIconButton from 'components/PowerOnIconButton';
import WaveformDrawer from 'components/WaveformDrawer';
import VitalSignDrawer from 'components/VitalSignDrawer';
import DisplayModeDropDownMenu from 'components/DisplayModeDropDownMenu';
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
const ECGControlButtonsWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
`;
const VitalSignToolbarWrapper = styled.div`
  height: 15%;
  width: 100%;
`;
const VitalSignWrapperForPowerOnElement = styled.div`
  height: 85%;
  width: 100%;
`;

export class PatientMonitorMobile extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    window.addEventListener("keyup", this.props.onPowerOnModeKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.props.onPowerOnModeKeyUp);
  }

  render() {
    const {
      changeWaveformLayout,
      addWaveformItem,
      resetWaveformLayout,
      handleWaveformChange,
      handleWaveformColorChange,
      handleWaveformScaleChange,
      handleWaveformDrawerClose,
      changeVitalSignLayout,
      resetVitalSignLayout,
      addVitalSignItem,
      handleVitalSignDrawerClose,
      handleVitalSignChange,
      handleVitalSignColorChange,
      handlePowerButtonToggle,
      handleDisplayModeChange
    } = this.props;

    const {
      waveformLayout,
      waveformItems,
      vitalSignLayout,
      vitalSignItems,
      waveformDrawer,
      vitalSignDrawer,
      powerOn,
      displayMode
    } = this.props;

    const waveformItemId = waveformDrawer.get('i');
    const isWaveformDrawerOpen = waveformDrawer.get('open');
    const waveformItem = waveformItems.get(waveformItemId);
    const waveformType = waveformItem ? waveformItem.get('waveform') : "ECG - II";
    const waveformColor = waveformItem ? waveformItem.get('strokeStyle') : "green";
    const waveformScale = waveformItem ? waveformItem.get('scale') : 0.8;

    const vitalSignItemId = vitalSignDrawer.get('i');
    const isVitalSignDrawerOpen = vitalSignDrawer.get('open');
    const vitalSignItem = vitalSignItems.get(vitalSignItemId);
    const vitalSignType = vitalSignItem ? vitalSignItem.get('vitalSign') : "HR";
    const vitalSignColor = vitalSignItem ? vitalSignItem.get('strokeStyle') : "green";

    const customMode = (
      <Grid fluid={true}>
        <Row>
          <Col lg={9}
               style={{height: '95vh', background: grey900, overflow: 'auto'}}
               className="patientMonitorMobile">
            <ReactGridLayout
              cols={12}
              rowHeight={200}
              onLayoutChange={changeWaveformLayout}
              onResizeStop={() => global.dispatchEvent(new Event('resize'))}
            >
              {waveformLayout.map(this.createWaveformItem)}
            </ReactGridLayout>
            <ECGControlButtonsWrapper>
              <RestoreFloatingButton onClick={resetWaveformLayout}/>
              <AddFloatingButton onClick={addWaveformItem}/>
            </ECGControlButtonsWrapper>
          </Col >
          <Col lg={3}
               style={{height: '95vh', background: grey800, overflow: 'auto'}}
               className="patientMonitorMobile">
            <ReactGridLayout
              cols={12}
              rowHeight={200}
              onLayoutChange={changeVitalSignLayout}
              onResizeStop={() => global.dispatchEvent(new Event('resize'))}
            >
              {vitalSignLayout.map(this.createVitalSignItem)}
            </ReactGridLayout>
            <ECGControlButtonsWrapper>
              <RestoreFloatingButton onClick={resetVitalSignLayout}/>
              <AddFloatingButton onClick={addVitalSignItem}/>
            </ECGControlButtonsWrapper>
          </Col>
        </Row>
        <Row>
          <Col lg={12} style={{height: '5vh', minHeight: 48, background: grey700}}>
            <PowerOnIconButton onClick={handlePowerButtonToggle} powerOn={powerOn}/>
            <DisplayModeDropDownMenu value={displayMode} onChange={handleDisplayModeChange}/>
          </Col>
        </Row>
        <WaveformDrawer
          openWaveformDrawer={isWaveformDrawerOpen}
          waveformType={waveformType}
          handleWaveformTypeChange={handleWaveformChange}
          waveformColor={waveformColor}
          handleWaveformColorChange={handleWaveformColorChange}
          waveformScale={waveformScale}
          handleWaveformScaleChange={handleWaveformScaleChange}
          handleCloseWaveformDrawer={handleWaveformDrawerClose}
        />
        <VitalSignDrawer
          openVitalSignDrawer={isVitalSignDrawerOpen}
          vitalSignType={vitalSignType}
          handleVitalSignTypeChange={handleVitalSignChange}
          vitalSignColor={vitalSignColor}
          handleVitalSignColorChange={handleVitalSignColorChange}
          handleCloseVitalSignDrawer={handleVitalSignDrawerClose}
        />
      </Grid>
    );

    const powerOnMode = (
      <Grid fluid={true}>
        <Row>
          <Col lg={9}
               style={{height: '95vh', background: grey900, overflow: 'auto'}}
               className="patientMonitorMobile">
            <ReactGridLayout
              cols={12}
              rowHeight={200}
              isDraggable={false}
              isResizable={false}
            >
              {waveformLayout.map(this.createWaveformItem)}
            </ReactGridLayout>
          </Col >
          <Col lg={3}
               style={{height: '95vh', background: grey900, overflow: 'auto'}}
               className="patientMonitorMobile">
            <ReactGridLayout
              cols={12}
              rowHeight={200}
              isDraggable={false}
              isResizable={false}
            >
              {vitalSignLayout.map(this.createVitalSignItem)}
            </ReactGridLayout>
          </Col>
        </Row>
        <Row>
          <Col lg={12} style={{height: '5vh', minHeight: 48, background: grey700}}>
            <PowerOnIconButton onClick={handlePowerButtonToggle} powerOn={powerOn}/>
            <DisplayModeDropDownMenu value={displayMode} onChange={handleDisplayModeChange} powerOn={powerOn}/>
          </Col>
        </Row>
      </Grid>
    );
    return powerOn ? powerOnMode : customMode;
  }

  // waveform
  createWaveformItem = (el) => {
    const {
      handleWaveformDrawerToggle,
      removeWaveformItem,
      waveformItems,
      powerOn,
      handleWaveformToolbarGridOnButtonToggle,
      displayMode
    } = this.props;

    const waveformItemId = el.get('i');
    const waveformItem = waveformItems.get(waveformItemId);
    const waveform = waveformItem.get('waveform');
    const strokeStyle = waveformItem.get('strokeStyle');
    const lineWidth = waveformItem.get('lineWidth');
    const scale = waveformItem.get('scale');
    const gridOn = waveformItem.get('gridOn');

    if (el.get('y') === null) {
      el = el.set('y', Infinity);
    }

    const customWaveformItem = (
      <div key={waveformItemId} data-grid={el.toObject()}>
        <ECGToolbarWrapper>
          <ECGText color={color[strokeStyle]}>{waveform}</ECGText>
          <CustomFontIcon iconString="grid_on"
                          onClick={handleWaveformToolbarGridOnButtonToggle.bind(this, waveformItemId)}/>
          <BuildFontIcon onTouchTap={handleWaveformDrawerToggle.bind(this, waveformItemId)}/>
          <CloseFontIcon onClick={removeWaveformItem.bind(this, waveformItemId)}/>
        </ECGToolbarWrapper>
        <Card containerStyle={{height: '100%', width: '100%'}}
              style={{height: '85%', width: '100%', position: 'absolute', zIndex: -1}}>
          <ECG
            socket={this.props.socket}
            i={waveformItemId}
            waveform={waveform}
            strokeStyle={strokeStyle}
            lineWidth={lineWidth}
            scale={scale}
            gridOn={gridOn}
            displayMode={displayMode}/>
        </Card>
      </div>
    );

    const powerOnWaveformItem = (
      <div key={waveformItemId} data-grid={el.toObject()}>
        <ECGToolbarWrapper>
          <ECGText color={color[strokeStyle]}>{waveform}</ECGText>
        </ECGToolbarWrapper>
        <ECGWrapperForPowerOnElement>
          <ECG
            socket={this.props.socket}
            i={waveformItemId}
            waveform={waveform}
            strokeStyle={strokeStyle}
            lineWidth={lineWidth}
            scale={scale}
            gridOn={gridOn}
            displayMode={displayMode}/>
        </ECGWrapperForPowerOnElement>
      </div>
    );

    return powerOn ? powerOnWaveformItem : customWaveformItem;
  };

  // vital sign
  createVitalSignItem = (el) => {
    const {
      removeVitalSignItem,
      handleVitalSignDrawerToggle,
      vitalSignItems,
      powerOn,
      displayMode
    } = this.props;

    const vitalSignItemId = el.get('i');
    const vitalSignItem = vitalSignItems.get(vitalSignItemId);
    const vitalSign = vitalSignItem.get('vitalSign');
    const strokeStyle = vitalSignItem.get('strokeStyle');
    const w = el.get('w');

    const customVitalSignItem = (
      <div key={vitalSignItemId} data-grid={el.toObject()}>
        <VitalSignToolbarWrapper>
          <BuildFontIcon onTouchTap={handleVitalSignDrawerToggle.bind(this, vitalSignItemId)}/>
          <CloseFontIcon onClick={removeVitalSignItem.bind(this, vitalSignItemId)}/>
        </VitalSignToolbarWrapper>
        <Card containerStyle={{width: '100%', height: '100%'}} style={{width: '100%', height: '85%'}}>
          <VitalSign
            socket={this.props.socket}
            i={vitalSignItemId}
            vitalSign={vitalSign}
            strokeStyle={strokeStyle}
            w={w}
            displayMode={displayMode}/>
        </Card>
      </div>
    );

    const powerOnVitalSignItem = (
      <div key={vitalSignItemId} data-grid={el.toObject()}>
        <VitalSignToolbarWrapper/>
        <VitalSignWrapperForPowerOnElement>
          <VitalSign
            socket={this.props.socket}
            i={vitalSignItemId}
            vitalSign={vitalSign}
            strokeStyle={strokeStyle}
            w={w}
            displayMode={displayMode}/>
        </VitalSignWrapperForPowerOnElement>
      </div>
    );

    return powerOn ? powerOnVitalSignItem : customVitalSignItem;
  };
}

const mapStateToProps = createStructuredSelector({
  waveformLayout: makeSelectWaveformLayout(),
  waveformItems: makeSelectWaveformItems(),
  vitalSignLayout: makeSelectVitalSignLayout(),
  vitalSignItems: makeSelectVitalSignItems(),
  waveformDrawer: makeSelectWaveformDrawer(),
  vitalSignDrawer: makeSelectVitalSignDrawer(),
  powerOn: makeSelectPowerOn(),
  socket: makeSelectSocket(),
  displayMode: makeSelectDisplayMode(),

  ip: selectIP(),
  port: selectPort(),
  protocol: selectProtocol(),
  patientMonitor: selectPatientMonitor()
});

function mapDispatchToProps(dispatch) {
  return {
    changeWaveformLayout: (layout1) => dispatch(changeWaveformLayout(layout1)),
    resetWaveformLayout: () => dispatch(resetWaveformLayout()),
    addWaveformItem: () => dispatch(addWaveformItem()),
    removeWaveformItem: (i) => dispatch(removeWaveformItem(i)),

    changeVitalSignLayout: (layout2) => dispatch(changeVitalSignLayout(layout2)),
    resetVitalSignLayout: () => dispatch(resetVitalSignLayout()),
    addVitalSignItem: () => dispatch(addVitalSignItem()),
    removeVitalSignItem: (i) => dispatch(removeVitalSignItem(i)),

    onPowerOnModeKeyUp: (e) => e.keyCode === 27 ? dispatch(handlePowerButtonToggle()) : null,

    handleWaveformDrawerToggle: (i) => dispatch(handleWaveformDrawerToggle(i)),
    handleWaveformDrawerClose: () => dispatch(handleWaveformDrawerClose()),
    handleWaveformChange: (event, index, value) => dispatch(handleWaveformChange(value)),
    handleWaveformColorChange: (event, index, value) => dispatch(handleWaveformColorChange(value)),
    handleWaveformScaleChange: (event, value) => dispatch(handleWaveformScaleChange(value)),

    handleVitalSignDrawerToggle: (i) => dispatch(handleVitalSignDrawerToggle(i)),
    handleVitalSignDrawerClose: () => dispatch(handleVitalSignDrawerClose()),
    handleVitalSignChange: (event, index, value) => dispatch(handleVitalSignChange(value)),
    handleVitalSignColorChange: (event, index, value) => dispatch(handleVitalSignColorChange(value)),

    handlePowerButtonToggle: () => dispatch(handlePowerButtonToggle()),

    handleWaveformToolbarGridOnButtonToggle: (waveformItemId) => dispatch(handleWaveformToolbarGridOnButtonToggle(waveformItemId)),
    handleDisplayModeChange: (event, index, value) => dispatch(handleDisplayModeChange(value))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientMonitorMobile);
