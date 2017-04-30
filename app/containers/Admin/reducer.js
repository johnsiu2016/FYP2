import {fromJS} from 'immutable';

import {
  getFromLS,
} from '../../utils/utililtyFunctions';

import {
  updateSimulationWaveformData,
  updateSimulationVitalSignData,
} from '../../utils/simulationService';

import * as constants from './constants';

let initialState = fromJS(getFromLS('admin')) || fromJS({
    simulationWaveformLoading: false,
    simulationWaveformError: false,
    simulationWaveformList: null,
    simulationVitalSignLoading: false,
    simulationVitalSignError: false,
    simulationVitalSignList: null,
  });

function adminReducer(state = initialState, action) {
  switch (action.type) {
    case constants.LOAD_SIMULATION_WAVEFORM_ERROR:
      return state
        .set('simulationWaveformLoading', false)
        .set('simulationWaveformError', action.error);
    case constants.LOAD_SIMULATION_WAVEFORM:
      return state
        .set('simulationWaveformLoading', true)
        .set('simulationWaveformError', false)
        .set('simulationWaveformList', null);
    case constants.LOAD_SIMULATION_WAVEFORM_SUCCESS:
      updateSimulationWaveformData(action.simulationWaveformList);
      return state
        .set('simulationWaveformLoading', false)
        .set('simulationWaveformList', action.simulationWaveformList);

    case constants.LOAD_SIMULATION_VITAL_SIGN_ERROR:
      return state
        .set('simulationVitalSignLoading', false)
        .set('simulationVitalSignError', action.error);
    case constants.LOAD_SIMULATION_VITAL_SIGN:
      return state
        .set('simulationVitalSignLoading', true)
        .set('simulationVitalSignError', false)
        .set('simulationVitalSignList', null);
    case constants.LOAD_SIMULATION_VITAL_SIGN_SUCCESS:
      updateSimulationVitalSignData(action.simulationVitalSignList);
      return state
        .set('simulationVitalSignLoading', false)
        .set('simulationVitalSignList', action.simulationVitalSignList);

    default:
      return state;
  }
}

export default adminReducer;
