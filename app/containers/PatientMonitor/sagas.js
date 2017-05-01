import {take, call, put, select, fork, cancel, takeLatest} from 'redux-saga/effects';
import {LOCATION_CHANGE} from 'react-router-redux';
import {HANDLE_POWER_BUTTON_TOGGLE} from './constants';
import {makeSelectPowerOn, makeSelectSocket, makeSelectDisplayMode, selectPatientMonitor} from './selectors';
import {selectSettingsDomain} from 'containers/Settings/selectors';
import {socketConnected} from './actions';
import {loadSimulationWaveform, loadSimulationVitalSign} from '../Admin/sagas';
import * as adminConstant from '../Admin/constants'
import * as settingSelectors from '../Settings/selectors';
import * as constant from './constants'

import {initialize} from 'redux-form/lib/actions';
import {getSimulationVitalSignData} from '../../utils/simulationService';
import config from '../../config.json';

export function* getSocket() {
  const powerOn = yield select(makeSelectPowerOn());
  const socket = yield select(makeSelectSocket());
  const displayMode = yield select(makeSelectDisplayMode());

  if (displayMode === 'Real-time mode') {
    if (powerOn) {
      const connectingDevice = yield select(settingSelectors.selectConnectingDevice());

      let socketio = io(config.socketEndPoint);
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
}

export function* reinitializeReduxForm(action) {
  const patientMonitor = yield select(selectPatientMonitor());
  yield put(initialize(patientMonitor.getIn(['vitalSignDrawer', 'i']), getSimulationVitalSignData(action.value)));
}

export function* getPowerOnWatcher() {
  while (yield take(HANDLE_POWER_BUTTON_TOGGLE)) {
    yield call(getSocket);
  }
}

export function* patientMonitorSaga() {
  // Fork watcher so we can continue execution
  const powerOnWatcher = yield fork(getPowerOnWatcher);
  const waveform_watcher = yield takeLatest(adminConstant.LOAD_SIMULATION_WAVEFORM, loadSimulationWaveform);
  const vital_sign_watcher = yield takeLatest(adminConstant.LOAD_SIMULATION_VITAL_SIGN, loadSimulationVitalSign);
  const reduxFormWatcher = yield takeLatest(constant.HANDLE_VITAL_SIGN_CHANGE, reinitializeReduxForm);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(powerOnWatcher);
  yield cancel(waveform_watcher);
  yield cancel(vital_sign_watcher);
  yield cancel(reduxFormWatcher);
}

// Bootstrap sagas
export default [
  patientMonitorSaga,
];
