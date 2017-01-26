/**
*
* AddFloatingButton
*
*/

import React from 'react';

import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';

function AddFloatingButton({onClick}) {
  return (
    <FloatingActionButton
      style={{marginLeft: '20px'}}
      onClick={onClick}>
      <FontIcon className="material-icons">
        add
      </FontIcon>
    </FloatingActionButton>
  );
}

AddFloatingButton.propTypes = {
  onClick: React.PropTypes.func
};

export default AddFloatingButton

