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
const Env = use('Env');

Route.post('/createUrlPair', 'UrlController.createUrlPair').validator('MainForm');
Route.get('/checkShortUrl', 'UrlController.checkUrl');

Route
  .group(() => {
    Route.post('/createUrlPair', 'ApiV1Controller.createUrlPair')
  })
  .prefix('api/v1');

Route.any('*', 'MainController.index');
