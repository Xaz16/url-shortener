import axios                          from 'axios';
import { getCookie, isUrl, required } from './index';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';
const CSRF = getCookie('XSRF-TOKEN');
const instance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-XSRF-TOKEN': CSRF ? CSRF : ''
  }
});

/**
 *
 * @param value {String}
 * @param done {Function}
 * @returns {Promise}
 */

export const checkIfAvailable = (value, done) => {
  if (required(value)) {
    return new Promise((resolve, reject) => {
      instance.get('/checkShortUrl?url=' + value).then(res => {
        resolve(res.data.available);
        done && done(res.data.available);
      }).catch(err => {
        reject(err);
        done && done(false);
      });
    });
  }
};

/**
 * Check if url return 200 or ok status
 * @param data {Object}
 * @param done {Function}
 * @returns {Promise}
 */

export const createUrlPair = (data, done) => {
  if (isUrl(data.original_url)) {
    return instance.post('/createUrlPair', data).then(res => {
      done && done(res.data.available);
      return res;
    })
  }
};
