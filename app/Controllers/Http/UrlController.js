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
    this.createShortUrl = this.createShortUrl.bind(this);
  }

  async createUrlPair({request, response}) {
    const requestedUrl = request.input('original_url');
    const desiredUrl = request.input('desired_url') ? request.input('desired_url').replace(/ /g, '') : '';

    try {
      const res = await axios.get(requestedUrl).catch(err => {
        Logger.warning('Can\'t get %s \n Error: %s', requestedUrl, err.message);
      });

      if (res.status >= 200 && res.status < 300) {
        const existingUrl = await this.checkExistingUrl({url: requestedUrl, type: 'original'});
        if (!existingUrl || desiredUrl) {
          const result = await this.createShortUrl({requestedUrl, desiredUrl});
          if (result.message) {
            return await response.status(400).send(result);
          }
          return await response.status(200).send({shortUrl: result, originalUrl: requestedUrl});
        }
        return await response.status(200).send({shortUrl: existingUrl[0].short, originalUrl: existingUrl[0].original});
      }

    } catch (err) {
      Logger.error('Error occurred: ' + err.message);
      return await response.status(400).send({message: 'Can\'t get: ' + requestedUrl, error: err.message});
    }
  };

  async checkUrl({request, response}) {
    try {
      const requestedUrl = request.input('url');
      let result = await this.checkExistingUrl({url: `${Env.get('APP_URL')}/${requestedUrl}`, type: 'short'});

      if (!result) {
        return await response.status(200).send({available: true});
      } else {
        return await response.status(400).send({available: false});
      }
    } catch (err) {
      Logger.error('Can\'t check short url: %s' + err.message);
      return await response.status(400).send({available: false});
    }
  }

  /**
   * Check url in database and return row if founded
   * @param url
   * @param type
   * @returns {Promise<*>}
   */
  async checkExistingUrl({url, type}) {
    const result = await Url
      .query()
      .where(type, '=', url)
      .limit(1);

    return result.length ? result : null;
  }

  /**
   * Create short url with recursion if created short url is duplicate
   * @param requestedUrl {String}
   * @param desiredUrl {String}
   * @returns {Promise<string>|Object}
   */
  async createShortUrl({requestedUrl, desiredUrl}) {
    const result = desiredUrl ? `${Env.get('APP_URL')}/${desiredUrl}` : `${Env.get('APP_URL')}/${this.utils.generateRandomString(6)}`;
    const isDuplicate = await this.checkExistingUrl({url: result, type: 'short'}) !== null;
    if (isDuplicate && !desiredUrl) {
      this.createShortUrl.call(this, ...arguments);
    } else if (isDuplicate && desiredUrl) {
      return {message: 'This url already taken'};
    }
    const url = new Url();
    url.original = requestedUrl;
    url.short = result;
    await url.save();

    return result;
  }

}

module.exports = UrlController;
