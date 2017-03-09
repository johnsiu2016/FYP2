import { createSelector } from 'reselect';

/**
 * Direct selector to the patientMonitor state domain
 */
const selectPatientMonitorMobile = () => state => state.get('patientMonitor');

/**
 * Other specific selectors
 */


/**
 * Default selector used by PatientMonitor
 */

const makeSelectWaveformLayout = () => createSelector(
  selectPatientMonitorMobile(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('waveformLayout')
);

const makeSelectWaveformItems = () => createSelector(
  selectPatientMonitorMobile(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('waveformItems')
);

const makeSelectVitalSignLayout = () => createSelector(
  selectPatientMonitorMobile(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('vitalSignLayout')
);

const makeSelectVitalSignItems = () => createSelector(
  selectPatientMonitorMobile(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('vitalSignItems')
);

const makeSelectWaveformDrawer = () => createSelector(
  selectPatientMonitorMobile(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('waveformDrawer')
);

const makeSelectVitalSignDrawer = () => createSelector(
  selectPatientMonitorMobile(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('vitalSignDrawer')
);

const makeSelectPowerOn = () => createSelector(
  selectPatientMonitorMobile(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('powerOn')
);

const makeSelectSocket = () => createSelector(
  selectPatientMonitorMobile(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('socket')
);

const makeSelectDisplayMode = () => createSelector(
  selectPatientMonitorMobile(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('displayMode')
);

const makeSelectAudioSource = () => createSelector(
  selectPatientMonitorMobile(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('audioSource')
);

const makeSelectSoundOn = () => createSelector(
  selectPatientMonitorMobile(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('soundOn')
);

export {
  selectPatientMonitorMobile,
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
