import { createSelector } from 'reselect';

const selectSettingsDomain = () => state => state.get('settings');

const selectLoading = () => createSelector(
  selectSettingsDomain(),
  (settingsState) => settingsState.get('loading')
);

const selectError = () => createSelector(
  selectSettingsDomain(),
  (settingsState) => settingsState.get('error')
);

const selectConnectingDevice = () => createSelector(
  selectSettingsDomain(),
  (settingsState) => settingsState.get('connectingDevice')
);

const selectDevicesData = () => createSelector(
  selectSettingsDomain(),
  (settingsState) => settingsState.get('devicesData')
);


export {
  selectSettingsDomain,
  selectLoading,
  selectError,
  selectConnectingDevice,
  selectDevicesData
};
