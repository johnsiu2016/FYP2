const stringify = require('json-stringify-safe');

export function saveToLS(key, value) {
  if (localStorage) {
    try {
      localStorage.setItem(key, stringify(value));
    } catch (e) {
      console.log(e);
    }
  }
}

export function getFromLS(key) {
  if (localStorage) {
    try {
      return JSON.parse(localStorage.getItem(key)) || null;
    } catch (e) {
      console.log(e);
    }
  }
}

export function interpolateArray(data, fitCount) {

  let linearInterpolate = function (before, after, atPoint) {
    return before + (after - before) * atPoint;
  };

  let newData = [];
  let springFactor = (data.length - 1) / (fitCount - 1);
  newData[0] = data[0]; // for new allocation
  for (let i = 1; i < fitCount - 1; i++) {
    let tmp = i * springFactor;
    let before = Math.floor(tmp);
    let after = Math.ceil(tmp);
    let atPoint = tmp - before;
    newData[i] = linearInterpolate(data[before], data[after], atPoint);
  }
  newData[fitCount - 1] = data[data.length - 1]; // for new allocation
  return newData;
}

export function isCyclic (obj) {
  let seenObjects = [];

  function detect (obj) {
    if (obj && typeof obj === 'object') {
      if (seenObjects.indexOf(obj) !== -1) {
        return true;
      }
      seenObjects.push(obj);
      for (let key in obj) {
        if (obj.hasOwnProperty(key) && detect(obj[key])) {
          console.log(obj, 'cycle at ' + key);
          return true;
        }
      }
    }
    return false;
  }

  return detect(obj);
}
