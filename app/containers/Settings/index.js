import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';

import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import {Card, CardTitle, CardText} from 'material-ui/Card';

import {GridList, GridTile} from 'material-ui/GridList';
import {Grid, Row, Col, Table} from 'react-bootstrap';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';

import {createStructuredSelector} from 'reselect';
import requests from '../../utils/requests';
import config from '../../config.json';

import {Field, reduxForm} from 'redux-form/immutable';
import {getCommonName} from '../../utils/preferences';

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
      <Grid fluid={true} style={{background: '#212121', height: '100%', overflow: 'auto'}}>
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
        {devicesData && Object.keys(devicesData).length !== 0 && connectingDevice && devicesData[connectingDevice] && (
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

                <CardTitle title="Recording metric"/>
                <CardText style={{
                  background: '#ecf0f5',
                  color: 'black'
                }}>
                  <div style={{
                    fontSize: '20px',
                    textAlign: 'center',
                  }}>
                    Sample Array
                  </div>
                  <Table>
                    <thead>
                    <tr>
                      <th>metric name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {devicesData[connectingDevice] && devicesData[connectingDevice].recording
                    && Object.keys(devicesData[connectingDevice].recording.sampleArray).length !== 0
                    && Object.keys(devicesData[connectingDevice].recording.sampleArray).map(metric => (
                      <tr key={metric}>
                        <td>{metric}</td>
                      </tr>
                    ))}
                    </tbody>
                  </Table>
                </CardText>


                <CardTitle title="Received Data Metric"/>
                <CardText style={{
                  background: '#ecf0f5',
                  color: 'black'
                }}>

                  <div style={{
                    fontSize: '20px',
                    textAlign: 'center',
                  }}>
                    Sample Array
                  </div>
                  <SampleArrayForm
                    initialValues={Object.keys(devicesData[connectingDevice].sampleArray).reduce((acc, metric) => {
                      acc[`${metric}_record_name`] = getCommonName(metric);
                      acc[`${metric}_duration`] = 1;
                      return acc
                    }, {
                      device_id: connectingDevice
                    })}
                    connectingDevice={connectingDevice}
                    devicesData={devicesData}/>

                  <Divider style={{background: 'black', marginTop: '20px', marginBottom: '20px'}}/>

                  <div style={{
                    fontSize: '20px',
                    textAlign: 'center',
                  }}>
                    Numeric
                  </div>
                  <NumericForm
                    initialValues={Object.keys(devicesData[connectingDevice].numeric).reduce((acc, metric) => {
                      acc[`${metric}_record_name`] = getCommonName(metric);
                      acc[`${metric}_duration`] = 1;
                      return acc
                    }, {
                      device_id: connectingDevice
                    })}
                    connectingDevice={connectingDevice}
                    devicesData={devicesData}/>
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


let SampleArrayForm = (props) => {
  const {
    devicesData,
    connectingDevice,
    handleSubmit,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Table>
        <thead>
        <tr>
          <th>metric name</th>
          <th>is record</th>
          <th>record name</th>
          <th>duration (mins)</th>
        </tr>
        </thead>
        <tbody>
        {devicesData[connectingDevice] && devicesData[connectingDevice].sampleArray
        && Object.keys(devicesData[connectingDevice].sampleArray).map(metric => (
          <tr key={metric}>
            <td>{metric}</td>
            <td><Field name={`${metric}_is_record`} component="input" type="checkbox"/></td>
            <td><Field name={`${metric}_record_name`} component="input" type="text"/></td>
            <td><Field name={`${metric}_duration`} component="input" type="number"/></td>
          </tr>
        ))}
        </tbody>
      </Table>
      <input type="text" name="device_id" hidden={true}/>
      <button type="submit" style={{color: '#ecf0f5', background: '#212121'}}>Submit</button>
    </form>
  );
};
SampleArrayForm = compose(connect((state, props) => ({form: `${props.connectingDevice}_sample_array`})),
  reduxForm({
    destroyOnUnmount: true,
    onSubmit: (values) => {
      let host = config.apiEndPoint;
      let endPoint = '/api';
      let resource = '/waveforms/recording';
      let data = values.toObject();
      let deviceId = data.device_id;
      let postData = JSON.stringify({
        device_id: deviceId,
        sample_array: data
      });
      let requestURL = `${host}${endPoint}${resource}`;
      let myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json");
      let options = {
        method: 'POST',
        headers: myHeaders,
        body: postData
      };
      requests(requestURL, options)
      alert(`Submited Numeric form: \n${JSON.stringify(values.toObject(), null, 2)}`);

    }
  }))(SampleArrayForm);


let NumericForm = (props) => {
  const {
    devicesData,
    connectingDevice,
    handleSubmit
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Table>
        <thead>
        <tr>
          <th>metric name</th>
          <th>is record</th>
          <th>record name</th>
          <th>duration (mins)</th>
        </tr>
        </thead>
        <tbody>
        {devicesData[connectingDevice] && devicesData[connectingDevice].numeric
        && Object.keys(devicesData[connectingDevice].numeric).map(metric => (
          <tr key={metric}>
            <td>{metric}</td>
            <td><Field name={`${metric}_is_record`} component="input" type="checkbox"/></td>
            <td><Field name={`${metric}_record_name`} component="input" type="text"/></td>
            <td><Field name={`${metric}_duration`} component="input" type="number"/></td>
          </tr>
        ))}
        </tbody>
      </Table>
      <input type="text" name="device_id" hidden={true}/>
      <button type="submit" style={{color: '#ecf0f5', background: '#212121'}}>Submit</button>
    </form>
  );
};
NumericForm = compose(connect((state, props) => ({form: `${props.connectingDevice}_numeric`})),
  reduxForm({
    destroyOnUnmount: true,
    onSubmit: (values) => {
      alert(`Submited Numeric form: \n${JSON.stringify(values.toObject(), null, 2)}`);


    }
  }))(NumericForm);
