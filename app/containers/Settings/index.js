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
import Checkbox from 'material-ui/Checkbox';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {Grid} from 'react-bootstrap';

import {createStructuredSelector} from 'reselect';

import {
  handleSettingsConnectionIP,
  handleSettingsConnectionPort,
  handleSettingsConnectionProtocol,
  handleSettingsConnectionPatientMonitor,
  handleSettingsSave
} from './actions';

import {
  selectIP,
  selectPort,
  selectProtocol,
  selectPatientMonitor
} from './selectors';

export class Settings extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    let {
      handleSettingsConnectionIP,
      handleSettingsConnectionPort,
      handleSettingsConnectionProtocol,
      handleSettingsConnectionPatientMonitor,
      handleSettingsSave,
      ip,
      port,
      protocol,
      patientMonitor
    } = this.props;

    return (
      <div style={{background: '#212121', height: '100vh'}}>
        <Grid>
          <Paper>
            <List>
              <Subheader>Connection</Subheader>
              <ListItem disabled={true}>
                <div>IP</div>
                <TextField
                  defaultValue={ip}
                  onChange={handleSettingsConnectionIP}
                />
              </ListItem>
              <ListItem disabled={true}>
                <div>Port</div>
                <TextField
                  defaultValue={port}
                  onChange={handleSettingsConnectionPort}
                />
              </ListItem>
              <ListItem disabled={true}>
                <div>Protocol</div>
                <SelectField
                  floatingLabelText="Protocol"
                  value={protocol}
                  onChange={handleSettingsConnectionProtocol}
                >
                  <MenuItem value="TCP" primaryText="TCP"/>
                  <MenuItem value="UDP" primaryText="UDP"/>
                </SelectField>
              </ListItem>
              <ListItem disabled={true}>
                <div>Patient Monitor</div>
                <SelectField
                  floatingLabelText="Patient Monitor"
                  value={patientMonitor}
                  onChange={handleSettingsConnectionPatientMonitor}
                >
                  <MenuItem value="Infinity Vista" primaryText="Infinity Vista"/>
                  <MenuItem value="Infinity Delta" primaryText="Infinity Delta"/>
                  <MenuItem value="Philips" primaryText="Philips"/>
                </SelectField>
              </ListItem>
            </List>
            <Divider />
            <List>
              <Subheader>Logging</Subheader>
              <ListItem primaryText="Alert Time Log" rightToggle={<Toggle />}/>
            </List>
            <Divider />
            <List>
              <Subheader>Notifications</Subheader>
              <ListItem
                leftCheckbox={<Checkbox />}
                primaryText="Sounds"
                secondaryText="Hangouts message"
              />
            </List>
            <MenuItem onTouchTap={handleSettingsSave}>Save</MenuItem>
          </Paper>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  ip: selectIP(),
  port: selectPort(),
  protocol: selectProtocol(),
  patientMonitor: selectPatientMonitor()
});

function mapDispatchToProps(dispatch) {
  return {
    handleSettingsConnectionIP: (event) => dispatch(handleSettingsConnectionIP(event.target.value)),
    handleSettingsConnectionPort: (event) => dispatch(handleSettingsConnectionPort(event.target.value)),
    handleSettingsConnectionProtocol: (event, index, value) => dispatch(handleSettingsConnectionProtocol(value)),
    handleSettingsConnectionPatientMonitor: (event, index, value) => dispatch(handleSettingsConnectionPatientMonitor(value)),
    handleSettingsSave: () => dispatch(handleSettingsSave()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
