// basic import
import React from 'react';
import {connect} from 'react-redux';

// third part import
import {Grid, Row, Col} from 'react-bootstrap';
import ReactGrid, {WidthProvider} from 'react-grid-layout';
const ReactGridLayout = WidthProvider(ReactGrid);
import styled from 'styled-components';
import {grey900, grey800, grey700} from 'material-ui/styles/colors';
import {createStructuredSelector} from 'reselect';

// my custom import
import audio from '../../utils/audio';
import * as actions from './actions';
import * as selectors from './selectors';

import {defaultVitalSignData} from '../../utils/simuationData';

import ECG from 'components/ECG';
import VitalSign from 'components/VitalSign';
import RestoreFloatingButton from 'components/RestoreFloatingButton';
import AddFloatingButton from 'components/AddFloatingButton';
import PowerOnIconButton from 'components/PowerOnIconButton';
import WaveformDrawer from 'components/WaveformDrawer';
import VitalSignDrawer from 'components/VitalSignDrawer';
import DisplayModeDropDownMenu from 'components/DisplayModeDropDownMenu';
import SoundOnIconButton from 'components/SoundOnIconButton';
const ECGControlButtonsWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
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
      handleWaveformLineWidthChange,
      handleWaveformDrawerClose,
      changeVitalSignLayout,
      resetVitalSignLayout,
      addVitalSignItem,
      handleVitalSignDrawerClose,
      handleVitalSignChange,
      handleVitalSignColorChange,
      handlePowerButtonToggle,
      handleDisplayModeChange,
      handleHeartBeepSoundToggle,
      handleWaveformScaleLineToggle,
      handleWaveformScaleLineTopLevelChange,
      handleWaveformScaleLineBottomLevelChange
    } = this.props;

    const {
      waveformLayout,
      waveformItems,
      vitalSignLayout,
      vitalSignItems,
      waveformDrawer,
      vitalSignDrawer,
      powerOn,
      displayMode,
      soundOn
    } = this.props;

    const waveformItemId = waveformDrawer.get('i');
    const isWaveformDrawerOpen = waveformDrawer.get('open');
    const waveformItem = waveformItems.get(waveformItemId);

    const vitalSignItemId = vitalSignDrawer.get('i');
    const isVitalSignDrawerOpen = vitalSignDrawer.get('open');
    const vitalSignItem = vitalSignItems.get(vitalSignItemId);

    if (soundOn) {
      audio.gainNode.gain.value = 1;
    } else {
      audio.gainNode.gain.value = 0;
    }

    return powerOn ? (
      <Grid fluid={true}>
        <Row>
          <Col lg={9}
               style={{height: '95vh', background: grey900, overflow: 'auto'}}
               className="patientMonitor">
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
               className="patientMonitor">
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
            <SoundOnIconButton onClick={handleHeartBeepSoundToggle} soundOn={soundOn}/>
          </Col>
        </Row>
      </Grid>)

      :

      (<Grid fluid={true}>
        <Row>
          <Col lg={9}
               style={{height: '95vh', background: grey900, overflow: 'auto'}}
               className="patientMonitor">
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
               className="patientMonitor">
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
            <SoundOnIconButton onClick={handleHeartBeepSoundToggle} soundOn={soundOn}/>
          </Col>
        </Row>
        <WaveformDrawer
          waveformItem={waveformItem}
          openWaveformDrawer={isWaveformDrawerOpen}
          handleWaveformTypeChange={handleWaveformChange}
          handleWaveformColorChange={handleWaveformColorChange}
          handleWaveformLineWidthChange={handleWaveformLineWidthChange}
          handleCloseWaveformDrawer={handleWaveformDrawerClose}
          handleWaveformScaleLineToggle={handleWaveformScaleLineToggle}
          handleWaveformScaleLineTopLevelChange={handleWaveformScaleLineTopLevelChange}
          handleWaveformScaleLineBottomLevelChange={handleWaveformScaleLineBottomLevelChange}
        />
        <VitalSignDrawer
          vitalSignItem={vitalSignItem}
          openVitalSignDrawer={isVitalSignDrawerOpen}
          handleVitalSignTypeChange={handleVitalSignChange}
          handleVitalSignColorChange={handleVitalSignColorChange}
          handleCloseVitalSignDrawer={handleVitalSignDrawerClose}
        />
      </Grid>);
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
    const gridOn = waveformItem.get('gridOn');
    const scaleLine = waveformItem.get('scaleLine');

    if (el.get('y') === null) {
      el = el.set('y', Infinity);
    }

    return (
      <div key={waveformItemId} data-grid={el.toObject()}>
        <ECG
          handleWaveformDrawerToggle={handleWaveformDrawerToggle}
          removeWaveformItem={removeWaveformItem}
          handleWaveformToolbarGridOnButtonToggle={handleWaveformToolbarGridOnButtonToggle}
          socket={this.props.socket}
          waveformItemId={waveformItemId}
          waveform={waveform}
          strokeStyle={strokeStyle}
          lineWidth={lineWidth}
          gridOn={gridOn}
          displayMode={displayMode}
          powerOn={powerOn}
          scaleLine={scaleLine}/>
      </div>);
  };

  // vital sign
  createVitalSignItem = (el) => {
    const {
      removeVitalSignItem,
      handleVitalSignDrawerToggle,
      vitalSignItems,
      powerOn,
      displayMode,
      handleVitalSignFormStorageChange,
    } = this.props;

    const vitalSignItemId = el.get('i');
    const vitalSignItem = vitalSignItems.get(vitalSignItemId);
    const vitalSign = vitalSignItem.get('vitalSign');
    const strokeStyle = vitalSignItem.get('strokeStyle');
    const formStorage = vitalSignItem.get('formStorage');
    const w = el.get('w');

    return (
      <div key={vitalSignItemId} data-grid={el.toObject()}>
        <VitalSign
          socket={this.props.socket}
          vitalSignItemId={vitalSignItemId}
          vitalSign={vitalSign}
          strokeStyle={strokeStyle}
          w={w}
          displayMode={displayMode}
          handleVitalSignFormStorageChange={handleVitalSignFormStorageChange.bind(this, vitalSignItemId)}
          initialValues={formStorage || defaultVitalSignData[vitalSign]}
          powerOn={powerOn}
          handleVitalSignDrawerToggle={handleVitalSignDrawerToggle.bind(this, vitalSignItemId)}
          removeVitalSignItem={removeVitalSignItem.bind(this, vitalSignItemId)}/>
      </div>);
  };
}

const mapStateToProps = createStructuredSelector({
  waveformLayout: selectors.makeSelectWaveformLayout(),
  waveformItems: selectors.makeSelectWaveformItems(),
  vitalSignLayout: selectors.makeSelectVitalSignLayout(),
  vitalSignItems: selectors.makeSelectVitalSignItems(),
  waveformDrawer: selectors.makeSelectWaveformDrawer(),
  vitalSignDrawer: selectors.makeSelectVitalSignDrawer(),
  powerOn: selectors.makeSelectPowerOn(),
  socket: selectors.makeSelectSocket(),
  displayMode: selectors.makeSelectDisplayMode(),
  audioSource: selectors.makeSelectAudioSource(),
  soundOn: selectors.makeSelectSoundOn(),

});

function mapDispatchToProps(dispatch) {
  return {
    changeWaveformLayout: (layout1) => dispatch(actions.changeWaveformLayout(layout1)),
    resetWaveformLayout: () => dispatch(actions.resetWaveformLayout()),
    addWaveformItem: () => dispatch(actions.addWaveformItem()),
    removeWaveformItem: (i) => dispatch(actions.removeWaveformItem(i)),

    changeVitalSignLayout: (layout2) => dispatch(actions.changeVitalSignLayout(layout2)),
    resetVitalSignLayout: () => dispatch(actions.resetVitalSignLayout()),
    addVitalSignItem: () => dispatch(actions.addVitalSignItem()),
    removeVitalSignItem: (i) => dispatch(actions.removeVitalSignItem(i)),

    onPowerOnModeKeyUp: (e) => e.keyCode === 27 ? dispatch(actions.handlePowerButtonToggle()) : null,

    handleWaveformDrawerToggle: (i) => dispatch(actions.handleWaveformDrawerToggle(i)),
    handleWaveformDrawerClose: () => dispatch(actions.handleWaveformDrawerClose()),
    handleWaveformChange: (event, index, value) => dispatch(actions.handleWaveformChange(value)),
    handleWaveformColorChange: (event, index, value) => dispatch(actions.handleWaveformColorChange(value)),
    handleWaveformLineWidthChange: (event, value) => dispatch(actions.handleWaveformLineWidthChange(value)),

    handleVitalSignDrawerToggle: (i) => dispatch(actions.handleVitalSignDrawerToggle(i)),
    handleVitalSignDrawerClose: () => dispatch(actions.handleVitalSignDrawerClose()),
    handleVitalSignChange: (event, index, value) => dispatch(actions.handleVitalSignChange(value)),
    handleVitalSignColorChange: (event, index, value) => dispatch(actions.handleVitalSignColorChange(value)),

    handlePowerButtonToggle: () => dispatch(actions.handlePowerButtonToggle()),

    handleWaveformToolbarGridOnButtonToggle: (waveformItemId) => dispatch(actions.handleWaveformToolbarGridOnButtonToggle(waveformItemId)),
    handleDisplayModeChange: (event, index, value) => dispatch(actions.handleDisplayModeChange(value)),
    handleVitalSignFormStorageChange: (i, formStorage, vitalSign) => dispatch(actions.handleVitalSignFormStorageChange(i, formStorage, vitalSign)),

    handleHeartBeepSoundToggle: () => dispatch(actions.handleHeartBeepSoundToggle()),

    handleWaveformScaleLineToggle: () => dispatch(actions.handleWaveformScaleLineToggle()),
    handleWaveformScaleLineTopLevelChange: (event, value) => dispatch(actions.handleWaveformScaleLineTopLevelChange(value)),
    handleWaveformScaleLineBottomLevelChange: (event, value) => dispatch(actions.handleWaveformScaleLineBottomLevelChange(value)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientMonitorMobile);
