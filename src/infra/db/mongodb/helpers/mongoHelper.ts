import { Collection, MongoClient } from 'mongodb'
import { IAccountModel } from '../../../../domain/models/IAccountModel'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map (collection: any): IAccountModel {
    const { _id, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { id: _id })
  }
}
