'use strict';

const Helpers = use('Helpers');
const Url = use('App/Models/Url');
const Env = use('Env');
const fs = require('fs');

class MainController {
  async index({response, request}) {
    const url = request.url();

    if (url !== '/') {
      const result = await Url
        .query()
        .where('short', '=', `${Env.get('APP_URL')}${url}`)
        .limit(1);

      if(result) {
        const entry = await Url.findBy('id', result[0].id);
        entry.usage += 1;
        await entry.save();
        return response.redirect(result[0].original);
      }
    }
    response.header('Content-type', 'text/html');
    return response.send(fs.readFileSync(Helpers.publicPath('main.html'), 'utf-8'));
  }
}

module.exports = MainController;
