import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }
  
  #app {
    height: 100%;
  }
  
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  
  body.fontLoaded {
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  
  .patientMonitorMobile { /* stylelint-disable */
    -ms-scrollbar-arrow-color: lightgrey;
    -ms-scrollbar-base-color: #293543;
    -ms-scrollbar-track-color: #1d2027;
  
    animation: cssAnimation1 0s ease-in 3s forwards;
  }
  
  .patientMonitorMobile:hover {
    animation: cssAnimation2 0s ease-in 3s forwards;
  }
  
  .patientMonitorMobile::-webkit-scrollbar {
    width: 0.75em;
  }
  
  .patientMonitorMobile::-webkit-scrollbar-track {
    border-radius: 0;
  }
  
  .patientMonitorMobile::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #262a33;
    border: solid 1px #424545;
  }
  
  .patientMonitorMobile::-webkit-scrollbar-corner {
    background-color: transparent;
  }
  
  @keyframes cssAnimation1 {
    to {
      overflow: hidden;
    }
  }
  
  @keyframes cssAnimation2 {
    to {
      overflow: scroll;
    }
  }
`;
