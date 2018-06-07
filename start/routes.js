'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route');
const Helpers = use('Helpers');

Route.get('/checkShortUrl', 'UrlController.checkShortUrl');
Route.get('/checkUrl', 'UrlController.checkUrl');

Route.any('*', ({response}) => {
  response.sendFile(Helpers.publicPath('index.html'));
});
