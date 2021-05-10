import { Router } from 'express'

export default (router: Router): void => {
  router.post('/user', (req, res) => {
    res.json({ ok: 'ok' })
  })
}
