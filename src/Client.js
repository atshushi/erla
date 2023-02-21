import EventEmitter from 'events'

import WSGateway from './gateway/WSGateway.js'
import RequestHandler from './http/RequestHandler.js'
import Endpoints from './http/Endpoints.js'

import User from './entities/global/User.js'
import Message from './entities/message/Message.js'

import Collection from './util/Collection.js'

export default class Client extends EventEmitter {
  user

  unavailableGuilds = new Collection()
  guilds = new Collection()

  constructor (token, options = {}) {
    super()

    this.token = token
    this.intents = options.intents ?? 0
    this.reconnect = options.reconnect ?? true

    this.rest = new RequestHandler(token)
  }

  login () {
    this.gateway = new WSGateway(this)

    this.gateway.connect()
  }

  createMessage (channelId, options) {
    if (typeof options.body === 'string') {
      options.body = {
        content: options
      }
    }

    return this.rest.post(
      Endpoints.CHANNEL_MESSAGES(channelId),
      options
    ).then(d => new Message(d))
  }

  fetchUser (userId) {
    return this.rest.get(
      Endpoints.USER(userId)
    ).then(d => new User(d))
  }

  getGlobalCommands () {
    return this.rest.get(
      Endpoints.GLOBAL_APPLICATION_COMMAND_REGISTER(
        this.user.id
      ))
  }

  createGlobalCommand (command) {
    return this.rest.post(
      Endpoints.GLOBAL_APPLICATION_COMMAND_REGISTER(
        this.user.id
      ), {
        body: command
      })
  }

  getGlobalCommand (commandId) {
    return this.rest.get(
      Endpoints.GLOBAL_APPLICATION_COMMAND_EDITOR(
        this.user.id,
        commandId
      ))
  }

  editGlobalCommand (commandId, newCommand) {
    return this.rest.patch(
      Endpoints.GLOBAL_APPLICATION_COMMAND_EDITOR(
        this.user.id,
        commandId
      ), {
        body: newCommand
      })
  }

  deleteGlobalCommand (commandId) {
    return this.rest.delete(
      Endpoints.GLOBAL_APPLICATION_COMMAND_EDITOR(
        this.user.id,
        commandId
      ))
  }

  overwriteGlobalCommands (commands) {
    return this.rest.put(
      Endpoints.GLOBAL_APPLICATION_COMMAND_REGISTER(
        this.user.id
      ), {
        body: commands
      })
  }

  getGuildCommands (guildId) {
    return this.rest.get(
      Endpoints.GUILD_APPLICATION_COMMAND_REGISTER(
        this.user.id,
        guildId
      ))
  }

  createGuildCommand (guildId, command) {
    return this.rest.post(
      Endpoints.GUILD_APPLICATION_COMMAND_REGISTER(
        this.user.id,
        guildId
      ), {
        body: command
      })
  }

  getGuildCommand (guildId, commandId) {
    return this.rest.get(
      Endpoints.GUILD_APPLICATION_COMMAND_EDITOR(
        this.user.id,
        guildId,
        commandId
      ))
  }

  editGuildCommand (guildId, commandId, newCommand) {
    return this.rest.patch(
      Endpoints.GUILD_APPLICATION_COMMAND_EDITOR(
        this.user.id,
        guildId,
        commandId
      ), {
        body: newCommand
      })
  }

  deleteGuildCommand (guildId, commandId) {
    return this.rest.delete(
      Endpoints.GUILD_APPLICATION_COMMAND_EDITOR(
        this.user.id,
        guildId,
        commandId
      ))
  }

  overwriteGuildCommands (guildId, commands) {
    return this.rest.put(
      Endpoints.GUILD_APPLICATION_COMMAND_REGISTER(
        this.user.id,
        guildId
      ), {
        body: commands
      })
  }
}
