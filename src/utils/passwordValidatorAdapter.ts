import { IPasswordValidator } from '../presentation/protocols'
import { PasswordValidatorHelper } from './helpers/passwordValidatorHelper'

export class PasswordValidatorAdapter implements IPasswordValidator {
  isValid(password: string): boolean {
    return PasswordValidatorHelper.minLenght(6, password)
  }
}
