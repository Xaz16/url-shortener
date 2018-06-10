'use strict';

const UrlController = require('./UrlController');
const {validateAll} = use('Validator');
const MainFormValidator = require('../../Validators/MainForm');
const Logger = use('Logger');

class ApiV1Controller {
  constructor() {
    this.urlController = new UrlController();
    this.mainValidator = new MainFormValidator();
  }

  async createUrlPair({request, response}) {
    try {
      const validate = await validateAll(request.all(), this.mainValidator.rules, this.mainValidator.messages);

      if (!validate.fails()) {
        return await this.urlController.createUrlPair({request, response});
      } else {
        return await response.status(403).send(validate.messages());
      }
    } catch(err) {
      Logger.error('Error on POST %s edpoint \n Message: %s', request.url(), err.message);
      return await response.status(400).send(err);
    }

  }
}

module.exports = ApiV1Controller;
