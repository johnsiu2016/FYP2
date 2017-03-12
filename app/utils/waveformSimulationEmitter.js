import {interpolateArray} from './utililtyFunctions';
import {rawWaveformDataLookUpTable} from '../containers/PatientMonitor/reducer';

let formatZeroPointWaveform = interpolateArray([0], 120);
let formatWaveformLookUpTable = {};
let normalizedWaveformLookUpTable = {};
let repeatNormalizedWaveformLookUpTable = {};
for (let waveform in rawWaveformDataLookUpTable) {
  let cur = rawWaveformDataLookUpTable[waveform];
  let formatLength = 120 * Math.ceil(cur.length / 120);
  let formatWaveform = interpolateArray(cur, formatLength);
  const max = Math.max(...cur);
  const min = Math.min(...cur);
  const dataHeight = max - min;
  let normalizedWaveform = [];

  formatWaveformLookUpTable[waveform] = formatWaveform;
  for (let i=0, len=formatWaveform.length; i<len; i++) {
    normalizedWaveform.push(1 - ((formatWaveform[i] - min) / dataHeight));
  }
  normalizedWaveformLookUpTable[waveform] = normalizedWaveform;
  repeatNormalizedWaveformLookUpTable[waveform] = normalizedWaveform.concat(normalizedWaveform).concat(normalizedWaveform).concat(normalizedWaveform);
}

function calculateECGArray(type) {
  const normalizedWaveform = normalizedWaveformLookUpTable[type];
  const repeatNormalizedWaveform = repeatNormalizedWaveformLookUpTable[type];
  const baseDataLength = repeatNormalizedWaveform.length;

  let splitPoint = 0;
  return (HR) => {
    if (HR === 0) {
      return formatZeroPointWaveform;
    }

    const HRDataLength = (HR / 60) * normalizedWaveform.length;
    const numberOfMovingPoint = HRDataLength >= 120 ? HRDataLength - normalizedWaveform.length : HRDataLength;
    const outputDataLength = 120 * Math.ceil(HRDataLength / 120);

    let resultArray = repeatNormalizedWaveform.slice(splitPoint, splitPoint + HRDataLength).concat(repeatNormalizedWaveform.slice(0, Math.max(splitPoint + HRDataLength - baseDataLength, 0)));
    splitPoint = splitPoint + numberOfMovingPoint;
    if (splitPoint >= baseDataLength) splitPoint = splitPoint - baseDataLength;
    let formatResultArray = interpolateArray(resultArray, outputDataLength);

    if (type === "MDC_PRESS_BLD_ART_ABP") {
      const ABPHeight = window._ABPHeight || 150;
      const ABPSystolic = window._ABPSystolic || 150;
      const dc = (150 - ABPSystolic) / 150 ;

      return formatResultArray.map((dataPoint) => {
        return dataPoint * (ABPHeight / 150) + dc;
      });
    }

    return formatResultArray;
  };
}

function requestSimulationModeWaveformData(execCalculateECGArray) {
  return new Promise((resolve) => {
    return resolve(execCalculateECGArray(window._HR || 120));
  });
}

export function requestWaveformDataInterval(type, second, cb) {
  const execCalculateECGArray = calculateECGArray(type);
  return setInterval(() => {
    requestSimulationModeWaveformData(execCalculateECGArray).then((waveformData) => {
      cb(waveformData);
    })
  }, second);
}
