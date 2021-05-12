export class MissingParamsError extends Error { 
  constructor(paramName: string) {
    super(`${paramName} is required`)
    this.message = `${paramName} is required`
  }
}
