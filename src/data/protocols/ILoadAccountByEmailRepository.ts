import { IAccountModel } from '../../domain/models/IAccountModel'

export interface ILoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<IAccountModel>
}
