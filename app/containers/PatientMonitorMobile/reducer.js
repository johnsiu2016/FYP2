/*
 *
 * PatientMonitorMobile reducer
 *
 */

import {fromJS} from 'immutable';
import uuid from 'node-uuid';

import {
  CHANGE_LAYOUT1,
  RESET_LAYOUT1,
  ADD_ITEM1,
  REMOVE_ITEM1,
  CHANGE_LAYOUT2,
  RESET_LAYOUT2,
  ADD_ITEM2,
  REMOVE_ITEM2,
  PLAY_MODE,
  HANDLE_LEFT_DRAWER_TOGGLE,
  HANDLE_LEFT_DRAWER_CLOSE,
  HANDLE_WAVEFORM_CHANGE,
  HANDLE_COLOR_CHANGE,
  HANDLE_SCALE_CHANGE,
  HANDLE_SPEED_CHANGE,
  HANDLE_RIGHT_DRAWER_TOGGLE,
  HANDLE_RIGHT_DRAWER_CLOSE,
  HANDLE_VITAL_SIGN_CHANGE,
  HANDLE_VITAL_SIGN_COLOR_CHANGE,
  HANDLE_POWER_BUTTON_TOGGLE,
  SOCKET_CONNECTED
} from './constants';

let initL1T1 = initialLayout1AndItem1();
let initL2T2 = initialLayout2AndItem2();

const initialState = fromJS(getFromLS('patientMonitorMobile')) || fromJS({
    layout1: initL1T1.layout1,
    items1: initL1T1.items1,
    layout2: initL2T2.layout2,
    items2: initL2T2.items2,
    leftDrawer: {
      i: '',
      open: false
    },
    rightDrawer: {
      i: '',
      open: false
    },
    powerOn: false,
    socket: null
  });


function patientMonitorMobileReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LAYOUT1:
      let layout1 = state.set('layout1', fromJS(action.layout1));

      saveToLS('patientMonitorMobile', layout1);
      return layout1;

    case RESET_LAYOUT1:
      let initL1T1 = initialLayout1AndItem1();

      return state.set('layout1', fromJS(initL1T1.layout1))
        .set('items1', fromJS(initL1T1.items1));

    case ADD_ITEM1:
      return state.update('layout1', layout1 => layout1.concat(fromJS(action.layout1)))
        .update('items1', items1 => items1.merge(action.items1));

    case REMOVE_ITEM1:
      return state.set('layout1', state.get('layout1').filter((el) => el.get('i') != action.i))
        .set('items1', state.get('items1').delete(action.i));


    case CHANGE_LAYOUT2:
      let layout2 = state.set('layout2', fromJS(action.layout2));

      saveToLS('patientMonitorMobile', layout2);
      return layout2;

    case RESET_LAYOUT2:
      let initL2T2 = initialLayout2AndItem2();

      return state.set('layout2', fromJS(initL2T2.layout2))
        .set('items2', fromJS(initL2T2.items2));

    case ADD_ITEM2:
      return state.update('layout2', layout2 => layout2.concat(fromJS(action.layout2)))
        .update('items2', items2 => items2.merge(action.items2));

    case REMOVE_ITEM2:
      return state.set('layout2', state.get('layout2').filter((el) => el.get('i') != action.i))
        .set('items2', state.get('items2').delete(action.i));


    case HANDLE_LEFT_DRAWER_TOGGLE:
      return state.setIn(['leftDrawer', 'i'], action.i)
        .setIn(['leftDrawer', 'open'], !state.getIn(['leftDrawer', 'open']));

    case HANDLE_LEFT_DRAWER_CLOSE:
      let leftDrawer = state.setIn(['leftDrawer', 'i'], '')
        .setIn(['leftDrawer', 'open'], false);

      saveToLS('patientMonitorMobile', leftDrawer);
      return leftDrawer;

    case HANDLE_WAVEFORM_CHANGE:
      return state.setIn(['items1', state.getIn(['leftDrawer', 'i']), 'waveform'], action.value);

    case HANDLE_COLOR_CHANGE:
      return state.setIn(['items1', state.getIn(['leftDrawer', 'i']), 'strokeStyle'], action.value);

    case HANDLE_SCALE_CHANGE:
      return state.setIn(['items1', state.getIn(['leftDrawer', 'i']), 'scale'], action.value);

    case HANDLE_SPEED_CHANGE:
      return state.setIn(['items1', state.getIn(['leftDrawer', 'i']), 'speed'], action.value);


    case HANDLE_RIGHT_DRAWER_TOGGLE:
      return state.setIn(['rightDrawer', 'i'], action.i)
        .setIn(['rightDrawer', 'open'], !state.getIn(['rightDrawer', 'open']));

    case HANDLE_RIGHT_DRAWER_CLOSE:
      let rightDrawer = state.setIn(['rightDrawer', 'i'], '')
        .setIn(['rightDrawer', 'open'], false);

      saveToLS('patientMonitorMobile', rightDrawer);
      return rightDrawer;

    case HANDLE_VITAL_SIGN_CHANGE:
      return state.setIn(['items2', state.getIn(['rightDrawer', 'i']), 'vitalSign'], action.value);

    case HANDLE_VITAL_SIGN_COLOR_CHANGE:
      return state.setIn(['items2', state.getIn(['rightDrawer', 'i']), 'strokeStyle'], action.value);

    case HANDLE_POWER_BUTTON_TOGGLE:
      return state.set('powerOn', !state.get('powerOn'));

    case SOCKET_CONNECTED:
      console.log(`SOCKET_CONNECTED ${action.socket}`);
      return state.set('socket', action.socket);

    default:
      return state;
  }
}

function saveToLS(key, value) {
  if (localStorage) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  }
}

function getFromLS(key) {
  if (localStorage) {
    try {
      return JSON.parse(localStorage.getItem(key)) || null;
    } catch (e) {
      console.log(e);
    }
  }
}

function initialLayout1AndItem1() {
  let i1 = uuid.v4();
  let i2 = uuid.v4();
  let i3 = uuid.v4();
  let i4 = uuid.v4();
  let i5 = uuid.v4();

  return {
    layout1: [
      {
        i: i1,
        x: 0,
        y: 0,
        w: 12,
        h: 1
      },
      {
        i: i2,
        x: 0,
        y: 1,
        w: 12,
        h: 1
      },
      {
        i: i3,
        x: 0,
        y: 2,
        w: 12,
        h: 1
      },
      {
        i: i4,
        x: 0,
        y: 3,
        w: 12,
        h: 1
      },
      {
        i: i5,
        x: 0,
        y: 4,
        w: 12,
        h: 1
      }
    ],
    items1: {
      [i1]: {
        waveform: 'ECG - II',
        strokeStyle: 'green',
        scale: 0.7,
        speed: 3,
        lineWidth: 3
      },
      [i2]: {
        waveform: 'PPG',
        strokeStyle: 'red',
        scale: 0.7,
        speed: 3,
        lineWidth: 3
      },
      [i3]: {
        waveform: 'RBBB',
        strokeStyle: 'yellow',
        scale: 0.7,
        speed: 3,
        lineWidth: 3
      },
      [i4]: {
        waveform: 'Bigeminy',
        strokeStyle: 'blue',
        scale: 0.7,
        speed: 3,
        lineWidth: 3
      },
      [i5]: {
        waveform: 'ECG - II',
        strokeStyle: 'white',
        scale: 0.7,
        speed: 3,
        lineWidth: 3
      }
    }
  }
}

function initialLayout2AndItem2() {
  let i1 = uuid.v4();
  let i2 = uuid.v4();
  let i3 = uuid.v4();
  let i4 = uuid.v4();
  let i5 = uuid.v4();

  return {
    layout2: [
      {
        i: i1,
        x: 0,
        y: 0,
        w: 12,
        h: 1,
        minW: 6
      },
      {
        i: i2,
        x: 0,
        y: 1,
        w: 12,
        h: 1,
        minW: 6
      },
      {
        i: i3,
        x: 0,
        y: 2,
        w: 12,
        h: 1,
        minW: 6
      },
      {
        i: i4,
        x: 0,
        y: 3,
        w: 12,
        h: 1,
        minW: 6
      },
      {
        i: i5,
        x: 0,
        y: 4,
        w: 12,
        h: 1,
        minW: 6
      }
    ],
    items2: {
      [i1]: {
        vitalSign: 'HR',
        strokeStyle: 'green'
      },
      [i2]: {
        vitalSign: 'ABP',
        strokeStyle: 'red'
      },
      [i3]: {
        vitalSign: 'PAP',
        strokeStyle: 'yellow'
      },
      [i4]: {
        vitalSign: 'SpO2',
        strokeStyle: 'blue'
      },
      [i5]: {
        vitalSign: 'RP',
        strokeStyle: 'white'
      }
    }
  }
}

export default patientMonitorMobileReducer;
