import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  .container {
    transform-origin: 100% center 0;
    transform-style: preserve-3d;
    transition: all 0.5s;
    transform: perspective(1500px) translate3d(0px,0px,-300px);
  }
  
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  
  body.fontLoaded {
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
`;
