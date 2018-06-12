const {test, trait} = use('Test/Suite')('UI');

trait('Test/Browser');

const Utils = require('../../app/Services/Utils');
const utils = new Utils();
const VALID_URL = 'https://www.facebook.com/';
const INVALID_URL = 'http://p[f.com123';
const DESIRED_URL = utils.generateRandomString();
const ORIGINAL_URL_SELECTOR = '#original_url';
const DESIRED_URL_SELECTOR = '#desired_url';
const Env = use('Env');
const APP_URL = Env.get('APP_URL');
let page;

test('Visit main page', async ({browser}) => {
  page = await browser.visit('/');
  await page.assertHas('URL SHORTENER');
});

test('Submit empty form get required validation errors', async () => {
  await page.click('button[type="submit"]');
  await page.assertIsNotVisible('.alert.alert-success');
  await page.assertIsVisible('.alert.alert-danger');
});

test('Check validation of urls', async () => {
  await page.click('button[type="submit"]');
  await page.type(ORIGINAL_URL_SELECTOR, INVALID_URL);
  await page.click('button[type="submit"]');
  await page.assertIsNotVisible('.alert.alert-success');
  await page.assertIsVisible('.alert.alert-danger');
});

test('Submit with valida data', async ({browser}) => {
  page = await browser.visit('/');
  await page.type(ORIGINAL_URL_SELECTOR, VALID_URL);
  await page.click('button[type="submit"]');
  await waitForSuccess(page);
  await page.assertHasIn('.alert.alert-success', 'Short Url:');
});

test('Go on short url', async ({browser}) => {
  page = await browser.visit('/');
  await page.type(ORIGINAL_URL_SELECTOR, VALID_URL);
  await page.click('button[type="submit"]');
  await waitForSuccess(page);

  const value = await page.getValue('[name="short-url__input-value"]');

  const OpenedPage = await browser.visit(value);
  await OpenedPage
    .assertFn(function () {
      return document.location.href
    }, VALID_URL)
});

test('Go on short desired url', async ({browser, assert}) => {
  page = await browser.visit('/');
  await page.type(ORIGINAL_URL_SELECTOR, VALID_URL);
  await page.type(DESIRED_URL_SELECTOR, DESIRED_URL);
  await page.click('button[type="submit"]');
  await waitForSuccess(page);

  const value = await page.getValue('[name="short-url__input-value"]');

  assert.equal(value, `${APP_URL}/${DESIRED_URL}`);

  const OpenedPage = await browser.visit(value);
  await OpenedPage
    .assertFn(function () {
      return document.location.href
    }, VALID_URL)
});


const waitForSuccess = async (page) => {
  await page
    .waitFor(function () {
      return !!document.querySelector('.alert.alert-success.show');
    });
  await page.isVisible('.alert.alert-success');
};
