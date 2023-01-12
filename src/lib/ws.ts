import { io } from 'socket.io-client'
import config from '../../config/monitor_config'

/**
 * Start the ws connection
 * @returns The socket io instance
 */
export function initWs() {
  return io(config.ws_url, {
    upgrade: false,
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 2000,
    rejectUnauthorized: false,
  })
}

/**
 * Start the ws connection
 * @returns The socket io instance
 */
export function loginWs(socket) {
  socket.emit('login', {
    accessKeyId: config.username,
    token: config.auth_token,
    uaType: 'desktop',
  })
}
