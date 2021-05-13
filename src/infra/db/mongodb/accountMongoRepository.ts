import { IAddAccountRepository } from '../../../data/protocols/IAddAccountRepository'
import { ILoadAccountByEmailRepository } from '../../../data/protocols/ILoadAccountByEmailRepository'
import { IAccountModel } from '../../../domain/models/IAccountModel'
import { IAddAccountModel } from '../../../domain/usecases/IAddAccountModel'
import { MongoHelper } from './helpers/mongoHelper'

export class AccountMongoRepository implements IAddAccountRepository, ILoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<IAccountModel>
  async add (accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.map(result.ops[0])
  }

  async dByEmail (email: string): Promise<IAccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: id }, { $set: { token: token } })
  }
}
