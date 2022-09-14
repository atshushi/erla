import Base from '../Base.js'

export default class Guild extends Base {
  constructor (client, d) {
    super(client, d.id)

    this.name = d.name
  }
}
