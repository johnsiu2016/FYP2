import React from 'react';
import {connect} from 'react-redux';

import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import {Card, CardTitle, CardText} from 'material-ui/Card';

import {GridList, GridTile} from 'material-ui/GridList';
import {Grid, Row, Col, Table} from 'react-bootstrap';
import FontIcon from 'material-ui/FontIcon';

import {createStructuredSelector} from 'reselect';

import * as actions from './actions';
import * as selectors from './selectors';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 900,
    height: 400,
    overflowY: 'auto',
  },
  titleStyle: {
    color: 'white',
  }
};

export class Settings extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.loadDevices();
  }

  componentWillUnmount() {

  }

  reload = () => {
    this.props.loadDevices();
  };


  render() {
    let {
      devicesData,
      connectingDevice,
      loading,
      error
    } = this.props;

    let {
      handleSettingsConnectingDevice
    } = this.props;

    let info = '';
    let deviceName = '\< Device Name \>';
    if (loading) {
      info = 'Loading...';
    } else if (error) {
      info = 'Cannot reach host';
    } else if (Object.keys(devicesData).length === 0) {
      info = 'No devices connected to server';
    } else if (!connectingDevice) {
      info = 'Please select a device';
    } else if (connectingDevice) {
      info = 'Selected Device:'
    }

    if (devicesData && devicesData[connectingDevice]) {
      if (devicesData[connectingDevice]['deviceIdentity']) {
        deviceName = devicesData[connectingDevice]['deviceIdentity'].model;
      } else {
        deviceName = `No name available ${connectingDevice}`;
      }
    }

    return (
      <Grid fluid={true} style={{background: '#212121', height: '100%', overflow: 'scroll'}}>
        <Row>
          <Col>
            <Paper>
              <Subheader>
                Connected Devices
                <FontIcon
                  style={{
                    display: 'inline-block',
                    padding: '10px',
                    cursor: 'pointer'
                  }}
                  className="material-icons"
                  onClick={this.reload}>
                  {'refresh'}
                </FontIcon>
              </Subheader>

              <div style={{
                fontSize: '20px',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                {info}
              </div>

              <div style={{
                fontSize: '20px',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                {deviceName}
              </div>

              {(
                <div style={styles.root}>
                  <GridList
                    cols={3}
                    cellHeight={200}
                    padding={1}
                    style={styles.gridList}
                  >
                    {devicesData && Object.keys(devicesData).map((id) => (
                      <GridTile
                        key={id}
                        onClick={handleSettingsConnectingDevice.bind(this, id)}
                        title={devicesData[id] && devicesData[id].deviceIdentity && devicesData[id].deviceIdentity.model || `${id}`}
                        titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                        titleStyle={styles.titleStyle}
                      >
                        <img
                          style={{cursor: 'pointer'}}
                          src={devicesData[id] && devicesData[id].deviceIdentity && devicesData[id].deviceIdentity.icon.image || '/img/Placeholder.png'}/>
                      </GridTile>
                    ))}
                  </GridList>
                </div>
              )}

            </Paper>
          </Col>
        </Row>
        {devicesData && Object.keys(devicesData).length !== 0 && connectingDevice && (
          <Row style={{
            marginTop: '10px'
          }}>
            <Col md={3}>
              <Paper>
                <Row>
                  <Col style={{
                    fontSize: '20px',
                    textAlign: 'center',
                    marginBottom: '20px',
                    color: 'white'
                  }}>
                    {deviceName}
                  </Col>
                </Row>
                <Row>
                  <Col style={{
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <img
                      style={{maxWidth: '200px'}}
                      src={devicesData[connectingDevice] && devicesData[connectingDevice].deviceIdentity && devicesData[connectingDevice].deviceIdentity.icon.image || '/img/Placeholder.png'}/>

                  </Col>
                </Row>
              </Paper>
            </Col>
            <Col md={9}>
              <Card>
                <CardTitle title="Device Connectivity"/>
                <CardText>
                  <div>
                    {`State: ${devicesData[connectingDevice] && devicesData[connectingDevice].deviceConnectivity && devicesData[connectingDevice].deviceConnectivity.state}`}
                  </div>
                  <div>
                    {`Information: ${devicesData[connectingDevice] && devicesData[connectingDevice].deviceConnectivity && devicesData[connectingDevice].deviceConnectivity.info}`}
                  </div>
                </CardText>
                <CardTitle title="Received Data Metric"/>
                <CardText>
                  {`Sample Array:`}
                  <ul>
                    {devicesData[connectingDevice] && devicesData[connectingDevice].sampleArray
                    && Object.keys(devicesData[connectingDevice].sampleArray).map(metric => (
                      <li key={metric}>
                        {metric}
                      </li>
                    ))}
                  </ul>

                  {`Numeric:`}
                  <ul>
                    {devicesData[connectingDevice] && devicesData[connectingDevice].numeric
                    && Object.keys(devicesData[connectingDevice].numeric).map(metric => (
                      <li key={metric}>
                        {metric}
                      </li>
                    ))}
                  </ul>
                </CardText>
              </Card>
            </Col>
          </Row>
        )}
      </Grid>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  connectingDevice: selectors.selectConnectingDevice(),
  loading: selectors.selectLoading(),
  error: selectors.selectError(),
  devicesData: selectors.selectDevicesData(),
});

function mapDispatchToProps(dispatch) {
  return {
    loadDevices: () => dispatch(actions.loadDevices()),
    handleSettingsConnectingDevice: (id) => dispatch(actions.handleSettingsConnectingDevice(id))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

