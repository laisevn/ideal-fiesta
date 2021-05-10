export const PasswordValidatorHelper = {
  minLenght (minLenght: number, password: string): any {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const passwordValidator = require('password-validator')
    // eslint-disable-next-line new-cap
    const schema = new passwordValidator()
    schema.is().min(minLenght)
    return schema.validate(password)
  }
}
