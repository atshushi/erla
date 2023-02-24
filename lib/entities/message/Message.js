import Base from '../Base.js'

import User from '../global/User.js'

export default class Message extends Base {
  constructor (d) {
    super(d.id)

    this.content = d.content
    this.channelId = d.channel_id
    this.author = new User(d.author)
    this.timestamp = new Date(d.timestamp)
    this.attachments = d.attachments
  }

  static resolve (data = {}) {
    return {
      content: data.content,
      nonce: data.nonce,
      tts: data.tts,
      embeds: data.embeds,
      allowed_mentions: data.mentions,
      message_reference: {
        message_id: data.references?.messageId,
        channel_id: data.references?.channelId,
        guild_id: data.references?.guildId,
        fail_if_not_exists: data.references?.failIfNotExists
      },
      components: data.components,
      sticker_ids: data.stickerIds,
      payload_json: data.payload,
      attachments: data.attachment,
      flags: data.flags
    }
  }
}
