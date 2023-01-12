export const EXTEN_STATUS_ENUM = {
  DND: 'dnd', // Busy
  BUSY: 'busy', // In Use
  ONLINE: 'online', // Idle
  ONHOLD: 'onhold',
  OFFLINE: 'offline', // Unavailable
  RINGING: 'ringing', // Ringing
  BUSY_RINGING: 'busy_ringing', // In Use & Ringin
}

export const AST_EXTEN_PJSIP_STATUS_2_STR_ADAPTER = {
  Unknown: EXTEN_STATUS_ENUM.OFFLINE,
  'Not in use': EXTEN_STATUS_ENUM.ONLINE,
  'In use': EXTEN_STATUS_ENUM.BUSY,
  Busy: EXTEN_STATUS_ENUM.BUSY,
  Invalid: EXTEN_STATUS_ENUM.OFFLINE,
  Unavailable: EXTEN_STATUS_ENUM.OFFLINE,
  Ringing: EXTEN_STATUS_ENUM.RINGING,
  'Ring+Inuse': EXTEN_STATUS_ENUM.BUSY_RINGING,
  'On Hold': EXTEN_STATUS_ENUM.ONHOLD,
}

export const astEvent = 'ExtensionStatus'