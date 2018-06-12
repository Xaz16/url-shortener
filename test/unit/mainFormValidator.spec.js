'use strict';

const {test} = use('Test/Suite')('Main Form Validator');
const MainFormValidator = use('App/Validators/MainForm');
const {validateAll} = use('Validator');
const validatorInstance = new MainFormValidator();
const Utils = require('../../app/Services/Utils');
const utils = new Utils();

test('Check original_url field on requried', async ({assert}) => {
  const validation = await validateAll({
    email: 'wrong email',
    some_strange_data: '12312313123',
    desired_url: ''
  }, validatorInstance.rules, validatorInstance.messages);

  assert.isTrue(validation.fails());
  assert.deepEqual(validation.messages(), [
    {
      message: 'Original url is required',
      field: 'original_url',
      validation: 'required'
    }
  ]);
});

test('Check original_url and desired_url on max validation', async ({assert}) => {
  const validation = await validateAll({
    original_url: utils.generateRandomString(501),
    desired_url: utils.generateRandomString(501)
  }, validatorInstance.rules, validatorInstance.messages);

  assert.isTrue(validation.fails());
  assert.deepEqual(validation.messages(), [
    {
      message: 'Original url should not be more than 500 charters',
      field: 'original_url',
      validation: 'max'
    },
    {
      message: 'Desired url should not be more than 500 charters',
      field: 'desired_url',
      validation: 'max'
    }
  ]);
});
