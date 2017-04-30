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
import {vitalSignItemTemplate} from '../../containers/PatientMonitor/reducer';

function VitalSignDrawer({
  simulationVitalSignList,
  vitalSignItem,
  openVitalSignDrawer,
  handleVitalSignTypeChange,
  handleVitalSignColorChange,
  handleCloseVitalSignDrawer
}) {
  const defaultVitalSignItem = vitalSignItemTemplate();
  const vitalSignType = vitalSignItem ? vitalSignItem.get('vitalSign') : defaultVitalSignItem.vitalSign;
  const vitalSignColor = vitalSignItem ? vitalSignItem.get('strokeStyle') : defaultVitalSignItem.vitalSign;

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
            {simulationVitalSignList && simulationVitalSignList.map(ele => (
              <MenuItem key={ele.type} value={ele.type} primaryText={getCommonName(ele.type)}/>
            ))}
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
