#!/usr/bin/env bash
rm -rf _dist
mkdir _dist/
../node_modules/.bin/lighthouse $1 --perf --output=json --output-path=_dist/lighthouse-report.json && \
  node lighthouse-report-parser.js && \
  node lighthouse-report-verifier.js
