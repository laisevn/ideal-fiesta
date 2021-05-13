import { IEncrypter } from '../data/protocols/IEncrypter'
import bcrypt from 'bcrypt'
import { IHashCompare } from '../data/protocols/IHashCompare'

export class BcryptAdapter implements IEncrypter, IHashCompare {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
