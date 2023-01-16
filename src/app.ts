import { getExtensions, getUsers } from './lib/api'
import { getStatusOfUser } from './utils'
import logger from 'node-color-log'
import DaemonState from './state'
import UsersState from './users'
import { initWs, loginWs } from './lib/ws'

// Init users state
const usersState = new UsersState()
// WS: init daemon state
const wsState = new DaemonState()
// API: init daemon states
const apiState = new DaemonState()

async function apiRequests(initial) {
  const extensionsRes = await getExtensions()
  const usersRes = await getUsers()

  // API: add users to state
  if (usersRes) {
    usersState.setUsers(Object.keys(usersRes))

    Object.values(usersRes).forEach((user) => {
      // API: add extensions to state
      const exts = user.endpoints.extension.map((ext) => ext.id)
      usersState.addExtensions(exts)

      // API: add user's main presences
      apiState.setUsersMainPresence(user.username, user.mainPresence)
    })
  }

  // API: add conversations and telephonic status to state
  usersState.getUsers().forEach((user, i) => {
    const usersExtsData: string[] = []
    usersState.getExtensions()[i].forEach((ext: string) => {
      if (Object.values(extensionsRes[ext].conversations).length > 0) {
        for (let conv in extensionsRes[ext].conversations) {
          apiState.addUsersConversations(user, {
            [conv]: extensionsRes[ext].conversations[conv],
          })
        }
      }
      usersExtsData.push(extensionsRes[ext])
    })
    apiState.addUsersTelephonicStatus(user, getStatusOfUser(usersExtsData))
    apiState.setUsersExtensions(user, usersExtsData)
    if (initial) wsState.setUsersExtensions(user, usersExtsData)
  })
  // Returns as a promise
  return
}

async function wsStart() {
  // Exec api requests
  await apiRequests(true)

  // WS: start ws connection to ws
  const ws = initWs()
  ws.on('connect', () => {
    logger.info('socket connected')
    loginWs(ws)
  })

  // WS: add main presence to state
  ws.on('userMainPresenceUpdate', (res) => {
    wsState.setUsersMainPresence(res.mainPresence.username, res.mainPresence.status)
  })

  // WS: add conversations and telephonic status to state
  ws.on('extenUpdate', (res) => {
    if (Object.values(res.conversations).length > 0) {
      for (let conv in res.conversations) {
        wsState.addUsersConversations(res.username, {
          [conv]: res.conversations[conv],
        })
      }
    } else {
      wsState.emptyUsersConversations(res.username)
    }
    const usersExtensions = wsState.getUserExtensions(res.username)
    const newUsersExtensions = usersExtensions.map((ext) => {
      if (ext.exten === res.exten) {
        ext.status = res.status
      }
      return ext
    })
    wsState.setUsersExtensions(res.username, newUsersExtensions)
    // WS: set ws user's telephonic status
    wsState.addUsersTelephonicStatus(
      res.username,
      getStatusOfUser(wsState.getUserExtensions(res.username)),
    )
  })
  // Returns as a promise
  return
}

function checkPresence() {
  usersState.getUsers().forEach((user) => {
    const wsTelephonicStatus = wsState.getUserTelephonicStatus(user)
    const apiTelephonicStatus = apiState.getUserTelephonicStatus(user)
    const wsMainPresence = wsState.getUserMainPresence(user)
    const apiMainPresence = apiState.getUserMainPresence(user)

    // Log when main presence is busy and telephonic status is online
    if (
      (apiTelephonicStatus === 'online' && apiMainPresence === 'busy') ||
      (wsTelephonicStatus === 'online' && wsMainPresence === 'busy')
    ) {
      // Log status and main presence
      wsTelephonicStatus && logger.warn(`WS telephonic status ${user}: ${wsTelephonicStatus}`)
      apiTelephonicStatus && logger.warn(`API telephonic status ${user}: ${apiTelephonicStatus}`)
      wsMainPresence && logger.warn(`WS main presence ${user}: ${wsMainPresence}`)
      apiMainPresence && logger.warn(`API main presence ${user}: ${apiMainPresence}`)
      // Log conversations length
      const wsConversations = wsState.getUserConversations(user)
      if (wsConversations && wsConversations.length > 0) {
        logger.warn(`WS user conversations length ${user}: ${wsConversations.length}`)
      }
      const apiConversations = apiState.getUserConversations(user)
      if (apiConversations && apiConversations.length > 0) {
        logger.warn(`API user conversations length ${user}: ${apiConversations.length}`)
      }
      // Log extensions statuses
      wsState.getUserExtensions(user).forEach((ext) => {
        logger.warn(`WS user extensions status ${user} ${ext.exten}: ${ext.status}`)
      })
      apiState.getUserExtensions(user).forEach((ext) => {
        logger.warn(`API user extensions status ${user} ${ext.exten}: ${ext.status}`)
      })
    }
  })
}

async function daemonStart() {
  // Start ws
  await wsStart()

  // Exec api update and check every minute
  setInterval(async () => {
    await apiRequests(false)
    checkPresence()
  }, 5000)
}

daemonStart()
