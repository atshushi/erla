import EventEmitter from 'events'

import Session from './shard/Session.js'

import Requester from './rest/Requester.js'
import Routes from './rest/Routes.js'

import Message from './entities/message/Message.js'

export default class Client extends EventEmitter {
  user

  constructor (token, options = {}) {
    super()

    this.token = token
    this.intents = options.intents ?? 0
    this.reconnect = options.reconnect ?? true

    this.rest = new Requester(token)
    this.gateway = new Session(this)
  }

  createMessage (channelId, options) {
    return this.rest.request(
      'POST',
      Routes.CHANNEL_MESSAGES(channelId),
      options
    ).then(d => new Message(d))
  }
}
