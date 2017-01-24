import { createSelector } from 'reselect';

const selectSettingsDomain = () => state => state.get('settings');

const selectIP = () => createSelector(
  selectSettingsDomain(),
  (settingsState) => settingsState.get('ip')
);

const selectPort = () => createSelector(
  selectSettingsDomain(),
  (settingsState) => settingsState.get('port')
);

const selectProtocol = () => createSelector(
  selectSettingsDomain(),
  (settingsState) => settingsState.get('protocol')
);

const selectPatientMonitor = () => createSelector(
  selectSettingsDomain(),
  (settingsState) => settingsState.get('patientMonitor')
);

export {
  selectSettingsDomain,
  selectIP,
  selectPort,
  selectProtocol,
  selectPatientMonitor
};
