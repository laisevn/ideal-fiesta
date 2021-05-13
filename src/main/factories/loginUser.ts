import { LoginController } from '../../controller/login'
import { DbAuthentication } from '../../data/dbAuthentication'
import { BcryptAdapter } from '../../infra/bcryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/accountMongoRepository'
import { JwtAdapter } from '../../infra/jwtAdapter'
import { IController } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/emailValidatorAdapter'
import env from '../config/env'

export const makeLoginController = (): IController => {
  const salt = 12
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )
  const emailValidatorAdapter = new EmailValidatorAdapter()
  return new LoginController(emailValidatorAdapter, dbAuthentication)
}
