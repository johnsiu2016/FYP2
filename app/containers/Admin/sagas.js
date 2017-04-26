import {take, call, put, select, cancel, takeLatest} from 'redux-saga/effects';
import {LOCATION_CHANGE} from 'react-router-redux';
import * as constants from './constants';
import * as actions from './actions';

import requests from '../../utils/requests';

const host = 'http://localhost:4000';
const endPoint = '/api/simulation';

export function* loadSimulationWaveform(action) {
  let data;
  let resource = '/waveforms';
  let requestURL;
  let myHeaders = new Headers();
  let options;


  switch (action.httpAction) {
    case 'GETLIST':
      requestURL = `${host}${endPoint}${resource}/find`;
      options = {method: 'GET'};
      break;
    case 'POST':
      data = JSON.stringify(action.postData);
      requestURL = `${host}${endPoint}${resource}`;
      myHeaders.append("Content-Type", "application/json");
      options = {method: 'POST', headers: myHeaders, body: data};
      break;
    case 'GET':
      requestURL = `${host}${endPoint}${resource}/${action._id}`;
      options = {method: 'GET'};
      break;
    case 'PATCH':
      data = JSON.stringify(action.postData);
      requestURL = `${host}${endPoint}${resource}/${action._id}`;
      myHeaders.append("Content-Type", "application/json");
      options = {method: 'PATCH', headers: myHeaders, body: data};
      break;
    case 'DELETE':
      requestURL = `${host}${endPoint}${resource}/${action._id}`;
      options = {method: 'DELETE'};
      break;
  }


  try {
    if (action.httpAction !== 'GETLIST') {
      yield call(requests, requestURL, options);
    }
    requestURL = `${host}${endPoint}/waveforms/find`;
    options = {method: 'GET'};
    let simulationWaveformlist = yield call(requests, requestURL, options);

    yield put(actions.simulationWaveoformLoaded(simulationWaveformlist.response.waveforms));
  } catch (err) {
    yield put(actions.simulationWaveoformLoadingError(err));
  }
}



export function* loadSimulationVitalSign(action) {
  let data;
  let resource = '/vital_signs';
  let requestURL;
  let myHeaders = new Headers();
  let options;


  switch (action.httpAction) {
    case 'GETLIST':
      requestURL = `${host}${endPoint}${resource}/find`;
      options = {method: 'GET'};
      break;
    case 'POST':
      data = JSON.stringify(action.postData);
      requestURL = `${host}${endPoint}${resource}`;
      myHeaders.append("Content-Type", "application/json");
      options = {method: 'POST', headers: myHeaders, body: data};
      break;
    case 'GET':
      requestURL = `${host}${endPoint}/waveforms/${action._id}`;
      options = {method: 'GET'};
      break;
    case 'PATCH':
      data = JSON.stringify(action.postData);
      requestURL = `${host}${endPoint}${resource}/${action._id}`;
      myHeaders.append("Content-Type", "application/json");
      options = {method: 'PATCH', headers: myHeaders, body: data};
      break;
    case 'DELETE':
      requestURL = `${host}${endPoint}${resource}/${action._id}`;
      options = {method: 'DELETE'};
      break;
  }


  try {
    if (action.httpAction !== 'GETLIST') {
      yield call(requests, requestURL, options);
    }
    requestURL = `${host}${endPoint}${resource}/find`;
    options = {method: 'GET'};
    let simulationVitalSignlist = yield call(requests, requestURL, options);

    yield put(actions.simulationVitalSignLoaded(simulationVitalSignlist.response.vital_signs));
  } catch (err) {
    yield put(actions.simulationVitalSignLoadingError(err));
  }
}

export function* adminData() {
  const waveform_watcher = yield takeLatest(constants.LOAD_SIMULATION_WAVEFORM, loadSimulationWaveform);
  const vital_sign_watcher = yield takeLatest(constants.LOAD_SIMULATION_VITAL_SIGN, loadSimulationVitalSign);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(waveform_watcher);
  yield cancel(vital_sign_watcher);
}

// Bootstrap sagas
export default [
  adminData,
];
