import { resolve } from 'node:path'
import { IAccountModel } from '../domain/models/IAccountModel'
import { IAddAccountModel } from '../domain/usecases/IAddAccountModel'
import { IAddAccount } from '../domain/usecases/IAddAcount'
import { IAddAccountRepository } from './protocols/IAddAccountRepository'
import { IEncrypter } from './protocols/IEncrypter'

export class DbAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter
  private readonly addAccountRepository: IAddAccountRepository

  constructor (encrypter: IEncrypter, addAccountRepository: IAddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: IAddAccountModel): Promise<IAccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { pasword: hashedPassword }))
    return account
  }
}
