import requireToImport from '../packages/babel-plugin-require-to-import';
import {transform} from 'babel-core';
import test from 'tape';
import fs from 'fs';
import path from 'path';

const filePluginMap = {
  'require-to-import': requireToImport
};

function getFileContents(file) {
  return String(fs.readFileSync(path.join(__dirname, 'resources', file + '.js')));
}

function getExpected(file) {
  return String(fs.readFileSync(path.join(__dirname, 'resources', file + '.expected.js')));
}

test('Test Suite', function(t) {
  Object.keys(filePluginMap)
    .map(filename => [
      filename,
      transform(getFileContents(filename), {
        plugins: [filePluginMap[filename]],
        babelrc: false
      })
    ])
    .map(([filename, out]) => [filename, out.code])
    .map(([filename, code]) => {
      t.equal(code.toString().trim(), getExpected(filename).trim(), filename);
    });
  t.end();
});
