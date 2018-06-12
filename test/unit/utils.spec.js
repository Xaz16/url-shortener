'use strict';

const {test} = use('Test/Suite')('Utils');
const Utils = require('../../app/Services/Utils');
const utils = new Utils();

test('Check generateRandomString method', async ({assert}) => {
  const testString = utils.generateRandomString();

  assert.isString(testString);
  assert.equal(testString.length, 6);
});
