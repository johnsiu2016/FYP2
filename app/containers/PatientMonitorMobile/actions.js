/*
 *
 * PatientMonitorMobile actions
 *
 */
import uuid from 'node-uuid';
import {waveformItemTemplate, vitalSignItemTemplate, waveformLayoutTemplate, vitalSignLayoutTemplate} from '../../utils/utililtyFunctions';

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
  HANDLE_VITAL_SIGN_EDITING_CHANGE
} from './constants';

export function changeWaveformLayout(waveformLayout) {
  return {
    type: CHANGE_WAVEFORM_LAYOUT,
    waveformLayout: waveformLayout
  };
}

export function resetWaveformLayout() {
  return {
    type: RESET_WAVEFORM_LAYOUT
  };
}

export function addWaveformItem() {
  let i = uuid.v4();
  return {
    type: ADD_WAVEFORM_ITEM,
    waveformLayout: [waveformLayoutTemplate(i, 0, Infinity, 12, 1)],
    waveformItems: {[i]: waveformItemTemplate()}
  }
}

export function removeWaveformItem(i) {
  return {
    type: REMOVE_WAVEFORM_ITEM,
    i: i
  };
}

export function changeVitalSignLayout(vitalSignLayout) {
  return {
    type: CHANGE_VITAL_SIGN_LAYOUT,
    vitalSignLayout: vitalSignLayout
  };
}

export function resetVitalSignLayout() {
  return {
    type: RESET_VITAL_SIGN_LAYOUT,
  };
}

export function addVitalSignItem() {
  let i = uuid.v4();
  return {
    type: ADD_VITAL_SIGN_ITEM,
    vitalSignLayout: [vitalSignLayoutTemplate(i, 0, Infinity, 12, 1, 6)],
    vitalSignItems: {[i]: vitalSignItemTemplate()}
  }
}

export function removeVitalSignItem(i) {
  return {
    type: REMOVE_VITAL_SIGN_ITEM,
    i: i
  };
}

export function handleWaveformDrawerToggle(i) {
  return {
    type: HANDLE_WAVEFORM_DRAWER_TOGGLE,
    i: i
  };
}

export function handleWaveformDrawerClose() {
  return {
    type: HANDLE_WAVEFORM_DRAWER_CLOSE,
  };
}

export function handleWaveformChange(value) {
  return {
    type: HANDLE_WAVEFORM_CHANGE,
    value: value
  };
}

export function handleWaveformColorChange(value) {
  return {
    type: HANDLE_WAVEFORM_COLOR_CHANGE,
    value: value
  };
}

export function handleWaveformScaleChange(value) {
  return {
    type: HANDLE_WAVEFORM_SCALE_CHANGE,
    value: value
  };
}

export function handleVitalSignDrawerToggle(i) {
  return {
    type: HANDLE_RIGHT_DRAWER_TOGGLE,
    i: i
  };
}

export function handleVitalSignDrawerClose() {
  return {
    type: HANDLE_RIGHT_DRAWER_CLOSE,
  };
}

export function handleVitalSignChange(value) {
  return {
    type: HANDLE_VITAL_SIGN_CHANGE,
    value: value
  };
}

export function handleVitalSignColorChange(value) {
  return {
    type: HANDLE_VITAL_SIGN_COLOR_CHANGE,
    value: value
  };
}

export function handlePowerButtonToggle() {
  return {
    type: HANDLE_POWER_BUTTON_TOGGLE,
  };
}

export function socketConnected(socket) {
  return {
    type: SOCKET_CONNECTED,
    socket: socket
  };
}

export function handleWaveformToolbarGridOnButtonToggle(waveformItemId) {
  return {
    type: HANDLE_WAVEFORM_TOOLBAR_GRID_ON_BUTTON_TOGGLE,
    waveformItemId: waveformItemId
  }
}

export function handleDisplayModeChange(displayModeValue) {
  return {
    type: HANDLE_DISPLAY_MODE_CHANGE,
    value: displayModeValue
  }
}

export function handleVitalSignEditingChange(i) {
  return {
    type: HANDLE_VITAL_SIGN_EDITING_CHANGE,
    i: i
  }
}
