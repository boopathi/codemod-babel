import {transform} from 'babel-core';
import test from 'tape';
import shortIdentifier from '../packages/babel-plugin-short-identifiers';
import {compare} from '../utils';

const babelOpts = {
  plugins: [shortIdentifier],
  babelrc: false
};

const input =
`
let aasdas = '21';
let sdasd = '212';
let aaa = 2;
`;

test('require-to-import', function(t) {
  const code = transform(input, babelOpts).code;
  console.log(code);
  t.end();
});
