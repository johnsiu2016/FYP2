import {take, call, put, select, fork, cancel} from 'redux-saga/effects';
import {LOCATION_CHANGE} from 'react-router-redux';
import {HANDLE_POWER_BUTTON_TOGGLE} from './constants';
import {selectItems1, selectItems2, selectPowerOn, selectSocket} from './selectors';
import {selectSettingsDomain} from 'containers/Settings/selectors';
import {socketConnected} from './actions'

export function* getSocket() {
  const powerOn = yield select(selectPowerOn());
  const socket = yield select(selectSocket());

  if (powerOn) {
    const settings = yield select(selectSettingsDomain());
    const items1 = yield select(selectItems1());
    const items2 = yield select(selectItems2());

    let socketio = io('http://14.198.32.147:5000');
    socketio.emit('initial', {
      items1: items1,
      items2: items2,
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
