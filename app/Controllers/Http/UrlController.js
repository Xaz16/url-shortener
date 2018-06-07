'use strict';

const axios = require('axios');
const Utils = require('../../Services/Utils');

class UrlController {
  constructor() {
    console.log(Utils);
    this.utils = new Utils();
    this.checkUrl = this.checkUrl.bind(this);
  }
  async createUrlPair({request, response}) {
    const url = request.input('url');
    try {
      const res = await axios.get(url);
      if (res.status === 200) {
        const result = this.utils.generateRandomString(6);
        return response.status(200).send({status: 'success', result: result});
      }
    } catch (err) {
      console.error(err);
      return response.status(400).send('Error occurred: ' + err.message);
    }


  };
}

module.exports = UrlController;
