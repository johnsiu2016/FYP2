/**
*
* CustomFontIcon
*
*/

import React from 'react';

import FontIcon from 'material-ui/FontIcon';

function CustomFontIcon({iconString, onClick}) {
  let rightPx = '0px';
  if (iconString === "grid_on") rightPx = '65px';

  return (
    <FontIcon className="material-icons"
              style={{
                position: 'absolute',
                top: '0px',
                right: rightPx,
                cursor: 'pointer'
              }}
              onClick={onClick}>
      {iconString}
    </FontIcon>
  );
}

CustomFontIcon.propTypes = {
  onClick: React.PropTypes.func
};

export default CustomFontIcon
