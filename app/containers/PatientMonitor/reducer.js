import {fromJS} from 'immutable';
import * as constant from './constants';

import {
  saveToLS,
  getFromLS,
} from '../../utils/utililtyFunctions';

import uuid from 'node-uuid';
import {processVitalSignControlInput, getSimulationVitalSignData, getSimulationVitalSignDataTemplate} from '../../utils/simulationService';

const initWaveformLayoutAndItems = initialWaveformLayoutAndItems();
const initVitalSignLayoutAndItems = initialVitalSignLayoutAndItems();

let initialState = fromJS(getFromLS('patientMonitor')) || fromJS({
    waveformLayout: initWaveformLayoutAndItems.waveformLayout,
    waveformItems: initWaveformLayoutAndItems.waveformItems,
    vitalSignLayout: initVitalSignLayoutAndItems.vitalSignLayout,
    vitalSignItems: initVitalSignLayoutAndItems.vitalSignItems,
    waveformDrawer: {
      i: '',
      open: false
    },
    vitalSignDrawer: {
      i: '',
      open: false
    },
    powerOn: false,
    socket: null,
    displayMode: "Simulation mode",
    soundOn: false,
    audioSource: null
  });
initialState = initialState.set('powerOn', false);
initialState = initialState.set('socket', null);

function patientMonitorMobileReducer(state = initialState, action) {
  let changedState = null;
  switch (action.type) {
    case constant.CHANGE_WAVEFORM_LAYOUT:
      //if (!state.get('waveformItems').get(action.waveformLayout.length && action.waveformLayout[0].i)) return state; // add this line only because the module has some problem.
      changedState = state.set('waveformLayout', fromJS(action.waveformLayout));
      saveToLS('patientMonitor', changedState);
      return changedState;

    case constant.RESET_WAVEFORM_LAYOUT:
      const initWaveformLayoutAndItems = initialWaveformLayoutAndItems();
      return state.set('waveformLayout', fromJS(initWaveformLayoutAndItems.waveformLayout))
        .set('waveformItems', fromJS(initWaveformLayoutAndItems.waveformItems));

    case constant.ADD_WAVEFORM_ITEM:
      return state.update('waveformLayout', waveformLayout => waveformLayout.concat(fromJS(action.waveformLayout)))
        .update('waveformItems', waveformItems => waveformItems.merge(action.waveformItems));

    case constant.REMOVE_WAVEFORM_ITEM:
      return state.set('waveformLayout', state.get('waveformLayout').filter((el) => el.get('i') !== action.i))
        .set('waveformItems', state.get('waveformItems').delete(action.i));


    case constant.CHANGE_VITAL_SIGN_LAYOUT:
      //if (!state.get('vitalSignItems').get(action.vitalSignLayout.length && action.vitalSignLayout[0].i)) return state; // add this line only because the module has some problem.
      changedState = state.set('vitalSignLayout', fromJS(action.vitalSignLayout));
      saveToLS('patientMonitor', changedState);
      return changedState;

    case constant.RESET_VITAL_SIGN_LAYOUT:
      const initVitalSignLayoutAndItems = initialVitalSignLayoutAndItems();
      return state.set('vitalSignLayout', fromJS(initVitalSignLayoutAndItems.vitalSignLayout))
        .set('vitalSignItems', fromJS(initVitalSignLayoutAndItems.vitalSignItems));

    case constant.ADD_VITAL_SIGN_ITEM:
      return state.update('vitalSignLayout', vitalSignLayout => vitalSignLayout.concat(fromJS(action.vitalSignLayout)))
        .update('vitalSignItems', vitalSignItems => vitalSignItems.merge(action.vitalSignItems));

    case constant.REMOVE_VITAL_SIGN_ITEM:
      return state.set('vitalSignLayout', state.get('vitalSignLayout').filter((el) => el.get('i') !== action.i))
        .set('vitalSignItems', state.get('vitalSignItems').delete(action.i));


    case constant.HANDLE_WAVEFORM_DRAWER_TOGGLE:
      return state.setIn(['waveformDrawer', 'i'], action.i)
        .setIn(['waveformDrawer', 'open'], !state.getIn(['waveformDrawer', 'open']));

    case constant.HANDLE_WAVEFORM_DRAWER_CLOSE:
      changedState = state.setIn(['waveformDrawer', 'i'], '').setIn(['waveformDrawer', 'open'], false);
      saveToLS('patientMonitor', changedState);
      return changedState;

    case constant.HANDLE_WAVEFORM_CHANGE:
      return state.setIn(['waveformItems', state.getIn(['waveformDrawer', 'i']), 'waveform'], action.value);

    case constant.HANDLE_WAVEFORM_COLOR_CHANGE:
      return state.setIn(['waveformItems', state.getIn(['waveformDrawer', 'i']), 'strokeStyle'], action.value);

    case constant.HANDLE_WAVEFORM_LINEWIDTH_CHANGE:
      return state.setIn(['waveformItems', state.getIn(['waveformDrawer', 'i']), 'lineWidth'], action.value);


    case constant.HANDLE_RIGHT_DRAWER_TOGGLE:
      return state.setIn(['vitalSignDrawer', 'i'], action.i)
        .setIn(['vitalSignDrawer', 'open'], !state.getIn(['vitalSignDrawer', 'open']));

    case constant.HANDLE_RIGHT_DRAWER_CLOSE:
      changedState = state.setIn(['vitalSignDrawer', 'i'], '').setIn(['vitalSignDrawer', 'open'], false);
      saveToLS('patientMonitor', changedState);
      return changedState;

    case constant.HANDLE_VITAL_SIGN_CHANGE:
      return state.setIn(['vitalSignItems', state.getIn(['vitalSignDrawer', 'i']), 'vitalSign'], action.value)
        .setIn(['vitalSignItems', state.getIn(['vitalSignDrawer', 'i']), 'formStorage'], getSimulationVitalSignData(action.value))
        .setIn(['vitalSignItems', state.getIn(['vitalSignDrawer', 'i']), 'template'], getSimulationVitalSignDataTemplate(action.value));

    case constant.HANDLE_VITAL_SIGN_COLOR_CHANGE:
      return state.setIn(['vitalSignItems', state.getIn(['vitalSignDrawer', 'i']), 'strokeStyle'], action.value);

    case constant.HANDLE_POWER_BUTTON_TOGGLE:
      return state.set('powerOn', !state.get('powerOn'));
    case constant.SOCKET_CONNECTED:
      console.log(`SOCKET_CONNECTED ${action.socket}`);
      return state.set('socket', action.socket);

    case constant.HANDLE_WAVEFORM_TOOLBAR_GRID_ON_BUTTON_TOGGLE:
      changedState = state.setIn(['waveformItems', action.waveformItemId, "gridOn"], !state.getIn(['waveformItems', action.waveformItemId, "gridOn"]));
      saveToLS('patientMonitor', changedState);
      return changedState;

    case constant.HANDLE_DISPLAY_MODE_CHANGE:
      changedState = state.set('displayMode', action.value);
      saveToLS('patientMonitor', changedState);
      return changedState;

    case constant.HANDLE_VITAL_SIGN_FORMSTORAGE_CHANGE:
      changedState = state.setIn(['vitalSignItems', action.i, 'formStorage'], action.formStorage);
      processVitalSignControlInput(action.vitalSign, action.formStorage);
      saveToLS('patientMonitor', changedState);
      return changedState;

    case constant.HANDLE_HEART_BEEP_SOUND_TOGGLE:
      return state.set('soundOn', !state.get('soundOn'));

    case constant.HANDLE_WAVEFORM_SCALELINE_TOGGLE:
      return state.setIn(['waveformItems', state.getIn(['waveformDrawer', 'i']), 'scaleLine', 'scaleLineOn'], !state.getIn(['waveformItems', state.getIn(['waveformDrawer', 'i']), 'scaleLine', 'scaleLineOn']));

    case constant.HANDLE_WAVEFORM_SCALELINE_TOPLEVEL_CHANGE:
      return state.setIn(['waveformItems', state.getIn(['waveformDrawer', 'i']), 'scaleLine', 'topLevel'], action.value);

    case constant.HANDLE_WAVEFORM_SCALELINE_BOTTOMLEVEL_CHANGE:
      return state.setIn(['waveformItems', state.getIn(['waveformDrawer', 'i']), 'scaleLine', 'bottomLevel'], action.value);

    default:
      return state;
  }
}

export function initialWaveformLayoutAndItems() {
  const i1 = uuid.v4();
  const i2 = uuid.v4();
  const i3 = uuid.v4();
  const i4 = uuid.v4();
  const i5 = uuid.v4();
  const i6 = uuid.v4();

  return {
    waveformLayout: [
      waveformLayoutTemplate(i1, 0, 0, 12, 1),
      waveformLayoutTemplate(i2, 0, 1, 12, 1),
      waveformLayoutTemplate(i3, 0, 2, 12, 1),
      waveformLayoutTemplate(i4, 0, 3, 12, 1),
      waveformLayoutTemplate(i5, 0, 4, 12, 1),
      waveformLayoutTemplate(i6, 0, 5, 12, 1)
    ],
    waveformItems: {
      [i1]: waveformItemTemplate("MDC_ECG_LEAD_I", "green", 3, true, {scaleLineOn: false, topLevel: 150, bottomLevel: 0}),
      [i2]: waveformItemTemplate("MDC_ECG_LEAD_II", "green", 3, true, {scaleLineOn: false, topLevel: 150, bottomLevel: 0}),
      [i3]: waveformItemTemplate("MDC_ECG_LEAD_III", "green", 3, true, {scaleLineOn: false, topLevel: 150, bottomLevel: 0}),
      [i4]: waveformItemTemplate("MDC_PRESS_BLD_ART_ABP", "red", 3, false, {scaleLineOn: true, topLevel: 150, bottomLevel: 0}),
      [i5]: waveformItemTemplate("MDC_PULS_OXIM_PLETH", "blue", 3, false, {scaleLineOn: false, topLevel: 150, bottomLevel: 0}),
      [i6]: waveformItemTemplate("MDC_AWAY_CO2", "white", 3, false, {scaleLineOn: false, topLevel: 150, bottomLevel: 0}),
    }
  }
}

export function initialVitalSignLayoutAndItems() {
  const i1 = uuid.v4();
  const i2 = uuid.v4();
  const i3 = uuid.v4();
  const i4 = uuid.v4();
  const i5 = uuid.v4();

  return {
    vitalSignLayout: [
      vitalSignLayoutTemplate(i1, 0, 0, 12, 1, 6),
      vitalSignLayoutTemplate(i2, 0, 1, 12, 1, 6),
      vitalSignLayoutTemplate(i3, 0, 2, 12, 1, 6),
      vitalSignLayoutTemplate(i4, 0, 3, 12, 1, 6),
      vitalSignLayoutTemplate(i5, 0, 4, 12, 1, 6)
    ],
    vitalSignItems: {
      [i1]: vitalSignItemTemplate("MDC_ECG_HEART_RATE", "green"),
      [i2]: vitalSignItemTemplate("MDC_PRESS_BLD_ART_ABP_NUMERIC", "red"),
      [i3]: vitalSignItemTemplate("PAP", "yellow"),
      [i4]: vitalSignItemTemplate("MDC_PULS_OXIM_SAT_O2", "blue"),
      [i5]: vitalSignItemTemplate("MDC_CO2_RESP_RATE", "white")
    }
  }
}

export function waveformLayoutTemplate(i, x, y, w, h) {
  return {
    i: i,
    x: x || 0,
    y: y || 0,
    w: w || 12,
    h: h || 1
  }
}

export function waveformItemTemplate(waveform, strokeStyle, lineWidth, gridOn, scaleLine) {
  return {
    waveform: waveform || "MDC_ECG_LEAD_II",
    strokeStyle: strokeStyle || "green",
    lineWidth: lineWidth || 3,
    gridOn: gridOn || false,
    scaleLine: scaleLine || {
      scaleLineOn: false,
      topLevel: 150,
      bottomLevel: 0
    }
  }
}

export function vitalSignLayoutTemplate(i, x, y, w, h, minW) {
  return {
    i: i,
    x: x || 0,
    y: y || 0,
    w: w || 12,
    h: h || 1,
    minW: minW || 6
  }
}

export function vitalSignItemTemplate(vitalSign, strokeStyle) {
  return {
    vitalSign: vitalSign || "MDC_ECG_HEART_RATE",
    strokeStyle: strokeStyle || "green",
    formStorage: getSimulationVitalSignData(vitalSign),
    template: getSimulationVitalSignDataTemplate(vitalSign) || 'HR'
  }
}

export default patientMonitorMobileReducer;
