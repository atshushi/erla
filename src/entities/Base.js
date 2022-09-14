export default class Base {
  constructor (client, id) {
    this.client = client
    this.id = id
  }

  get createdAt () {
    return Math.floor(this.id / 4194304) + 1420070400000
  }
}
