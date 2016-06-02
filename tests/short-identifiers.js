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
let one = 1;
let two = 2, three = 3, four = 4;
var x = 5;

var obj = {
  method() {},
  fn: function() {},
  namedfn: function named() {}
}

function doSomething() {
  var one = 1, two = 2, three = 3;
  function doSomethingElse() {
    var one = 1, two = 2, three = 3;
    {
      let one = 1, two = 2, three = 3;
    }
  }
}

var window = 5;
var document = this;

`;

test('short-identifiers', function(t) {
  const code = transform(input, babelOpts).code;
  console.log(code);
  t.end();
});
