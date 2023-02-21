import { Client, FormData } from 'undici'

export default class RequestHandler {
  constructor (token) {
    this._client = new Client('https://discord.com:443')
    this._token = token
  }

  async _request (path, method, options) {
    const requestOptions = {
      path: '/api/v10' + path,
      method,
      headers: {
        Authorization: 'Bot ' + this._token.replace(/Bot\s?/, ''),
        'User-Agent': 'coai (https://github.com/4rth8/coai 0.0.1)'
      }
    }

    if (options.files) {
      const data = new FormData()

      for (const file of options.files) {
        data.append(file.name, file.data, file.name)
      }

      if (options.body) {
        data.append('payload_json', JSON.stringify(options.body))
      }

      requestOptions.body = data
    } else if (options.body) {
      requestOptions.headers['Content-Type'] = 'application/json'

      requestOptions.body = JSON.stringify(options.body)
    }

    return new Promise((resolve, reject) => {
      const bufs = []

      return this._client.dispatch(requestOptions, {
        onConnect: () => null,
        onData: chunk => bufs.push(chunk),
        onHeaders: () => null,
        onComplete: () => resolve(JSON.parse(Buffer.concat(bufs).toString('utf8'))),
        onError: reject
      })
    })
  }

  get (path) {
    return this._request(path, 'GET')
  }

  post (path, options) {
    return this._request(path, 'POST', options)
  }

  patch (path, options) {
    return this._request(path, 'PATCH', options)
  }

  put (path, options) {
    return this._request(path, 'PUT', options)
  }

  delete (path, options) {
    return this._request(path, 'DELETE', options)
  }
}
