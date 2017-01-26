/**
*
* PowerOnIconButton
*
*/

import React from 'react';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {red500, grey50} from 'material-ui/styles/colors';

function PowerOnIconButton({onClick, powerOn}) {
  return (
    <IconButton
      style={{
        float: 'right'
      }}
      onClick={onClick}
      tooltip="Power"
      tooltipPosition="top-center"
      touch={true}
    >
      <FontIcon className="material-icons"
                color={powerOn ? red500 : grey50}
      >
        power_settings_new
      </FontIcon>
    </IconButton>
  );
}

PowerOnIconButton.propTypes = {
  onClick: React.PropTypes.func
};

export default PowerOnIconButton
