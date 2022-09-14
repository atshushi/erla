import Base from '../Base.js'

import User from '../global/User.js'

export default class Message extends Base {
  constructor (client, d) {
    super(client, d.id)

    this.content = d.content
    this.channelId = d.channel_id
    this.author = new User(d.author)
    this.timestamp = new Date(d.timestamp)
  }
}
