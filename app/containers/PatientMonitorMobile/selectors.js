import { createSelector } from 'reselect';

/**
 * Direct selector to the patientMonitorMobile state domain
 */
const selectPatientMonitorMobileDomain = () => state => state.get('patientMonitorMobile');

/**
 * Other specific selectors
 */


/**
 * Default selector used by PatientMonitorMobile
 */

const selectLayout1 = () => createSelector(
  selectPatientMonitorMobileDomain(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('layout1')
);

const selectItems1 = () => createSelector(
  selectPatientMonitorMobileDomain(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('items1')
);

const selectLayout2 = () => createSelector(
  selectPatientMonitorMobileDomain(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('layout2')
);

const selectItems2 = () => createSelector(
  selectPatientMonitorMobileDomain(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('items2')
);

const selectLeftDrawer = () => createSelector(
  selectPatientMonitorMobileDomain(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('leftDrawer')
);

const selectRightDrawer = () => createSelector(
  selectPatientMonitorMobileDomain(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('rightDrawer')
);

const selectPlay = () => createSelector(
  selectPatientMonitorMobileDomain(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('play')
);

const selectPowerOn = () => createSelector(
  selectPatientMonitorMobileDomain(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('powerOn')
);

const selectSocket = () => createSelector(
  selectPatientMonitorMobileDomain(),
  (patientMonitorMobileState) => patientMonitorMobileState.get('socket')
);

export {
  selectPatientMonitorMobileDomain,
  selectLayout1,
  selectItems1,
  selectLayout2,
  selectItems2,
  selectLeftDrawer,
  selectRightDrawer,
  selectPowerOn,
  selectSocket
};
