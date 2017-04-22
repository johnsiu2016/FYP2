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
      'transformOrigin': '100% center 0',
      'transformStyle': 'preserve-3d',
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
                avatar="img/Patient-Monitor-512.png"
              />
              <CardMedia>
                <img src="img/mx600_mx700_gallery7_1.jpg" />
              </CardMedia>
            </Card>
            <Subheader style={{color: "#F5F5F5"}}>Go To</Subheader>
            <Link to="/patientMonitor"><MenuItem style={{color: "#03A9F4"}} onTouchTap={this.handleClose} primaryText="Patient Monitor"/></Link>
            <Link to="/settings"><MenuItem style={{color: "#03A9F4"}} onTouchTap={this.handleClose} primaryText="Settings"/></Link>
            <Link to="/credit"><MenuItem style={{color: "#03A9F4"}} onTouchTap={this.handleClose} primaryText="Credit"/></Link>
            <Link to="/api"><MenuItem style={{color: "#03A9F4"}} onTouchTap={this.handleClose} primaryText="API"/></Link>
          </Drawer>
        </div>
      </MuiThemeProvider>)
  }
};
