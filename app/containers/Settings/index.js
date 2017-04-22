/*
 *
 * Settings
 *
 */

import React from 'react';
import {connect} from 'react-redux';

import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import MenuItem from 'material-ui/MenuItem';

import {GridList, GridTile} from 'material-ui/GridList';
import {Grid} from 'react-bootstrap';
import FontIcon from 'material-ui/FontIcon';

import {createStructuredSelector} from 'reselect';

import * as actions from './actions';

import * as selectors from './selectors';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 900,
    height: 400,
    overflowY: 'auto',
  },
  titleStyle: {
    color: 'white',
  }
};

export class Settings extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.loadDevices();
  }

  componentWillUnmount() {

  }

  reload = () => {
    this.props.loadDevices();
  };


  render() {
    let {
      devicesData,
      connectingDevice,
      loading,
      error
    } = this.props;

    let {
      handleSettingsSave,
      handleSettingsConnectingDevice
    } = this.props;

    let info = '';
    let deviceName = 'Device Name';
    if (loading) {
      info = 'Loading';
    } else if (error) {
      info = 'Cannot reach host';
    } else if (Object.keys(devicesData).length === 0) {
      info = 'No devices connected to server';
    } else if (!connectingDevice) {
      info = 'Please select a device';
    } else if (connectingDevice) {
      info = 'Current device request:'
    }

    if (devicesData && devicesData[connectingDevice]) {
      if (devicesData[connectingDevice]['deviceIdentity']) {
        deviceName = devicesData[connectingDevice]['deviceIdentity'].model;
      } else {
        deviceName = `No name available ${connectingDevice}`;
      }
    }

    return (
      <div style={{background: '#212121', height: '100vh'}}>
        <Grid>
          <Paper>
            <List>
              <Subheader>
                Connected Devices
                <FontIcon className="material-icons"
                          onClick={this.reload}>
                  {'refresh'}
                </FontIcon>
              </Subheader>

              <div style={{
                fontSize: '20px',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                {info}
              </div>

              <div style={{
                fontSize: '20px',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                {deviceName}
              </div>

              {(
                <div style={styles.root}>
                  <GridList
                    cols={3}
                    cellHeight={200}
                    padding={1}
                    style={styles.gridList}
                  >
                    {devicesData && Object.keys(devicesData).map((id) => (
                      <GridTile
                        key={id}
                        onClick={handleSettingsConnectingDevice.bind(this, id)}
                        title={devicesData[id] && devicesData[id].deviceIdentity && devicesData[id].deviceIdentity.model || `${id}`}
                        titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                        titleStyle={styles.titleStyle}
                      >
                        <img
                          src={devicesData[id] && devicesData[id].deviceIdentity && devicesData[id].deviceIdentity.icon.image || '/img/Placeholder.png'}/>
                      </GridTile>
                    ))}
                  </GridList>
                </div>
              )}

            </List>
            <Divider />
            <List>
              <Subheader>Logging</Subheader>
              <ListItem primaryText="Alarm Time" rightToggle={<Toggle />}/>
            </List>
            <Divider />
            <List>
              <Subheader>Alarm</Subheader>
              <ListItem primaryText="Alarm when vital signs exceed limits" rightToggle={<Toggle />}/>
            </List>
            <MenuItem onTouchTap={handleSettingsSave}>Save</MenuItem>
          </Paper>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  connectingDevice: selectors.selectConnectingDevice(),
  loading: selectors.selectLoading(),
  error: selectors.selectError(),
  devicesData: selectors.selectDevicesData(),
});

function mapDispatchToProps(dispatch) {
  return {
    loadDevices: () => dispatch(actions.loadDevices()),
    handleSettingsSave: () => dispatch(actions.handleSettingsSave()),
    handleSettingsConnectingDevice: (id) => dispatch(actions.handleSettingsConnectingDevice(id))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

