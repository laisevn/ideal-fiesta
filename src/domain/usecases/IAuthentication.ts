import { IAuthenticationModel } from './IAuthenticationModel'

export interface IAuthentication {
  auth: (authentication: IAuthenticationModel) => Promise<string>
}
