/**
*
* VitalSignDrawer
*
*/

import React from 'react';

import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {getCommonName} from '../../utils/preferences';

function VitalSignDrawer({
  openVitalSignDrawer,
  vitalSignType,
  handleVitalSignTypeChange,
  vitalSignColor,
  handleVitalSignColorChange,
  handleCloseVitalSignDrawer
}) {
  return (
    <Drawer
      width={300}
      open={openVitalSignDrawer}
    >
      <List>
        <Subheader>Vital Sign Type and Color</Subheader>
        <ListItem>
          <div>Vital Sign</div>
          <SelectField
            floatingLabelText="Vital Sign Type"
            value={vitalSignType}
            onChange={handleVitalSignTypeChange}
          >
            <MenuItem value="MDC_ECG_HEART_RATE" primaryText={getCommonName("MDC_ECG_HEART_RATE")}/>
            <MenuItem value="MDC_TTHOR_RESP_RATE" primaryText={getCommonName("MDC_TTHOR_RESP_RATE")}/>
            <MenuItem value="MDC_PULS_OXIM_PULS_RATE" primaryText={getCommonName("MDC_PULS_OXIM_PULS_RATE")}/>
            <MenuItem value="MDC_PULS_OXIM_SAT_O2" primaryText={getCommonName("MDC_PULS_OXIM_SAT_O2")}/>
            <MenuItem value="MDC_CO2_RESP_RATE" primaryText={getCommonName("MDC_CO2_RESP_RATE")}/>
            <MenuItem value="MDC_AWAY_CO2_ET" primaryText={getCommonName("MDC_AWAY_CO2_ET")}/>
            <MenuItem value="MDC_PRESS_BLD_ART_ABP_NUMERIC" primaryText={getCommonName("MDC_PRESS_BLD_ART_ABP_NUMERIC")}/>
          </SelectField>
        </ListItem>
        <ListItem>
          <div>Color</div>
          <SelectField
            floatingLabelText="Color Display"
            value={vitalSignColor}
            onChange={handleVitalSignColorChange}
          >
            <MenuItem value="green" primaryText="Green"/>
            <MenuItem value="red" primaryText="Red"/>
            <MenuItem value="yellow" primaryText="Yellow"/>
            <MenuItem value="blue" primaryText="Blue"/>
            <MenuItem value="white" primaryText="White"/>
            <MenuItem value="purple" primaryText="Purple"/>
          </SelectField>
        </ListItem>
      </List>
      <MenuItem onTouchTap={handleCloseVitalSignDrawer}>Save</MenuItem>
    </Drawer>
  );
}

VitalSignDrawer.propTypes = {

};

export default VitalSignDrawer;
