export interface ConversationTypes {
  id: string
  owner: string
  chDest: string | null
  linkedId: string
  uniqueId: string
  chSource: {
    type: 'source'
    channel: string
    callerNum: string
    startTime: number
    callerName: string
    bridgedNum: string
    bridgedName: string
    inConference: boolean
    channelStatus: 'up' | 'down'
    bridgedChannel: string
  }
  duration: number
  startTime: number
  connected: false
  recording: 'false' | 'true'
  direction: 'out' | 'in'
  inConference: false
  throughQueue: false
  throughTrunk: false
  counterpartNum: string
  counterpartName: string
}

export interface ConversationsTypes {
  [key: string]: ConversationTypes
}

export interface ExtensionTypes {
  ip: string
  cf: string
  mac: string
  cfb: string
  cfu: string
  dnd: boolean
  cfVm: string
  port: string
  name: string
  cfbVm: string
  cfuVm: string
  exten: string
  codecs: string[]
  status: string
  context: string
  chanType: string
  username: string
  sipuseragent: string
  conversations: ConversationsTypes
}

export interface ExtensionsTypes {
  [key: string | number]: ExtensionTypes
}

export interface UserExtensionTypes {
  id: string
  type: string
  secret: string
  username: string
  description: string
}

export interface UserEndpointsTypes {
  email: CommonUserTypes[]
  jabber: CommonUserTypes[]
  extension: UserExtensionTypes[]
  cellphone: CommonUserTypes[]
  voicemail: CommonUserTypes[]
}

export interface CommonUserTypes {
  id: string
  description?: string
}

export interface UserTypes {
  name: string
  username: string
  mainPresence: string
  presence: string
  endpoints: UserEndpointsTypes
  presenceOnBusy: string
  presenceOnUnavailable: string
  recallOnBusy: string
}

export interface UsersTypes {
  [key: string]: UserTypes
}
