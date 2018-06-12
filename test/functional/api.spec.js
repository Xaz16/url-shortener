'use strict';

const {test, trait} = use('Test/Suite')('Api');
const Url = use('App/Models/Url');
const Utils = require('../../app/Services/Utils');
const utils = new Utils();
const Env = use('Env');

const VALID_URL = 'https://facebook.com';
const INVALID_URL = 'https://faceb123123asdxcook.com';
const APP_URL = Env.get('APP_URL');

trait('Test/ApiClient');

test('only with original_url', async ({client}) => {
  const response = await client.post('/api/v1/createUrlPair').send({
    original_url: VALID_URL
  }).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    originalUrl: VALID_URL
  });

});

test('with invalid original_url', async ({client}) => {
  const response = await client.post('/api/v1/createUrlPair').send({
    original_url: INVALID_URL
  }).end();

  response.assertStatus(400);
  response.assertJSONSubset({message: `Can\'t get: ${INVALID_URL}`});

});

test('with invalid overflow of data', async ({client}) => {
  const response = await client.post('/api/v1/createUrlPair').send({
    original_url: utils.generateRandomString(501),
    desired_url: utils.generateRandomString(501),
  }).end();

  response.assertStatus(403);
  response.assertJSONSubset([{
    'message': 'Original url should not be more than 500 charters',
    'field': 'original_url',
    'validation': 'max'
  }, {
    'message': 'Desired url should not be more than 500 charters',
    'field': 'desired_url',
    'validation': 'max'
  }]);

});


test('with already existing desired url', async ({client}) => {
  const requestShort = utils.generateRandomString(6);
  const url = new Url();
  url.original = VALID_URL;
  url.short = `${APP_URL}/${requestShort}`;
  await url.save();

  const response = await client.post('/api/v1/createUrlPair').send({
    original_url: VALID_URL,
    desired_url: requestShort,
  }).end();


  response.assertStatus(400);
  response.assertJSONSubset({
    message: 'This url already taken'
  });
});

test('only with non duplicate desired_url', async ({client}) => {
  const result = utils.generateRandomString(200);
  const response = await client.post('/api/v1/createUrlPair').send({
    original_url: VALID_URL,
    desired_url: result
  }).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    originalUrl: VALID_URL,
    shortUrl: `${APP_URL}/${result}`
  });

});

