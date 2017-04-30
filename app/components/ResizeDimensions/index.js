/**
 *
 * ResizeDimension
 *
 */

import React from 'react';
import ReactDOM from 'react-dom'

function defaultGetWidth(element) {
  return element.getBoundingClientRect().width
}
function defaultGetHeight(element) {
  return element.getBoundingClientRect().height
}

function ResizeDimensions({getWidth = defaultGetWidth, getHeight = defaultGetHeight} = {}) {
  return (DecoratingComponent) => {
    return class ResizeDimensionHOC extends React.Component {

      constructor() {
        super(...arguments);
        this.state = {
          containerWidth: 0,
          containerHeight: 0
        };

        this.onResize = this.onResize.bind(this);
        this.resizeListener = this.resizeListener.bind(this);
      }

      componentDidMount() {
        window.addEventListener('resize', this.resizeListener);
        this.onResize();
      }

      componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener);
      }

      onResize() {
        if (!this.ele) return;
        this.setState({
          containerWidth: getWidth(this.ele),
          containerHeight: getHeight(this.ele)
        });
      }

      resizeListener() {
        if (this._animationFrame) {
          ResizeDimensionHOC.cancelFrame(this._animationFrame)
        }
        this._animationFrame = ResizeDimensionHOC.requestFrame(() => {
          this.onResize()
        })
      }

      static requestFrame(fn) {
        let raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame
          || function (fn) {
            return window.setTimeout(fn, 20)
          };
        return raf(fn);
      }

      static cancelFrame(id) {
        let cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
          window.clearTimeout;
        return cancel(id)
      }

      render() {
        return (
          <div
            ref={(ele) => this.ele = ele}
            style={{
            width: '100%',
            height: '100%',
            padding: 0,
            border: 0
          }}>
            {(this.state.containerWidth || this.state.containerHeight) &&
            <DecoratingComponent {...this.props} {...this.state}/>}
          </div>
        )
      }
    }
  }
}

export default ResizeDimensions;
