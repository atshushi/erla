import Base from '../Base.js'

export default class MessagePayload extends Base {
  constructor (d) {
    super(d.id)

    this.references = {
      failIfNotExists: d.message_reference?.fail_if_not_exists,
      messageId: d.message_reference?.message_id,
      channelId: d.message_reference?.channel_id,
      guildId: d.message_reference?.guild_id
    }
    this.mentions = d.allowed_mentions
    this.attachment = d.attachments
    this.stickerIds = d.sticker_ids
    this.components = d.components
    this.payload = d.payload_json
    this.content = d.content
    this.embeds = d.embeds
    this.nonce = d.nonce
    this.flags = d.flags
    this.tts = d.tts
  }
}
