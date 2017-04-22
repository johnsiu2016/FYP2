import { take, call, put, select, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import * as constants from './constants';
import * as actions from './actions';

import requests from '../../utils/requests';


export function* getDevices() {
  const requestURL = `http://localhost:4000/api/devices`;
  try {
    const devices = yield call(requests, requestURL);
    yield put(actions.devicesLoaded(devices.response));
  } catch (err) {
    yield put(actions.devicesLoadingError(err));
  }
}

export function* settingsData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  const watcher = yield takeLatest(constants.LOAD_DEVICES, getDevices);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  settingsData,
];
