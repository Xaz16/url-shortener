'use strict';

const axios = require('axios');
const Utils = require('../../Services/Utils');
const Url = use('App/Models/Url');
const Env = use('Env');
const Logger = use('Logger');

class UrlController {
  constructor() {
    this.utils = new Utils();
    this.createUrlPair.bind(this);
    this.checkExistingUrl = this.checkExistingUrl.bind(this);
    this.createShortUrl = this.createShortUrl.bind(this)
  }

  async createUrlPair({request, response}) {
    const requestedUrl = request.input('original_url');
    const desiredUrl = request.input('desired_url').replace(/ /g, '');

    try {
        const res = await axios.get(requestedUrl).catch(err => {
          Logger.warning('Can\'t get %s \n Error: %s', requestedUrl, err.message);
        });
        if (res.status >= 200 && res.status < 300) {
          const existingUrl = await this.checkExistingUrl({url: requestedUrl, type: 'original'});
          if(!existingUrl || desiredUrl) {
            const result = await this.createShortUrl({requestedUrl, desiredUrl});
            return response.status(200).send({shortUrl: result, originalUrl: requestedUrl});
          }
          return response.status(200).send({shortUrl: existingUrl[0].short, originalUrl: existingUrl[0].original});
        }
    } catch (err) {
      Logger.error('Error occurred: ' + err.message);
      return response.status(400).send('Error occurred: ' + err.message);
    }
  };

  async checkUrl({request, response}) {
    try {
      const requestedUrl = request.input('url');
      console.log(requestedUrl);
      let result = await this.checkExistingUrl({url: requestedUrl, type: 'short'});

      if(!result) {
        return response.status(200).send({available: true});
      }
    } catch(err) {
      Logger.error('Can\'t check short url: %s' + err.message)
    } finally {
      response.status(400).send({available: false});
    }

  }

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
          .where('short', '=', `${Env.get('APP_URL')}/${url}`)
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
   * @param requestedUrl {String}
   * @param desiredUrl {String}
   * @returns {Promise<string>}
   */
  async createShortUrl({requestedUrl, desiredUrl}) {
    const result = `${Env.get('APP_URL')}/${desiredUrl ? desiredUrl : this.utils.generateRandomString(6)}`;
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
