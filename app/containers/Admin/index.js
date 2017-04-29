import React from 'react';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import styled from 'styled-components';
import {Grid, Row, Col, Nav, NavItem} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import FontIcon from 'material-ui/FontIcon';

import * as actions from './actions';
import * as selectors from './selectors';

const Sidebar = styled(Nav)`
  height: 100%;
  background: #222d32;
`;

const SidebarItem = styled(NavItem)`
  margin-top: 0px !important;
  
  > a {
    border-radius: 0px !important;
  }
`;

export class Admin extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      sideBarKey: 1
    };
  }

  componentDidMount() {
    this.props.getSimulationWaveformList();
    this.props.getSimulationVitalSignList();
  }

  componentWillUnmount() {

  }

  render() {
    //console.log('test', this.props.simulationWaveformList);

    let resourceName;
    let table;
    switch (this.state.sideBarKey) {
      case 1:
        resourceName = 'Simulation Waveform Resource';
        table = this.simulationWaveformTable();
        break;
      case 2:
        resourceName = 'Simulation Vital Sign Resource';
        table = this.simulationVitalSignTable();
        break;
    }

    return (
      <Grid fluid={true} style={{height: 'calc(100% - 64px)'}}>
        <Row style={{height: '100%'}}>
          <Col lg={2} style={{height: '100%'}}>
            <Row style={{height: '100%'}}>
              <Sidebar bsStyle="pills" stacked activeKey={this.state.sideBarKey} onSelect={this.handleSelect}>
                <SidebarItem eventKey={1} title='Simulation Waveform Resource'>Simulation Waveform</SidebarItem>
                <SidebarItem eventKey={2} title='Simulation Vital Sign Resource'>Simulation Vital Sign</SidebarItem>
              </Sidebar>
            </Row>
          </Col>
          <Col lg={10} style={{
            height: '100%',
            background: '#ecf0f5'
          }}>
            <Row style={{
              padding: '15px 15px 0px 15px',
              fontSize: '2em',
              textAlign: 'center'
            }}>
              {resourceName}
              {
                <FontIcon
                  style={{
                    padding: '10px'
                  }}
                  color='black'
                  className="material-icons"
                  onClick={this.reload}>
                  {'refresh'}
                </FontIcon>
              }
            </Row>
            <Row style={{
              padding: '15px'
            }}>
              {table}
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }

  reload = () => {
    this.props.getSimulationWaveformList();
    this.props.getSimulationVitalSignList();
  };


  onWaveformCellEdit = (row, fieldName, value) => {
    // console.log('row',row);
    // console.log('value',value);
    // console.log('fieldName',fieldName);
    row[fieldName] = value;
    const postData = {
      [row.type]: Array.isArray(row.value) ? row.value : row.value.split(',')
    };
    this.props.patchSimulationWaveform(row._id, postData);
  };

  onWaveformAddRow = (row) => {
    // console.log(row);
    // console.log(Array.isArray(row.value.split(',')));
    const postData = {
      [row.type]: row.value.split(',')
    };
    this.props.postSimulationWaveform(postData);
  };

  onWaveformDeleteRow = (id) => {
    this.props.deleteSimulationWaveform(id[0])
  };

  waveformRemote = (remoteObj) => {
    // Only cell editing, insert and delete row will be handled by remote store
    remoteObj.cellEdit = true;
    remoteObj.insertRow = true;
    remoteObj.dropRow = true;
    return remoteObj;
  };

  handleSelect = (selectedKey) => {
    this.setState({
      sideBarKey: selectedKey
    })
  };

  simulationWaveformTable = () => {
    const selectRow = {
      mode: 'radio',
      showOnlySelected: true
    };
    const cellEditProp = {
      mode: 'click',
      blurToSave: true
    };

    return (
      <BootstrapTable data={ this.props.simulationWaveformList || [] }
                      options={ {
                        onCellEdit: this.onWaveformCellEdit,
                        onDeleteRow: this.onWaveformDeleteRow,
                        onAddRow: this.onWaveformAddRow,
                      }}
                      remote={this.waveformRemote}
                      selectRow={ selectRow }
                      cellEdit={ cellEditProp }
                      insertRow
                      deleteRow
                      exportCSV
                      search
                      pagination
                      hover>
        <TableHeaderColumn dataField='_id' hiddenOnInsert dataSort isKey={ true }>_id</TableHeaderColumn>
        <TableHeaderColumn dataField='type' dataSort editable={ {type: 'textarea'} }>type</TableHeaderColumn>
        <TableHeaderColumn dataField='value' dataSort editable={ {type: 'textarea'} }>value</TableHeaderColumn>
      </BootstrapTable>)
  };

  onVitalSignCellEdit = (row, fieldName, value) => {
    // console.log('row',row);
    // console.log('value',value);
    // console.log('fieldName',fieldName);
    row[fieldName] = value;
    let tmpValue;
    try {
      tmpValue = JSON.parse(row.value)
    } catch(e) {

    }
    const postData = {
      [row.type]: {
        value: tmpValue,
        template: row.template
      }
    };
    this.props.patchSimulationVitalSign(row._id, postData);
  };

  onVitalSignAddRow = (row) => {
    let value;
    try {
      value = JSON.parse(row.value)
    } catch(e) {

    }
    const postData = {
      [row.type]: {
        value: value,
        template: row.template
      }
    };
    this.props.postSimulationVitalSign(postData);
  };

  onVitalSignDeleteRow = (id) => {
    this.props.deleteSimulationVitalSign(id[0])
  };

  vitalSignRemote = (remoteObj) => {
    // Only cell editing, insert and delete row will be handled by remote store
    remoteObj.cellEdit = true;
    remoteObj.insertRow = true;
    remoteObj.dropRow = true;
    return remoteObj;
  };

  simulationVitalSignTable = () => {
    const selectRow = {
      mode: 'radio',
      showOnlySelected: true
    };
    const cellEditProp = {
      mode: 'click',
      blurToSave: true
    };
    const simulationVitalSignList = this.props.simulationVitalSignList && this.props.simulationVitalSignList.map((ele) => {
        if (typeof ele.value !== 'string') {
          ele.value = JSON.stringify(ele.value, null, 2);
        }
        return ele;
      });

    return (
      <BootstrapTable data={ simulationVitalSignList || [] }
                      options={ {
                        onCellEdit: this.onVitalSignCellEdit,
                        onDeleteRow: this.onVitalSignDeleteRow,
                        onAddRow: this.onVitalSignAddRow,
                      }}
                      remote={this.vitalSignRemote}
                      selectRow={ selectRow }
                      cellEdit={ cellEditProp }
                      insertRow
                      deleteRow
                      exportCSV
                      search
                      pagination
                      hover>
        <TableHeaderColumn dataField='_id' hiddenOnInsert dataSort isKey={ true }>_id</TableHeaderColumn>
        <TableHeaderColumn dataField='type' dataSort editable={ {type: 'textarea'} }>type</TableHeaderColumn>
        <TableHeaderColumn dataField='value' dataSort editable={ {type: 'textarea'} }>value</TableHeaderColumn>
        <TableHeaderColumn dataField='template' dataSort editable={ {type: 'textarea'} }>template</TableHeaderColumn>
      </BootstrapTable>)
  };
}

const mapStateToProps = createStructuredSelector({
  simulationWaveformLoading: selectors.selectSimulationWaveformLoading(),
  simulationWaveformError: selectors.selectSimulationWaveformError(),
  simulationWaveformList: selectors.selectSimulationWaveformList(),

  simulationVitalSignLoading: selectors.selectSimulationVitalSignLoading(),
  simulationVitalSignError: selectors.selectSimulationVitalSignError(),
  simulationVitalSignList: selectors.selectSimulationVitalSignList(),
});

function mapDispatchToProps(dispatch) {
  return {
    getSimulationWaveformList: () => dispatch(actions.getSimulationWaveformList()),
    postSimulationWaveform: (postData) => dispatch(actions.postSimulationWaveform(postData)),
    getSimulationWaveform: (_id) => dispatch(actions.getSimulationWaveform(_id)),
    patchSimulationWaveform: (_id, postData) => dispatch(actions.patchSimulationWaveform(_id, postData)),
    deleteSimulationWaveform: (_id) => dispatch(actions.deleteSimulationWaveform(_id)),

    getSimulationVitalSignList: () => dispatch(actions.getSimulationVitalSignList()),
    postSimulationVitalSign: (postData) => dispatch(actions.postSimulationVitalSign(postData)),
    getSimulationVitalSign: (_id) => dispatch(actions.getSimulationVitalSign(_id)),
    patchSimulationVitalSign: (_id, postData) => dispatch(actions.patchSimulationVitalSign(_id, postData)),
    deleteSimulationVitalSign: (_id) => dispatch(actions.deleteSimulationVitalSign(_id)),


  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
