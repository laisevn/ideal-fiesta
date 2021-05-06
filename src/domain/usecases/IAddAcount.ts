import { IAccountModel } from '../models/IAccountModel'
import { IAddAccountModel } from './IAddAccountModel'

export interface IAddAccount {
  add: (account: IAddAccountModel) => Promise<IAccountModel>
}
