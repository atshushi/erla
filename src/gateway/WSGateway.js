import WebSocket from 'ws'
import EventEmitter from 'events'

import { IDENTIFICATION, OPCODES } from '../util/Constants.js'

import User from '../entities/global/User.js'
import Message from '../entities/message/Message.js'
import ApplicationCommand from '../entities/interaction/ApplicationCommand.js'
import Guild from '../entities/global/Guild.js'

export default class Socket extends EventEmitter {
  #wsUrl = 'wss://gateway.discord.gg/?v=10&encoding=json'
  #client = null
  #connection = null
  #interval = null
  #token
  #intents
  #reconnect

  constructor (client) {
    super()

    this.#client = client
    this.#token = client.token
    this.#intents = client.intents
    this.#reconnect = client.reconnect
  }

  connect () {
    this.#connection = new WebSocket(this.#wsUrl)

    this.#connection.on('open', () => this.#openConnection())
    this.#connection.on('message', payload => this.#handleMessage(payload))
    this.#connection.on('close', (code, reason) => this.#handleClose(code, reason))
    this.#connection.on('error', err => this.#handleError(err))
  }

  disconnect () {
    this.#interval ||= clearInterval(this.#interval)
    this.#connection = null

    this.#client.emit('disconnect')
  }

  #openConnection () {
    this.#client.emit('connect')

    this.#connection.send(
      JSON.stringify({
        op: OPCODES.IDENTIFY,
        d: {
          token: this.#token,
          intents: this.#intents,
          properties: {
            $os: process.platform.toString(),
            $browser: IDENTIFICATION,
            $device: IDENTIFICATION
          }
        }
      }))
  }

  #handleMessage (payload) {
    payload = JSON.parse(payload.toString())

    switch (payload.op) {
      case OPCODES.DISPATCH:
        this.#dispatch(payload)
        break

      case OPCODES.HELLO:
        this.#heartbeat(payload.d.heartbeat_interval)
        break
    }
  }

  #handleClose (code, reason) {
    reason = reason.toString()

    this.#client.emit('close', {
      reason,
      code
    })

    console.error(new Error(reason))

    if (this.#reconnect) {
      this.#autoReconnect()
    } else {
      this.disconnect()
      process.exit()
    }
  }

  #autoReconnect () {
    this.#client.emit('reconnect')

    this.#connection.terminate()
    clearInterval(this.#interval)
    this.#connection.removeAllListeners()

    this.connect()
  }

  #handleError (err) {
    this.#client.emit('error', err)
    this.#connection.terminate()
  }

  #heartbeat (ms) {
    this.#interval = setInterval(() => {
      this.#connection.send(JSON.stringify({
        op: OPCODES.HEARTBEAT,
        d: null
      }))
    }, ms)
  }

  #dispatch (payload) {
    this.#client.emit('raw', payload)

    switch (payload.t) {
      case 'READY':
        this.#client.user = new User(this.#client, payload.d)

        if (!payload.d.guilds.length) {
          this.#client.emit('ready')
          break
        }

        this.#client.emit('preReady')

        for (const guild of payload.d.guilds) {
          this.#client.unavailableGuilds.add(guild.id, guild)
        }
        break

      case 'MESSAGE_CREATE':
        this.#client.emit('messageCreate', new Message(this.#client, payload.d))
        break

      case 'INTERACTION_CREATE':
        this.#client.emit('interactionCreate', new ApplicationCommand(payload.d))
        break

      case 'GUILD_CREATE': {
        const guild = new Guild(this.#client, payload.d)

        const removed = this.#client.unavailableGuilds.remove(guild.id)
        this.#client.guilds.add(guild.id, guild)

        if (removed && !this.#client.unavailableGuilds.size) {
          this.#client.emit('ready')
        }

        this.#client.emit('guildCreate', guild)
        break
      }

      case 'GUILD_REMOVE': {
        const guild = new Guild(this.#client, payload.d)

        this.#client.guilds.remove(guild.id)
        this.#client.emit('guildRemove', guild)
        break
      }
    }
  }
}
