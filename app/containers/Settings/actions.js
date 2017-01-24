import {
  HANDLE_SETTINGS_CONNECTION_IP,
  HANDLE_SETTINGS_CONNECTION_PORT,
  HANDLE_SETTINGS_CONNECTION_PROTOCOL,
  HANDLE_SETTINGS_CONNECTION_PATIENT_MONITOR,
  HANDLE_SETTINGS_SAVE
} from './constants';

export function handleSettingsConnectionIP(value) {
  return {
    type: HANDLE_SETTINGS_CONNECTION_IP,
    value: value
  };
}

export function handleSettingsConnectionPort(value) {
  return {
    type: HANDLE_SETTINGS_CONNECTION_PORT,
    value: value
  };
}

export function handleSettingsConnectionProtocol(value) {
  return {
    type: HANDLE_SETTINGS_CONNECTION_PROTOCOL,
    value: value
  };
}

export function handleSettingsConnectionPatientMonitor(value) {
  return {
    type: HANDLE_SETTINGS_CONNECTION_PATIENT_MONITOR,
    value: value
  };
}

export function handleSettingsSave() {
  return {
    type: HANDLE_SETTINGS_SAVE,
  };
}
