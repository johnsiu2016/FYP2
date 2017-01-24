
import { fromJS } from 'immutable';
import patientMonitorMobileReducer from '../reducer';

describe('patientMonitorMobileReducer', () => {
  it('returns the initial state', () => {
    expect(patientMonitorMobileReducer(undefined, {})).toEqual(fromJS({}));
  });
});
