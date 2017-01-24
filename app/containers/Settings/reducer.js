import {fromJS} from 'immutable';

import {
  HANDLE_SETTINGS_CONNECTION_IP,
  HANDLE_SETTINGS_CONNECTION_PORT,
  HANDLE_SETTINGS_CONNECTION_PROTOCOL,
  HANDLE_SETTINGS_CONNECTION_PATIENT_MONITOR,
  HANDLE_SETTINGS_SAVE
} from './constants';

const initialState = fromJS(getFromLS('settings')) || fromJS({
    ip: '192.168.0.1',
    port: '5000',
    protocol: 'TCP',
    patientMonitor: 'Philips'
  });


function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case HANDLE_SETTINGS_CONNECTION_IP:
      return state.set('ip', action.value);

    case HANDLE_SETTINGS_CONNECTION_PORT:
      return state.set('port', action.value);

    case HANDLE_SETTINGS_CONNECTION_PROTOCOL:
      return state.set('protocol', action.value);

    case HANDLE_SETTINGS_CONNECTION_PATIENT_MONITOR:
      return state.set('patientMonitor', action.value);

    case HANDLE_SETTINGS_SAVE:
      saveToLS('settings', state);
      return state;

    default:
      return state;
  }
}

function saveToLS(key, value) {
  if (localStorage) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  }
}

function getFromLS(key) {
  if (localStorage) {
    try {
      return JSON.parse(localStorage.getItem(key)) || null;
    } catch (e) {
      console.log(e);
    }
  }
}

export default settingsReducer;
