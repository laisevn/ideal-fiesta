export class InvalidPasswordError extends Error {
  constructor(paramName: string) {
    super(`${paramName} lenght must be 6 characters long`)
    this.name = 'InvalidPasswordError'
  }
}
