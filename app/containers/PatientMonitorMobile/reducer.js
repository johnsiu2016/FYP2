/*
 *
 * PatientMonitorMobile reducer
 *
 */

import {fromJS} from 'immutable';

import {
  CHANGE_WAVEFORM_LAYOUT,
  RESET_WAVEFORM_LAYOUT,
  ADD_WAVEFORM_ITEM,
  REMOVE_WAVEFORM_ITEM,
  CHANGE_VITAL_SIGN_LAYOUT,
  RESET_VITAL_SIGN_LAYOUT,
  ADD_VITAL_SIGN_ITEM,
  REMOVE_VITAL_SIGN_ITEM,
  HANDLE_WAVEFORM_DRAWER_TOGGLE,
  HANDLE_WAVEFORM_DRAWER_CLOSE,
  HANDLE_WAVEFORM_CHANGE,
  HANDLE_WAVEFORM_COLOR_CHANGE,
  HANDLE_WAVEFORM_SCALE_CHANGE,
  HANDLE_RIGHT_DRAWER_TOGGLE,
  HANDLE_RIGHT_DRAWER_CLOSE,
  HANDLE_VITAL_SIGN_CHANGE,
  HANDLE_VITAL_SIGN_COLOR_CHANGE,
  HANDLE_POWER_BUTTON_TOGGLE,
  SOCKET_CONNECTED,
  HANDLE_WAVEFORM_TOOLBAR_GRID_ON_BUTTON_TOGGLE,
  HANDLE_DISPLAY_MODE_CHANGE,
  HANDLE_VITAL_SIGN_EDITING_CHANGE,
  HANDLE_VITAL_SIGN_FORMSTORAGE_CHANGE
} from './constants';

import {
  saveToLS,
  getFromLS,
  initialWaveformLayoutAndItems,
  initialVitalSignLayoutAndItems
} from '../../utils/utililtyFunctions';

const initWaveformLayoutAndItems = initialWaveformLayoutAndItems();
const initVitalSignLayoutAndItems = initialVitalSignLayoutAndItems();

const initialState = fromJS(getFromLS('patientMonitorMobile')) || fromJS({
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
    displayMode: "Simulation mode"
  });


function patientMonitorMobileReducer(state = initialState, action) {
  let changedState = null;
  switch (action.type) {
    case CHANGE_WAVEFORM_LAYOUT:
      changedState = state.set('waveformLayout', fromJS(action.waveformLayout));
      saveToLS('patientMonitorMobile', changedState);
      return changedState;

    case RESET_WAVEFORM_LAYOUT:
      const initWaveformLayoutAndItems = initialWaveformLayoutAndItems();
      return state.set('waveformLayout', fromJS(initWaveformLayoutAndItems.waveformLayout))
        .set('waveformItems', fromJS(initWaveformLayoutAndItems.waveformItems));

    case ADD_WAVEFORM_ITEM:
      return state.update('waveformLayout', waveformLayout => waveformLayout.concat(fromJS(action.waveformLayout)))
        .update('waveformItems', waveformItems => waveformItems.merge(action.waveformItems));

    case REMOVE_WAVEFORM_ITEM:
      return state.set('waveformLayout', state.get('waveformLayout').filter((el) => el.get('i') != action.i))
        .set('waveformItems', state.get('waveformItems').delete(action.i));


    case CHANGE_VITAL_SIGN_LAYOUT:
      changedState = state.set('vitalSignLayout', fromJS(action.vitalSignLayout));
      saveToLS('patientMonitorMobile', changedState);
      return changedState;

    case RESET_VITAL_SIGN_LAYOUT:
      const initVitalSignLayoutAndItems = initialVitalSignLayoutAndItems();
      return state.set('vitalSignLayout', fromJS(initVitalSignLayoutAndItems.vitalSignLayout))
        .set('vitalSignItems', fromJS(initVitalSignLayoutAndItems.vitalSignItems));

    case ADD_VITAL_SIGN_ITEM:
      return state.update('vitalSignLayout', vitalSignLayout => vitalSignLayout.concat(fromJS(action.vitalSignLayout)))
        .update('vitalSignItems', vitalSignItems => vitalSignItems.merge(action.vitalSignItems));

    case REMOVE_VITAL_SIGN_ITEM:
      return state.set('vitalSignLayout', state.get('vitalSignLayout').filter((el) => el.get('i') != action.i))
        .set('vitalSignItems', state.get('vitalSignItems').delete(action.i));


    case HANDLE_WAVEFORM_DRAWER_TOGGLE:
      return state.setIn(['waveformDrawer', 'i'], action.i)
        .setIn(['waveformDrawer', 'open'], !state.getIn(['waveformDrawer', 'open']));

    case HANDLE_WAVEFORM_DRAWER_CLOSE:
      changedState = state.setIn(['waveformDrawer', 'i'], '').setIn(['waveformDrawer', 'open'], false);
      saveToLS('patientMonitorMobile', changedState);
      return changedState;

    case HANDLE_WAVEFORM_CHANGE:
      return state.setIn(['waveformItems', state.getIn(['waveformDrawer', 'i']), 'waveform'], action.value);

    case HANDLE_WAVEFORM_COLOR_CHANGE:
      return state.setIn(['waveformItems', state.getIn(['waveformDrawer', 'i']), 'strokeStyle'], action.value);

    case HANDLE_WAVEFORM_SCALE_CHANGE:
      return state.setIn(['waveformItems', state.getIn(['waveformDrawer', 'i']), 'scale'], action.value);


    case HANDLE_RIGHT_DRAWER_TOGGLE:
      return state.setIn(['vitalSignDrawer', 'i'], action.i)
        .setIn(['vitalSignDrawer', 'open'], !state.getIn(['vitalSignDrawer', 'open']));

    case HANDLE_RIGHT_DRAWER_CLOSE:
      changedState = state.setIn(['vitalSignDrawer', 'i'], '').setIn(['vitalSignDrawer', 'open'], false);
      saveToLS('patientMonitorMobile', changedState);
      return changedState;

    case HANDLE_VITAL_SIGN_CHANGE:
      return state.setIn(['vitalSignItems', state.getIn(['vitalSignDrawer', 'i']), 'vitalSign'], action.value);

    case HANDLE_VITAL_SIGN_COLOR_CHANGE:
      return state.setIn(['vitalSignItems', state.getIn(['vitalSignDrawer', 'i']), 'strokeStyle'], action.value);

    case HANDLE_POWER_BUTTON_TOGGLE:
      return state.set('powerOn', !state.get('powerOn'));

    case SOCKET_CONNECTED:
      console.log(`SOCKET_CONNECTED ${action.socket}`);
      return state.set('socket', action.socket);

    case HANDLE_WAVEFORM_TOOLBAR_GRID_ON_BUTTON_TOGGLE:
      changedState = state.setIn(['waveformItems', action.waveformItemId, "gridOn"], !state.getIn(['waveformItems', action.waveformItemId, "gridOn"]));
      saveToLS('patientMonitorMobile', changedState);
      return changedState;

    case HANDLE_DISPLAY_MODE_CHANGE:
      return state.set('displayMode', action.value);

    case HANDLE_VITAL_SIGN_EDITING_CHANGE:
      return state.setIn(['vitalSignItems', action.i, 'isEditing'], true);

    case HANDLE_VITAL_SIGN_FORMSTORAGE_CHANGE:
      console.log("HANDLE_VITAL_SIGN_FORMSTORAGE_CHANGE");
      console.log(action.vitalSign);
      changedState = state.setIn(['vitalSignItems', action.i, 'formStorage'], action.formStorage);
      if (action.vitalSign === "HR") window._HR = action.formStorage.get("data");
      if (action.vitalSign === "ABP") {
        const systolic = action.formStorage.get("systolic");
        const diastolic = action.formStorage.get("diastolic");
        const mean = action.formStorage.get("mean");

        window._ABPHeight = Number(systolic) - Number(diastolic);
        window._ABPSystolic = Number(systolic);
      }
      saveToLS('patientMonitorMobile', changedState);
      return changedState;

    default:
      return state;
  }
}

export default patientMonitorMobileReducer;
