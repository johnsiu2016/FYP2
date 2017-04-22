import {take, call, put, select, fork, cancel} from 'redux-saga/effects';
import {LOCATION_CHANGE} from 'react-router-redux';
import {HANDLE_POWER_BUTTON_TOGGLE} from './constants';
import {makeSelectPowerOn, makeSelectSocket} from './selectors';
import {selectSettingsDomain} from 'containers/Settings/selectors';
import {socketConnected} from './actions';

import * as settingSelectors from '../Settings/selectors';

export function* getSocket() {
  const powerOn = yield select(makeSelectPowerOn());
  const socket = yield select(makeSelectSocket());

  if (powerOn) {
    const connectingDevice = yield select(settingSelectors.selectConnectingDevice());

    let socketio = io('http://localhost:5000');
    socketio.emit('initial', connectingDevice);
    socketio.on('initialAck', () => {
      console.log('connected');
    });
    yield put(socketConnected(socketio));

  } else {
      if (socket) {
        socket.disconnect();
      }
    yield put(socketConnected(null));
  }
}

export function* getPowerOnWatcher() {
  while (yield take(HANDLE_POWER_BUTTON_TOGGLE)) {
    yield call(getSocket);
  }
}

export function* patientMonitorSaga() {
  // Fork watcher so we can continue execution
  const powerOnWatcher = yield fork(getPowerOnWatcher);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(powerOnWatcher);
}

// Bootstrap sagas
export default [
  patientMonitorSaga,
];
