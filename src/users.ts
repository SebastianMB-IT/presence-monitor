export default class UsersState {
  extensions: string[][]
  users: string[]

  constructor() {
    this.users = []
    this.extensions = []
  }

  setUsers(users: string[]) {
    this.users = users
  }

  addUser(user: string) {
    this.users.push(user)
  }

  addExtensions(userExts: string[]) {
    this.extensions.push(userExts)
  }

  getExtensions() {
    return this.extensions
  }

  getUsers(): string[] {
    return this.users
  }
}
