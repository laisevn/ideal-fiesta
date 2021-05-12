import { IAddAccountModel } from '../../domain/usecases/IAddAccountModel'
import { IAccountModel } from '../../domain/models/IAccountModel'

export interface IAddAccountRepository {
  add: (accountData: IAddAccountModel) => Promise<IAccountModel>
}
