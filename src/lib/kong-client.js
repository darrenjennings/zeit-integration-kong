import DFetch from 'digest-fetch';

export default class KongClient {
  constructor (options) {
    this.options = options;
    this.client = new DFetch(options.url, options.apiKey);
  }

  fetch (path, options) {
    const apiUrl = `${this.options.url}${path}`;
    console.log(apiUrl)
    if (options.data) {
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json'
      };
      options.body = JSON.stringify(options.data);
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
    let res 
    try{
      res = await this.fetch('/', { method: 'GET' });
    } catch (e) {
      console.log(e)
    }
    
    return res.status === 200;
  }
}
