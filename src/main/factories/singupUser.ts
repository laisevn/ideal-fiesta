import { SingUpController } from '../../controller/singup'
import { DbAddAccount } from '../../data/dbAddAccount'
import { BcryptAdapter } from '../../infra/bcryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/accountMongoRepository'
import { EmailValidatorAdapter } from '../../utils/emailValidatorAdapter'
import { PasswordValidatorAdapter } from '../../utils/passwordValidatorAdapter'

export const makeSingupController = (): SingUpController => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const passwordValidatorAdapter = new PasswordValidatorAdapter()
  return new SingUpController(emailValidatorAdapter, passwordValidatorAdapter, dbAccount)
}
