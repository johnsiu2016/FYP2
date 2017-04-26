import { createSelector } from 'reselect';

/**
 * Direct selector to the admin state domain
 */
const selectAdminDomain = () => (state) => state.get('admin');

const selectSimulationWaveformLoading = () => createSelector(
  selectAdminDomain(),
  (settingsState) => settingsState.get('simulationWaveformLoading')
);

const selectSimulationWaveformError = () => createSelector(
  selectAdminDomain(),
  (settingsState) => settingsState.get('simulationWaveformError')
);

const selectSimulationWaveformList = () => createSelector(
  selectAdminDomain(),
  (settingsState) => settingsState.get('simulationWaveformList')
);



const selectSimulationVitalSignLoading = () => createSelector(
  selectAdminDomain(),
  (settingsState) => settingsState.get('simulationVitalSignLoading')
);

const selectSimulationVitalSignError = () => createSelector(
  selectAdminDomain(),
  (settingsState) => settingsState.get('simulationVitalSignError')
);

const selectSimulationVitalSignList = () => createSelector(
  selectAdminDomain(),
  (settingsState) => settingsState.get('simulationVitalSignList')
);

/**
 * Default selector used by Admin
 */

const makeSelectAdmin = () => createSelector(
  selectAdminDomain(),
  (substate) => substate.toJS()
);

export {
  selectAdminDomain,
  selectSimulationWaveformLoading,
  selectSimulationWaveformError,
  selectSimulationWaveformList,

  selectSimulationVitalSignLoading,
  selectSimulationVitalSignError,
  selectSimulationVitalSignList
};
