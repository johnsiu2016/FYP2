import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import Paper from 'material-ui/Paper';
import {Grid, Row, Col} from 'react-bootstrap';

export class Credit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Grid fluid={true} style={{background: '#212121', height: '100%', overflow: 'auto'}}>
        <Row style={{
          marginTop: '55px'
        }}>
          <Col style={{
            padding: '0px 35px 0px 35px'
          }}>
            <Paper style={{
              padding: '15px 35px 15px 35px',
              fontSize: '1.8em',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}>
              <div>
                <h1>
                  Project: <span style={{fontSize: '0.95em'}}>Design and development of an integrated mobile platform for training of medical doctors and management of data from patient monitors</span>
                </h1>
              </div>
              <div style={{
                marginTop: '20px'
              }}>
                <h1>
                  TEAM
                </h1>
                <p>
                  Developer: John Siu
                </p>
                <p>
                  Contact: siuwaiking12@gmail.com
                </p>


                <h1>
                  THANKS
                </h1>
                <p>
                  Supervisor: Kevin Hung
                </p>
                <p>
                  Scientific Officer: Mr. YH Tam
                </p>
                <p>
                  Technical Developer: Thomas Lo
                </p>
              </div>
              <div style={{
                marginTop: '30px'
              }}>
                <p>
                  Copyright 2017 John Siu. All right reserved.
                </p>
                <p>
                  License (MIT)
                </p>
              </div>
            </Paper>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Credit.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(Credit);
