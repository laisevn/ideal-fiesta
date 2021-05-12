export class ServerError extends Error {
  constructor () {
    super('Internal server error')
    this.name = 'ServerError'
    this.message = 'Internal server error'
  }
}
