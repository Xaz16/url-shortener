'use strict';

const axios = require('axios');
const Utils = require('../../Services/Utils');
const Url = use('App/Models/Url');
const Env = use('Env');

class UrlController {
  constructor() {
    this.utils = new Utils();
    this.createUrlPair.bind(this);
    this.checkExistingUrl = this.checkExistingUrl.bind(this);
    this.createShortUrl = this.createShortUrl.bind(this)
  }

  async createUrlPair({request, response}) {
    const requestedUrl = request.input('url');
    try {
      const res = await axios.get(requestedUrl);
      if (res.status === 200) {
        const existingUrl = await this.checkExistingUrl({url: requestedUrl, type: 'original'});
        if(!existingUrl) {
          const result = await this.createShortUrl(requestedUrl);
          return response.status(200).send({shortUrl: result, originalUrl: requestedUrl});
        }
        return response.status(200).send({shortUrl: existingUrl.short, originalUrl: existingUrl.original});
      }
    } catch (err) {
      console.error(err);
      return response.status(400).send('Error occurred: ' + err.message);
    }
  };

  /**
   * Check url in database and return row if founded
   * @param url
   * @param type
   * @returns {Promise<*>}
   */
  async checkExistingUrl({url, type}) {
    let result;
    switch (type) {
      case 'short':
        result = await Url
          .query()
          .where('short', '=', `${Env.get('APP_URL')}${url}`)
          .limit(1);
        break;
      case 'original':
        result = await Url
          .query()
          .where('original', '=', `${url}`)
          .limit(1);
        break;
    }


    return result.length ? result : null;
  }

  /**
   * Create short url with recursion if created short url is duplicate
   * @param requestedUrl
   * @returns {Promise<string>}
   */
  async createShortUrl(requestedUrl) {
    const result = `${Env.get('APP_URL')}/${this.utils.generateRandomString(6)}`;
    const isDuplicate = await this.checkExistingUrl({url: result, type: 'short'}) !== null;
    if(isDuplicate) {
      this.createShortUrl.call(this, ...arguments)
    }
    const url = new Url();
    url.original = requestedUrl;
    url.short = result;
    await url.save();

    return result
  }

}

module.exports = UrlController;
