import * as constant from './constants';

export function handleSettingsConnectingDevice(deviceId) {
  return {
    type: constant.HANDLE_SETTINGS_CONNECTING_DEVICE,
    deviceId
  };
}

export function handleSettingsSave() {
  return {
    type: constant.HANDLE_SETTINGS_SAVE,
  };
}

export function loadDevices() {
  return {
    type: constant.LOAD_DEVICES,
  };
}

export function devicesLoaded(devices) {
  return {
    type: constant.LOAD_DEVICES_SUCCESS,
    devices
  };
}

export function devicesLoadingError(error) {
  return {
    type: constant.LOAD_DEVICES_ERROR,
    error,
  };
}
