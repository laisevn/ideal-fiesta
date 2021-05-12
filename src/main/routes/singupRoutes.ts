import { Router } from 'express'
import { adaptRoute } from '../adapters/expressRoutesAdapter'
import { makeSingupController } from '../factories/singupUser'

export default (router: Router): void => {
  router.post('/user', adaptRoute(makeSingupController()))
}
