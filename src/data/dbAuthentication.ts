import { IAuthentication } from '../domain/usecases/IAuthentication'
import { IAuthenticationModel } from '../domain/usecases/IAuthenticationModel';
import { IHashCompare } from './protocols/IHashCompare';
import { ILoadAccountByEmailRepository } from './protocols/ILoadAccountByEmailRepository';
import { ITokenGenerator } from './protocols/ITokenGenerator';
import { IUpdateAccessTokenRepository } from './protocols/IUpdateAccessTokenRepository';

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
  private readonly hashCompare: IHashCompare
  private readonly tokenGenerator: ITokenGenerator
  private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository

  constructor
  (
    loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    hashCompare: IHashCompare,
    tokenGenerator: ITokenGenerator,
    updateAccessTokenRepository: IUpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authentication: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (account) {
      const passwordIsValid = await this.hashCompare.compare(authentication.password, account.password)
      if (passwordIsValid) {
        const token = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, token)
        return token
      }
    }
    return null
  }
}
