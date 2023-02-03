import ApplicationCommandOptions from './ApplicationCommandOptions.js'

export default class ApplicationCommandData {
  constructor (d) {
    this.type = d.type
    this.options = d.options?.map(option => new ApplicationCommandOptions(option))
    this.name = d.name
    this.id = d.id
    this.guildId = d.guild_id
  }
}
