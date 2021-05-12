export interface IEncrypter {
  encrypt: (value: number) => Promise<number>
}
