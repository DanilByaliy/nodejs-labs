import Router from './router.js'
import controller from './controllers/controller.js'

const router = new Router()

router.get('/api/get', controller.get)

export default router
