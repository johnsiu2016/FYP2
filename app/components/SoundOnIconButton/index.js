/**
 *
 * SoundOnIconButton
 *
 */

import React from 'react';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {red500, grey50} from 'material-ui/styles/colors';

function SoundOnIconButton({onClick, soundOn}) {
  return (
    <IconButton
      style={{
        float: 'right'
      }}
      onClick={onClick}
      tooltip="Sound"
      tooltipPosition="top-center"
      touch={true}
    >
      <FontIcon className="material-icons"
                color={soundOn ? red500 : grey50}>
        audiotrack
      </FontIcon>
    </IconButton>
  );
}

SoundOnIconButton.propTypes = {
  onClick: React.PropTypes.func,
  powerOn: React.PropTypes.bool
};

export default SoundOnIconButton
