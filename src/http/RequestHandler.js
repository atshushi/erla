import { Client } from 'undici'

import { IDENTIFICATION, VERSION, REPOSITORY } from '../util/Constants.js'

export default class RequestHandler {
  #url = 'https://discord.com:443'
  #client
  #token

  constructor (token) {
    this.#client = new Client(this.#url)
    this.#token = token
  }

  async #request (path, method, body) {
    const bufs = []
    const opts = {
      path: `/api/v${VERSION}${path}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${this.#token.replace(/Bot\s?/, '')}`,
        'User-Agent': `${IDENTIFICATION} (${REPOSITORY} ${VERSION})`
      }
    }

    if (body) {
      opts.body = typeof body === 'string'
        ? body
        : JSON.stringify(body)
    }

    return new Promise((resolve, reject) => {
      return this.#client.dispatch(opts, {
        onConnect: () => null,
        onData: chunk => bufs.push(chunk),
        onHeaders: () => null,
        onComplete: () => resolve(JSON.parse(Buffer.concat(bufs).toString('utf8'))),
        onError: reject
      })
    })
  }

  get (path) {
    return this.#request(path, 'GET')
  }

  post (path, body) {
    return this.#request(path, 'POST', body)
  }

  patch (path, body) {
    return this.#request(path, 'PATCH', body)
  }

  put (path, body) {
    return this.#request(path, 'PUT', body)
  }

  delete (path, body) {
    return this.#request(path, 'DELETE', body)
  }
}
