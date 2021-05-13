export class UnauthorizedError extends Error {
  constructor () {
    super('Token não encontrado')
    this.name = 'UnauthorizedError'
    this.message = 'Token não encontrado'
  }
}
