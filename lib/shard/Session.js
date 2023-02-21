import WebSocket from 'ws'
import EventEmitter from 'events'

import User from '../entities/global/User.js'
import Message from '../entities/message/Message.js'

export default class Session extends EventEmitter {
  constructor (client) {
    super()

    this._client = client
  }

  connect () {
    this._connection = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json')

    this._connection.on('open', () => this._openConnection())
    this._connection.on('message', payload => this._handleMessage(payload))
    this._connection.on('close', (code, reason) => this._handleClose(code, reason))
    this._connection.on('error', err => this._handleError(err))
  }

  disconnect () {
    this._interval ||= clearInterval(this._interval)
    this._connection = null

    this._client.emit('disconnect')
  }

  _openConnection () {
    this._client.emit('connect')

    this._connection.send(
      JSON.stringify({
        op: 2, // IDENTIFY
        d: {
          token: this._client.token,
          intents: this._client.intents,
          properties: {
            $os: process.platform.toString(),
            $browser: 'erla',
            $device: 'erla'
          }
        }
      }))
  }

  _handleMessage (payload) {
    payload = JSON.parse(payload.toString())

    switch (payload.op) {
      case 0: // DISPATCH
        this._dispatch(payload)
        break

      case 10: // HELLO
        this._heartbeat(payload.d.heartbeat_interval)
        break
    }
  }

  _handleClose (code, reason) {
    reason = reason.toString()

    this._client.emit('close', {
      reason,
      code
    })

    console.error(new Error(reason))

    if (this._client._reconnect) {
      this._autoReconnect()
    } else {
      this.disconnect()
      process.exit()
    }
  }

  _autoReconnect () {
    this._client.emit('reconnect')

    this._connection.terminate()
    clearInterval(this._interval)
    this._connection.removeAllListeners()

    this.connect()
  }

  _handleError (err) {
    this._client.emit('error', err)
    this._connection.terminate()
  }

  _heartbeat (ms) {
    this._interval = setInterval(() => {
      this._connection.send(JSON.stringify({
        op: 1, // HEARTBEAT
        d: null
      }))
    }, ms)
  }

  _dispatch (payload) {
    this._client.emit('raw', payload)

    switch (payload.t) {
      case 'READY':
        this._client.user = new User(payload.d.user)

        this._client.emit('preReady')
        break

      case 'MESSAGE_CREATE':
        this._client.emit('messageCreate', new Message(payload.d))
        break
    }
  }
}
