import Router from './router.js'
import controller from './controllers/controller.js'

const router = new Router()

router.get('/api/get', controller.get)
router.post('/api', controller.post)
router.patch('/api', controller.patch)
router.delete('/api', controller.deleteHandler)
router.options('/api', controller.options)

export default router
