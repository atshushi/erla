import EventEmitter from 'events'

import Shard from './shard/Shard.js'
import Intents from './shard/Intents.js'

import ApiBase from './api/Base.js'
import ApiRoutes from './api/Routes.js'

import Message from './entities/message/Message.js'
import MessagePayload from './entities/message/MessagePayload.js'

export default class Client extends EventEmitter {
  user

  constructor (token, options = {}) {
    super()

    this.token = token

    if (Array.isArray(options.intents)) {
      this.intents = Intents.parse(options.intents)
    } else if (options.intents) {
      this.intents = options.intents
    } else {
      this.intents = 0
    }

    this.reconnect = options.reconnect ?? true

    this.api = new ApiBase(token)
    this.gateway = new Shard(this)
  }

  createMessage (channelId, options) {
    const payload = new MessagePayload(options).resolve()

    return this.api.request(
      'POST',
      ApiRoutes.CHANNEL_MESSAGES(channelId),
      payload
    ).then(d => new Message(d))
  }
}
