export function saveToLS(key, value) {
  if (localStorage) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
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
