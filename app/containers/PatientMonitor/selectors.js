import { createSelector } from 'reselect';

/**
 * Direct selector to the patientMonitor state domain
 */
const selectPatientMonitor = () => state => state.get('patientMonitor');

/**
 * Other specific selectors
 */


/**
 * Default selector used by PatientMonitor
 */

const makeSelectWaveformLayout = () => createSelector(
  selectPatientMonitor(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('waveformLayout')
);

const makeSelectWaveformItems = () => createSelector(
  selectPatientMonitor(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('waveformItems')
);

const makeSelectVitalSignLayout = () => createSelector(
  selectPatientMonitor(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('vitalSignLayout')
);

const makeSelectVitalSignItems = () => createSelector(
  selectPatientMonitor(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('vitalSignItems')
);

const makeSelectWaveformDrawer = () => createSelector(
  selectPatientMonitor(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('waveformDrawer')
);

const makeSelectVitalSignDrawer = () => createSelector(
  selectPatientMonitor(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('vitalSignDrawer')
);

const makeSelectPowerOn = () => createSelector(
  selectPatientMonitor(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('powerOn')
);

const makeSelectSocket = () => createSelector(
  selectPatientMonitor(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('socket')
);

const makeSelectDisplayMode = () => createSelector(
  selectPatientMonitor(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('displayMode')
);

const makeSelectAudioSource = () => createSelector(
  selectPatientMonitor(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('audioSource')
);

const makeSelectSoundOn = () => createSelector(
  selectPatientMonitor(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('soundOn')
);

export {
  selectPatientMonitor,
  makeSelectWaveformLayout,
  makeSelectWaveformItems,
  makeSelectVitalSignLayout,
  makeSelectVitalSignItems,
  makeSelectWaveformDrawer,
  makeSelectVitalSignDrawer,
  makeSelectPowerOn,
  makeSelectSocket,
  makeSelectDisplayMode,
  makeSelectAudioSource,
  makeSelectSoundOn
};
