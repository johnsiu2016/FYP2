/*
 *
 * PatientMonitorMobile actions
 *
 */
import uuid from 'node-uuid';
import {waveformItemTemplate, vitalSignItemTemplate, waveformLayoutTemplate, vitalSignLayoutTemplate} from '../../utils/utililtyFunctions';

import * as constant from './constants';

export function changeWaveformLayout(waveformLayout) {
  return {
    type: constant.CHANGE_WAVEFORM_LAYOUT,
    waveformLayout: waveformLayout
  };
}

export function resetWaveformLayout() {
  return {
    type: constant.RESET_WAVEFORM_LAYOUT
  };
}

export function addWaveformItem() {
  let i = uuid.v4();
  return {
    type: constant.ADD_WAVEFORM_ITEM,
    waveformLayout: [waveformLayoutTemplate(i, 0, Infinity, 12, 1)],
    waveformItems: {[i]: waveformItemTemplate()}
  }
}

export function removeWaveformItem(i) {
  return {
    type: constant.REMOVE_WAVEFORM_ITEM,
    i: i
  };
}

export function changeVitalSignLayout(vitalSignLayout) {
  return {
    type: constant.CHANGE_VITAL_SIGN_LAYOUT,
    vitalSignLayout: vitalSignLayout
  };
}

export function resetVitalSignLayout() {
  return {
    type: constant.RESET_VITAL_SIGN_LAYOUT,
  };
}

export function addVitalSignItem() {
  let i = uuid.v4();
  return {
    type: constant.ADD_VITAL_SIGN_ITEM,
    vitalSignLayout: [vitalSignLayoutTemplate(i, 0, Infinity, 12, 1, 6)],
    vitalSignItems: {[i]: vitalSignItemTemplate()}
  }
}

export function removeVitalSignItem(i) {
  return {
    type: constant.REMOVE_VITAL_SIGN_ITEM,
    i: i
  };
}

export function handleWaveformDrawerToggle(i) {
  return {
    type: constant.HANDLE_WAVEFORM_DRAWER_TOGGLE,
    i: i
  };
}

export function handleWaveformDrawerClose() {
  return {
    type: constant.HANDLE_WAVEFORM_DRAWER_CLOSE,
  };
}

export function handleWaveformChange(value) {
  return {
    type: constant.HANDLE_WAVEFORM_CHANGE,
    value: value
  };
}

export function handleWaveformColorChange(value) {
  return {
    type: constant.HANDLE_WAVEFORM_COLOR_CHANGE,
    value: value
  };
}

export function handleWaveformScaleChange(value) {
  return {
    type: constant.HANDLE_WAVEFORM_SCALE_CHANGE,
    value: value
  };
}

export function handleVitalSignDrawerToggle(i) {
  return {
    type: constant.HANDLE_RIGHT_DRAWER_TOGGLE,
    i: i
  };
}

export function handleVitalSignDrawerClose() {
  return {
    type: constant.HANDLE_RIGHT_DRAWER_CLOSE,
  };
}

export function handleVitalSignChange(value) {
  return {
    type: constant.HANDLE_VITAL_SIGN_CHANGE,
    value: value
  };
}

export function handleVitalSignColorChange(value) {
  return {
    type: constant.HANDLE_VITAL_SIGN_COLOR_CHANGE,
    value: value
  };
}

export function handlePowerButtonToggle() {
  return {
    type: constant.HANDLE_POWER_BUTTON_TOGGLE,
  };
}

export function socketConnected(socket) {
  return {
    type: constant.SOCKET_CONNECTED,
    socket: socket
  };
}

export function handleWaveformToolbarGridOnButtonToggle(waveformItemId) {
  return {
    type: constant.HANDLE_WAVEFORM_TOOLBAR_GRID_ON_BUTTON_TOGGLE,
    waveformItemId: waveformItemId
  }
}

export function handleDisplayModeChange(displayModeValue) {
  return {
    type: constant.HANDLE_DISPLAY_MODE_CHANGE,
    value: displayModeValue
  }
}

export function handleVitalSignEditingChange(i) {
  return {
    type: constant.HANDLE_VITAL_SIGN_EDITING_CHANGE,
    i: i
  }
}


export function handleVitalSignFormStorageChange(i, formStorage, vitalSign) {
  return {
    type: constant.HANDLE_VITAL_SIGN_FORMSTORAGE_CHANGE,
    i: i,
    formStorage: formStorage,
    vitalSign: vitalSign
  }
}

export function handleHeartBeepSoundToggle() {
  return {
    type: constant.HANDLE_HEART_BEEP_SOUND_TOGGLE,
  }
}
