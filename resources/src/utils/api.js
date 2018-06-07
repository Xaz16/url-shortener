import axios               from 'axios';
import { isUrl, required } from './index';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

const instance = axios.create({
  baseURL: API_URL,
  timeout: 30000
});

/**
 *
 * @param value
 * @param done
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
 * @param value
 * @param done
 * @returns {Promise}
 */

export const createUrlPair = (value, done) => {
  if (isUrl(value)) {
    return instance.get('/createUrlPair?url=' + value).then(res => {
      done && done(res.data.available);
      return res;
    }).catch(err => {
      done && done(false);
      return err;
    });
  }
};
