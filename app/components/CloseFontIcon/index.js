/**
 *
 * CloseFontIcon
 *
 */

import React from 'react';

import FontIcon from 'material-ui/FontIcon';

function CloseFontIcon({onClick}) {
  return (
    <FontIcon className="material-icons"
              style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                cursor: 'pointer'
              }}
              onClick={onClick}>
      close
    </FontIcon>
  );
}

CloseFontIcon.propTypes = {
  onClick: React.PropTypes.func
};

export default CloseFontIcon
