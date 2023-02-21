import undici from 'undici'

export default class Requester {
  constructor (token) {
    this._client = new undici.Client('https://discord.com:443')
    this._token = token
  }

  async request (method, path, options) {
    const requestOptions = {
      path: '/api/v10' + path,
      method,
      headers: {
        Authorization: 'Bot ' + this._token.replace(/Bot\s?/, ''),
        'User-Agent': 'erla (https://github.com/erlajs/erla 0.0.1)'
      }
    }

    if (options.files) {
      const data = new undici.FormData()

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
}
