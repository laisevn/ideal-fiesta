import { Router } from 'express'
import { adaptRoute } from '../adapters/expressRoutesAdapter'
import { makeSingupController } from '../factories/singupUser'
import { makeLoginController } from '../factories/loginUser'

export default (router: Router): void => {
  router.post('/user', adaptRoute(makeSingupController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
