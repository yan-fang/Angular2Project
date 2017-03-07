const fs = require('fs');
const report = require('./_dist/lighthouse-report.json');

if (!report.audits['user-timings'].extendedInfo) throw new Error(`Lighthouse report parser could not find any user timings.
Please make sure the application is calling performance.mark() at appropriate times.`);
const userTimings = report.audits['user-timings'].extendedInfo.value;

const firstMeaningfulPaint = report.audits['first-meaningful-paint'];

// It's in microseconds by default, convert to ms since most other values are ms.
const navStart = firstMeaningfulPaint.extendedInfo.value.timestamps.navStart / 1000000;

// Time for end time for initial request
const criticalRequestChainsValue = report.audits['critical-request-chains'].extendedInfo.value;

// Since lighthouse is just grabbing this data from debugger, the values are generated keys.
const firstRequestKey = Object.keys(criticalRequestChainsValue)[0];
const firstRequest = criticalRequestChainsValue[firstRequestKey];

// Time to first byte
const ttfb = firstRequest.request.responseReceivedTime - navStart;

const initialTimes = {
  firstByte: {
    sinceNavStart: ttfb,
    unit: 'ms'
  },
  firstPaint: {
    sinceNavStart: firstMeaningfulPaint.rawValue,
    sinceFirstByte: firstMeaningfulPaint.rawValue - ttfb,
    unit: 'ms'
  }
};

const timings = userTimings.reduce((prev, curr) => {
  prev[curr.name] = {
    sinceNavStart: curr.startTime,
    sinceFirstByte: curr.startTime - ttfb,
    unit: 'ms'
  }
  return prev;
}, initialTimes);

fs.writeFileSync('./_dist/lighthouse-parsed.json', JSON.stringify(timings, null, 2));
