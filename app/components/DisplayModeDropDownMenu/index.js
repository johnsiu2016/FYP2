/**
 *
 * DisplayModeDropDownMenu
 *
 */

import React from 'react';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

function DisplayModeDropDownMenu({value, onChange, powerOn}) {
  return (
    <DropDownMenu value={value}
                  onChange={onChange}
                  style={{
                    float: 'right'
                  }}
                  underlineStyle={{
                    display: 'none'
                  }}
                  iconStyle={{
                    top: '0px'
                  }}
                  labelStyle={{
                    lineHeight: '48px'
                  }}
                  disabled={powerOn}
    >
      <MenuItem value="Simulation mode" primaryText="Simulation mode"/>
      <MenuItem value="Real-time mode" primaryText="Real-time mode"/>
    </DropDownMenu>
  );
}

DisplayModeDropDownMenu.propTypes = {
  onChange: React.PropTypes.func,
  value: React.PropTypes.string
};

export default DisplayModeDropDownMenu;
