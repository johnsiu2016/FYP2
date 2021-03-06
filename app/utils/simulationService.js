import {interpolateArray} from './utililtyFunctions';
import {rawWaveformDataLookUpTable, defaultVitalSignData} from './simuationData';
let formatZeroPointWaveform = interpolateArray([0.5], 120);

let normalizedWaveformLookUpTable;
let repeatNormalizedWaveformLookUpTable;
updateSimulationWaveformData(rawWaveformDataLookUpTable);

function normalizeWaveform(rawWaveformDataLookUpTable) {
  normalizedWaveformLookUpTable = {};
  repeatNormalizedWaveformLookUpTable = {};

  for (let waveform in rawWaveformDataLookUpTable) {
    if (/record_/.test(waveform)) {
      let cur = rawWaveformDataLookUpTable[waveform];
      let frequency = waveform.match(/record_(\d*)_.*/)[1];

      let normalizedFrequency = Math.ceil(frequency / 60) * 60;
      let time = Math.floor((cur.length / frequency));
      let formatLength = normalizedFrequency * time;
      let formatWaveform = interpolateArray(cur, formatLength);

      const max = Math.max(...cur);
      const min = Math.min(...cur);
      const dataHeight = max - min;
      let normalizedWaveform = [];
      for (let i = 0, len = formatWaveform.length; i < len; i++) {
        normalizedWaveform.push(1 - ((formatWaveform[i] - min) / dataHeight));
      }
      normalizedWaveformLookUpTable[waveform] = {
        normalizedWaveform: normalizedWaveform,
        frequency: normalizedFrequency
      };

    } else {
      let cur = rawWaveformDataLookUpTable[waveform];
      let formatLength = 120 * Math.ceil(cur.length / 120);
      let formatWaveform = interpolateArray(cur, formatLength);

      const max = Math.max(...cur);
      const min = Math.min(...cur);
      const dataHeight = max - min;
      let normalizedWaveform = [];
      for (let i = 0, len = formatWaveform.length; i < len; i++) {
        normalizedWaveform.push(1 - ((formatWaveform[i] - min) / dataHeight));
      }
      normalizedWaveformLookUpTable[waveform] = normalizedWaveform;
      repeatNormalizedWaveformLookUpTable[waveform] = normalizedWaveform // no. of concat is related to HR limit
        .concat(normalizedWaveform).concat(normalizedWaveform)
        .concat(normalizedWaveform);
    }
  }
}

function calculateECGArray(type) {
  if (!normalizedWaveformLookUpTable[type]) return () => formatZeroPointWaveform;
  const normalizedWaveform = normalizedWaveformLookUpTable[type];
  const repeatNormalizedWaveform = repeatNormalizedWaveformLookUpTable[type];
  const baseDataLength = repeatNormalizedWaveform.length;

  let splitPoint = 0;
  return (HR = 60) => {
    if (Number(HR) === 0) {
      return formatZeroPointWaveform;
    }

    const HRDataLength = (HR / 60) * normalizedWaveform.length;
    const numberOfMovingPoint = HRDataLength >= 120 ? HRDataLength - normalizedWaveform.length : HRDataLength;
    const outputDataLength = 120 * Math.ceil(HRDataLength / 120);

    let resultArray = repeatNormalizedWaveform.slice(splitPoint, splitPoint + HRDataLength).concat(repeatNormalizedWaveform.slice(0, Math.max(splitPoint + HRDataLength - baseDataLength, 0)));
    splitPoint = splitPoint + numberOfMovingPoint;
    if (splitPoint >= baseDataLength) splitPoint = splitPoint - baseDataLength;
    let formatResultArray = interpolateArray(resultArray, outputDataLength);

    switch (type) {
      case "MDC_ECG_LEAD_I":
      case "MDC_ECG_LEAD_II":
      case "MDC_ECG_LEAD_III":
        break;
      case "MDC_PRESS_BLD_ART_ABP":
        const ABPHeight = window._ABPHeight || 1;
        const ABPSystolic = window._ABPSystolic || 1;
        const dc = 1 - ABPSystolic / 150;

        formatResultArray = formatResultArray.map((dataPoint) => {
          return dataPoint * (ABPHeight / 150) + dc;
        });
        break;
      case "MDC_PULS_OXIM_PLETH":
      case "MDC_AWAY_CO2":
        break;
    }

    return formatResultArray;
  };
}

function requestSimulationModeWaveformData(execCalculateECGArray) {
  return new Promise((resolve) => {
    return resolve(execCalculateECGArray(window._HR));
  });
}

export function updateSimulationWaveformData(waveformData) {
  if (!waveformData) return;

  let waveformLookUpTable = waveformData;
  if (Array.isArray(waveformLookUpTable)) { // result from api is array, format to object
    waveformLookUpTable = {};
    for (let ele of waveformData) {
      waveformLookUpTable[ele.type] = ele.value;
    }
  }
  normalizeWaveform(waveformLookUpTable);
}


export function requestWaveformDataInterval(type, second, cb) {
  const execCalculateECGArray = calculateECGArray(type);
  return setInterval(() => {
    requestSimulationModeWaveformData(execCalculateECGArray).then((waveformData) => {
      cb(waveformData);
    })
  }, second);
}

export function requestRecordingWaveformData(type, cb) {
  return cb(normalizedWaveformLookUpTable[type]);
}





export function processVitalSignControlInput(vitalSign, formStorage) {
  switch (vitalSign) {
    case "MDC_ECG_HEART_RATE":
      window._HR = formStorage.get("data");
      break;
    case 'MDC_PULS_OXIM_PULS_RATE':
    case "MDC_PULS_OXIM_SAT_O2":
    case 'MDC_AWAY_CO2_ET':
    case 'MDC_CO2_RESP_RATE':
    case 'MDC_TTHOR_RESP_RATE':
    case "RP":
      break;

    case "MDC_PRESS_BLD_ART_ABP_NUMERIC":
      const systolic = formStorage.get("systolic");
      const diastolic = formStorage.get("diastolic");
      window._ABPHeight = Number(systolic) - Number(diastolic);
      window._ABPSystolic = Number(systolic);
      break;
    case "PAP":
    case "NBP":
      break;
  }
}

let simulationVitalSignData;
updateSimulationVitalSignData(defaultVitalSignData);

export function updateSimulationVitalSignData(vitalSignData) {
  if (!vitalSignData) return;

  let vitalSignLookUpTable = vitalSignData;
  if (Array.isArray(vitalSignLookUpTable)) {
    vitalSignLookUpTable = {};
    for (let ele of vitalSignData) {
      vitalSignLookUpTable[ele.type] = {
        value: ele.value,
        template: ele.template
      };
    }
  }
  simulationVitalSignData = vitalSignLookUpTable;
}

export function getSimulationVitalSignData(type) {
  if (!simulationVitalSignData[type]) return;
  return simulationVitalSignData[type].value;
}

export function getSimulationVitalSignDataTemplate(type) {
  if (!simulationVitalSignData[type]) return;
  return simulationVitalSignData[type].template;
}
