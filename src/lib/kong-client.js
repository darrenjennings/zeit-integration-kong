import DFetch from 'digest-fetch';

export default class KongClient {
  constructor (options) {
    this.options = options;
    this.client = new DFetch(options.url, options.apiKey);
  }

  fetch (path, options = {}) {
    const apiUrl = `${this.options.url}${path}`;
    options.headers = {
      ...options.headers,
      'apikey': this.options.apiKey,
      'Content-Type': 'application/json'
    }

    return this.client.fetch(apiUrl, options);
  }

  async fetchAndThrow (path, options) {
    const res = await this.fetch(path, options);
    if (res.status !== 200) {
      throw new Error(
        `Failed Kong API call. path: ${path} status: ${
        res.status
        } error: ${await res.text()}`
      );
    }

    const response = await res.json();

    return response;
  }

  async authCheck () {
    try {
      const res = await this.fetchAndThrow('');
      return res.hasOwnProperty('plugins')
    } catch (e) {
      return false
    }
  }
}
