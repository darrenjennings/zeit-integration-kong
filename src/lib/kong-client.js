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
    
    if (options.data) {
      options.body = JSON.stringify(options.data)
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
  
  async fetchEntity (entityName, method, postData = {}) {
    const requestOptions = {
      method: method
    }
    
    if (method === 'POST' && postData){
      requestOptions.data = postData
    }
    
    this.fetch(`/${entityName}`, requestOptions)
    .then(res => res.json())
    .then(json => console.log(json))
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
