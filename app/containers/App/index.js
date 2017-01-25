/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a neccessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import Helmet from 'react-helmet';

// material-ui theme
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
// material-ui theme end

import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import {Link} from 'react-router';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';

export default class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: React.PropTypes.node,
  };

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

  render() {
    let container = {
      'transform-origin': '100% center 0',
      'transform-style': 'preserve-3d',
      'transition': 'all 0.5s',
      'transform': 'perspective(1500px) translate3d(0px,0px,-300px)'
    };

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div>
          <Helmet
            titleTemplate="%s - Patient Monitor"
            defaultTitle="Patient Monitor"
            meta={[
              {name: 'description', content: 'A Patient Monitor application'},
            ]}
          />

          <div style={this.state.open ? container : {}}>
            <AppBar
              style={this.state.open ? {display: 'none'}:{}}
              title="Patient Monitor"
              iconElementLeft={
                <IconButton>
                  <FontIcon className="material-icons"
                            onClick={this.handleToggle}>
                    menu
                  </FontIcon>
                </IconButton>
              }/>
            {React.Children.toArray(this.props.children)}
          </div>

          <Drawer
            docked={false}
            width={300}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
          >
            <Card>
              <CardHeader
                title="Patient Monitor"
                subtitle="Anytime, Everywhere"
                avatar="https://cdn0.iconfinder.com/data/icons/health-icons/110/Patient-Monitor-512.png"
              />
              <CardMedia>
                <img src="http://www.ampronix.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/m/x/mx600_mx700_gallery7_1.jpg" />
              </CardMedia>
            </Card>
            <Subheader>Go To</Subheader>
            <MenuItem onTouchTap={this.handleClose}><Link to="/patientMonitor">Patient Monitor Desktop</Link></MenuItem>
            <MenuItem onTouchTap={this.handleClose}><Link to="/patientMonitorMobile">Patient Monitor Mobile</Link></MenuItem>
            <MenuItem onTouchTap={this.handleClose}><Link to="/settings">Settings</Link></MenuItem>
            <MenuItem onTouchTap={this.handleClose}><Link to="/credit">Credit</Link></MenuItem>
            <MenuItem onTouchTap={this.handleClose}><a href="/api">API</a></MenuItem>
          </Drawer>
        </div>
      </MuiThemeProvider>)
  }
};
