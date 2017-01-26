/**
 *
 * BuildFontIcon
 *
 */

import React from 'react';

import FontIcon from 'material-ui/FontIcon';

function BuildFontIcon({onTouchTap}) {
  return (
    <FontIcon className="material-icons"
              style={{
                position: 'absolute',
                top: '0px',
                right: '30px',
                cursor: 'pointer'
              }}
              onTouchTap={onTouchTap}>
      build
    </FontIcon>
  );
}

BuildFontIcon.propTypes = {
  onTouchTap: React.PropTypes.func
};

export default BuildFontIcon
