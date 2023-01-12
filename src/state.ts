import { ConversationsTypes, ExtensionTypes } from './types'

export default class DaemonState {
  usersExtensions: {
    [key: string]: ExtensionTypes[]
  }
  usersConversations: {
    [key: string]: ConversationsTypes[]
  }
  usersTelephonicStatus: {
    [key: string]: string
  }
  usersMainPresence: {
    [key: string]: string
  }

  constructor() {
    this.usersConversations = {}
    this.usersTelephonicStatus = {}
    this.usersMainPresence = {}
    this.usersExtensions = {}
  }

  addUsersConversations(user: string, conversation: ConversationsTypes) {
    this.usersConversations[user] = [conversation]
  }

  emptyUsersConversations(user: string) {
    this.usersConversations[user] = []
  }

  getUsersConversations() {
    return this.usersConversations
  }

  getUserConversations(user: string) {
    return this.usersConversations[user]
  }

  addUsersTelephonicStatus(user: string, status: string) {
    this.usersTelephonicStatus[user] = status
  }

  getUsersTelephonicStatus() {
    return this.usersTelephonicStatus
  }

  getUserTelephonicStatus(user: string) {
    return this.usersTelephonicStatus[user]
  }

  setUsersMainPresence(user: string, mainPresence: string) {
    this.usersMainPresence[user] = mainPresence
  }

  getUsersMainPresence() {
    return this.usersMainPresence
  }

  getUserMainPresence(user: string) {
    return this.usersMainPresence[user]
  }

  setUsersExtensions(user: string, extensions) {
    this.usersExtensions[user] = []
    this.usersExtensions[user] = extensions
  }

  getUsersExtensions() {
    return this.usersExtensions
  }

  getUserExtensions(user: string) {
    return this.usersExtensions[user]
  }
}
