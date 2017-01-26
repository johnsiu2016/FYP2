import {take, call, put, select, fork, cancel} from 'redux-saga/effects';
import {LOCATION_CHANGE} from 'react-router-redux';
import {HANDLE_POWER_BUTTON_TOGGLE} from './constants';
import {makeSelectWaveformItems, makeSelectVitalSignItems, makeSelectPowerOn, makeSelectSocket} from './selectors';
import {selectSettingsDomain} from 'containers/Settings/selectors';
import {socketConnected} from './actions'

export function* getSocket() {
  const powerOn = yield select(makeSelectPowerOn());
  const socket = yield select(makeSelectSocket());

  if (powerOn) {
    const settings = yield select(selectSettingsDomain());
    const items1 = yield select(makeSelectWaveformItems());
    const items2 = yield select(makeSelectVitalSignItems());

    let socketio = io('http://localhost:5000');
    socketio.emit('initial', {
      waveformItems: items1,
      vitalSignItems: items2,
      ip: settings.get('ip'),
      port: settings.get('port'),
      protocol: settings.get('protocol'),
      patientMonitor: settings.get('patientMonitor')
    });
    socketio.on('initialAck', () => {
      console.log('connected');
    });
    yield put(socketConnected(socketio));

  } else if (socket) {
    socket.disconnect();
    yield put(socketConnected(null));
  }
}

export function* getPowerOnWatcher() {
  while (yield take(HANDLE_POWER_BUTTON_TOGGLE)) {
    yield call(getSocket);
  }
}

export function* socketIO() {
  // Fork watcher so we can continue execution
  const watcher = yield fork(getPowerOnWatcher);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  socketIO,
];
