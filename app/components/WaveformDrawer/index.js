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

function WaveformDrawer({
  openWaveformDrawer,
  waveformType,
  handleWaveformTypeChange,
  waveformColor,
  handleWaveformColorChange,
  waveformScale,
  handleWaveformScaleChange,
  waveformSpeed,
  handleWaveformSpeedChange,
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
            <MenuItem value="ECG - II" primaryText="ECG - II"/>
            <MenuItem value="PPG" primaryText="PPG"/>
            <MenuItem value="RBBB" primaryText="RBBB"/>
            <MenuItem value="Bigeminy" primaryText="Bigeminy"/>
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
        <Subheader>Scale and Speed</Subheader>
        <div>
          <ListItem>
            <div>Scale</div>
            <Slider
              min={0}
              max={2}
              step={0.05}
              defaultValue={waveformScale}
              value={waveformScale}
              onChange={handleWaveformScaleChange}
            />
            <div style={{'textAlign': 'center'}}>
              {waveformScale}
            </div>
          </ListItem>
          <ListItem>
            <div>Speed</div>
            <Slider
              min={0}
              max={10}
              step={0.5}
              defaultValue={waveformSpeed}
              value={waveformSpeed}
              onChange={handleWaveformSpeedChange}
            />
            <div style={{'textAlign': 'center'}}>
              {waveformSpeed}
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
