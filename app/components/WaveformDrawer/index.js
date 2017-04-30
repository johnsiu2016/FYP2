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
import Toggle from 'material-ui/Toggle';

import {getCommonName} from '../../utils/preferences';
import {waveformItemTemplate} from '../../containers/PatientMonitor/reducer';

function WaveformDrawer({
  simulationWaveformList,
  waveformItem,
  openWaveformDrawer,
  handleWaveformTypeChange,
  handleWaveformColorChange,
  handleWaveformLineWidthChange,
  handleCloseWaveformDrawer,
  handleWaveformScaleLineToggle,
  handleWaveformScaleLineTopLevelChange,
  handleWaveformScaleLineBottomLevelChange
}) {

  // using this strange pattern because drawer must accept an initial item value
  // (no animation if the drawer is created and renders on the fly),
  // but the item is only known when the drawer is clicked,
  // so the item will be null sometimes, and when it is null, the item cannot get its value
  // there are may ways to overcome this, like wrapping it in a if statements,
  // but it will look tedious...
  const defaultWaveformitem = waveformItemTemplate();
  const waveformType = waveformItem ? waveformItem.get('waveform') : defaultWaveformitem.waveform;
  const waveformColor = waveformItem ? waveformItem.get('strokeStyle') : defaultWaveformitem.strokeStyle;
  const waveformLineWidth = waveformItem ? waveformItem.get('lineWidth') : defaultWaveformitem.lineWidth;
  const waveformScaleLine = waveformItem ? waveformItem.get('scaleLine') : defaultWaveformitem.scaleLine;
  const waveformScaleLineOn = waveformItem ? waveformScaleLine.get('scaleLineOn') : defaultWaveformitem.scaleLine.scaleLineOn;
  const waveformScaleLineTopLevel = waveformItem ? waveformScaleLine.get('topLevel') : defaultWaveformitem.scaleLine.topLevel;
  const waveformScaleLineBottomLevel = waveformItem ? waveformScaleLine.get('bottomLevel') : defaultWaveformitem.scaleLine.bottomLevel;

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
            {simulationWaveformList && simulationWaveformList.map(ele => (
              <MenuItem key={ele.type} value={ele.type} primaryText={getCommonName(ele.type)}/>
            ))}
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
              max={10}
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
      <List>
        <Subheader>Scale Line</Subheader>
        <ListItem
          primaryText="Scale Line"
          open={waveformScaleLineOn}
          rightToggle={<Toggle
            toggled={waveformScaleLineOn}
            onToggle={handleWaveformScaleLineToggle}
          />}
          nestedItems={[
            <ListItem key={1}>
              <div>Top Level</div>
              <Slider
                min={0}
                max={300}
                step={1}
                defaultValue={waveformScaleLineTopLevel}
                value={waveformScaleLineTopLevel}
                onChange={handleWaveformScaleLineTopLevelChange}
              />
              <div style={{'textAlign': 'center'}}>
                {waveformScaleLineTopLevel}
              </div>
            </ListItem>,
            <ListItem key={2}>
            <div>Bottom Level</div>
            <Slider
            min={0}
            max={300}
            step={1}
            defaultValue={waveformScaleLineBottomLevel}
            value={waveformScaleLineBottomLevel}
            onChange={handleWaveformScaleLineBottomLevelChange}
              />
              <div style={{'textAlign': 'center'}}>
          {waveformScaleLineBottomLevel}
            </div>
            </ListItem>
          ]}
        />
      </List>

      <MenuItem onTouchTap={handleCloseWaveformDrawer}>Save</MenuItem>
    </Drawer>
  );
}

WaveformDrawer.propTypes = {};

export default WaveformDrawer;
