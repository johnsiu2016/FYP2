import {fromJS} from 'immutable';

import {
  saveToLS,
  getFromLS,
} from '../../utils/utililtyFunctions';

import * as constants from './constants';

let initialState = fromJS(getFromLS('settings')) || fromJS({
    loading: false,
    error: false,
    connectingDevice: '',
    devicesData: {}
  });
initialState = initialState.set('connectingDevice', '');
initialState = initialState.set('devicesData', {});
initialState = initialState.set('loading', false);
initialState = initialState.set('error', false);


function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case constants.HANDLE_SETTINGS_CONNECTING_DEVICE:
      return state.set('connectingDevice', action.deviceId);

    case constants.LOAD_DEVICES:
      return state
        .set('loading', true)
        .set('error', false)
        .set('devicesData', null);

    case constants.LOAD_DEVICES_SUCCESS:
      return state
        .set('devicesData', action.devices)
        .set('loading', false);

    case constants.LOAD_DEVICES_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);

    case constants.HANDLE_SETTINGS_SAVE:
      saveToLS('settings', state);
      return state;

    default:
      return state;
  }
}

export default settingsReducer;
