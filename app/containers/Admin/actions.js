import * as constant from './constants';

export function simulationWaveoformLoadingError(error) {
  return {
    type: constant.LOAD_SIMULATION_WAVEFORM_ERROR,
    error,
  };
}

export function getSimulationWaveformList() {
  return {
    type: constant.LOAD_SIMULATION_WAVEFORM,
    httpAction: 'GETLIST'
  };
}

export function postSimulationWaveform(postData) {
  return {
    type: constant.LOAD_SIMULATION_WAVEFORM,
    httpAction: 'POST',
    postData
  };
}

export function getSimulationWaveform(_id) {
  return {
    type: constant.LOAD_SIMULATION_WAVEFORM,
    httpAction: 'GET',
    _id
  };
}

export function patchSimulationWaveform(_id, postData) {
  return {
    type: constant.LOAD_SIMULATION_WAVEFORM,
    httpAction: 'PATCH',
    _id,
    postData
  };
}

export function deleteSimulationWaveform(_id) {
  return {
    type: constant.LOAD_SIMULATION_WAVEFORM,
    httpAction: 'DELETE',
    _id
  };
}

export function simulationWaveoformLoaded(simulationWaveformList) {
  return {
    type: constant.LOAD_SIMULATION_WAVEFORM_SUCCESS,
    simulationWaveformList
  };
}






export function simulationVitalSignLoadingError(error) {
  return {
    type: constant.LOAD_SIMULATION_VITAL_SIGN_ERROR,
    error,
  };
}

export function getSimulationVitalSignList() {
  return {
    type: constant.LOAD_SIMULATION_VITAL_SIGN,
    httpAction: 'GETLIST'
  };
}

export function postSimulationVitalSign(postData) {
  return {
    type: constant.LOAD_SIMULATION_VITAL_SIGN,
    httpAction: 'POST',
    postData
  };
}

export function getSimulationVitalSign(_id) {
  return {
    type: constant.LOAD_SIMULATION_VITAL_SIGN,
    httpAction: 'GET',
    _id
  };
}

export function patchSimulationVitalSign(_id, postData) {
  return {
    type: constant.LOAD_SIMULATION_VITAL_SIGN,
    httpAction: 'PATCH',
    _id,
    postData
  };
}

export function deleteSimulationVitalSign(_id) {
  return {
    type: constant.LOAD_SIMULATION_VITAL_SIGN,
    httpAction: 'DELETE',
    _id
  };
}

export function simulationVitalSignLoaded(simulationVitalSignList) {
  return {
    type: constant.LOAD_SIMULATION_VITAL_SIGN_SUCCESS,
    simulationVitalSignList
  };
}
