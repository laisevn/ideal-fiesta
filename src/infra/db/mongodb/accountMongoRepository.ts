import { IAddAccountRepository } from '../../../data/protocols/IAddAccountRepository'
import { IAccountModel } from '../../../domain/models/IAccountModel'
import { IAddAccountModel } from '../../../domain/usecases/IAddAccountModel'
import { MongoHelper } from './helpers/mongoHelper'

export class AccountMongoRepository implements IAddAccountRepository {
  async add (accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.map(result.ops[0])
  }
}
