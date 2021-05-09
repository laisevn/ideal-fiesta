import { IAccountModel } from '../../domain/models/IAccountModel'
import { IAddAccountModel } from '../../domain/usecases/IAddAccountModel'

export interface IAddAccountRepository {
  add: (accountData: IAddAccountModel) => Promise<IAccountModel>
}
