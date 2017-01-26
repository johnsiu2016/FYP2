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
            <MenuItem value="HR" primaryText="HR"/>
            <MenuItem value="ABP" primaryText="ABP"/>
            <MenuItem value="PAP" primaryText="PAP"/>
            <MenuItem value="SpO2" primaryText="SpO2"/>
            <MenuItem value="RP" primaryText="RP"/>
            <MenuItem value="NBP" primaryText="NBP"/>
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
