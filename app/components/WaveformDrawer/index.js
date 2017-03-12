/**
*
* WaveformDrawer
*
*/

import React from 'react';

import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Slider from 'material-ui/Slider';

import {getCommonName} from '../../utils/preferences';

function WaveformDrawer({
  openWaveformDrawer,
  waveformType,
  handleWaveformTypeChange,
  waveformColor,
  handleWaveformColorChange,
  waveformLineWidth,
  handleWaveformLineWidthChange,
  handleCloseWaveformDrawer
}) {
  return (
    <Drawer
      width={300}
      open={openWaveformDrawer}
      openSecondary={true}
    >
      <List>
        <Subheader>WaveForm Type and Color</Subheader>
        <ListItem>
          <div>WaveForm</div>
          <SelectField
            floatingLabelText="WaveForm Type"
            value={waveformType}
            onChange={handleWaveformTypeChange}
          >
            <MenuItem value="MDC_ECG_LEAD_I" primaryText={getCommonName("MDC_ECG_LEAD_I")}/>
            <MenuItem value="MDC_ECG_LEAD_II" primaryText={getCommonName("MDC_ECG_LEAD_II")}/>
            <MenuItem value="MDC_ECG_LEAD_III" primaryText={getCommonName("MDC_ECG_LEAD_III")}/>
            <MenuItem value="MDC_PRESS_BLD_ART_ABP" primaryText={getCommonName("MDC_PRESS_BLD_ART_ABP")}/>
            <MenuItem value="MDC_PULS_OXIM_PLETH" primaryText={getCommonName("MDC_PULS_OXIM_PLETH")}/>
            <MenuItem value="MDC_AWAY_CO2" primaryText={getCommonName("MDC_AWAY_CO2")}/>
          </SelectField>
        </ListItem>
        <ListItem>
          <div>Color</div>
          <SelectField
            floatingLabelText="Color Display"
            value={waveformColor}
            onChange={handleWaveformColorChange}
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
      <Divider />
      <List>
        <Subheader>LineWidth</Subheader>
        <div>
          <ListItem>
            <div>LineWidth</div>
            <Slider
              min={1}
              max={5}
              step={0.5}
              defaultValue={waveformLineWidth}
              value={waveformLineWidth}
              onChange={handleWaveformLineWidthChange}
            />
            <div style={{'textAlign': 'center'}}>
              {waveformLineWidth}
            </div>
          </ListItem>
        </div>
      </List>
      <Divider />
      <MenuItem onTouchTap={handleCloseWaveformDrawer}>Save</MenuItem>
    </Drawer>
  );
}

WaveformDrawer.propTypes = {

};

export default WaveformDrawer;
