import Base from '../Base.js'

import PublicFlags from '../../util/PublicFlags.js'

export default class User extends Base {
  constructor (client, d) {
    super(client, d.id)

    this.username = d.username
    this.discrim = d.discriminator
    this.bot = d.bot || false
    this.avatar = d.avatar
    this.banner = d.banner
    this.publicFlags = new PublicFlags(d.public_flags)
  }

  get tag () {
    return `${this.username}#${this.discrim}`
  }
}
