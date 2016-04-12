import {transform} from 'babel-core';
import test from 'tape';
import moduleExportsToExport from '../packages/babel-plugin-module-exports-to-export';
import {compare} from '../utils';

const babelOpts = {
  plugins: [moduleExportsToExport],
  babelrc: false
};

const cases =
  [ `module.exports = function() {}`
  , `module.exports = class {}`
  , `class A {}; module.exports = A`
  ];

const expected =
  [ `export default (function() {})`
  , `export default (class {})`
  , `export default class A {}`
  ];

test('module-exports-to-export', function(t) {
  cases.map((c, i) => {
    const code = transform(c, babelOpts).code;
    t.assert(compare(code, expected[i]));
  });
  t.end();
});
